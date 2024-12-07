import { QuizType } from "@/app/typings/quiz_type";
import { ListCollection } from "@chakra-ui/react";
import { createContext } from "react";

export interface IMyQuizzesContext {
  types: ListCollection<QuizType>;
}

export const MyQuizzesContext = createContext<IMyQuizzesContext>({
  types: {} as ListCollection<QuizType>,
});
