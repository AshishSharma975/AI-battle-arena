import { ChatGoogle } from "@langchain/google";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatCohere} from "@langchain/cohere";
import config from "../config/config.js";

const GeminiModel = new ChatGoogle({
  model: "gemini-flash-latest",
  maxOutputTokens: 2048,
  temperature: 0.7,
  apiKey: config.geminiApiKey as string,
});


const MistralModel = new ChatMistralAI({
    model: "mistral-medium-latest",
    maxTokens: 2048,
    temperature: 0.7,
    apiKey: config.mistralApiKey as string,
});


const CohereModel = new ChatCohere({
    model: "command-a-03-2025",
    temperature: 0.7,
    apiKey: config.cohereApiKey as string,
});

export { GeminiModel, MistralModel, CohereModel };