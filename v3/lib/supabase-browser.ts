import {createClient, type SupabaseClient} from '@supabase/supabase-js';

let client: SupabaseClient<any, any, any> | null = null;

export function getBrowserSupabase(): SupabaseClient<any, any, any> | null {
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if(!url||!key)return null;
  if(!client)client=createClient<any>(url,key);
  return client;
}
