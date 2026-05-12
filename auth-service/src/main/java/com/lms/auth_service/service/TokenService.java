package com.lms.auth_service.service;

import com.lms.auth_service.dto.response.AuthResponse;
import com.lms.auth_service.dto.response.TokenValidationResponse;
import com.lms.auth_service.entity.RefreshToken;
import com.lms.auth_service.entity.User;

public interface TokenService {
    AuthResponse generateAuthResponse(User user);
    AuthResponse refreshAccessToken(String refreshToken);
    TokenValidationResponse validate(String token);
}