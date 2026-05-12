package com.lms.course.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lms.course.dto.response.ProgressResponse;
import com.lms.course.entity.Lesson;
import com.lms.course.entity.LessonProgress;
import com.lms.course.exception.CourseNotFoundException;
import com.lms.course.repository.CourseRepository;
import com.lms.course.repository.EnrollmentRepository;
import com.lms.course.repository.LessonProgressRepository;
import com.lms.course.repository.LessonRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProgressService {

    private final LessonProgressRepository lessonProgressRepository;
    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;

    @Transactional
    public LessonProgress markLessonComplete(Long courseId, Long lessonId, Long studentId) {
        courseRepository.findById(courseId)
                .orElseThrow(() -> new CourseNotFoundException(courseId));

        if (!enrollmentRepository.existsByStudentIdAndCourse_CourseId(studentId, courseId)) {
            throw new RuntimeException("Student is not enrolled in this course");
        }

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + lessonId));

        if (!lesson.getCourse().getCourseId().equals(courseId)) {
            throw new RuntimeException("Lesson does not belong to the specified course");
        }

        LessonProgress progress = lessonProgressRepository
                .findByStudentIdAndLesson_LessonId(studentId, lessonId)
                .orElse(LessonProgress.builder()
                        .studentId(studentId)
                        .lesson(lesson)
                        .build());

        progress.setCompleted(true);
        progress.setCompletedAt(LocalDateTime.now());

        return lessonProgressRepository.save(progress);
    }

    public ProgressResponse getCourseProgress(Long courseId, Long studentId) {
        courseRepository.findById(courseId)
                .orElseThrow(() -> new CourseNotFoundException(courseId));

        if (!enrollmentRepository.existsByStudentIdAndCourse_CourseId(studentId, courseId)) {
            throw new RuntimeException("Student is not enrolled in this course");
        }

        List<Lesson> allLessons = lessonRepository.findByCourse_CourseIdOrderByPositionAsc(courseId);
        int totalLessons = allLessons.size();

        List<Long> completedLessonIds = lessonProgressRepository
                .findByStudentIdAndLesson_Course_CourseIdAndCompletedTrue(studentId, courseId)
                .stream()
                .map(lp -> lp.getLesson().getLessonId())
                .toList();

        int completedCount = completedLessonIds.size();
        double percentage = totalLessons == 0 ? 0.0
                : Math.round((completedCount * 100.0 / totalLessons) * 100.0) / 100.0;

        return ProgressResponse.builder()
                .courseId(courseId)
                .studentId(studentId)
                .totalLessons(totalLessons)
                .completedLessons(completedLessonIds)
                .progressPercentage(percentage)
                .build();
    }
}