package com.lms.auth_service.exception;

import org.springframework.http.HttpStatus;

public class UnauthorizedException extends AuthException {
    public UnauthorizedException(String message) {
        super("AUTH_006", message, HttpStatus.FORBIDDEN);
    }
}
