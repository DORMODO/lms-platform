package com.lms.auth_service.exception;

import org.springframework.http.HttpStatus;

public class InvalidTokenException extends AuthException {
    public InvalidTokenException() {
        super("AUTH_004", "Invalid token", HttpStatus.UNAUTHORIZED);
    }
}