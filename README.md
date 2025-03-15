# Gray Cat Portfolio & Blog

A personal portfolio and blog website built with Next.js, featuring user authentication, social features, and content management capabilities.

## Features

### Portfolio
- Interactive project showcase
- Skills and experience display
- Education and certification listings
- Responsive design for all devices
- Dark/light mode support

### Blog
- Markdown-based blog posts
- Topic categorization
- User engagement features:
  - Post likes
  - Topic following
  - Comments system
- Admin panel for content management

### Authentication System
- Multiple login options:
  - Email/password authentication
  - GitHub OAuth
  - Google OAuth
- Secure password handling with bcrypt
- NextAuth.js integration for session management
- User profile management

## Tech Stack

- **Frontend**:
  - Next.js 15.1 (App Router)
  - React 19.0
  - TypeScript (strict mode)
  - TailwindCSS
  - shadcn/ui components
  - Framer Motion animations

- **Backend**:
  - Next.js API routes
  - Prisma ORM
  - SQLite database (can be replaced with PostgreSQL, MySQL, etc.)
  - NextAuth.js for authentication

## API Endpoints

### Authentication
- **POST /api/auth/register** - Register a new user
- **GET/POST /api/auth/[...nextauth]** - NextAuth.js authentication handlers

### Blog Posts
- **GET /api/blog/posts** - Get all blog posts
- **GET /api/blog/posts/[slug]** - Get a specific blog post
- **POST /api/blog/posts/[slug]/likes** - Like/unlike a post
- **GET /api/blog/posts/[slug]/likes/count** - Get likes count for a post
- **GET /api/blog/posts/[slug]/likes/user** - Check if current user liked a post

### Comments
- **GET /api/blog/posts/[slug]/comments** - Get comments for a post
- **POST /api/blog/posts/[slug]/comments** - Add a comment to a post
- **PUT /api/blog/posts/[slug]/comments/[id]** - Update a comment
- **DELETE /api/blog/posts/[slug]/comments/[id]** - Delete a comment

### Topics
- **POST /api/blog/topics/[topic]/follow** - Follow/unfollow a topic
- **GET /api/blog/topics/[topic]/follow/status** - Check if user follows a topic

### User Profile
- **GET /api/profile/likes** - Get user's liked posts
- **GET /api/profile/topics** - Get user's followed topics

### Admin
- **GET/POST/PUT/DELETE /api/admin/blog/posts** - Manage blog posts
- **GET/POST/PUT/DELETE /api/admin/portfolio/** - Manage portfolio content

## Database Models

The application uses Prisma ORM with the following models:

- **User** - User accounts and profile information
- **Account** - OAuth accounts connected to users
- **Session** - User sessions
- **VerificationToken** - Email verification tokens
- **Comment** - Blog post comments
- **Like** - Post likes by users
- **FavoriteTopic** - User's favorite/followed topics

## Getting Started

### Prerequisites
- Node.js 18+ (20+ recommended)
- npm or yarn
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/gray-cat-portfolio.git
cd gray-cat-portfolio
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
Create a `.env.local` file with the following variables:
```
# Database
DATABASE_URL="file:./dev.db"

# Next Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# OAuth Providers (optional)
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

4. Initialize the database
```bash
npx prisma generate
npx prisma db push
```

5. Start the development server
```bash
npm run dev
```

## Deployment

This project can be deployed on Vercel:

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Set the required environment variables
4. Deploy

## License

This project is licensed under the MIT License.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/)
- [NextAuth.js](https://next-auth.js.org/)