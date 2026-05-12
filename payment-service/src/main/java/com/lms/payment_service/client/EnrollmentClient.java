package com.lms.payment_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "course-service", url = "${course.service.url:http://localhost:8082}")
public interface EnrollmentClient {

    @PostMapping("/api/courses/{courseId}/enroll")
    void enrollStudent(@PathVariable("courseId") Long courseId,
                       @RequestHeader("X-User-Id") Long studentId);
}
