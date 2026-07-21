AskQuery – AI Document Assistant using RAG

AskQuery is an AI-powered document assistant that enables users to upload PDFs and interact with them using Retrieval-Augmented Generation (RAG). It combines semantic search, vector embeddings, and LLMs to provide context-aware answers while maintaining chat history and secure authentication.

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


##  Features

-  **JWT Authentication** — Secure login/register with HTTP-only cookies and email verification.
-  **AI Assistant** — Full-featured chat experience integrated with internet search capabilities.
-  **PDF Management** — Upload, view, and delete documents seamlessly.
-  **Chat with PDFs (RAG)** — Query uploaded documents with precise context powered by Pinecone & Mistral AI.
-  **Semantic Search** — LangChain chunking,Mistral embeddings,Pinecone vector retrieval
-  **Chat History** — Persistent chat sessions stored in MongoDB.

**Tech Stack**


### **Frontend**
- **Framework:** React, React Router
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS
- **Networking:** Axios

### **Backend**
- **Runtime:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Auth & Files:** JWT, Multer
- **Real-Time:** Socket.io

### **AI & RAG Pipeline**
- **Framework:** LangChain
- **LLM:** Mistral AI
- **Vector Database:** Pinecone
- **Text Splitter:** `RecursiveCharacterTextSplitter`

**System Architecture**


 <img width="887" height="271" alt="image" src="https://github.com/user-attachments/assets/a8c44dfd-c2c8-4ca1-9732-b33ec7386672" />


                                            

  **RAG Pipeline Flow**

 <img width="762" height="202" alt="image" src="https://github.com/user-attachments/assets/505d4158-0245-40bd-9a41-ba05b2bd9278" />




**Getting Started
Prerequisites**
Node.js (v18+)
MongoDB Instance
Pinecone API Key
Mistral AI API Key 
Gemini AI API Key
Gmail api key


**Environment Configuration**

mongo_uri 
GOOGLE_CLIENT_ID= your_pi_key
GOOGLE_CLIENT_SECRET= your_client secret key
GOOGLE_REFRESH_TOKEN= your_refresh_token
GOOGLE_USER=user
JWT_SECRET= your_secret_key
ASKQUERY_API_KEY= your_gemini_api_key
MISTRAL_API_KEY= mistral_api_key
PORT=3000
TAVILY_API_KEY= your_tavily_api_key
PINECONE_API_KEY= your_pinecone_api_key

**Project Structure**

<img width="770" height="556" alt="image" src="https://github.com/user-attachments/assets/ae37a89a-8d9d-402f-88ba-5767f9c17d9a" />



**Project metrics**

<img width="353" height="386" alt="image" src="https://github.com/user-attachments/assets/e95d39c6-496a-4fab-8d20-a18087dbc59d" />




##  Roadmap & Future Enhancements

- [x] JWT Authentication
- [x] PDF Upload
- [x] Chat History
- [x] Semantic Search
- [ ] OCR Support
- [ ] Docker
- [ ] Streaming Responses
- [ ] Multi PDF Chat
