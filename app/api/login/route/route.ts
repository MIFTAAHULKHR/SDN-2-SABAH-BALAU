// app/api/login/route.ts
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  const cookieStore = cookies();
  
  // Buat Klien Supabase *Server-Side*
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options) {
          cookieStore.delete({ name, ...options });
        },
      },
    }
  );

  // Coba login dengan Supabase Auth
  const { data, error } = await supabase.auth.signInWithPassword({
    email: username, // Supabase menggunakan email sebagai username
    password: password,
  });

  if (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 401 }
    );
  }

  // Jika sukses, Supabase client akan otomatis mengatur cookie
  return NextResponse.json({ success: true, message: "Login berhasil!" });
}