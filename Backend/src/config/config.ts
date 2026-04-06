import dotenv from "dotenv";
dotenv.config();


export const config={
    
    geminiApiKey: process.env.GEMINI_API_KEY,
    mistralApiKey: process.env.MISTRAL_API_KEY,
    cohereApiKey: process.env.COHERE_API_KEY,
}

export default config;