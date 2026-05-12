package com.lms.user.service.impl;

import com.lms.user.dto.UserStatsResponse;
import com.lms.user.exceptions.NotInstructorException;
import com.lms.user.exceptions.UserNotFoundException;
import com.lms.user.model.User;
import com.lms.user.repo.UserRepo;
import com.lms.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepo repository;

    @Override
    public User getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
    }

    @Override
    public User getByEmail(String email) {
        return repository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
    }

    @Override
    public List<User> getAll() {
        return repository.findAll();
    }

    @Override
    public User updateUser(Long id, String fullName) {
        User user = getById(id);
        user.setFullName(fullName);
        return repository.save(user);
    }

    @Override
    public void approveInstructor(Long id) {
        User user = getById(id);

        if (!"INSTRUCTOR".equals(user.getRole().getName())) {
            throw new NotInstructorException(id);
        }

        user.setIsApproved(true);
        repository.save(user);
    }

    @Override
    public UserStatsResponse getStats() {
        List<Object[]> roleCounts = repository.countUsersByRole();
        Map<String, Long> usersByRole = new HashMap<>();
        for (Object[] row : roleCounts) {
            usersByRole.put((String) row[0], (Long) row[1]);
        }

        long totalUsers = usersByRole.values().stream().mapToLong(Long::longValue).sum();
        long approvedInstructors = repository.countApprovedInstructors();
        long pendingInstructors = repository.countPendingInstructors();
        long recentRegistrations = repository.countRecentRegistrations(LocalDateTime.now().minusDays(30));

        return UserStatsResponse.builder()
                .totalUsers(totalUsers)
                .usersByRole(usersByRole)
                .approvedInstructors(approvedInstructors)
                .pendingInstructors(pendingInstructors)
                .recentRegistrations(recentRegistrations)
                .build();
    }
}