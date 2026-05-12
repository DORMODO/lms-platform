package com.lms.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserStatsResponse {
    private long totalUsers;
    private Map<String, Long> usersByRole;
    private long approvedInstructors;
    private long pendingInstructors;
    private long recentRegistrations;
}
