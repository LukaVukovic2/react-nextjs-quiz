"use server";
import createClient from "../../createClient";

const supabase = createClient();

export const getUser = async () => {
  return await supabase.auth.getUser();
};
