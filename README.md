# ddd-blog-ts

- domain/: ドメイン層

    - models/: エンティティと値オブジェクト
    - services/: ドメインサービス
    - repositories/: リポジトリのインターフェース定義


- application/: アプリケーション層

    - services/: ユースケースの実装
    - commands/: コマンド


- infrastructure/: インフラストラクチャ層

    - prisma/: Prisma関連の設定
    - repositories/: リポジトリの具体的な実装


- interface/: インターフェース層

    - controllers/: HTTPリクエストのハンドリング
    - middlewares/: ミドルウェア

## 依存関係
interface → application → domain ← infrastructure


## 設計
├── domain/
│   ├── models/
│   │   ├── user/
│   │   │   ├── User.ts          # ユーザーエンティティ
│   │   │   └── EmailAddress.ts  # メールアドレス値オブジェクト
│   │   └── article/
│   │       └── Article.ts       # 記事エンティティ

│   ├── services/
│       ├── UserDomainService.ts

│   └── repositories/

│       ├── UserRepository.ts     # ユーザーリポジトリのインターフェース

│       └── ArticleRepository.ts  # 記事リポジトリのインターフェース

│

├── application/

│   ├── services/

│   │   ├── UserApplicationService.ts  # ユーザー関連のユースケース

│   │   └── ArticleApplicationService.ts # 記事関連のユースケース

│

├── infrastructure/

│   ├── prisma/

│   │   └── schema.prisma        # Prismaスキーマ

│   └── repositories/

│       ├── PrismaUserRepository.ts  # UserRepositoryの実装

│       └── PrismaArticleRepository.ts # ArticleRepositoryの実装

│

├── interface/

│   └── controllers/

│       ├── UserController.ts     # ユーザー関連のエンドポイント

│       └── ArticleController.ts  # 記事関連のエンドポイント

│

└── index.ts                      # アプリケーションのエントリーポイント

## Example API requests

### 1. Create a new user
```bash
curl -X POST http://localhost:3000/users \
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
curl -X GET http://localhost:3000/users/1
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
curl -X POST http://localhost:3000/articles \
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
curl -X GET http://localhost:3000/articles/1
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
curl -X GET http://localhost:3000/users/1/articles
```

```json
Expected response (200 OK):
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
curl -X DELETE http://localhost:3000/articles/1/users/1
```
Expected response (204 No Content)

### 7. Delete user
```bash
curl -X DELETE http://localhost:3000/users/1
```

Expected response (204 No Content)

## Example requests with error responses

### 8. Create user with duplicate email
```bash
curl -X POST http://localhost:3000/users \
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
curl -X POST http://localhost:3000/articles \
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
curl -X DELETE http://localhost:3000/articles/1/users/2
```

Expected response (403 Forbidden)
```json
{
  "message": "Not authorized to delete this article"
}
```