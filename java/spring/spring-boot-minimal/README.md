# spring-boot-minimal

# Development

## Maven

```bash
$ mvn spring-boot:run
```

## Gradle

```bash
# Start incremental build
$ ./gradlew build -t
$ ./gradlew build -t -x test

# Start dev
$ gradle bootRun
```

# Deploy

## Single Jar

```bash
$ ./mvnw package && java -jar target/spring-boot-minimal-0.0.1.jar
$ ./gradlew build && java -jar build/libs/spring-boot-minimal-0.0.1.jar
```

## Docker

```bash
$ ./deploy/deploy.sh

# Debugging
$ docker run -e "JAVA_OPTS=-agentlib:jdwp=transport=dt_socket,address=5005,server=y,suspend=n" -p 8080:8080 -p 5005:5005 -t spring-boot-minimal

# Using Spring Profiles
$ docker run -e "SPRING_PROFILES_ACTIVE=dev" -p 8080:8080 -t spring-boot-minimal
```