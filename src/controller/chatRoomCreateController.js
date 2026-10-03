import { supabase } from "../db/supabaseClient.js";

export const createChat = async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const refreshToken = req.headers["x-refresh-token"];
  const { username } = req.body;

  if (!token) return res.status(401).json({ error: "Missing access token" });
  if (!username) return res.status(400).json({ error: "Missing username" });

  // Set session
  const { data: session, error: authError } = await supabase.auth.setSession({
    access_token: token,
    refresh_token: refreshToken,
  });

  if (authError) return res.status(401).json({ error: authError.message });

  // Current user
  const user_one_id = session?.user?.id;
  if (!user_one_id) return res.status(401).json({ error: "Invalid session" });

  // Lookup second user by username
  const { data: userTwoid, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("username", username)
    .single();

  if (userError || !userTwo) {
    return res.status(404).json({ error: "User not found" });
  }

  const user_two_id = userTwoid.id;

  // Ensure consistent ordering (optional, avoids duplicate chatrooms)
  const userOne = user_one_id < user_two_id ? user_one_id : user_two_id;
  const userTwo = user_one_id < user_two_id ? user_two_id : user_one_id;

  // Insert chatroom
  const { data, error } = await supabase
    .from("chatroom")
    .insert([{ user_one_id: userOne, user_two_id: userTwo }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};
