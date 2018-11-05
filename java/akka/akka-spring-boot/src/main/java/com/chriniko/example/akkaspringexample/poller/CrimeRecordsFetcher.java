package com.chriniko.example.akkaspringexample.poller;

import akka.actor.ActorRef;
import akka.actor.ActorSystem;
import com.chriniko.example.akkaspringexample.actor.CrimeRecordsProcessorSupervisor;
import com.chriniko.example.akkaspringexample.domain.CrimeRecord;
import com.chriniko.example.akkaspringexample.integration.akka.SpringAkkaExtension;
import com.chriniko.example.akkaspringexample.message.CrimeRecordsToProcessBatch;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.io.BufferedReader;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;

@Component
public class CrimeRecordsFetcher {

    private static final String CRIME_RECORDS_FILE = "files/SacramentocrimeJanuary2006.csv";

    @Autowired
    private SpringAkkaExtension springAkkaExtension;

    @Autowired
    private ActorSystem actorSystem;

    @Value("${crime.records.fetcher.batch.size}")
    private int crimeRecordsBatchSize;

    private BufferedReader bufferedReader;

    private ActorRef crimeRecordProcessorSupervisor;

    @PostConstruct
    void init() {
        //initialize supervisor actor
        crimeRecordProcessorSupervisor =
                actorSystem.actorOf(springAkkaExtension.props(
                        SpringAkkaExtension.classNameToSpringName(CrimeRecordsProcessorSupervisor.class)));

        //initialize file
        try {
            Path path = Paths.get(getUri());

            bufferedReader = Files.newBufferedReader(path);

            final int linesToSkip = 1;
            int skipCounter = 0;
            while (skipCounter++ < linesToSkip) {
                bufferedReader.readLine(); // Note: toss line.
            }

        } catch (IOException e) {
            e.printStackTrace(System.err);
            throw new RuntimeException(e);
        }
    }

    @PreDestroy
    void clear() {
        if (bufferedReader != null) {
            try {
                bufferedReader.close();
            } catch (IOException e) {
                e.printStackTrace(System.err);
                throw new RuntimeException(e);
            }
        }
    }

    public void process() {
        System.out.println("CrimeRecordsPoller#process --- executing [time = " + Instant.now() + "]");

        String readedLine;
        int recordsCounter = 0;
        List<CrimeRecord> crimeRecords = new ArrayList<>();

        try {

            while ((readedLine = bufferedReader.readLine()) != null) {

                CrimeRecord crimeRecord = getCrimeRecord(readedLine);

                crimeRecords.add(crimeRecord);

                if (++recordsCounter == crimeRecordsBatchSize) {
                    // send message to supervisor
                    crimeRecordProcessorSupervisor.tell(new CrimeRecordsToProcessBatch(crimeRecords), ActorRef.noSender());

                    // do the necessary re-initializations
                    recordsCounter = 0;
                    crimeRecords = new ArrayList<>();
                }

            }

            if (!crimeRecords.isEmpty()) { // Note: handle the remained records.
                // send message to supervisor
                crimeRecordProcessorSupervisor.tell(new CrimeRecordsToProcessBatch(crimeRecords), ActorRef.noSender());
            }

        } catch (IOException e) {
            e.printStackTrace(System.err);
            throw new RuntimeException(e);
        }
    }

    private CrimeRecord getCrimeRecord(String readedLine) {
        final String[] splittedData = readedLine.split(",");

        return CrimeRecord
                .builder()
                .cDateTime(splittedData[0])
                .address(splittedData[1])
                .district(splittedData[2])
                .beat(splittedData[3])
                .grid(splittedData[4])
                .crimeDescr(splittedData[5])
                .ucrNcicCode(splittedData[6])
                .latitude(splittedData[7])
                .longtitude(splittedData[8])
                .build();
    }

    private URI getUri() {
        URL resource = this.getClass().getClassLoader().getResource(CRIME_RECORDS_FILE);

        return Optional
                .ofNullable(resource)
                .map(toUri())
                .orElseThrow(IllegalStateException::new);

    }

    private Function<URL, URI> toUri() {
        return r -> {
            try {
                return r.toURI();
            } catch (URISyntaxException e) {
                throw new RuntimeException(e);
            }
        };
    }

}
