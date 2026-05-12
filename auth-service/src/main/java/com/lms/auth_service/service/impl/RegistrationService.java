package com.lms.auth_service.service.impl;

import com.lms.auth_service.dto.request.RegisterRequest;
import com.lms.auth_service.dto.response.AuthResponse;
import com.lms.auth_service.entity.Role;
import com.lms.auth_service.entity.User;
import com.lms.auth_service.exception.UserAlreadyExistsException;
import com.lms.auth_service.repo.RoleRepo;
import com.lms.auth_service.repo.UserRepo;
import com.lms.auth_service.service.TokenService;
import com.lms.auth_service.utils.PasswordHasher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class RegistrationService {
    private final UserRepo userRepo;
    private final RoleRepo roleRepo;
    private final PasswordHasher passwordHasher;
    private final TokenService tokenService;

    public AuthResponse register(RegisterRequest request) {
        log.debug("Registration attempt for email: {}", request.getEmail());

        if (userRepo.findByEmail(request.getEmail()).isPresent()) {
            log.warn("Registration failed - email already exists: {}", request.getEmail());
            throw new UserAlreadyExistsException();
        }

        Role role = resolveRole(request.getRole());
        User user = createUser(request.getEmail(), request.getPassword(), role);
        userRepo.save(user);

        log.info("User registered successfully: {} with role: {}", user.getEmail(), role.getName());
        return tokenService.generateAuthResponse(user);
    }

    private Role resolveRole(String requestedRole) {
        if (requestedRole == null || requestedRole.isBlank()) {
            return getDefaultStudentRole();
        }

        return roleRepo.findByName(requestedRole.toUpperCase())
                .orElseGet(() -> {
                    log.warn("Requested role not found: {}, defaulting to STUDENT", requestedRole);
                    return getDefaultStudentRole();
                });
    }

    private Role getDefaultStudentRole() {
        return roleRepo.findByName("STUDENT")
                .orElseThrow(() -> new IllegalStateException("Default STUDENT role not found in database"));
    }

    private User createUser(String email, String password, Role role) {
        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordHasher.hashPassword(password));
        user.setRole(role);
        return user;
    }
}