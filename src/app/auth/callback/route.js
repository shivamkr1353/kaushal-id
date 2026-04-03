import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  
  // Try to find the 'next' parameter for redirect after handling auth
  let next = searchParams.get('next');

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data?.user) {
      // If no explicit 'next' param, redirect based on user role
      if (!next) {
        const role = data.user.user_metadata?.role;
        switch (role) {
          case 'worker':
            next = '/worker/dashboard';
            break;
          case 'agent':
            next = '/agent/dashboard';
            break;
          case 'customer':
            next = '/customer/dashboard';
            break;
          default:
            next = '/';
        }
      }
      return NextResponse.redirect(`${origin}${next}`);
    } else {
      console.error('Auth callback error:', error?.message);
      return NextResponse.redirect(`${origin}/customer/login?error=auth_failed`);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/customer/login?error=no_code`);
}
