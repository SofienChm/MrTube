# StreamFlow

A music streaming app built with Angular + Ionic + Capacitor (frontend) and NestJS (backend).

## Prerequisites

- Node.js >= 18
- npm >= 9

## Backend Setup

```bash
cd backend
npm install

# Configure environment variables
# Edit .env with your JWT secret and YouTube API key

# Run database migrations (SQLite — no server needed)
npx prisma migrate dev

# Start development server
npm run start:dev
```

The backend runs on `http://localhost:3000`.  
Swagger API docs available at `http://localhost:3000/api`.

## Frontend Setup

```bash
cd frontend
npm install

# Start development server
npx ng serve
```

The frontend runs on `http://localhost:4200`.

## Running Both

### Terminal 1 — Backend
```bash
cd backend
npm run start:dev
```

### Terminal 2 — Frontend
```bash
cd frontend
npx ng serve
```

## Project Structure

```
streamflow/
├── backend/           # NestJS API
│   ├── prisma/        # Prisma schema & migrations
│   ├── src/           # Application source
│   └── .env           # Environment variables
├── frontend/          # Angular app
│   └── src/app/
│       ├── core/      # CoreModule (auth, interceptors)
│       ├── shared/    # SharedModule (reusable components)
│       ├── auth/      # AuthModule (login, register)
│       ├── home/      # HomeModule (main feed)
│       ├── search/    # SearchModule (YouTube search)
│       ├── player/    # PlayerModule (music player)
│       └── library/   # LibraryModule (playlists)
└── README.md
```

## Tech Stack

- **Frontend:** Angular 21
- **Backend:** NestJS 11, Prisma 7, SQLite (dev) / PostgreSQL (prod)
- **Auth:** JWT (passport-jwt)
- **API Docs:** Swagger
