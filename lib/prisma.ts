// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// 防止在开发环境中因热重载创建多个 PrismaClient 实例
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;