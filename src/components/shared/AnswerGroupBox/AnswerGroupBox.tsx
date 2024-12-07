import { Answer } from "@/app/typings/answer";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { Box, Text } from "@chakra-ui/react";

interface IAnswerGroupBoxProps {
  letter: string;
  answer: Answer;
}

export default function AnswerGroupBox({
  letter,
  answer,
}: IAnswerGroupBoxProps) {
  return (
    <Box key={answer.answer}>
      <Text ml="{spacing.4}">
        {`${letter}) ${answer.answer} `}
        {answer.correct_answer && <CheckCircleIcon color="green"/>}
      </Text>
    </Box>
  );
}
