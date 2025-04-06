"use client";
import QuizMenuDropdown from "../QuizMenuDropdown/QuizMenuDropdown";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Heading } from "@/styles/theme/components/heading";
import { QuizBasic } from "@/typings/quiz";
import { QuizType } from "@/typings/quiz";
import { TypeContext } from "@/utils/contexts/TypeContext";
import { QuestionType } from "@/typings/question";
import { formatToMMSS } from "@/utils/functions/formatTime";
import { Qa } from "@/typings/qa";
import { createListCollection } from "@/utils/functions/createListCollection";

interface MyQuizzesProps {
  quizzes: Array<{
    quiz: QuizBasic;
    quizType: QuizType;
    qaList: Qa[];
  }>;
  questTypesArr: QuestionType[];
  quizTypesArr: QuizType[];
}

export default function MyQuizzes({
  quizzes,
  questTypesArr,
  quizTypesArr,
}: MyQuizzesProps) {
  const questTypes = createListCollection(questTypesArr);
  const quizTypes = createListCollection(quizTypesArr);

  return (
    <TypeContext.Provider value={{ quizTypes, questTypes }}>
      <Flex
        flexDir="column"
        alignItems="center"
      >
        <Heading
          as="h1"
          size="h1"
        >
          My Quizzes
        </Heading>
        <Box
          as="ul"
          style={{
            width: "500px",
          }}
        >
          {quizzes.map(
            (
              { quiz, quizType }: { quiz: QuizBasic; quizType: QuizType },
              index
            ) => (
              <Box
                as="li"
                key={quiz.id}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt="-1px"
                style={{
                  border: "1px solid lightgrey",
                  padding: "10px",
                }}
              >
                <div>
                  <Heading
                    as="h2"
                    size="h5"
                  >
                    {quiz.title}
                  </Heading>
                  <Text>{quizType.type_name}</Text>
                  <Text>{formatToMMSS(+quiz.time)}</Text>
                </div>
                <QuizMenuDropdown
                  quiz={quiz}
                  quizType={quizType}
                  qaList={quizzes[index].qaList}
                />
              </Box>
            )
          )}
        </Box>
      </Flex>
    </TypeContext.Provider>
  );
}
