import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";

const geminimodel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.ASKQUERY_API_KEY
});

const mistralmodel = new ChatMistralAI({
model: "mistral-small-latest",
apikey: process.env.MISTRAL_API_KEY
});

