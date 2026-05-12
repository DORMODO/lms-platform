package com.lms.course.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProgressResponse {

    private Long courseId;
    private Long studentId;
    private int totalLessons;
    private List<Long> completedLessons; // changed the list type so it can match the api contract.
    private double progressPercentage;
}