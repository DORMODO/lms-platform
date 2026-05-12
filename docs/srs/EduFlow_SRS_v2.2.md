# EduFlow Software Requirements Specification

Version: `2.2`
Status Date: `2026-04-22`
Status: `Revised to match current repository state`

## 1. Purpose

This SRS defines the current and planned requirements for EduFlow, an online learning management system built as a microservices-based platform. This version updates the earlier `EduFlow_SRS_v2.1.docx` so it reflects what is actually present in the repository today.

This revision separates:

- `Implemented`: available in the current repo
- `Partial`: scaffolded or incomplete
- `Planned`: intended but not yet implemented

## 2. Scope

EduFlow is a web-based LMS for:

- user registration and login
- role-based access control
- user profile management
- course browsing and future course delivery
- future payments, reviews, and notifications

Primary user roles:

- `ADMIN`
- `INSTRUCTOR`
- `STUDENT`
- `PUBLIC`

## 3. Product Overview

EduFlow uses a microservice architecture with an API Gateway and service discovery.

Current repo services:

| Service | Port | Status | Notes |
| --- | --- | --- | --- |
| API Gateway | 8080 | Implemented | JWT validation, route forwarding, RBAC rules for user APIs |
| Service Registry | 8761 | Implemented | Eureka server |
| Auth Service | 8086 | Implemented | Register, login, refresh, validate |
| User Service | 8081 | Implemented | User lookup, list, update, instructor approval endpoint |
| Course Service | 8083 | Partial | Service app exists, domain/API not implemented yet |
| Notification Service | 8085 | Partial | Service app exists, domain/API not implemented yet |
| Payment Service | N/A | Planned | Gateway route exists, service absent |
| Review Service | N/A | Planned | Gateway route exists, service absent |
| Frontend | Vite dev server | Partial | Auth, course, dashboard UI scaffolding exists |

## 4. Technology Stack

| Layer | Actual Current Stack |
| --- | --- |
| Backend | Spring Boot `4.0.5`, Java `21`, Maven |
| Service Discovery | Spring Cloud Netflix Eureka |
| Gateway | Spring Cloud Gateway WebFlux |
| Security | Spring Security + JWT (`jjwt 0.13.0`) |
| Databases | H2 in local app configs, PostgreSQL in Docker profiles |
| ORM | Spring Data JPA / Hibernate |
| Frontend | React `19`, Vite `8`, Axios, React Router `7`, Tailwind `4` |
| Containerization | Docker Compose |
| Cloud BOM | Spring Cloud `2025.1.1` |

## 5. Architecture Constraints

Current architectural rules in the repo:

- all client traffic should enter through `api-gateway`
- gateway performs JWT parsing and injects:
  - `X-User-Id`
  - `X-User-Email`
  - `X-User-Role`
- `/api/auth/**` is public
- `GET /api/courses/**` is currently public at gateway level
- downstream services currently trust gateway headers rather than reparsing JWT
- each implemented service has its own database configuration

Known architectural gap:

- auth-service uses numeric `Long` user IDs
- user-service uses `UUID` user IDs
- this creates an identity mismatch risk for self-access authorization

## 6. Functional Requirements

### 6.1 Authentication and Authorization

#### 6.1.1 Registration

Status: `Implemented with reduced scope`

Current behavior:

- public users can register with `email` and `password`
- duplicate email is rejected
- password is hashed
- newly registered users are created as `STUDENT`

Not implemented from prior SRS:

- registration with `name`
- registration with requested role
- instructor registration as `PENDING`
- instructor approval workflow inside auth-service

#### 6.1.2 Login

Status: `Implemented`

Current behavior:

- users log in with email and password
- auth-service returns:
  - access token
  - refresh token

JWT currently includes:

- `userId`
- `email`
- `role`

#### 6.1.3 Refresh Token

Status: `Implemented`

Current behavior:

- valid refresh token can be exchanged for a new access token
- refresh tokens are stored in auth-service persistence

#### 6.1.4 Token Validation

Status: `Implemented`

Current behavior:

- auth-service exposes token validation endpoint
- gateway does local JWT validation and does not depend on auth-service validation for normal request flow

#### 6.1.5 Gateway Authorization

Status: `Implemented for user-service routes only`

Current enforced rules:

- `GET /api/users` -> `ADMIN`
- `GET /api/users/email/{email}` -> `ADMIN`
- `PUT /api/users/{id}/approve-instructor` -> `ADMIN`
- `GET /api/users/{id}` -> `ADMIN` or self
- `PUT /api/users/{id}` -> `ADMIN` or self

### 6.2 User Management

Status: `Implemented with narrower scope than v2.1`

Current supported operations:

- get user by ID
- get user by email
- list all users
- update user full name
- approve instructor

Current endpoints:

- `GET /api/users`
- `GET /api/users/{id}`
- `GET /api/users/email/{email}`
- `PUT /api/users/{id}`
- `PUT /api/users/{id}/approve-instructor`

Not implemented from prior SRS:

- `/api/users/profile`
- deactivate/reactivate account
- password change in user-service
- role/status filters
- richer profile fields and self-profile endpoints

### 6.3 Course Management

Status: `Partial`

Current repo state:

- gateway route exists
- service application exists
- datasource and Eureka config exist
- no course controllers, entities, repositories, or business APIs are implemented yet

Planned requirements:

- course CRUD
- draft/publish lifecycle
- lessons and curriculum
- enrollments
- progress tracking
- public browsing and search

### 6.4 Payments

Status: `Planned`

Current repo state:

- gateway route for `/api/payments/**` exists
- webhook path is marked public in gateway config
- payment-service codebase is not present in the workspace

Planned requirements:

- Stripe checkout
- transaction records
- webhook processing
- enrollment activation after successful payment
- refunds

### 6.5 Notifications

Status: `Partial`

Current repo state:

- notification-service application exists
- mail dependency and mail config are present
- no notification controller, entity, repository, or service implementation exists yet

Planned requirements:

- enrollment notifications
- approval/rejection notifications
- payment notifications
- broadcast notifications
- notification history

Note:

- the old SRS says notifications are in-app only
- the current repo includes mail support, so the newer design should not lock the system to in-app only

### 6.6 Reviews and Ratings

Status: `Planned`

Current repo state:

- gateway route exists
- service implementation is missing

Planned requirements:

- one review per enrolled student per course
- rating aggregation
- instructor replies
- admin moderation

## 7. Non-Functional Requirements

### 7.1 Security

Status: `Partial`

Implemented:

- JWT-based authentication
- password hashing
- gateway route protection for user-service

Still needed:

- consistent downstream authorization checks for sensitive operations
- logout and token revocation flow
- stricter CORS for production
- HTTPS enforcement in deployment environments

### 7.2 Scalability

Status: `Partially satisfied by architecture`

Implemented:

- service separation
- service discovery
- stateless JWT-based access
- Dockerized local deployment

Still needed:

- actual horizontal deployment strategy
- caching strategy
- async messaging for side effects

### 7.3 Maintainability

Status: `Partial`

Implemented:

- service-per-domain structure
- separate configs and databases
- controller/service/repository layering in auth and user services

Still needed:

- consistent DTO strategy across all services
- API versioning conventions
- fuller test coverage

### 7.4 Observability

Status: `Partial`

Implemented:

- logging aspect in auth-service
- logging aspect in user-service

Still needed:

- correlation IDs
- distributed tracing
- metrics dashboards
- centralized log aggregation

## 8. Current API Overview

### 8.1 Auth Service

| Method | Endpoint | Access | Status |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | Implemented |
| POST | `/api/auth/login` | Public | Implemented |
| POST | `/api/auth/refresh` | Public | Implemented |
| GET | `/api/auth/validate` | Public | Implemented |

### 8.2 User Service

| Method | Endpoint | Access | Status |
| --- | --- | --- | --- |
| GET | `/api/users` | Admin | Implemented |
| GET | `/api/users/{id}` | Admin or self | Implemented |
| GET | `/api/users/email/{email}` | Admin | Implemented |
| PUT | `/api/users/{id}` | Admin or self | Implemented |
| PUT | `/api/users/{id}/approve-instructor` | Admin | Implemented |

### 8.3 Course Service

| Method | Endpoint | Access | Status |
| --- | --- | --- | --- |
| Any | `/api/courses/**` | Mixed | Route exists, service APIs not implemented |

### 8.4 Notification Service

| Method | Endpoint | Access | Status |
| --- | --- | --- | --- |
| Any | `/api/notifications/**` | Protected | Route exists, service APIs not implemented |

### 8.5 Payment Service

| Method | Endpoint | Access | Status |
| --- | --- | --- | --- |
| Any | `/api/payments/**` | Protected except webhook | Planned only |

### 8.6 Review Service

| Method | Endpoint | Access | Status |
| --- | --- | --- | --- |
| Any | `/api/reviews/**` | Protected | Planned only |

## 9. Data Model Summary

### 9.1 Auth Service

Current persisted concepts:

- users
- refresh tokens

Current auth user shape:

- `id` as `Long`
- `email`
- `password`
- `role`

### 9.2 User Service

Current persisted concepts:

- users

Current user shape:

- `id` as `UUID`
- `email`
- `fullName`
- `role`
- `isApproved`
- `createdAt`

### 9.3 Other Services

Course, notification, payment, and review schemas are not yet fully implemented in code and should not be documented as completed functionality.

## 10. Deployment Overview

Current `docker-compose.yml` includes:

- `service-registry`
- `api-gateway`
- `auth-service`
- `user-service`
- `course-service`
- `notification-service`
- `auth-db`
- `user-db`
- `course-db`
- `notification-db`

Not currently included in Docker Compose:

- `payment-service`
- `review-service`
- `frontend`

## 11. Current Gaps Against Product Vision

The major missing items are:

1. payment-service implementation
2. review-service implementation
3. actual course-service domain APIs
4. actual notification-service domain APIs
5. instructor approval lifecycle in auth-service
6. identity unification between auth-service and user-service
7. richer frontend integration with the unfinished services

## 12. Acceptance Status Summary

| Domain | Status |
| --- | --- |
| Gateway and service discovery | Implemented |
| JWT auth and refresh | Implemented |
| User CRUD basics | Implemented |
| Frontend auth/dashboard scaffolding | Partial |
| Course management | Partial |
| Notifications | Partial |
| Payments | Planned |
| Reviews | Planned |
| Full LMS workflow | Not yet complete |

## 13. Revision Notes from v2.1

This revision updates the older SRS by correcting:

- framework versions
- actual ports
- implemented versus planned services
- current API surface
- current docker-compose scope
- current frontend versions
- current notification direction
- missing implementation areas that v2.1 described as already complete

