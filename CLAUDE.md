# sysmp — Claude Instructions

## Status
production | Branch: main

## Rules
- Backend is in production on Render; verify before any structural change
- Frontend deploys to Vercel; test build locally before pushing to main
- Database is PostgreSQL on Supabase — never run destructive migrations without backup
- JWT_SECRET must be set or all auth breaks
- Socket.IO is in use — backend changes can affect real-time features

## Environment
Copy `backend/.env.example` → `backend/.env` and `frontend/.env.example` → `frontend/.env`.
