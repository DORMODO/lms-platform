package com.lms.user.repo;

import com.lms.user.model.Role;
import com.lms.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByRole(Role role);

    @Query("SELECT r.name, COUNT(u) FROM User u JOIN u.role r GROUP BY r.name")
    List<Object[]> countUsersByRole();

    @Query("SELECT COUNT(u) FROM User u JOIN u.role r WHERE r.name = 'INSTRUCTOR' AND u.isApproved = true")
    long countApprovedInstructors();

    @Query("SELECT COUNT(u) FROM User u JOIN u.role r WHERE r.name = 'INSTRUCTOR' AND (u.isApproved IS NULL OR u.isApproved = false)")
    long countPendingInstructors();

    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt >= :since")
    long countRecentRegistrations(@Param("since") LocalDateTime since);
}
