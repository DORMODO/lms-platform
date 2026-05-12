package com.lms.auth_service.service.impl;

import com.lms.auth_service.dto.response.AuthResponse;
import com.lms.auth_service.dto.response.TokenValidationResponse;
import com.lms.auth_service.entity.RefreshToken;
import com.lms.auth_service.entity.User;
import com.lms.auth_service.utils.JwtUtil;
import com.lms.auth_service.service.RefreshTokenService;
import com.lms.auth_service.service.TokenService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TokenServiceImpl implements TokenService {
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;

    @Override
    public AuthResponse generateAuthResponse(User user) {
        log.debug("Generating tokens for user: {}", user.getEmail());
        String accessToken = jwtUtil.generateToken(user);
        String refreshToken = refreshTokenService.createRefreshToken(user);

        AuthResponse response = new AuthResponse();
        response.setAccessToken(accessToken);
        response.setRefreshToken(refreshToken);
        response.setRole(user.getRole().getName());
        response.setEmail(user.getEmail());
        response.setPermissions(getPermissionNames(user));
        
        log.debug("Tokens generated for user: {}", user.getEmail());
        return response;
    }

    @Override
    public AuthResponse refreshAccessToken(String refreshTokenStr) {
        log.debug("Refreshing access token");
        RefreshToken token = refreshTokenService.validateRefreshToken(refreshTokenStr);
        User user = token.getUser();
        String newAccessToken = jwtUtil.generateToken(user);

        AuthResponse response = new AuthResponse();
        response.setAccessToken(newAccessToken);
        response.setRefreshToken(refreshTokenStr);
        response.setRole(user.getRole().getName());
        response.setEmail(user.getEmail());
        response.setPermissions(getPermissionNames(user));
        
        log.info("Access token refreshed for user: {}", user.getEmail());
        return response;
    }

    @Override
    public TokenValidationResponse validate(String token) {
        log.debug("Validating token");
        Claims claims = jwtUtil.validateAndExtract(token);

        TokenValidationResponse response = new TokenValidationResponse();
        response.setValid(true);
        response.setUserId(claims.getSubject());
        response.setEmail(claims.get("email", String.class));
        response.setRole(claims.get("role", String.class));
        List<String> permissions = claims.get("permissions", List.class);
        response.setPermissions(permissions != null ? permissions : List.of());
        
        log.debug("Token validated for user: {}", claims.getSubject());
        return response;
    }

    private List<String> getPermissionNames(User user) {
        if (user.getRole() == null || user.getRole().getPermissions() == null) {
            return List.of();
        }

        return user.getRole().getPermissions().stream()
                .map(permission -> permission.getName())
                .sorted()
                .toList();
    }
}
