import { Answer } from "@/app/typings/answer";
import { Question } from "@/app/typings/question";
import { getLetterByIndex } from "@/components/shared/utils/getLetterByIndex";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircleIcon, SmallCloseIcon } from "@chakra-ui/icons";
import {
  CheckboxGroup as CheckboxGroupComponent,
  Fieldset,
  Flex,
} from "@chakra-ui/react";
import clsx from "clsx";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import "./RadioGroup.scss";

interface ICheckboxGroupProps {
  field: ControllerRenderProps<FieldValues, string>;
  isFinished: boolean;
  selectedAnswers: Map<string, string[] | null>;
  groupedAnswers: { [key: string]: Answer[] };
  handleSelectAnswer: (questionId: string, answerId: string[]) => void;
  question: Question;
  resetKey: number;
}

export default function CheckboxGroup(props: ICheckboxGroupProps) {
  const {
    isFinished,
    selectedAnswers,
    groupedAnswers,
    handleSelectAnswer,
    question,
    field,
    resetKey,
  } = props;
  return (
    <Fieldset.Root>
      <CheckboxGroupComponent
        name={question.id}
        value={field.value}
        onValueChange={(e) => {
          field.onChange(e);
          handleSelectAnswer(question.id, e);
        }}
        key={resetKey}
      >
        <Fieldset.Content gap={0}>
          {groupedAnswers &&
            groupedAnswers[question.id]?.map((answer: Answer, index) => {
              const selectedAnsArr = selectedAnswers.get(question.id) ?? [];

              const letter = getLetterByIndex(index);
              const isChecked = selectedAnsArr.includes(answer.id);
              const isCorrect = answer?.correct_answer && isChecked;
              return (
                <Checkbox
                  key={answer.id}
                  value={answer.id}
                  checked={isChecked}
                  m={1}
                  className={
                    clsx({
                    'default': true,
                    'selected': isChecked && !props.isFinished,
                    'correct': isFinished && answer.correct_answer,
                    'incorrect': isChecked && props.isFinished && !isCorrect
                  })}
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
                        isChecked ? (
                          isCorrect ? (
                            <CheckCircleIcon w="100%" h="100%" />
                          ) : (
                            <SmallCloseIcon w="100%" h="100%" />
                          )
                        ) : !isChecked && answer.correct_answer ? (
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
                </Checkbox>
              );
            })}
        </Fieldset.Content>
      </CheckboxGroupComponent>
    </Fieldset.Root>
  );
}
