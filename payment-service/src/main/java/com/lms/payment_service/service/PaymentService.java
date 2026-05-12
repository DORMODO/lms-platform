package com.lms.payment_service.service;

import com.lms.payment_service.client.EnrollmentClient;
import com.lms.payment_service.dto.CheckoutRequest;
import com.lms.payment_service.dto.PaymentResponse;
import com.lms.payment_service.entity.Payment;
import com.lms.payment_service.entity.Payment.Status;
import com.lms.payment_service.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.atomic.AtomicLong;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);
    private static final AtomicLong seq = new AtomicLong(0);

    private final PaymentRepository repo;
    private final EnrollmentClient enrollmentClient;

    @Transactional
    public PaymentResponse pay(Long studentId, CheckoutRequest req) {
        if (repo.existsByStudentIdAndCourseIdAndStatus(studentId, req.courseId(), Status.SUCCEEDED))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Already paid for this course");

        Payment p = new Payment();
        p.setStudentId(studentId);
        p.setCourseId(req.courseId());
        p.setAmount(req.amount());
        p.setCurrency("USD");
        p.setStatus(Status.SUCCEEDED);
        p.setReceiptNumber(generateReceipt());
        p.setTransactionRef(generateTxnRef());
        repo.save(p);

        log.info("Pay OK | id={} student={} course={} amount={} receipt={}",
                p.getId(), studentId, req.courseId(), req.amount(), p.getReceiptNumber());

        try {
            enrollmentClient.enrollStudent(req.courseId(), studentId);
            log.info("Enrollment created via Feign | student={} course={}", studentId, req.courseId());
        } catch (Exception e) {
            log.error("Failed to enroll student via Feign | student={} course={}: {}",
                    studentId, req.courseId(), e.getMessage());
        }

        return toResponse(p);
    }

    private String generateReceipt() {
        return "RCP-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"))
                + "-" + String.format("%04d", seq.incrementAndGet() % 10000);
    }

    private String generateTxnRef() {
        return "TXN-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"))
                + "-" + String.format("%04d", seq.incrementAndGet() % 10000);
    }

    private PaymentResponse toResponse(Payment p) {
        return new PaymentResponse(p.getId(), p.getCourseId(), p.getStudentId(),
                p.getAmount(), p.getCurrency(), p.getStatus().name(),
                p.getReceiptNumber(), p.getTransactionRef(), p.getCreatedAt());
    }
}
