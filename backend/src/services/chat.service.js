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