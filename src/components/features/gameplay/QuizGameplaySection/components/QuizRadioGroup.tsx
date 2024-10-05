import { Answer } from "@/app/typings/answer";
import { Question } from "@/app/typings/question";
import { RadioCard } from "@/components/core/RadioCard/RadioCard";
import { Box, useRadioGroup } from "@chakra-ui/react";
import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  UseFormStateReturn,
} from "react-hook-form";

interface IQuizRadioGroupProps {
  question: Question;
  field: {
    field: ControllerRenderProps<FieldValues, string>;
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<FieldValues>;
  };
  isFinished: boolean;
  selectedAnswers: Map<string, string | null>;
  groupedAnswers: { [key: string]: Answer[] };
  handleSelectAnswer: (questionId: string, answerId: string) => void;
}

export default function QuizRadioGroup({
  question,
  field,
  isFinished,
  selectedAnswers,
  groupedAnswers,
  handleSelectAnswer
}: IQuizRadioGroupProps) {
  
  const {getRadioProps} = useRadioGroup({
    name: question.id,
    onChange: (answerId: string) => {
      handleSelectAnswer(question.id, answerId);
    },
  });

  return (
    <Box>
      {groupedAnswers &&
        groupedAnswers[question.id]?.map((answer: Answer) => {
          const radio = getRadioProps({ value: `${answer.id}` });
          const selectedAnsId = selectedAnswers.get(question.id);
          radio.isChecked = selectedAnsId === answer.id;
          return (
            <RadioCard
              key={answer.id}
              {...radio}
              {...field}
              answer={answer}
              isFinished={isFinished}
              selectedAnsId={selectedAnsId}
            >
              {answer.answer}
            </RadioCard>
          );
        })}
    </Box>
  );
}
