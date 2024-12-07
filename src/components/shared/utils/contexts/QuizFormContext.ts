import { Answer } from "@/app/typings/answer";
import { Question } from "@/app/typings/question";
import { QuizType } from "@/app/typings/quiz_type";
import { createContext } from "react";

interface IQuizFormContext {
  quiz_id: string;
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
  questionTitle: string;
  setQuestionTitle: (title: string) => void;
  question_id: string;
  setQuestionId: (id: string) => void;
  answers: Answer[];
  setAnswers: (answers: Answer[]) => void;
  isCorrect: boolean;
  setIsCorrect: (isCorrect: boolean) => void;
  currentQuestion: {
    correct: boolean;
    incorrect: boolean;
  };
  setCurrentQuestion: (question: { correct: boolean; incorrect: boolean }) => void;
  currentStep: number;
  setStepIfValid: (index: number) => void;
  quizTypes: QuizType[];
}

export const QuizFormContext = createContext<IQuizFormContext>({
  quiz_id: "",
  questions: [],
  setQuestions: () => {},
  questionTitle: "",
  setQuestionTitle: () => {},
  question_id: "",
  setQuestionId: () => {},
  answers: [],
  setAnswers: () => {},
  isCorrect: false,
  setIsCorrect: () => {},
  currentQuestion: {
    correct: false,
    incorrect: false,
  },
  setCurrentQuestion: () => {},
  currentStep: 0,
  setStepIfValid: () => {},
  quizTypes: []
});