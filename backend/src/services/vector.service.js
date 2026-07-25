import { index } from "../config/pinecone.js";
import crypto from "crypto";

export const storeVectors = async (vectors, chunks, filename) => {
  // Pinecone requires vector IDs to be plain ASCII. Titles/filenames can
  // contain anything (emoji, "•", accented characters, etc.), so we hash
  // the filename into a fixed, ASCII-only ID instead of using it directly.
  // The human-readable filename is still stored as-is in metadata.source
  // below (metadata values have no such restriction) - that's what
  // retrieveContext filters on, so nothing else needs to change.
  const idPrefix = crypto.createHash("md5").update(filename).digest("hex");

  const records = vectors.map((vector, i) => ({
    id: `${idPrefix}-${i}`,

    values: vector,

    metadata: {
      text: chunks[i].pageContent,
      page: chunks[i].metadata?.loc?.pageNumber ?? null,
      source: filename,
    },
  }));

  if (records.length === 0) {
    throw new Error("No records generated");
  }

  await index.upsert({
    records,
  });

  return records;
};