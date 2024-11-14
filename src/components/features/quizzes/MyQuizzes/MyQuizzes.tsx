"use client";
import QuizMenuDropdown from "../QuizMenuDropdown/QuizMenuDropdown";
import { Flex, Heading, List, ListItem, Text } from "@chakra-ui/react";
import { Quiz } from "@/app/typings/quiz";
import { Question } from "@/app/typings/question";
import { Answer } from "@/app/typings/answer";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/core/LoadingSpinner/LoadingSpinner";

interface MyQuizzesProps {
  quizzes: Array<{
    quiz: Quiz; 
    questions_and_answers: Array<{
      question: Question;
      answers: Answer[];
    }>;
  }>;
}

export default function MyQuizzes({quizzes}: MyQuizzesProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) {
    return <LoadingSpinner text="Loading your quizzes..." />;
  }
  return (
    <Flex
      flexDir="column"
      alignItems="center"
    >
      <Heading as="h1">
        My Quizzes
      </Heading>
      <List
        style={{
          width: "500px",
        }}
      >
        {quizzes.length > 0 && quizzes.map(({quiz}: {quiz: Quiz}, index) => (
          <ListItem
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
              <Heading as="h2" size="md">{quiz.title}</Heading>
              <Text>{quiz.category}</Text>
              <Text>{quiz.time}</Text>
            </div>
            <QuizMenuDropdown quiz={quiz} questions_and_answers={quizzes[index].questions_and_answers} />
          </ListItem>
        ))}
      </List>
    </Flex>
  );
}