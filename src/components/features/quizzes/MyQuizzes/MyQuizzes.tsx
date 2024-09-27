"use client";
import { Quiz } from "@/app/typings/quiz";
import { Flex, List, ListItem } from "@chakra-ui/react";
import QuizMenuDropdown from "../QuizMenuDropdown/QuizMenuDropdown";
import { Question } from "@/app/typings/question";
import { Answer } from "@/app/typings/answer";

interface MyQuizzesProps {
  quizzes: Array<{
    quiz: Quiz; 
    questions_and_answers: Array<{
      question: Question;
      answers: Answer[];
    }>;
  }>;
}

export default function MyQuizzes(quizzes: MyQuizzesProps) {
  return (
    <Flex
      flexDir="column"
      alignItems="center"
    >
      <List
        style={{
          width: "500px",
        }}
      >
        {quizzes.quizzes.length > 0 && quizzes.quizzes.map((quiz: {quiz: Quiz}, index) => (
          <ListItem
            key={quiz.quiz.id}
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
              <h2>{quiz.quiz.title}</h2>
              <p>{quiz.quiz.category}</p>
              <p>{quiz.quiz.timer}</p>
            </div>
            <QuizMenuDropdown quiz={quiz.quiz} questions_and_answers={quizzes.quizzes[index].questions_and_answers} />
          </ListItem>
        ))}
      </List>
    </Flex>
  );
}
