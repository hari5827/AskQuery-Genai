import { Pinecone } from "@pinecone-database/pinecone";

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});
console.log("Using Pinecone index: askquery");
export const index = pc.index("askquery");