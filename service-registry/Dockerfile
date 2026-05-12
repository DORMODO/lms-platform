FROM maven:3.9.9-amazoncorretto-21
WORKDIR /app
COPY target/app.jar app.jar
EXPOSE 8761
ENTRYPOINT ["java", "-Xmx96m", "-jar", "/app/app.jar"]
