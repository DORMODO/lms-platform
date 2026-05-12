# Sequence Diagrams — Business Process Flows

> Additional sequence diagrams for key LMS business workflows beyond the authentication flows already documented in `README.md`.
> These show inter-service communication patterns including API Gateway routing, Feign client calls, and database persistence.

---

## 1. Course Creation Flow

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#047857',
    'primaryBorderColor': '#065f46',
    'primaryTextColor': '#ffffff',
    'lineColor': '#34d399',
    'tertiaryColor': '#d1fae5',
    'secondaryColor': '#a7f3d0',
    'fontSize': '13px'
  }
}}%%
sequenceDiagram
    actor Instructor
    participant Gateway as API Gateway (8080)
    participant Auth as Auth Service (8086)
    participant Course as Course Service (8083)
    participant DB as Course DB

    Instructor->>Gateway: POST /api/courses\n(headers: JWT + X-User-*)
    activate Gateway

    Gateway->>Auth: GET /api/auth/validate?token=...
    activate Auth
    Auth-->>Gateway: Token Valid + Roles/Permissions
    deactivate Auth

    Gateway->>Gateway: AccessRuleEngine\ncheckPermission(courses:create)

    alt Permission Denied
        Gateway-->>Instructor: 403 Forbidden
    else Permission Granted
        Gateway->>Course: POST /api/courses\n(X-User-Id, X-User-Role)
        activate Course

        Course->>Course: AuditLoggingAspect\n@Around controller

        Course->>DB: INSERT INTO courses\n(title, description, price,\n category, status=DRAFT)
        activate DB
        DB-->>Course: course_id, created_at
        deactivate DB

        Course-->>Gateway: 201 CourseResponse
        deactivate Course

        Gateway-->>Instructor: 201 Created + CourseResponse
    end

    deactivate Gateway
```

---

## 2. Student Enrollment Flow (Free Course)

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#0d9488',
    'primaryBorderColor': '#0f766e',
    'primaryTextColor': '#ffffff',
    'lineColor': '#2dd4bf',
    'tertiaryColor': '#ccfbf1',
    'secondaryColor': '#99f6e4',
    'fontSize': '13px'
  }
}}%%
sequenceDiagram
    actor Student
    participant Gateway as API Gateway (8080)
    participant Course as Course Service (8083)
    participant Notif as Notification Service (8085)
    participant DB as Course DB

    Student->>Gateway: POST /api/courses/{id}/enroll
    activate Gateway

    Gateway->>Gateway: JWT validation + RBAC

    Gateway->>Course: POST /api/courses/{id}/enroll\n(X-User-Id, X-User-Email)
    activate Course

    Course->>DB: SELECT FROM enrollments\nWHERE student_id AND course_id
    activate DB
    DB-->>Course: (empty - not enrolled)
    deactivate DB

    Course->>DB: INSERT INTO enrollments\n(student_id, course_id)
    activate DB
    DB-->>Course: enrollment saved
    deactivate DB

    Course->>Course: Increment enrolled_count\nUPDATE courses SET enrolled_count+1

    Course->>Notif: Feign: POST /api/notifications\n{ userId, type: ENROLLMENT,\n  channel: IN_APP, body: ... }
    activate Notif
    Notif->>Notif: Save Notification
    Notif-->>Course: 200 OK
    deactivate Notif

    Course-->>Gateway: 200 EnrollmentResponse
    deactivate Course

    Gateway-->>Student: 200 Enrolled Successfully
    deactivate Gateway
```

---

## 3. Payment Processing Flow (Paid Course)

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#d97706',
    'primaryBorderColor': '#b45309',
    'primaryTextColor': '#ffffff',
    'lineColor': '#fbbf24',
    'tertiaryColor': '#fef3c7',
    'secondaryColor': '#fde68a',
    'fontSize': '13px'
  }
}}%%
sequenceDiagram
    actor Student
    participant Gateway as API Gateway (8080)
    participant Payment as Payment Service (8084)
    participant Course as Course Service (8083)
    participant Notif as Notification Service (8085)
    participant PayDB as Payment DB
    participant CourseDB as Course DB

    Student->>Gateway: POST /api/payments/pay\n{ studentId, courseId }
    activate Gateway

    Gateway->>Gateway: JWT validation + RBAC

    Gateway->>Payment: POST /api/payments/pay\n(X-User-Id, X-User-Email)
    activate Payment

    Payment->>Payment: Validate CheckoutRequest\n@NotNull studentId, courseId

    Payment->>PayDB: INSERT INTO payments\n(student_id, course_id, amount,\n currency, status=SUCCEEDED,\n receipt_number, transaction_ref)
    activate PayDB
    PayDB-->>Payment: payment saved
    deactivate PayDB

    Payment->>Course: Feign: POST /api/courses/{courseId}/enroll\n(triggers enrollment flow)
    activate Course

    Course->>CourseDB: INSERT INTO enrollments
    activate CourseDB
    CourseDB-->>Course: enrolled
    deactivate CourseDB

    Course->>Course: Increment enrolled_count

    Course->>Notif: Feign: POST /api/notifications\n(type: ENROLLMENT)
    activate Notif
    Notif-->>Course: OK
    deactivate Notif

    Course-->>Payment: 200 EnrollmentResponse
    deactivate Course

    Payment-->>Gateway: 200 PaymentResponse\n{ receipt, transactionRef, status }
    deactivate Payment

    Gateway-->>Student: 200 Payment + Enrollment Successful
    deactivate Gateway
```

---

## 4. Review Submission Flow

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#db2777',
    'primaryBorderColor': '#9d174d',
    'primaryTextColor': '#ffffff',
    'lineColor': '#f472b6',
    'tertiaryColor': '#fce7f3',
    'secondaryColor': '#fbcfe8',
    'fontSize': '13px'
  }
}}%%
sequenceDiagram
    actor Student
    participant Gateway as API Gateway (8080)
    participant Review as Review Service (8087)
    participant Course as Course Service (8083)
    participant DB as Review DB

    Student->>Gateway: POST /api/reviews/courses/{courseId}\n{ rating: 4, comment: "..." }
    activate Gateway

    Gateway->>Gateway: JWT validation

    Gateway->>Review: POST /api/reviews/courses/{courseId}\n(X-User-Id, X-User-Name)
    activate Review

    Review->>Review: Validate ReviewRequest\n@Min(1) @Max(5) @Size(max=2000)

    Review->>Review: Check enrollment\n(verify X-User-Id owns enrollment)

    alt Not Enrolled
        Review-->>Gateway: 403 Forbidden
        Gateway-->>Student: 403 Must be enrolled
    else Enrolled
        Review->>Review: Check duplicate review\n(student_id + course_id)

        alt Already Reviewed
            Review-->>Gateway: 409 Conflict
            Gateway-->>Student: 409 Already reviewed
        else First Review
            Review->>DB: INSERT INTO reviews\n(course_id, student_id,\n student_name, rating, comment)
            activate DB
            DB-->>Review: review saved
            deactivate DB

            Review->>Course: GET /api/courses/{courseId}\n(fetch current rating + count)
            activate Course
            Course-->>Review: { rating, enrolled_count }

            Review->>Review: Recalculate avg rating\n(newAvg = ...)
            deactivate Course

            Review-->>Gateway: 201 ReviewResponse\n{ id, rating, comment }
            deactivate Review

            Gateway-->>Student: 201 Review Created
        end
    end

    deactivate Gateway
```