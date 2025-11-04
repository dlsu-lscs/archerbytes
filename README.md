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
