import { ListCollection } from "@chakra-ui/react";
import { createContext } from "react";

export interface IMyQuizzesContext {
  quizTypes: ListCollection;
  questTypes: ListCollection;
}

export const MyQuizzesContext = createContext<IMyQuizzesContext>({
  quizTypes: {} as ListCollection,
  questTypes: {} as ListCollection,
});
