package com.lms.course.service;

import com.lms.course.dto.request.CreateLessonRequest;
import com.lms.course.entity.Course;
import com.lms.course.entity.Lesson;
import com.lms.course.repository.CourseRepository;
import com.lms.course.repository.LessonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LessonService {

    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;

    public Lesson addLesson(Long courseId, CreateLessonRequest request, Long instructorId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (!course.getInstructorId().equals(instructorId)) {
            throw new RuntimeException("You are not the owner of this course");
        }

        Lesson lesson = Lesson.builder()
                .title(request.getTitle())
                .type(request.getType())
                .contentUrl(request.getContentUrl())
                .duration(request.getDuration())
                .position(request.getPosition())
                .course(course)
                .build();

        return lessonRepository.save(lesson);
    }

    public List<Lesson> getLessonsByCourse(Long courseId) {
        return lessonRepository.findByCourse_CourseIdOrderByPositionAsc(courseId);
    }

    public Lesson updateLesson(Long lessonId, CreateLessonRequest request, Long instructorId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        if (!lesson.getCourse().getInstructorId().equals(instructorId)) {
            throw new RuntimeException("You are not the owner of this lesson");
        }

        lesson.setTitle(request.getTitle());
        lesson.setType(request.getType());
        lesson.setContentUrl(request.getContentUrl());
        lesson.setDuration(request.getDuration());
        lesson.setPosition(request.getPosition());

        return lessonRepository.save(lesson);
    }

    public void deleteLesson(Long lessonId, Long instructorId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        if (!lesson.getCourse().getInstructorId().equals(instructorId)) {
            throw new RuntimeException("You are not the owner of this lesson");
        }

        lessonRepository.delete(lesson);
    }
}