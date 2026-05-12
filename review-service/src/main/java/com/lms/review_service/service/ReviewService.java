package com.lms.review_service.service;

import com.lms.review_service.dto.request.ReviewRequest;
import com.lms.review_service.dto.response.CourseReviewSummary;
import com.lms.review_service.dto.response.ReviewResponse;
import com.lms.review_service.entity.Review;
import com.lms.review_service.exception.DuplicateReviewException;
import com.lms.review_service.exception.ReviewNotFoundException;
import com.lms.review_service.exception.UnauthorizedException;
import com.lms.review_service.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public List<ReviewResponse> getReviewsByCourse(Long courseId) {
        return reviewRepository.findByCourseIdOrderByCreatedAtDesc(courseId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public CourseReviewSummary getCourseReviewSummary(Long courseId) {
        List<Review> reviews = reviewRepository.findByCourseIdOrderByCreatedAtDesc(courseId);

        Map<Integer, Long> distribution = new LinkedHashMap<>();
        for (int i = 1; i <= 5; i++) distribution.put(i, 0L);
        reviews.forEach(r -> distribution.merge(r.getRating(), 1L, Long::sum));

        return CourseReviewSummary.builder()
                .averageRating(Math.round(reviewRepository.findAverageRatingByCourseId(courseId) * 10.0) / 10.0)
                .totalReviews(reviews.size())
                .ratingDistribution(distribution)
                .build();
    }

    public ReviewResponse getReviewById(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ReviewNotFoundException(reviewId));
        return toResponse(review);
    }

    @Transactional
    public ReviewResponse createReview(Long courseId, ReviewRequest request,
                                        Long studentId, String studentName) {
        if (reviewRepository.existsByCourseIdAndStudentId(courseId, studentId)) {
            throw new DuplicateReviewException(courseId, studentId);
        }

        Review review = Review.builder()
                .courseId(courseId)
                .studentId(studentId)
                .studentName(studentName)
                .rating(request.getRating())
                .comment(request.getComment())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return toResponse(reviewRepository.save(review));
    }

    @Transactional
    public ReviewResponse updateReview(Long reviewId, ReviewRequest request, Long studentId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ReviewNotFoundException(reviewId));

        if (!review.getStudentId().equals(studentId)) {
            throw new UnauthorizedException("You can only edit your own reviews");
        }

        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setUpdatedAt(LocalDateTime.now());

        return toResponse(reviewRepository.save(review));
    }

    @Transactional
    public void deleteReview(Long reviewId, Long studentId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ReviewNotFoundException(reviewId));

        if (!review.getStudentId().equals(studentId)) {
            throw new UnauthorizedException("You can only delete your own reviews");
        }

        reviewRepository.delete(review);
    }

    private ReviewResponse toResponse(Review review) {
        ReviewResponse response = new ReviewResponse();
        response.setId(review.getId());
        response.setCourseId(review.getCourseId());
        response.setStudentId(review.getStudentId());
        response.setStudentName(review.getStudentName());
        response.setRating(review.getRating());
        response.setComment(review.getComment());
        response.setCreatedAt(review.getCreatedAt());
        response.setUpdatedAt(review.getUpdatedAt());
        return response;
    }
}
