# Content Moderation Platform

A full-stack image moderation platform where uploaded images are scanned by Claude AI against six violation categories. Users get instant verdicts, can appeal decisions they disagree with, and admins have full control over policies and review queues.

## Local Development

1. Clone the repo
2. Copy `.env.local.example` to `.env.local` and fill in your values
3. Install and run:

```bash
npm install
npm run dev
```

## Docker

Create a `.env` file with `NEXTAUTH_SECRET` and `ANTHROPIC_API_KEY`, then:

```bash
docker-compose up --build
```

App will be running at `http://localhost:3000`

## Environment Variables

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `NEXTAUTH_SECRET` | Random secret for NextAuth |
| `NEXTAUTH_URL` | App base URL |
| `ANTHROPIC_API_KEY` | Anthropic Claude API key |

## Creating an Admin User

Register through the app normally, then run this in your MongoDB shell:

```js
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
```

## Architecture

Built with Next.js App Router so the frontend and API live in one codebase with no separate Express server needed. NextAuth v5 handles authentication with JWT-based sessions and role support. MongoDB with Mongoose stores all data. Route groups `(auth)`, `(user)`, and `(admin)` keep the folder structure clean, and a middleware file handles route protection based on session and role.

## Design Decisions

Images are stored as base64 directly in MongoDB, which keeps the setup simple without needing S3 or any external storage. Moderation policies live as a single document with all six categories inside it. The AI prompt is designed to return structured JSON directly so no parsing layer is needed. Each verdict also saves a snapshot of the policy that was active at the time, so historical records stay accurate even if settings change later.
