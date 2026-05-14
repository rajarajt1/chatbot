# ⚡ SRM AI Assistant

A full-featured ChatGPT-style web app powered by SRM Institute's Ollama server.

## Features
- 💬 Multi-session chat with history (saved in localStorage)
- 🎨 Markdown + syntax highlighted code blocks
- 📋 Copy code / copy response buttons
- ⚙️ Custom system prompt support
- 🤖 Model switcher (Llama, GPT-OSS, Mistral)
- 💾 Chat history persists across page refreshes

## Setup

### 1. Install dependencies
```bash
npm install -g concurrently
cd server && npm install
cd ../client && npm install
```

### 2. Run the backend (Terminal 1)
```bash
cd server
node server.js
# Running at http://localhost:3001
```

### 3. Run the frontend (Terminal 2)
```bash
cd client
npm run dev
# Running at http://localhost:5173
```

### 4. Open browser
Visit: http://localhost:5173

## API Endpoints (Backend)
- GET  /api/models  — List available models from SRM server
- POST /api/chat    — Send message, get AI response

## Tech Stack
- Frontend: React + Vite
- Backend: Express.js
- AI: SRM Ollama server (dld.srmist.edu.in/ollama)
- Models: llama3.1:latest, gpt-oss:latest
