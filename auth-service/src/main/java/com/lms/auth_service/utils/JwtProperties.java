package com.lms.auth_service.utils;

import io.jsonwebtoken.security.Keys;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.annotation.Validated;

import java.security.Key;

@Configuration
@ConfigurationProperties(prefix = "jwt")
@Validated
@Data
public class JwtProperties {
    @NotBlank
    private String secret;

    @NotNull
    @Positive
    private Long expiration;

    @NotNull
    @Positive
    private Long refreshExpiration;

    public Key signingKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }
}
