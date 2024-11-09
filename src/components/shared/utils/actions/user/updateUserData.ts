"use server";
import { revalidatePath } from "next/cache";
import createClient from "../../createClient";

const supabase = createClient();

export const updateUserData = async (changes: FormData) => {
  const username = changes.get("username") as string;
  const avatar = changes.get("avatar") as File;
  const id = changes.get("id") as string;

  try {
    if (!username || !id) {
      throw new Error("Incomplete data");
    }
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

      if (error) {
        throw error;
      }
      avatar_url = process.env.AVATAR_BASE_URL + data.path;
    }

    const { error: errorUserData } = await supabase.rpc("update_user", {
      user_id: id,
      uname: username,
      avatar_url
    });

    if (errorUserData) {
      throw errorUserData;
    }
    revalidatePath(`/my-profile`);
    return true;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return false;
  }
};

const deletePreviousAvatar = async (id: string) => {
  const { data: files, error: listError } = await supabase.storage
    .from("avatars")
    .list(id);
  if (listError) {
    throw listError;
  }

  if (files && files.length > 0) {
    const filePaths = files.map((file) => `${id}/${file.name}`);
    const { error: removeError } = await supabase.storage
      .from("avatars")
      .remove(filePaths);
    if (removeError) {
      throw removeError;
    }
  }
};