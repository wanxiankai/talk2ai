import { createClient } from '@supabase/supabase-js';

// 环境变量
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY!;

// 服务端 Supabase 客户端 (拥有完全权限，仅在服务端 API 路由中使用)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 安全的客户端 Supabase 实例 (受 RLS 保护)
export const createClientSideSupabase = () => {
  return createClient(supabaseUrl, supabaseAnonKey);
}

export default supabase;
