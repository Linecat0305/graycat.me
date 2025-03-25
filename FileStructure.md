# 灰毛作品集網站檔案架構

此文檔說明了灰貓作品集網站的檔案架構，此為一個基於 Next.js 15、React 19、TypeScript 和 TailwindCSS 的作品集與部落格網站。

## 根目錄檔案

- **components.json** - shadcn/ui 元件配置
- **eslint.config.mjs** - ESLint 配置
- **next.config.ts** - Next.js 配置
- **postcss.config.mjs** - PostCSS 配置
- **tailwind.config.ts** - Tailwind CSS 配置
- **tsconfig.json** - TypeScript 配置
- **package.json** - 專案依賴與腳本
- **README.md** / **README-zh.md** - 專案說明文檔

## 內容目錄 (`/content`)

部落格內容的 Markdown 文件:

- `/content/blog/intro-to-frc-robotics.md`
- `/content/blog/nextjs-tailwind-modern-web.md`
- `/content/blog/welcome-to-my-blog.md`

## 公共資源目錄 (`/public`)

- `/public/img/photo.jpg` - 個人照片
- 各種 SVG 圖標: `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`

## Prisma 資料庫 (`/prisma`)

- `/prisma/schema.prisma` - 資料庫模型定義
- `/prisma/dev.db` - SQLite 開發資料庫

## 源代碼目錄 (`/src`)

### 應用頁面 (`/src/app`)

- **/** - 首頁 (作品集)
- **/blog** - 部落格列表頁
- **/blog/[slug]** - 部落格文章頁
- **/login** - 登入頁面
- **/register** - 註冊頁面
- **/profile** - 用戶個人檔案頁面

### 管理頁面 (`/src/app/admin`)

- **/admin** - 管理員儀表板
- **/admin/blog** - 部落格管理
- **/admin/portfolio** - 作品集管理
  - `/components/*` - 管理各種作品集內容的元件

### API 路由 (`/src/app/api`)

- **/api/auth/[...nextauth]** - NextAuth.js 認證路由
- **/api/auth/register** - 用戶註冊
- **/api/admin/** - 管理員 API 路由
  - **/blog/posts** - 部落格文章管理
  - **/portfolio/** - 作品集資料管理
- **/api/blog/** - 部落格相關 API
  - **/posts** - 文章查詢
  - **/posts/[slug]/comments** - 文章評論
  - **/posts/[slug]/likes** - 文章點讚
  - **/blog/topics** - 主題與關注
- **/api/profile/** - 用戶個人檔案相關 API

### 元件 (`/src/components`)

- **auth/SessionProvider.tsx** - 認證會話提供者
- **ui/** - UI 元件
  - **blog-card.tsx** - 部落格卡片元件
  - **card.tsx** - 通用卡片元件
  - **toggle.tsx** - 切換按鈕元件
- **AuthNavigation.tsx** - 認證導航
- **BlogNavButton.tsx** - 部落格導航按鈕
- **CommentSection.tsx** - 評論區塊
- **LikeButton.tsx** - 點讚按鈕
- **Portfolio.tsx** - 作品集主元件
- **theme-provider.tsx** - 主題提供者
- **TopicFollowButton.tsx** - 主題關注按鈕

### 資料 (`/src/data`)

- **data.md** - 資料說明
- **education.json** - 教育經歷數據
- **experiences.json** - 工作經驗數據
- **projects.json** - 專案數據
- **skills.json** - 技能數據

### 工具庫 (`/src/lib`)

- **blog.ts** - 部落格相關功能
- **prisma.ts** - Prisma 客戶端配置
- **utils.ts** - 通用工具函數

## 主要技術棧

- **前端框架**: Next.js 15, React 19
- **樣式**: TailwindCSS, shadcn/ui
- **動畫**: Framer Motion
- **語言**: TypeScript
- **資料庫**: Prisma, SQLite
- **認證**: NextAuth.js
- **部落格內容**: Markdown