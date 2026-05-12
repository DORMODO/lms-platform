package com.lms.auth_service.utils;

import com.lms.auth_service.entity.User;
import com.lms.auth_service.exception.InvalidTokenException;
import com.lms.auth_service.exception.TokenExpiredException;
import io.jsonwebtoken.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtUtil {
    private final JwtProperties JwtProperties;

    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(String.valueOf(user.getId()))
                .claim("userId", String.valueOf(user.getId()))
                .claim("email", user.getEmail())
                .claim("role", user.getRole().getName())
                .claim("permissions", getPermissionNames(user))
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + JwtProperties.getExpiration()))
                .signWith(JwtProperties.signingKey(), SignatureAlgorithm.HS256)
                .compact();
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

    public Claims validateAndExtract(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(JwtProperties.signingKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

        } catch (ExpiredJwtException e) {
            throw new TokenExpiredException();
        } catch (JwtException e) {
            throw new InvalidTokenException();
        }
    }
}
