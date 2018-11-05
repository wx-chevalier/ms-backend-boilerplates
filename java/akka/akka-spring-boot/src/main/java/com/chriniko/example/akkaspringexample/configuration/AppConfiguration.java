package com.chriniko.example.akkaspringexample.configuration;

import akka.actor.ActorSystem;
import com.chriniko.example.akkaspringexample.integration.akka.SpringAkkaExtension;
import com.typesafe.config.Config;
import com.typesafe.config.ConfigFactory;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;

@Configuration
@ComponentScan(
        basePackages = {
                "com.chriniko.example.akkaspringexample"
        }
)
public class AppConfiguration {

    @Autowired
    private ApplicationContext applicationContext;

    @Autowired
    private SpringAkkaExtension springAkkaExtension;

    @Bean
    public JdbcTemplate jdbcTemplate() {
        return new JdbcTemplate(dataSource());
    }

    @Bean
    public DataSource dataSource() {
        HikariDataSource hikariDataSource = new HikariDataSource();

        hikariDataSource.setJdbcUrl("jdbc:mysql://localhost:3306/akka_spring_example?useSSL=false");
        hikariDataSource.setUsername("root");
        hikariDataSource.setPassword("nikos");
        hikariDataSource.setDriverClassName("com.mysql.jdbc.Driver");

        return hikariDataSource;
    }


    @Bean
    public ActorSystem actorSystem() {

        ActorSystem system = ActorSystem.create("akka-crimes-processing-system", akkaConfiguration());

        springAkkaExtension.initialize(applicationContext);

        return system;
    }

    @Bean
    public Config akkaConfiguration() {
        return ConfigFactory.load();
    }
}
