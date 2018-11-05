package com.chriniko.example.akkaspringexample.partition;

import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Test;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class ListPartitionerTest {

    private static ListPartitioner listPartitioner;

    @BeforeClass
    public static void setUp() {
        listPartitioner = new ListPartitioner();
    }

    @Test
    public void partition_first_case() {

        // --- GIVEN ---
        List<Integer> resultToPartition = IntStream.rangeClosed(1, 494).boxed().collect(Collectors.toList());


        // --- WHEN ---
        List<List<Integer>> partitionedResult = listPartitioner.partition(resultToPartition, 5, true);


        // --- THEN ---
        Assert.assertEquals(partitionedResult.size(), 5);

        List<Integer> toCompare = Arrays.asList(99, 99, 99, 99, 98);
        int idx = 0;

        for (List<Integer> partitionedWork : partitionedResult) {
            Assert.assertEquals(partitionedWork.size(), toCompare.get(idx++).intValue());
        }


    }

    @Test
    public void partition_second_case() {
        // --- GIVEN ---
        List<Integer> resultToPartition = IntStream.rangeClosed(1, 494).boxed().collect(Collectors.toList());


        // --- WHEN ---
        List<List<Integer>> partitionedResult = listPartitioner.partition(resultToPartition, 5, false);


        // --- THEN ---
        Assert.assertEquals(partitionedResult.size(), 5);

        List<Integer> toCompare = Arrays.asList(98, 98, 98, 98, 102);
        int idx = 0;

        for (List<Integer> partitionedWork : partitionedResult) {
            Assert.assertEquals(partitionedWork.size(), toCompare.get(idx++).intValue());
        }
    }

    @Test
    public void partition_thid_case() {
        // --- GIVEN ---
        List<Integer> resultToPartition = IntStream.rangeClosed(1, 500).boxed().collect(Collectors.toList());


        // --- WHEN ---
        List<List<Integer>> partitionedResult = listPartitioner.partition(resultToPartition, 5, false);


        // --- THEN ---
        Assert.assertEquals(partitionedResult.size(), 5);

        List<Integer> toCompare = Arrays.asList(100, 100, 100, 100, 100);
        int idx = 0;

        for (List<Integer> partitionedWork : partitionedResult) {
            Assert.assertEquals(partitionedWork.size(), toCompare.get(idx++).intValue());
        }
    }

    @Test
    public void partition_fourth_case() {
        // --- GIVEN ---
        List<Integer> resultToPartition = IntStream.rangeClosed(1, 500).boxed().collect(Collectors.toList());


        // --- WHEN ---
        List<List<Integer>> partitionedResult = listPartitioner.partition(resultToPartition, 5, true);


        // --- THEN ---
        Assert.assertEquals(partitionedResult.size(), 5);

        List<Integer> toCompare = Arrays.asList(100, 100, 100, 100, 100);
        int idx = 0;

        for (List<Integer> partitionedWork : partitionedResult) {
            Assert.assertEquals(partitionedWork.size(), toCompare.get(idx++).intValue());
        }
    }

}