import { supabase } from "../db/supabaseClient.js";

export const createChat = async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const {user_two_id} = req.body;

    if (!token) return res.status(401).json({ error: 'Missing access token' });
  if (!user_two_id) return res.status(400).json({ error: 'Missing second user ID' })

    const { data: session, error: authError } = await supabase.auth.setSession({
    access_token: token,
    refresh_token: 'burp4yypi5lr'
  });
  if (authError) return res.status(401).json({ error: authError.message });

  // Get current user UUID from session
  const user_one_id = session?.user?.id;
  if (!user_one_id) return res.status(401).json({ error: 'Invalid session' });

  // Insert chatroom
  const { data, error } = await supabase
    .from('chatroom')
    .insert([{ user_one_id, user_two_id }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};