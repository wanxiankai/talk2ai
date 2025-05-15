import { getUserPrisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    const { prisma } = await getUserPrisma();
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
        return NextResponse.json({ code: -1 })
    }
    await prisma.message.delete({
        where: { id }
    })
    return NextResponse.json({ code: 0 })
}