import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "@/components/ui/accordion";
import AnswerGroupBox from "../AnswerGroupBox/AnswerGroupBox";
import { Qa } from "@/app/typings/qa";

export default function QuestionListAccordion({
  qaList,
}: {
  qaList: Qa[];
}) {
  return (
    <AccordionRoot collapsible>
      {qaList.map(({question, answers}, index) => (
        <AccordionItem
          key={question.id}
          value={question.title}
        >
          <AccordionItemTrigger>
            {`${index + 1}. ${question.title}`}
          </AccordionItemTrigger>
          <AccordionItemContent>
            {answers &&
              answers.map((answer, index) => (
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
