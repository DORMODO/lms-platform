# Entity-Relationship Diagrams

## 1. Shared Database (`lms_db`) — Auth Service & User Service

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#1e40af',
    'primaryBorderColor': '#1e3a8a',
    'primaryTextColor': '#000000',
    'lineColor': '#60a5fa',
    'tertiaryColor': '#1e3a8a',
    'fontSize': '13px'
  }
}}%%
erDiagram
    users {
        bigint id PK
        varchar email UK "NOT NULL"
        varchar password
        varchar full_name
        bigint role_id FK "NOT NULL"
        uuid uuid UK
        boolean is_approved
        timestamp created_at
    }
    roles {
        bigint id PK
        varchar name UK "NOT NULL"
        boolean is_static
        timestamp created_at
    }
    permissions {
        bigint id PK
        varchar name UK "NOT NULL"
        varchar description
        timestamp created_at
    }
    role_permissions {
        bigint role_id PK, FK
        bigint permission_id PK, FK
    }
    refresh_tokens {
        bigint id PK
        varchar token UK
        bigint user_id FK
        timestamp expiry_date
    }
    users }o--|| roles : "belongs to"
    refresh_tokens }o--|| users : "owned by"
    roles ||--o{ role_permissions : "has"
    permissions ||--o{ role_permissions : "assigned to"
```

---

## 2. Course Database (`course_db`) — Course Service

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#059669',
    'primaryBorderColor': '#047857',
    'primaryTextColor': '#000000',
    'lineColor': '#6ee7b7',
    'tertiaryColor': '#065f46',
    'fontSize': '13px'
  }
}}%%
erDiagram
    courses {
        bigint course_id PK
        varchar title "NOT NULL"
        text description
        double price
        varchar category
        varchar thumbnail_url
        double rating
        int enrolled_count
        varchar instructor_name
        bigint instructor_id
        varchar difficulty_level "BEGINNER / INTERMEDIATE / ADVANCED"
        varchar status "DRAFT / PUBLISHED"
        boolean featured
        timestamp created_at
        timestamp updated_at
    }
    lessons {
        bigint lesson_id PK
        varchar title "NOT NULL"
        varchar type "VIDEO / QUIZ / TEXT"
        varchar content_url
        int duration
        int position
        bigint course_id FK
    }
    enrollments {
        bigint id PK
        bigint student_id "NOT NULL"
        bigint course_id FK "NOT NULL"
        timestamp enrolled_at
    }
    lesson_progress {
        bigint id PK
        bigint student_id "NOT NULL"
        bigint lesson_id FK "NOT NULL"
        boolean completed
        timestamp completed_at
    }
    courses ||--o{ lessons : "contains"
    courses ||--o{ enrollments : "has"
    lessons ||--o{ lesson_progress : "tracks"
```

---

## 3. Notification Database (`notification_db`) — Notification Service

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#8b5cf6',
    'primaryBorderColor': '#7c3aed',
    'primaryTextColor': '#000000',
    'lineColor': '#c4b5fd',
    'tertiaryColor': '#5b21b6',
    'fontSize': '13px'
  }
}}%%
erDiagram
    notifications {
        bigint id PK
        bigint user_id "NOT NULL"
        varchar type "NOT NULL"
        varchar title
        text body
        varchar channel "EMAIL / IN_APP"
        varchar status "PENDING / SENT / FAILED"
        boolean read
        timestamp created_at
        timestamp sent_at
    }
```

---

## 4. Payment Database (`payment_db`) — Payment Service

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#f59e0b',
    'primaryBorderColor': '#d97706',
    'primaryTextColor': '#000000',
    'lineColor': '#fcd34d',
    'tertiaryColor': '#b45309',
    'fontSize': '13px'
  }
}}%%
erDiagram
    payments {
        bigint id PK
        bigint student_id "NOT NULL"
        bigint course_id "NOT NULL"
        double amount "NOT NULL"
        varchar currency "e.g. USD"
        varchar status "SUCCEEDED / REFUNDED"
        varchar receipt_number
        varchar transaction_ref
        timestamp created_at
    }
```

---

## 5. Review Database (`review_db`) — Review Service

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#ec4899',
    'primaryBorderColor': '#db2777',
    'primaryTextColor': '#000000',
    'lineColor': '#f9a8d4',
    'tertiaryColor': '#9d174d',
    'fontSize': '13px'
  }
}}%%
erDiagram
    reviews {
        bigint id PK
        bigint course_id "NOT NULL"
        bigint student_id "NOT NULL"
        varchar student_name "NOT NULL"
        int rating "1-5"
        text comment
        timestamp created_at
        timestamp updated_at
    }
```