package com.lms.auth_service.exception;

import org.springframework.http.HttpStatus;

public class UserNotFoundException extends AuthException {
    public UserNotFoundException() {
        super("AUTH_005", "User not found", HttpStatus.NOT_FOUND);
    }
}