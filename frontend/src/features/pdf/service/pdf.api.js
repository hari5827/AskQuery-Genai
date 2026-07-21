import axios from "axios";

const api = axios.create({
  baseURL: window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "http://192.168.29.238:3000/",  // apna actual laptop IP daal
  withCredentials: true,
})

export const uploadDocument = async (file) => {
    const formData = new FormData()
    formData.append("document", file)

    const response = await api.post("/api/pdf/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
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

