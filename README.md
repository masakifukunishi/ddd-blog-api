# ddd-blog-ts

- domain/: ドメイン層

    - models/: エンティティと値オブジェクト
    - repositories/: リポジトリのインターフェース定義


- application/: アプリケーション層

    - services/: ユースケースの実装
    - errors/: アプリケーション固有のエラー定義


- infrastructure/: インフラストラクチャ層

    - prisma/: Prisma関連の設定
    - repositories/: リポジトリの具体的な実装


- interface/: インターフェース層

    - controllers/: HTTPリクエストのハンドリング

## 依存関係
interface → application → domain ← infrastructure