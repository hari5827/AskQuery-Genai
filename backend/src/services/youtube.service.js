import { Innertube } from "youtubei.js";
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

// Innertube client setup is somewhat expensive (fetches player config etc.)
// so we create it once and reuse it across requests instead of per-call.
let innertubeClientPromise = null;
function getInnertubeClient() {
  if (!innertubeClientPromise) {
    innertubeClientPromise = Innertube.create({
      lang: "en",
      location: "US",
      retrieve_player: false,
    });
  }
  return innertubeClientPromise;
}

// Fetches the video's transcript and returns it as a single LangChain
// Document, ready to be handed to the existing splitDocument() the same
// way a PDF's pages are.
export async function loadYoutubeTranscript(videoId) {
  let segments;

  try {
    const yt = await getInnertubeClient();
    const info = await yt.getInfo(videoId);
    const transcriptData = await info.getTranscript();

    const initialSegments =
      transcriptData?.transcript?.content?.body?.initial_segments || [];

    segments = initialSegments
      .filter((seg) => seg?.snippet?.text)
      .map((seg) => seg.snippet.text);
  } catch (err) {
    console.error("youtubei.js transcript fetch failed:", err.message);
    throw new Error(
      "Could not fetch a transcript for this video. It may not have captions available."
    );
  }

  if (!segments || segments.length === 0) {
    throw new Error("This video doesn't have any captions/transcript available.");
  }

  const fullText = segments.join(" ");

  return [
    new Document({
      pageContent: fullText,
      metadata: { loc: { pageNumber: 1 } },
    }),
  ];
}