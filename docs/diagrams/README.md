# LMS Platform — Diagrams Index

## Available Diagrams

| File | Type | Description |
|------|------|-------------|
| [`ERD.md`](./ERD.md) | 🗃️ ERD | 12 tables across 5 databases with entity relationships & color-coded by service |
| [`USE_CASE.md`](./USE_CASE.md) | 👤 Use Case | 7 diagrams: actors (Student, Instructor, Admin, System, Payment Gateway) vs use cases |
| [`ACTIVITY.md`](./ACTIVITY.md) | ⚡ Activity | 4 workflows: Registration, Course Creation, Payment/Enrollment, Review Submission |
| [`SEQUENCE.md`](./SEQUENCE.md) | 🔄 Sequence | 5 business flows: Course Creation, Free Enrollment, Payment, Review, Notification |
| *(below)* | 🔐 Auth/RBAC | 12 authentication & authorization sequence diagrams *(existing)* |

---

# Auth And RBAC Sequence Diagrams

This document captures the current authentication and authorization flow implemented in the repo as of the gateway-first RBAC pass.

## Participants
- `Client`: frontend, Postman, or any external caller
- `API Gateway`: Spring Cloud Gateway with `JwtAuthFilter`
- `Auth Service`: login, register, refresh, validate, JWT issuing
- `User Service`: protected user APIs behind the gateway
- `Auth DB`: auth-service persistence
- `User DB`: user-service persistence

## 1. Student Register Flow

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant Gateway as "API Gateway"
    participant Auth as "Auth Service"
    participant AuthDB as "Auth DB"

    Client->>Gateway: POST /api/auth/register\n{ email, password }
    Note over Gateway: /api/auth/** is public\nJwtAuthFilter bypasses auth
    Gateway->>Auth: Forward request
    Auth->>AuthDB: findByEmail(email)
    AuthDB-->>Auth: not found
    Auth->>Auth: hash password
    Auth->>AuthDB: save user(role=STUDENT)
    AuthDB-->>Auth: persisted user(id, email, role)
    Auth->>Auth: generate access token\nsubject=user.id\nclaims={userId,email,role}
    Auth->>Auth: create refresh token
    Auth-->>Gateway: 200 { accessToken, refreshToken }
    Gateway-->>Client: 200 { accessToken, refreshToken }

    alt Email already exists
        Auth->>AuthDB: findByEmail(email)
        AuthDB-->>Auth: existing user
        Auth-->>Gateway: error response
        Gateway-->>Client: error response
    end
```

## 2. Login Flow

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant Gateway as "API Gateway"
    participant Auth as "Auth Service"
    participant AuthDB as "Auth DB"

    Client->>Gateway: POST /api/auth/login\n{ email, password }
    Note over Gateway: Public auth route
    Gateway->>Auth: Forward request
    Auth->>AuthDB: findByEmail(email)
    AuthDB-->>Auth: user record
    Auth->>Auth: compare password with hash

    alt Credentials valid
        Auth->>Auth: generate access token
        Auth->>Auth: create refresh token
        Auth-->>Gateway: 200 { accessToken, refreshToken }
        Gateway-->>Client: 200 { accessToken, refreshToken }
    else Invalid credentials
        Auth-->>Gateway: error response
        Gateway-->>Client: error response
    end
```

## 3. Refresh Token Flow

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant Gateway as "API Gateway"
    participant Auth as "Auth Service"
    participant AuthDB as "Auth DB"

    Client->>Gateway: POST /api/auth/refresh\n{ refreshToken }
    Note over Gateway: Public auth route
    Gateway->>Auth: Forward request
    Auth->>AuthDB: find refresh token

    alt Refresh token valid
        AuthDB-->>Auth: refresh token + linked user
        Auth->>Auth: generate new access token
        Auth-->>Gateway: 200 { accessToken, refreshToken }
        Gateway-->>Client: 200 { accessToken, refreshToken }
    else Refresh token missing or expired
        AuthDB-->>Auth: token missing/expired
        Auth-->>Gateway: error response
        Gateway-->>Client: error response
    end
```

## 4. Token Validation Flow

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant Gateway as "API Gateway"
    participant Auth as "Auth Service"

    Client->>Gateway: GET /api/auth/validate?token=...
    Note over Gateway: Public auth route
    Gateway->>Auth: Forward request
    Auth->>Auth: parse JWT using configured secret

    alt Token valid
        Auth->>Auth: extract subject, email, role
        Auth-->>Gateway: 200 { valid=true, userId, email, role }
        Gateway-->>Client: 200 { valid=true, userId, email, role }
    else Token expired/invalid
        Auth-->>Gateway: error response
        Gateway-->>Client: error response
    end
```

## 5. Protected Request With Successful Gateway Authorization

This is the common path for allowed protected traffic such as:
- `ADMIN -> GET /api/users`
- `ADMIN -> GET /api/users/{id}`
- `ADMIN -> PUT /api/users/{id}`
- `ADMIN -> PUT /api/users/{id}/approve-instructor`
- `STUDENT -> GET /api/users/{selfId}` at the gateway rule level
- `INSTRUCTOR -> PUT /api/users/{selfId}` at the gateway rule level

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant Gateway as "API Gateway"
    participant Filter as "JwtAuthFilter"
    participant User as "User Service"
    participant UserDB as "User DB"

    Client->>Gateway: Protected request + Bearer accessToken
    Gateway->>Filter: Invoke JwtAuthFilter
    Filter->>Filter: Check if path is public
    Filter->>Filter: Extract Authorization header
    Filter->>Filter: Parse JWT with gateway secret
    Filter->>Filter: Extract userId, email, role
    Filter->>Filter: Match request against RBAC policy table

    alt Policy allows by role
        Filter->>Filter: role in allowedRoles
    else Policy allows by self rule
        Filter->>Filter: Compare token userId with path id
    end

    Filter->>Gateway: mutate request headers\nX-User-Id\nX-User-Email\nX-User-Role
    Gateway->>User: Forward authorized request
    User->>UserDB: Execute application logic
    UserDB-->>User: result
    User-->>Gateway: business response
    Gateway-->>Client: business response
```

## 6. Protected Request Denied By Missing Token

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant Gateway as "API Gateway"
    participant Filter as "JwtAuthFilter"

    Client->>Gateway: Protected request without Authorization header
    Gateway->>Filter: Invoke JwtAuthFilter
    Filter->>Filter: Path is not public
    Filter->>Filter: Authorization header missing or not Bearer
    Filter-->>Gateway: set status 401 Unauthorized
    Gateway-->>Client: 401 Unauthorized
```

## 7. Protected Request Denied By Invalid Or Tampered Token

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant Gateway as "API Gateway"
    participant Filter as "JwtAuthFilter"

    Client->>Gateway: Protected request with invalid Bearer token
    Gateway->>Filter: Invoke JwtAuthFilter
    Filter->>Filter: Parse JWT
    Filter->>Filter: Signature malformed/tampered/wrong secret
    Filter-->>Gateway: set status 403 Forbidden
    Gateway-->>Client: 403 Forbidden
```

## 8. Protected Request Denied By Expired Token

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant Gateway as "API Gateway"
    participant Filter as "JwtAuthFilter"

    Client->>Gateway: Protected request with expired Bearer token
    Gateway->>Filter: Invoke JwtAuthFilter
    Filter->>Filter: Parse JWT
    Filter->>Filter: ExpiredJwtException
    Filter-->>Gateway: set status 401 Unauthorized
    Gateway-->>Client: 401 Unauthorized
```

## 9. Protected Request Denied By RBAC Rule

Examples:
- `STUDENT -> GET /api/users`
- `INSTRUCTOR -> GET /api/users/email/{email}`
- `STUDENT -> PUT /api/users/{id}/approve-instructor`
- `INSTRUCTOR -> GET /api/users/{otherId}`

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant Gateway as "API Gateway"
    participant Filter as "JwtAuthFilter"

    Client->>Gateway: Protected request + valid Bearer token
    Gateway->>Filter: Invoke JwtAuthFilter
    Filter->>Filter: Parse JWT successfully
    Filter->>Filter: Extract userId, email, role
    Filter->>Filter: Match request against RBAC policy
    Filter->>Filter: role not allowed
    Filter->>Filter: self rule absent OR path id != token userId
    Filter-->>Gateway: set status 403 Forbidden
    Gateway-->>Client: 403 Forbidden
```

## 10. Admin Access To List And Manage Users

```mermaid
sequenceDiagram
    autonumber
    participant Admin as "Admin Client"
    participant Gateway as "API Gateway"
    participant Filter as "JwtAuthFilter"
    participant User as "User Service"
    participant UserDB as "User DB"

    Admin->>Gateway: GET /api/users\nAuthorization: Bearer adminToken
    Gateway->>Filter: Invoke JwtAuthFilter
    Filter->>Filter: Validate token
    Filter->>Filter: Extract role=ADMIN
    Filter->>Filter: Policy match GET /api/users -> ADMIN
    Filter->>Gateway: add X-User-* headers
    Gateway->>User: Forward request
    User->>UserDB: findAll()
    UserDB-->>User: all users
    User-->>Gateway: 200 [users]
    Gateway-->>Admin: 200 [users]

    Admin->>Gateway: PUT /api/users/{instructorUuid}/approve-instructor
    Gateway->>Filter: Invoke JwtAuthFilter
    Filter->>Filter: Validate token and role=ADMIN
    Filter->>Filter: Policy match approve-instructor -> ADMIN
    Gateway->>User: Forward request
    User->>UserDB: findById(instructorUuid)
    UserDB-->>User: instructor user
    User->>UserDB: save(isApproved=true)
    UserDB-->>User: updated user
    User-->>Gateway: 200/204
    Gateway-->>Admin: 200/204
```

## 11. Student Self Profile Flow And Current ID Mismatch

This diagram shows the current implementation caveat in the repo.

```mermaid
sequenceDiagram
    autonumber
    participant Student as "Student Client"
    participant Gateway as "API Gateway"
    participant Filter as "JwtAuthFilter"
    participant Auth as "Auth Service"
    participant User as "User Service"

    Student->>Auth: Login with email/password
    Auth-->>Student: accessToken with numeric userId claim

    Student->>Gateway: GET /api/users/{pathId}\nAuthorization: Bearer studentToken
    Gateway->>Filter: Invoke JwtAuthFilter
    Filter->>Filter: Parse token
    Filter->>Filter: Extract userId from JWT\nCurrent auth-service value is numeric

    alt pathId equals numeric token userId
        Filter->>Filter: self rule passes at gateway
        Gateway->>User: Forward request with X-User-* headers
        User-->>Gateway: likely 400/404 because user-service expects UUID path ids
        Gateway-->>Student: downstream error
    else pathId is different
        Filter->>Filter: self rule fails
        Filter-->>Gateway: 403 Forbidden
        Gateway-->>Student: 403 Forbidden
    end
```

## 12. Authorization Policy Table Used By Gateway

| Method | Path Pattern | Allowed |
| --- | --- | --- |
| `GET` | `/api/users` | `ADMIN` |
| `GET` | `/api/users/email/{email}` | `ADMIN` |
| `GET` | `/api/users/{id}` | `ADMIN` or `self` |
| `PUT` | `/api/users/{id}` | `ADMIN` or `self` |
| `PUT` | `/api/users/{id}/approve-instructor` | `ADMIN` |

## Notes
- Gateway uses local JWT parsing and does not call `/api/auth/validate` during authorization.
- Downstream services currently trust the gateway headers and do not re-parse JWTs.
- Public exceptions currently implemented in the gateway:
  - `/api/auth/**`
  - `GET /api/courses/**`
