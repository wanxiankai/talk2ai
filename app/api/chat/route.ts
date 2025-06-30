import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { NextRequest, NextResponse } from 'next/server';
import { MessageRequestBody } from '@/types/chat';

// 初始化默认的 AI 提供商实例
// 默认情况下，它们会自动从环境变量中读取 API 密钥
// (OPENAI_API_KEY, GOOGLE_API_KEY)
const defaultOpenAI = createOpenAI();
const defaultGoogle = createGoogleGenerativeAI(
    {
        apiKey: process.env.GOOGLE_API_KEY,
    }
);

// Groq 也使用与 OpenAI 兼容的 API，我们可以为其创建一个单独的实例
const groq = createOpenAI({
    baseURL: 'https://api.x.ai/v1',
    apiKey: process.env.GROK_API_KEY,
});

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const { messages, model, apiKey } = (await req.json()) as MessageRequestBody & { apiKey?: string };

        let provider;
        let chatModel;

        // 根据模型名称选择提供商和模型
        switch (true) {
            case model.startsWith('gpt-'):
                // 如果用户提供了自定义 API Key，则创建一个新的实例
                provider = apiKey ? createOpenAI({ apiKey }) : defaultOpenAI;
                chatModel = provider(model);
                break;

            case model.startsWith('grok-'): // Groq 的模型通常不以 'grok-' 开头，但我们遵循现有逻辑
                // Grok 需要自己的 API Key
                provider = apiKey ? createOpenAI({ baseURL: 'https://api.groq.com/openai/v1', apiKey }) : groq;
                // 注意：您需要传递 Grok 支持的实际模型名称，例如 'llama3-8b-8192'
                // 这里我们假设前端传递的 'grok-...' 只是一个标识符，实际模型名是固定的或另外传递
                chatModel = provider(model); // 示例模型，请替换为实际模型
                break;

            case model.startsWith('gemini-'):
                provider = apiKey ? createGoogleGenerativeAI({ apiKey }) : defaultGoogle;
                chatModel = provider(model, {
                    safetySettings: [
                        {
                            category: 'HARM_CATEGORY_HARASSMENT',
                            threshold: 'BLOCK_NONE',
                        },
                        {
                            category: 'HARM_CATEGORY_HATE_SPEECH',
                            threshold: 'BLOCK_NONE',
                        },
                        {
                            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                            threshold: 'BLOCK_NONE',
                        },
                        {
                            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                            threshold: 'BLOCK_NONE',
                        },
                    ],
                });
                break;

            default:
                return NextResponse.json({ error: `Model ${model} not supported.` }, { status: 400 });
        }

        const mappedMessages = messages.map(message => ({
            role: message.role as 'user' | 'assistant',
            content: message.content,
        }));

        console.log("Messages sent to model:", JSON.stringify(mappedMessages, null, 2));

        // 使用统一的 streamText API 调用模型
        const result = await streamText({
            model: chatModel,
            // 👇 **这里是关键修改**
            // 将您的 messages 数组映射为 AI SDK 可接受的格式
            // 我们明确告诉 TypeScript，role 只会是 'user' 或 'assistant'
            messages: mappedMessages,
            temperature: 0.7,
        });

        // 将结果直接转换为流式响应
        return result.toDataStreamResponse();

    } catch (error) {
        console.error("[Chat API] Error:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ error: "Internal Server Error", details: errorMessage }, { status: 500 });
    }
}