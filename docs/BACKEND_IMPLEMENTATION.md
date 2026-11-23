# TREAN AI Backend Implementation

## Current implementation
This branch contains an initial FastAPI/Supabase backend scaffold:
- Supabase Auth bearer-token validation
- Supabase Postgres source/job persistence
- YouTube URL validation
- YouTube transcript extraction service
- Transcript chunking and storage
- OpenRouter chat endpoint
- Polling worker
- SQL migration with ownership RLS

## Setup
1. Apply `supabase/migrations/202611230001_trean_ai_core.sql` in a development Supabase SQL editor.
2. Copy `backend/.env.example` to `backend/.env`.
3. Fill server-side Supabase and OpenRouter credentials.
4. Install: `pip install -r backend/requirements.txt`.
5. Start API from backend directory: `uvicorn app.main:app --reload`.
6. Start worker separately: `python -m app.worker`.

## API
- `GET /health`
- `POST /api/v1/videos` (Bearer token)
- `GET /api/v1/sources` (Bearer token)
- `GET /api/v1/jobs/{job_id}` (Bearer token)
- `POST /api/v1/chat` (Bearer token)

## Not production-ready yet
- Queue polling is not atomic; concurrent workers could claim the same job.
- No embeddings or vector retrieval yet.
- Chat is not grounded in stored transcripts.
- No summary-generation pipeline yet.
- Retry/backoff, rate limits, observability and integration tests are not implemented.
- Frontend is not yet connected to these endpoints.

## Supabase connection
The Supabase MCP connection was unavailable during this work. The migration is committed, but it has not been applied to a live database or verified against the user's Supabase project.
