package com.lms.auth_service.exception;

import org.springframework.http.HttpStatus;

public class RefreshTokenExpiredException extends AuthException {
    public RefreshTokenExpiredException() {
        super("AUTH_007", "Refresh token expired", HttpStatus.UNAUTHORIZED);
    }
}