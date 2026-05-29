import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';
import { logger } from './logger.js';

// Cliente Supabase para operaciones del servidor (con service role key)
const supabaseAdmin = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Cliente Supabase anónimo para operaciones del cliente (si es necesario)
const supabaseClient = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  }
);

// Test connection
export async function testSupabaseConnection() {
  try {
    const { error } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1);

    if (error) {
      logger.error('Supabase connection failed:', error);
      return false;
    }

    logger.info('✅ Supabase connected successfully');
    return true;
  } catch (error) {
    logger.error('Supabase connection error:', error);
    return false;
  }
}

export { supabaseAdmin, supabaseClient };
