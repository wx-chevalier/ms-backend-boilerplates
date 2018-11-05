package com.chriniko.example.akkaspringexample.actor;

import akka.actor.AbstractLoggingActor;
import akka.japi.pf.ReceiveBuilder;
import com.chriniko.example.akkaspringexample.domain.CrimeRecord;
import com.chriniko.example.akkaspringexample.message.CrimeRecordsProcessedAck;
import com.chriniko.example.akkaspringexample.message.CrimeRecordsToProcess;
import com.chriniko.example.akkaspringexample.repository.CrimeRecordsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public class CrimeRecordsProcessor extends AbstractLoggingActor {

    @Autowired
    private CrimeRecordsRepository crimeRecordsRepository;

    @Override
    public Receive createReceive() {
        return ReceiveBuilder
                .create()
                .match(CrimeRecordsToProcess.class, msg -> {

                    List<CrimeRecord> crimeRecords = msg.getCrimeRecords();
                    crimeRecordsRepository.save(crimeRecords);

                    log().info("I just saved " + crimeRecords.size() + " crime records!");

                    getSender().tell(new CrimeRecordsProcessedAck(crimeRecords.size()), getSelf());

                })
                .build();
    }
}
