# SRS Gap Analysis

Reviewed Source:

- [EduFlow_SRS_v2.1.docx](/E:/lms-platform/lms-dev-environment/docs/srs/EduFlow_SRS_v2.1.docx)

Revised Reference:

- [EduFlow_SRS_v2.2.md](/E:/lms-platform/lms-dev-environment/docs/srs/EduFlow_SRS_v2.2.md)

## Overall Verdict

The old SRS is no longer fully aligned with the repository.

High-level status:

- core architecture direction is still correct
- auth and user-service sections are partially correct but overstated
- course, notification, payment, and review sections are mostly ahead of implementation
- version numbers, ports, and deployment details are outdated in several places

## What Is Still Accurate

- the system is microservice-based
- the gateway is the single public entry point
- Eureka is used for service discovery
- auth-service handles login and token issuing
- user-service exists as a separate service
- JWT-based auth is used
- Docker Compose is the local orchestration mechanism

## Outdated or Incorrect

### 1. Technology versions are outdated

The old SRS says:

- Spring Boot `3.4.x`
- Spring Cloud BOM `2023.0.3`
- React `18`
- `jjwt 0.11.5`

The repo currently uses:

- Spring Boot `4.0.5`
- Spring Cloud `2025.1.1`
- React `19`
- `jjwt 0.13.0`

### 2. Service ports are outdated

The old SRS assigns:

- course-service -> `8082`
- payment-service -> `8083`
- notification-service -> `8084`
- review-service -> `8085`

The repo currently has:

- course-service -> `8083`
- notification-service -> `8085`
- payment-service -> missing
- review-service -> missing

### 3. Some services are described as completed but are not implemented

The old SRS describes full APIs and database schemas for:

- course-service
- payment-service
- notification-service
- review-service

Current repo reality:

- course-service exists only as a scaffold
- notification-service exists only as a scaffold
- payment-service is absent
- review-service is absent

### 4. User-service API is different from the SRS

The old SRS documents profile-style endpoints such as:

- `/api/users/profile`
- `/api/users/admin/users`

The actual implemented user-service endpoints are:

- `/api/users`
- `/api/users/{id}`
- `/api/users/email/{email}`
- `/api/users/{id}`
- `/api/users/{id}/approve-instructor`

### 5. Auth workflow is overstated

The old SRS claims:

- user registers with `name`, `email`, `password`, and `role`
- instructors start as `PENDING`
- admins approve/reject instructors in auth-service

The current auth-service actually:

- accepts only `email` and `password`
- creates new users as `STUDENT`
- does not implement pending/reject flows in auth-service controller

### 6. Inter-service communication is overstated

The old SRS says OpenFeign synchronous calls are the system-wide integration model.

Current repo reality:

- auth-service has OpenFeign dependency
- implemented Feign-based workflows are not present in code for payment, review, notification, or course interactions

### 7. Notification scope is outdated

The old SRS says notifications are in-app only.

Current repo reality:

- notification-service includes Spring Mail support and mail configuration
- actual notification features are not implemented yet
- SRS should not lock the design to in-app only anymore

### 8. Docker deployment section is ahead of reality

The old SRS describes Docker Compose services for:

- payment-service
- review-service
- frontend
- six Postgres containers

Current `docker-compose.yml` includes only:

- auth, user, course, notification, gateway, registry
- four Postgres containers for those services

## Missing from the Old SRS

### 1. Identity mismatch risk

Current repo issue:

- auth-service user IDs are `Long`
- user-service user IDs are `UUID`

This is important because gateway self-access authorization compares JWT `userId` with path IDs.

### 2. Current gateway RBAC details

The repo has concrete authorization rules in the gateway for user APIs, and the SRS should document those actual enforced rules.

### 3. Current frontend state

The repo already contains:

- login page
- register page
- dashboards
- course list/detail UI scaffolding
- auth context and protected routes

The old SRS treats frontend mostly as a plan and does not reflect the actual current structure.

### 4. Current local database split

The repo uses:

- H2 for local app configs
- PostgreSQL in Docker profile/config

The old SRS presents PostgreSQL-only wording too strongly for the current codebase.

## Recommended Next Documentation Updates

1. Treat `EduFlow_SRS_v2.2.md` as the living SRS for the current repo.
2. Keep the old `.docx` as historical submission material unless you specifically need it updated too.
3. Update the API contracts document next so it matches the currently implemented endpoints.
4. Add a completion matrix to README so repo status is obvious without reading the whole SRS.

