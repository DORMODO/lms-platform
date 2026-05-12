package com.lms.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor @NoArgsConstructor @Builder
public class UserResponse {
    private Long id;
    private String email;
    private String fullName;
    private String roleName;
    private Boolean isApproved;
}
