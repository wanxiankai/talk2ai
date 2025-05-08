// app/api/auth/[...nextauth]/route.ts
export { GET, POST } from "@/auth"; // 从根目录的 auth.ts 导出处理器
// 这个文件非常简洁，所有逻辑都在 auth.ts 中