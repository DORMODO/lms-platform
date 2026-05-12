package com.lms.course.dto.request;

import com.lms.course.enums.DifficultyLevel;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UpdateCourseRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Price is required")
    @Min(value = 0, message = "Price cannot be negative")
    private Double price;

    @NotBlank(message = "Category is required")
    private String category;

    private String thumbnailUrl;

    @NotNull(message = "Difficulty level is required")
    private DifficultyLevel difficultyLevel;
}