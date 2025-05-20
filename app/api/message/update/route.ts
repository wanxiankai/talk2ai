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
        const { chatId, content } = body;
        let res = await prisma.chat.create({
            data: {
                content
            },
            where: {
                chatId,
                userId: userId // 修正字段名从 userid 改为 userId
            }
        });

        console.log('update message', res);

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