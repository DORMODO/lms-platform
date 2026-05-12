package com.lms.review_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseReviewSummary {
    private Double averageRating;
    private Integer totalReviews;
    private Map<Integer, Long> ratingDistribution;
}
