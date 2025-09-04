import { Flex, Text } from "@chakra-ui/react";
import styles from "./QuizResultBox.module.css";

interface IQuizResultBoxProps {
  title: string;
  value: string;
}

export default function QuizResultBox({ title, value }: IQuizResultBoxProps) {
  return (
    <Flex className={styles.quizResultBox}>
      <Text>{title}</Text>
      <Text>{value}</Text>
    </Flex>
  );
}
