"use client";
import { Answer } from "@/app/typings/answer";
import { Question } from "@/app/typings/question";
import { Quiz } from "@/app/typings/quiz";
import { User } from "@/app/typings/user";
import {
  Flex,
  Avatar,
  Button,
  Heading,
} from "@chakra-ui/react";
import QuizResultSection from "../QuizResultSection/QuizResultSection";
import { chakra } from "@chakra-ui/react";
import { useState } from "react";
import { updateQuizInfo } from "./QuizGameplaySection.utils";
import { CheckCircleIcon, RepeatIcon } from "@chakra-ui/icons";
import { Controller, useForm } from "react-hook-form";
import { FaMinusCircle } from "react-icons/fa";
import QuizTimer from "../QuizTimer/QuizTimer";
import QuizRadioGroup from "./components/QuizRadioGroup";

interface IQuizGameplayProps {
  quiz: Quiz;
  user: User;
  questions: Question[];
  answers: Answer[];
}

const initializeSelectedAnswers = (
  questions: Question[]
): Map<string, string | null> => {
  const map = new Map<string, string | null>();
  questions.forEach((question) => map.set(question.id, null));
  return map;
};

export default function QuizGameplaySection({
  quiz,
  user,
  questions,
  answers,
}: IQuizGameplayProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<
    Map<string, string | null>
  >(initializeSelectedAnswers(questions));
  const [score, setScore] = useState<number>();
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const { control, reset, setValue } = useForm();

  const groupedAnswers = answers?.reduce((acc, answer) => {
    acc[answer.question_id] = acc[answer.question_id] || [];
    acc[answer.question_id].push(answer);
    return acc;
  }, {} as { [key: string]: Answer[] });

  const formatToSeconds = () => {
    const [hours, minutes, seconds] = quiz.time.split(":");
    const time = new Date();
    time.setSeconds(
      time.getSeconds() +
        parseInt(hours) * 3600 +
        parseInt(minutes) * 60 +
        parseInt(seconds)
    );
    return time;
  };

  const handleSelectAnswer = (questionId: string, answerId: string) => {
    setSelectedAnswers((prev) => new Map(prev.set(questionId, answerId)));
    setValue(questionId, answerId);
  };

  const handleFinishQuiz = () => {
    const totalScore = Array.from(selectedAnswers).reduce(
      (score, [questionId, answerId]) => {
        const correctAnswer = answers.find(
          (answer) => answer.question_id === questionId && answer.correct_answer
        );
        return correctAnswer?.id === answerId ? score + 1 : score;
      },
      0
    );
    setScore(totalScore);
    setIsFinished(true);
    updateQuizInfo(quiz.id, quiz.plays, quiz.average_score, totalScore);
  };

  const resetQuiz = () => {
    setSelectedAnswers(initializeSelectedAnswers(questions));
    setScore(undefined);
    setIsFinished(false);
    setHasStarted(true);
    setResetKey((prev) => prev + 1);
    reset();
  };

  return (
    <Flex
      flexDir="column"
      gap={1}
    >
      <Flex
        align="center"
        gap={2}
      >
        {user?.avatar && <Avatar src={user.avatar} />}
        <h1>{user?.username}</h1>
      </Flex>
      <h2>{quiz.title}</h2>
      <p>{quiz.category}</p>
      <QuizTimer
        key={resetKey}
        quizTime={formatToSeconds()}
        hasStarted={hasStarted}
        isFinished={isFinished}
        handleFinishQuiz={handleFinishQuiz}
      />
      {!hasStarted ? (
        <Button onClick={() => setHasStarted(true)}>Start quiz</Button>
      ) : (
        <chakra.form>
          {isFinished && (
            <Button
              type="reset"
              onClick={resetQuiz}
            >
              <RepeatIcon />
            </Button>
          )}
          {questions.map((question, index) => {
            return (
              <div key={question.id}>
                <Heading
                  as="h2"
                  size="sm"
                  p={1}
                >
                  <Flex
                    gap={3}
                    alignItems="stretch"
                  >
                    {index + 1 + ". "}
                    {question.title}
                    {isFinished &&
                      (selectedAnswers.get(question.id) ===
                      answers.find(
                        (answer) =>
                          answer.correct_answer &&
                          answer.question_id === question.id
                      )?.id ? (
                        <CheckCircleIcon
                          color="green.500"
                          boxSize={5}
                        />
                      ) : (
                        <FaMinusCircle
                          className="fa fa-lg"
                          color="red"
                        />
                      ))}
                  </Flex>
                </Heading>
                <hr />
                <Controller
                  control={control}
                  name={question.id}
                  render={(field) => (
                    <QuizRadioGroup
                      question={question}
                      field={field}
                      isFinished={isFinished}
                      selectedAnswers={selectedAnswers}
                      groupedAnswers={groupedAnswers}
                      handleSelectAnswer={handleSelectAnswer}
                    />
                  )}
                />
                <br />
              </div>
            );
          })}
          <Button
            onClick={() => handleFinishQuiz()}
            isDisabled={isFinished}
          >
            Finish quiz
          </Button>
        </chakra.form>
      )}
      {score !== undefined && (
        <QuizResultSection
          score={score}
          questionCount={questions.length}
          averageScore={quiz.average_score || 0}
        />
      )}
    </Flex>
  );
}