package com.lms.user.service;

import com.lms.user.dto.UserStatsResponse;
import com.lms.user.model.User;

import java.util.List;

public interface UserService {
    User getById(Long id);
    User getByEmail(String email);
    List<User> getAll();
    User updateUser(Long id, String fullName);
    void approveInstructor(Long id);
    UserStatsResponse getStats();
}
