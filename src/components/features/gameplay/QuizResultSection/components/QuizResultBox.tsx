import { Flex, Text } from "@chakra-ui/react";
import "./QuizResultBox.css";

interface IQuizResultBoxProps {
  title: string;
  value: string;
}

export default function QuizResultBox({title, value} : IQuizResultBoxProps) {
  return (
    <Flex className="quiz-result-box" direction="column" alignItems="center">
      <Text>{title}</Text>
      <Text>{value}</Text>
    </Flex>
  );
}