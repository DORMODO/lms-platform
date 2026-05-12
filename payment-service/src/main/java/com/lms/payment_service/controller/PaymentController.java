package com.lms.payment_service.controller;

import com.lms.payment_service.dto.CheckoutRequest;
import com.lms.payment_service.dto.PaymentResponse;
import com.lms.payment_service.service.PaymentService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private static final Logger log = LoggerFactory.getLogger(PaymentController.class);
    private final PaymentService service;

    public PaymentController(PaymentService service) { this.service = service; }

    @PostMapping("/pay")
    public ResponseEntity<PaymentResponse> pay(
            @RequestHeader("X-User-Id") Long studentId,
            @Valid @RequestBody CheckoutRequest req) {
        log.info("Pay | student={} course={} amount={}", studentId, req.courseId(), req.amount());
        return ResponseEntity.status(HttpStatus.CREATED).body(service.pay(studentId, req));
    }
}
