import { initializeSocketConnection } from "../service/chat.socket";
import { sendMessage, streamMessage, getChats, getMessages, deleteChat } from "../service/chat.api";
import { askDocument, streamAskDocument } from "../../pdf/service/pdf.api";
import { setChats, setCurrentChatId, setError, setLoading, createNewChat, addNewMessage, addMessages, clearCurrentChat,removeChat, appendStreamChunk, completeStreamingMessage } from "../chat.slice";
import { useDispatch } from "react-redux";

export const useChat = () => {

    const dispatch = useDispatch()

  async function handleSendMessage({ message, chatId, webSearch }) {
    dispatch(setLoading(true))

    // Show the user's message immediately for an existing chat
    if (chatId) {
        dispatch(addNewMessage({
            chatId,
            content: message,
            role: "user",
        }))
    }

    try {
        const data = await sendMessage({ message, chatId, webSearch })
        const { chat, aiMessage } = data

        if (!chatId) {
            dispatch(createNewChat({
                chatId: chat._id,
                title: chat.title,
            }))
            dispatch(addNewMessage({
                chatId: chat._id,
                content: message,
                role: "user",
            }))
            dispatch(setCurrentChatId(chat._id))
        }

        dispatch(addNewMessage({
            chatId: chatId || chat._id,
            content: aiMessage.content,
            role: aiMessage.role,
            sources: aiMessage.sources,
        }))
    } catch (error) {
        console.error("Failed to send message:", error)
        dispatch(setError(error?.message || "Something went wrong"))
    } finally {
        dispatch(setLoading(false))
    }
}

    // Streaming counterpart to handleSendMessage. Reads the SSE response
    // body as it arrives instead of waiting for the full JSON reply, so
    // the AI bubble fills in progressively.
    async function handleSendMessageStream({ message, chatId, webSearch }) {
        dispatch(setLoading(true))

        if (chatId) {
            dispatch(addNewMessage({
                chatId,
                content: message,
                role: "user",
            }))
        }

        let activeChatId = chatId
        let aiMessageStarted = false

        try {
            const response = await streamMessage({ message, chatId, webSearch })
            const reader = response.body.getReader()
            const decoder = new TextDecoder()

            let buffer = ""

            while (true) {
                const { value, done } = await reader.read()
                if (done) break

                buffer += decoder.decode(value, { stream: true })

                // SSE events are separated by a blank line; keep any
                // trailing partial event in the buffer for the next chunk.
                const events = buffer.split("\n\n")
                buffer = events.pop()

                for (const rawEvent of events) {
                    const line = rawEvent.trim()
                    if (!line.startsWith("data:")) continue

                    const event = JSON.parse(line.slice(5).trim())

                    if (event.type === "start" && !chatId) {
                        activeChatId = event.chat._id
                        dispatch(createNewChat({
                            chatId: activeChatId,
                            title: event.title,
                        }))
                        dispatch(addNewMessage({
                            chatId: activeChatId,
                            content: message,
                            role: "user",
                        }))
                        dispatch(setCurrentChatId(activeChatId))
                    }

                    if (event.type === "chunk") {
                        if (!aiMessageStarted) {
                            // First token arrived — swap the "thinking"
                            // indicator for the real (empty-but-growing) bubble.
                            dispatch(setLoading(false))
                            dispatch(addNewMessage({
                                chatId: activeChatId,
                                content: "",
                                role: "ai",
                                streaming: true,
                            }))
                            aiMessageStarted = true
                        }
                        dispatch(appendStreamChunk({
                            chatId: activeChatId,
                            chunk: event.content,
                        }))
                    }

                    if (event.type === "done") {
                        dispatch(completeStreamingMessage({
                            chatId: activeChatId,
                            sources: event.aiMessage?.sources,
                        }))
                    }

                    if (event.type === "error") {
                        dispatch(setError(event.message))
                    }
                }
            }
        } catch (error) {
            console.error("Failed to stream message:", error)
            dispatch(setError(error?.message || "Something went wrong"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleGetChats() {
        dispatch(setLoading(true))
        const data = await getChats()
        const { chats } = data
        dispatch(setChats(chats.reduce((acc, chat) => {
            acc[chat._id] = {
                id: chat._id,
                title: chat.title,
                documentId: chat.document || null,
                messages: [],
                lastUpdated: chat.updatedAt,
            }
            return acc
        }, {})))
        dispatch(setLoading(false))
    }
 async function handleDeleteChat(chatId) {
    await deleteChat(chatId);
    dispatch(removeChat(chatId));
}

    // PDF document Q&A is persisted through the same Chat/Message
    // records the normal chat flow uses (backend creates/reuses a
    // Chat linked to the document), so it mirrors handleSendMessage
    // above and survives refresh via GET /api/chats like any other
    // conversation.
    async function handleAskDocument({ question, chatId, documentId }) {
        dispatch(setLoading(true))

        if (chatId) {
            dispatch(addNewMessage({
                chatId,
                content: question,
                role: "user",
            }))
        }

        try {
            const data = await askDocument({ question, documentId, chatId })
            const { chat, aiMessage } = data

            if (!chatId) {
                dispatch(createNewChat({
                    chatId: chat._id,
                    title: chat.title,
                    documentId,
                }))
                dispatch(addNewMessage({
                    chatId: chat._id,
                    content: question,
                    role: "user",
                }))
                dispatch(setCurrentChatId(chat._id))
            }

            dispatch(addNewMessage({
                chatId: chatId || chat._id,
                content: aiMessage.content,
                role: aiMessage.role,
            }))
        } catch (error) {
            console.error("Failed to ask document:", error)
            dispatch(setError(error?.response?.data?.message || "Something went wrong"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    // Streaming counterpart to handleAskDocument - same SSE-parsing
    // approach as handleSendMessageStream, pointed at /api/pdf/ask/stream.
    async function handleAskDocumentStream({ question, chatId, documentId }) {
        dispatch(setLoading(true))

        if (chatId) {
            dispatch(addNewMessage({
                chatId,
                content: question,
                role: "user",
            }))
        }

        let activeChatId = chatId
        let aiMessageStarted = false

        try {
            const response = await streamAskDocument({ question, documentId, chatId })
            const reader = response.body.getReader()
            const decoder = new TextDecoder()

            let buffer = ""

            while (true) {
                const { value, done } = await reader.read()
                if (done) break

                buffer += decoder.decode(value, { stream: true })

                const events = buffer.split("\n\n")
                buffer = events.pop()

                for (const rawEvent of events) {
                    const line = rawEvent.trim()
                    if (!line.startsWith("data:")) continue

                    const event = JSON.parse(line.slice(5).trim())

                    if (event.type === "start" && !chatId) {
                        activeChatId = event.chat._id
                        dispatch(createNewChat({
                            chatId: activeChatId,
                            title: event.chat.title,
                            documentId,
                        }))
                        dispatch(addNewMessage({
                            chatId: activeChatId,
                            content: question,
                            role: "user",
                        }))
                        dispatch(setCurrentChatId(activeChatId))
                    }

                    if (event.type === "chunk") {
                        if (!aiMessageStarted) {
                            dispatch(setLoading(false))
                            dispatch(addNewMessage({
                                chatId: activeChatId,
                                content: "",
                                role: "ai",
                                streaming: true,
                            }))
                            aiMessageStarted = true
                        }
                        dispatch(appendStreamChunk({
                            chatId: activeChatId,
                            chunk: event.content,
                        }))
                    }

                    if (event.type === "done") {
                        dispatch(completeStreamingMessage({
                            chatId: activeChatId,
                            sources: event.aiMessage?.sources,
                        }))
                    }

                    if (event.type === "error") {
                        dispatch(setError(event.message))
                    }
                }
            }
        } catch (error) {
            console.error("Failed to stream document answer:", error)
            dispatch(setError(error?.message || "Something went wrong"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleOpenChat(chatId, chats) {
        if (chats[chatId]?.messages.length === 0) {
            const data = await getMessages(chatId)
            const { messages } = data

            const formattedMessages = messages.map(msg => ({
                content: msg.content,
                role: msg.role,
                sources: msg.sources || [],
            }))

            dispatch(addMessages({
                chatId,
                messages: formattedMessages,
            }))
        }
        dispatch(setCurrentChatId(chatId))
    }

    function handleClearCurrentChat() {
        dispatch(clearCurrentChat())
    }

    return {
        initializeSocketConnection,
        handleSendMessage,
        handleSendMessageStream,
        handleGetChats,
        handleOpenChat,
        handleClearCurrentChat,
        handleDeleteChat,
        handleAskDocument,
        handleAskDocumentStream,
    }
}
