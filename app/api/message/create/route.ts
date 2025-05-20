import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
    // 在生产构建阶段跳过数据库操作
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
        return NextResponse.json({ code: 0, data: { message: {} } });
    }

    try {

        const session = await getServerSession(authOptions);
        if (!session || !session.user || !(session.user as any).id) {
            return NextResponse.json({ error: '未授权' }, { status: 401 });
        }
        const userId = (session.user as any).id;

        const body = await request.json();
        const { chatId, content, role } = body;
        if (!chatId || !content) {
            return NextResponse.json({ code: -1, message: '缺少聊天ID或内容' }, { status: 400 });
        }
        // 首先验证该聊天是否属于当前用户
        const chat = await prisma.chat.findFirst({
            where: {
                id: chatId,
                userId: userId
            },
            select: { id: true }
        });
        if (!chat) {
            return NextResponse.json({ code: -1, message: '无权访问该聊天' }, { status: 403 });
        }
        // 创建消息
        await prisma.message.create({
            data: {
                content,
                chatId,
                role,
            }
        });
        // 更新聊天的最后更新时间
        await prisma.chat.update({
            where: {
                id: chatId,
                userId: userId // 修正字段名从 userid 改为 userId
            },
            data: {
                updateTime: new Date()
            }
        });
        // 这里可以选择返回创建的消息，或者其他需要的信息

        return NextResponse.json({ code: 0, data: {} });
    } catch (error) {
        console.error('更新/创建消息时出错:', error);
        return NextResponse.json({
            code: 1,
            message: '更新消息失败',
            error: process.env.NODE_ENV === 'development' ? String(error) : undefined
        }, { status: 500 });
    }
}