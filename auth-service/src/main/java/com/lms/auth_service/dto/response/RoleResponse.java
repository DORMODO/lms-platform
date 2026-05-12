package com.lms.auth_service.dto.response;

import com.lms.auth_service.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoleResponse {
    private Long id;
    private String name;
    private boolean isStatic;
    private List<String> permissions;
    private LocalDateTime createdAt;

    public static RoleResponse fromEntity(Role role) {
        RoleResponse response = new RoleResponse();
        response.setId(role.getId());
        response.setName(role.getName());
        response.setStatic(role.isStatic());
        response.setCreatedAt(role.getCreatedAt());
        if (role.getPermissions() != null) {
            response.setPermissions(role.getPermissions().stream()
                    .map(p -> p.getName())
                    .toList());
        }
        return response;
    }
}
