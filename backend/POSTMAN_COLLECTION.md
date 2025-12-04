# 🚀 ContestMaster API - Postman Testing Guide

Base URL: `http://localhost:3000/api/v1`

---

## 📁 1. AUTHENTICATION

### 1.1 Register User
```
POST /auth/register
Content-Type: application/json

Body:
{
  "email": "organizer@test.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "ORGANIZER",
  "age": 30,
  "institution": "Tech University"
}

Response: 201
{
  "access_token": "eyJhbGc...",
  "user": {
    "id": "clx...",
    "email": "organizer@test.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "ORGANIZER"
  }
}
```

### 1.2 Login
```
POST /auth/login
Content-Type: application/json

Body:
{
  "email": "organizer@test.com",
  "password": "password123"
}

Response: 200
{
  "access_token": "eyJhbGc...",
  "user": { ... }
}
```

**💡 Save the `access_token` for subsequent requests!**

---

## 📁 2. CONTESTS

### 2.1 Create Contest
```
POST /contests
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

Body:
{
  "title": "Innovation Challenge 2024",
  "description": "A contest for innovative tech solutions",
  "startDate": "2024-12-10T00:00:00Z",
  "endDate": "2025-06-30T00:00:00Z",
  "maxCandidates": 100,
  "autoTransition": true,
  "organizerId": "YOUR_USER_ID"
}

Response: 201
{
  "id": "clx...",
  "title": "Innovation Challenge 2024",
  ...
}
```

### 2.2 Get All Contests (with Pagination)
```
GET /contests?page=1&limit=10&isActive=true
Authorization: Bearer YOUR_TOKEN

Response: 200
{
  "data": [
    {
      "id": "clx...",
      "title": "Innovation Challenge 2024",
      "organizer": { ... },
      "_count": {
        "candidates": 5,
        "juryMembers": 3
      }
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### 2.3 Get Contest by ID
```
GET /contests/:id
Authorization: Bearer YOUR_TOKEN

Response: 200
{
  "id": "clx...",
  "title": "Innovation Challenge 2024",
  "organizer": { ... },
  "steps": [ ... ],
  "candidates": [ ... ],
  "juryMembers": [ ... ],
  "_count": { ... }
}
```

### 2.4 Get Contest Statistics
```
GET /contests/:id/statistics
Authorization: Bearer YOUR_TOKEN

Response: 200
{
  "contestId": "clx...",
  "title": "Innovation Challenge 2024",
  "currentStep": "REGISTRATION",
  "statistics": {
    "totalCandidates": 10,
    "qualifiedCandidates": 8,
    "eliminatedCandidates": 2,
    "activeJuryMembers": 5,
    "totalSubmissions": 15
  }
}
```

### 2.5 Update Contest
```
PUT /contests/:id
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

Body:
{
  "title": "Updated Contest Title",
  "isActive": true
}

Response: 200
{
  "id": "clx...",
  "title": "Updated Contest Title",
  ...
}
```

### 2.6 Delete Contest
```
DELETE /contests/:id
Authorization: Bearer YOUR_TOKEN

Response: 204 No Content
```

---

## 📁 3. WORKFLOW

### 3.1 Transition Contest Step
```
POST /workflow/:contestId/transition
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

Body:
{
  "toStep": "REGISTRATION",
  "triggeredBy": "YOUR_USER_ID"
}

Response: 200
{
  "success": true,
  "newStep": "REGISTRATION"
}
```

**Available Steps:**
- `DRAFT`
- `REGISTRATION`
- `PRE_SELECTION`
- `JURY_EVALUATION`
- `RESULT`

---

## 📁 4. RULES ENGINE

### 4.1 Execute Rules for Contest
```
POST /rules/:contestId/execute
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

Body:
{
  "executedBy": "YOUR_USER_ID"
}

Response: 200
{
  "contestId": "clx...",
  "totalRules": 3,
  "executedRules": 3,
  "results": [
    {
      "ruleId": "clx...",
      "ruleName": "Age Limit Rule",
      "ruleType": "AGE_LIMIT",
      "success": true,
      "affectedCount": 2
    },
    {
      "ruleId": "clx...",
      "ruleName": "Submission Count Rule",
      "ruleType": "SUBMISSION_COUNT",
      "success": true,
      "affectedCount": 1
    }
  ]
}
```

---

## 📁 5. JURY ASSIGNMENT

### 5.1 Assign Jury to Candidates
```
POST /jury/:contestId/assign
Authorization: Bearer YOUR_TOKEN

Response: 200
[
  {
    "juryMemberId": "clx...",
    "candidateId": "clx...",
    "workloadScore": 1
  },
  ...
]
```

### 5.2 Get Jury Assignments
```
GET /jury/:contestId/assignments
Authorization: Bearer YOUR_TOKEN

Response: 200
[
  {
    "id": "clx...",
    "juryMember": {
      "id": "clx...",
      "user": {
        "firstName": "Jane",
        "lastName": "Expert"
      }
    },
    "candidate": {
      "id": "clx...",
      "user": {
        "firstName": "Alice",
        "lastName": "Participant"
      }
    },
    "assignedAt": "2024-12-04T10:00:00Z",
    "isActive": true
  }
]
```

---

## 📁 6. SCORING

### 6.1 Calculate Scores
```
POST /scoring/:contestId/calculate
Authorization: Bearer YOUR_TOKEN

Response: 200
{
  "contestId": "clx...",
  "totalCandidates": 10,
  "calculatedScores": 10,
  "results": [
    {
      "candidateId": "clx...",
      "finalScore": 16.5,
      "medianScore": 16.0,
      "weightedScore": 16.5,
      "anomaliesCount": 0,
      "anomalies": []
    },
    ...
  ]
}
```

### 6.2 Get Contest Results (Rankings)
```
GET /scoring/:contestId/results
Authorization: Bearer YOUR_TOKEN

Response: 200
{
  "contestId": "clx...",
  "totalResults": 10,
  "rankings": [
    {
      "rank": 1,
      "candidateId": "clx...",
      "candidateName": "Alice Participant",
      "finalScore": 18.5,
      "calculationType": "weighted_average",
      "calculatedAt": "2024-12-04T10:00:00Z"
    },
    {
      "rank": 2,
      "candidateId": "clx...",
      "candidateName": "Bob Candidate",
      "finalScore": 17.2,
      "calculationType": "weighted_average",
      "calculatedAt": "2024-12-04T10:00:00Z"
    },
    ...
  ]
}
```

---

## 🔧 POSTMAN SETUP

### Step 1: Create Environment
```
Variable Name: base_url
Value: http://localhost:3000/api/v1

Variable Name: token
Value: (will be set automatically)
```

### Step 2: Set Token Automatically

In **Register** or **Login** request, add to **Tests** tab:
```javascript
if (pm.response.code === 200 || pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("token", response.access_token);
}
```

### Step 3: Use Token in Requests

In **Authorization** tab:
- Type: Bearer Token
- Token: `{{token}}`

---

## 📝 COMPLETE TEST FLOW

### 1. Setup Users
```bash
# Register Organizer
POST /auth/register
{
  "email": "organizer@test.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Organizer",
  "role": "ORGANIZER"
}

# Register Jury Member
POST /auth/register
{
  "email": "jury@test.com",
  "password": "password123",
  "firstName": "Jane",
  "lastName": "Expert",
  "role": "JURY_MEMBER",
  "age": 40,
  "institution": "University A"
}

# Register Candidate
POST /auth/register
{
  "email": "candidate@test.com",
  "password": "password123",
  "firstName": "Alice",
  "lastName": "Participant",
  "role": "CANDIDATE",
  "age": 22,
  "institution": "University B"
}
```

### 2. Create Contest (as Organizer)
```bash
POST /contests
{
  "title": "Test Contest",
  "description": "Testing the system",
  "startDate": "2024-12-10T00:00:00Z",
  "endDate": "2025-06-30T00:00:00Z",
  "maxCandidates": 50,
  "organizerId": "ORGANIZER_USER_ID"
}
```

### 3. Transition Workflow
```bash
POST /workflow/CONTEST_ID/transition
{
  "toStep": "REGISTRATION",
  "triggeredBy": "ORGANIZER_USER_ID"
}
```

### 4. Execute Rules
```bash
POST /rules/CONTEST_ID/execute
{
  "executedBy": "ORGANIZER_USER_ID"
}
```

### 5. Assign Jury
```bash
POST /jury/CONTEST_ID/assign
```

### 6. Calculate Scores
```bash
POST /scoring/CONTEST_ID/calculate
```

### 7. Get Results
```bash
GET /scoring/CONTEST_ID/results
```

---

## ⚠️ COMMON ERRORS

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```
**Fix:** Add valid Bearer token in Authorization header

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Start date must be before end date"
}
```
**Fix:** Check request body validation

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Contest with ID clx... not found"
}
```
**Fix:** Use valid resource ID

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```
**Fix:** User role doesn't have permission

---

## 🎯 ROLE PERMISSIONS

| Endpoint | ORGANIZER | JURY_MEMBER | CANDIDATE | ADMIN |
|----------|-----------|-------------|-----------|-------|
| POST /contests | ✅ | ❌ | ❌ | ✅ |
| GET /contests | ✅ | ✅ | ✅ | ✅ |
| PUT /contests/:id | ✅ | ❌ | ❌ | ✅ |
| DELETE /contests/:id | ✅ | ❌ | ❌ | ✅ |
| POST /workflow/:id/transition | ✅ | ❌ | ❌ | ✅ |
| POST /rules/:id/execute | ✅ | ❌ | ❌ | ✅ |
| POST /jury/:id/assign | ✅ | ❌ | ❌ | ✅ |
| POST /scoring/:id/calculate | ✅ | ✅ | ❌ | ✅ |
| GET /scoring/:id/results | ✅ | ✅ | ✅ | ✅ |

---

## 📥 IMPORT TO POSTMAN

Save this as JSON and import:

```json
{
  "info": {
    "name": "ContestMaster API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "url": "{{base_url}}/auth/register",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"password123\",\n  \"firstName\": \"Test\",\n  \"lastName\": \"User\",\n  \"role\": \"ORGANIZER\"\n}"
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "url": "{{base_url}}/auth/login",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"password123\"\n}"
            }
          }
        }
      ]
    }
  ]
}
```

---

**Happy Testing! 🚀**
