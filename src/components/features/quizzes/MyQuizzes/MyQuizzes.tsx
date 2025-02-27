"use client";
import QuizMenuDropdown from "../QuizMenuDropdown/QuizMenuDropdown";
import { Box, Flex, ListCollection, Text } from "@chakra-ui/react";
import { Heading } from "@/styles/theme/components/heading";
import { QuizBasic } from "@/app/typings/quiz";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/core/LoadingSpinner/LoadingSpinner";
import { QuizType } from "@/app/typings/quiz_type";
import { MyQuizzesContext } from "@/components/shared/utils/contexts/MyQuizzesContext";
import { QuestionType } from "@/app/typings/question_type";
import { formatToMMSS } from "@/components/shared/utils/formatTime";
import { createClient } from "@/components/shared/utils/supabase/client";
import { Qa } from "@/app/typings/qa";
import { createListCollection } from "@/components/shared/utils/createListCollection";

interface MyQuizzesProps {
  quizzes: Array<{
    quiz: QuizBasic;
    quizType: QuizType;
    qaList: Qa[];
  }>;
}

export default function MyQuizzes({quizzes}: MyQuizzesProps) {
  const [loaded, setLoaded] = useState(false);
  const [quizTypes, setQuizTypes] = useState<ListCollection>({} as ListCollection<QuizType>);
  const [questTypes, setQuestTypes] = useState<ListCollection>({} as ListCollection<QuestionType>);
  const supabase = createClient();

  useEffect(() => {
    setLoaded(true);
    const fetchTypes = async () => {
      const [{data: quizTypes}, {data: questTypes}] = await Promise.all([
        supabase.rpc("get_quiz_types"),
        supabase.rpc("get_question_types"),
      ]);
      const quizTypesCollection: ListCollection<QuizType> = createListCollection(quizTypes);
      const questTypesCollection: ListCollection<QuestionType> = createListCollection(questTypes);
      setQuizTypes(quizTypesCollection);
      setQuestTypes(questTypesCollection);
    }
    fetchTypes();
  }, []);

  if (!loaded) {
    return <LoadingSpinner text="Loading your quizzes..." />;
  }
  return (
    <MyQuizzesContext.Provider value={{ quizTypes, questTypes }}>
      <Flex
        flexDir="column"
        alignItems="center"
      >
        <Heading as="h1" size="h1">
          My Quizzes
        </Heading>
        <Box
          as="ul"
          style={{
            width: "500px",
          }}
        >
          {quizzes.length > 0 && quizzes.map(({quiz, quizType}: {quiz: QuizBasic, quizType: QuizType}, index) => (
            <Box
              as="li"
              key={quiz.id}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mt="-1px"
              style={{
                border: "1px solid lightgrey",
                padding: "10px"
              }}
            >
              <div>
                <Heading as="h2" size="h5">{quiz.title}</Heading>
                <Text>{quizType.type_name}</Text>
                <Text>{formatToMMSS(+quiz.time)}</Text>
              </div>
              <QuizMenuDropdown quiz={quiz} quizType={quizType} qaList={quizzes[index].qaList} />
            </Box>
          ))}
        </Box>
      </Flex>
    </MyQuizzesContext.Provider>
  );
}