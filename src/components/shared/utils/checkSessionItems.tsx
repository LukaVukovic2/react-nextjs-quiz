"use client";

import { toaster } from "@/components/ui/toaster";
import { addResultsToLeaderboard } from "./actions/leaderboard/addResultsToLeaderboard";
import { Result } from "@/app/typings/result";
import { addMultipleQuizzes } from "./actions/quiz/addMultipleQuizzes";
import { deleteCookie, getCookie } from "cookies-next";

export const checkSessionItems = async (userId: string) => {
  const handleAddResults = async (results: Result[]) => {
    const success = await addResultsToLeaderboard(results);
    if (!success) return;
  
    toaster.create({
      title: "Results added to leaderboard",
      type: "success",
      duration: 5000
    });
    deleteCookie("results");
  };
  const handleAddQuizzes = async (quizzes: FormData) => {
    const success = await addMultipleQuizzes(quizzes, userId);
    if (!success) return;
  
    toaster.create({
      title: "Quizzes added to leaderboard",
      type: "success",
      duration: 5000
    });
    deleteCookie("quizzes");
  };
  
  const res = JSON.parse(getCookie("results") || "[]");
  if (res.length > 0) {
    const updatedResults = res.map((result: Result) => ({ ...result, user_id: userId }));
    handleAddResults(updatedResults);
  }
  const quizzes = JSON.parse(getCookie("quizzes") || "[]");
  if (quizzes.length > 0) {
    handleAddQuizzes(quizzes);
  }

}