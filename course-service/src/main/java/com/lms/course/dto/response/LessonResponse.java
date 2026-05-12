package com.lms.course.dto.response;

import com.lms.course.enums.LessonType;
import lombok.Data;

@Data
public class LessonResponse {
    private Long id;
    private String title;
    private LessonType type;
    private Integer duration;
    private Integer order;
    private String contentUrl;
}