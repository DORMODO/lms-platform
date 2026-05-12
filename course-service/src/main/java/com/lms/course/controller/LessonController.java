package com.lms.course.controller;

import com.lms.course.dto.request.CreateLessonRequest;
import com.lms.course.entity.Lesson;
import com.lms.course.service.LessonService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class LessonController {

    private final LessonService lessonService;

    @PostMapping("/{courseId}/lessons")
    public ResponseEntity<Lesson> addLesson(
            @PathVariable Long courseId,
            @Valid @RequestBody CreateLessonRequest request,
            @RequestHeader("X-User-Id") Long instructorId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(lessonService.addLesson(courseId, request, instructorId));
    }

    @GetMapping("/{courseId}/lessons")
    public ResponseEntity<List<Lesson>> getLessonsByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(lessonService.getLessonsByCourse(courseId));
    }

    @PutMapping("/{courseId}/lessons/{lessonId}")
    public ResponseEntity<Lesson> updateLesson(
            @PathVariable Long courseId,
            @PathVariable Long lessonId,
            @Valid @RequestBody CreateLessonRequest request,
            @RequestHeader("X-User-Id") Long instructorId) {
        return ResponseEntity.ok(lessonService.updateLesson(lessonId, request, instructorId));
    }

    @DeleteMapping("/{courseId}/lessons/{lessonId}")
    public ResponseEntity<Void> deleteLesson(
            @PathVariable Long courseId,
            @PathVariable Long lessonId,
            @RequestHeader("X-User-Id") Long instructorId) {
        lessonService.deleteLesson(lessonId, instructorId);
        return ResponseEntity.noContent().build();
    }
}