# Use Case Diagrams

## 1. Authentication & User Management

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#1e40af',
    'primaryBorderColor': '#1e3a8a',
    'primaryTextColor': '#ffffff',
    'lineColor': '#60a5fa',
    'tertiaryColor': '#dbeafe',
    'fontSize': '13px'
  }
}}%%
flowchart TB
    classDef actor fill:#1e40af,stroke:#1e3a8a,color:#fff,stroke-width:2px
    classDef useCase fill:#ffffff,stroke:#1e40af,color:#1e40af,stroke-width:1.5px
    classDef boundary fill:#dbeafe,stroke:#93c5fd,color:#1e3a8a,stroke-dasharray: 6 3

    subgraph Auth_Boundary["Authentication & Account"]
        UC1["Register Account"]
        UC2["Login"]
        UC3["Refresh Token"]
        UC4["View Profile"]
        UC5["Update Profile"]
        UC6["Delete Account"]
    end

    Student((Student)) --> UC1
    Student --> UC2
    Student --> UC3
    Student --> UC4
    Student --> UC5
    Admin((Admin)) --> UC6
    
    class Student,Admin actor
    class UC1,UC2,UC3,UC4,UC5,UC6 useCase
    class Auth_Boundary boundary
```

---

## 2. Course Management

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#047857',
    'primaryBorderColor': '#065f46',
    'primaryTextColor': '#ffffff',
    'lineColor': '#34d399',
    'tertiaryColor': '#d1fae5',
    'fontSize': '13px'
  }
}}%%
flowchart TB
    classDef actor fill:#047857,stroke:#065f46,color:#fff,stroke-width:2px
    classDef useCase fill:#ffffff,stroke:#047857,color:#047857,stroke-width:1.5px
    classDef boundary fill:#d1fae5,stroke:#6ee7b7,color:#065f46,stroke-dasharray: 6 3

    subgraph Course_Boundary["Course Management"]
        UC1["Create Course"]
        UC2["Update Course"]
        UC3["Publish Course"]
        UC4["Delete Course"]
        UC5["Add Lessons"]
        UC6["Update Lessons"]
        UC7["Browse / Search Courses"]
        UC8["View Course Details"]
    end

    Instructor((Instructor)) --> UC1
    Instructor --> UC2
    Instructor --> UC3
    Instructor --> UC4
    Instructor --> UC5
    Instructor --> UC6
    Student((Student)) --> UC7
    Student --> UC8
    
    class Instructor,Student actor
    class UC1,UC2,UC3,UC4,UC5,UC6,UC7,UC8 useCase
    class Course_Boundary boundary
```

---

## 3. Enrollment & Learning

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#0d9488',
    'primaryBorderColor': '#0f766e',
    'primaryTextColor': '#ffffff',
    'lineColor': '#2dd4bf',
    'tertiaryColor': '#ccfbf1',
    'fontSize': '13px'
  }
}}%%
flowchart TB
    classDef actor fill:#0d9488,stroke:#0f766e,color:#fff,stroke-width:2px
    classDef useCase fill:#ffffff,stroke:#0d9488,color:#0d9488,stroke-width:1.5px
    classDef boundary fill:#ccfbf1,stroke:#5eead4,color:#0f766e,stroke-dasharray: 6 3

    subgraph Learning_Boundary["Enrollment & Learning"]
        UC1["Enroll in Course"]
        UC2["View Enrolled Courses"]
        UC3["View Lessons"]
        UC4["Mark Lesson Complete"]
        UC5["Track Progress"]
        UC6["Check Enrollment Status"]
    end

    Student((Student)) --> UC1
    Student --> UC2
    Student --> UC3
    Student --> UC4
    Student --> UC5
    Student --> UC6
    Instructor((Instructor)) --> UC2
    Instructor --> UC5
    
    class Student,Instructor actor
    class UC1,UC2,UC3,UC4,UC5,UC6 useCase
    class Learning_Boundary boundary
```

---

## 4. Payments

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#d97706',
    'primaryBorderColor': '#b45309',
    'primaryTextColor': '#ffffff',
    'lineColor': '#fbbf24',
    'tertiaryColor': '#fef3c7',
    'fontSize': '13px'
  }
}}%%
flowchart TB
    classDef actor fill:#d97706,stroke:#b45309,color:#fff,stroke-width:2px
    classDef systemActor fill:#475569,stroke:#334155,color:#fff,stroke-width:2px
    classDef useCase fill:#ffffff,stroke:#d97706,color:#d97706,stroke-width:1.5px
    classDef boundary fill:#fef3c7,stroke:#fde68a,color:#b45309,stroke-dasharray: 6 3

    subgraph Payment_Boundary["Payment Processing"]
        UC1["Checkout / Pay for Course"]
        UC2["Process Payment"]
        UC3["Auto-Enroll on Success"]
        UC4["Refund Payment"]
        UC5["View Payment History"]
    end

    Student((Student)) --> UC1
    Student --> UC5
    PaymentGateway((Payment\nGateway)) --> UC2
    System((System)) --> UC3
    Admin((Admin)) --> UC4
    
    class Student,Admin actor
    class PaymentGateway systemActor
    class System systemActor
    class UC1,UC2,UC3,UC4,UC5 useCase
    class Payment_Boundary boundary
```

---

## 5. Reviews

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#db2777',
    'primaryBorderColor': '#9d174d',
    'primaryTextColor': '#ffffff',
    'lineColor': '#f472b6',
    'tertiaryColor': '#fce7f3',
    'fontSize': '13px'
  }
}}%%
flowchart TB
    classDef actor fill:#db2777,stroke:#9d174d,color:#fff,stroke-width:2px
    classDef systemActor fill:#475569,stroke:#334155,color:#fff,stroke-width:2px
    classDef useCase fill:#ffffff,stroke:#db2777,color:#db2777,stroke-width:1.5px
    classDef boundary fill:#fce7f3,stroke:#f9a8d4,color:#9d174d,stroke-dasharray: 6 3

    subgraph Review_Boundary["Reviews & Ratings"]
        UC1["Create Review"]
        UC2["Update Review"]
        UC3["Delete Review"]
        UC4["View Course Reviews"]
        UC5["View Review Summary"]
        UC6["Moderate Review"]
    end

    Student((Student)) --> UC1
    Student --> UC2
    Student --> UC3
    Student((Student)) --> UC4
    Student --> UC5
    Admin((Admin)) --> UC6
    
    class Student,Admin actor
    class UC1,UC2,UC3,UC4,UC5,UC6 useCase
    class Review_Boundary boundary
```

---

## 6. Notifications

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#7c3aed',
    'primaryBorderColor': '#5b21b6',
    'primaryTextColor': '#ffffff',
    'lineColor': '#a78bfa',
    'tertiaryColor': '#ede9fe',
    'fontSize': '13px'
  }
}}%%
flowchart TB
    classDef actor fill:#7c3aed,stroke:#5b21b6,color:#fff,stroke-width:2px
    classDef systemActor fill:#475569,stroke:#334155,color:#fff,stroke-width:2px
    classDef useCase fill:#ffffff,stroke:#7c3aed,color:#7c3aed,stroke-width:1.5px
    classDef boundary fill:#ede9fe,stroke:#c4b5fd,color:#5b21b6,stroke-dasharray: 6 3

    subgraph Notification_Boundary["Notifications"]
        UC1["Send Notification"]
        UC2["View Notifications"]
        UC3["View Unread Count"]
        UC4["Mark as Read"]
        UC5["Mark All as Read"]
    end

    System((System)) --> UC1
    Student((Student)) --> UC2
    Student --> UC3
    Student --> UC4
    Student --> UC5
    
    class System systemActor
    class Student actor
    class UC1,UC2,UC3,UC4,UC5 useCase
    class Notification_Boundary boundary
```

---

## 7. Role & Permission Management (Admin)

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#dc2626',
    'primaryBorderColor': '#b91c1c',
    'primaryTextColor': '#ffffff',
    'lineColor': '#f87171',
    'tertiaryColor': '#fee2e2',
    'fontSize': '13px'
  }
}}%%
flowchart TB
    classDef actor fill:#dc2626,stroke:#b91c1c,color:#fff,stroke-width:2px
    classDef useCase fill:#ffffff,stroke:#dc2626,color:#dc2626,stroke-width:1.5px
    classDef boundary fill:#fee2e2,stroke:#fca5a5,color:#b91c1c,stroke-dasharray: 6 3

    subgraph Admin_Boundary["Role & Permission Management"]
        UC1["Create Role"]
        UC2["List Roles"]
        UC3["Assign Role to User"]
        UC4["Delete Role"]
        UC5["Create Permission"]
        UC6["Add Permission to Role"]
        UC7["Remove Permission from Role"]
        UC8["Assign Instructor Role"]
        UC9["Approve Instructor"]
    end

    Admin((Admin)) --> UC1
    Admin --> UC2
    Admin --> UC3
    Admin --> UC4
    Admin --> UC5
    Admin --> UC6
    Admin --> UC7
    Admin --> UC8
    Admin --> UC9
    
    class Admin actor
    class UC1,UC2,UC3,UC4,UC5,UC6,UC7,UC8,UC9 useCase
    class Admin_Boundary boundary
```