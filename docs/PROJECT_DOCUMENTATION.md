# TREAN AI — Complete Project Documentation

## 1. Project overview
TREAN AI is a responsive learning-workspace web application intended to help users turn educational video content into organized knowledge. The interface uses a dark indigo/black visual theme with violet accents.

Production website: https://trean-ai.vercel.app/
Repository: https://github.com/Srujan3208/Modelaitrain

## 2. Current source repository scope
This repository currently contains the Next.js frontend, landing page/workspace UI, PWA assets and registration/install components. The checked-in tree does **not** include a complete server-side video-transcription, knowledge-extraction, model-routing, or database-processing backend. Those features require backend services/functions and credentials to be implemented/configured separately.

## 3. Technology stack
- Next.js 15.5.29
- React 19
- TypeScript 5.7
- Lucide React icons
- Supabase JS client dependency (backend integration must be configured)
- Progressive Web App assets: manifest, service worker, offline page
- Vercel deployment

## 4. Repository structure
```
Modelaitrain/
├── app/
│   ├── page.tsx                  # Main application and screen navigation
│   ├── layout.tsx                # Root layout, metadata and viewport
│   ├── globals.css               # App design system and responsive styles
│   ├── auth/
│   │   └── callback/page.tsx      # Authentication callback screen
│   └── components/
│       ├── PWAInstallButton.tsx   # Native browser install prompt handling
│       └── PWARegistration.tsx    # Service worker registration
├── public/
│   ├── manifest.json              # PWA metadata
│   ├── sw.js                      # Service worker
│   ├── offline.html               # Offline fallback
│   └── icons/
│       └── trean-ai.svg
├── docs/
│   ├── hero-cta-update.md
│   └── PROJECT_DOCUMENTATION.md
├── playback.html                  # Standalone playback UI/demo asset
├── package.json
├── next.config.ts
├── tsconfig.json
└── README.md
```

## 5. Main application areas
The UI includes navigation/screens for:
- Landing page
- Sign in
- Create account
- Chat/workspace
- Dashboard
- Learn from Video
- Processing Video
- Knowledge Base
- Summaries
- Learning Sources
- History
- Profile
- Settings

These are frontend screens. Screen availability in the UI should not be interpreted as proof that all backend workflows are operational.

## 6. Landing page CTA behavior
- **Get started**: navigates to Create Account.
- **Explore workspace**: navigates to Chat.
- Hero layout and existing styles are retained.
- The Install Now CTA was removed from the hero.
- PWA installation is handled separately by the PWA component/browser support.

## 7. PWA
Files:
- `public/manifest.json`
- `public/sw.js`
- `public/offline.html`
- `app/components/PWARegistration.tsx`
- `app/components/PWAInstallButton.tsx`

The PWA uses a web manifest and service worker. Installation availability depends on browser/OS criteria. Browsers may not expose a native install prompt in every situation; iOS typically uses the browser's Add to Home Screen flow.

## 8. Local development
Requirements:
- Node.js compatible with Next.js 15
- npm
- Git

Commands:
```bash
git clone https://github.com/Srujan3208/Modelaitrain.git
cd Modelaitrain
npm install
npm run dev
```
Open http://localhost:3000.

## 9. Build and run production locally
```bash
npm run build
npm run start
```

## 10. Deployment on Vercel
1. Import the GitHub repository into Vercel.
2. Select Next.js as framework (normally auto-detected).
3. Configure environment variables only for integrations that are actually implemented.
4. Deploy preview.
5. Test routes, mobile responsiveness, PWA behavior and authentication/backend functionality.
6. Promote to production.

Production: https://trean-ai.vercel.app/

## 11. Environment variables and security
The current source tree does not define a complete backend configuration contract. Before adding integrations, document each variable where it is used.

General security rules:
- Do not commit `.env`, API keys, passwords, OAuth secrets, or Supabase service-role keys.
- Use Vercel Environment Variables for production secrets.
- Server-side secrets must never be exposed through `NEXT_PUBLIC_*` variables.
- Use Supabase Row Level Security (RLS) for user-owned data.
- Restrict OAuth redirect URLs to the intended application domains.

A local `.env.local` file is not included in Git.

## 12. Backend architecture — intended, not included as a complete implementation
A production learning-agent backend can be structured as:
1. Authentication: Supabase Auth.
2. User content database: Supabase Postgres.
3. Video intake: URL validation and metadata extraction.
4. Transcript pipeline: retrieve or generate transcript.
5. Processing jobs: durable job table and worker.
6. Knowledge extraction: chunking, summaries, concepts and metadata.
7. Embeddings: vector generation and storage (pgvector).
8. Retrieval: search user's processed sources.
9. AI chat: provider/model orchestration with context retrieval.
10. Frontend: displays processing status and learning results.

This is an architectural recommendation; the listed processing services are not all present in this repository.

## 13. Suggested database design
Possible tables for a future backend:
- profiles
- learning_sources
- videos
- processing_jobs
- transcripts
- knowledge_chunks
- summaries
- conversations
- messages
- user_settings

Each user-owned table should have a user ID, timestamps and appropriate RLS policies. This schema is a proposal, not a schema currently defined by the repository.

## 14. Suggested API/service boundaries
Potential services:
- `POST /api/sources`: add/validate a video source
- `POST /api/videos/:id/process`: enqueue processing
- `GET /api/jobs/:id`: processing status
- `GET /api/knowledge/search`: retrieve relevant knowledge
- `POST /api/chat`: grounded chat
- `GET /api/summaries/:videoId`: summary retrieval

These endpoints are design suggestions and are not asserted to exist in the current code.

## 15. Testing checklist
### UI
- Landing page loads
- Header and CTA navigation work
- Mobile and desktop layouts
- Chat/workspace screen opens
- Navigation and screen transitions
- No overflow or overlapping controls

### PWA
- Manifest loads
- Service worker registers
- Offline fallback is available
- Install flow tested on supported browsers

### Deployment
- Production build succeeds
- Environment variables configured
- Preview deployment tested before production
- Console/network errors reviewed

### Backend (once implemented)
- Auth and session handling
- RLS/user data isolation
- Video URL validation
- Processing retries and failure states
- Transcript and vector persistence
- AI provider fallback
- Rate limits and quota handling

## 16. Troubleshooting
### Install prompt does not appear
Browser/OS installability criteria may not be met. Use the browser's install or Add to Home Screen menu where available.

### Local server fails
Check Node version, run `npm install`, and inspect the error output.

### Vercel build fails
Review the build logs, confirm dependency versions and environment variables, and reproduce with `npm run build`.

### Backend screens are not functional
The frontend UI does not by itself provide processing, database or model APIs. Implement and configure those backend services before expecting end-to-end behavior.

## 17. Current change record
Commit: `7abf1f3`
Change: replaced hero Install Now button with Explore workspace.
Behavior: Explore workspace navigates to the Chat screen; Get started remains account creation.

## 18. License
No license file is present in the repository. Add a license before distributing or reusing the source publicly if you intend to grant explicit reuse rights.
