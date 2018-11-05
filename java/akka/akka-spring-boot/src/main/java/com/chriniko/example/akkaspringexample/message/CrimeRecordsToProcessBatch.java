package com.chriniko.example.akkaspringexample.message;

import com.chriniko.example.akkaspringexample.domain.CrimeRecord;

import java.util.Collections;
import java.util.List;

public class CrimeRecordsToProcessBatch {

    private final List<CrimeRecord> crimeRecords;

    public CrimeRecordsToProcessBatch(List<CrimeRecord> crimeRecords) {
        this.crimeRecords = Collections.unmodifiableList(crimeRecords);
    }

    public List<CrimeRecord> getCrimeRecords() {
        return crimeRecords;
    }
}
