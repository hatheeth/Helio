import { supabase } from "../db/supabaseClient.js";

export const userInfo = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const refreshToken = req.headers["x-refresh-token"];

    if (!token || !refreshToken) {
      return res.status(401).json({ success: false, error: "Missing tokens" });
    }

    // Establish session using both tokens
    const { data: session, error: authError } = await supabase.auth.setSession({
      access_token: token,
      refresh_token: refreshToken,
    });

    if (authError || !session?.user?.id) {
      return res.status(401).json({ success: false, error: "Invalid Session" });
    }


    const { data, error } = await supabase
      .from("users")
      .select("username, profile_url, email, available, bio");

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const refreshToken = req.headers["x-refresh-token"];
    const newUpdate = req.body;

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

    const { data, error } = await supabase.from('users')
    .update(newUpdate)
    .eq("id", session?.user.id)
    .select("username, profile_url, email, available, bio");

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.json(data);
  }
  catch (err) {
    res.status(500).json({ success: "false", error: err.message });
  }
};
