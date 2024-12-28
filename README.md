# Blog service with DDD and Layered Architecture
## Directory Structure

### src/
- interface/: Interface Layer

    - controllers/: HTTP Request Handling
    - middlewares/: Middleware Functions
    - routes/: Route Definitions

- application/: Application Layer

    - services/: Application Services
    - commands/: Command Objects
    - errors/: Custom Error Classes
  
- domain/: Domain Layer

    - models/: Entities and Value Objects
    - services/: Domain Services
    - repositories/: Repository Interface Definitions


- infrastructure/: Infrastructure Layer

    - prisma/: Prisma Related Configurations
    - repositories/: Concrete Repository Implementations

### tests/
 - unit/: Unit Tests
 - integration/: Integration Tests
 - helpers/: Test Helper Functions

## Dependency Direction
interface → application → domain ← infrastructure

## Technical Stack
- Node.js
- Express
- Prisma
- TypeScript
- Docker
- Vitest
- SQLite

## How to run
1. docker compose up -d
2. docker compose exec app npm run prisma:migrate-dev

## How to test
1. docker compose exec app npm run test
2. docker compose exec app npm run test:coverage

## Example API requests

### 1. Create a new user
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com"
  }'
```

Expected response (201 Created)
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

### 2. Get user by ID
```bash
curl -X GET http://localhost:3000/api/users/1
```

Expected response (200 OK)
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

###  3. Create a new article
```bash
curl -X POST http://localhost:3000/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Article",
    "content": "This is the content of my first article.",
    "userId": 1
  }'
```

Expected response (201 Created)
```json
{
  "id": 1,
  "title": "My First Article",
  "content": "This is the content of my first article.",
  "userId": 1,
  "createdAt": "2024-12-24T10:00:00.000Z"
}
```

### 4. Get article by ID
```bash
curl -X GET http://localhost:3000/api/articles/1
```

Expected response (200 OK)
```json
{
  "id": 1,
  "title": "My First Article",
  "content": "This is the content of my first article.",
  "userId": 1,
  "createdAt": "2024-12-24T10:00:00.000Z"
}
```

### 5. Get user's articles
```bash
curl -X GET http://localhost:3000/api/users/1/articles
```

Expected response (200 OK)

```json
[
  {
    "id": 1,
    "title": "My First Article",
    "content": "This is the content of my first article.",
    "userId": 1,
    "createdAt": "2024-12-24T10:00:00.000Z"
  }
]
```

### 6. Delete article (by owner)
```bash
curl -X DELETE http://localhost:3000/api/articles/1/users/1
```
Expected response (204 No Content)

### 7. Delete user
```bash
curl -X DELETE http://localhost:3000/api/users/1
```

Expected response (204 No Content)

## Example requests with error responses

### 8. Create user with duplicate email
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "john@example.com"
  }'
```

Expected response (409 Conflict)
```bash
{
  "message": "Email address is already in use"
}
```

### 9. Create article with invalid user
```bash
curl -X POST http://localhost:3000/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Invalid Article",
    "content": "This article should not be created.",
    "userId": 999
  }'
```

Expected response (404 Not Found)
```json
{
  "message": "User not found"
}
```

### 10. Delete article by non-owner
```bash
curl -X DELETE http://localhost:3000/api/articles/1/users/2
```

Expected response (403 Forbidden)
```json
{
  "message": "Not authorized to delete this article"
}
```