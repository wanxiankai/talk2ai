import { getUserPrisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    // 在生产构建阶段跳过数据库操作
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
        return NextResponse.json({ code: 0, data: { message: {} } });
    }
    
    try {
        const { prisma, userId } = await getUserPrisma();
        const body = await request.json();
        const { id, ...data } = body;
        
        if (!data.chatId) {
            // 创建新聊天，使用 connect 关联到已存在的用户
            const chat = await prisma.chat.create({
                data: {
                    title: '新对话',
                    user: {
                        // 连接到已经存在的用户
                        connect: {
                            id: userId
                        }
                    }
                }
            });
            data.chatId = chat.id;
        } else {
            await prisma.chat.update({
                data: {
                    updateTime: new Date()
                },
                where: {
                    id: data.chatId,
                    userId: userId // 修正字段名从 userid 改为 userId
                }
            });
        }
        
        let message = await prisma.message.upsert({
            create: data,
            update: data,
            where: { id }
        });

        return NextResponse.json({ code: 0, data: { message } });
    } catch (error) {
        console.error('更新/创建消息时出错:', error);
        return NextResponse.json({ 
            code: 1, 
            message: '更新消息失败', 
            error: process.env.NODE_ENV === 'development' ? String(error) : undefined 
        }, { status: 500 });
    }
}