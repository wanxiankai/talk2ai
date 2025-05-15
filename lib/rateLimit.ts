import { NextRequest, NextResponse } from "next/server";

interface RateLimitContext {
  ip: string;
  timestamp: number;
  requestCount: number;
}

const rateLimitMap = new Map<string, RateLimitContext>();

// 速率限制配置
const RATE_LIMIT_WINDOW = 60 * 1000; // 1分钟窗口期
const MAX_REQUESTS_PER_WINDOW = 60;  // 每个窗口期最多60个请求

export async function rateLimit(req: NextRequest) {
  // 获取请求IP (使用 Vercel 特定标头或回退到 socket 地址)
  const ip = req.headers.get('x-real-ip') || 
             req.headers.get('x-forwarded-for') || 
             '127.0.0.1';
             
  const now = Date.now();
  const currentContext = rateLimitMap.get(ip) || {
    ip,
    timestamp: now,
    requestCount: 0
  };
  
  // 如果已经过了窗口期，重置计数
  if (now - currentContext.timestamp > RATE_LIMIT_WINDOW) {
    currentContext.timestamp = now;
    currentContext.requestCount = 0;
  }
  
  // 递增请求计数
  currentContext.requestCount++;
  rateLimitMap.set(ip, currentContext);
  
  // 如果超出速率限制，返回 429 错误
  if (currentContext.requestCount > MAX_REQUESTS_PER_WINDOW) {
    return NextResponse.json(
      { error: '请求过于频繁，请稍后再试', code: 429 },
      { status: 429, headers: { 'Retry-After': '60' } }
    );
  }
  
  // 如果未超出限制，返回null表示可以继续处理请求
  return null;
}