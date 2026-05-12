package com.lms.auth_service.exception;

import org.springframework.http.HttpStatus;

public class UserAlreadyExistsException extends AuthException {
    public UserAlreadyExistsException() {
        super("AUTH_002", "Email already in use", HttpStatus.CONFLICT);
    }
}