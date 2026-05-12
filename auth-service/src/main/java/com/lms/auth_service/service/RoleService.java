package com.lms.auth_service.service;

import com.lms.auth_service.dto.request.CreatePermissionRequest;
import com.lms.auth_service.dto.request.CreateRoleRequest;
import com.lms.auth_service.dto.response.RoleResponse;
import com.lms.auth_service.entity.Permission;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

public interface RoleService {
    List<RoleResponse> getAllRoles();
    List<Permission> getAllPermissions();
    RoleResponse createRole(CreateRoleRequest request);
    RoleResponse getRoleByName(String name);
    void deleteRole(Long roleId);
    @Transactional
    RoleResponse addPermissionsToRole(Long roleId, Set<Long> permissionIds);
    @Transactional
    RoleResponse removePermissionFromRole(Long roleId, Long permissionId);
    Permission createPermission(CreatePermissionRequest request);
}
