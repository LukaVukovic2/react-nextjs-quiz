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
import "../QuizGameplaySwiper.scss";

interface ICheckboxGroupProps {
  field: ControllerRenderProps<FieldValues, string>;
  isFinished: boolean;
  answerOptions: Answer[];
  selectedAnsIds: string[];
  handleSelectAnswer: (
    questionId: string,
    answerId: string[],
    questionType: string
  ) => void;
  question: Question;
  resetKey: number;
}

export default function CheckboxGroup(props: ICheckboxGroupProps) {
  const {
    isFinished,
    answerOptions,
    selectedAnsIds,
    handleSelectAnswer,
    question,
    field,
    resetKey,
  } = props;
  return (
    <Fieldset.Root>
      <CheckboxGroupComponent
        m={1}
        name={question.id}
        value={field.value}
        onValueChange={(e) => {
          field.onChange(e);
          handleSelectAnswer(question.id, e, "Multiple choice");
        }}
        key={resetKey}
      >
        <Fieldset.Legend fontSize="xs" ml={2}>
          You can select multiple answers
        </Fieldset.Legend>
        <Fieldset.Content gap={0}>
          {answerOptions.map((answer: Answer, index) => {
            const letter = getLetterByIndex(index);
            const isChecked = selectedAnsIds.includes(answer.id);
            const isCorrect = answer?.correct_answer && isChecked;
            return (
              <Checkbox
                key={answer.id}
                value={answer.id}
                checked={isChecked}
                m={1}
                readOnly={isFinished}
                cursor={isFinished ? "not-allowed" : "pointer"}
                className={clsx({
                  default: true,
                  selected: isChecked && !props.isFinished,
                  correct: isFinished && answer.correct_answer,
                  incorrect: isChecked && props.isFinished && !isCorrect,
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
                          <CheckCircleIcon
                            w="100%"
                            h="100%"
                          />
                        ) : (
                          <SmallCloseIcon
                            w="100%"
                            h="100%"
                          />
                        )
                      ) : !isChecked && answer.correct_answer ? (
                        <SmallCloseIcon
                          w="100%"
                          h="100%"
                          color="#dc3545"
                          bg="white"
                        />
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
