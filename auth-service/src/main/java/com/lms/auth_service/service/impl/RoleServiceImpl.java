package com.lms.auth_service.service.impl;

import com.lms.auth_service.dto.request.CreatePermissionRequest;
import com.lms.auth_service.dto.request.CreateRoleRequest;
import com.lms.auth_service.dto.response.RoleResponse;
import com.lms.auth_service.entity.Permission;
import com.lms.auth_service.entity.Role;
import com.lms.auth_service.repo.PermissionRepo;
import com.lms.auth_service.repo.RoleRepo;
import com.lms.auth_service.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepo roleRepo;
    private final PermissionRepo permissionRepo;

    @Override
    public List<RoleResponse> getAllRoles() {
        return roleRepo.findAll().stream()
                .map(RoleResponse::fromEntity)
                .toList();
    }

    @Override
    public List<Permission> getAllPermissions() {
        return permissionRepo.findAll();
    }

    @Override
    public RoleResponse createRole(CreateRoleRequest request) {
        if (roleRepo.findByName(request.getName()).isPresent()) {
            throw new IllegalArgumentException("Role already exists: " + request.getName());
        }

        Role role = new Role();
        role.setName(request.getName());
        role.setStatic(false);

        if (request.getPermissionIds() != null && !request.getPermissionIds().isEmpty()) {
            Set<Permission> permissions = new HashSet<>(permissionRepo.findAllById(request.getPermissionIds()));
            role.setPermissions(permissions);
        }

        Role savedRole = roleRepo.save(role);
        return RoleResponse.fromEntity(savedRole);
    }

    @Override
    public RoleResponse getRoleByName(String name) {
        Role role = roleRepo.findByName(name)
                .orElseThrow(() -> new IllegalArgumentException("Role not found: " + name));
        return RoleResponse.fromEntity(role);
    }

    @Override
    public void deleteRole(Long roleId) {
        Role role = roleRepo.findById(roleId)
                .orElseThrow(() -> new IllegalArgumentException("Role not found: " + roleId));

        if (role.isStatic()) {
            throw new IllegalStateException("Cannot delete static role: " + role.getName());
        }

        roleRepo.delete(role);
    }

    @Transactional
    @Override
    public RoleResponse addPermissionsToRole(Long roleId, Set<Long> permissionIds) {
        Role role = roleRepo.findById(roleId)
                .orElseThrow(() -> new IllegalArgumentException("Role not found: " + roleId));

        Set<Permission> permissionsToAdd = new HashSet<>(permissionRepo.findAllById(permissionIds));
        role.getPermissions().addAll(permissionsToAdd);

        return RoleResponse.fromEntity(roleRepo.save(role));
    }

    @Transactional
    @Override
    public RoleResponse removePermissionFromRole(Long roleId, Long permissionId) {
        Role role = roleRepo.findById(roleId)
                .orElseThrow(() -> new IllegalArgumentException("Role not found: " + roleId));

        Permission permission = permissionRepo.findById(permissionId)
                .orElseThrow(() -> new IllegalArgumentException("Permission not found: " + permissionId));

        role.getPermissions().remove(permission);
        return RoleResponse.fromEntity(roleRepo.save(role));
    }

    @Override
    public Permission createPermission(CreatePermissionRequest request) {
        if (permissionRepo.findByName(request.getName()).isPresent()) {
            throw new IllegalArgumentException("Permission already exists: " + request.getName());
        }

        Permission permission = new Permission();
        permission.setName(request.getName());
        permission.setDescription(request.getDescription());

        return permissionRepo.save(permission);
    }
}
