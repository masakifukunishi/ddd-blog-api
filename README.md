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
src/
├── domain/
│   ├── models/
│   │   ├── user/
│   │   │   ├── User.ts          # ユーザーエンティティ
│   │   │   └── EmailAddress.ts  # メールアドレス値オブジェクト
│   │   └── article/
│   │       └── Article.ts       # 記事エンティティ
│   └── repositories/
│       ├── UserRepository.ts     # ユーザーリポジトリのインターフェース
│       └── ArticleRepository.ts  # 記事リポジトリのインターフェース
│
├── application/
│   ├── services/
│   │   ├── UserApplicationService.ts  # ユーザー関連のユースケース
│   │   └── ArticleApplicationService.ts # 記事関連のユースケース
│   └── errors/
│       └── ApplicationError.ts   # アプリケーションエラー
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