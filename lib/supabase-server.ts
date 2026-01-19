import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component এ set করা যায় না, তাই ignore করা হচ্ছে
          }
        },
      },
    }
  );
}

// বর্তমান ইউজার চেক করা
export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// অ্যাডমিন চেক করা
export async function isAdmin() {
  const user = await getCurrentUser();
  return !!user; // লগইন থাকলে অ্যাডমিন হিসেবে ধরব (আপাতত)
}