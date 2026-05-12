package com.lms.course.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@FeignClient(name = "notification-service", url = "${notification.service.url:http://localhost:8085}")
public interface NotificationClient {

    @PostMapping("/api/notifications")
    void sendNotification(@RequestBody Map<String, Object> payload);
}
