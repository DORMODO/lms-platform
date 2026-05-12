package com.lms.auth_service.service.impl;

import com.lms.auth_service.entity.RefreshToken;
import com.lms.auth_service.entity.User;
import com.lms.auth_service.exception.InvalidRefreshTokenException;
import com.lms.auth_service.exception.RefreshTokenExpiredException;
import com.lms.auth_service.repo.RefreshTokenRepo;
import com.lms.auth_service.service.RefreshTokenService;
import com.lms.auth_service.utils.JwtProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class RefreshTokenServiceImpl implements RefreshTokenService {
    private static final String REFRESH_EXPIRY_CONFIG_ERROR =
            "Refresh token expiration must be configured with a positive jwt.refreshExpiration value";

    private final RefreshTokenRepo refreshTokenRepository;
    private final JwtProperties jwtProperties;

    @Override
    public String createRefreshToken(User user) {
        Long refreshExpiration = jwtProperties.getRefreshExpiration();

        if (refreshExpiration == null || refreshExpiration <= 0) {
            log.error("Invalid refresh token expiration config: {}", refreshExpiration);
            throw new IllegalStateException(REFRESH_EXPIRY_CONFIG_ERROR);
        }

        RefreshToken token = new RefreshToken();

        token.setUser(user);
        token.setToken(UUID.randomUUID().toString());
        token.setExpiryDate(Instant.now().plusMillis(refreshExpiration));

        refreshTokenRepository.save(token);

        log.debug("Refresh token created for user: {}", user.getEmail());
        return token.getToken();
    }

    @Override
    public RefreshToken validateRefreshToken(String tokenStr) {
        log.debug("Validating refresh token");
        
        RefreshToken token = refreshTokenRepository.findByToken(tokenStr)
                .orElseThrow(() -> {
                    log.warn("Invalid refresh token received");
                    return new InvalidRefreshTokenException();
                });

        if (token.getExpiryDate().isBefore(Instant.now())) {
            log.warn("Expired refresh token deleted for user: {}", token.getUser().getEmail());
            refreshTokenRepository.delete(token);
            throw new RefreshTokenExpiredException();
        }

        log.debug("Refresh token validated for user: {}", token.getUser().getEmail());
        return token;
    }
}