import { RadioCard } from "@/components/core/RadioCard/RadioCard";
import { Answer } from "@/app/typings/answer";
import { Question } from "@/app/typings/question";
import { Box, useRadioGroup, Flex } from "@chakra-ui/react";
import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  UseFormStateReturn,
} from "react-hook-form";
import { CheckCircleIcon, SmallCloseIcon } from "@chakra-ui/icons";

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
  handleSelectAnswer,
}: IQuizRadioGroupProps) {
  const { getRadioProps } = useRadioGroup({
    name: question.id,
    onChange: (answerId: string) => {
      handleSelectAnswer(question.id, answerId);
    },
  });

  return (
    <Box>
      {groupedAnswers &&
        groupedAnswers[question.id]?.map((answer: Answer, index) => {
          const radio = getRadioProps({ value: `${answer.id}` });
          const selectedAnsId = selectedAnswers.get(question.id) ?? "";
          radio.isChecked = selectedAnsId === answer.id;
          const letter = String.fromCharCode(65 + index);
          const isCorrect =
            answer?.correct_answer && selectedAnsId === answer.id;
          return (
            <RadioCard
              key={answer.id}
              {...radio}
              {...field}
              answer={answer}
              isFinished={isFinished}
              selectedAnsId={selectedAnsId as string}
              isCorrect={isCorrect}
            >
              <Flex
                alignItems="center"
                gap={2}
              >
                <Flex
                  borderRadius="50%"
                  border="2px solid #E2E8F0"
                  w={7}
                  h={7}
                  justifyContent="center"
                  alignItems="center"
                  overflow="hidden"
                >
                  {isFinished ? (
                    selectedAnsId === answer.id ? (
                      isCorrect ? (
                        <CheckCircleIcon w="100%" h="100%" />
                      ) : (
                        <SmallCloseIcon w="100%" h="100%" />
                      )
                    ) : !selectedAnsId && answer.correct_answer ? (
                      <SmallCloseIcon w="100%" h="100%" color="#dc3545" bg="white" />
                    ) : (
                      letter
                    )
                  ) : (
                    letter
                  )}
                </Flex>
                {answer.answer}
              </Flex>
            </RadioCard>
          );
        })}
    </Box>
  );
}
