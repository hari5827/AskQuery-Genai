import { createSlice } from '@reduxjs/toolkit';


const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chats: {},
        currentChatId: null,
        isLoading: false,
        error: null,
    },
    reducers: {
        removeChat: (state, action) => {
  const chatId = action.payload;
  delete state.chats[chatId];
  if (state.currentChatId === chatId) {
    state.currentChatId = null;
     }
       },
        createNewChat: (state, action) => {
            const { chatId, title, documentId } = action.payload
            state.chats[ chatId ] = {
                id: chatId,
                title,
                documentId: documentId || null,
                messages: [],
                lastUpdated: new Date().toISOString(),
            }
        },
        addNewMessage: (state, action) => {
            const { chatId, content, role, sources, streaming } = action.payload
            state.chats[ chatId ].messages.push({ content, role, sources: sources || [], streaming: !!streaming })
        },
        appendStreamChunk: (state, action) => {
            const { chatId, chunk } = action.payload
            const messages = state.chats[ chatId ]?.messages
            if (!messages || messages.length === 0) return
            messages[ messages.length - 1 ].content += chunk
        },
        completeStreamingMessage: (state, action) => {
            const { chatId, sources } = action.payload
            const messages = state.chats[ chatId ]?.messages
            if (!messages || messages.length === 0) return
            const lastMessage = messages[ messages.length - 1 ]
            lastMessage.streaming = false
            lastMessage.sources = sources || []
        },
        addMessages: (state, action) => {
            const { chatId, messages } = action.payload
            state.chats[ chatId ].messages.push(...messages)
        },
        clearCurrentChat: (state) => {
         state.currentChatId = null;
        },
        setChats: (state, action) => {
            state.chats = action.payload
        },
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
    }
})

export const { setChats, setCurrentChatId, setLoading, setError, createNewChat, addNewMessage, addMessages, clearCurrentChat ,removeChat, appendStreamChunk, completeStreamingMessage} = chatSlice.actions
export default chatSlice.reducer
