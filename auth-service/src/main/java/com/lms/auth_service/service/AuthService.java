package com.lms.auth_service.service;

import com.lms.auth_service.dto.request.AssignRoleRequest;
import com.lms.auth_service.dto.request.LoginRequest;
import com.lms.auth_service.dto.request.RefreshRequest;
import com.lms.auth_service.dto.request.RegisterRequest;
import com.lms.auth_service.dto.response.AuthResponse;
import com.lms.auth_service.dto.response.TokenValidationResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse refresh(RefreshRequest request);
    void assignRoleToUser(Long userId, AssignRoleRequest request);
    void deleteUser(Long userId, Long adminUserId);
}