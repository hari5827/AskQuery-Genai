import { generateEmbeddings } from "./embedding.service.js";
import { index } from "../config/pinecone.js";

export const retrieveContext = async (question, source) => {
  const questionEmbedding = await generateEmbeddings(question, true);

  const result = await index.query({
  vector: questionEmbedding,
  topK: 3,
  includeMetadata: true,
  filter: {
    source,
  },
});

  const context = result.matches
    .map((match) => match.metadata.text)
    .join("\n\n");

  return context;
};