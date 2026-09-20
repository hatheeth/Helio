import { supabase } from '../db/supabaseClient.js';

export const signup = async (req, res) => {
  const { email, password, username } = req.body;

  // Step 1: Create account in Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username } 
    }
  });

  if (error) return res.status(400).json({ error: error.message });

  const user = data.user;

  
  const { error: insertError } = await supabase
    .from('users')
    .insert([
      {
        id: user.id,              // UUID from auth.users
        email: user.email,        // email
        username: username        // custom field
      }
    ]);

  if (insertError) return res.status(400).json({ error: insertError.message });

  res.json({ user });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(400).json({ error: error.message });

  res.json({ session: data.session });
};
