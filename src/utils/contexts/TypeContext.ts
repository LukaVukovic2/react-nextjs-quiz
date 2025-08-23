import { ListCollection } from "@chakra-ui/react";
import { createContext } from "react";

export interface ITypeContext {
  quizTypes: ListCollection;
  questTypes: ListCollection;
}

export const TypeContext = createContext<ITypeContext>({
  quizTypes: {} as ListCollection,
  questTypes: {} as ListCollection,
});
