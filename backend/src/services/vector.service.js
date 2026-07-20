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

console.log("Records Length:", records.length);

if (records.length === 0) {
  throw new Error("No records generated");
}

console.log("First record:");
console.dir(records[0], { depth: null });
console.log(Array.isArray(records)); // should be true
console.log(records.length);         // should be 4
console.log(records[0].values.length); // should be 1024
 await index.upsert({
  records,
});

  return records;
};