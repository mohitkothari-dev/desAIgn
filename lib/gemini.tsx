import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Renaming variable to force refresh in case of stale cache
console.log("Loading Gemini Model configuration...");
export const activeGeminiModel = google('gemini-3-flash-preview'); // Using 2.0-flash as it is more standard than 2.5