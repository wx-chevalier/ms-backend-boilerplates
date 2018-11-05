package com.chriniko.example.akkaspringexample.actor;

import akka.actor.AbstractLoggingActor;
import akka.japi.pf.ReceiveBuilder;
import com.chriniko.example.akkaspringexample.message.Greet;
import com.chriniko.example.akkaspringexample.message.GreetResult;
import com.chriniko.example.akkaspringexample.service.GreetingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public class GreetingActor extends AbstractLoggingActor {

    private final GreetingService greetingService;

    @Autowired
    public GreetingActor(GreetingService greetingService) {
        this.greetingService = greetingService;
    }

    @Override
    public Receive createReceive() {

        return ReceiveBuilder.create()
                .match(Greet.class, greetMsg -> {

                    log().info("Received message: " + greetMsg);
                    String name = greetMsg.getName();
                    String result = greetingService.greet(name);

                    greetMsg.getSendTo().tell(new GreetResult(result), context().self());

                })
                .matchAny(msg -> {
                    log().warning("Unhandled message received: " + msg);
                    unhandled(msg);
                })
                .build();
    }
}
