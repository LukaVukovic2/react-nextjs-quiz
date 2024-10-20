"use server"

import { revalidatePath } from "next/cache";

export const revalidateCache = async (path: string) => {
  revalidatePath(path);
};