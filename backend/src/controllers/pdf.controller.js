import Document from "../models/document.model.js";
import { loadPDF } from "../services/pdf.service.js";
import { splitDocument } from "../utils/splitDocument.js";
import { generateEmbeddings } from "../services/embedding.service.js";
import { storeVectors } from "../services/vector.service.js";
import { retrieveContext } from "../services/rag.service.js";
import { generateAnswer } from "../services/chat.service.js";
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
    const { question, documentId } = req.body;

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

    const context = await retrieveContext(
      question,
      document.originalName
    );

    const answer = await generateAnswer(context, question);

    return res.status(200).json({
      success: true,
      answer,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
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