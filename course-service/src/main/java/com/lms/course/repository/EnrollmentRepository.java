package com.lms.course.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lms.course.entity.Enrollment;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    boolean existsByStudentIdAndCourse_CourseId(Long studentId, Long courseId);

    List<Enrollment> findByCourse_CourseId(Long courseId);

    List<Enrollment> findByStudentId(Long studentId);
}