package com.lms.course.exception;

public class LessonNotFoundException extends RuntimeException {
    public LessonNotFoundException(Long lessonId) {
        super("Lesson not found with id: " + lessonId);
    }
}