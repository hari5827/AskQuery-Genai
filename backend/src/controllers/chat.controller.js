import { generateResponse, generateChatTitle, streamResponse } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

export async function sendMessage(req, res) {
    
    const { message, chat: chatId, webSearch } = req.body;
     
       let title = null, chat = null;

      if (!chatId) {
        title = await generateChatTitle(message);
        chat = await chatModel.create({
            user: req.user.id,
            title
        })
      }

    
      const userMessage = await messageModel.create({
        chat:   chatId || chat._id,
        content: message,
        role: "user"
    })

        const messages = await messageModel.find({ chat: chatId || chat._id })
           const { text, sources } = await generateResponse(messages, webSearch, req.user.id);

     const aiMessage = await messageModel.create({
        chat: chatId || chat._id,
        content: text,
        role : "ai",
        sources,

     })

      res.status(200).json({
         title,
         chat,
         aiMessage,
        });

    }


// Server-Sent Events version of sendMessage. Persists exactly the same
// records (chat/title if new, user message, final AI message) but pushes
// the AI's answer to the client token-by-token instead of all at once.
export async function sendMessageStream(req, res) {
  const { message, chat: chatId, webSearch } = req.body;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const sendEvent = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  try {
    let title = null, chat = null;

    if (!chatId) {
      title = await generateChatTitle(message);
      chat = await chatModel.create({
        user: req.user.id,
        title,
      });
    }

    const resolvedChatId = chatId || chat._id;

    await messageModel.create({
      chat: resolvedChatId,
      content: message,
      role: "user",
    });

    // Sent immediately so the client can create the sidebar entry /
    // set the active chat before any AI tokens arrive.
    sendEvent({ type: "start", chat, title });

    const messages = await messageModel.find({ chat: resolvedChatId });

    const { text, sources } = await streamResponse(
      messages,
      webSearch,
      req.user.id,
      (token) => sendEvent({ type: "chunk", content: token })
    );

    const aiMessage = await messageModel.create({
      chat: resolvedChatId,
      content: text,
      role: "ai",
      sources,
    });

    sendEvent({ type: "done", aiMessage });
    res.end();
  } catch (error) {
    console.error("Streaming error:", error);
    sendEvent({ type: "error", message: "Something went wrong while generating the response." });
    res.end();
  }
}

export async function getChats(req, res) {
     const user = req.user

    const chats = await chatModel.find({ user: user.id })

    res.status(200).json({
        message: "Chats retrieved successfully",
        chats
    })


    }

export async function getMessages(req, res) {

 const { chatId } = req.params;
const chat = await chatModel.findOne({
        _id: chatId,
        user: req.user.id
    })

    if (!chat) {
        return res.status(404).json({
            message: "Chat not found"
        })
    }

    const messages = await messageModel.find({
        chat: chatId
    })

    res.status(200).json({
        message: "Messages retrieved successfully",
        messages
    })

}


export async function deleteChat(req, res) {

    const { chatId } = req.params;

    const chat = await chatModel.findOneAndDelete({
        _id: chatId,
        user: req.user.id
    })

    await messageModel.deleteMany({
        chat: chatId
    })

    if (!chat) {
        return res.status(404).json({
            message: "Chat not found"
        })
    }

    res.status(200).json({
        message: "Chat deleted successfully"
    })
}
