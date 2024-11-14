"use server";
import { revalidatePath } from "next/cache";
import createClient from "../../createClient";

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
  const deletedQuestionsJson = parseJson(
    changes.get("deletedQuestions") as string
  );
  const deletedAnswersJson = parseJson(
    changes.get("deletedAnswers") as string
  );

  const { error } = await supabase.rpc("update_quiz", {
    updatedquiz: quizJson,
    updatedquestions: questionJson,
    updatedanswers: answerJson,
    deletedquestions: deletedQuestionsJson,
    deletedanswers: deletedAnswersJson
  });
  if (error) {
    console.error(error);
    return false;
  }
  revalidatePath("/my-quizzes");
  return true;
};
