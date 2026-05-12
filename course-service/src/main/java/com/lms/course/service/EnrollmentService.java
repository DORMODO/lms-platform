package com.lms.course.service;

import com.lms.course.client.NotificationClient;
import com.lms.course.entity.Course;
import com.lms.course.entity.Enrollment;
import com.lms.course.exception.CourseNotFoundException;
import com.lms.course.repository.CourseRepository;
import com.lms.course.repository.EnrollmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final NotificationClient notificationClient;

    @Transactional
    public Enrollment enrollStudent(Long courseId, Long studentId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new CourseNotFoundException(courseId));

        if (enrollmentRepository.existsByStudentIdAndCourse_CourseId(studentId, courseId)) {
            throw new RuntimeException("Student is already enrolled in this course");
        }

        Enrollment enrollment = Enrollment.builder()
                .studentId(studentId)
                .course(course)
                .build();

        Enrollment saved = enrollmentRepository.save(enrollment);

        notifyStudent(studentId, course);

        return saved;
    }

    private void notifyStudent(Long studentId, Course course) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("userId", studentId);
            payload.put("type", "ENROLLMENT");
            payload.put("title", "Enrollment Confirmed");
            payload.put("body", "You have successfully enrolled in: " + course.getTitle());
            notificationClient.sendNotification(payload);
            log.info("Notification sent via Feign | student={} course={}", studentId, course.getCourseId());
        } catch (Exception ex) {
            log.warn("Failed to send enrollment notification for studentId={}, courseId={}: {}",
                    studentId, course.getCourseId(), ex.getMessage());
        }
    }

    public boolean isEnrolled(Long courseId, Long studentId) {
        return enrollmentRepository.existsByStudentIdAndCourse_CourseId(studentId, courseId);
    }

    public List<Enrollment> getEnrollmentsByCourse(Long courseId) {
        courseRepository.findById(courseId)
                .orElseThrow(() -> new CourseNotFoundException(courseId));
        return enrollmentRepository.findByCourse_CourseId(courseId);
    }

    public List<Enrollment> getEnrollmentsByStudent(Long studentId) {
        return enrollmentRepository.findByStudentId(studentId);
    }
}