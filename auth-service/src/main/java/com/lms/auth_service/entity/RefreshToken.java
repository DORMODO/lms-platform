package com.lms.auth_service.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;

import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Data;

import java.time.Instant;


@Entity
@Data
public class RefreshToken {

    @Id
    @GeneratedValue
    private Long id;

    private String token;

    @ManyToOne
    // Many refresh tokens can belong to one user
    private User user;

    private Instant expiryDate;
}
