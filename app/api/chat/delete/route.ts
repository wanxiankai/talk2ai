import { getUserPrisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
    // 在生产构建阶段跳过数据库操作
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
        return NextResponse.json({ code: 0 });
    }
    
    const { prisma, userId } = await getUserPrisma();
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
        return NextResponse.json({ code: -1, message: '缺少聊天ID' });
    }
    
    try {
        // No need to delete messages manually due to onDelete: Cascade
        await prisma.chat.delete({
            where: { 
                id, 
                userId: userId  // 修正字段名从 userid 改为 userId
            }
        });
        
        return NextResponse.json({ code: 0 });
    } catch (error) {
        console.error('Error deleting chat:', error);
        return NextResponse.json({ code: 1, message: '删除聊天失败' }, { status: 500 });
    }
}