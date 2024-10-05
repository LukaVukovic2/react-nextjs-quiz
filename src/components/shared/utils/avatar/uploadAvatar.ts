"use server";
import { revalidatePath } from "next/cache";
import createClient from "../createClient";
import { v4 as uuidv4 } from "uuid";

const supabase = createClient();

export const uploadAvatar = async (formData: FormData) => {
  try {
    const file = formData.get("file") as File;
    const id = formData.get("id") as string;

    if (!file || !id) {
      throw new Error("File or ID is missing");
    }
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

    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(`${id}/${uuidv4()}`, file);

    if (error) {
      throw error;
    }

    const { error: updateError } = await supabase
      .from("profile")
      .update({ avatar: process.env.AVATAR_BASE_URL + data.path })
      .eq("id", id);
    if (updateError) {
      throw updateError;
    }
    revalidatePath("/");
    return data;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw error;
  }
};
