package com.lms.notification.service;

import com.lms.notification.entity.Notification;
import com.lms.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public Notification createNotification(Long userId, String type, String title, String body, String channel) {
        Notification notification = Notification.builder()
                .userId(userId)
                .type(type)
                .title(title)
                .body(body)
                .channel(channel)
                .status("PENDING")
                .build();

        Notification saved = notificationRepository.save(notification);
        log.info("Notification created | id={} userId={} type={}", saved.getId(), userId, type);

        try {
            saved.setStatus("SENT");
            saved.setSentAt(LocalDateTime.now());
            notificationRepository.save(saved);
        } catch (Exception e) {
            log.warn("Failed to send notification | id={}: {}", saved.getId(), e.getMessage());
            saved.setStatus("FAILED");
            notificationRepository.save(saved);
        }

        return saved;
    }

    public Notification createFromPayload(Map<String, Object> payload) {
        Long userId = Long.valueOf(payload.getOrDefault("userId", 0).toString());
        String type = (String) payload.getOrDefault("type", "GENERAL");
        String title = (String) payload.getOrDefault("title", "");
        String body = (String) payload.getOrDefault("body", "");
        return createNotification(userId, type, title, body, "EMAIL");
    }

    public List<Notification> getNotificationsByUser(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    public void markAsRead(Long id, Long userId) {
        notificationRepository.findByIdAndUserId(id, userId)
                .ifPresent(notification -> {
                    notification.setRead(true);
                    notificationRepository.save(notification);
                });
    }

    public void markAllAsRead(Long userId) {
        List<Notification> unread = notificationRepository
                .findByUserIdAndReadFalseOrderByCreatedAtDesc(userId);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }
}
