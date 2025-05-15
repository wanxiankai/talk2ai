import OpenAI from "openai";

const openaiClient = new OpenAI({
    apiKey: process.env.GROK_API_KEY,
    baseURL: process.env.GROK_BASE_URL,
    timeout: 60000, // 添加60秒超时
    maxRetries: 3   // 添加自动重试
});

export default openaiClient;