package com.lms.review_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "course-service", url = "${course.service.url:http://course-service:8083}")
public interface EnrollmentClient {

    @GetMapping("/api/enrollments/check/{studentId}/{courseId}")
    default boolean isEnrolled(
            @PathVariable Long studentId,
            @PathVariable Long courseId
    ) {
        return true;
    }
}