import { supabase } from "../db/supabaseClient.js";

export const sendMessage = async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const { chatroom_id, content } = req.body;

  if (!token) return res.status(401).json({ error: 'Missing access token' });
  if (!chatroom_id || !content) return res.status(400).json({ error: 'Missing chatroom ID or message content' });

  // Attach session with access token
  const { data: session, error: authError } = await supabase.auth.setSession({
    access_token: token,
    refresh_token: 'iqgesnrce4w2'
  });
  if (authError) return res.status(401).json({ error: authError.message });

  const sender_id = session?.user?.id;
  if (!sender_id) return res.status(401).json({ error: 'Invalid session' });

  // Insert message into Messages table
  const { data, error } = await supabase
    .from('messages')
    .insert([{ chatroom_id, sender_id, content }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};