"use server";
import createClient from "../createClient";

const supabase = createClient();

export const fetchAvatar = async (id: string) => {
  const { data: files } = await supabase.storage.from("avatars").list(id);
  if (!files || files.length === 0) return;
  return files[0].name;
};
