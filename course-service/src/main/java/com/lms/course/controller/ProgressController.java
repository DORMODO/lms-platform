package com.lms.course.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lms.course.dto.response.ProgressResponse;
import com.lms.course.entity.LessonProgress;
import com.lms.course.service.ProgressService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class ProgressController {

    private final ProgressService progressService;

    /**
     * Mark a specific lesson as complete for the authenticated student.
     * PUT /api/courses/{courseId}/lessons/{lessonId}/complete
     */
    @PutMapping("/{courseId}/lessons/{lessonId}/complete")
    public ResponseEntity<LessonProgress> markLessonComplete(
            @PathVariable Long courseId,
            @PathVariable Long lessonId,
            @RequestHeader("X-User-Id") Long studentId) {
        LessonProgress progress = progressService.markLessonComplete(courseId, lessonId, studentId);
        return ResponseEntity.ok(progress);
    }

    /**
     * Get overall progress percentage for a student in a course.
     * GET /api/courses/{courseId}/progress
     */
    @GetMapping("/{courseId}/progress")
    public ResponseEntity<ProgressResponse> getCourseProgress(
            @PathVariable Long courseId,
            @RequestHeader("X-User-Id") Long studentId) {
        return ResponseEntity.ok(progressService.getCourseProgress(courseId, studentId));
    }
}