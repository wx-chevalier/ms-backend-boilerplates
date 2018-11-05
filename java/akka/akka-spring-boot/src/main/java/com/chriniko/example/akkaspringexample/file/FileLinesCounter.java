package com.chriniko.example.akkaspringexample.file;

import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@Component
public class FileLinesCounter {

    public long count(String filename, boolean hasHeaders) {

        try {
            long count = Files.lines(Paths.get(filename)).count();
            return hasHeaders ? count - 1 : count;
        } catch (IOException e) {
            e.printStackTrace(System.err);
            throw new RuntimeException(e);
        }

    }

    public String getFile(String resourcePath) {
        return this.getClass()
                .getClassLoader()
                .getResource(resourcePath)
                .toString()
                .replace("file:", "");
    }


}
