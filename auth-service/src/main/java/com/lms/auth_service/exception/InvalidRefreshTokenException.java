package com.lms.auth_service.exception;

import org.springframework.http.HttpStatus;

public class InvalidRefreshTokenException extends AuthException {
    public InvalidRefreshTokenException() {
        super("AUTH_006", "Invalid refresh token", HttpStatus.UNAUTHORIZED);
    }
}