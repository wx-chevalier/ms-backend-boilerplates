package wx.akka.future;

import akka.actor.ActorRef;
import akka.actor.ActorSystem;
import akka.actor.PoisonPill;
import akka.actor.Props;
import akka.pattern.Patterns;
import com.typesafe.config.ConfigFactory;
import scala.concurrent.Await;
import scala.concurrent.Future;
import scala.concurrent.duration.Duration;

import java.util.concurrent.TimeUnit;

public class AkkaFutureApp {

    public static void main(String[] args) throws Exception {
        ActorSystem system = ActorSystem.create("strategy", ConfigFactory.load("akka.config"));
        ActorRef printActor = system.actorOf(Props.create(PrintActor.class), "PrintActor");
        ActorRef workerActor = system.actorOf(Props.create(WorkerActor.class), "WorkerActor");

        // 等待 Future 返回
        Future<Object> future = Patterns.ask(workerActor, 5, 1000);
        int result = (int) Await.result(future, Duration.create(3, TimeUnit.SECONDS));
        System.out.println("result:" + result);

        // 不等待返回值，直接重定向到其他 actor，有返回值来的时候将会重定向到 printActor
        Future<Object> future1 = Patterns.ask(workerActor, 8, 1000);
        Patterns.pipe(future1, system.dispatcher()).to(printActor);


        workerActor.tell(PoisonPill.getInstance(), ActorRef.noSender());
    }
}