import { index } from "../config/pinecone.js";

export const storeVectors = async (vectors, chunks, filename) => {
  const records = vectors.map((vector, i) => ({
    id: `${filename}-${i}`,

    values: vector,

    metadata: {
      text: chunks[i].pageContent,
      page: chunks[i].metadata.loc.pageNumber,
      source: filename,
    },
  }));
  console.log("Vectors:", vectors.length);
console.log("Chunks:", chunks.length);
console.log(records);
  await index.upsert(records);

  return records.length;
};