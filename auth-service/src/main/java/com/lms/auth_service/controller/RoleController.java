package com.lms.auth_service.controller;

import com.lms.auth_service.dto.request.CreatePermissionRequest;
import com.lms.auth_service.dto.request.CreateRoleRequest;
import com.lms.auth_service.dto.response.RoleResponse;
import com.lms.auth_service.entity.Permission;
import com.lms.auth_service.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/auth/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    @GetMapping
    public List<RoleResponse> getAllRoles() {
        return roleService.getAllRoles();
    }

    @GetMapping("/permissions")
    public List<Permission> getAllPermissions() {
        return roleService.getAllPermissions();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RoleResponse createRole(@RequestBody CreateRoleRequest request) {
        return roleService.createRole(request);
    }

    @GetMapping("/{name}")
    public RoleResponse getRoleByName(@PathVariable String name) {
        return roleService.getRoleByName(name);
    }

    @DeleteMapping("/{roleId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRole(@PathVariable Long roleId) {
        roleService.deleteRole(roleId);
    }

    @PostMapping("/{roleId}/permissions")
    public RoleResponse addPermissionsToRole(@PathVariable Long roleId, @RequestBody Set<Long> permissionIds) {
        return roleService.addPermissionsToRole(roleId, permissionIds);
    }

    @DeleteMapping("/{roleId}/permissions/{permissionId}")
    public RoleResponse removePermissionFromRole(@PathVariable Long roleId, @PathVariable Long permissionId) {
        return roleService.removePermissionFromRole(roleId, permissionId);
    }

    @PostMapping("/permissions")
    @ResponseStatus(HttpStatus.CREATED)
    public Permission createPermission(@RequestBody CreatePermissionRequest request) {
        return roleService.createPermission(request);
    }
}
