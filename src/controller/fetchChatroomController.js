import { supabase } from "../db/supabaseClient.js";

export const chatroomList = async (req, res) => {
    const { session } = req.body;

    const token = session?.access_token;

    const { data: user, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user?.id) return res.status(401).json({ error: "Invalid Session" });


    const { data, error } = await supabase.from('chatroom').select('*');
    if (error) return res.status(500).json({ error: error.message });

    res.json(data);

};