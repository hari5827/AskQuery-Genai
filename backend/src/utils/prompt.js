export const buildPrompt = (context, question) => {
  return `
You are a helpful AI assistant.

Answer the user's question ONLY using the provided context.

If the answer is not present in the context, say:
"I couldn't find that information in the uploaded document."

Context:
${context}

Question:
${question}

Answer:
`;
};