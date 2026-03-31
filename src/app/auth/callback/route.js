import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  
  // Try to find the 'next' parameter for redirect after handling auth
  // Fallback to origin if not found
  let next = searchParams.get('next') || '/';

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    } else {
      console.error('Auth callback error:', error.message);
      // Redirect to a generic error page or login with an error query
      return NextResponse.redirect(`${origin}/customer/login?error=auth_failed`);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/customer/login?error=no_code`);
}
