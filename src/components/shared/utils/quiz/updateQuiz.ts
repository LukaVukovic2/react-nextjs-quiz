'use server';
import { revalidatePath } from "next/cache";
import { createClient } from "../createClient";

const supabase = createClient();

export const updateQuiz = async (changes: FormData) => {
  const parseJson = (value: string | null) => {
    if (value === null || value === "undefined" || value === "") {
      return {};
    }
    try {
      return JSON.parse(value);
    } catch (e) {
      console.error("Failed to parse JSON:", e);
      return {};
    }
  };

  const quizJson = parseJson(changes.get("quiz") as string);
  const questionJson = parseJson(changes.get("questions") as string);
  const answerJson = parseJson(changes.get("answers") as string);

  const { error: errord } = await supabase.from("quiz").update(quizJson).eq("id", quizJson.id);

  const { error: errorq} = await supabase.from("question").upsert(questionJson, { onConflict: 'id' });

  const {error: errora} = await supabase.from("answer").upsert(answerJson, { onConflict: 'id' });
  
  console.log(errord, errorq, errora);
  /* const { data, error } = await supabase.rpc("update_quiz");
  if (error) {
    console.error(error);
    return false;
  } */
  revalidatePath("/my-quizzes");
  return true;
}