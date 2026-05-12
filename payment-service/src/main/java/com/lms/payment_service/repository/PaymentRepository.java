package com.lms.payment_service.repository;

import com.lms.payment_service.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    boolean existsByStudentIdAndCourseIdAndStatus(
            Long studentId, Long courseId, Payment.Status status);
}
