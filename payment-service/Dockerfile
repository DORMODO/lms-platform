# ===== BUILD STAGE =====
FROM maven:3.9.9-amazoncorretto-21 AS build

WORKDIR /app

COPY . .

RUN mvn clean package -DskipTests

# ===== RUNTIME STAGE =====
FROM amazoncorretto:21

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8084

ENTRYPOINT ["java",
  "-Xms256m",
  "-Xmx512m",
  "-XX:+UseContainerSupport",
  "-jar",
  "app.jar"]