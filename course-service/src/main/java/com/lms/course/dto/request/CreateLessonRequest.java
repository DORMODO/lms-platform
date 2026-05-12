package com.lms.course.dto.request;

import com.lms.course.enums.LessonType;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreateLessonRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Lesson type is required")
    private LessonType type;

    @NotBlank(message = "Content URL is required")
    private String contentUrl;

    @NotNull(message = "Duration is required")
    @Min(value = 1, message = "Duration must be at least 1 minute")
    private Integer duration;

    @NotNull(message = "Position is required")
    @Min(value = 1, message = "Position must be at least 1")
    private Integer position;
}