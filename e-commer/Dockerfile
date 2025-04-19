# Stage 1: Build
FROM maven:3.8.6-jdk-11 as builder

WORKDIR /app
COPY . .

# Solución clave: Usar Maven directamente en lugar del wrapper
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:11-jre

WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

# Configuraciones de seguridad
RUN addgroup --system spring && adduser --system --ingroup spring spring
USER spring

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]