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
import styles from "./MyQuizzes.module.css";
import { useMediaQuery } from "usehooks-ts";
import { FaRegClock } from "react-icons/fa";

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
  const mobileMode = useMediaQuery("(max-width: 576px)");

  return (
    <TypeContext.Provider value={{ quizTypes, questTypes }}>
      <Flex
        flexDir="column"
        alignItems="center"
      >
        <Heading
          as="h1"
          size={mobileMode ? "h2" : "h1"}
        >
          My Quizzes
        </Heading>
        <Box
          as="ul"
          className={styles.myQuizList}
        >
          {quizzes.map(({ quiz, quizType }: { quiz: QuizBasic; quizType: QuizType }, index) => 
            (
              <Box
                as="li"
                key={quiz.id}
                className={styles.myQuizItem}
              >
                <div>
                  <Heading
                    as="h2"
                    size={mobileMode ? "h6" : "h5"}
                  >
                    {quiz.title}
                  </Heading>
                  <Text>{quizType.type_name}</Text>
                  <Flex
                    alignItems="center"
                    gap={1}
                  >
                    <FaRegClock />
                    {formatToMMSS(+quiz.time)}
                  </Flex>
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
