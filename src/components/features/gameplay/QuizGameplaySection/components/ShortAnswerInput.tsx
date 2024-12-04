import { Answer } from "@/app/typings/answer";
import { Question } from "@/app/typings/question";
import { Box, Input, Stack, Text } from "@chakra-ui/react";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

interface IShortAnswerInputProps {
  field: ControllerRenderProps<FieldValues, string>;
  isFinished: boolean;
  groupedAnswers: { [key: string]: Answer[] };
  question: Question;
  handleSelectAnswer: (questionId: string, answerId: string[]) => void;
  resetKey: number;
}

export default function ShortAnswerInput(props: IShortAnswerInputProps) {
  const {
    field,
    question,
    handleSelectAnswer,
    isFinished,
    groupedAnswers,
    resetKey,
  } = props;
  return (
    <Stack m={4}>
      <Input
        name={field.name}
        value={field.value}
        onChange={field.onChange}
        key={resetKey}
        placeholder="Type your answer here"
        onBlur={() => {
          field.onBlur();
          handleSelectAnswer(question.id, field.value);
        }}
      />
      <Box>
        {isFinished && (
          <>
            <Text fontWeight="semibold">Acceptable answers:</Text>
            {groupedAnswers[question.id]?.map((answer) => (
              <Text key={answer.id}>{answer.answer}</Text>
            ))}
          </>
        )}
      </Box>
    </Stack>
  );
}
