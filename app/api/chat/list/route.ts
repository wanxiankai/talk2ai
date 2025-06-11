import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
    // 在生产构建阶段跳过数据库操作
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
        return NextResponse.json({ code: 0, data: { list: [], hasMore: false } });
    }

    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !(session.user as { id: string }).id) {
            return NextResponse.json({ error: '未授权' }, { status: 401 });
        }
        const userId = (session.user as { id: string }).id;

        const param = request.nextUrl.searchParams.get('page')
        const page = param ? parseInt(param) : 1;

        console.log(`[Chat List API] 用户ID: ${userId}, 请求页码: ${page}`);

        const list = await prisma.chat.findMany({
            where: {
                userId: userId, // 使用正确的字段名
            },
            skip: (page - 1) * 20,
            take: 20,
            orderBy: {
                updateTime: "desc"
            }
        });

        console.log(`[Chat List API] 成功获取到 ${list.length} 条聊天记录`);

        const count = await prisma.chat.count({
            where: {
                userId: userId,
            }
        });

        const hasMore = count > page * 20;
        return new NextResponse(
            JSON.stringify({ code: 0, data: { list, hasMore } }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-store, no-cache, must-revalidate",
                    "Pragma": "no-cache",
                    "Expires": "0",
                },
            }
        );
    } catch (error) {
        // 提供详细的错误信息，帮助诊断问题
        console.error('[Chat List API] 错误详情:', error);

        // 返回更有用的错误信息
        return NextResponse.json({
            code: 1,
            message: '获取聊天列表失败',
            error: process.env.NODE_ENV === 'development' ? String(error) : undefined
        }, { status: 500 });
    }
}