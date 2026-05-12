package com.lms.course.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lms.course.entity.LessonProgress;

@Repository
public interface LessonProgressRepository extends JpaRepository<LessonProgress, Long> {
    Optional<LessonProgress> findByStudentIdAndLesson_LessonId(Long studentId, Long lessonId);
    List<LessonProgress> findByStudentIdAndLesson_Course_CourseIdAndCompletedTrue(Long studentId, Long courseId);
}