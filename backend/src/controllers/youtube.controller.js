import Document from "../models/document.model.js";
import { splitDocument } from "../utils/splitDocument.js";
import { generateEmbeddings } from "../services/embedding.service.js";
import { storeVectors } from "../services/vector.service.js";
import { Document as LangchainDocument } from "@langchain/core/documents";
import {
  extractVideoId,
  getVideoTitle,
  loadYoutubeTranscript,
} from "../services/youtube.service.js";

export const addYoutubeVideo = async (req, res) => {
  try {
    const { url, transcript } = req.body;

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

    let docs;

    if (transcript && transcript.trim().length > 0) {
      // User pasted the transcript manually - skip automatic fetching entirely.
      docs = [
        new LangchainDocument({
          pageContent: transcript.trim(),
          metadata: { loc: { pageNumber: 1 } },
        }),
      ];
    } else {
      try {
        docs = await loadYoutubeTranscript(videoId);
      } catch (transcriptError) {
        // Automatic fetching failed (common on cloud hosts - YouTube often
        // blocks datacenter IPs). Let the frontend know it can offer a
        // "paste transcript manually" option instead of just failing.
        return res.status(422).json({
          success: false,
          needsManualTranscript: true,
          message:
            "Couldn't fetch this video's transcript automatically. You can paste it in manually instead.",
        });
      }
    }

    const chunks = await splitDocument(docs);
    const vectors = await generateEmbeddings(chunks);

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