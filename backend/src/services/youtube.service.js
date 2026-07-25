import { YoutubeTranscript } from "youtube-transcript";
import { Document } from "@langchain/core/documents";

// Covers watch?v=, youtu.be/, /shorts/, and /embed/ URL formats.
const RE_YOUTUBE = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?/\s]{11})/i;

export function extractVideoId(url) {
  const match = String(url || "").match(RE_YOUTUBE);
  return match ? match[1] : null;
}

// Uses YouTube's public oEmbed endpoint - no API key required, just
// returns basic metadata (title, author, thumbnail) for a public video.
export async function getVideoTitle(videoId) {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );
    if (!res.ok) return `YouTube Video (${videoId})`;
    const data = await res.json();
    return data.title || `YouTube Video (${videoId})`;
  } catch (err) {
    console.error("Failed to fetch video title:", err.message);
    return `YouTube Video (${videoId})`;
  }
}

// Fetches the video's transcript and returns it as a single LangChain
// Document, ready to be handed to the existing splitDocument() the same
// way a PDF's pages are. Note: the underlying transcript library returns
// timestamp offsets in inconsistent units depending on which caption
// format YouTube happens to serve for a given video, so we deliberately
// don't try to expose per-chunk timestamps here - just the plain text,
// which is what actually matters for answering questions.
export async function loadYoutubeTranscript(videoId) {
  let entries;
  try {
    entries = await YoutubeTranscript.fetchTranscript(videoId);
  } catch (err) {
    console.error("YoutubeTranscript.fetchTranscript failed:", err.message);
    throw new Error(
      "Could not fetch a transcript for this video. It may not have captions available."
    );
  }

  if (!entries || entries.length === 0) {
    throw new Error("This video doesn't have any captions/transcript available.");
  }

  const fullText = entries.map((e) => e.text).join(" ");

  return [
    new Document({
      pageContent: fullText,
      metadata: { loc: { pageNumber: 1 } },
    }),
  ];
}
