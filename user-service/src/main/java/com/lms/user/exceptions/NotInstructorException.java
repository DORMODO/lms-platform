package com.lms.user.exceptions;

public class NotInstructorException extends RuntimeException {
    public NotInstructorException(Long userId) {
        super("User " + userId + " is not an instructor");
    }
}