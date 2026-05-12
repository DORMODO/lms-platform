package com.lms.user.mapper;

import com.lms.user.dto.UserResponse;
import com.lms.user.model.User;

public class UserMapper {
    public static UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .roleName(user.getRole() != null ? user.getRole().getName() : null)
                .isApproved(user.getIsApproved())
                .build();
    }
}
