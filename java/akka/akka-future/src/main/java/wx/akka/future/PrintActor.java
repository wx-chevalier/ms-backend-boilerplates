package wx.akka.future;

import akka.actor.UntypedActor;
import akka.event.Logging;
import akka.event.LoggingAdapter;

/**
 * Created by liubenlong on 2017/1/12.
 */
public class PrintActor extends UntypedActor {

    private final LoggingAdapter log = Logging.getLogger(getContext().system(), this);

    @Override
    public void onReceive(Object o) throws Throwable {
        log.info("akka.future.wx.akka.future.PrintActor.onReceive:" + o);
        if (o instanceof Integer) {
            log.info("print:" + o);
        } else {
            unhandled(o);
        }
    }

}
