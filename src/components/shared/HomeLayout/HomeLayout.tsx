import { QuizType } from "@/typings/quiz";
import QuizTypeBox from "../../core/QuizTypeBox/QuizTypeBox";
import { Container, Flex } from "@chakra-ui/react";

export default function HomeLayout({ types }: { types: QuizType[] }) {
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
