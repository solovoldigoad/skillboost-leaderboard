# Google Skillboost Leaderboard

A real-time leaderboard system for tracking student progress in Google Skillboost (Cloud Skills Boost) program.

## Tech Stack

- **Frontend**: Next.js (app router) + Tailwind CSS
- **Backend**: Next.js API routes
- **Auth**: NextAuth.js
- **Database**: MongoDB Atlas
- **Queue**: Redis + BullMQ
- **Scheduler**: Google Cloud Scheduler
- **Deployment**: Vercel (frontend), Cloud Run (backend), MongoDB Atlas (DB)

## Features

- OAuth-based Google Skillboost integration
- Real-time progress tracking
- Student leaderboard with multiple ranking criteria
- Secure token management
- Admin dashboard
- Automated periodic syncing
- Rate-limiting and retry mechanisms

## Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Google Cloud Project with OAuth credentials
- Redis instance (local or cloud)

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env.local` and fill in your credentials
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
/src
  /app              # Next.js app router pages
  /components       # React components
  /lib             # Utility functions
  /models          # Mongoose models
  /services        # Business logic
  /types           # TypeScript types
  /api             # API routes
```

## Environment Variables

Required environment variables:

```
DATABASE_URL=mongodb+srv://...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXTAUTH_SECRET=...
REDIS_URL=...
ENCRYPTION_KEY=...
```

## Development Phases

1. ✅ Project Setup
2. 🔄 Data Model & DB Schema
3. 📝 OAuth Connect Flow
4. 🔄 Token Refresh & Student Sync
5. 📊 Queue & Worker Pool
6. ⏰ Scheduler & Automation
7. 🏆 Ranking Engine & API
8. 🎨 Frontend Implementation
9. 🔒 Security & Admin Tools
10. 🧪 Testing
11. 🚀 Deployment

## License

MIT