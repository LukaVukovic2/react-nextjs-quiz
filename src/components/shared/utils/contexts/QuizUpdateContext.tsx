import { createContext, Dispatch, SetStateAction } from 'react';
import { Answer } from '@/app/typings/answer';
import { Question } from '@/app/typings/question';

export interface IQuizUpdateContext {
  questionsArr: Question[];
  setQuestionsArr: Dispatch<SetStateAction<Question[]>>;
  dirtyQuestions: Question[];
  setDirtyQuestions: Dispatch<SetStateAction<Question[]>>;
  deletedQuestions: string[];
  setDeletedQuestions: Dispatch<SetStateAction<string[]>>;
  answersArr: Answer[];
  setAnswersArr: Dispatch<SetStateAction<Answer[]>>;
  dirtyAnswers: Answer[];
  setDirtyAnswers: Dispatch<SetStateAction<Answer[]>>;
  deletedAnswers: string[];
  setDeletedAnswers: Dispatch<SetStateAction<string[]>>;
}

export const QuizUpdateContext = createContext<IQuizUpdateContext>({
  answersArr: [] as Answer[],
  setAnswersArr: () => {},
  questionsArr: [] as Question[],
  setQuestionsArr: () => {},
  dirtyQuestions: [] as Question[],
  setDirtyQuestions: () => {},
  deletedQuestions: [] as string[],
  setDeletedQuestions: () => {},
  dirtyAnswers: [] as Answer[],
  setDirtyAnswers: () => {},
  deletedAnswers: [] as string[],
  setDeletedAnswers: () => {},
});