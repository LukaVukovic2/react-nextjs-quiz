"use server";
import { createClient } from "../../supabase/server";

export const getUser = async () => {
  const supabase = await createClient();
  return await supabase.auth.getUser();
};
