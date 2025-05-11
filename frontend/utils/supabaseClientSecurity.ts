import { createClient } from '@supabase/supabase-js';
import { getAuth } from 'firebase/auth';

const supabaseUrl = 'https://toftjigqmztqnhhdbfxs.supabase.co';


export const getSupabaseWithAuth = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const token = await user.getIdToken();

  const supabase = createClient(supabaseUrl, '', {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  return supabase;
};
