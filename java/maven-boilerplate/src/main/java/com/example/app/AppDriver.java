package com.example.app;

import com.example.lib.MyClass;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * App driver.
 *
 * @author Myself
 */
public final class AppDriver {

    /** The logger for this class. */
    private static final Logger logger = LoggerFactory.getLogger(AppDriver.class);

    /**
     * Private Constructor.
     */
    private AppDriver() {
    }

    /**
     * Main method.
     *
     * @param args Command line arguments
     */
    public static void main(final String[] args) {
        logger.info("hello info");

        MyClass klass = new MyClass();
    }
}
