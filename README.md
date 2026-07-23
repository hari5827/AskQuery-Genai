AskQuery – AI Document Assistant using RAG
AskQuery is a full-stack AI-powered document assistant that allows users to upload PDF documents and interact with them using Retrieval-Augmented Generation (RAG). The application combines semantic search, vector embeddings, large language models, and internet search to generate accurate, context-aware responses while maintaining secure authentication and persistent chat history

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-1C3C3C?style=for-the-badge&logo=chainlink&logoColor=white)
![Pinecone](https://img.shields.io/badge/Pinecone-000000?style=for-the-badge&logo=vector&logoColor=white)
![Mistral AI](https://img.shields.io/badge/Mistral_AI-EA5A0C?style=for-the-badge)
![Gemini AI](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)
</div>


## ✨ Features

- Secure JWT Authentication
- Email Verification using Gmail OAuth2
- PDF Upload & Management
- Retrieval-Augmented Generation (RAG)
- Semantic Search with Pinecone
- Mistral Embeddings
- LangChain Pipeline
- Internet Search (Tavily)
- Persistent Chat History
- Markdown Rendering
- Mathematical Formula Rendering (KaTeX)
- Syntax Highlighting
- Responsive UI

## 🛠️ Tech Stack

### **Frontend**

- **Framework:** React 19, React Router DOM
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS
- **Networking:** Axios
- **Markdown Rendering:** React Markdown
- **Math Rendering:** KaTeX, remark-math, rehype-katex
- **Code Highlighting:** React Syntax Highlighter
- **Notifications:** React Hot Toast
- **Icons:** Lucide React
- **Build Tool:** Vite

### **Backend**

- **Runtime:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT, HTTP-Only Cookies
- **Email Service:** Nodemailer (Gmail OAuth2)
- **File Upload:** Multer
- **Validation:** Validator
- **Security:** CORS, Cookie Parser, Express Rate Limit
- **Environment Management:** dotenv

### **AI & RAG Pipeline**

- **Framework:** LangChain
- **LLM:** Mistral AI
- **Embedding Model:** Mistral Embeddings
- **Vector Database:** Pinecone
- **Document Parsing:** pdf-parse
- **Text Splitting:** RecursiveCharacterTextSplitter
- **Internet Search:** Tavily Search API

### **Development Tools**

- **Version Control:** Git, GitHub
- **Package Manager:** npm
- **API Testing:** Postman

## 🔄 Workflow Diagrams


## 🏗️ Application Workflow

```mermaid
flowchart TD

A[User] --> B[Register / Login]
B --> C[JWT Authentication]
C --> D[Chat Dashboard]

D --> E{Choose Mode}

E -->|Internet Search| F[Ask Question]

E -->|PDF Chat| G[Upload PDF]

G --> H[Validate PDF]
H --> I[Store PDF]
I --> J[Extract Text]
J --> K[Split into Chunks]
K --> L[Generate Embeddings]
L --> M[Store Vectors in Pinecone]
M --> N[Save Metadata in MongoDB]

N --> F

F --> O[Embed User Query]
O --> P[Semantic Search]
P --> Q[Retrieve Relevant Chunks]
Q --> R[Build Prompt]
R --> S[Mistral AI]
S --> T[Generate AI Response]
T --> U[Save Chat History]
U --> V[Display Response]
```
- **Code Editor:** Visual Studio Code

- ## 🔐 Authentication Flow

```mermaid
flowchart TD

A[User] --> B[Register]
B --> C[Validate User Data]
C --> D[Create Account]
D --> E[Send Verification Email]
E --> F[Verify Email]

F --> G[Login]

G --> H[Validate Credentials]

H --> I[Generate JWT]

I --> J[Store HTTP Only Cookie]

J --> K[Protected Routes]

K --> L[Dashboard]
```

## 📄 PDF Processing Workflow

```mermaid
flowchart TD

A[Upload PDF]

A --> B[Validate File]

B --> C[Store File]

C --> D[Extract Text]

D --> E[Split into Chunks]

E --> F[Generate Embeddings]

F --> G[Store Embeddings in Pinecone]

G --> H[Save Metadata in MongoDB]

H --> I[Ready for AI Chat]
```

## 🤖 RAG Pipeline

```mermaid
flowchart TD

A[User Question]

A --> B[Generate Query Embedding]

B --> C[Semantic Search]

C --> D[Pinecone Vector Database]

D --> E[Retrieve Similar Chunks]

E --> F[Build Context]

F --> G[Generate Prompt]

G --> H[Mistral AI]

H --> I[Generate Answer]

I --> J[Return Response]
```

## 🌐 Internet Search Workflow

```mermaid
flowchart TD

A[User Question]

A --> B[Internet Search Enabled]

B --> C[Tavily Search API]

C --> D[Retrieve Web Results]

D --> E[Build Prompt]

E --> F[Mistral AI]

F --> G[Generate AI Response]

G --> H[Display Response]
```

## 💬 Chat Request Flow

```mermaid
sequenceDiagram

participant User
participant Frontend
participant Backend
participant Pinecone
participant Mistral
participant MongoDB

User->>Frontend: Ask Question

Frontend->>Backend: POST /api/chat/ask

Backend->>Pinecone: Semantic Search

Pinecone-->>Backend: Relevant Chunks

Backend->>Mistral: Prompt + Context

Mistral-->>Backend: AI Response

Backend->>MongoDB: Save Chat

MongoDB-->>Backend: Success

Backend-->>Frontend: Response

Frontend-->>User: Display Answer
```

## 🏛️ System Architecture

```mermaid
flowchart LR

A[React Frontend]

A --> B[Express Backend]

B --> C[JWT Authentication]

B --> D[MongoDB]

B --> E[LangChain]

E --> F[Mistral AI]

E --> G[Pinecone]

E --> H[Tavily Search]

B --> I[PDF Parser]

I --> E

G --> E

F --> B

B --> A
```

## 🗂️ Document Upload Flow

```mermaid
flowchart TD

A[Select PDF]

A --> B[Validate Size & Type]

B --> C[Upload to Server]

C --> D[Save File]

D --> E[Extract Text]

E --> F[Split into Chunks]

F --> G[Generate Embeddings]

G --> H[Store in Pinecone]

H --> I[Save Metadata]

I --> J[Upload Complete]
```

## 📂 Project Structure

```mermaid
graph TD

A[AskQuery]

A --> B[Frontend]

B --> B1[src]

B1 --> B11[components]
B1 --> B12[pages]
B1 --> B13[layouts]
B1 --> B14[features]
B1 --> B15[hooks]
B1 --> B16[services]
B1 --> B17[utils]
B1 --> B18[assets]

B --> B2[public]

B --> B3[vite.config.js]

A --> C[Backend]

C --> C1[src]

C1 --> C11[controllers]
C1 --> C12[routes]
C1 --> C13[middleware]
C1 --> C14[models]
C1 --> C15[services]
C1 --> C16[utils]
C1 --> C17[config]
C1 --> C18[uploads]

C --> C2[server.js]

C --> C3[package.json]

A --> D[README.md]
```

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/hari5827/AskQuery-Genai.git
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the backend directory.

### 5. Start Backend

```bash
npm run dev
```

### 6. Start Frontend

```bash
npm run dev
```

## 🔑 Environment Variables

Create a `.env` file inside the **backend** folder.

```env
PORT=

MONGO_URI=

JWT_SECRET=

GOOGLE_CLIENT_ID=

GOOGLE_CLIENT_SECRET=

GOOGLE_REFRESH_TOKEN=

GOOGLE_EMAIL=

MISTRAL_API_KEY=

PINECONE_API_KEY=

TAVILY_API_KEY=
```

## 📡 API Endpoints

### Authentication

| Method | Endpoint |
|--------|----------|
| POST | `/api/auth/register` |
| POST | `/api/auth/login` |
| POST | `/api/auth/logout` |
| GET | `/api/auth/me` |
| POST | `/api/auth/verify-email` |

### PDF

| Method | Endpoint |
|--------|----------|
| POST | `/api/pdf/upload` |
| GET | `/api/pdf` |
| DELETE | `/api/pdf/:id` |

### Chat

| Method | Endpoint |
|--------|----------|
| POST | `/api/chat/ask` |
| GET | `/api/chat/history` |
| DELETE | `/api/chat/:id` |

## 🚀 Upcoming Features

- [x] Streaming AI Responses
- [ ] YouTube Video Q&A
- [ ] Redis Caching

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Hariom Mishra**

- GitHub: https://github.com/hari5827
- LinkedIn: https://www.linkedin.com/in/hariom-mishra-b0880b255/

  ## ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub.
It helps others discover the project and supports future development.
