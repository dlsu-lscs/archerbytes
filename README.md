# archerbytes

This project was bootstrapped with **create-lscs-next-app**.

---

## 1. 🚀 Development Setup

- Organized folder structure
- Prettier + ESLint (with Prettier rules)
- Placeholder feature folder structure (`[feature-name]`)
- Global styles moved into `src/styles/globals.css`

### Scripts

- `npm run dev` → Start dev server
- `npm run build` → Build production bundle
- `npm run start` → Run production build
- `npm run lint` → Run ESLint
- `npm run test` → Run Vitest

### 🧪 Testing Setup

This scaffold comes with **Vitest** (unit testing) and **Cypress** (end-to-end testing) pre-configured.

---

## 2. ⚡ Creating a New Feature

You can create a new feature module easily using the CLI command:

```bash
npx create-lscs-next-app feature <feature-name>
```

This will generate a new folder under `src/features/<feature-name>` with the following structure:

- components/
- containers/
- hooks/
- services/
- queries/
- types/
- data/
- README.md

The generated README explains the purpose of each folder.

---

## 3. 🛠️ Tech Stack (Recommended)

This scaffold does **not auto-install** feature libraries, so devs learn to set them up manually.  
Recommended libraries for future installs:

- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI/Styling**: [Tailwind CSS](https://tailwindcss.com/) + (optional: [shadcn/ui](https://ui.shadcn.com/))
- **Data Fetching**: [TanStack Query](https://tanstack.com/query/latest)
- **State Management**: [Zustand](https://zustand-bear.github.io/zustand/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Authentication**: [Better Auth](https://www.better-auth.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Testing**: [Vitest](https://vitest.dev/) + [Cypress](https://www.cypress.io/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)

---

## 4. 🏛️ Architecture

We employ a **Feature-Driven Architecture** in Next.js, organizing code by domain features for scalability and collaboration.  
Each feature starts from the `src/features/[feature-name]` template, which includes:

- components/
- containers/
- hooks/
- services/
- queries/
- types/
- data/

Inside features, we follow the **Container/Presentational pattern**.

### File Structure

```
src/
├── app/ # Next.js App Router
│ ├── layout.tsx
│ ├── page.tsx
│ └── providers.tsx
│
├── components/ # Global shared UI components
│
├── features/ # Domain-specific feature modules
│ ├── [feature-name]/ # Copy + rename this folder for new features
│ │ ├── components/
│ │ ├── containers/
│ │ ├── hooks/
│ │ ├── services/
│ │ ├── queries/
│ │ ├── types/
│ │ └── data/
│ └── shared/
│
├── lib/ # Utilities and global helpers
├── queries/ # Global TanStack Query configs
├── store/ # Zustand stores
├── providers/ # Global providers (Auth, Theme, Query, etc.)
├── config/ # Env, constants, query defaults
├── styles/ # Global & theme styles
├── types/ # Global TypeScript types
└── tests/ # Unit + E2E tests
```

---

## 5. 📝 Coding Standards

- Use **functional React components** with hooks.
- **Type everything** with TypeScript.
- **Zustand** for client state, **TanStack Query** for server data.
- Gracefully handle **loading & error states**.
- Use **Prettier** + **ESLint** for formatting and linting.
- Tests: **Vitest** for unit, **Cypress** for e2e.
- Comments: explain _why_, not _what_.

---

## 6. 🔌 API Documentation

> [!NOTE]
> All curl examples use `curl.exe` which works in both PowerShell and Command Prompt on Windows. On Unix-based systems (macOS/Linux), use `curl` instead.

### Quick Links
- [Auth Endpoints](#auth-endpoints)
- [Comment Endpoints](#comment-endpoints)
- [Comment Reaction Endpoints](#comment-reaction-endpoints)
- [Article Reaction Endpoints](#article-reaction-endpoints)
- [Article Endpoints](#article-endpoints)
- [Category Endpoints](#category-endpoints)
- [Bookmarks Endpoints](#bookmarks-endpoints)

## Auth Endpoints

### Testing Authentication

---

### Sign In & Get Session

**Step 1: Sign In**

1. Navigate to the login page:

   ```
   http://localhost:3000/login
   ```

2. Click **"Sign in"** and complete login using your `@dlsu.edu.ph` email

**Step 2: Test in Browser Console**

After successful sign-in, open **DevTools Console** (F12) and run:

```javascript
// Get current session
fetch('/api/auth/get-session', { credentials: 'include' })
  .then((r) => r.json())
  .then(console.log);
```

**Expected Response:**

```json
{
  "session": {
    "id": "cm3abc123...",
    "userId": "cm3xyz789...",
    "expiresAt": "2025-11-11T05:17:54.229Z",
    "token": "...",
    "ipAddress": "::1",
    "userAgent": "Mozilla/5.0...",
    "createdAt": "2025-11-04T10:30:00.000Z",
    "updatedAt": "2025-11-04T10:30:00.000Z"
  },
  "user": {
    "id": "cm3xyz789...",
    "name": "Juan Dela Cruz",
    "email": "juan_delacruz@dlsu.edu.ph",
    "emailVerified": true,
    "image": "https://lh3.googleusercontent.com/...",
    "createdAt": "2025-11-04T10:30:00.000Z",
    "updatedAt": "2025-11-04T10:30:00.000Z"
  }
}
```

---

> [!IMPORTANT]
> OAuth authentication must be completed in a browser. The Google OAuth flow requires user interaction and cannot be automated via API calls.

---

## Comment Endpoints

### POST `/api/comments`

- creates a new comment or reply to an existing comment

- `request`:

```bash
curl.exe -X POST http://localhost:3000/api/comments ^
  -H "Content-Type: application/json" ^
  -d "{\"userId\":\"user_123\",\"articleId\":\"article_456\",\"content\":\"This is a comment\",\"replyTo\":null}"
```

- **Request Body Fields:**
  - `userId` (string, required): The user ID creating the comment
  - `articleId` (string, required): The article ID being commented on
  - `content` (string, required): The comment content
  - `replyTo` (number, optional): Parent comment ID if this is a reply

- `response`:

```json
{
  "data": {
    "id": 1,
    "userId": "user_123",
    "articleId": "article_456",
    "replyTo": null,
    "content": "This is a comment",
    "createdAt": "2025-11-01T12:00:00.000Z",
    "updatedAt": "2025-11-01T12:00:00.000Z"
  }
}
```

```json
{
  "error": "Parent comment does not exist."
}
```

```json
{
  "error": "Can only reply to parent comments."
}
```

### GET `/api/comments`

- returns all parent comments for a specific article

- `request`:

```bash
curl.exe -X GET "http://localhost:3000/api/comments?articleId=article_456"
```

- **Query Parameters:**
  - `articleId` (string, required): The article ID to fetch comments for

- `response`:

```json
{
  "data": [
    {
      "id": 1,
      "userId": "user_123",
      "articleId": "article_456",
      "replyTo": null,
      "content": "This is a comment",
      "createdAt": "2025-11-01T12:00:00.000Z",
      "updatedAt": "2025-11-01T12:00:00.000Z"
    },
    {
      "id": 2,
      "userId": "user_456",
      "articleId": "article_456",
      "replyTo": null,
      "content": "Amazing Article!",
      "createdAt": "2025-11-02T14:51:03.666Z",
      "updatedAt": "2025-11-02T14:51:03.666Z"
    }
  ]
}
```

```json
{
  "error": "Article ID is required"
}
```

### GET `/api/comments/[id]`

- returns a specific comment by ID

- `request`:

```bash
curl.exe -X GET http://localhost:3000/api/comments/1
```

- `response`:

```json
{
  "data": {
    "id": 1,
    "userId": "user_123",
    "articleId": "article_456",
    "replyTo": null,
    "content": "This is a comment",
    "createdAt": "2025-11-02T14:23:26.358Z",
    "updatedAt": "2025-11-02T14:23:26.358Z"
  }
}
```

```json
{
  "error": "Comment not found"
}
```

### PATCH `/api/comments/[id]`

- updates a comment

- `request`:

```bash
curl.exe -X PATCH http://localhost:3000/api/comments/1 ^
  -H "Content-Type: application/json" ^
  -d "{\"userId\":\"user_123\",\"content\":\"Updated comment content\"}"
```

- **Request Body Fields:**
  - `userId` (string, required): The user ID that created the comment
  - `content` (string, required): The new comment content

- `response`:

```json
{
  "data": {
    "id": 1,
    "userId": "user_123",
    "articleId": "article_456",
    "content": "Updated comment content",
    "replyTo": null,
    "createdAt": "2025-11-01T12:00:00.000Z",
    "updatedAt": "2025-11-01T12:00:00.000Z"
  }
}
```

```json
{
  "error": "userId is required"
}
```

```json
{
  "error": "Comment not found or you are not the owner"
}
```

### DELETE `/api/comments/[id]`

- deletes a comment

- `request`:

```bash
curl.exe -X DELETE http://localhost:3000/api/comments/1 ^
  -H "Content-Type: application/json" ^
  -d "{\"userId\":\"user_123\"}"
```

- **Request Body Fields:**
  - `userId` (string, required): The user ID that created the comment

- `response`:

```json
{
  "message": "Comment deleted successfully",
  "data": {
    "id": 1,
    "userId": "user_123",
    "articleId": "article_456",
    "replyTo": null,
    "content": "This is a comment",
    "createdAt": "2025-11-01T12:00:00.000Z",
    "updatedAt": "2025-11-01T12:00:00.000Z"
  }
}
```

```json
{
  "error": "Comment not found or you are not the owner"
}
```

### GET `/api/comments/[id]/replies`

- returns all replies to a specific parent comment

- `request`:

```bash
curl.exe -X GET http://localhost:3000/api/comments/1/replies
```

- `response`:

```json
{
  "data": [
    {
      "id": 2,
      "userId": "user_456",
      "articleId": "article_456",
      "replyTo": 1,
      "content": "This is a reply",
      "createdAt": "2025-11-01T12:30:00.000Z",
      "updatedAt": "2025-11-01T12:30:00.000Z"
    }
  ]
}
```

```json
{
  "error": "Parent comment not found"
}
```

---

## Comment Reaction Endpoints

### POST `/api/comment-reactions`

- creates or updates a reaction to a comment

- `request`:

```bash
curl.exe -X POST http://localhost:3000/api/comment-reactions ^
  -H "Content-Type: application/json" ^
  -d "{\"userId\":\"user_123\",\"commentId\":1,\"reactionType\":\"like\"}"
```

- **Request Body Fields:**
  - `userId` (string, required): The user ID creating the reaction
  - `commentId` (number, required): The comment ID being reacted to
  - `reactionType` (string, required): Must be one of: "like", "heart", "care", "haha", "wow", "sad", "angry"

- `response`:

```json
{
  "data": {
    "id": 1,
    "userId": "user_123",
    "commentId": 1,
    "reactionType": "like",
    "createdAt": "2025-11-01T12:00:00.000Z"
  }
}
```

```json
{
  "error": "You have already reacted to this comment"
}
```

```json
{
  "error": "Comment not found"
}
```

```json
{
  "error": "Validation failed",
  "details": [
    {
      "code": "invalid_value",
      "values": ["like", "heart", "care", "haha", "wow", "sad", "angry"],
      "path": ["reactionType"],
      "message": "Invalid option: expected one of \"like\"|\"heart\"|\"care\"|\"haha\"|\"wow\"|\"sad\"|\"angry\""
    }
  ]
}
```

### GET `/api/comment-reactions`

- returns all reactions for a specific comment, or a specific user's reaction

- `request` (all reactions):

```bash
curl.exe -X GET "http://localhost:3000/api/comment-reactions?commentId=1"
```

- `request` (specific user's reactions):

```bash
curl.exe -X GET "http://localhost:3000/api/comment-reactions?commentId=1&userId=user_123"
```

- **Query Parameters:**
  - `commentId` (number, required): The comment ID to fetch reactions for
  - `userId` (string, optional): Filter reactions by specific user

- `response` (all reactions):

```json
{
  "data": [
    {
      "id": 1,
      "userId": "user_123",
      "commentId": 1,
      "reactionType": "like",
      "createdAt": "2025-11-01T12:00:00.000Z"
    },
    {
      "id": 2,
      "userId": "user_456",
      "commentId": 1,
      "reactionType": "heart",
      "createdAt": "2025-11-01T12:15:00.000Z"
    }
  ]
}
```

- `response` (user's reactions):

```json
{
  "data": [
    {
      "id": 1,
      "userId": "user_123",
      "commentId": 1,
      "reactionType": "like",
      "createdAt": "2025-11-01T12:00:00.000Z"
    }
  ]
}
```

```json
{
  "error": "commentId query parameter is required"
}
```

```json
{
  "error": "commentId must be a valid number"
}
```

### PATCH `/api/comment-reactions`

- updates a user's reaction type on a comment

- `request`:

```bash
curl.exe -X PATCH http://localhost:3000/api/comment-reactions ^
  -H "Content-Type: application/json" ^
  -d "{\"userId\":\"user_123\",\"commentId\":1,\"reactionType\":\"heart\"}"
```

- **Request Body Fields:**
  - `userId` (string, required): The user ID who created the reaction
  - `commentId` (number, required): The comment ID
  - `reactionType` (string, required): New reaction type (one of: "like", "heart", "care", "haha", "wow", "sad", "angry")

- `response`:

```json
{
  "data": {
    "id": 1,
    "userId": "user_123",
    "commentId": 1,
    "reactionType": "heart",
    "createdAt": "2025-11-01T12:00:00.000Z"
  }
}
```

```json
{
  "error": "Reaction not found or you are not authorized to update it"
}
```

```json
{
  "error": "Validation failed",
  "details": [
    {
      "code": "invalid_enum_value",
      "options": ["like", "heart", "care", "haha", "wow", "sad", "angry"],
      "path": ["reactionType"],
      "message": "Invalid enum value. Expected 'like' | 'heart' | 'care' | 'haha' | 'wow' | 'sad' | 'angry', received 'invalid'"
    }
  ]
}
```

### DELETE `/api/comment-reactions`

- deletes a reaction from a comment

- `request`:

```bash
curl.exe -X DELETE http://localhost:3000/api/comment-reactions ^
  -H "Content-Type: application/json" ^
  -d "{\"userId\":\"user_123\",\"commentId\":1}"
```

- **Request Body Fields:**
  - `userId` (string, required): The user ID who created the reaction
  - `commentId` (number, required): The comment ID

- `response`:

```json
{
  "message": "Reaction deleted successfully",
  "data": {
    "id": 1,
    "userId": "user_123",
    "commentId": 1,
    "reactionType": "like",
    "createdAt": "2025-11-01T12:00:00.000Z"
  }
}
```

```json
{
  "error": "Reaction not found or you are not authorized to delete it"
}
```

---

## Article Reaction Endpoints

### POST `/api/article-reactions`

- creates a reaction to an article

- `request`:

```bash
curl.exe -X POST http://localhost:3000/api/article-reactions ^
  -H "Content-Type: application/json" ^
  -d "{\"userId\":\"user_123\",\"articleId\":\"article_456\",\"reactionType\":\"like\"}"
```

- **Request Body Fields:**
  - `userId` (string, required): The user ID creating the reaction
  - `articleId` (string, required): The article ID being reacted to
  - `reactionType` (string, required): Must be one of: "like", "heart", "care", "haha", "wow", "sad", "angry"

- `response`:

```json
{
  "data": {
    "id": 1,
    "userId": "user_123",
    "articleId": "article_456",
    "reactionType": "like",
    "createdAt": "2025-11-01T12:00:00.000Z"
  }
}
```

```json
{
  "error": "You have already reacted to this article"
}
```

```json
{
  "error": "Validation failed",
  "details": [
    {
      "code": "invalid_enum_value",
      "options": ["like", "heart", "care", "haha", "wow", "sad", "angry"],
      "path": ["reactionType"],
      "message": "Invalid enum value. Expected 'like' | 'heart' | 'care' | 'haha' | 'wow' | 'sad' | 'angry', received 'invalid'"
    }
  ]
}
```

### GET `/api/article-reactions`

- returns all reactions for a specific article, or a specific user's reaction

- `request` (all reactions):

```bash
curl.exe -X GET "http://localhost:3000/api/article-reactions?articleId=article_456"
```

- `request` (specific user's reactions):

```bash
curl.exe -X GET "http://localhost:3000/api/article-reactions?articleId=article_456&userId=user_123"
```

- **Query Parameters:**
  - `articleId` (string, required): The article ID to fetch reactions for
  - `userId` (string, optional): Filter reactions by specific user

- `response` (all reactions):

```json
{
  "data": [
    {
      "id": 1,
      "userId": "user_123",
      "articleId": "article_456",
      "reactionType": "like",
      "createdAt": "2025-11-01T12:00:00.000Z"
    },
    {
      "id": 2,
      "userId": "user_789",
      "articleId": "article_456",
      "reactionType": "heart",
      "createdAt": "2025-11-01T12:30:00.000Z"
    }
  ]
}
```

- `response` (user's reactions):

```json
{
  "data": [
    {
      "id": 1,
      "userId": "user_123",
      "articleId": "article_456",
      "reactionType": "like",
      "createdAt": "2025-11-01T12:00:00.000Z"
    }
  ]
}
```

```json
{
  "error": "articleId query parameter is required"
}
```

### PATCH `/api/article-reactions`

- updates a user's reaction type on an article

- `request`:

```bash
curl.exe -X PATCH http://localhost:3000/api/article-reactions ^
  -H "Content-Type: application/json" ^
  -d "{\"userId\":\"user_123\",\"articleId\":\"article_456\",\"reactionType\":\"heart\"}"
```

- **Request Body Fields:**
  - `userId` (string, required): The user ID who created the reaction
  - `articleId` (string, required): The article ID
  - `reactionType` (string, required): New reaction type (one of: "like", "heart", "care", "haha", "wow", "sad", "angry")

- `response`:

```json
{
  "data": {
    "id": 1,
    "userId": "user_123",
    "articleId": "article_456",
    "reactionType": "heart",
    "createdAt": "2025-11-01T12:00:00.000Z"
  }
}
```

```json
{
  "error": "Reaction not found or you are not authorized to update it"
}
```

```json
{
  "error": "Validation failed",
  "details": [
    {
      "code": "invalid_enum_value",
      "options": ["like", "heart", "care", "haha", "wow", "sad", "angry"],
      "path": ["reactionType"],
      "message": "Invalid enum value. Expected 'like' | 'heart' | 'care' | 'haha' | 'wow' | 'sad' | 'angry', received 'invalid'"
    }
  ]
}
```

### DELETE `/api/article-reactions`

- deletes a reaction from an article

- `request`:

```bash
curl.exe -X DELETE http://localhost:3000/api/article-reactions ^
  -H "Content-Type: application/json" ^
  -d "{\"userId\":\"user_123\",\"articleId\":\"article_456\"}"
```

- **Request Body Fields:**
  - `userId` (string, required): The user ID who created the reaction
  - `articleId` (string, required): The article ID

- `response`:

```json
{
  "message": "Reaction deleted successfully",
  "data": {
    "id": 1,
    "userId": "user_123",
    "articleId": "article_456",
    "reactionType": "like",
    "createdAt": "2025-11-01T12:00:00.000Z"
  }
}
```

```json
{
  "error": "Reaction not found or you are not authorized to delete it"
}
```

---

## Article Endpoints

### GET `/api/articles`

- returns a paginated list of articles with optional filtering and sorting

- `request`:

```bash
curl.exe -X GET "http://localhost:3000/api/articles?page=1&limit=10&status=published&sort=newest&category=1"
```

- **Query Parameters:**
  - `page` (number, optional): Page number, starts at 1. Default: `1`
  - `limit` (number, optional): Items per page, max 100. Default: `10`
  - `status` (string, optional): Filter by status - `"published"` or `"draft"`
  - `sort` (string, optional): Sort order - `"newest"`, `"oldest"`, or `"popular"`. Default: `"newest"`
  - `category` (number, optional): Filter by category ID

- `response`:

```json
{
  "data": [
    {
      "id": 1,
      "title": "Maangas na article about APDEV",
      "subtitle": "A guide how to pass CCAPDEV",
      "slug": "how-to-pass-CCAPDEV",
      "featuredImageUrl": "https://example.com/image.jpg",
      "status": "published",
      "publishedAt": "2025-11-01T08:00:00.000Z",
      "createdAt": "2025-10-28T10:30:00.000Z",
      "category": {
        "id": 1,
        "name": "Web Development",
        "slug": "web-development"
      },
      "reactionCount": 15
    },
    {
      "id": 2,
      "title": "How to Survive Computer Science",
      "subtitle": "A guide how to pass CS in DLSU",
      "slug": "how-to-pass-CS-in-DLSU",
      "featuredImageUrl": null,
      "status": "published",
      "publishedAt": "2025-10-30T12:00:00.000Z",
      "createdAt": "2025-10-27T14:20:00.000Z",
      "category": {
        "id": 2,
        "name": "DLSU",
        "slug": "DLSU"
      },
      "reactionCount": 8
    }
  ],
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

```json
{
  "error": "Validation failed",
  "details": [
    {
      "code": "too_big",
      "maximum": 100,
      "inclusive": true,
      "path": ["limit"],
      "message": "Too big: expected number to be <=100"
    }
  ]
}
```

```json
{
  "error": "Failed to list articles"
}
```

### GET `/api/articles/[slug]`

- returns a single article by its slug

- `request`:

```bash
curl.exe -X GET "http://localhost:3000/api/articles/getting-started-nextjs?status=published"
```

- **Route Parameters:**
  - `slug` (string, required): The article slug

- **Query Parameters:**
  - `status` (string, optional): Filter by status - `"published"` or `"draft"`

- `response`:

```json
{
  "data": {
    "id": 1,
    "title": "Getting Started with Next.js",
    "subtitle": "A comprehensive guide to building modern web applications",
    "slug": "getting-started-nextjs",
    "content": "# Introduction\n\nNext.js is a powerful React framework...",
    "featuredImageUrl": "https://example.com/image.jpg",
    "status": "published",
    "publishedAt": "2025-11-01T08:00:00.000Z",
    "createdAt": "2025-10-28T10:30:00.000Z",
    "updatedAt": "2025-10-31T15:45:00.000Z",
    "category": {
      "id": 1,
      "name": "Web Development",
      "slug": "web-development"
    }
  }
}
```

```json
{
  "error": "Article not found"
}
```

```json
{
  "error": "Validation failed",
  "details": [
    {
      "code": "too_small",
      "minimum": 1,
      "inclusive": true,
      "path": ["slug"],
      "message": "Article slug is required"
    }
  ]
}
```

```json
{
  "error": "Failed to fetch article"
}
```

### GET `/api/articles/search`

- searches articles by title, subtitle, or content

- `request`:

```bash
curl.exe -X GET "http://localhost:3000/api/articles/search?q=nextjs&page=1&limit=10"
```

- **Query Parameters:**
  - `q` (string, required): Search query, minimum 3 characters
  - `page` (number, optional): Page number. Default: `1`
  - `limit` (number, optional): Items per page, max 100. Default: `10`

- `response`:

```json
{
  "data": [
    {
      "id": 1,
      "title": "Getting Started with Next.js",
      "subtitle": "A comprehensive guide to building modern web applications",
      "slug": "getting-started-nextjs",
      "featuredImageUrl": "https://example.com/image.jpg",
      "status": "published",
      "publishedAt": "2025-11-01T08:00:00.000Z",
      "createdAt": "2025-10-28T10:30:00.000Z",
      "category": {
        "id": 1,
        "name": "Web Development",
        "slug": "web-development"
      },
      "reactionCount": 15
    }
  ],
  "meta": {
    "total": 3,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

```json
{
  "error": "Validation failed",
  "details": [
    {
      "code": "too_small",
      "minimum": 3,
      "inclusive": true,
      "path": ["q"],
      "message": "Search query must be at least 3 characters long"
    }
  ]
}
```

```json
{
  "error": "Failed to search articles"
}
```

### GET `/api/articles/category/[categoryId]`

- returns articles filtered by category ID with pagination and sorting

- `request`:

```bash
curl.exe -X GET "http://localhost:3000/api/articles/category/1?page=1&limit=10&sort=newest"
```

- **Route Parameters:**
  - `categoryId` (number, required): The category ID

- **Query Parameters:**
  - `page` (number, optional): Page number. Default: `1`
  - `limit` (number, optional): Items per page, max 100. Default: `10`
  - `sort` (string, optional): Sort order - `"newest"`, `"oldest"`, or `"popular"`. Default: `"newest"`

- `response`:

```json
{
  "data": [
    {
      "id": 1,
      "title": "Getting Started with Next.js",
      "subtitle": "A comprehensive guide to building modern web applications",
      "slug": "getting-started-nextjs",
      "featuredImageUrl": "https://example.com/image.jpg",
      "status": "published",
      "publishedAt": "2025-11-01T08:00:00.000Z",
      "createdAt": "2025-10-28T10:30:00.000Z",
      "category": {
        "id": 1,
        "name": "Web Development",
        "slug": "web-development"
      },
      "reactionCount": 15
    }
  ],
  "meta": {
    "total": 12,
    "page": 1,
    "limit": 10,
    "pages": 2
  }
}
```

```json
{
  "error": "Validation failed",
  "details": [
    {
      "code": "invalid_type",
      "expected": "number",
      "received": "NaN",
      "path": ["categoryId"],
      "message": "Invalid input: expected number, received NaN"
    }
  ]
}
```

```json
{
  "error": "Failed to list articles by category"
}
```

---

## Category Endpoints

### GET `/api/categories`

- returns all article categories with article counts

- `request`:

```bash
curl.exe -X GET "http://localhost:3000/api/categories"
```

- `response`:

```json
{
  "data": [
    {
      "id": 1,
      "name": "Web Development",
      "slug": "web-development",
      "description": "Articles about web development, frameworks, and best practices",
      "createdAt": "2025-10-01T09:00:00.000Z",
      "articleCount": 18
    },
    {
      "id": 2,
      "name": "Frontend",
      "slug": "frontend",
      "description": "Frontend development, UI/UX, and client-side technologies",
      "createdAt": "2025-10-02T10:30:00.000Z",
      "articleCount": 24
    },
    {
      "id": 3,
      "name": "Backend",
      "slug": "backend",
      "description": "Server-side development, APIs, and database management",
      "createdAt": "2025-10-03T11:15:00.000Z",
      "articleCount": 12
    }
  ]
}
```

```json
{
  "error": "Failed to list categories"
}
```

### GET `/api/categories/[slug]`

- returns a single category by its slug

- `request`:

```bash
curl.exe -X GET "http://localhost:3000/api/categories/web-development"
```

- **Route Parameters:**
  - `slug` (string, required): The category slug

- `response`:

```json
{
  "data": {
    "id": 1,
    "name": "Web Development",
    "slug": "web-development",
    "description": "Articles about web development, frameworks, and best practices",
    "createdAt": "2025-10-01T09:00:00.000Z"
  }
}
```

```json
{
  "error": "Category not found"
}
```

```json
{
  "error": "Validation failed",
  "details": [
    {
      "code": "too_small",
      "minimum": 1,
      "inclusive": true,
      "path": ["slug"],
      "message": "Category slug is required"
    }
  ]
}
```

```json
{
  "error": "Failed to fetch category"
}
```

### GET `/api/categories/by-id/[id]/articles`

- returns all articles in a specific category with pagination

- `request`:

```bash
curl.exe -X GET "http://localhost:3000/api/categories/by-id/1/articles?page=1&limit=10"
```

- **Route Parameters:**
  - `id` (number, required): The category ID

- **Query Parameters:**
  - `page` (number, optional): Page number. Default: `1`
  - `limit` (number, optional): Items per page, max 100. Default: `10`

- `response`:

```json
{
  "data": [
    {
      "id": 1,
      "title": "Getting Started with Next.js",
      "subtitle": "A comprehensive guide to building modern web applications",
      "slug": "getting-started-nextjs",
      "featuredImageUrl": "https://example.com/image.jpg",
      "status": "published",
      "publishedAt": "2025-11-01T08:00:00.000Z",
      "createdAt": "2025-10-28T10:30:00.000Z",
      "category": {
        "id": 1,
        "name": "Web Development",
        "slug": "web-development"
      },
      "reactionCount": 15
    }
  ],
  "meta": {
    "total": 18,
    "page": 1,
    "limit": 10,
    "pages": 2
  }
}
```

```json
{
  "error": "Category not found"
}
```

```json
{
  "error": "Validation failed",
  "details": [
    {
      "code": "invalid_type",
      "expected": "number",
      "received": "NaN",
      "path": ["id"],
      "message": "Invalid input: expected number, received NaN"
    }
  ]
}
```

```json
{
  "error": "Failed to list category articles"
}
```

---

## Bookmarks Endpoints

### Overview

The Bookmarks API provides endpoints for users to manage their bookmarked articles. Users can create, remove, and retrieve bookmarks with pagination support.

**Base URL:** `http://localhost:3000/api/bookmarks`

**Authentication:** All endpoints require user authentication via session cookies.

### POST `/api/bookmarks`

- creates a new bookmark or re-activates an existing inactive bookmark for an article

- `request`:

```bash
curl.exe -X POST http://localhost:3000/api/bookmarks ^
  -H "Content-Type: application/json" ^
  -d "{\"articleId\":42}"
```

- **Request Body Fields:**
  - `articleId` (number, required): Positive integer ID of the article to bookmark

- `response` (201 Created):

```json
{
  "data": {
    "bookmark": {
      "id": 1,
      "userId": "user-123",
      "articleId": 42,
      "bookmarkedAt": "2026-05-14T13:18:54.516Z",
      "createdAt": "2026-05-14T13:18:54.516Z"
    }
  }
}
```

- `error responses`:

```json
{
  "error": "Invalid articleId"
}
```

```json
{
  "error": "Unauthorized"
}
```

```json
{
  "error": "Article not found"
}
```

```json
{
  "error": "Bookmark already exists"
}
```

```json
{
  "error": "Failed to create bookmark"
}
```

### DELETE `/api/bookmarks`

- permanently removes a bookmark (hard delete). The bookmark record is deleted from the database.

- `request`:

```bash
curl.exe -X DELETE "http://localhost:3000/api/bookmarks?articleId=42"
```

- **Query Parameters:**
  - `articleId` (number, required): Positive integer ID of the article to unbookmark

- `response` (204 No Content):

This endpoint returns no response body when the bookmark is successfully removed.

- `error responses`:

```json
{
  "error": "Invalid articleId"
}
```

```json
{
  "error": "Unauthorized"
}
```

```json
{
  "error": "Bookmark not found"
}
```

```json
{
  "error": "Failed to remove bookmark"
}
```

### GET `/api/bookmarks`

- returns a paginated list of active bookmarks for the authenticated user, including article metadata

- `request`:

```bash
curl.exe -X GET "http://localhost:3000/api/bookmarks?limit=10&offset=0"
```

- **Query Parameters:**
  - `limit` (number, optional): Number of bookmarks per page. Default: `10`, Min: `1`, Max: `100`
  - `offset` (number, optional): Number of bookmarks to skip. Default: `0`, Min: `0`

- `response` (200 OK):

```json
{
  "data": [
    {
      "id": 1,
      "userId": "user-123",
      "articleId": 42,
      "bookmarkedAt": "2026-05-14T13:18:54.516Z",
      "createdAt": "2026-05-14T13:18:54.516Z",
      "article": {
        "id": 42,
        "title": "Getting Started with TypeScript",
        "slug": "getting-started-typescript",
        "excerpt": "Learn the basics of TypeScript"
      }
    }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "pages": 3
  }
}
```

- `error responses`:

```json
{
  "error": "Invalid pagination parameters"
}
```

```json
{
  "error": "Unauthorized"
}
```

```json
{
  "error": "Failed to fetch bookmarks"
}
```

---

## 7. 🤝 Code Contribution Guide

### Branch Model

- `main` → production only
- `staging` → pre-release testing
- `dev` → integration branch

### Workflow

1. Create a branch: `feature/<issue-no-desc>`, `fix/<issue-no-desc>`
2. Commit using **Conventional Commits**:
   - `feat(auth): add JWT authentication`
   - `fix(api): correct null pointer`
3. Open a PR → target `dev` (or `main` for hotfix).
4. Get at least **1 approval** before merge.
5. Use **Squash and Merge** into `dev`.

### Commit Message Quick Reference

| Type     | Description            |
| -------- | ---------------------- |
| feat     | New feature            |
| fix      | Bug fix                |
| docs     | Documentation change   |
| style    | Code style (no logic)  |
| refactor | Refactor (no behavior) |
| test     | Add/update tests       |
| chore    | Maintenance            |

---

✅ Following this guide ensures our projects remain **scalable, maintainable, and collaborative**.
