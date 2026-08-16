<div align="center">

# 📚 AskQuery — AI Document & Video Assistant (RAG)

**Chat with your PDFs, YouTube videos, and the live web - powered by Retrieval-Augmented Generation.**

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Redux](https://img.shields.io/badge/Redux_Toolkit-593D88?style=for-the-badge&logo=redux&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-1C3C3C?style=for-the-badge&logo=chainlink&logoColor=white)
![Pinecone](https://img.shields.io/badge/Pinecone-000000?style=for-the-badge)
![Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)
![Cohere](https://img.shields.io/badge/Cohere-39594D?style=for-the-badge&logo=cohere&logoColor=white)
![Mistral](https://img.shields.io/badge/Mistral_AI-EA5A0C?style=for-the-badge)
![Brevo](https://img.shields.io/badge/Brevo-Email%20API-0B996E?style=for-the-badge&logo=brevo&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
</div>

---

## 🧠 What is AskQuery?

AskQuery is a full-stack, production-style RAG (Retrieval-Augmented Generation) application. Users can:

- Upload a **PDF** and ask questions about its content
- Paste a **YouTube link** and ask questions about the video (via its transcript)
- Toggle **live internet search** to get answers grounded in current web results
- **Choose which LLM answers their chat** — Gemini or Cohere — right from the message input
- Chat in real time, with **token-by-token streaming responses**

Under the hood, the app chunks and embeds source content, stores the vectors in **Pinecone**, retrieves the most relevant chunks for a given question, and hands them to an LLM — orchestrated with **LangChain** — to produce a grounded, cited answer. Regular chat and web-search chat run on whichever model the user picks (**Gemini** or **Cohere**); **Mistral** is used behind the scenes for PDF Q&A and chat-title generation and isn't part of the user-facing model picker. A LangChain **agent with a web-search tool** (Tavily) is used when internet mode is enabled, and **Redis** caches repeated searches/answers to cut latency and API cost.

---

## ✨ Features

- 🔐 **Secure authentication** — JWT stored in HTTP-only cookies, with rate-limited login/register endpoints
- 🔑 **Forgot password / OTP reset** — email a 4-digit OTP via Brevo, verify it, then reset the password via a short-lived signed token; OTPs are single-use, Redis-backed with a 10-minute TTL, and rate-limited
- 📧 **Email verification** — transactional emails sent via **Brevo's API** on registration
- 📄 **PDF upload & RAG chat** — parse, chunk, embed, and semantically search PDF content
- ▶️ **YouTube Q&A** — ask questions about videos via their transcript (fetched automatically using `youtubei.js`). On cloud deployments, YouTube's anti-bot protections can occasionally block automatic fetching — when that happens, the app falls back to a **manual transcript paste** flow instead of failing outright, so the feature stays usable regardless of environment
- 🌐 **Live internet search mode** — a LangChain agent calls a Tavily search tool for up-to-date, non-document questions
- 🤖 **Model selector** — switch between **Gemini** and **Cohere** for chat responses (web-search chat included) directly from the message input
- ⚡ **Streaming responses** — answers stream back token-by-token over Server-Sent Events / Socket.io instead of waiting for the full response
- 🧵 **Persistent chat history** — every conversation and message is saved per user in MongoDB, with auto-generated chat titles
- 🚀 **Redis caching** — caches web-search results and repeated queries to reduce latency and third-party API usage
- 🛡️ **Rate limiting** — dedicated limiters for login, register, upload, and ask endpoints to prevent abuse
- 📝 **Rich message rendering** — Markdown, syntax-highlighted code blocks, and KaTeX-rendered math in the UI
- 🗑️ **Full account/document/chat management** — delete individual documents, chats, or the whole account
- 📱 **Responsive UI** built with React 19, Redux Toolkit, and Tailwind CSS

---

## 🛠️ Tech Stack

### Frontend
| Category | Tech |
|---|---|
| Framework | React 19, React Router |
| State management | Redux Toolkit |
| Styling | Tailwind CSS |
| Networking | Axios, Socket.io Client |
| Markdown / Math / Code | react-markdown, remark-gfm, remark-math, rehype-katex (KaTeX), react-syntax-highlighter |
| Notifications | React Hot Toast |
| Icons | Lucide React |
| Build tool | Vite |

### Backend
| Category | Tech |
|---|---|
| Runtime | Node.js, Express.js |
| Real-time | Socket.io |
| Database | MongoDB + Mongoose |
| Cache | Redis (ioredis) |
| Auth | JWT, HTTP-only cookies, custom auth middleware |
| Email | Brevo Email API |
| File upload | Multer |
| Validation | validator |
| Security | CORS, cookie-parser, express-rate-limit |
| Logging | Morgan |

### AI / RAG Pipeline
| Category | Tech |
|---|---|
| Orchestration | LangChain (`langchain`, `@langchain/core`) |
| LLMs | Google Gemini (`@langchain/google-genai`), Cohere (`@langchain/cohere`) — both user-selectable for chat; Mistral AI (`@langchain/mistralai`) — used internally for PDF Q&A and chat-title generation only |
| Embeddings | Mistral Embeddings (`mistral-embed`) |
| Vector database | Pinecone |
| Agent tools | Custom `searchInternet` tool backed by Tavily Search API |
| PDF parsing | `pdf-parse` |
| YouTube transcripts | `youtubei.js` (with a manual-paste fallback when automatic fetching is blocked) |
| Chunking | LangChain `RecursiveCharacterTextSplitter` |
| Schema validation | Zod |

---

## 🏛️ System Architecture

```mermaid
flowchart LR
    A[React Frontend] -->|REST + SSE| B[Express Backend]
    A -->|WebSocket| S[Socket.io]
    B --> C[JWT Auth Middleware]
    B --> D[(MongoDB)]
    B --> R[(Redis Cache)]
    B --> E[LangChain Layer]
    E --> F[Gemini / Cohere / Mistral LLM]
    E --> G[(Pinecone Vector DB)]
    E --> H[Tavily Web Search]
    B --> I[PDF Parser]
    B --> Y[YouTube Transcript Fetcher]
    I --> E
    Y --> E
    G --> E
    F --> B
    S --> B
```

## 🤖 RAG Query Flow

```mermaid
flowchart TD
    A[User Question] --> B[Embed Query - Mistral]
    B --> C[Semantic Search in Pinecone]
    C --> D[Retrieve Top-K Relevant Chunks]
    D --> E[Build Context + Prompt]
    E --> F{Web Search Enabled?}
    F -->|Yes| G[LangChain Agent + Tavily Tool]
    F -->|No| H[Direct LLM Call - User-selected Gemini or Cohere]
    G --> I[Stream Answer to Client]
    H --> I
    I --> J[Persist Chat + Message in MongoDB]
```

> Note: the diagram above covers regular chat. PDF Q&A always uses **Mistral**, regardless of the chat model selector.

## 📄 Document / Video Ingestion Flow

```mermaid
flowchart TD
    A[Upload PDF or Paste YouTube URL] --> B{Transcript / Text available?}
    B -->|PDF| C[Extract Text]
    B -->|YouTube - auto fetch succeeds| D[Fetch Transcript via youtubei.js]
    B -->|YouTube - auto fetch fails| P[User Pastes Transcript Manually]
    C --> E[Split into Chunks]
    D --> E
    P --> E
    E --> F[Generate Embeddings - Mistral]
    F --> G[Upsert Vectors into Pinecone]
    G --> H[Save Metadata in MongoDB]
    H --> I[Ready for Chat]
```

## 🔐 Authentication Flow

```mermaid
flowchart TD
    A[Register] --> B[Validate + Rate Limit]
    B --> C[Create Account]
    C --> D[Send Verification Email - Brevo API]
    D --> E[User Verifies Email]
    E --> F[Login]
    F --> G[Validate Credentials]
    G --> H[Issue JWT]
    H --> I[Set HTTP-only Cookie]
    I --> J[Access Protected Routes]
```

## 🔑 Forgot Password Flow

```mermaid
flowchart TD
    A[User clicks Forgot Password] --> B[Enter Email]
    B --> C[Generate 4-digit OTP]
    C --> D[Store OTP in Redis - 10min TTL]
    D --> E[Email OTP via Brevo API]
    E --> F[User Enters OTP]
    F --> G{OTP Valid?}
    G -->|No| H[Increment Attempt Count / Reject]
    G -->|Yes| I[Clear OTP - Issue Short-lived Reset Token]
    I --> J[User Sets New Password]
    J --> K[Verify Reset Token]
    K --> L[Update Password Hash in MongoDB]
    L --> M[Redirect to Login]
```

> Both the email-lookup response and the OTP itself are designed to avoid leaking whether an account exists: `/forgot-password` always returns the same generic message, and the OTP is deleted after the first correct attempt (or after too many wrong ones) so it can't be replayed.

---

## 📂 Project Structure

```
AskQuery-Genai/
├── frontend/
│   ├── src/
│   │   ├── app/                 # App shell, routes, store, global CSS
│   │   └── features/
│   │       ├── auth/            # Login/Register/ForgotPassword pages, auth slice & API
│   │       ├── chat/            # Chat UI, socket service, chat slice
│   │       └── pdf/             # Document upload/list, YouTube add, pdf slice
│   ├── public/
│   └── vite.config.js
│
└── backend/
    ├── server.js                # Entry point (HTTP server + Socket.io)
    ├── render.yaml               # Render deployment config
    └── src/
        ├── app.js               # Express app & route mounting
        ├── config/               # MongoDB, Redis, Pinecone config
        ├── controllers/          # auth, chat, pdf, youtube controllers
        ├── middleware/           # auth, upload (Multer), rate limiting
        ├── models/                # User, Chat, Message, Document (Mongoose)
        ├── routes/                # /api/auth, /api/chats, /api/pdf, /api/youtube
        ├── services/              # ai, rag, embedding, vector, internet, cache, pdf, youtube, mail, passwordReset
        ├── sockets/               # Socket.io server setup
        ├── utils/                 # prompt builder, document splitter, OTP generator
        └── validator/             # request validation
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB instance (local or Atlas)
- Redis instance (local or hosted, e.g. Upstash/Redis Cloud)
- API keys for: Google Gemini, Cohere, Mistral AI, Pinecone, Tavily, Brevo

### 1. Clone the repository
```bash
git clone https://github.com/hari5827/AskQuery-Genai.git
cd AskQuery-Genai
```

### 2. Backend setup
```bash
cd backend
npm install --legacy-peer-deps
```
Create a `.env` file inside `backend/` (see [Environment Variables](#-environment-variables) below), then start the server:
```bash
npm run dev
```

### 3. Frontend setup
```bash
cd ../frontend
npm install
npm run dev
```

The frontend runs on Vite's default dev server, and the backend listens on the port set by `PORT` in your `.env` (in production on Render, this is injected automatically — see [Deployment](#-deployment)).

---

## 🔑 Environment Variables

Create a `.env` file inside the **backend** folder:

```env
# Server
NODE_ENV=development
PORT=3000                 # For local dev only - do NOT set this manually on Render

# Database & Cache
mongo_uri=your_mongodb_connection_string
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=your_jwt_secret

# Email (Brevo)
BREVO_API_KEY=
BREVO_SENDER_EMAIL=       # must be a sender verified in your Brevo account

# URLs (used for CORS and links inside verification emails)
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3000

# AI / Vector / Search providers
ASKQUERY_API_KEY=       # Google Gemini API key
COHERE_API_KEY=
MISTRAL_API_KEY=
PINECONE_API_KEY=
TAVILY_API_KEY=
```

> **Note:** In Pinecone, create an index named `askquery` before running the app (see `backend/src/config/pinecone.js`).
>
> **Note:** No extra env vars are needed for the forgot-password feature — it reuses `BREVO_API_KEY` / `BREVO_SENDER_EMAIL` for sending the OTP, `REDIS_URL` for storing it, and `JWT_SECRET` for signing the short-lived reset token.

And in the **frontend** folder, create a `.env` (or `.env.production` for deployment):
```env
VITE_API_URL=http://localhost:3000
```

---

## 🌐 Deployment

- **Backend**: [Render](https://render.com) (Node web service, config in `backend/render.yaml`)
- **Frontend**: [Vercel](https://vercel.com) (Vite static build, project root directory set to `frontend`)

### Render-specific notes
- Don't hardcode `PORT` as an env var in production — Render assigns it dynamically and the app already reads `process.env.PORT`. Setting it manually causes Render's internal health check to time out against the wrong port.
- `app.set("trust proxy", 1)` is required in `app.js` so `express-rate-limit` can correctly read the `X-Forwarded-For` header Render's reverse proxy adds to every request.
- Build command is `npm install --legacy-peer-deps` — resolves a peer dependency version conflict between `@langchain/community` and `zod`.
- Outbound email uses Brevo's HTTPS API rather than raw SMTP, since Render's network has had inconsistent connectivity to SMTP ports for some providers.

### Vercel-specific notes
- Set **Root Directory** to `frontend` when importing the repo (it's a monorepo with `backend/` alongside it).
- Set **Framework Preset** to `Vite` explicitly and save — if left on "Other," the build will look for a `build/` output folder instead of Vite's `dist/`.
- Add `VITE_API_URL` pointing at your deployed Render backend URL under Environment Variables.

---

## 📡 API Reference

### Auth — `/api/auth`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Create a new account (rate-limited) |
| POST | `/login` | Log in, receive JWT cookie (rate-limited) |
| GET | `/verify-email` | Verify email via emailed link/token |
| POST | `/forgot-password` | Request a password reset OTP by email (rate-limited; always returns a generic success message regardless of whether the email exists) |
| POST | `/verify-reset-otp` | Verify the 4-digit OTP; returns a short-lived `resetToken` on success (rate-limited) |
| POST | `/reset-password` | Reset the password using `{ resetToken, newPassword }` |
| GET | `/get-me` | Get the current authenticated user |
| POST | `/logout` | Clear auth cookie |
| DELETE | `/delete-account` | Permanently delete the account |

### Chat — `/api/chats`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/message` | Send a message, get a full response. Body accepts `{ message, chat, webSearch, model }` — `model` is `"gemini"` (default) or `"cohere"` |
| POST | `/message/stream` | Send a message, get a streamed (SSE) response. Same body as `/message` |
| GET | `/` | List all chats for the current user |
| GET | `/:chatId/messages` | Get all messages in a chat |
| DELETE | `/delete/:chatId` | Delete a chat |

### PDF / Documents — `/api/pdf`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/upload` | Upload a PDF (max 10 MB), chunk + embed + store in Pinecone |
| POST | `/ask` | Ask a question about an uploaded document |
| POST | `/ask/stream` | Streamed version of `/ask` |
| GET | `/documents` | List all uploaded documents |
| DELETE | `/:documentId` | Delete a document and its vectors |

### YouTube — `/api/youtube`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/add` | Submit a YouTube URL; transcript is fetched automatically via `youtubei.js`, chunked, and embedded. If automatic fetching fails, responds with `422` and `needsManualTranscript: true` so the client can prompt the user to paste the transcript directly (resubmit with `{ url, transcript }`) |

All routes above (except register/login/verify-email/forgot-password/verify-reset-otp/reset-password) require authentication via the `authUser` middleware, and upload/ask/auth routes are protected by dedicated rate limiters.

---

## 🗺️ Roadmap

- [x] Streaming AI responses (SSE + Socket.io)
- [x] YouTube video Q&A
- [x] Redis caching layer
- [x] Manual transcript fallback for blocked YouTube fetches
- [x] User-selectable chat model (Gemini / Cohere)
- [x] Forgot password (OTP-based reset via Brevo + Redis)


---

- **🎥 Live Demo**

- **📄 PDF RAG**

https://github.com/user-attachments/assets/979e1fd5-a1f9-40b5-ba13-ddb96ad632cc

-**▶️ YouTube RAG**

## ⚠️ Known Limitations

- YouTube transcript extraction relies on YouTube's internal/public transcript APIs (via `youtubei.js`). Due to YouTube's platform restrictions and anti-bot protections, automatic transcript retrieval may fail for some or all videos in cloud-hosted deployments (a known limitation shared by all scraping-based transcript libraries, not specific to this project).
- When automatic fetching fails, the app does **not** simply error out — it prompts the user to paste the video's transcript manually (copyable from YouTube's own "Show transcript" panel), and proceeds with embedding and Q&A exactly as if it had been fetched automatically.
- PDF RAG and Web Search features are fully supported with no such restrictions.
- Cohere periodically retires older `command-*` model IDs (e.g. `command-r-plus` was shut down September 2025). If Cohere chat responses start failing with a `404 model ... was removed` error, check [Cohere's deprecation page](https://docs.cohere.com/docs/deprecations) and update the model name in `backend/src/services/ai.service.js`.

https://github.com/user-attachments/assets/ac93df8a-cc69-4ca7-b27a-8447bac11620

-**TAVILY OFF 🌐 INTERNET SEARCH**

https://github.com/user-attachments/assets/20e91264-ce64-40fc-98e6-ff196953777a

-**🌐 Internet Search ON USING TAVILY**

https://github.com/user-attachments/assets/36f8b2a6-dbcc-4163-96e8-070ccd9298a0

-**💻 Syntax Highlighting**

https://github.com/user-attachments/assets/0ebdfcb2-8475-4219-b137-94b7c6b05e1b

---
## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Hariom Mishra**
- GitHub: [@hari5827](https://github.com/hari5827)
- LinkedIn: [hariom-mishra](https://www.linkedin.com/in/hariom-mishra-b0880b255/)
- AskQuery : [Live Website](https://ask-query-genai.vercel.app/login)
- Portfolio : [Hariom Mishra](https://hariom-mishra.vercel.app/)
> **Note:** Using Brevo's email API instead of Gmail OAuth2, due to inconsistent outbound SMTP connectivity on Render.


## ⭐ Support

If you found this project useful, please consider giving it a ⭐ on GitHub — it helps others discover it and supports future development.
