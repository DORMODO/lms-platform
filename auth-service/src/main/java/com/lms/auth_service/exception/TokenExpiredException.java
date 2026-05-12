package com.lms.auth_service.exception;

import org.springframework.http.HttpStatus;

public class TokenExpiredException extends AuthException {
    public TokenExpiredException() {
        super("AUTH_003", "Token expired", HttpStatus.UNAUTHORIZED);
    }
}