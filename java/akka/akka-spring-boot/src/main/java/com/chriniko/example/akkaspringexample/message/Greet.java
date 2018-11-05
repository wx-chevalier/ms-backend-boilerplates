package com.chriniko.example.akkaspringexample.message;

import akka.actor.ActorRef;

public class Greet {

    private final String name;
    private final ActorRef sendTo;

    public Greet(String name, ActorRef sendTo) {
        this.name = name;
        this.sendTo = sendTo;
    }

    public String getName() {
        return name;
    }

    public ActorRef getSendTo() {
        return sendTo;
    }

    @Override
    public String toString() {
        return "Greet{" +
                "name='" + name + '\'' +
                ", sendTo=" + sendTo.path().name() +
                '}';
    }
}
