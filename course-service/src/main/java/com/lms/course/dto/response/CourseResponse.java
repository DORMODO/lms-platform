package com.lms.course.dto.response;

import com.lms.course.enums.CourseStatus;
import com.lms.course.enums.DifficultyLevel;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class CourseResponse {
    private Long courseId;
    private String title;
    private String description;
    private Double price;
    private String category;
    private String thumbnailUrl;
    private DifficultyLevel difficultyLevel;
    private CourseStatus status;
    private Long instructorId;
    private Boolean featured;
    private Long id;
    private String instructorName;
    private Double rating;
    private Integer enrolledCount;
    private List<LessonResponse> lessons;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}