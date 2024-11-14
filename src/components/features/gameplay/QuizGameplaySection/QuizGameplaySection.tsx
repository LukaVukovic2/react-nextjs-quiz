"use client";
import QuizGameplayHeader from "../QuizGameplayHeader/QuizGameplayHeader";
import QuizResultSection from "../QuizResultSection/QuizResultSection";
import QuizTimer from "../QuizTimer/QuizTimer";
import QuizRadioGroup from "./components/QuizRadioGroup";
import { updateQuizPlay } from "../../../shared/utils/actions/quiz/updateQuizPlay";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaMinusCircle } from "react-icons/fa";
import { Flex, Button, Heading, Box } from "@chakra-ui/react";
import { chakra } from "@chakra-ui/react";
import { CheckCircleIcon, RepeatIcon } from "@chakra-ui/icons";
import { Quiz } from "@/app/typings/quiz";
import { User } from "@/app/typings/user";
import { Answer } from "@/app/typings/answer";
import { Question } from "@/app/typings/question";
import { Result } from "@/app/typings/result";
import {v4 as uuidv4} from "uuid";
import { updateLeaderboard } from "@/components/shared/utils/actions/leaderboard/updateLeaderboard";
import { ConfettiComponent as Confetti } from "@/components/core/Confetti/Confetti";
import { formatToSeconds } from "@/components/shared/utils/formatToSeconds";

interface IQuizGameplayProps {
  quiz: Quiz;
  user: User;
  questions: Question[];
  answers: Answer[];
}

const initializeSelectedAnswers = (questions: Question[]): Map<string, string | null> => {
  const map = new Map<string, string | null>();
  questions.forEach((question) => map.set(question.id, null));
  return map;
};

export default function QuizGameplaySection({quiz, user, questions, answers}: IQuizGameplayProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Map<string, string | null>>(initializeSelectedAnswers(questions));
  const [score, setScore] = useState<number>();
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [isTopResult, setIsTopResult] = useState(false);
  const { control, reset, setValue } = useForm();

  const groupedAnswers = useMemo(() => answers?.reduce((acc, answer) => {
    acc[answer.question_id] = acc[answer.question_id] || [];
    acc[answer.question_id].push(answer);
    return acc;
  }, {} as { [key: string]: Answer[] }), [answers]);

  const handleSelectAnswer = (questionId: string, answerId: string) => {
    setSelectedAnswers((prev) => new Map(prev.set(questionId, answerId)));
    setValue(questionId, answerId);
  };

  const handleFinishQuiz = async (totalSeconds: number) => {
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
    updateQuizPlay(
      quiz.id,
      quiz.plays,
      quiz.average_score,
      totalScore / questions.length
    );
    const result: Result = {
      id: uuidv4(),
      quiz_id: quiz.id,
      user_id: user.id,
      score: totalScore,
      time: totalSeconds || 0,
    };
    const success = await updateLeaderboard(result);
    setIsTopResult(success);
    const timeout = setTimeout(() => {
      setIsTopResult(false);
    }, 5000);
    return () => clearTimeout(timeout);
  };

  const resetQuiz = () => {
    setSelectedAnswers(initializeSelectedAnswers(questions));
    setScore(undefined);
    setIsFinished(false);
    setHasStarted(true);
    setResetKey((prev) => prev + 1);
    setIsTopResult(false);
    reset();
  };

  return (
    <Flex
      flexDir="column"
      gap={1}
      maxWidth="600px"
    >
      <Confetti isShown={isTopResult} />
      <QuizGameplayHeader quiz={quiz} user={user}>
        <QuizTimer
          key={resetKey}
          quizTime={formatToSeconds(quiz.time)}
          hasStarted={hasStarted}
          isFinished={isFinished}
          handleFinishQuiz={handleFinishQuiz}
        />
      </QuizGameplayHeader>
      {!hasStarted ? (
        <div>
          <Button onClick={() => setHasStarted(true)}>Start quiz</Button>
        </div>
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
              <Box key={question.id}>
                <Heading
                  as="h2"
                  size="sm"
                  p={1}
                >
                  <Flex
                    gap={3}
                    alignItems="stretch"
                  >
                    {index + 1 + ". " + question.title}
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
              </Box>
            );
          })}
          <Button
            onClick={() => setIsFinished(true)}
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