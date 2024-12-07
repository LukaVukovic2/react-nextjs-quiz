"use client";
import QuizMenuDropdown from "../QuizMenuDropdown/QuizMenuDropdown";
import { Box, createListCollection, Flex, ListCollection, Text } from "@chakra-ui/react";
import { Heading } from "@/styles/theme/components/heading";
import { Quiz } from "@/app/typings/quiz";
import { Question } from "@/app/typings/question";
import { Answer } from "@/app/typings/answer";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/core/LoadingSpinner/LoadingSpinner";
import { Toaster } from "@/components/ui/toaster";
import { QuizType } from "@/app/typings/quiz_type";
import { MyQuizzesContext } from "@/components/shared/utils/contexts/MyQuizzesContext";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface MyQuizzesProps {
  quizzes: Array<{
    quiz: Quiz;
    quiz_type: QuizType;
    questions_and_answers: Array<{
      question: Question;
      answers: Answer[];
    }>;
  }>;
}

export default function MyQuizzes({quizzes}: MyQuizzesProps) {
  const [loaded, setLoaded] = useState(false);
  const [types, setTypes] = useState<ListCollection>({} as ListCollection<QuizType>);
  const supabase = createClientComponentClient();

  useEffect(() => {
    setLoaded(true);
    const fetchTypes = async () => {
      const { data: types } = await supabase.rpc("get_quiz_types");
      const typesCollection: ListCollection<QuizType> = createListCollection({
        items: types.map((quizType: QuizType) => ({
          value: quizType.id,
          label: quizType.type_name,
        })),
      });
      setTypes(typesCollection);
    }
    fetchTypes();
  }, []);

  if (!loaded) {
    return <LoadingSpinner text="Loading your quizzes..." />;
  }
  return (
    <MyQuizzesContext.Provider value={{ types: types }}>
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
          {quizzes.length > 0 && quizzes.map(({quiz, quiz_type}: {quiz: Quiz, quiz_type: QuizType}, index) => (
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
                <Text>{quiz_type.type_name}</Text>
                <Text>{quiz.time}</Text>
              </div>
              <QuizMenuDropdown quiz={quiz} quiz_type={quiz_type} questions_and_answers={quizzes[index].questions_and_answers} />
            </Box>
          ))}
        </Box>
        <Toaster />
      </Flex>
    </MyQuizzesContext.Provider>
  );
}