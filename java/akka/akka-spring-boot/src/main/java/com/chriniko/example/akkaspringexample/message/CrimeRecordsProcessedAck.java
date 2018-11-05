package com.chriniko.example.akkaspringexample.message;

public class CrimeRecordsProcessedAck {

    private final long processedCount;

    public CrimeRecordsProcessedAck(long processedCount) {
        this.processedCount = processedCount;
    }

    public long getProcessedCount() {
        return processedCount;
    }
}
