# Frontend Tech Interview 2 — Document Viewer & Uploader

Welcome! This exercise is part of the technical interview process for the **Frontend Engineer** position at Cascade, an AI-powered platform for HR teams. You'll build a document viewer and uploader application from scratch.

This is a **practical, time-boxed exercise** — not a trick question marathon. We want to see how you break down requirements, organize code, and make reasonable decisions under realistic constraints. Don't worry about pixel-perfect styling — focus on structure, correctness, and clarity.

**Important:** No AI coding tools (Copilot, Claude, ChatGPT, etc.) during this exercise. We want to see how you write and structure code on your own.

## Getting Started

Your interviewer will share a setup link. Choose the option that works best for you.

### Option A: GitHub Codespaces (recommended — zero setup)

Click the Codespace link your interviewer shares. The environment opens in your browser with everything pre-configured — mock API running, dependencies installed, dev server ready. You can also open the Codespace in your local VS Code if you prefer your own editor setup.

The app will be available at the forwarded port for `5173` and the mock API at `3001`.

### Option B: Local setup with Docker

If you prefer working fully locally, your interviewer can provide a zip file. A `Dockerfile` and `docker-compose.yml` are included.

```bash
docker compose up -d --build
docker compose exec app bash
```

The app will be available at `http://localhost:5173` and the mock API at `http://localhost:3001`.

### Option C: Manual local setup

Requires Node 20+.

```bash
# Terminal 1 — Mock API
cd mock-api && npm install && npx tsx server.ts

# Terminal 2 — Frontend
npm install
npm run dev
```

## Mock API

The mock API is already running and serves these endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/documents` | List documents. Supports `?q=search` and `?type=report` query params. |
| `GET` | `/api/documents/:id` | Get a single document |
| `POST` | `/api/documents` | Upload a document (multipart form: `file`, `title`, `type`) |
| `DELETE` | `/api/documents/:id` | Delete a document (~20% simulated failure rate) |
| `GET` | `/api/types` | List all unique document types |

The API starts with 5 sample documents. Sample document files are in `public/sample-documents/`.

**Upload notes:** The `POST` endpoint accepts multipart form data with fields `file` (the document file), `title` (string), and `type` (string for manual classification, e.g. "report", "policy", "handbook"). The upload has a simulated 1-3 second delay.

**Delete notes:** The `DELETE` endpoint has a ~20% simulated failure rate. Your UI should handle this gracefully.

## Requirements

Build a Document Viewer & Uploader with the following features. Read through all requirements before you start — you won't have time for everything, so prioritize what you tackle.

### Upload a Document
- User provides a file, title, and selects a document type
- Show upload progress and allow cancellation mid-upload
- If the upload fails, roll back and show a helpful error message

### List Documents in a Table/Grid
- Each row or card shows the title, type badge, format icon, file size (in KB), and date
- Support both list view and grid view with a toggle

### Filter Documents
- Filter by searching titles
- Filter by document type
- Keep filters in the URL query params (e.g., `?q=…&type=…`) so refreshing the page restores filter state

### Document Preview
- Clicking a document shows a detail/preview panel with the document's preview text, metadata, and a download link

### Delete a Document
- Optimistically remove it from the UI
- Roll back if the deletion fails (the API has a ~20% failure rate)

### Accessibility
- Provide proper labels, roles, and keyboard/focus handling
- Announce changes (uploads, errors, deletes) in a screen-reader-friendly way

### Stretch Goals (if time allows)
- Support drag & drop upload
- Support multi-file uploads with independent progress bars
- Sort documents by name, date, or size
- Virtualize the list for large document sets

## Tech Stack

- React 18 + JavaScript
- Vite
- SCSS is available (sass is installed) — or use inline styles, your choice

## Time Allocation

| Phase | Time |
|---|---|
| Setup + read requirements | ~5 min |
| Build | ~30 min |
| Discussion | ~5 min |

Good luck — and feel free to ask questions at any point.
