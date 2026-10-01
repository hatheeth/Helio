import { supabase } from "../db/supabaseClient.js";

export const chatroomList = async (req, res) => {

    const token = req.headers.authorization?.replace('Bearer ', '');

    const { data: user, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user?.id) return res.status(401).json({ error: "Invalid Session" });


    const { data, error } = await supabase.from('chatroom').select('*');
    if (error) return res.status(500).json({ error: error.message });


    const chatroomWithUserInfo = await Promise.all(
        data.map(async (room) => {
            const otherUserId = room.user_one_id === user.id ? room.user_two_id : room.user_one_id;

            // Fetch other user's info from users table
            const { data: otherUser, error: userError } = await supabase
                .from("users")
                .select("id, username, email, profile_url") // choose fields you need
                .eq("id", otherUserId)
                .single();

            if (userError) {
                return { ...room, other_user_id: otherUserId, other_user: null };
            }

            return { ...room, other_user_id: otherUserId, other_user: otherUser };

        })
    );

    res.json(chatroomWithUserInfo);


};