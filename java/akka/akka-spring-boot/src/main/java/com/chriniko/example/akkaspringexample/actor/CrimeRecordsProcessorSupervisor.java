package com.chriniko.example.akkaspringexample.actor;

import akka.actor.AbstractLoggingActor;
import akka.actor.ActorRef;
import akka.actor.ActorSystem;
import akka.actor.Terminated;
import akka.japi.pf.ReceiveBuilder;
import akka.routing.ActorRefRoutee;
import akka.routing.Routee;
import akka.routing.Router;
import akka.routing.SmallestMailboxRoutingLogic;
import com.chriniko.example.akkaspringexample.domain.CrimeRecord;
import com.chriniko.example.akkaspringexample.integration.akka.SpringAkkaExtension;
import com.chriniko.example.akkaspringexample.message.CheckAllAcks;
import com.chriniko.example.akkaspringexample.message.CrimeRecordsProcessedAck;
import com.chriniko.example.akkaspringexample.message.CrimeRecordsToProcess;
import com.chriniko.example.akkaspringexample.message.CrimeRecordsToProcessBatch;
import com.chriniko.example.akkaspringexample.file.FileLinesCounter;
import com.chriniko.example.akkaspringexample.partition.ListPartitioner;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import scala.concurrent.duration.Duration;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Component
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public class CrimeRecordsProcessorSupervisor extends AbstractLoggingActor {

    private static final String CRIME_RECORDS_FILE = "files/SacramentocrimeJanuary2006.csv";

    @Autowired
    private SpringAkkaExtension springAkkaExtension;

    @Autowired
    private ActorSystem actorSystem;

    @Autowired
    private ListPartitioner listPartitioner;

    @Autowired
    private FileLinesCounter fileLinesCounter;

    @Value("${crime.records.processor.supervisor.children}")
    private int childrenToCreate;

    private Router router;

    private List<CrimeRecordsProcessedAck> processedAcksAccumulator;

    @Override
    public void preStart() {

        log().info("Starting up...");

        // --- basic initializations ---
        processedAcksAccumulator = new ArrayList<>();

        // --- initialize scheduler events ---
        getContext().system().scheduler().scheduleOnce(
                Duration.apply(20, TimeUnit.SECONDS) /* Note: this is actually the timeout */,
                getSelf(),
                new CheckAllAcks(),
                getContext().system().dispatcher(),
                getSelf()
        );

        // --- initialize router ---
        final List<Routee> routees = new ArrayList<>(childrenToCreate);

        for (int i = 0; i < childrenToCreate; i++) {

            ActorRef crimeRecordsProcessorChild =
                    actorSystem.actorOf(springAkkaExtension
                            .props(SpringAkkaExtension.classNameToSpringName(CrimeRecordsProcessor.class))
                            .withDispatcher("akka.blocking-io-dispatcher"));

            getContext().watch(crimeRecordsProcessorChild);
            routees.add(new ActorRefRoutee(crimeRecordsProcessorChild));
        }
        router = new Router(new SmallestMailboxRoutingLogic(), routees);
    }

    @Override
    public void postStop() {
        log().info("Shutting down...");
    }

    @Override
    public Receive createReceive() {
        return ReceiveBuilder
                .create()
                .match(CrimeRecordsToProcessBatch.class, msg -> {

                    final List<CrimeRecord> crimeRecords = msg.getCrimeRecords();

                    final List<List<CrimeRecord>> splittedCrimeRecordsForChildren
                            = listPartitioner.partition(crimeRecords, childrenToCreate, true);

                    for (List<CrimeRecord> splittedCrimeRecordsForChild : splittedCrimeRecordsForChildren) {

                        log().info("Routing work to child [records = " + splittedCrimeRecordsForChild.size() + "]");

                        router.route(new CrimeRecordsToProcess(splittedCrimeRecordsForChild), context().self());
                    }

                })
                .match(CrimeRecordsProcessedAck.class, msg -> {

                    processedAcksAccumulator.add(msg);

                })
                .match(CheckAllAcks.class, msg -> {


                    final long totalProcessedRecords = processedAcksAccumulator
                            .stream()
                            .map(CrimeRecordsProcessedAck::getProcessedCount)
                            .reduce(0L, (acc, elem) -> acc + elem);

                    final long filesLinesCount
                            = fileLinesCounter.count(
                            fileLinesCounter.getFile(CRIME_RECORDS_FILE),
                            true);

                    if (totalProcessedRecords != filesLinesCount) {
                        log().error("=======MIGRATION FAILED========");
                    } else {
                        log().info("=======MIGRATION SUCCESS========");
                    }

                })
                .match(Terminated.class, msg -> {

                    ActorRef terminatedActor = msg.actor();

                    router = router.removeRoutee(terminatedActor);

                    ActorRef crimeRecordsProcessorChild =
                            actorSystem.actorOf(springAkkaExtension
                                    .props(SpringAkkaExtension.classNameToSpringName(CrimeRecordsProcessor.class))
                                    .withDispatcher("akka.blocking-io-dispatcher"));

                    getContext().watch(crimeRecordsProcessorChild);

                    router.addRoutee(new ActorRefRoutee(crimeRecordsProcessorChild));

                })
                .build();
    }
}
