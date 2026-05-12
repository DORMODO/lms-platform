package com.lms.auth_service.exception;

import org.springframework.http.HttpStatus;

public class InvalidCredentialsException extends AuthException {
    public InvalidCredentialsException() {
        super("AUTH_001", "Invalid credentials", HttpStatus.UNAUTHORIZED);
    }
}