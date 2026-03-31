import { createClient } from '@/lib/supabase/middleware';

export async function middleware(request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  // Skip if credentials not configured
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your_supabase')) {
    const { NextResponse } = await import('next/server');
    return NextResponse.next({ request });
  }

  try {
    const { supabase, response } = createClient(request);
    await supabase.auth.getUser();
    return response;
  } catch {
    const { NextResponse } = await import('next/server');
    return NextResponse.next({ request });
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
