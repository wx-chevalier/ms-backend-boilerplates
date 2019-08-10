```bash

# Compile
$ mvn clean compile

# Test
$ mvn clean test

# Run
$ mvn clean compile && mvn -q exec:java -Dexec.mainClass=com.example.app.AppDriver -Djava.util.logging.config.file=src/main/resources/logging.properties

# Package
$ mvn assembly:single

# Generate javadoc
$ mvn javadoc:javadoc

# Generate javadoc without Maven
$ javaDoc -version -author -private -classpath src -d target/javadoc src/main/java/com/example/**/*.java

# FindBugs
$ mvn findbugs:check
$ mvn findbugs:gui

# Checkstyle
$ mvn checkstyle:check

# Generate Reports
$ mvn clean compile site

# Generated from
$ mvn archetype:generate -DinteractiveMode=false \
                         -DarchetypeArtifactId=maven-archetype-quickstart \
                         -DgroupId=com.example -DartifactId=MyApp \
                         -Dversion='01' \
                         -Dpackage=com.example
```
