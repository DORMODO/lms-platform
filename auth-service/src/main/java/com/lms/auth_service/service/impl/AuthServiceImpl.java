package com.lms.auth_service.service.impl;

import com.lms.auth_service.dto.request.AssignRoleRequest;
import com.lms.auth_service.dto.request.LoginRequest;
import com.lms.auth_service.dto.request.RefreshRequest;
import com.lms.auth_service.dto.request.RegisterRequest;
import com.lms.auth_service.dto.response.AuthResponse;
import com.lms.auth_service.dto.response.TokenValidationResponse;
import com.lms.auth_service.entity.Role;
import com.lms.auth_service.entity.User;
import com.lms.auth_service.exception.UnauthorizedException;
import com.lms.auth_service.exception.UserNotFoundException;
import com.lms.auth_service.repo.RefreshTokenRepo;
import com.lms.auth_service.repo.RoleRepo;
import com.lms.auth_service.repo.UserRepo;
import com.lms.auth_service.service.AuthService;
import com.lms.auth_service.service.TokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {
    private final RegistrationService registrationService;
    private final LoginService loginService;
    private final TokenService tokenService;
    private final UserRepo userRepo;
    private final RoleRepo roleRepo;
    private final RefreshTokenRepo refreshTokenRepo;

    @Override
    public AuthResponse register(RegisterRequest request) {
        log.debug("Processing register request for: {}", request.getEmail());
        AuthResponse response = registrationService.register(request);
        log.info("Registration successful for: {}", request.getEmail());
        return response;
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        log.debug("Processing login request for: {}", request.getEmail());
        AuthResponse response = loginService.login(request);
        log.info("Login successful for: {}", request.getEmail());
        return response;
    }

    @Override
    public AuthResponse refresh(RefreshRequest request) {
        log.debug("Processing token refresh");
        AuthResponse response = tokenService.refreshAccessToken(request.getRefreshToken());
        log.info("Token refreshed successfully");
        return response;
    }

    @Override
    public void assignRoleToUser(Long userId, AssignRoleRequest request) {
        log.debug("Assigning role {} to user {}", request.getRoleId(), userId);
        User user = userRepo.findById(userId)
                .orElseThrow(UserNotFoundException::new);

        Role role = roleRepo.findById(request.getRoleId())
                .orElseThrow(() -> new IllegalArgumentException("Role not found with id: " + request.getRoleId()));

        user.setRole(role);
        userRepo.save(user);
        log.info("Successfully assigned role {} to user {}", role.getName(), user.getEmail());
    }

    @Override
    public void deleteUser(Long userId, Long adminUserId) {
        log.debug("Admin {} attempting to delete user {}", adminUserId, userId);

        if (adminUserId == null) {
            throw new UnauthorizedException("Admin user is required");
        }
        
        User admin = userRepo.findById(adminUserId)
                .orElseThrow(() -> new UnauthorizedException("Admin user not found"));
        
        boolean canDeleteUsers = admin.getRole().getPermissions().stream()
                .anyMatch(permission -> "users:delete".equals(permission.getName()));

        if (!canDeleteUsers) {
            throw new UnauthorizedException("Missing users:delete permission");
        }
        
        if (userId.equals(adminUserId)) {
            throw new IllegalArgumentException("Admin cannot delete own account");
        }
        
        User user = userRepo.findById(userId)
                .orElseThrow(UserNotFoundException::new);
        
        refreshTokenRepo.deleteByUser(user);
        userRepo.delete(user);
        
        log.info("Successfully deleted user {} by admin {}", user.getEmail(), admin.getEmail());
    }
}
