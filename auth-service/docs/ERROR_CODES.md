# Auth Service Error Codes

## Overview
This document lists all error codes used in the auth-service for testing and debugging.

## Error Codes

| Code | HTTP Status | Exception Class | Message | Trigger |
|------|------------|----------------|---------|---------|
| AUTH_001 | 401 | InvalidCredentialsException | Invalid credentials | Wrong email/password on login |
| AUTH_002 | 409 | UserAlreadyExistsException | Email already in use | Register with existing email |
| AUTH_003 | 401 | TokenExpiredException | Token expired | JWT access token expired |
| AUTH_004 | 401 | InvalidTokenException | Invalid token | Malformed/tampered JWT |
| AUTH_005 | 404 | UserNotFoundException | User not found | Login with non-existent email |
| AUTH_006 | 401 | InvalidRefreshTokenException | Invalid refresh token | Unknown refresh token |
| AUTH_007 | 401 | RefreshTokenExpiredException | Refresh token expired | Refresh token expired |

## API Error Response Format

```json
{
  "code": "AUTH_XXX",
  "message": "Human readable message"
}
```

## Service Architecture (Phase 2)

```
service/
├── AuthService.java           (interface - contract)
├── TokenService.java       (token generation & validation)
├── RefreshTokenService.java (refresh token lifecycle)
├── impl/
│   ├── AuthServiceImpl.java      (facade)
│   ├── RegistrationService.java  (user creation)
│   └── LoginService.java      (credential verification)
```

### Responsibilities

| Service | Responsibility |
|---------|----------------|
| AuthService | Interface defining register, login, refresh, validate |
| AuthServiceImpl | Facade delegating to specialized services |
| RegistrationService | User creation, role resolution |
| LoginService | Credential verification |
| TokenService | JWT generation, validation, refresh |
| RefreshTokenService | Refresh token CRUD |

## Controller Flow

```
AuthController
    └── AuthService (interface)
            └── AuthServiceImpl (facade)
                    ├── RegistrationService.register()
                    ├── LoginService.login()
                    └── TokenService.refresh() / validate()
```

## Testing Notes

### Register Flow
- Success: Returns 200 with accessToken + refreshToken
- Duplicate email: Returns 409 with AUTH_002

### Login Flow
- Success: Returns 200 with accessToken + refreshToken
- Invalid credentials: Returns 401 with AUTH_001
- User not found: Returns 404 with AUTH_005

### Refresh Flow
- Success: Returns 200 with new accessToken
- Invalid refresh token: Returns 401 with AUTH_006
- Expired refresh token: Returns 401 with AUTH_007

### Validate Flow
- Success: Returns 200 with valid=true + user info
- Expired token: Returns 401 with AUTH_003
- Invalid token: Returns 401 with AUTH_004