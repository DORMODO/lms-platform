package com.lms.payment_service.dto;

import jakarta.validation.constraints.NotNull;

public record CheckoutRequest(
        @NotNull Long courseId,
        @NotNull Double amount
) {}
