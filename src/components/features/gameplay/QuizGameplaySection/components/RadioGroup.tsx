import { Answer } from "@/app/typings/answer";
import { Question } from "@/app/typings/question";
import { Radio, RadioGroup as RadioGroupComponent} from "@/components/ui/radio";
import { CheckCircleIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { Flex, VStack } from "@chakra-ui/react";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import clsx from "clsx";
import "./RadioGroup.scss";

interface IRadioGroupProps {
  field: ControllerRenderProps<FieldValues, string>;
  isFinished: boolean;
  selectedAnswers: Map<string, string | null>;
  groupedAnswers: { [key: string]: Answer[] };
  handleSelectAnswer: (questionId: string, answerId: string) => void;
  question: Question;
  resetKey: number;
}

export default function RadioGroup(props: IRadioGroupProps) {
  const { isFinished, selectedAnswers, groupedAnswers, handleSelectAnswer, question, field, resetKey } = props;
  return (
    <RadioGroupComponent
      value={field.value}
      onValueChange={(e) => {
        field.onChange(e.value);
        handleSelectAnswer(question.id, e.value);
      }}
      name={question.id}
      key={resetKey}
    >
      <VStack gap={1} m={4}>
        {groupedAnswers &&
          groupedAnswers[question.id]?.map((answer: Answer, index) => {
            const selectedAnsId = selectedAnswers.get(question.id) ?? "";
            const letter = String.fromCharCode(65 + index);
            const isCorrect = answer?.correct_answer && selectedAnsId === answer.id;
            const isChecked = selectedAnsId === answer.id;
            return (
              <Radio
                m={1}
                key={answer.id}
                value={answer.id}
                inputProps={{ onBlur: field.onBlur }}
                disabled={isFinished}
                cursor={isFinished ? "not-allowed" : "pointer"}
                className={
                  clsx({
                  'default': true,
                  'selected': isChecked && !props.isFinished,
                  'correct': isFinished && answer.correct_answer,
                  'incorrect': isChecked && props.isFinished && !isCorrect
                })}
                w="100%"
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
              </Radio>
            );
          })}
      </VStack>
    </RadioGroupComponent>
  );
}
