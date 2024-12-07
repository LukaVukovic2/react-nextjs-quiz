import { QuizType } from "@/app/typings/quiz_type";
import QuizTypeBox from "../QuizTypeBox/QuizTypeBox";
import { Container, Flex } from "@chakra-ui/react";

export default function Homepage({ types }: { types: QuizType[] }) {
  return (
    <Container
      maxW="sm"
      as={Flex}
      justifyContent="center"
      gap={3}
      flexWrap="wrap"
      mt="5"
    >
      {types.map((type) => (
        <QuizTypeBox
          key={type.id}
          type={type}
        />
      ))}
    </Container>
  );
}
