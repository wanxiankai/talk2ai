import { GoogleGenAI } from "@google/genai";

const geminiai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY
});

export default geminiai;