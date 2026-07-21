import { initializeSocketConnection } from "../service/chat.socket";
import { sendMessage, getChats, getMessages, deleteChat } from "../service/chat.api";
import { askDocument } from "../../pdf/service/pdf.api";
import { setChats, setCurrentChatId, setError, setLoading, createNewChat, addNewMessage, addMessages, clearCurrentChat,removeChat } from "../chat.slice";
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
        handleGetChats,
        handleOpenChat,
        handleClearCurrentChat,
        handleDeleteChat,
        handleAskDocument,
    }
}
