package com.lms.auth_service.config;

import com.lms.auth_service.entity.Permission;
import com.lms.auth_service.entity.Role;
import com.lms.auth_service.entity.User;
import com.lms.auth_service.repo.PermissionRepo;
import com.lms.auth_service.repo.RoleRepo;
import com.lms.auth_service.repo.UserRepo;
import com.lms.auth_service.utils.PasswordHasher;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Set;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    public static final String DEFAULT_PASSWORD = "Password123";
    public static final String ADMIN_EMAIL = "admin@lms.com";
    public static final String INSTRUCTOR_EMAIL = "instructor@lms.com";

    private final UserRepo userRepo;
    private final RoleRepo roleRepo;
    private final PermissionRepo permissionRepo;
    private final PasswordHasher passwordHasher;

    @Bean
    CommandLineRunner seedAuthData() {
        return args -> {
            seedDefaultRoles();
            seedDefaultPermissions();
            assignDefaultPermissions();
            seedDefaultUsers();
        };
    }

    private void seedDefaultRoles() {
        if (roleRepo.findByName("ADMIN").isEmpty()) {
            Role adminRole = new Role();
            adminRole.setName("ADMIN");
            adminRole.setStatic(true);
            roleRepo.save(adminRole);
        }

        if (roleRepo.findByName("INSTRUCTOR").isEmpty()) {
            Role instructorRole = new Role();
            instructorRole.setName("INSTRUCTOR");
            instructorRole.setStatic(true);
            roleRepo.save(instructorRole);
        }

        if (roleRepo.findByName("STUDENT").isEmpty()) {
            Role studentRole = new Role();
            studentRole.setName("STUDENT");
            studentRole.setStatic(true);
            roleRepo.save(studentRole);
        }
    }

    private void seedDefaultPermissions() {
        Set.of(
                "users:read",
                "users:update",
                "users:delete",
                "roles:manage",
                "courses:read",
                "courses:create",
                "courses:update",
                "courses:update-own",
                "enrollments:create",
                "enrollments:read-own",
                "profile:read-own",
                "profile:update-own",
                "payments:read",
                "payments:manage",
                "payments:refund",
                "reviews:moderate",
                "audit:read"
        ).forEach(this::seedPermission);
    }

    private void seedPermission(String name) {
        permissionRepo.findByName(name).orElseGet(() -> {
            Permission permission = new Permission();
            permission.setName(name);
            permission.setDescription("Allows " + name);
            return permissionRepo.save(permission);
        });
    }

    private void assignDefaultPermissions() {
        assignPermissions("ADMIN", Set.of(
                "users:read",
                "users:update",
                "users:delete",
                "roles:manage",
                "courses:read",
                "courses:create",
                "courses:update",
                "courses:update-own",
                "enrollments:create",
                "enrollments:read-own",
                "profile:read-own",
                "profile:update-own",
                "payments:read",
                "payments:manage",
                "payments:refund",
                "reviews:moderate",
                "audit:read"
        ));

        assignPermissions("INSTRUCTOR", Set.of(
                "courses:read",
                "courses:create",
                "courses:update-own",
                "enrollments:read-own",
                "profile:read-own",
                "profile:update-own"
        ));

        assignPermissions("STUDENT", Set.of(
                "courses:read",
                "enrollments:create",
                "profile:read-own",
                "profile:update-own"
        ));
    }

    private void assignPermissions(String roleName, Set<String> permissionNames) {
        Role role = roleRepo.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Default role not found: " + roleName));

        permissionNames.stream()
                .map(permissionName -> permissionRepo.findByName(permissionName)
                        .orElseThrow(() -> new RuntimeException("Default permission not found: " + permissionName)))
                .forEach(role.getPermissions()::add);

        roleRepo.save(role);
    }

    private void seedDefaultUsers() {
        seedUser(ADMIN_EMAIL, "ADMIN");
        seedUser(INSTRUCTOR_EMAIL, "INSTRUCTOR");
    }

    private void seedUser(String email, String roleName) {
        if (userRepo.findByEmail(email).isPresent()) {
            return;
        }

        Role role = roleRepo.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Default role not found: " + roleName));

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordHasher.hashPassword(DEFAULT_PASSWORD));
        user.setRole(role);
        userRepo.save(user);
    }
}
