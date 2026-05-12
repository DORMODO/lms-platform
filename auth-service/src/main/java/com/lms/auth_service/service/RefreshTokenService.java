package com.lms.auth_service.service;

import com.lms.auth_service.entity.RefreshToken;
import com.lms.auth_service.entity.User;

public interface RefreshTokenService {
    String createRefreshToken(User user);
    RefreshToken validateRefreshToken(String token);
}