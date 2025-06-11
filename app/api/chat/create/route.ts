import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !(session.user as { id: string }).id) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;

  try {
    const { title, model } = await req.json();
    const newChat = await prisma.chat.create({
      data: {
        title: title || "新聊天", // 如果没有提供标题，则使用默认值
        model,
        user: {
          // 连接到已经存在的用户
          connect: {
            id: userId
          }
        }
      },
    });
    return NextResponse.json({ code: 0, data: { chatId: newChat.id } });
  } catch (error) {
    console.error("创建聊天失败:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: '无效的请求体' }, { status: 400 });
    }
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 });
  }
}
