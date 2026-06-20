# Content Moderation Platform

AI-powered image moderation platform built with Next.js, MongoDB, and Claude AI.

## Setup

### Local Development

1. Clone the repo
2. Copy `.env.local.example` to `.env.local` and fill in values
3. Run:

npm install
npm run dev


### Docker (Production)

1. Create `.env` file with `NEXTAUTH_SECRET` and `ANTHROPIC_API_KEY`
2. Run:

docker-compose up --build


App runs at `http://localhost:3000`

## Environment Variables

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `NEXTAUTH_SECRET` | Random secret for NextAuth |
| `NEXTAUTH_URL` | App base URL |
| `ANTHROPIC_API_KEY` | Anthropic Claude API key |

## Creating an Admin User

Register normally, then in MongoDB shell run:

db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })


## Architecture

- **Next.js App Router** — frontend + API routes in one codebase
- **NextAuth v5** — JWT-based auth with role support (user/admin)
- **MongoDB + Mongoose** — data storage with structured schemas
- **Claude AI (claude-sonnet-4-6)** — vision model for image analysis
- **Route Groups** — `(auth)`, `(user)`, `(admin)` for clean separation
- **Middleware** — protects routes based on session and role

## Key Design Decisions

- Images stored as base64 in MongoDB (no S3 needed for assessment scope)
- Policy is a single document; all categories live inside it
- AI prompt returns structured JSON directly — no post-processing needed
- Policy snapshot saved with each verdict so historical records stay accurate