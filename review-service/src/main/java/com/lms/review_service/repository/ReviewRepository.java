package com.lms.review_service.repository;

import com.lms.review_service.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByCourseIdOrderByCreatedAtDesc(Long courseId);

    List<Review> findByStudentId(Long studentId);

    @Query("SELECT COALESCE(AVG(r.rating), 0.0) FROM Review r WHERE r.courseId = :courseId")
    Double findAverageRatingByCourseId(@Param("courseId") Long courseId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.courseId = :courseId")
    Integer countByCourseId(@Param("courseId") Long courseId);

    boolean existsByCourseIdAndStudentId(Long courseId, Long studentId);
}
