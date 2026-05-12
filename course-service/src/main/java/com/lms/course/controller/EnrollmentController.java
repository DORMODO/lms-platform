package com.lms.course.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lms.course.entity.Enrollment;
import com.lms.course.service.EnrollmentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    /**
     * Called internally by payment-service via Feign after a successful payment.
     * Also used directly for free courses (price = 0).
     * POST /api/courses/{courseId}/enroll
     */
    @PostMapping("/{courseId}/enroll")
    public ResponseEntity<Enrollment> enrollStudent(
            @PathVariable Long courseId,
            @RequestHeader("X-User-Id") Long studentId) {
        Enrollment enrollment = enrollmentService.enrollStudent(courseId, studentId);
        return ResponseEntity.status(HttpStatus.CREATED).body(enrollment);
    }

    /**
     * Checks whether a student is enrolled — used by review-service via Feign.
     * GET /api/courses/{courseId}/enrollment-check
     */
    @GetMapping("/{courseId}/enrollment-check")
    public ResponseEntity<Map<String, Boolean>> checkEnrollment(
            @PathVariable Long courseId,
            @RequestHeader("X-User-Id") Long studentId) {
        boolean enrolled = enrollmentService.isEnrolled(courseId, studentId);
        return ResponseEntity.ok(Map.of("enrolled", enrolled));
    }

    /**
     * Returns all enrolled students for a course — accessible by Instructor / Admin.
     * GET /api/courses/{courseId}/enrollments
     */
    @GetMapping("/{courseId}/enrollments")
    public ResponseEntity<List<Enrollment>> getEnrollmentsByCourse(
            @PathVariable Long courseId) {
        return ResponseEntity.ok(enrollmentService.getEnrollmentsByCourse(courseId));
    }

    /**
     * Returns all courses a student is enrolled in.
     * GET /api/courses/my-enrollments
     */
    @GetMapping("/my-enrollments")
    public ResponseEntity<List<Enrollment>> getMyEnrollments(
            @RequestHeader("X-User-Id") Long studentId) {
        return ResponseEntity.ok(enrollmentService.getEnrollmentsByStudent(studentId));
    }
}