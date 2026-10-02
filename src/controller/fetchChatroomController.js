import { supabase } from "../db/supabaseClient.js";

export const chatroomList = async (req, res) => {

    const token = req.headers.authorization?.replace('Bearer ', '');
    const refreshToken = req.headers["x-refresh-token"];

     if (!token || !refreshToken) {
      return res.status(401).json({ success: false, error: "Missing tokens" });
    }


    const { data: session, error: authError } = await supabase.auth.setSession({
      access_token: token,
      refresh_token: refreshToken,
    });

    if (authError || !session?.user?.id) {
      return res.status(401).json({ success: false, error: "Invalid Session" });    
    }


    const { data, error } = await supabase.from('chatroom').select('*');
    if (error) return res.status(500).json({ error: error.message });


    const chatroomWithUserInfo = await Promise.all(
        data.map(async (room) => {
            const otherUserId = room.user_one_id === session.user.id ? room.user_two_id : room.user_one_id;


            // Fetch other user's info from users table
            const { data: otherUser, error: userError } = await supabase
                .from("users")
                .select("id, username, email, profile_url")
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