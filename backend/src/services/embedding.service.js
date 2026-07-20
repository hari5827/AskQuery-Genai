import { MistralAIEmbeddings } from "@langchain/mistralai";

const embeddings = new MistralAIEmbeddings({
  model: "mistral-embed",
  apiKey: process.env.MISTRAL_API_KEY,
});

export const generateEmbeddings = async (data, isQuery = false) => {

  if (isQuery) {
    return await embeddings.embedQuery(data);
  }

  return await embeddings.embedDocuments(
    data.map((chunk) => chunk.pageContent)
  );
};