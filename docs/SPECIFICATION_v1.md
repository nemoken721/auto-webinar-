# AutoWebinar v1.0 仕様書

## 概要

AutoWebinarは、YouTube動画を使用した疑似ライブウェビナーを配信するためのSaaSプラットフォームです。毎日指定した時刻に自動的にウェビナーを開始し、視聴者にはライブ配信のように見せることができます。

---

## 技術スタック

### フロントエンド
- **Next.js 16** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS 4**
- **shadcn/ui** (UIコンポーネント)
- **Framer Motion** (アニメーション)

### バックエンド
- **Firebase Authentication** (認証)
- **Cloud Firestore** (データベース)
- **Next.js API Routes** (サーバーサイドAPI)

### インフラ
- **Vercel** (ホスティング・デプロイ)
- **GitHub** (ソースコード管理)

### 外部API
- **YouTube IFrame API** (動画再生)

---

## 機能一覧

### 1. 認証機能
- メール/パスワードによるログイン
- Firebase Authenticationによるセッション管理
- 認証ガード（未ログイン時はリダイレクト）

### 2. ダッシュボード
- ウェビナー一覧表示
- ウェビナーの作成・編集・削除
- 埋め込みコードの生成・コピー
- プレビュー機能
- **レスポンシブ対応**（モバイルハンバーガーメニュー）

### 3. ウェビナー設定
| 項目 | 説明 |
|------|------|
| YouTube URL | 配信する動画のURL |
| タイトル | ウェビナーのタイトル |
| 動画の長さ | HH:MM:SS形式で入力 |
| 毎日の開催時刻 | ウェビナーが始まる時刻 |
| サムネイル | YouTube動画から自動取得 |
| CTA設定 | ボタン表示タイミング、ラベル、リンク先 |
| 再訪問ブロック | 一度視聴したユーザーをブロック |

### 4. ウェビナー視聴ページ
- **3つの状態管理**
  - `BEFORE`: 開始前（カウントダウン表示）
  - `ON_AIR`: 配信中（動画再生）
  - `ENDED`: 終了後（終了画面表示）
- **LIVE**バッジ表示
- **クリックブロッカー**（YouTube UIを隠す）
- **CTA**ボタン（指定時間後に表示）
- **終了画面**（動画終了時に表示）

### 5. 埋め込み機能
- 外部サイト（WordPress等）への埋め込み対応
- リンク形式の埋め込みコード
- カスタムサムネイル付きリンク
- **レスポンシブ対応**

---

## データ構造

### Firestore コレクション

#### `tenants` (テナント/ユーザー)
```typescript
interface Tenant {
  id: string;           // Firebase Auth UID
  email: string;
  companyName: string;
  isAdmin: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### `webinars` (ウェビナー)
```typescript
interface Webinar {
  id: string;
  tenantId: string;
  title: string;
  youtubeId: string;
  durationSec: number;      // 動画の長さ（秒）
  scheduleTime: string;     // "HH:MM" 形式
  thumbnailUrl?: string;
  ctaSettings?: {
    showTimeSec: number;    // CTA表示タイミング（秒）
    label: string;          // ボタンのラベル
    url: string;            // リンク先URL
  };
  loopProtection: boolean;  // 再訪問ブロック
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

## API エンドポイント

### `/api/server-time`
- **Method**: GET
- **説明**: サーバーの現在時刻を取得
- **レスポンス**: `{ serverTime: string }`

### `/api/youtube-info`
- **Method**: POST
- **説明**: YouTube動画の情報を取得
- **リクエスト**: `{ videoId: string }`
- **レスポンス**: `{ title, thumbnailUrl, durationSec, needsManualInput }`

---

## ページ構成

### 認証関連
| パス | 説明 |
|------|------|
| `/login` | ログインページ |

### ダッシュボード
| パス | 説明 |
|------|------|
| `/dashboard` | ウェビナー一覧 |
| `/webinars/new` | ウェビナー新規作成 |
| `/webinars/[id]/edit` | ウェビナー編集 |

### 視聴ページ
| パス | 説明 |
|------|------|
| `/watch/[id]` | ウェビナー視聴ページ |
| `/watch/[id]?preview=true` | プレビューモード |
| `/embed/[id]` | 埋め込み用ページ |

---

## ウェビナー状態管理ロジック

```typescript
function calculateWebinarState(scheduleTime: string, durationSec: number) {
  // 1. サーバー時刻を取得
  // 2. 本日の開始時刻を計算
  // 3. 終了時刻を計算（開始時刻 + 動画の長さ）
  // 4. 現在時刻と比較して状態を決定

  if (now < startTime) {
    return 'BEFORE';  // カウントダウン表示
  } else if (now < endTime) {
    return 'ON_AIR';  // 動画再生（途中から開始）
  } else {
    return 'ENDED';   // 終了画面表示
  }
}
```

---

## 埋め込みコード仕様

### 生成される埋め込みコード
```html
<style>
.webinar-embed{max-width:640px;margin:0 auto}
.webinar-embed .live-badge{...}
.webinar-embed .play-circle{...}
.webinar-embed .play-text{...}
@media(min-width:640px){...}
</style>
<div class="webinar-embed">
  <a href="https://[domain]/watch/[id]" target="_blank">
    <div style="position:relative;...">
      <img src="[thumbnail]" alt="ウェビナー" />
      <div class="live-badge">LIVE</div>
      <div class="play-circle">▶</div>
      <div class="play-text">クリックして視聴する</div>
    </div>
  </a>
</div>
```

### 特徴
- インラインCSS（外部依存なし）
- レスポンシブ対応（モバイル/デスクトップ）
- 新しいタブで視聴ページを開く

---

## レスポンシブ対応

### ブレークポイント
| サイズ | 幅 | 用途 |
|--------|-----|------|
| モバイル | < 640px | スマートフォン |
| sm | ≥ 640px | 小型タブレット |
| md | ≥ 768px | タブレット |
| lg | ≥ 1024px | ノートPC |
| xl | ≥ 1280px | デスクトップ |

### 視聴ページ（横向きモバイル対応）
```css
@media (orientation: landscape) and (max-height: 500px) {
  .webinar-video-container {
    height: calc(100vh - 50px);
    /* CTAボタンの余白を確保 */
  }
}
```

### ダッシュボード
- モバイル: ハンバーガーメニュー + スライドインサイドバー
- デスクトップ: 固定サイドバー（256px幅）

---

## 環境変数

### `.env.local`
```
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# App
NEXT_PUBLIC_APP_URL=https://auto-webinar.vercel.app
```

---

## デプロイ手順

### Vercel Deploy Hook
```powershell
# PowerShellでデプロイをトリガー
Invoke-WebRequest -Uri "https://api.vercel.com/v1/integrations/deploy/prj_0fbL3tAkDQ5M2ZNJzMvy5z0ciqVn/jVqRunlS4r" -Method POST
```

### 手動デプロイ
```bash
git add -A
git commit -m "変更内容"
git push origin main
# Deploy Hookを実行
```

---

## ディレクトリ構成

```
src/
├── app/
│   ├── (dashboard)/           # ダッシュボード関連
│   │   ├── dashboard/
│   │   ├── webinars/
│   │   └── layout.tsx
│   ├── api/                   # APIエンドポイント
│   │   ├── server-time/
│   │   └── youtube-info/
│   ├── embed/[id]/            # 埋め込みページ
│   ├── login/                 # ログインページ
│   ├── watch/[id]/            # 視聴ページ
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── auth/                  # 認証コンポーネント
│   ├── dashboard/             # ダッシュボードコンポーネント
│   ├── player/                # 動画プレイヤーコンポーネント
│   └── ui/                    # shadcn/ui コンポーネント
├── contexts/
│   └── AuthContext.tsx        # 認証コンテキスト
├── hooks/
│   └── useWebinarState.ts     # ウェビナー状態フック
├── lib/
│   ├── embed-code.ts          # 埋め込みコード生成
│   ├── firebase.ts            # Firebase初期化・操作
│   ├── utils.ts               # ユーティリティ
│   ├── webinar-state.ts       # 状態計算ロジック
│   └── youtube.ts             # YouTube関連
└── types/
    └── index.ts               # 型定義
```

---

## 既知の制限事項

1. **YouTube動画のみ対応** - Vimeo等は未対応
2. **1日1回の配信** - 同一時刻に毎日配信（複数時間帯は未対応）
3. **管理者機能は未実装** - テナント管理画面は未完成
4. **アナリティクスなし** - 視聴者数等の統計機能なし

---

## 今後の拡張予定

- [ ] アナリティクス機能（視聴者数、離脱率等）
- [ ] 複数配信時間帯の設定
- [ ] カスタムドメイン対応
- [ ] チャット機能（疑似ライブチャット）
- [ ] メール通知機能
- [ ] 複数言語対応

---

## 変更履歴

### v1.0 (2024-12-12)
- 初版リリース
- 基本的なウェビナー作成・配信機能
- 埋め込みコード生成
- レスポンシブ対応（ダッシュボード・視聴ページ）
- 横向きモバイル対応
