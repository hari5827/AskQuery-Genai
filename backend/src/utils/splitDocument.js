import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const splitDocument = async (docs) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const chunks = await splitter.splitDocuments(docs);

  return chunks;
};