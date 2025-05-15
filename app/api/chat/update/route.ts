import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
    // 在生产构建阶段跳过数据库操作
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
        return NextResponse.json({ code: 0 });
    }
    
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
        return NextResponse.json({ error: '未授权' }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const body = await request.json();
    const { id, ...data } = body;
    
    try {
        await prisma.chat.update({
            data,
            where: { id, userId: userId }  // 修正字段名从 userid 改为 userId
        });
        
        return NextResponse.json({ code: 0 });
    } catch (error) {
        console.error('Error updating chat:', error);
        return NextResponse.json({ code: 1, message: '更新聊天失败' }, { status: 500 });
    }
}