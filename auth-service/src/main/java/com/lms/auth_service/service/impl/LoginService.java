package com.lms.auth_service.service.impl;

import com.lms.auth_service.dto.request.LoginRequest;
import com.lms.auth_service.dto.response.AuthResponse;
import com.lms.auth_service.entity.User;
import com.lms.auth_service.exception.InvalidCredentialsException;
import com.lms.auth_service.exception.UserNotFoundException;
import com.lms.auth_service.repo.UserRepo;
import com.lms.auth_service.service.TokenService;
import com.lms.auth_service.utils.PasswordHasher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class LoginService {
    private final UserRepo userRepo;
    private final PasswordHasher passwordHasher;
    private final TokenService tokenService;

    public AuthResponse login(LoginRequest request) {
        log.debug("Login attempt for email: {}", request.getEmail());
        
        User user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(UserNotFoundException::new);

        if (!passwordHasher.verifyPassword(request.getPassword(), user.getPassword())) {
            log.warn("Failed login attempt for email: {}", request.getEmail());
            throw new InvalidCredentialsException();
        }

        log.info("User logged in successfully: {}", user.getEmail());
        return tokenService.generateAuthResponse(user);
    }
}