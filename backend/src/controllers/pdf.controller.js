import Document from "../models/document.model.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";
import { loadPDF } from "../services/pdf.service.js";
import { splitDocument } from "../utils/splitDocument.js";
import { generateEmbeddings } from "../services/embedding.service.js";
import { storeVectors } from "../services/vector.service.js";
import { retrieveContext } from "../services/rag.service.js";
import { generateAnswer, streamAnswer } from "../services/chat.service.js";
import { buildCacheKey, getCache, setCache } from "../services/cache.service.js";
import fs from "fs";
import { index } from "../config/pinecone.js"
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }
     console.log("Logged in user:", req.user);

    
    const docs = await loadPDF(req.file.path);
    const chunks = await splitDocument(docs);
    const vectors = await generateEmbeddings(chunks);

    const records = await storeVectors(
      vectors,
      chunks,
      req.file.originalname
    );

    
    await Document.create({
      user: req.user.id,
      originalName: req.file.originalname,
      fileName: req.file.filename,
      pineconeIds: records.map((record) => record.id),
      status: "ready",
    });

    return res.status(200).json({
      success: true,
      message: "Document uploaded successfully",
      totalPages: docs.length,
      totalChunks: chunks.length,
      totalVectors: vectors.length,
      storedVectors: records.length,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const askQuestion = async (req, res) => {
  try {
    const { question, documentId, chatId } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    const document = await Document.findOne({
      _id: documentId,
      user: req.user.id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    let chat = null;

    if (!chatId) {
      chat = await chatModel.create({
        user: req.user.id,
        title: document.originalName,
        document: document._id,
      });
    }

    const targetChatId = chatId || chat._id;

    await messageModel.create({
      chat: targetChatId,
      content: question,
      role: "user",
    });

    // Cache key is scoped to this document + the exact question text,
    // since retrieveContext/generateAnswer here don't use chat history -
    // the same question against the same document always produces the
    // same answer, which is exactly what makes this safe to cache.
    const cacheKey = buildCacheKey("pdf-qa", [documentId, question]);

    let answer = await getCache(cacheKey);

    if (answer) {
      console.log("Cache hit for PDF Q&A:", cacheKey);
    } else {
      const context = await retrieveContext(
        question,
        document.originalName
      );
      answer = await generateAnswer(context, question);
      await setCache(cacheKey, answer);
    }

    const aiMessage = await messageModel.create({
      chat: targetChatId,
      content: answer,
      role: "ai",
    });

    return res.status(200).json({
      success: true,
      chat,
      aiMessage,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// SSE version of askQuestion. Same DB persistence and same cache key,
// but streams the answer token-by-token instead of returning it all
// at once. On a cache hit there's nothing to stream from the model, so
// the cached text is sent out in small pieces instead - this keeps the
// frontend's event-handling code identical for both cases, it just
// sees "chunk" events either way (hit ones just arrive almost instantly).
export const askQuestionStream = async (req, res) => {
  const { question, documentId, chatId } = req.body;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const sendEvent = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  try {
    if (!question) {
      sendEvent({ type: "error", message: "Question is required" });
      return res.end();
    }

    const document = await Document.findOne({
      _id: documentId,
      user: req.user.id,
    });

    if (!document) {
      sendEvent({ type: "error", message: "Document not found" });
      return res.end();
    }

    let chat = null;

    if (!chatId) {
      chat = await chatModel.create({
        user: req.user.id,
        title: document.originalName,
        document: document._id,
      });
    }

    const targetChatId = chatId || chat._id;

    await messageModel.create({
      chat: targetChatId,
      content: question,
      role: "user",
    });

    sendEvent({ type: "start", chat });

    const cacheKey = buildCacheKey("pdf-qa", [documentId, question]);
    const cached = await getCache(cacheKey);

    let answer;

    if (cached) {
      console.log("Cache hit for PDF Q&A:", cacheKey);
      answer = cached;

      // Fake a stream out of the cached text so the UI still gets the
      // same progressive-reveal feel instead of the text appearing
      // all at once (which would look like a glitch right after a
      // real streamed answer).
      const words = cached.split(" ");
      for (const word of words) {
        sendEvent({ type: "chunk", content: word + " " });
      }
    } else {
      const context = await retrieveContext(question, document.originalName);
      answer = await streamAnswer(context, question, (token) =>
        sendEvent({ type: "chunk", content: token })
      );
      await setCache(cacheKey, answer);
    }

    const aiMessage = await messageModel.create({
      chat: targetChatId,
      content: answer,
      role: "ai",
    });

    sendEvent({ type: "done", aiMessage });
    res.end();
  } catch (error) {
    console.error("Streaming PDF Q&A error:", error);
    sendEvent({ type: "error", message: "Something went wrong while generating the response." });
    res.end();
  }
};

export const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({
      user: req.user.id,
    })
      .select("originalName status createdAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      documents,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    const document = await Document.findOne({
      _id: documentId,
      user: req.user.id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    
    await index.deleteMany({
  ids: document.pineconeIds,
});

  
    const filePath = `src/uploads/${document.fileName}`;

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Document.findByIdAndDelete(documentId);

    return res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};