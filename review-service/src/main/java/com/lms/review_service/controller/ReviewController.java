package com.lms.review_service.controller;

import com.lms.review_service.dto.request.ReviewRequest;
import com.lms.review_service.dto.response.CourseReviewSummary;
import com.lms.review_service.dto.response.ReviewResponse;
import com.lms.review_service.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/courses/{courseId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(reviewService.getReviewsByCourse(courseId));
    }

    @GetMapping("/courses/{courseId}/summary")
    public ResponseEntity<CourseReviewSummary> getCourseReviewSummary(@PathVariable Long courseId) {
        return ResponseEntity.ok(reviewService.getCourseReviewSummary(courseId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReviewResponse> getReviewById(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.getReviewById(id));
    }

    @PostMapping("/courses/{courseId}")
    public ResponseEntity<ReviewResponse> createReview(
            @PathVariable Long courseId,
            @Valid @RequestBody ReviewRequest request,
            @RequestHeader("X-User-Id") Long studentId,
            @RequestHeader("X-User-Email") String studentName) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reviewService.createReview(courseId, request, studentId, studentName));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReviewResponse> updateReview(
            @PathVariable Long id,
            @Valid @RequestBody ReviewRequest request,
            @RequestHeader("X-User-Id") Long studentId) {
        return ResponseEntity.ok(reviewService.updateReview(id, request, studentId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteReview(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long studentId) {
        reviewService.deleteReview(id, studentId);

        Map<String, Boolean> response = new HashMap<>();
        response.put("success", true);

        return ResponseEntity.ok(response);
    }
}
