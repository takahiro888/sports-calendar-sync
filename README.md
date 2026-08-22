# SportsCalendar Sync

MLBの試合日程をGoogle・Appleカレンダーに自動同期できるWebアプリです。  
ロサンゼルス・ドジャースの全試合、および大谷翔平・山本由伸・佐々木朗希の先発予定を、iCalフィードを通じてカレンダーアプリに追加できます。

## デモ

https://sports-calendar-sync-9d780.web.app

## 主な機能

- ドジャースの全試合日程をカレンダーに同期
- 大谷翔平・山本由伸・佐々木朗希の先発登板予定をカレンダーに同期
- Google カレンダー / Apple カレンダーへのiCal URL連携
- 直近の試合プレビュー表示（対戦相手・球場・中継情報）
- カレンダーアプリによる試合スケジュールの自動更新（iCalフィード定期取得）

## 対応サービス・対象

### カレンダー

| カレンダー                      | 対応 |
| ------------------------------- | ---- |
| Google カレンダー               | ✅   |
| Apple カレンダー（iOS / macOS） | ✅   |

### iCalフィード一覧

| 対象       | 内容         | URL                  |
| ---------- | ------------ | -------------------- |
| ドジャース | 全試合日程   | `/ical/dodgers.ics`  |
| 大谷翔平   | 先発登板予定 | `/ical/ohtani.ics`   |
| 山本由伸   | 先発登板予定 | `/ical/yamamoto.ics` |
| 佐々木朗希 | 先発登板予定 | `/ical/sasaki.ics`   |

## 技術スタック

### フロントエンド

| 技術        | バージョン |
| ----------- | ---------- |
| React       | 19         |
| TypeScript  | 6          |
| Vite        | 8          |
| Chakra UI   | v3         |
| React Icons | 5          |

### バックエンド・インフラ

| 技術                               | 用途                                 |
| ---------------------------------- | ------------------------------------ |
| Firebase Cloud Functions v2        | iCalフィードのHTTPエンドポイント     |
| Firebase Hosting                   | フロントエンドのホスティング         |
| MLB Stats API (`statsapi.mlb.com`) | 試合スケジュールの取得（認証不要）   |
| Google Analytics 4                 | カレンダー連携イベントのトラッキング |

### テスト・開発ツール

| ツール                      | 用途                           |
| --------------------------- | ------------------------------ |
| Vitest                      | テストランナー                 |
| Testing Library (React/DOM) | コンポーネントテスト           |
| jsdom                       | ブラウザ環境のエミュレーション |
| ESLint                      | リント                         |

## システム構成

```
ブラウザ（React SPA）
 ├─ MLB Stats API（statsapi.mlb.com）  ← 試合データ取得（フロント直接呼び出し）
 └─ Firebase Hosting（dist/）
       └─ /ical/*.ics
             └─ Firebase Cloud Functions（asia-northeast1）
                   └─ MLB Stats API  ← 試合データ取得（サーバーサイド）
```

- フロントエンドはブラウザから直接 MLB Stats API を呼び出してゲームデータを取得し、UIに表示します。
- `/ical/*.ics` へのアクセスはCloud Functionsにルーティングされ、MLB Stats API から最新の試合データを取得してiCalフォーマットで返します。

## ディレクトリ構成

```
sports-calendar-sync/
├── src/                    # フロントエンド（React）
│   ├── features/
│   │   └── subscription/
│   │       ├── api/        # MLB Stats APIクライアント（フロント用）
│   │       └── components/ # 購読選択・カレンダー連携UI
│   ├── hooks/              # カスタムフック
│   ├── utils/              # ゲームフィルタリング・表示用ユーティリティ
│   ├── data/               # 同期対象の定義データ
│   ├── types/              # 型定義
│   └── tests/              # テスト
├── functions/              # Firebase Cloud Functions
│   └── src/
│       ├── http/           # iCalフィードのHTTPハンドラー
│       ├── ical/           # iCalフォーマット生成
│       └── mlb/            # MLB Stats APIクライアント（サーバー用）
├── firebase.json           # Firebase設定（Hosting・Functions）
├── Makefile                # テスト・デプロイのショートカット
└── .github/workflows/      # CI/CDワークフロー
```

## ローカル開発環境の構築

### 前提条件

- Node.js 20+
- Firebase CLI（`npm install -g firebase-tools`）

### セットアップ

```bash
# 依存パッケージのインストール
npm install

# 開発サーバー起動（フロントエンド）
npm run dev
```

### 利用可能なコマンド

| コマンド             | 内容                                        |
| -------------------- | ------------------------------------------- |
| `npm run dev`        | 開発サーバー起動（Vite、HMR付き）           |
| `npm run build`      | フロントエンドのプロダクションビルド        |
| `npm run preview`    | ビルド結果のローカルプレビュー              |
| `npm run test`       | テスト実行                                  |
| `npm run test:watch` | テストをウォッチモードで実行                |
| `npm run lint`       | ESLintによるリント                          |
| `make test`          | `npm run test` と同等                       |
| `make deploy`        | フロントエンドビルド + Firebase全体デプロイ |

## 環境変数・設定

`.env_template` を参考に `.env.local` を作成してください。

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

> **注意**: 現時点では Supabase はコード上で使用されていません（将来機能向けのプレースホルダーです）。

Google Analytics の測定IDは `index.html` に直接記載されています（`G-ZY4V61YTT1`）。

## テスト

```bash
npm run test
```

`src/tests/` にVitest + Testing Library によるテストが配置されています。

| テスト対象     | ファイル                                                                         |
| -------------- | -------------------------------------------------------------------------------- |
| コンポーネント | `CalendarSyncModal`, `CalendarSyncSection`, `GamePreviewSection`, `SyncItemCard` |
| カスタムフック | `useGames`, `useSyncId`                                                          |
| ユーティリティ | `gameFilters`, `syncItemBuilder`                                                 |

## CI/CD

GitHub Actions による自動化が設定されています。

| トリガー                | 動作                                                |
| ----------------------- | --------------------------------------------------- |
| `main` ブランチへのpush | フロントエンドビルド → Functions & Hosting デプロイ |
| Pull Request作成・更新  | Firebase Hosting プレビューチャンネルへのデプロイ   |

必要なシークレット：

| Secret名                                              | 用途                                 |
| ----------------------------------------------------- | ------------------------------------ |
| `FIREBASE_SERVICE_ACCOUNT_SPORTS_CALENDAR_SYNC_9D780` | Firebase認証（デプロイ・プレビュー） |
| `GITHUB_TOKEN`                                        | PRへのプレビューURL自動コメント      |

## デプロイ

```bash
# フロントエンドビルド + Hosting & Functions 一括デプロイ
make deploy

# Functionsのみデプロイ
cd functions && npm run deploy
```

Firebase プロジェクトID: `sports-calendar-sync-9d780`

## iCal連携の仕組み

1. ユーザーがWebアプリで対象（チームまたは選手）を選択し、Google/Appleカレンダーを選ぶ
2. iCal URLがクリップボードにコピーされ、カレンダーアプリへの登録手順が案内される
3. カレンダーアプリが定期的にiCal URLへアクセス（`REFRESH-INTERVAL: 6時間`）
4. Firebase Cloud Functions が MLB Stats API から最新の試合データを取得
5. iCalフォーマット（RFC 5545）でレスポンスを返し、カレンダーアプリに自動反映

各フィードに含まれる情報：

- 試合日時（UTC → JST換算）
- 対戦相手（日本語チーム名）
- 球場名
- テレビ中継情報

個人フィード（大谷・山本・佐々木）は、MLB Stats API の `probablePitcher` フィールドを使用して先発登板予定の試合のみフィルタリングします。

iCal URLには `?s={syncId}` のクエリパラメータが付与されます。`syncId` はブラウザの `localStorage` に保存されるUUIDで、リクエストログの識別に使用されます。

## 今後の改善・TODO

- Firebase Emulator を用いたCloud Functionsのローカル実行環境整備
- Supabase連携機能の実装（`.env_template` に変数が用意されているが未実装）
- 対応チーム・選手の拡充
- iCalフィードのキャッシュ戦略の最適化
