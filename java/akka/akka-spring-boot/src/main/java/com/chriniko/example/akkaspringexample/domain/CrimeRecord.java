package com.chriniko.example.akkaspringexample.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@AllArgsConstructor
@Builder
@ToString
public class CrimeRecord {

    private final String cDateTime;
    private final String address;
    private final String district;
    private final String beat;
    private final String grid;
    private final String crimeDescr;
    private final String ucrNcicCode;
    private final String latitude;
    private final String longtitude;


}
