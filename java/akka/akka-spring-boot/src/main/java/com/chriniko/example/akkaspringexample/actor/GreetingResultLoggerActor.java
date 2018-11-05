package com.chriniko.example.akkaspringexample.actor;

import akka.actor.AbstractLoggingActor;
import akka.japi.pf.ReceiveBuilder;
import com.chriniko.example.akkaspringexample.message.GreetResult;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public class GreetingResultLoggerActor extends AbstractLoggingActor {

    @Override
    public Receive createReceive() {
        return ReceiveBuilder
                .create()
                .match(GreetResult.class, msg -> {
                    log().info("Received message: " + msg.getResult());
                })
                .matchAny(msg -> {
                    log().warning("Unhandled message received: " + msg);
                    unhandled(msg);
                })
                .build();
    }
}
