FROM amazoncorretto:11-alpine-jdk

COPY target/shopplyn-backend-0.0.1-SNAPSHOT.jar  /shopplyn-backend.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/shopplyn-backend.jar"]