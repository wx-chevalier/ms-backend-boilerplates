package wx.akka.future;

import akka.actor.*;
import akka.event.Logging;
import akka.event.LoggingAdapter;

public class WorkerActor extends UntypedActor {

    private final LoggingAdapter log = Logging.getLogger(getContext().system(), this);

    @Override
    public void onReceive(Object o) throws Throwable {
        log.info("akka.future.wx.akka.future.WorkerActor.onReceive:" + o);

        if (o instanceof Integer) {
            Thread.sleep(1000);
            int i = Integer.parseInt(o.toString());
            getSender().tell(i * i, getSelf());
        } else {
            unhandled(o);
        }
    }
}