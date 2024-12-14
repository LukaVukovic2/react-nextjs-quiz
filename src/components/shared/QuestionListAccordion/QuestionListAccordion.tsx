import { Question } from "@/app/typings/question";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "@/components/ui/accordion";
import AnswerGroupBox from "../AnswerGroupBox/AnswerGroupBox";

export default function QuestionListAccordion({
  questions,
}: {
  questions: Question[];
}) {
  return (
    <AccordionRoot collapsible>
      {questions.map((question, index) => (
        <AccordionItem
          key={question.id}
          value={question.title}
        >
          <AccordionItemTrigger>
            {`${index + 1}. ${question.title}`}
          </AccordionItemTrigger>
          <AccordionItemContent>
            {question.answers &&
              question.answers.map((answer, index) => (
                <AnswerGroupBox
                  key={answer.id}
                  answer={answer}
                  letter={String.fromCharCode(65 + index)}
                />
              ))}
          </AccordionItemContent>
        </AccordionItem>
      ))}
    </AccordionRoot>
  );
}
