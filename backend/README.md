## TREAN AI backend implementation starter

Supabase-connected FastAPI scaffold: validates Supabase Auth access tokens, creates user-owned source/job records, extracts YouTube transcripts with `youtube-transcript-api`, stores transcripts/chunks, and provides OpenRouter chat.

### Setup
1. Apply `supabase/migrations/202611230001_trean_ai_core.sql` in Supabase SQL Editor.
2. Copy `.env.example` to `.env` and configure credentials.
3. `pip install -r requirements.txt`
4. `uvicorn app.main:app --reload`
5. In another terminal: `python -m app.worker`

API docs: http://localhost:8000/docs

Endpoints: GET /health; POST /api/v1/videos; GET /api/v1/sources; GET /api/v1/jobs/{id}; POST /api/v1/chat.

Current limitations: worker is polling-based and not concurrency-safe; no embeddings/vector retrieval, transcript-grounded chat, summarization, robust retries, or production queue yet. Configure and test in a non-production Supabase project first. Keep service role and AI keys server-side.
