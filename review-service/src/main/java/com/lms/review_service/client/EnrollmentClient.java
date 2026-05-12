package com.lms.review_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "enrollment-service",url="http://localhost:8085")
public interface EnrollmentClient {

    @GetMapping("/api/enrollments/check/{studentId}/{courseId}")
    default boolean isEnrolled(
            @PathVariable Long studentId,
            @PathVariable Long courseId
    ) {
        return true;
    }
}