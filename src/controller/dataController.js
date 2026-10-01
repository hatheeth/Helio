import { supabase } from "../db/supabaseClient.js";

export const userInfo = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ success: false, error: "Missing access token" });
    }

    const { data: user, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user?.id) {
      return res.status(401).json({ success: false, error: "Invalid Session" });
    }

    const { data, error } = await supabase.from("users").select("username, profile_url, email");
    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
