"use server";
import createClient from "../createClient";

export const getUser = async () => {
  const supabase = createClient();
  return await supabase.auth.getUser();
};
