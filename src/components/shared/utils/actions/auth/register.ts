"use server";
import { FieldValues } from "react-hook-form";
import { createClient } from "../../supabase/server";

export const register = async (user: FieldValues) => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: user.email,
    password: user.password,
    options: {
      data: {
        username: user.username
      }
    }
  });
  if (error) {
    console.error("Error signing up new user:", error.message);
    return { error: error.message };
  }
  if (!data || !data.user || !data.user.identities || data.user.identities.length === 0) {
    return null;
  }

  return { user: data.user, session: data.session };
};
