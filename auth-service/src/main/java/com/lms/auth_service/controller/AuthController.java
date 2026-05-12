package com.lms.auth_service.controller;

import com.lms.auth_service.dto.request.AssignRoleRequest;
import com.lms.auth_service.dto.request.LoginRequest;
import com.lms.auth_service.dto.request.RefreshRequest;
import com.lms.auth_service.dto.request.RegisterRequest;
import com.lms.auth_service.dto.response.AuthResponse;
import com.lms.auth_service.dto.response.TokenValidationResponse;
import com.lms.auth_service.service.AuthService;
import com.lms.auth_service.service.TokenService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestParam;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final TokenService tokenService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @RequestBody @Valid RegisterRequest request) {

        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody @Valid LoginRequest request) {

        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(
            @RequestBody @Valid RefreshRequest request) {

        AuthResponse response = authService.refresh(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/validate")
    public ResponseEntity<TokenValidationResponse> validate(
            @RequestParam String token) {

        TokenValidationResponse response = tokenService.validate(token);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/users/{userId}/role")
    public ResponseEntity<Void> assignRoleToUser(
            @PathVariable Long userId,
            @RequestBody @Valid AssignRoleRequest request) {

        authService.assignRoleToUser(userId, request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/users/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(
            @PathVariable Long userId,
            @RequestHeader(value = "X-User-Id", required = false) Long requesterUserId,
            @RequestParam(value = "adminUserId", required = false) Long adminUserId) {

        Long authorizedAdminId = requesterUserId != null ? requesterUserId : adminUserId;
        authService.deleteUser(userId, authorizedAdminId);
    }
}
