import { createContext, Dispatch, SetStateAction } from 'react';
import { Answer } from '@/app/typings/answer';
import { Question } from '@/app/typings/question';
import { QuizBasic } from '@/app/typings/quiz';

export interface IQuizUpdateContext {
  answersArr: Answer[];
  setAnswersArr: Dispatch<SetStateAction<Answer[]>>;
  questionsArr: Question[];
  setQuestionsArr: Dispatch<SetStateAction<Question[]>>;
  dirtyQuestions: Question[];
  setDirtyQuestions: Dispatch<SetStateAction<Question[]>>;
  deletedQuestions: string[];
  setDeletedQuestions: Dispatch<SetStateAction<string[]>>;
  dirtyAnswers: Answer[];
  setDirtyAnswers: Dispatch<SetStateAction<Answer[]>>;
  deletedAnswers: string[];
  setDeletedAnswers: Dispatch<SetStateAction<string[]>>;
  dirtyQuizFields: QuizBasic | undefined;
  setDirtyQuizFields: Dispatch<SetStateAction<QuizBasic | undefined>>;
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
  dirtyQuizFields: {} as QuizBasic,
  setDirtyQuizFields: () => {},
});