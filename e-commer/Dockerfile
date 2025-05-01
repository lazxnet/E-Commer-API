FROM amazoncorretto:11-alpine-jdk

COPY target/e-commer-0.0.1-SNAPSHOT.jar  /e-commer-api-v1.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/e-commer-api-v1.jar"]