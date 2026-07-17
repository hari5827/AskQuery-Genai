import axios from "axios";

const api = axios.create({
  baseURL: window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "http://192.168.29.238:3000/",  // apna actual laptop IP daal
  withCredentials: true,
})


export const sendMessage = async ({ message, chatId, webSearch }) => {
    const response = await api.post("/api/chats/message", { message, chat: chatId, webSearch })
    return response.data
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