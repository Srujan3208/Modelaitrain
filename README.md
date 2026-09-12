# Modelaitrain — Playback

A single-file chat app that builds a local knowledge base from YouTube video transcripts you paste in, then answers questions and generates app/website code grounded in what it's learned.

## How it works
- Paste a video's link + transcript in the sidebar — it's automatically chunked and indexed.
- Ask a question or ask it to build something — it retrieves the most relevant chunks across all indexed videos (keyword/TF-IDF relevance) and uses them as context for a Claude API call.
- Everything is stored locally in the browser; no external database needed.

## Usage
Open `playback.html` directly in a browser (works fully client-side, uses the Anthropic API for chat).
