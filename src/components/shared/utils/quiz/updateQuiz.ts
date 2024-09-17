'use server';
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
  //const answerJson = parseJson(changes.get("answers") as string);

  const { data } = await supabase.from("quiz").update(quizJson).eq("id", quizJson.id);
  console.log(data);

  const { data: questionData, error } = await supabase
  .from("question")
  .upsert(questionJson, { onConflict: 'id' });  
  console.log(questionData);
  console.log(error);

  /* const { data, error } = await supabase.rpc("update_quiz");
  if (error) {
    console.error(error);
    return false;
  } */
  return true;
}