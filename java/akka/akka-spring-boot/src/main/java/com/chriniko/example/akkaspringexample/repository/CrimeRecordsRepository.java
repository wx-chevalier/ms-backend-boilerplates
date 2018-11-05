package com.chriniko.example.akkaspringexample.repository;

import com.chriniko.example.akkaspringexample.domain.CrimeRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

@Repository
public class CrimeRecordsRepository {

    private static final String INSERT_QUERY = "INSERT INTO akka_spring_example.crimes_tbl(cdatetime, address, district, beat, grid, crimedescr, ucr_ncic_code, latitude, longitude) VALUES (?,?,?,?,?,?,?,?, ?)";

    private static final boolean CLEAR_CRIME_RECORDS_TBL = true;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostConstruct
    void init() {
        if (CLEAR_CRIME_RECORDS_TBL)
            jdbcTemplate.execute("DELETE FROM akka_spring_example.crimes_tbl");
    }

    public void save(List<CrimeRecord> crimeRecords) {

        jdbcTemplate.batchUpdate(INSERT_QUERY, new BatchPreparedStatementSetter() {

            @Override
            public void setValues(PreparedStatement preparedStatement, int i) throws SQLException {

                CrimeRecord crimeRecord = crimeRecords.get(i);

                preparedStatement.setString(1, crimeRecord.getCDateTime());
                preparedStatement.setString(2, crimeRecord.getAddress());
                preparedStatement.setString(3, crimeRecord.getDistrict());
                preparedStatement.setString(4, crimeRecord.getBeat());
                preparedStatement.setString(5, crimeRecord.getGrid());
                preparedStatement.setString(6, crimeRecord.getCrimeDescr());
                preparedStatement.setString(7, crimeRecord.getUcrNcicCode());
                preparedStatement.setString(8, crimeRecord.getLatitude());
                preparedStatement.setString(9, crimeRecord.getLongtitude());

            }

            @Override
            public int getBatchSize() {
                return crimeRecords.size();
            }
        });

    }

}
