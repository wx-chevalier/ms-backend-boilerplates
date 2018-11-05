package com.chriniko.example.akkaspringexample;

import akka.actor.ActorRef;
import akka.actor.ActorSystem;
import com.chriniko.example.akkaspringexample.actor.GreetingActor;
import com.chriniko.example.akkaspringexample.actor.GreetingResultLoggerActor;
import com.chriniko.example.akkaspringexample.integration.akka.SpringAkkaExtension;
import com.chriniko.example.akkaspringexample.message.Greet;
import com.chriniko.example.akkaspringexample.poller.CrimeRecordsFetcher;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import scala.concurrent.Await;
import scala.concurrent.duration.Duration;

import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

@SpringBootApplication
public class AkkaSpringExampleApplication {

    public static void main(String[] args) {

        // --- initialization action ---
        System.out.println("### Setting up Actor System ###");
        ConfigurableApplicationContext context = SpringApplication.run(AkkaSpringExampleApplication.class, args);
        ActorSystem actorSystem = context.getBean(ActorSystem.class);
        SpringAkkaExtension springAkkaExtension = context.getBean(SpringAkkaExtension.class);
        System.out.println("### Actor System is ready for work ###\n\n");


        // --- examples sections ---
        //runFirstExample(actorSystem, springAkkaExtension); // Note: comment-uncomment.
        runSecondExample(context); // Note: comment-uncomment.

        // --- shutting down section ---
        System.out.println("### Shutting down Actor System ###");
        try {
            TimeUnit.SECONDS.sleep(30);
            Await.ready(actorSystem.terminate(), Duration.create(30, TimeUnit.SECONDS));
        } catch (InterruptedException | TimeoutException e) {
            e.printStackTrace(System.err);
        }

    }

    private static void runFirstExample(ActorSystem actorSystem, SpringAkkaExtension springAkkaExtension) {

        ActorRef greetingActorRef
                = actorSystem.actorOf(springAkkaExtension.props(SpringAkkaExtension.classNameToSpringName(GreetingActor.class)));

        ActorRef greetingResultLoggerActorRef
                = actorSystem.actorOf(springAkkaExtension.props(SpringAkkaExtension.classNameToSpringName(GreetingResultLoggerActor.class)));

        greetingActorRef.tell(new Greet("chriniko", greetingResultLoggerActorRef), ActorRef.noSender());
    }

    private static void runSecondExample(ConfigurableApplicationContext context) {
        CrimeRecordsFetcher crimeRecordsFetcher = context.getBean(CrimeRecordsFetcher.class);
        crimeRecordsFetcher.process();
    }
}
