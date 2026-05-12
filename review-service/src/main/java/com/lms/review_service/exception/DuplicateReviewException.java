package com.lms.review_service.exception;

public class DuplicateReviewException extends RuntimeException {
    public DuplicateReviewException(Long courseId, Long studentId) {
        super("Student " + studentId + " has already reviewed course " + courseId);
    }
}
