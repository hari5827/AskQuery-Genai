import { ChatMistralAI } from "@langchain/mistralai";
import { buildPrompt } from "../utils/prompt.js";

const model = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

export const generateAnswer = async (context, question) => {
  const prompt = buildPrompt(context, question);

  const response = await model.invoke(prompt);

  return response.content;
};

// Same as generateAnswer, but calls onToken(chunk) as text is generated
// instead of waiting for the full answer - used by the SSE endpoint.
export const streamAnswer = async (context, question, onToken = () => {}) => {
  const prompt = buildPrompt(context, question);

  let fullText = "";
  const stream = await model.stream(prompt);

  for await (const chunk of stream) {
    const token = chunk?.content;
    if (typeof token === "string" && token.length > 0) {
      fullText += token;
      onToken(token);
    }
  }

  return fullText;
};