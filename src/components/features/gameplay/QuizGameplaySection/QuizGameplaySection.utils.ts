import { Answer } from "@/typings/answer";
import { Question, QuestionType } from "@/typings/question";
import { getCookie, setCookie } from "cookies-next";
import { MutableRefObject } from "react";
import Swiper from "swiper";

export const calculateScore = (
  selectedAnswers: Map<string, string[] | null>,
  correctAnswers: Answer[],
  questions: Question[],
  questTypes: QuestionType[]
) => {
  let totalScore = 0;

  Array.from(selectedAnswers).forEach(([questionId, selected]) => {
    const correctAnswersForQuestion = correctAnswers.filter(
      (answer) => answer.question_id === questionId
    );

    const typeId = questions.find((q) => q.id === questionId)?.id_quest_type;
    const questionType = questTypes.find(
      (type) => type.id === typeId
    )?.type_name;
    const selectedArr = Array.isArray(selected) ? selected : [];

    if (
      questionType === "Single choice" ||
      questionType === "Multiple choice"
    ) {
      const correctIds = correctAnswersForQuestion.map((answer) => answer.id);
      const correctSelections = correctIds.filter((id) =>
        selected?.includes(id)
      ).length;
      const incorrectSelections =
        selectedArr?.filter((id) => !correctIds.includes(id)).length || 0;
      const isNegativeQuestionScore = incorrectSelections > correctSelections;
      const questionScore =
        (isNegativeQuestionScore
          ? 0
          : correctSelections - incorrectSelections) / (correctIds.length || 1);
      totalScore += questionScore;
    } else if (questionType === "Short answer") {
      const userInput = String(selected).toLowerCase().trim();
      const isCorrect = correctAnswersForQuestion
        .map(({ answer }) => answer.toLowerCase())
        .includes(userInput);

      totalScore += isCorrect ? 1 : 0;
    } else {
      console.warn(`Unknown question type for question ID: ${questionId}`);
    }
  });

  return totalScore;
};

export const groupAnswersByQuestion = (answers: Answer[]) => {
  return answers?.reduce((acc, answer) => {
    acc[answer.question_id] = acc[answer.question_id] || [];
    acc[answer.question_id].push(answer);
    return acc;
  }, {} as { [key: string]: Answer[] });
};

export const initializeSelectedAnswers = (
  questions: Question[]
): Map<string, string[] | null> => {
  const map = new Map<string, string[] | null>();
  questions.forEach((question) => map.set(question.id, null));
  return map;
};

export const manageSlideTransition = (
  questionType: string,
  isTransitioning: boolean,
  swiperRef: MutableRefObject<Swiper | null>,
  timeoutRef: MutableRefObject<NodeJS.Timeout | null>
) => {
  if (!isTransitioning && swiperRef.current !== null) {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      if (!swiperRef.current?.pagination) return;

      swiperRef.current.pagination.render();
      if (questionType === "Single choice") swiperRef.current.slideNext();
      timeoutRef.current = null;
    }, swiperRef.current.params.speed);
  }
};

export const addToCookieList = (cookieName: string, value: unknown) => {
  const existingItems = JSON.parse(
    getCookie(cookieName) || "[]"
  );
  const newList = [...existingItems, value];
  setCookie(cookieName, JSON.stringify(newList), 
    { maxAge: 60 * 60 * 24 }
  );
}