"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "../../supabase/server";

export const updateUserData = async (data: FormData) => {
  const supabase = await createClient();

  const username = data.get("username") as string;
  const avatar = data.get("avatar") as File;
  const id = data.get("id") as string;

  if (!username || !id) return false;
  let avatar_url = null;

  if (avatar && avatar instanceof File && avatar.name !== "undefined") {
    const avatar_path = `${id}/${avatar.name}`;
    deletePreviousAvatar(id);

    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(avatar_path, avatar, {
        cacheControl: "3600",
        upsert: true,
        contentType: avatar.type
      });

    if (error) return false;
    avatar_url = process.env.AVATAR_BASE_URL + data.path;
  }

  const { error: errorUserData } = await supabase.rpc("update_user", {
    user_id: id,
    uname: username,
    avatar_url
  });

  if (errorUserData) return false;
  revalidatePath(`/my-profile`);
  return true;
}

const deletePreviousAvatar = async (id: string) => {
  const supabase = await createClient();
  const { data: files, error: listError } = await supabase.storage
    .from("avatars")
    .list(id);
  if (listError) return false;

  if (files && files.length > 0) {
    const filePaths = files.map((file: { name: string }) => `${id}/${file.name}`);
    const { error: removeError } = await supabase.storage
      .from("avatars")
      .remove(filePaths);
    if (removeError) return false;
  }
};