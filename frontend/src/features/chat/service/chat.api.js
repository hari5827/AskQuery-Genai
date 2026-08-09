import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})


export const sendMessage = async ({ message, chatId, webSearch, model }) => {
    const response = await api.post("/api/chats/message", { message, chat: chatId, webSearch, model })
    return response.data
}

// Streaming version of sendMessage. Uses native fetch instead of axios
// because axios can't read a streaming response body in the browser -
// we need response.body.getReader() to consume Server-Sent Events as
// they arrive rather than waiting for the whole response.
export const streamMessage = async ({ message, chatId, webSearch, model }) => {
    const response = await fetch(`${API_BASE_URL}/api/chats/message/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message, chat: chatId, webSearch, model }),
    })

    if (!response.ok || !response.body) {
        throw new Error("Failed to start streaming response")
    }

    return response
}
export const getChats = async () => {
    const response = await api.get("/api/chats")
    return response.data
}

export const getMessages = async (chatId) => {
    const response = await api.get(`/api/chats/${chatId}/messages`)
    return response.data
}

export const deleteChat = async (chatId) => {
    const response = await api.delete(`/api/chats/delete/${chatId}`)
    return response.data
}