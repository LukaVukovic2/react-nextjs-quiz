"use server";
import { revalidatePath } from "next/cache";
import createClient from "../../createClient";

const supabase = createClient();

export const deleteAvatar = async (avatar: string) => {
  const id = avatar.replace("" + process.env.AVATAR_BASE_URL, "");
  console.log(id);
  const { error: removeError } = await supabase.storage
    .from("avatars")
    .remove([id]);
  if (removeError) {
    throw removeError;
  }

  const { error: updateError } = await supabase
    .from("profile")
    .update({ avatar: null })
    .eq("avatar", avatar);
  if (updateError) {
    throw updateError;
  }
  revalidatePath("/");
};
