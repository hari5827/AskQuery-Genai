import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { createAgent } from "langchain";
import * as z from "zod";
import { searchInternet } from "./internet.service.js";
import messageModel from "../models/message.model.js";
import chatModel from "../models/chat.model.js";

const geminimodel = new ChatGoogleGenerativeAI({
  model: "gemini-3.1-flash-lite",
  apiKey: process.env.ASKQUERY_API_KEY
});

const mistralmodel = new ChatMistralAI({
  model: "mistral-small-latest",
  apikey: process.env.MISTRAL_API_KEY
});

const searchInternetTool = tool(
  searchInternet,
  {
    name: "searchInternet",
    description: "Use this tool to get the latest information from the internet.",
    schema: z.object({
      query: z.string().describe("The search query to look up on the internet.")
    })
  }
);

export async function generateResponse(messages, webSearchEnabled = false, userId = null) {
  console.log(messages);

  const tools = [];

  if (webSearchEnabled) {
    tools.push(searchInternetTool);
  }

  if (userId) {
    const searchMemoryTool = tool(
      async ({ query }) => {
        const userChats = await chatModel.find({ user: userId }).select("_id");
        const chatIds = userChats.map((c) => c._id);

        const results = await messageModel
          .find({
            chat: { $in: chatIds },
            content: { $regex: query, $options: "i" },
          })
          .sort({ createdAt: -1 })
          .limit(10);

        if (!results.length) return "No matching past conversations found.";

        return JSON.stringify(
          results.map((m) => ({
            role: m.role,
            content: m.content,
            date: m.createdAt,
          }))
        );
      },
      {
        name: "searchChatHistory",
        description:
          "Search the user's past conversations to check whether something was discussed before. Use this when the user asks things like 'did I ask about X before' or 'have we discussed Y'.",
        schema: z.object({
          query: z.string().describe("Keywords to search for in past messages"),
        }),
      }
    );
    tools.push(searchMemoryTool);
  }

  const baseMessages = [
    new SystemMessage(`
      You are a helpful and precise assistant for answering questions.
      If you don't know the answer, say you don't know.
      If the question requires up-to-date information, use the "searchInternet" tool to get the latest information from the internet and then answer based on the search results.
      If the question is about something the user may have asked before, use the "searchChatHistory" tool before answering.
    `),
    ...messages.map((msg) => {
      if (msg.role == "user") {
        return new HumanMessage(msg.content);
      } else if (msg.role == "ai") {
        return new AIMessage(msg.content);
      }
    }),
  ];

  if (tools.length === 0) {
    const response = await mistralmodel.invoke(baseMessages);
    return response.text;
  }

  const agent = createAgent({
    model: mistralmodel,
    tools,
  });

  const response = await agent.invoke({ messages: baseMessages });
  return response.messages[response.messages.length - 1].text;
}

export async function generateChatTitle(message) {

  const response = await mistralmodel.invoke([
    new SystemMessage(`
      You are a helpful assistant that generates concise and descriptive titles for chat conversations.

      User will provide you with the first message of a chat conversation, and you will generate a title that captures the essence of the conversation in 2-4 words.
      The title should be clear, relevant, and engaging, giving users a quick understanding of the chat's topic.
    `),
    new HumanMessage(`
      Generate a title for a chat conversation based on the following first message:
      "${message}"
    `)
  ]);

  return response.text;
}