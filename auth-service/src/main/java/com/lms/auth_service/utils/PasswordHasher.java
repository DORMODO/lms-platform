package com.lms.auth_service.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

@Component
public class PasswordHasher {

    private final BCryptPasswordEncoder encoder;
    private final String pepper;

    public PasswordHasher(
            @Value("${app.password.pepper:super-secret-pepper-2026}") String pepper) {
        this.encoder = new BCryptPasswordEncoder();
        this.pepper = pepper;
    }

    public String hashPassword(String rawPassword) {
        return encoder.encode(rawPassword + pepper);
    }

    public boolean verifyPassword(String rawPassword, String storedHash) {
        return encoder.matches(rawPassword + pepper, storedHash);
    }
}
