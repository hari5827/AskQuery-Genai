import axios from "axios";

const BASE_URL = window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "http://192.168.29.238:3000"

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

export const uploadDocument = async (file, onProgress) => {
    const formData = new FormData()
    formData.append("document", file)

    const response = await api.post("/api/pdf/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
                const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                onProgress(percent)
            }
        },
    })
    return response.data
}

export const getDocuments = async () => {
    const response = await api.get("/api/pdf/documents")
    return response.data
}

export const deleteDocument = async (documentId) => {
    const response = await api.delete(`/api/pdf/${documentId}`)
    return response.data
}

export const askDocument = async ({ question, documentId, chatId }) => {
    const response = await api.post("/api/pdf/ask", { question, documentId, chatId })
    return response.data
}

export const streamAskDocument = async ({ question, documentId, chatId }) => {
    const response = await fetch(`${BASE_URL}/api/pdf/ask/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ question, documentId, chatId }),
    })

    if (!response.ok || !response.body) {
        throw new Error("Failed to start streaming response")
    }

    return response
}