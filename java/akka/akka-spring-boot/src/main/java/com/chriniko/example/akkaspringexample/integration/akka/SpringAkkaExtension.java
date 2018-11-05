package com.chriniko.example.akkaspringexample.integration.akka;

import akka.actor.Extension;
import akka.actor.Props;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

@Component
public class SpringAkkaExtension implements Extension {

    private ApplicationContext applicationContext;

    public void initialize(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }

    public Props props(String actorBeanName) {
        return Props.create(SpringActorProducer.class, applicationContext, actorBeanName);
    }

    public static String classNameToSpringName(Class<?> clazz) {

        String simpleName = clazz.getSimpleName();

        return simpleName.substring(0, 1).toLowerCase() + simpleName.substring(1);
    }
}
