# Gray Cat 個人作品集與部落格

一個使用 Next.js 構建的個人作品集和部落格網站，具有用戶認證、社交功能和內容管理功能。

## 功能特色

### 作品集
- 互動式專案展示
- 技能和經驗展示
- 教育和證書列表
- 響應式設計，適合所有裝置
- 深色/淺色模式支援

### 部落格
- 基於 Markdown 的部落格文章
- 主題分類
- 用戶互動功能：
  - 文章點讚
  - 主題追蹤
  - 評論系統
- 管理員面板進行內容管理

### 認證系統
- 多種登入選項：
  - 電子郵件/密碼認證
  - GitHub OAuth
  - Google OAuth
- 使用 bcrypt 進行安全密碼處理
- NextAuth.js 整合實現會話管理
- 用戶檔案管理

## 技術堆疊

- **前端**：
  - Next.js 15.1 (App Router)
  - React 19.0
  - TypeScript (嚴格模式)
  - TailwindCSS
  - shadcn/ui 組件
  - Framer Motion 動畫

- **後端**：
  - Next.js API 路由
  - Prisma ORM
  - SQLite 資料庫 (可替換為 PostgreSQL, MySQL 等)
  - NextAuth.js 用於認證

## API 端點

### 認證
- **POST /api/auth/register** - 註冊新用戶
- **GET/POST /api/auth/[...nextauth]** - NextAuth.js 認證處理器

### 部落格文章
- **GET /api/blog/posts** - 獲取所有部落格文章
- **GET /api/blog/posts/[slug]** - 獲取特定部落格文章
- **POST /api/blog/posts/[slug]/likes** - 喜歡/取消喜歡文章
- **GET /api/blog/posts/[slug]/likes/count** - 獲取文章的喜歡數量
- **GET /api/blog/posts/[slug]/likes/user** - 檢查當前用戶是否喜歡文章

### 評論
- **GET /api/blog/posts/[slug]/comments** - 獲取文章的評論
- **POST /api/blog/posts/[slug]/comments** - 為文章添加評論
- **PUT /api/blog/posts/[slug]/comments/[id]** - 更新評論
- **DELETE /api/blog/posts/[slug]/comments/[id]** - 刪除評論

### 主題
- **POST /api/blog/topics/[topic]/follow** - 追蹤/取消追蹤主題
- **GET /api/blog/topics/[topic]/follow/status** - 檢查用戶是否追蹤主題

### 用戶檔案
- **GET /api/profile/likes** - 獲取用戶喜歡的文章
- **GET /api/profile/topics** - 獲取用戶追蹤的主題

### 管理
- **GET/POST/PUT/DELETE /api/admin/blog/posts** - 管理部落格文章
- **GET/POST/PUT/DELETE /api/admin/portfolio/** - 管理作品集內容

## 資料庫模型

應用程式使用 Prisma ORM 與以下模型：

- **User** - 用戶帳戶和個人資訊
- **Account** - 連接到用戶的 OAuth 帳戶
- **Session** - 用戶會話
- **VerificationToken** - 電子郵件驗證令牌
- **Comment** - 部落格文章評論
- **Like** - 用戶對文章的喜歡
- **FavoriteTopic** - 用戶的收藏/追蹤主題

## 開始使用

### 先決條件
- Node.js 18+ (建議 20+)
- npm 或 yarn
- Git

### 安裝

1. 複製存儲庫
```bash
git clone https://github.com/yourusername/gray-cat-portfolio.git
cd gray-cat-portfolio
```

2. 安裝依賴
```bash
npm install
# 或
yarn install
```

3. 設置環境變數
創建一個 `.env.local` 文件，包含以下變數：
```
# 資料庫
DATABASE_URL="file:./dev.db"

# Next Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=你的密鑰

# OAuth 提供者 (可選)
GITHUB_ID=你的github客戶端id
GITHUB_SECRET=你的github客戶端密鑰
GOOGLE_CLIENT_ID=你的google客戶端id
GOOGLE_CLIENT_SECRET=你的google客戶端密鑰
```

4. 初始化資料庫
```bash
npx prisma generate
npx prisma db push
```

5. 啟動開發伺服器
```bash
npm run dev
```

## 部署

本專案可以在 Vercel 上部署：

1. 將代碼推送到 GitHub 存儲庫
2. 在 Vercel 中導入專案
3. 設置必要的環境變數
4. 部署

## 授權

本專案採用 MIT 授權條款。

## 致謝

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/)
- [NextAuth.js](https://next-auth.js.org/)