package com.example;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import org.junit.After;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;

/**
 * Unit test for MyClass
 */
public class MyClassTest {

    @Before
    public void setup() {
    }

    @After
    public void teardown() {
    }

    @Test
    public void testLib() {
        assertTrue(true);
    }

    @Ignore("Not yet implemented.")
    @Test
    public void verifyAll() {
        fail("Not yet implemented.");
    }

    /**
     * Runs the test suite.
     *
     * @param args (unused)
     */
    public static void main(final String[] args) {
        junit.textui.TestRunner.run(new junit.framework.JUnit4TestAdapter(MyClassTest.class));
    }

}
