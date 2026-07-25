import { Document as LangchainDocument } from "@langchain/core/documents";
import { splitDocument } from "../utils/splitDocument.js";
import Document from "../models/document.model.js";
import { generateEmbeddings } from "../services/embedding.service.js";
import { storeVectors } from "../services/vector.service.js";
import {
  extractVideoId,
  getVideoTitle,
  loadYoutubeTranscript,
} from "../services/youtube.service.js";

export const addYoutubeVideo = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "YouTube URL is required",
      });
    }

    const videoId = extractVideoId(url);

    if (!videoId) {
      return res.status(400).json({
        success: false,
        message: "Could not find a video ID in that URL",
      });
    }

    // Don't re-embed the same video twice for the same user.
    const existing = await Document.findOne({
      user: req.user.id,
      fileName: videoId,
      sourceType: "youtube",
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        message: "This video was already added",
        document: existing,
      });
    }

    const title = await getVideoTitle(videoId);
    const docs = await loadYoutubeTranscript(videoId);
    const chunks = await splitDocument(docs);
    const vectors = await generateEmbeddings(chunks);

    // Unique per-video key: this becomes both the Document's
    // originalName (what's shown in the sidebar) AND the Pinecone
    // `source` filter that askQuestion/askQuestionStream already use
    // unchanged. Including the videoId guarantees it can't collide
    // with another video, or a PDF, that happens to share the exact
    // same title.
    const source = `${title} • ${videoId}`;

    const records = await storeVectors(vectors, chunks, source);

    const document = await Document.create({
      user: req.user.id,
      originalName: source,
      fileName: videoId,
      pineconeIds: records.map((record) => record.id),
      status: "ready",
      sourceType: "youtube",
      sourceUrl: url,
    });

    return res.status(200).json({
      success: true,
      message: "Video added successfully",
      document,
      totalChunks: chunks.length,
      totalVectors: vectors.length,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to process video",
    });
  }
};
