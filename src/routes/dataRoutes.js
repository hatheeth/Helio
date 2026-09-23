import express from 'express';
import { supabase } from '../db/supabaseClient.js';

const router = express.Router();

router.get('/data', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  

  if (!token) {
    return res.status(401).json({ error: 'Missing access token' });
  }

  
  const { data: session, error: authError } = await supabase.auth.setSession({
    access_token: token,
    refresh_token: 'burp4yypi5lr'
  });

  if (authError) {
    return res.status(401).json({ error: authError.message });
  }

  // Query with RLS enforced
  const { data, error } = await supabase.from('users').select('*');

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});


export default router;
