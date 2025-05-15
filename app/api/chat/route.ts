import geminiai from "@/lib/gemini";
import { rateLimit } from "@/lib/rateLimit";
import openaiClient from "@/lib/openai";
import { Message, MessageRequestBody } from "@/types/chat";
import { NextRequest, NextResponse } from "next/server";

interface ModelStreamer {
    formatMessages: (messages: Message[]) => any[];
    callApi: (formattedMessages: any[], model: string) => Promise<any>;
    extractText: (chunk: any) => string;
}

const modelStreamers: Record<string, ModelStreamer> = {
    'gemini-2.0-flash': {
        formatMessages: (messages) => {
            // 为 Gemini 重构消息格式化逻辑
            // Gemini 要求消息按照一定的顺序排列，且 role 只能是 'user' 或 'model'
            const formattedMessages = [];

            for (const message of messages) {
                const role = message.role === 'user' ? 'user' : 'model';
                // 确保内容不为空
                const content = message.content?.trim() || " "; // Use a space if content is empty

                formattedMessages.push({
                    role,
                    parts: [{ text: content }]
                });
            }

            // 检查第一条消息是否来自用户，Gemini 要求对话必须由用户开始
            if (formattedMessages.length > 0 && formattedMessages[0].role !== 'user') {
                // 如果第一条消息不是用户发送的，添加一个空白用户消息
                formattedMessages.unshift({
                    role: 'user',
                    parts: [{ text: " " }] // Use a space instead of "Hello"
                });
            }

            // 检查消息数组长度，并确保 user 和 model 消息交替出现
            const validatedMessages = [];
            let lastRole = null;

            for (const message of formattedMessages) {
                if (message.role !== lastRole) {
                    validatedMessages.push(message);
                    lastRole = message.role;
                } else {
                    // 如果连续出现相同角色的消息，合并其内容
                    const lastMessage = validatedMessages[validatedMessages.length - 1];
                    if (lastMessage && lastMessage.parts && message.parts) {
                        // Ensure parts[0] exists before accessing text
                        if (lastMessage.parts[0] && message.parts[0]) {
                           lastMessage.parts[0].text += "\n" + message.parts[0].text;
                        } else if (message.parts[0]) {
                            // Handle case where lastMessage might not have parts[0] initially (though unlikely with current logic)
                            lastMessage.parts = [{ text: message.parts[0].text }];
                        }
                    }
                }
            }

            // 确保最后一条消息是用户发送的 (Gemini API requirement for some methods)
            // Although generateContentStream might not strictly require it, it's good practice
            if (validatedMessages.length > 0 && validatedMessages[validatedMessages.length - 1].role !== 'user') {
                 validatedMessages.push({ role: 'user', parts: [{ text: " " }] }); // Add a dummy user message if needed
                 console.log('[Gemini API] 添加了末尾的虚拟用户消息以满足API要求');
            }


            console.log(`[Gemini API] 格式化后的消息数: ${validatedMessages.length}`);
            // Log the final structure being sent (optional, for debugging)
            // console.log('[Gemini API] Final formatted messages:', JSON.stringify(validatedMessages, null, 2));
            return validatedMessages;
        },
        callApi: async (formattedMessages, model) => {
            console.log(`[Gemini API] 调用模型: ${model} 消息数: ${formattedMessages.length}`);
            try {
                // 添加安全检查，确保有足够的消息进行对话
                if (formattedMessages.length === 0) {
                    throw new Error('消息列表为空');
                }

                // 使用 @google/genai 的方式调用 API
                // 注意：@google/genai SDK 的结构可能与 @google/generative-ai 不同
                // 它似乎直接在 GoogleGenAI 实例上操作，而不是先获取 model 实例

                // 添加日志以查看具体的请求内容
                // console.log('[Gemini API] 请求内容样例:', JSON.stringify(formattedMessages[0], null, 2));

                // 直接使用 geminiai 实例调用 generateContentStream
                // 传递 model 名称和 contents
                return await geminiai.models.generateContentStream({
                    model: model, // Pass the model name string directly
                    contents: formattedMessages,
                });

            } catch (error) {
                console.error('[Gemini API] 调用失败:', error);
                // Rethrow the error to be caught by the outer try...catch in POST
                throw error;
            }
        },
        extractText: (chunk) => {
            try {
                // 更安全的提取文本方法
                if (!chunk) return ""; // Return empty string instead of null

                // Log chunk structure occasionally for debugging intermittent issues
                // if (Math.random() < 0.1) { // Log ~10% of chunks
                //    console.log('[Gemini API] 收到块:', JSON.stringify(chunk, null, 2));
                // }

                // Check for potential safety blocks or finish reasons
                if (chunk.candidates && chunk.candidates[0]?.finishReason && chunk.candidates[0].finishReason !== "STOP") {
                    console.warn(`[Gemini API] 流提前终止，原因: ${chunk.candidates[0].finishReason}`);
                    // Optionally return a message indicating the stop reason
                    // return `\n[系统消息: 生成因 ${chunk.candidates[0].finishReason} 中断]`;
                    return ""; // Or just stop sending more text
                }

                // Standard text extraction
                const text = chunk?.candidates?.[0]?.content?.parts?.[0]?.text;

                // Return text if found, otherwise empty string
                return text || "";

            } catch (error) {
                console.error('[Gemini API] 提取文本出错:', error, '块:', JSON.stringify(chunk));
                return ""; // Return empty string on error
            }
        }
    },
    'grok-2-vision-1212': {
        formatMessages: (messages) => messages.map(message => ({
            role: message.role,
            content: message.content,
        })),
        callApi: async (formattedMessages, model) => {
            const completion = await openaiClient.chat.completions.create({
                model,
                messages: formattedMessages,
                stream: true,
                temperature: 0.7,
            });
            // The OpenAI SDK returns an AsyncIterable stream
            return completion;
        },
        extractText: (chunk) => chunk.choices?.[0]?.delta?.content // OpenAI chunk structure
    },
};

export async function POST(request: NextRequest) {
    // ... (rate limiting, body parsing, model check remain the same) ...
    console.log('[Chat API] 接收到聊天请求');
    // 应用速率限制
    const rateLimitResult = await rateLimit(request);
    if (rateLimitResult) {
        console.log('[Chat API] 请求被速率限制');
        return rateLimitResult;
    }

    let parsedBody;
    try {
        parsedBody = await request.json();
        console.log(`[Chat API] 请求模型: ${parsedBody.model}, 消息数: ${parsedBody.messages?.length || 0}`);
    } catch (error) {
        console.error('[Chat API] 解析请求体失败:', error);
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { messages, model } = parsedBody as MessageRequestBody;

    // 验证必要的请求字段
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        console.error('[Chat API] 缺少消息内容或格式错误');
        return NextResponse.json({ error: "Messages are required and must be an array" }, { status: 400 });
    }

    if (!model) {
        console.error('[Chat API] 缺少模型名称');
        return NextResponse.json({ error: "Model is required" }, { status: 400 });
    }


    const encoder = new TextEncoder();
    const streamer = modelStreamers[model];

    if (!streamer) {
        console.error(`[Chat API] 不支持的模型: ${model}`);
        return NextResponse.json({ error: `Model ${model} not supported.` }, { status: 400 });
    }


    try {
        console.log('[Chat API] 格式化消息');
        const formattedMessages = streamer.formatMessages(messages);

        // Handle non-streaming requests (remains the same)
        if (request.headers.get('accept') !== 'text/event-stream') {
           // ... non-streaming logic ...
            console.log('[Chat API] 使用非流式响应');
            try {
                const apiResponseStream = await streamer.callApi(formattedMessages, model);
                let fullResponse = '';

                for await (const chunk of apiResponseStream) {
                    const text = streamer.extractText(chunk);
                    // Ensure text is not null/undefined before appending
                    if (text) {
                        fullResponse += text;
                    }
                }

                return NextResponse.json({ response: fullResponse });
            } catch (error) {
                console.error('[Chat API] 非流式响应处理错误:', error);
                return NextResponse.json({
                    error: "Error generating response",
                    details: error instanceof Error ? error.message : String(error)
                }, { status: 500 });
            }
        }

        console.log('[Chat API] 创建流式响应');
        const stream = new ReadableStream({
            async start(controller) {
                let streamClosed = false; // Flag to prevent operations after close
                const closeStream = () => {
                    if (!streamClosed) {
                        console.log('[Chat API] 响应完成或出错，关闭流');
                        try {
                           controller.close();
                        } catch (e) {
                            console.error("[Chat API] 关闭流时出错:", e);
                        }
                        streamClosed = true;
                    }
                };

                const enqueueError = (message: string) => {
                     if (!streamClosed) {
                        try {
                            controller.enqueue(encoder.encode(`\n[系统错误: ${message}]\n`));
                        } catch (e) {
                            console.error("[Chat API] 发送错误消息到流时出错:", e);
                        }
                     }
                }

                try {
                    console.log('[Chat API] 开始调用 AI 模型 API');
                    const apiResponseStream = await streamer.callApi(formattedMessages, model);

                    console.log('[Chat API] 开始处理模型响应流');
                    for await (const chunk of apiResponseStream) {
                        if (streamClosed) break; // Stop processing if stream was closed due to error

                        try {
                            const text = streamer.extractText(chunk);
                            // Only enqueue if text is non-empty
                            if (text) {
                                // console.log(`[Chat API] 收到响应片段: ${text.substring(0, 20)}${text.length > 20 ? '...' : ''}`);
                                controller.enqueue(encoder.encode(text));
                            }
                        } catch (chunkError) {
                            // Catch errors specifically from extractText or enqueue
                            console.error('[Chat API] 处理单个块时出错:', chunkError);
                            enqueueError("处理响应片段时出错");
                            // Decide whether to break or continue processing next chunk
                            // For now, let's break to prevent further issues
                            break;
                        }
                    }
                } catch (apiError) {
                    // Catch errors from callApi or the stream iteration itself
                    console.error(`[Chat API] 流处理或API调用错误:`, apiError);
                    enqueueError(apiError instanceof Error ? apiError.message : "未知流错误");
                } finally {
                    // Ensure the stream is always closed
                    closeStream();
                }
            }
        });

        console.log('[Chat API] 返回流式响应');
        return new Response(stream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache, no-transform", // Ensure no intermediate caching/transform
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no" // Disable buffering in nginx-like proxies
            },
        });

    } catch (error) {
        // Catch errors from formatting messages or initial setup
        console.error("[Chat API] 处理聊天请求时发生顶层错误:", error);
        return NextResponse.json({
            error: "Internal server error processing chat request.",
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}