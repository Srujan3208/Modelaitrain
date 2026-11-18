# TREAN AI — Persistent Learning Agent

This repository has two parts:
- `playback.html` — the original standalone playback prototype.
- `trean-ai-redesign/` — the redesigned Next.js application and supporting assets.

The redesigned app uses Supabase Auth and Row Level Security for per-user data, OpenAI for embeddings and chat, and the YouTube Data API for video metadata.

## Run the redesigned app

```bash
cd trean-ai-redesign
npm install
cp .env.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `OPENAI_API_KEY`, and `YOUTUBE_API_KEY` in `.env.local`. Keep OpenAI and YouTube keys server-side; never use a `NEXT_PUBLIC_` prefix for private keys.

## Security

- Browser and server Supabase clients use publishable key + authenticated user session.
- Route handlers check the signed-in user before querying or writing.
- Row Level Security policies remain the data-access boundary.
- No Supabase service-role or secret key is required in the redesigned client/server utilities.
