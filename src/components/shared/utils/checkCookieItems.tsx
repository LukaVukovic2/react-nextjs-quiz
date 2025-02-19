import { toaster } from "@/components/ui/toaster";
import { addResultsToLeaderboard } from "./actions/leaderboard/addResultsToLeaderboard";
import { Result } from "@/app/typings/result";
import { addMultipleQuizzes } from "./actions/quiz/addMultipleQuizzes";
import { deleteCookie, getCookie } from "cookies-next";

export const checkCookieItems = async (userId: string) => {
  const handleAddData = async (data: FormData, type: string) => {
    const addDataToDB = type === "results" ? addResultsToLeaderboard : addMultipleQuizzes;
    const success = await addDataToDB(data, userId);
    if (!success) return;
    
    toaster.create({
      title: type === "results" ? "Results added to leaderboard" : "Your quizzes were saved",
      type: "success",
      duration: 5000
    })
    deleteCookie(type);
  };
  
  const res = JSON.parse(getCookie("results") || "[]");
  if (res.length > 0) {
    const updatedResults = res.map((result: Result) => ({ ...result, user_id: userId }));
    handleAddData(updatedResults, "results");
  }
  const quizzes = JSON.parse(getCookie("quizzes") || "[]");
  if (quizzes.length > 0) {
    handleAddData(quizzes, "quizzes");
  }
}