# EduFlow — Software Requirements Specification

**Version:** 3.0  
**Date:** 2026-05-08  
**Status:** Final — Complete System Analysis  
**Prepared for:** LMS Platform Engineering Team  
**Document Type:** Full System Specification

---

## Table of Contents

1. [Introduction](#1-introduction)  
   1.1 Purpose  
   1.2 Document Conventions  
   1.3 Intended Audience  
   1.4 Product Scope  
   1.5 References  

2. [Overall Description](#2-overall-description)  
   2.1 Product Perspective  
   2.2 Product Functions  
   2.3 User Characteristics  
   2.4 Operating Environment  
   2.5 Design and Implementation Constraints  
   2.6 User Documentation  
   2.7 Assumptions and Dependencies  

3. [System Architecture](#3-system-architecture)  
   3.1 Architectural Style  
   3.2 Service Topology  
   3.3 Communication Patterns  
   3.4 Technology Stack  
   3.5 Service Dependencies  

4. [External Interface Requirements](#4-external-interface-requirements)  
   4.1 User Interfaces  
   4.2 Hardware Interfaces  
   4.3 Software Interfaces  
   4.4 Communication Interfaces  

5. [Functional Requirements](#5-functional-requirements)  
   5.1 Authentication and Authorization  
   5.2 User Management  
   5.3 Course Management  
   5.4 Enrollment Management  
   5.5 Learning and Progress Tracking  
   5.6 Payment Processing  
   5.7 Reviews and Ratings  
   5.8 Notifications  
   5.9 Semantic Search  
   5.10 Role and Permission Management  
   5.11 Audit Logging  

6. [Non-Functional Requirements](#6-non-functional-requirements)  
   6.1 Security  
   6.2 Performance  
   6.3 Scalability  
   6.4 Availability  
   6.5 Maintainability  
   6.6 Reliability  
   6.7 Observability  
   6.8 Portability  

7. [Data Model](#7-data-model)  
   7.1 Auth Service Schema  
   7.2 User Service Schema  
   7.3 Course Service Schema  
   7.4 Payment Service Schema  
   7.5 Notification Service Schema  
   7.6 Review Service Schema  
   7.7 Semantic Search Schema  

8. [API Specification](#8-api-specification)  
   8.1 Auth Service API  
   8.2 User Service API  
   8.3 Course Service API  
   8.4 Payment Service API  
   8.5 Notification Service API  
   8.6 Review Service API  
   8.7 Semantic Search API  
   8.8 API Gateway Routes  

9. [Security Requirements](#9-security-requirements)  
   9.1 Authentication  
   9.2 Authorization  
   9.3 Data Protection  
   9.4 Network Security  
   9.5 Audit  

10. [Deployment Requirements](#10-deployment-requirements)  
    10.1 Local Development  
    10.2 Production  

11. [Implementation Status](#11-implementation-status)  
12. [Future Scope](#12-future-scope)  

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) describes the complete requirements for **EduFlow**, a cloud-native Learning Management System (LMS) built on a microservice architecture. The document defines all functional and non-functional requirements, system architecture, data models, API contracts, security constraints, and deployment topology. It serves as the authoritative reference for engineering, QA, and operations teams.

### 1.2 Document Conventions

| Convention | Meaning |
|---|---|
| `SHALL` | Mandatory requirement |
| `SHOULD` | Recommended requirement |
| `MAY` | Optional requirement |
| **Implemented** | Feature exists in current codebase |
| **Partial** | Feature is scaffolded but incomplete |
| **Planned** | Feature is designed but not yet built |

### 1.3 Intended Audience

- Engineering team (backend, frontend, infrastructure)
- QA and test engineering
- DevOps and site reliability
- Product management
- Technical documentation writers
- Security reviewers

### 1.4 Product Scope

EduFlow is a web-based learning management platform that enables:

- **Student** self-registration, course browsing, enrollment (free and paid), content consumption, progress tracking, and reviews
- **Instructor** course creation, content management (lessons/modules), publishing workflow, and performance analytics
- **Admin** user management, role-based access control, instructor approval, audit oversight, content moderation, and system configuration

The system serves three primary roles (`ADMIN`, `INSTRUCTOR`, `STUDENT`) with a fine-grained permission model built on role-permission mappings.

### 1.5 References

| Document | Location |
|---|---|
| System Design Document | `docs/SYSTEM_DESIGN.md` |
| Security Architecture | `docs/LMS-Security-Architecture.md` |
| SRS v2.2 (previous) | `docs/srs/EduFlow_SRS_v2.2.md` |
| Gap Analysis | `docs/srs/SRS_GAP_ANALYSIS_2026-04-22.md` |
| Git Workflow | `docs/BRANCH_STRATEGY.md` |
| Postman Collection | `docs/postman/EduFlow_Complete.postman_collection.json` |

---

## 2. Overall Description

### 2.1 Product Perspective

EduFlow is a **greenfield platform** built as a microservice system from inception. It operates as a gateway-first architecture where all client traffic enters through a centralized API Gateway (Spring Cloud Gateway) that handles JWT validation, RBAC enforcement, and request routing to downstream domain services. Service discovery is managed by Netflix Eureka.

The system uses a **database-per-service** pattern to enforce domain boundaries. Cross-service communication uses REST (synchronous) for query operations and RabbitMQ (asynchronous) for event-driven side effects such as payment confirmations, course indexing, and notifications.

### 2.2 Product Functions

| Function Area | Summary |
|---|---|
| Authentication | Register, login, token refresh, JWT validation, password hashing |
| Authorization | RBAC at API Gateway, permission-based access control, role management |
| User Management | CRUD profiles, instructor approval, role assignment, user deletion |
| Course Management | CRUD courses, modules/lessons, draft/publish lifecycle, categorization |
| Enrollment | Enroll in courses, prevent duplicate enrollment, free and paid flows |
| Progress Tracking | Mark lessons complete, calculate course completion percentage |
| Payments | Stripe checkout integration, webhook processing, transaction history, refunds |
| Reviews & Ratings | Submit reviews, rating aggregation, moderation, instructor replies |
| Notifications | Email delivery, in-app notifications, event-triggered messaging |
| Semantic Search | FAISS-powered vector search across course content |
| Audit Logging | Track create/update/delete operations with user identity |
| Role & Permissions | Create custom roles, assign granular permissions, manage RBAC matrix |

### 2.3 User Characteristics

| Role | Description | Privileges |
|---|---|---|
| **PUBLIC** (Unauthenticated) | Visitors browsing the catalog | View course catalog and course details |
| **STUDENT** | Learners consuming course content | Enroll in courses, access enrolled content, track progress, submit reviews for enrolled courses |
| **INSTRUCTOR** | Content creators | Create and manage own courses, publish content, view student analytics for own courses |
| **ADMIN** | System operators | Full access: user management, role/permission administration, content moderation, instructor approval, audit log access |

### 2.4 Operating Environment

| Environment | Infrastructure |
|---|---|
| **Local Development** | Docker Compose, H2 (dev) / PostgreSQL (docker), each service on dedicated port |
| **Staging** | Kubernetes (recommended), managed PostgreSQL, RabbitMQ |
| **Production** | Kubernetes, managed PostgreSQL with replicas, RabbitMQ cluster, Redis cache, CDN for content |

### 2.5 Design and Implementation Constraints

1. **Gateway-first**: All external traffic MUST pass through the API Gateway. Direct service access MUST be blocked in non-local environments.
2. **JWT validation at gateway only**: Downstream services trust `X-User-*` headers injected by the gateway; they MUST NOT re-validate JWTs.
3. **Database per service**: Each microservice owns its database schema. Cross-service queries MUST use API calls or events, not shared databases.
4. **Java 21 + Spring Boot 4.x**: Backend services conform to this baseline (except payment-service which uses Spring Boot 3.4.x).
5. **Eventual consistency**: Cross-service side effects (notifications, search indexing) SHOULD use async messaging.
6. **No shared secrets in source**: JWT secrets, database passwords, API keys MUST be injected via environment variables or secret managers.

### 2.6 User Documentation

- API documentation available via Swagger UI at `/swagger-ui.html` per service
- Postman collection at `docs/postman/EduFlow_Complete.postman_collection.json`
- This SRS serves as the primary functional specification

### 2.7 Assumptions and Dependencies

- **Stripe** is the sole payment gateway; no alternative provider is currently planned
- **PostgreSQL 15** is the only supported production database
- **RabbitMQ** is the event broker for async communication
- **FAISS** (Facebook AI Similarity Search) powers semantic search; no alternative search backend is planned
- Email delivery requires an external SMTP provider (configurable per environment)
- All services run in the same Kubernetes cluster or Docker network for local development
- User identity between auth-service (Long IDs) and user-service (UUID IDs) requires a reconciliation strategy

---

## 3. System Architecture

### 3.1 Architectural Style

EduFlow uses a **microservice architecture** with the following principles:

- Each service encapsulates a single business domain
- Each service owns its database (database-per-service pattern)
- All external traffic enters through the API Gateway
- Service discovery via Eureka (local) or Kubernetes DNS (production)
- Authentication centralized in auth-service; authorization enforced at gateway and optionally downstream
- Asynchronous events for cross-domain side effects (notifications, search indexing, payment confirmations)

### 3.2 Service Topology

```
┌─────────────────────────────────────────────────────────────────┐
│                            CLIENTS                               │
│                  (React SPA / Mobile / API)                      │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API GATEWAY (port 8080)                      │
│  ┌─────────────┐ ┌──────────────┐ ┌──────────────────────────┐  │
│  │PublicPath   │ │JwtValidator  │ │AccessRuleEngine (RBAC)   │  │
│  │Checker      │ │              │ │                          │  │
│  └─────────────┘ └──────────────┘ └──────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  UserHeaderInjector (X-User-Id, X-User-Email, X-User-   │   │
│  │                     Role, X-User-Permissions)            │   │
│  └──────────────────────────────────────────────────────────┘   │
└───────┬─────────┬──────────┬──────────┬──────────┬──────────────┘
        │         │          │          │          │
   ┌────▼──┐ ┌───▼───┐ ┌───▼────┐ ┌───▼───┐ ┌───▼────┐ ┌───────┐
   │Auth   │ │User   │ │Course  │ │Payment│ │Notif.  │ │Review │
   │:8086  │ │:8081  │ │:8083   │ │:8084  │ │:8085   │ │:8086  │
   └───┬───┘ └───┬───┘ └───┬────┘ └───┬───┘ └───┬───┘ └───┬───┘
       │         │         │         │         │         │
   ┌───▼───┐ ┌───▼───┐ ┌───▼────┐ ┌──▼──┐ ┌──▼────┐ ┌──▼────┐
   │Postgres│ │Postgres│ │Postgres │ │Post.│ │Post.  │ │Post.  │
   │Auth DB │ │User DB│ │Course DB│ │Pay  │ │Notif  │ │Review │
   └───────┘ └───────┘ └─────────┘ └─────┘ └───────┘ └───────┘

   ┌──────────────────┐  ┌──────────────────┐  ┌────────────────┐
   │ Service Registry │  │  RabbitMQ        │  │  Semantic      │
   │ Eureka :8761     │  │  (Event Bus)     │  │  Search :8084  │
   └──────────────────┘  └──────────────────┘  └────────────────┘
```

### 3.3 Communication Patterns

| Pattern | Protocol | Use Cases |
|---|---|---|
| Synchronous REST | HTTP/JSON via API Gateway | CRUD operations, queries, authentication |
| Service-to-service REST | HTTP/JSON (Feign clients) | Enrollment → Notification |
| Async Events | RabbitMQ (AMQP) | Payment → Enrollment, Course → Search Index, Review → Rating |
| Gateway → Auth | WebClient (load-balanced) | Token validation on every authenticated request |

**Event Catalog:**

| Event | Publisher | Consumer(s) | Payload |
|---|---|---|---|
| `PaymentSuccessEvent` | Payment Service | Course Service, Notification Service | `{studentId, courseId, amount}` |
| `CourseUpdatedEvent` | Course Service | Semantic Search Service | `{courseId, title, description, lessons}` |
| `EnrollmentCreatedEvent` | Course Service | Notification Service | `{studentId, courseId, enrolledAt}` |
| `UserRegisteredEvent` | Auth Service | Notification Service | `{userId, email, role}` |

### 3.4 Technology Stack

| Layer | Technology | Version |
|---|---|---|
| **Backend Runtime** | Java | 21 (LTS) |
| **Framework** | Spring Boot | 4.0.5 |
| **Cloud BOM** | Spring Cloud | 2025.1.1 |
| **Gateway** | Spring Cloud Gateway (WebFlux) | — |
| **Service Discovery** | Netflix Eureka | — |
| **Database** | PostgreSQL | 15 |
| **ORM** | Spring Data JPA / Hibernate | — |
| **Auth** | JSON Web Tokens (jjwt) | 0.13.0 |
| **Message Broker** | RabbitMQ | — |
| **Frontend** | React | 19 |
| **Frontend Build** | Vite | 8 |
| **Frontend Routing** | React Router | 7 |
| **Frontend Styling** | Tailwind CSS | 4 |
| **Frontend State** | TanStack React Query | — |
| **UI Components** | Radix UI Primitives | — |
| **API Client** | Axios | — |
| **Form Validation** | Zod + React Hook Form | — |
| **Animations** | Framer Motion | — |
| **Semantic Search** | FAISS + sentence-transformers | — |
| **Search API** | FastAPI (Python) | — |
| **Payment** | Stripe | — |
| **Email** | Spring Mail (SMTP) | — |
| **Containerization** | Docker + Docker Compose | — |

### 3.5 Service Dependencies

```
                    ┌──────────────────────┐
                    │   Service Registry   │
                    │     (Eureka)         │
                    └──────────┬───────────┘
                               │ registers
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
   ┌────▼────┐          ┌─────▼─────┐          ┌─────▼─────┐
   │  Auth   │          │   API     │          │ Semantic  │
   │ Service │          │  Gateway  │          │  Search   │
   └────┬────┘          └─────┬─────┘          └─────┬─────┘
        │                     │                      │
        │            ┌────────┼────────┐             │
        │            │        │        │             │
   ┌────▼────┐  ┌────▼───┐ ┌──▼───┐ ┌──▼───┐  ┌────▼─────┐
   │ Shared  │  │  User  │ │Course│ │Notif │  │ RabbitMQ │
   │   DB    │  │Service │ │Service│ │Srvc  │  │          │
   └─────────┘  └────────┘ └──┬────┘ └──────┘  └────┬─────┘
                              │                     │
                         ┌────▼────┐          ┌─────▼─────┐
                         │Payment  │          │  Course    │
                         │Service  │          │  Consumer  │
                         └─────────┘          └───────────┘
```

**Dependency Rules:**

- Auth Service depends on: Shared DB, Eureka
- User Service depends on: Shared DB, Eureka
- Course Service depends on: Course DB, Eureka, Notification Service (Feign)
- Payment Service depends on: Payment DB, RabbitMQ, Stripe
- Notification Service depends on: Notification DB, Eureka, SMTP
- Review Service depends on: Review DB, Eureka
- Semantic Search depends on: RabbitMQ, FAISS index
- API Gateway depends on: Eureka, Auth Service (validation endpoint)

---

## 4. External Interface Requirements

### 4.1 User Interfaces

The frontend is a single-page application (SPA) built with React 19, served by Vite 8.

#### 4.1.1 Public Pages

| Page | Route | Description |
|---|---|---|
| Home/Landing | `/` | Hero section, course catalog with search and category filters, featured courses |
| Course Detail | `/courses/:id` | Full course info, curriculum, instructor, enrollment CTA |
| Login | `/login` | Email/password authentication |
| Register | `/register` | Email/password registration with role selection |
| Unauthorized | `/unauthorized` | 403 error page |

#### 4.1.2 Authenticated Pages (Role-Based)

**Student Dashboard** (`/student/*`):

| Page | Route | Description |
|---|---|---|
| Dashboard | `/student/dashboard` | Enrolled courses, stats, recent activity |
| My Courses | `/student/courses` | List of enrolled courses |
| Course Detail | `/student/courses/:id` | Enrolled course view with lessons |
| Learning Interface | `/student/learn/:courseId/:lessonId` | Full lesson player with progress |
| Checkout | `/student/checkout/:courseId` | Payment for paid courses |
| Payments | `/student/payments` | Payment history |
| Profile | `/student/profile` | User profile editing |

**Instructor Dashboard** (`/instructor/*`):

| Page | Route | Description |
|---|---|---|
| Dashboard | `/instructor/dashboard` | Course stats, student count |
| My Courses | `/instructor/courses` | Course list with status |
| Course Editor | `/instructor/courses/:id` | Create/edit course, manage lessons |
| Profile | `/instructor/profile` | Profile editing |

**Admin Dashboard** (`/admin/*`):

| Page | Route | Description |
|---|---|---|
| Dashboard | `/admin/dashboard` | System-wide stats |
| Users | `/admin/users` | User management (CRUD, role assignment) |
| Roles | `/admin/roles` | Role and permission management |
| Audit Logs | `/admin/audit` | System audit log viewer |
| Profile | `/admin/profile` | Profile editing |

#### 4.1.3 UI/UX Requirements

- Responsive design supporting desktop and tablet viewports
- Dark mode / light mode toggle (persisted to localStorage)
- Loading states: skeleton loaders for data fetching
- Error states: inline error messages, error boundary for crash recovery
- Empty states: contextual empty state illustrations/messages
- Toast notifications for success/error/info events (sonner library)
- Form validation with inline error messages (Zod schema)
- Keyboard shortcuts for power users
- Animations: Framer Motion for page transitions and micro-interactions

### 4.2 Hardware Interfaces

No direct hardware interfaces. The system runs on commodity server hardware in containerized environments.

### 4.3 Software Interfaces

| External System | Interface | Purpose |
|---|---|---|
| **Stripe** | REST API + Webhooks | Payment processing, checkout sessions, refunds |
| **SMTP Provider** | JavaMail (SMTP) | Email delivery for notifications |
| **PostgreSQL 15** | JDBC (5432) | Primary data store |
| **RabbitMQ** | AMQP 0-9-1 (5672) | Async event messaging |
| **Browser** | HTTP/HTTPS | Frontend delivery and API consumption |

### 4.4 Communication Interfaces

| Interface | Protocol | Details |
|---|---|---|
| Client → Gateway | HTTP/1.1 or HTTP/2 | JSON over REST, Bearer token auth |
| Gateway → Services | HTTP/1.1 (load-balanced) | JSON, `X-User-*` headers for identity |
| Service → Service | HTTP/1.1 (Feign) | JSON, internal network only |
| Async Events | AMQP 0-9-1 | JSON serialized, RabbitMQ exchanges |
| Stripe → Gateway | HTTPS Webhook | Signed POST requests, verified via Stripe signatures |
| Frontend → Gateway | HTTP (REST + WebSocket future) | JSON, Bearer token, 401 auto-refresh |

---

## 5. Functional Requirements

### 5.1 Authentication and Authorization

#### FR-101: User Registration
| ID | FR-101 |
|---|---|
| Description | Public users SHALL register with email and password |
| Endpoint | `POST /api/auth/register` |
| Input | `{ email, password, role? }` |
| Validation | Email: valid format; Password: 8-50 characters; Role: must exist if provided |
| Behavior | Duplicate email SHALL be rejected. Password SHALL be hashed (peppered + salted). New users default to STUDENT role unless a valid role is specified. AuthResponse SHALL be returned with access and refresh tokens. |
| Status | **Implemented** |

#### FR-102: User Login
| ID | FR-102 |
|---|---|
| Description | Registered users SHALL log in with email and password |
| Endpoint | `POST /api/auth/login` |
| Input | `{ email, password }` |
| Behavior | Invalid credentials SHALL return 401. Successful login SHALL return AuthResponse with access token, refresh token, role, email, and permissions. |
| Status | **Implemented** |

#### FR-103: Token Refresh
| ID | FR-103 |
|---|---|
| Description | Users SHALL refresh expired access tokens using a valid refresh token |
| Endpoint | `POST /api/auth/refresh` |
| Input | `{ refreshToken }` |
| Behavior | Expired or invalid refresh tokens SHALL be rejected. Valid tokens SHALL return a new access token. |
| Status | **Implemented** |

#### FR-104: Token Validation
| ID | FR-104 |
|---|---|
| Description | The gateway SHALL validate JWT tokens by calling the auth-service |
| Endpoint | `GET /api/auth/validate?token=` |
| Behavior | Returns `{ valid, userId, email, role, permissions }`. The gateway uses this for every protected request. |
| Status | **Implemented** |

#### FR-105: JWT Structure
| ID | FR-105 |
|---|---|
| Description | Access tokens SHALL contain standard and custom claims |
| Claims | `sub` (userId), `userId`, `email`, `role`, `permissions`, `iat`, `exp` |
| Algorithm | HS256 |
| Secret | Configurable via `JWT_SECRET` environment variable |
| Expiration | Configurable via `JWT_EXPIRATION_MS` (default: 1 hour) |
| Refresh TTL | Configurable via `JWT_REFRESH_EXPIRATION_MS` (default: 7 days) |
| Status | **Implemented** |

#### FR-106: Gateway RBAC Enforcement
| ID | FR-106 |
|---|---|
| Description | The API Gateway SHALL enforce role-based and permission-based access rules |
| Mechanism | `AccessRuleEngine` in the gateway matches request path + method against defined rules |
| Rule types | Permission-required rules, self-access rules (user matches path ID) |
| Default | Paths without matching rules SHALL be allowed |
| Public paths | `/api/auth/**`, `POST /api/payments/webhook`, `GET /api/courses/**` |
| Status | **Implemented** |

#### FR-107: Public Path Access
| ID | FR-107 |
|---|---|
| Description | Certain paths SHALL be accessible without authentication |
| Paths | `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/refresh`, `GET /api/auth/validate`, `GET /api/courses/**`, `POST /api/payments/webhook` |
| Status | **Implemented** |

### 5.2 User Management

#### FR-201: List Users
| ID | FR-201 |
|---|---|
| Description | ADMIN users SHALL list all users |
| Endpoint | `GET /api/users` |
| Permission | `users:read` |
| Status | **Implemented** |

#### FR-202: Get User by ID
| ID | FR-202 |
|---|---|
| Description | Users SHALL retrieve their own profile; ADMIN SHALL retrieve any profile |
| Endpoint | `GET /api/users/{id}` |
| Permission | `users:read` or self |
| Status | **Implemented** |

#### FR-203: Get User by Email
| ID | FR-203 |
|---|---|
| Description | ADMIN users SHALL look up users by email |
| Endpoint | `GET /api/users/email/{email}` |
| Permission | `users:read` |
| Status | **Implemented** |

#### FR-204: Update User
| ID | FR-204 |
|---|---|
| Description | Users SHALL update their own profile; ADMIN SHALL update any profile |
| Endpoint | `PUT /api/users/{id}` |
| Permission | `users:update` or self |
| Fields | `fullName` |
| Status | **Implemented** |

#### FR-205: Approve Instructor
| ID | FR-205 |
|---|---|
| Description | ADMIN users SHALL approve instructor accounts |
| Endpoint | `PUT /api/users/{id}/approve-instructor` |
| Permission | `users:update` |
| Behavior | Sets `isApproved = true` |
| Status | **Implemented** |

#### FR-206: Assign Role
| ID | FR-206 |
|---|---|
| Description | ADMIN users SHALL assign roles to users |
| Endpoint | `PUT /api/auth/users/{userId}/role` |
| Permission | `roles:manage` |
| Status | **Implemented** |

#### FR-207: Delete User
| ID | FR-207 |
|---|---|
| Description | ADMIN users with `users:delete` permission SHALL delete users |
| Endpoint | `DELETE /api/auth/users/{userId}` |
| Permission | `users:delete` |
| Constraint | ADMIN cannot delete own account |
| Status | **Implemented** |

### 5.3 Course Management

#### FR-301: Create Course
| ID | FR-301 |
|---|---|
| Description | Instructors and ADMIN SHALL create courses |
| Endpoint | `POST /api/courses` |
| Permission | `courses:create` |
| Input | `{ title, description, price, category, difficultyLevel, thumbnailUrl }` |
| Behavior | Course SHALL be created in DRAFT status |
| Status | **Implemented** |

#### FR-302: Get Course by ID
| ID | FR-302 |
|---|---|
| Description | Anyone SHALL view published course details |
| Endpoint | `GET /api/courses/{courseId}` |
| Access | Public (published courses) |
| Status | **Implemented** |

#### FR-303: List Courses / Search
| ID | FR-303 |
|---|---|
| Description | Anyone SHALL browse and search published courses |
| Endpoint | `GET /api/courses` |
| Parameters | `search`, `category`, `difficultyLevel`, `page`, `size` |
| Access | Public |
| Status | **Implemented** |

#### FR-304: Update Course
| ID | FR-304 |
|---|---|
| Description | Course owners and ADMIN SHALL update courses |
| Endpoint | `PUT /api/courses/{courseId}` |
| Permission | `courses:update` (owner-checked) |
| Status | **Implemented** |

#### FR-305: Publish Course
| ID | FR-305 |
|---|---|
| Description | Instructors SHALL publish courses to make them visible in the catalog |
| Endpoint | `POST /api/courses/{courseId}/publish` |
| Permission | Owner or ADMIN |
| Status | **Implemented** |

#### FR-306: Delete Course
| ID | FR-306 |
|---|---|
| Description | Course owners and ADMIN SHALL delete courses |
| Endpoint | `DELETE /api/courses/{courseId}` |
| Permission | `courses:update` (owner-checked) |
| Status | **Implemented** |

#### FR-307: Get Instructor Courses
| ID | FR-307 |
|---|---|
| Description | Instructors SHALL list their own courses (including drafts) |
| Endpoint | `GET /api/courses/instructor/{instructorId}` |
| Status | **Implemented** |

#### FR-308: Add Lesson
| ID | FR-308 |
|---|---|
| Description | Course owners SHALL add lessons to their courses |
| Endpoint | `POST /api/courses/{courseId}/lessons` |
| Input | `{ title, type, contentUrl, duration, position }` |
| Types | `VIDEO`, `TEXT`, `QUIZ` |
| Status | **Implemented** |

#### FR-309: List Lessons
| ID | FR-309 |
|---|---|
| Description | Anyone viewing a course SHALL see its lesson list |
| Endpoint | `GET /api/courses/{courseId}/lessons` |
| Status | **Implemented** |

#### FR-310: Update Lesson
| ID | FR-310 |
|---|---|
| Description | Course owners SHALL update lesson content |
| Endpoint | `PUT /api/courses/{courseId}/lessons/{lessonId}` |
| Status | **Implemented** |

#### FR-311: Delete Lesson
| ID | FR-311 |
|---|---|
| Description | Course owners SHALL delete lessons |
| Endpoint | `DELETE /api/courses/{courseId}/lessons/{lessonId}` |
| Status | **Implemented** |

#### FR-312: Course Categorization
| ID | FR-312 |
|---|---|
| Description | Courses SHALL support categorization by category, difficulty level (BEGINNER, INTERMEDIATE, ADVANCED), and status (DRAFT, PUBLISHED) |
| Status | **Implemented** |

### 5.4 Enrollment Management

#### FR-401: Enroll in Course
| ID | FR-401 |
|---|---|
| Description | Authenticated students SHALL enroll in courses |
| Endpoint | `POST /api/courses/{courseId}/enroll` |
| Behavior | Duplicate enrollment SHALL be rejected. Free courses enroll immediately. Paid courses require payment first (pending payment service integration). |
| Status | **Implemented** (course-service enrollment); **Partial** (payment integration) |

#### FR-402: Check Enrollment
| ID | FR-402 |
|---|---|
| Description | Users SHALL check if they are enrolled in a course |
| Endpoint | `GET /api/courses/{courseId}/enrollment-check` |
| Status | **Implemented** |

#### FR-403: List Course Enrollments
| ID | FR-403 |
|---|---|
| Description | Course owners SHALL list enrolled students |
| Endpoint | `GET /api/courses/{courseId}/enrollments` |
| Status | **Implemented** |

#### FR-404: Get My Enrollments
| ID | FR-404 |
|---|---|
| Description | Students SHALL list their enrolled courses |
| Endpoint | `GET /api/courses/my-enrollments` |
| Status | **Implemented** |

### 5.5 Learning and Progress Tracking

#### FR-501: Mark Lesson Complete
| ID | FR-501 |
|---|---|
| Description | Students SHALL mark lessons as completed |
| Endpoint | `PUT /api/courses/{courseId}/lessons/{lessonId}/complete` |
| Status | **Implemented** |

#### FR-502: Get Course Progress
| ID | FR-502 |
|---|---|
| Description | Students SHALL view their progress percentage for a course |
| Endpoint | `GET /api/courses/{courseId}/progress` |
| Response | `{ courseId, studentId, totalLessons, completedLessons, progressPercentage }` |
| Status | **Implemented** |

### 5.6 Payment Processing

#### FR-601: Create Checkout Session (Planned)
| ID | FR-601 |
|---|---|
| Description | The payment service SHALL create Stripe checkout sessions for paid courses |
| Endpoint | `POST /api/payments/checkout` |
| Input | `{ courseId, userId, successUrl, cancelUrl }` |
| Response | Stripe session URL |
| Status | **Planned** |

#### FR-602: Stripe Webhook Handler (Planned)
| ID | FR-602 |
|---|---|
| Description | The payment service SHALL accept and verify Stripe webhook events |
| Endpoint | `POST /api/payments/webhook` |
| Security | Stripe signature verification; idempotency via event ID |
| Events Handled | `checkout.session.completed`, `charge.refunded` |
| Status | **Planned** |

#### FR-603: Payment History
| ID | FR-603 |
|---|---|
| Description | Students SHALL view their payment history |
| Endpoint | `GET /api/payments/history` |
| Status | **Planned** (frontend mock exists) |

#### FR-604: Process Refund (Planned)
| ID | FR-604 |
|---|---|
| Description | ADMIN users SHALL process refunds via Stripe |
| Endpoint | `POST /api/payments/{paymentId}/refund` |
| Status | **Planned** |

#### FR-605: Payment-Success Enrollment Activation
| ID | FR-605 |
|---|---|
| Description | Upon successful payment, enrollment SHALL be activated via async event |
| Mechanism | Payment Service publishes `PaymentSuccessEvent` → RabbitMQ → Course Service consumes and creates enrollment |
| Status | **Planned** |

### 5.7 Reviews and Ratings

#### FR-701: Submit Review (Planned)
| ID | FR-701 |
|---|---|
| Description | Enrolled students SHALL submit reviews with ratings |
| Endpoint | `POST /api/reviews` |
| Input | `{ courseId, rating (1-5), reviewText }` |
| Constraint | One review per enrolled student per course |
| Status | **Planned** |

#### FR-702: Get Course Reviews (Planned)
| ID | FR-702 |
|---|---|
| Description | Anyone SHALL view reviews for a course |
| Endpoint | `GET /api/reviews/course/{courseId}` |
| Status | **Planned** |

#### FR-703: Update Review (Planned)
| ID | FR-703 |
|---|---|
| Description | Students SHALL update their own reviews |
| Endpoint | `PUT /api/reviews/{reviewId}` |
| Status | **Planned** |

#### FR-704: Delete Review (Planned)
| ID | FR-704 |
|---|---|
| Description | Students and ADMIN SHALL delete reviews |
| Endpoint | `DELETE /api/reviews/{reviewId}` |
| Status | **Planned** |

#### FR-705: Moderate Review (Planned)
| ID | FR-705 |
|---|---|
| Description | ADMIN users SHALL moderate reviews (approve/reject) |
| Endpoint | `POST /api/reviews/{reviewId}/moderate` |
| Status | **Planned** |

#### FR-706: Rating Aggregation (Planned)
| ID | FR-706 |
|---|---|
| Description | Course rating SHALL be aggregated from all approved reviews |
| Mechanism | Async recalculation on review create/update/delete |
| Status | **Planned** |

### 5.8 Notifications

#### FR-801: Send Welcome Email (Planned)
| ID | FR-801 |
|---|---|
| Description | New users SHALL receive a welcome email after registration |
| Trigger | `UserRegisteredEvent` |
| Status | **Planned** |

#### FR-802: Enrollment Confirmation (Planned)
| ID | FR-802 |
|---|---|
| Description | Students SHALL receive enrollment confirmation |
| Trigger | `EnrollmentCreatedEvent` |
| Status | **Planned** |

#### FR-803: Payment Confirmation (Planned)
| ID | FR-803 |
|---|---|
| Description | Students SHALL receive payment confirmation |
| Trigger | `PaymentSuccessEvent` |
| Status | **Planned** |

#### FR-804: Instructor Approval Notification (Planned)
| ID | FR-804 |
|---|---|
| Description | Instructors SHALL be notified upon account approval |
| Trigger | `InstructorApprovedEvent` |
| Status | **Planned** |

#### FR-805: Notification History (Planned)
| ID | FR-805 |
|---|---|
| Description | Users SHALL view their notification history |
| Endpoint | `GET /api/notifications` |
| Status | **Planned** |

#### FR-806: Notification Templates (Planned)
| ID | FR-806 |
|---|---|
| Description | Notification content SHALL be template-driven and configurable |
| Status | **Planned** |

### 5.9 Semantic Search

#### FR-901: Vector Search
| ID | FR-901 |
|---|---|
| Description | Users SHALL search courses using natural language queries |
| Endpoint | `POST /api/nlu/search` |
| Input | `{ query }` |
| Response | `{ courseIds: string[] }` |
| Technology | FAISS vector index with `all-MiniLM-L6-v2` sentence transformer embeddings |
| Status | **Implemented** (Python service) |

#### FR-902: Course Index Update
| ID | FR-902 |
|---|---|
| Description | Course service SHALL publish course updates to keep the search index current |
| Mechanism | RabbitMQ `CourseUpdatedEvent` → semantic search consumer |
| Status | **Implemented** (consumer exists) |

### 5.10 Role and Permission Management

#### FR-1001: List Roles
| ID | FR-1001 |
|---|---|
| Description | ADMIN users SHALL list all roles with their permissions |
| Endpoint | `GET /api/auth/roles` |
| Permission | `roles:manage` |
| Status | **Implemented** |

#### FR-1002: List Permissions
| ID | FR-1002 |
|---|---|
| Description | ADMIN users SHALL list all available permissions |
| Endpoint | `GET /api/auth/roles/permissions` |
| Permission | `roles:manage` |
| Status | **Implemented** |

#### FR-1003: Create Role
| ID | FR-1003 |
|---|---|
| Description | ADMIN users SHALL create custom roles with assigned permissions |
| Endpoint | `POST /api/auth/roles` |
| Input | `{ name, permissionIds }` |
| Status | **Implemented** |

#### FR-1004: Delete Role
| ID | FR-1004 |
|---|---|
| Description | ADMIN users SHALL delete custom (non-static) roles |
| Endpoint | `DELETE /api/auth/roles/{roleId}` |
| Constraint | Static roles (ADMIN, INSTRUCTOR, STUDENT) SHALL NOT be deletable |
| Status | **Implemented** |

#### FR-1005: Add Permissions to Role
| ID | FR-1005 |
|---|---|
| Description | ADMIN users SHALL assign permissions to roles |
| Endpoint | `POST /api/auth/roles/{roleId}/permissions` |
| Status | **Implemented** |

#### FR-1006: Remove Permission from Role
| ID | FR-1006 |
|---|---|
| Description | ADMIN users SHALL remove permissions from roles |
| Endpoint | `DELETE /api/auth/roles/{roleId}/permissions/{permissionId}` |
| Status | **Implemented** |

#### FR-1007: Create Permission
| ID | FR-1007 |
|---|---|
| Description | ADMIN users SHALL create new permission definitions |
| Endpoint | `POST /api/auth/roles/permissions` |
| Input | `{ name, description }` |
| Status | **Implemented** |

### 5.11 Audit Logging

#### FR-1101: Operation Audit
| ID | FR-1101 |
|---|---|
| Description | All POST/PUT/DELETE operations on course-service SHALL be logged with user identity and timing |
| Mechanism | AOP Aspect (`AuditLoggingAspect`) |
| Fields | `userId`, `method`, `path`, `timestamp`, `duration` |
| Status | **Implemented** (course-service only) |

#### FR-1102: Auth Event Audit
| ID | FR-1102 |
|---|---|
| Description | Login success/failure, registration, and role changes SHALL be logged |
| Status | **Partial** (SLF4J logging exists, centralized audit store does not) |

---

## 6. Non-Functional Requirements

### 6.1 Security (NFR-SEC)

| ID | Requirement | Priority | Status |
|---|---|---|---|
| NFR-SEC-01 | All passwords SHALL be hashed with BCrypt using a configurable pepper | High | **Implemented** |
| NFR-SEC-02 | JWT tokens SHALL use HS256 with a configurable secret | High | **Implemented** |
| NFR-SEC-03 | Access tokens SHALL expire (configurable, default 1 hour) | High | **Implemented** |
| NFR-SEC-04 | Refresh tokens SHALL be stored server-side and revocable | High | **Implemented** |
| NFR-SEC-05 | The API Gateway SHALL validate every request (except public paths) | High | **Implemented** |
| NFR-SEC-06 | Downstream services SHALL receive identity via `X-User-*` headers | High | **Implemented** |
| NFR-SEC-07 | Direct service access (non-gateway) SHALL be blocked in production | High | **Planned** |
| NFR-SEC-08 | Stripe webhooks SHALL verify signature before processing | High | **Planned** |
| NFR-SEC-09 | CORS SHALL be restricted in production environments | Medium | **Partial** (allows all origins currently) |
| NFR-SEC-10 | HTTPS SHALL be enforced in all non-local environments | High | **Planned** |
| NFR-SEC-11 | Secrets (JWT, DB passwords, API keys) SHALL NOT be in source code | High | **Partial** (env vars supported, .env used locally) |
| NFR-SEC-12 | Rate limiting SHALL be implemented at the gateway | Medium | **Planned** |

### 6.2 Performance (NFR-PERF)

| ID | Requirement | Target | Status |
|---|---|---|---|
| NFR-PERF-01 | API response time (p95) for reads | < 500ms | **Not measured** |
| NFR-PERF-02 | API response time (p95) for writes | < 1000ms | **Not measured** |
| NFR-PERF-03 | Token validation at gateway | < 50ms | **Not measured** |
| NFR-PERF-04 | Semantic search response time | < 200ms | **Not measured** |
| NFR-PERF-05 | Page load time (first contentful paint) | < 2s | **Not measured** |

### 6.3 Scalability (NFR-SCAL)

| ID | Requirement | Status |
|---|---|---|
| NFR-SCAL-01 | Services SHALL be horizontally scalable independently | **Partial** (architecture supports, not tested) |
| NFR-SCAL-02 | Stateless services SHALL support multiple instances behind load balancer | **Partial** (JWT stateless, refresh tokens need shared DB) |
| NFR-SCAL-03 | Course catalog SHALL support caching | **Planned** |
| NFR-SCAL-04 | Read-heavy services (course) SHOULD use read replicas | **Planned** |

### 6.4 Availability (NFR-AVL)

| ID | Requirement | Target |
|---|---|---|
| NFR-AVL-01 | System uptime (production) | 99.9% |
| NFR-AVL-02 | Planned maintenance window | Weekly, < 1 hour |
| NFR-AVL-03 | Graceful degradation on dependent service failure | Notifications SHALL NOT block enrollment |

### 6.5 Maintainability (NFR-MNT)

| ID | Requirement | Status |
|---|---|---|
| NFR-MNT-01 | Each service SHALL have a health endpoint | **Implemented** (Spring Actuator) |
| NFR-MNT-02 | API documentation SHALL be auto-generated | **Implemented** (Swagger/OpenAPI in course-service) |
| NFR-MNT-03 | Consistent DTO patterns across services | **Partial** |
| NFR-MNT-04 | Database migrations SHALL use Hibernate DDL or Flyway/Liquibase | **Partial** (Hibernate `ddl-auto=update`) |
| NFR-MNT-05 | Code SHALL follow layered architecture (controller/service/repository) | **Implemented** |
| NFR-MNT-06 | Unit tests SHALL exist for all services | **Partial** (only context-load tests exist) |

### 6.6 Reliability (NFR-REL)

| ID | Requirement | Status |
|---|---|---|
| NFR-REL-01 | Failed async messages SHALL be dead-lettered | **Planned** |
| NFR-REL-02 | Payment webhooks SHALL be idempotent | **Planned** |
| NFR-REL-03 | Database connection pooling SHALL be configured | **Implemented** (HikariCP default) |
| NFR-REL-04 | Retry logic for transient notification failures | **Planned** |

### 6.7 Observability (NFR-OBS)

| ID | Requirement | Priority | Status |
|---|---|---|---|
| NFR-OBS-01 | Structured JSON logging | Medium | **Planned** |
| NFR-OBS-02 | Correlation ID propagation across services | High | **Planned** |
| NFR-OBS-03 | Request metrics (latency, error rate, throughput) | Medium | **Planned** |
| NFR-OBS-04 | Distributed tracing | Low | **Planned** |
| NFR-OBS-05 | SLF4J logging with method entry/exit in auth and user services | High | **Implemented** |

### 6.8 Portability (NFR-PRT)

| ID | Requirement | Status |
|---|---|---|
| NFR-PRT-01 | All services SHALL be containerized via Docker | **Implemented** |
| NFR-PRT-02 | Local development SHALL use Docker Compose | **Implemented** |
| NFR-PRT-03 | Database profiles SHALL support H2 (local) and PostgreSQL (docker/production) | **Implemented** |

---

## 7. Data Model

### 7.1 Auth Service Schema

**Table: `users`**

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | BIGINT | PK, AUTO_INCREMENT | |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | |
| `password` | VARCHAR(255) | | BCrypt hash with pepper |
| `full_name` | VARCHAR(255) | | |
| `role_id` | BIGINT | FK → roles.id, NOT NULL | |
| `uuid` | UUID | UNIQUE | Used for cross-service identity |
| `is_approved` | BOOLEAN | | Instructor approval flag |
| `created_at` | TIMESTAMP | | Auto-set |

**Table: `roles`**

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | BIGINT | PK, AUTO_INCREMENT | |
| `name` | VARCHAR(255) | UNIQUE, NOT NULL | e.g., ADMIN, INSTRUCTOR, STUDENT |
| `is_static` | BOOLEAN | Default false | Static roles cannot be deleted |
| `created_at` | TIMESTAMP | | Auto-set |

**Table: `permissions`**

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | BIGINT | PK, AUTO_INCREMENT | |
| `name` | VARCHAR(255) | UNIQUE, NOT NULL | e.g., `users:read`, `courses:create` |
| `description` | VARCHAR(255) | | |
| `created_at` | TIMESTAMP | | Auto-set |

**Table: `role_permissions`** (Join Table)

| Column | Type | Constraints |
|---|---|---|
| `role_id` | BIGINT | PK, FK → roles.id |
| `permission_id` | BIGINT | PK, FK → permissions.id |

**Table: `refresh_tokens`**

| Column | Type | Constraints |
|---|---|---|
| `id` | BIGINT | PK, AUTO_INCREMENT |
| `token` | VARCHAR(255) | UUID |
| `user_id` | BIGINT | FK → users.id |
| `expiry_date` | TIMESTAMP | |

### 7.2 User Service Schema

**Table: `users`**

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | UUID | PK | Different from auth-service Long ID |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | |
| `full_name` | VARCHAR(255) | | |
| `role` | VARCHAR(50) | | Denormalized role name |
| `is_approved` | BOOLEAN | Default false | |
| `created_at` | TIMESTAMP | | |
| `updated_at` | TIMESTAMP | | |

**Note:** There is a known identity mismatch between auth-service (Long PK) and user-service (UUID PK). Cross-service references require coordination.

### 7.3 Course Service Schema

**Table: `courses`**

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `course_id` | BIGINT | PK, AUTO_INCREMENT | |
| `title` | VARCHAR(255) | NOT NULL | |
| `description` | TEXT | | |
| `price` | DOUBLE | Default 0 | Free if 0 |
| `category` | VARCHAR(100) | | e.g., Programming, Data Science |
| `thumbnail_url` | VARCHAR(500) | | |
| `rating` | DOUBLE | Default 0 | Aggregated from reviews |
| `enrolled_count` | INT | Default 0 | |
| `instructor_name` | VARCHAR(255) | | Denormalized |
| `instructor_id` | VARCHAR(255) | | |
| `difficulty_level` | VARCHAR(20) | | BEGINNER, INTERMEDIATE, ADVANCED |
| `status` | VARCHAR(20) | Default DRAFT | DRAFT, PUBLISHED |
| `featured` | BOOLEAN | Default false | |
| `created_at` | TIMESTAMP | | |
| `updated_at` | TIMESTAMP | | |

**Table: `lessons`**

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `lesson_id` | BIGINT | PK, AUTO_INCREMENT | |
| `title` | VARCHAR(255) | NOT NULL | |
| `type` | VARCHAR(20) | NOT NULL | VIDEO, QUIZ, TEXT |
| `content_url` | VARCHAR(500) | | |
| `duration` | INT | | Minutes |
| `position` | INT | | Ordering |
| `course_id` | BIGINT | FK → courses.course_id | |

**Table: `enrollments`**

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | BIGINT | PK, AUTO_INCREMENT | |
| `student_id` | VARCHAR(255) | NOT NULL | |
| `course_id` | BIGINT | FK → courses.course_id | |
| `enrolled_at` | TIMESTAMP | | |

**Table: `lesson_progress`**

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | BIGINT | PK, AUTO_INCREMENT | |
| `student_id` | VARCHAR(255) | NOT NULL | |
| `lesson_id` | BIGINT | FK → lessons.lesson_id | |
| `completed` | BOOLEAN | Default false | |
| `completed_at` | TIMESTAMP | | |

### 7.4 Payment Service Schema

**Table: `payments`**

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | BIGINT | PK, AUTO_INCREMENT | |
| `payment_intent_id` | VARCHAR(255) | | Stripe payment intent ID |
| `student_id` | VARCHAR(255) | NOT NULL | |
| `course_id` | BIGINT | NOT NULL | |
| `amount` | DOUBLE | NOT NULL | |
| `status` | VARCHAR(20) | | PENDING, SUCCEEDED, FAILED |
| `created_at` | TIMESTAMP | | |
| `updated_at` | TIMESTAMP | | |

**Table: `enrollments`** (Payment Service)

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | BIGINT | PK, AUTO_INCREMENT | |
| `student_id` | VARCHAR(255) | NOT NULL | |
| `course_id` | BIGINT | NOT NULL | |
| `payment_id` | BIGINT | FK → payments.id | |
| `paid_amount` | DOUBLE | | |
| `status` | VARCHAR(20) | | ACTIVE, CANCELLED |
| `enrolled_at` | TIMESTAMP | | |

### 7.5 Notification Service Schema (Planned)

**Table: `notifications`**

| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT PK | |
| `user_id` | VARCHAR(255) | Recipient |
| `type` | VARCHAR(50) | ENROLLMENT, PAYMENT, APPROVAL, etc. |
| `channel` | VARCHAR(20) | EMAIL, IN_APP |
| `subject` | VARCHAR(255) | |
| `body` | TEXT | |
| `status` | VARCHAR(20) | PENDING, SENT, FAILED |
| `retry_count` | INT | |
| `created_at` | TIMESTAMP | |
| `sent_at` | TIMESTAMP | Nullable |

**Table: `notification_templates`** (Planned)

| Column | Type |
|---|---|
| `id` | BIGINT PK |
| `name` | VARCHAR(100) UNIQUE |
| `subject_template` | VARCHAR(500) |
| `body_template` | TEXT |
| `channel` | VARCHAR(20) |

### 7.6 Review Service Schema (Planned)

**Table: `reviews`**

| Column | Type | Constraints |
|---|---|---|
| `id` | BIGINT PK | |
| `course_id` | BIGINT | NOT NULL, FK |
| `student_id` | VARCHAR(255) | NOT NULL |
| `rating` | INT | 1-5 |
| `review_text` | TEXT | |
| `status` | VARCHAR(20) | PENDING, APPROVED, REJECTED |
| `created_at` | TIMESTAMP | |
| `updated_at` | TIMESTAMP | |

**Table: `course_rating_summary`** (Planned)

| Column | Type |
|---|---|
| `course_id` | BIGINT PK |
| `average_rating` | DOUBLE |
| `total_reviews` | INT |
| `rating_distribution` | JSON |

### 7.7 Semantic Search Data

**File: `data/index/index.faiss`** — FAISS vector index (binary)
**File: `data/index/metadata.pkl`** — Pickled list of `{courseId, title, description, category, difficulty}` per vector

---

## 8. API Specification

### 8.1 Auth Service API

Base URL: `/api/auth` (via gateway)

| Method | Endpoint | Auth | Permission | Request | Response | Status |
|---|---|---|---|---|---|---|
| POST | `/register` | Public | — | `RegisterRequest` | `AuthResponse` | **Done** |
| POST | `/login` | Public | — | `LoginRequest` | `AuthResponse` | **Done** |
| POST | `/refresh` | Public | — | `RefreshRequest` | `AuthResponse` | **Done** |
| GET | `/validate` | Public | — | `?token=` | `TokenValidationResponse` | **Done** |
| PUT | `/users/{userId}/role` | JWT | `roles:manage` | `AssignRoleRequest` | 204 | **Done** |
| DELETE | `/users/{userId}` | JWT | `users:delete` | — | 204 | **Done** |
| GET | `/roles` | JWT | `roles:manage` | — | `RoleResponse[]` | **Done** |
| POST | `/roles` | JWT | `roles:manage` | `CreateRoleRequest` | `RoleResponse` | **Done** |
| GET | `/roles/permissions` | JWT | `roles:manage` | — | `Permission[]` | **Done** |
| GET | `/roles/{name}` | JWT | `roles:manage` | — | `RoleResponse` | **Done** |
| DELETE | `/roles/{roleId}` | JWT | `roles:manage` | — | 204 | **Done** |
| POST | `/roles/{roleId}/permissions` | JWT | `roles:manage` | `Set<Long>` | `RoleResponse` | **Done** |
| DELETE | `/roles/{roleId}/permissions/{permId}` | JWT | `roles:manage` | — | `RoleResponse` | **Done** |
| POST | `/roles/permissions` | JWT | `roles:manage` | `CreatePermissionRequest` | `Permission` | **Done** |

**Request/Response Schemas:**

```jsonc
// RegisterRequest
{ "email": "string (valid email)", "password": "string (8-50 chars)", "role": "string (optional)" }

// LoginRequest
{ "email": "string", "password": "string" }

// RefreshRequest
{ "refreshToken": "string" }

// AuthResponse
{ "accessToken": "string", "refreshToken": "string", "role": "string", "email": "string", "permissions": ["string"] }

// TokenValidationResponse
{ "valid": "boolean", "userId": "string", "email": "string", "role": "string", "permissions": ["string"] }

// AssignRoleRequest
{ "roleId": "long" }

// CreateRoleRequest
{ "name": "string", "permissionIds": ["long"] }

// CreatePermissionRequest
{ "name": "string", "description": "string" }
```

### 8.2 User Service API

Base URL: `/api/users` (via gateway)

| Method | Endpoint | Auth | Permission | Status |
|---|---|---|---|---|
| GET | `/` | JWT | `users:read` | **Done** |
| GET | `/{id}` | JWT | `users:read` or self | **Done** |
| GET | `/email/{email}` | JWT | `users:read` | **Done** |
| PUT | `/{id}` | JWT | `users:update` or self | **Done** |
| PUT | `/{id}/approve-instructor` | JWT | `users:update` | **Done** |

### 8.3 Course Service API

Base URL: `/api/courses` (via gateway)

| Method | Endpoint | Auth | Permission | Status |
|---|---|---|---|---|
| GET | `/` | Public | — | **Done** |
| GET | `/{courseId}` | Public | — | **Done** |
| POST | `/` | JWT | `courses:create` | **Done** |
| PUT | `/{courseId}` | JWT | `courses:update` (owner) | **Done** |
| DELETE | `/{courseId}` | JWT | `courses:update` (owner) | **Done** |
| POST | `/{courseId}/publish` | JWT | Owner | **Done** |
| GET | `/instructor/{instructorId}` | JWT | — | **Done** |
| GET | `/{courseId}/lessons` | Public | — | **Done** |
| POST | `/{courseId}/lessons` | JWT | Owner | **Done** |
| PUT | `/{courseId}/lessons/{lessonId}` | JWT | Owner | **Done** |
| DELETE | `/{courseId}/lessons/{lessonId}` | JWT | Owner | **Done** |
| POST | `/{courseId}/enroll` | JWT | — | **Done** |
| GET | `/{courseId}/enrollment-check` | JWT | — | **Done** |
| GET | `/{courseId}/enrollments` | JWT | — | **Done** |
| GET | `/my-enrollments` | JWT | — | **Done** |
| PUT | `/{courseId}/lessons/{lessonId}/complete` | JWT | — | **Done** |
| GET | `/{courseId}/progress` | JWT | — | **Done** |

### 8.4 Payment Service API

Base URL: `/api/payments` (via gateway)

| Method | Endpoint | Auth | Permission | Status |
|---|---|---|---|---|
| POST | `/checkout` | JWT | — | **Planned** |
| POST | `/webhook` | Public (Stripe signature) | — | **Planned** |
| GET | `/{paymentId}` | JWT | Self | **Planned** |
| POST | `/{paymentId}/refund` | JWT | ADMIN | **Planned** |

### 8.5 Notification Service API

Base URL: `/api/notifications` (via gateway)

| Method | Endpoint | Auth | Permission | Status |
|---|---|---|---|---|
| GET | `/` | JWT | Self | **Planned** |
| GET | `/{id}` | JWT | Self | **Planned** |
| PUT | `/{id}/read` | JWT | Self | **Planned** |
| GET | `/unread-count` | JWT | Self | **Planned** |

### 8.6 Review Service API

Base URL: `/api/reviews` (via gateway)

| Method | Endpoint | Auth | Permission | Status |
|---|---|---|---|---|
| POST | `/` | JWT | Enrolled student | **Planned** |
| GET | `/course/{courseId}` | Public | — | **Planned** |
| PUT | `/{reviewId}` | JWT | Owner | **Planned** |
| DELETE | `/{reviewId}` | JWT | Owner or ADMIN | **Planned** |
| POST | `/{reviewId}/moderate` | JWT | ADMIN | **Planned** |

### 8.7 Semantic Search API

Base URL: `/api/nlu` (via gateway or directly)

| Method | Endpoint | Auth | Response | Status |
|---|---|---|---|---|
| GET | `/` | — | Health check | **Done** |
| GET | `/search` | — | Simple search | **Done** |
| POST | `/search` | — | `{ query: string }` → `{ courseIds: string[] }` | **Done** |

### 8.8 API Gateway Routes

| Route ID | Path | Target | Filter | Notes |
|---|---|---|---|---|
| `auth-service` | `/api/auth/**` | `lb://auth-service` | AuthFilter | Public register/login/refresh; protected role/user management |
| `user-service` | `/api/users/**` | `lb://user-service` | AuthFilter | All protected |
| `course-service` | `/api/courses/**` | `lb://course-service` | AuthFilter | Public GETs pass through; mutations require auth |
| `payment-service` | `/api/payments/**` | `lb://payment-service` | AuthFilter | Protected (except webhook) |
| `notification-service` | `/api/notifications/**` | `lb://notification-service` | AuthFilter | Protected |
| `review-service` | `/api/reviews/**` | `lb://review-service` | AuthFilter | Protected |
| `stripe-webhook` | `/api/payments/webhook` | `lb://payment-service` | None | POST only, public |

**Gateway Filter Chain (AuthFilter):**

```
Request → PublicPathMatcher → [if not public] → JwtTokenExtractor → 
AuthClient.validate(token) → AccessRuleEngine.isAuthorized() → 
UserHeaderInjector → Forward to downstream
```

**Downstream Headers Injected by Gateway:**

| Header | Source | Example |
|---|---|---|
| `X-User-Id` | JWT `sub` or `userId` claim | `"42"` |
| `X-User-Email` | JWT `email` claim | `"user@example.com"` |
| `X-User-Role` | JWT `role` claim | `"ADMIN"` |
| `X-User-Permissions` | From auth-service validation | `"users:read,users:update"` |

---

## 9. Security Requirements

### 9.1 Authentication

- **JWT-based**: Access tokens (HS256) for API authentication
- **Refresh Tokens**: Server-side stored UUID tokens for session extension
- **Password Hashing**: BCrypt with configurable pepper (`PASSWORD_PEPPER`)
- **Token in Header**: Bearer token in `Authorization` header
- **Public Paths**: Explicitly configured list bypasses JWT validation

### 9.2 Authorization

- **Gateway-Level RBAC**: `AccessRuleEngine` enforces permission-based rules per path + method
- **Self-Access**: `allowSelf=true` on profile endpoints enables users to access their own data
- **Downstream Trust**: Services trust `X-User-*` headers (requires network-level isolation)
- **Permission Model**: Granular permissions (`users:read`, `courses:create`, `roles:manage`, etc.) mapped to roles
- **Static Roles**: ADMIN, INSTRUCTOR, STUDENT roles are non-deletable and pre-seeded

### 9.3 Data Protection

- Passwords: Never stored in plaintext; BCrypt-hashed with pepper
- JWT Secret: Configurable via environment; shared between auth-service and gateway
- DB Credentials: Configurable per environment; not hardcoded
- Payment Info: Handled by Stripe; no raw card data stored in EduFlow databases

### 9.4 Network Security

- Production: Direct service ports MUST NOT be publicly accessible
- Production: HTTPS enforced at ingress/load balancer
- Local: HTTP acceptable for development
- CORS: Currently permissive (`*`); MUST be restricted in production

### 9.5 Audit

- Operation logging via AOP in course-service
- Login attempts, registration, role changes logged via SLF4J
- Future: centralized audit event store with correlation IDs

---

## 10. Deployment Requirements

### 10.1 Local Development

| Component | Configuration |
|---|---|
| **Orchestration** | Docker Compose (`docker compose up --build`) |
| **Networking** | Single bridge network (`lms-network`) |
| **Service Registry** | Eureka on port 8761 |
| **API Gateway** | Port 8080 |
| **Auth Service** | Port 8086, H2 (local) / PostgreSQL (docker) |
| **User Service** | Port 8081, H2 (local) / PostgreSQL (docker) |
| **Course Service** | Port 8083, H2 (local) / PostgreSQL (docker) |
| **Notification Service** | Port 8085, H2 (local) / PostgreSQL (docker) |
| **Payment Service** | Port TBD, PostgreSQL (local docker) |
| **Review Service** | Port TBD |
| **Semantic Search** | Port 8084, Python FastAPI |
| **Frontend** | Vite dev server, proxy to gateway:8080 |
| **Database** | PostgreSQL 15 per service (docker profile) |

**Database Containers:**

| Container | Database | Service Consumers |
|---|---|---|
| `shared-db` | `lms_db` | auth-service, user-service |
| `course-db` | `course_db` | course-service |
| `notification-db` | `notification_db` | notification-service |
| `payment-db` | `payment_db` | payment-service (planned) |
| `review-db` | `review_db` | review-service (planned) |

**Docker Compose Services:**

| Service | Dockerfile Context | Depends On |
|---|---|---|
| `service-registry` | `./service-registry` | — |
| `shared-db` | PostgreSQL image | — |
| `course-db` | PostgreSQL image | — |
| `notification-db` | PostgreSQL image | — |
| `auth-service` | `./auth-service` | service-registry, shared-db |
| `user-service` | `./user-service` | service-registry, shared-db |
| `course-service` | `./course-service` | service-registry, course-db |
| `notification-service` | `./notification-service` | service-registry, notification-db |
| `api-gateway` | `./api-gateway` | All services |

### 10.2 Production

| Component | Recommendation |
|---|---|
| **Orchestration** | Kubernetes |
| **Ingress** | Nginx Ingress Controller or AWS ALB |
| **Service Discovery** | Kubernetes DNS (replace or complement Eureka) |
| **Databases** | Managed PostgreSQL (AWS RDS / Cloud SQL) with read replicas |
| **Caching** | Redis |
| **Message Broker** | RabbitMQ cluster |
| **Observability** | Prometheus + Grafana + OpenTelemetry |
| **Logging** | ELK Stack or Loki |
| **Secrets** | HashiCorp Vault or cloud secret manager |
| **CI/CD** | GitHub Actions |
| **CDN** | CloudFront or Cloudflare for course content |

---

## 11. Implementation Status

### Complete Feature Inventory

| Domain | Component | Status | Details |
|---|---|---|---|
| **Infrastructure** | Service Registry (Eureka) | ✅ **Done** | Port 8761, registration + discovery |
| | API Gateway | ✅ **Done** | Spring Cloud Gateway, JWT filter, RBAC, 7 routes |
| | Docker Compose | ✅ **Done** | 9 services, 4 DB containers, bridge network |
| **Auth** | Registration | ✅ **Done** | Email/password, BCrypt + pepper, role resolution |
| | Login | ✅ **Done** | Credential validation, JWT + refresh token |
| | Token Refresh | ✅ **Done** | Server-side refresh token rotation |
| | Token Validation | ✅ **Done** | /validate endpoint, consumed by gateway |
| | Role Management | ✅ **Done** | CRUD roles/permissions, static role protection |
| | User Deletion | ✅ **Done** | Permission-gated, self-deletion prevention |
| | Instructor Approval | ✅ **Done** | Approval endpoint in user-service |
| **User** | User CRUD | ✅ **Done** | Get by ID/email, list, update |
| | Identity Mismatch | ⚠️ **Issue** | Auth-service uses Long PK; user-service uses UUID PK |
| **Course** | Course CRUD | ✅ **Done** | Full lifecycle with validation |
| | Lesson Management | ✅ **Done** | Add/list/update/delete lessons |
| | Publish Workflow | ✅ **Done** | Draft/Publish status |
| | Enrollment | ✅ **Done** | Enroll, check, list enrollments |
| | Progress Tracking | ✅ **Done** | Lesson completion, progress percentage |
| | Course Seeder | ✅ **Done** | 80 seeded courses for development |
| | Swagger/OpenAPI | ✅ **Done** | API docs at /swagger-ui.html |
| | Audit Logging (AOP) | ✅ **Done** | Aspect-based operation logging |
| **Payment** | Service Scaffolding | 🟡 **Partial** | Spring Boot 3.4.x app, entities, repos, services |
| | Mock Payment Flow | 🟡 **Partial** | Card-ending-in-4242 mock logic |
| | RabbitMQ Integration | 🟡 **Partial** | Event publishing configured |
| | Stripe Integration | ❌ **Planned** | Checkout session, webhook |
| | Dockerfile | ❌ **Planned** | Missing |
| | Port Conflict | ⚠️ **Issue** | Configured on 8085, conflicting with notification-service |
| **Notification** | Service Scaffolding | 🟡 **Partial** | Spring Boot app, mail/SMTP config |
| | Email Templates | ❌ **Planned** | |
| | Event Consumers | ❌ **Planned** | |
| | Notification History | ❌ **Planned** | |
| **Review** | Service Scaffolding | ❌ **Planned** | Spring Boot app exists, no domain code |
| | Dockerfile | ❌ **Planned** | Missing |
| **Semantic Search** | FAISS Index | ✅ **Done** | Python FastAPI, FAISS vector index |
| | Embedding Model | ✅ **Done** | all-MiniLM-L6-v2, mean pooling |
| | Search API | ✅ **Done** | POST /api/nlu/search |
| | RabbitMQ Consumer | ✅ **Done** | Course index update listener |
| | Eureka Registration | ✅ **Done** | py-eureka-client |
| **Frontend** | Login/Register | ✅ **Done** | Zod validation, role selection, password strength |
| | Course Catalog | ✅ **Done** | Search, filter, grid/list view |
| | Course Detail | ✅ **Done** | Full view with curriculum, instructor, enrollment |
| | Student Dashboard | ✅ **Done** | Enrolled courses, stats |
| | Instructor Dashboard | ✅ **Done** | Course list, editor |
| | Admin Dashboard | ✅ **Done** | User management, roles, audit logs |
| | Learning Interface | ✅ **Done** | Lesson player, progress, navigation |
| | Checkout Page | 🟡 **Partial** | UI complete, uses mock payment |
| | Payment History | 🟡 **Partial** | UI complete, uses mock data |
| | Course Editor | ✅ **Done** | Create/edit courses and lessons |
| | User Management UI | ✅ **Done** | CRUD, role change, delete |
| | Role Management UI | ✅ **Done** | Create/delete roles, manage permissions |
| | Audit Logs UI | ✅ **Done** | View audit log |
| | Auth Context | ✅ **Done** | Token management, auto-refresh |
| | Protected Routes | ✅ **Done** | Role-based route gating |
| | Dark/Light Mode | ✅ **Done** | Theme toggle with persistence |
| | Mock Data Usage | ⚠️ **Issue** | courseApi, enrollmentApi, paymentApi use `USE_MOCK = true` |
| **Testing** | Backend Tests | 🟡 **Partial** | Only context-load tests exist per service |
| | Frontend Tests | 🟡 **Partial** | 1 auth critical path test exists |

### Status Legend

| Icon | Meaning |
|---|---|
| ✅ **Done** | Fully implemented and functional |
| 🟡 **Partial** | Scaffolded or partially implemented |
| ❌ **Planned** | Not yet implemented |
| ⚠️ **Issue** | Known problem requiring attention |

---

## 12. Future Scope

### Phase 1: Identity Hardening
1. Reconcile auth-service Long PK with user-service UUID PK — introduce a consistent identity model
2. Add `GET /api/users/me` endpoint to avoid exposing ID coupling in URLs
3. Standardize JWT claims across all services
4. Implement logout / token revocation

### Phase 2: Course Domain Completion
1. Implement course categories and tags as full CRUD entities
2. Add catalog filtering by multiple dimensions (price, rating, date)
3. Implement pagination on all list endpoints
4. Add bulk operations for lessons (reorder, batch update)

### Phase 3: Payment Integration
1. Build full payment-service with Stripe checkout session creation
2. Implement Stripe webhook verification and event handling
3. Wire up Payment → Enrollment activation via RabbitMQ
4. Implement refund flow
5. Resolve port conflict (currently 8085 conflicts with notification-service)

### Phase 4: Notification Maturity
1. Implement in-app notification model and persistence
2. Build email template engine
3. Implement RabbitMQ consumers for all events
4. Add retry logic and delivery status tracking
5. Build notification preference management

### Phase 5: Review Domain
1. Build full review-service with CRUD
2. Implement enrollment-based review eligibility check
3. Build moderation workflow
4. Implement rating aggregation and caching
5. Wire up Review → Course rating update via events

### Phase 6: Production Readiness
1. Switch frontend from mock data to real backend APIs
2. Implement rate limiting at the API Gateway
3. Restrict CORS for production environments
4. Add HTTPS enforcement
5. Implement correlation ID propagation
6. Add distributed tracing (OpenTelemetry)
7. Set up metrics dashboards (Prometheus + Grafana)
8. Add comprehensive test coverage (unit, integration, E2E)
9. Implement CI/CD pipelines
10. Create Kubernetes deployment manifests

### Phase 7: Advanced Features
1. Course content delivery via CDN (video streaming)
2. Live session / webinar support (WebRTC)
3. Certificate generation upon course completion
4. Gamification (badges, leaderboards)
5. Learning paths (curated course sequences)
6. Analytics dashboard for instructors (student engagement, completion rates)
7. Mobile application (React Native)
8. Multi-language / i18n support
9. SCORM/xAPI content compatibility
10. Social learning features (discussions, Q&A)

---

## Appendix A: Known Issues

| ID | Issue | Impact | Suggested Fix |
|---|---|---|---|
| KNI-01 | Auth-service uses Long PK; user-service uses UUID PK | Self-access authorization (`allowSelf=true`) may fail cross-service | Unify identity model or introduce identity mapping |
| KNI-02 | Payment-service and notification-service both configured on port 8085 | Cannot run both simultaneously | Change one service port |
| KNI-03 | RabbitMQ exchange type mismatch: payment-service declares `TopicExchange`, course-service declares `DirectExchange` for similar exchanges | Events may not route correctly | Standardize exchange type |
| KNI-04 | PaymentSuccessEvent payload differs between payment-service (record: studentId/courseId/amount) and course-service consumer (class: event/userId/courseId) | Event consumption fails | Align event DTOs |
| KNI-05 | Frontend uses mock data for course, enrollment, lesson, payment, and progress APIs | Frontend not connected to live backend | Toggle `USE_MOCK = false` when backends are ready |
| KNI-06 | API Gateway has no CORS configuration | All origins allowed | Add CORS config for production |
| KNI-07 | Notification-service and review-service are stubs only | No email, in-app notifications, or reviews | Implement domain logic |
| KNI-08 | Only context-load tests exist per service | No behavioral test coverage | Add unit and integration tests |
| KNI-09 | Course-service uses port 8082 in local config but 8083 in docker config | Confusion in local development | Align port across profiles |

---

## Appendix B: Gateway RBAC Rules

| Path Pattern | Method | Required Permission | Self-Access |
|---|---|---|---|
| `/api/auth/roles` | GET | `roles:manage` | No |
| `/api/auth/roles` | POST | `roles:manage` | No |
| `/api/auth/roles/permissions` | GET | `roles:manage` | No |
| `/api/auth/roles/permissions` | POST | `roles:manage` | No |
| `/api/auth/roles/{name}` | GET | `roles:manage` | No |
| `/api/auth/roles/{roleId}` | DELETE | `roles:manage` | No |
| `/api/auth/roles/{roleId}/permissions` | POST | `roles:manage` | No |
| `/api/auth/roles/{roleId}/permissions/{permId}` | DELETE | `roles:manage` | No |
| `/api/auth/users/{userId}/role` | PUT | `roles:manage` | No |
| `/api/auth/users/{userId}` | DELETE | `users:delete` | No |
| `/api/users` | GET | `users:read` | No |
| `/api/users/email/{email}` | GET | `users:read` | No |
| `/api/users/{id}/approve-instructor` | PUT | `users:update` | No |
| `/api/users/{id}` | GET | `users:read` | **Yes** |
| `/api/users/{id}` | PUT | `users:update` | **Yes** |
| `/api/courses/**` | POST | `courses:create` | No |
| `/api/courses/**` | PUT | `courses:update` | No |
| `/api/courses/**` | DELETE | `courses:update` | No |

**Default behavior:** If no rule matches the path+method, the request is **allowed**.

**Public paths (no JWT required):**
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/auth/validate`
- `GET /api/courses/**`
- `PUT /api/auth/users/{userId}/role`
- `DELETE /api/auth/users/{userId}`
- `POST /api/payments/webhook`

---

## Appendix C: Permission Catalog

| Permission | Description | Roles |
|---|---|---|
| `users:read` | View user profiles and list users | ADMIN |
| `users:update` | Update user profiles, approve instructors | ADMIN |
| `users:delete` | Delete user accounts | ADMIN |
| `roles:manage` | Create/delete roles and permissions, assign roles | ADMIN |
| `courses:create` | Create new courses | INSTRUCTOR, ADMIN |
| `courses:update` | Update and delete courses (owner-checked) | INSTRUCTOR, ADMIN |
| `audit:read` | View audit logs | ADMIN |

---

## Appendix D: Document Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-03-15 | — | Initial SRS draft |
| 2.1 | 2026-04-01 | — | Updated scopes, added payment/review |
| 2.2 | 2026-04-22 | — | Revised to match repository state |
| **3.0** | **2026-05-08** | **Engineering Team** | **Complete rewrite — full system analysis, all services documented, implementation status per feature, known issues catalog, comprehensive API specs, data models, security architecture, deployment topology** |
