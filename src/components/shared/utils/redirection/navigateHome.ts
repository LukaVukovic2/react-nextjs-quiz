"use server";
import { redirect } from "next/navigation";

export const navigateHome = async () => {
  redirect("/quizzes");
}