import { Answer } from "./answer";
import { Question } from "./question";

export interface Qa {
  question: Question;
  answers: Answer[];
}