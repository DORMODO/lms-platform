package com.lms.payment_service.dto;

import java.time.LocalDateTime;

public record PaymentResponse(
        Long id,
        Long courseId,
        Long studentId,
        Double amount,
        String currency,
        String status,
        String receiptNumber,
        String transactionRef,
        LocalDateTime createdAt
) {}
