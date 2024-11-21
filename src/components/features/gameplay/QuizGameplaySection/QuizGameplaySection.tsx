"use client";
import QuizGameplayHeader from "../QuizGameplayHeader/QuizGameplayHeader";
import QuizResultSection from "../QuizResultSection/QuizResultSection";
import QuizTimer from "../QuizTimer/QuizTimer";
import { updateQuizPlay } from "../../../shared/utils/actions/quiz/updateQuizPlay";
import { MutableRefObject, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Flex, Heading, chakra } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { Quiz } from "@/app/typings/quiz";
import { User } from "@/app/typings/user";
import { Answer } from "@/app/typings/answer";
import { Question } from "@/app/typings/question";
import { Result } from "@/app/typings/result";
import { v4 as uuidv4 } from "uuid";
import { updateLeaderboard } from "@/components/shared/utils/actions/leaderboard/updateLeaderboard";
import { ConfettiComponent as Confetti } from "@/components/core/Confetti/Confetti";
import { formatToSeconds } from "@/components/shared/utils/formatToSeconds";
import clsx from "clsx";
import { Swiper } from "swiper/react";
import { SwiperSlide } from "swiper/react";
import { Swiper as SwiperCore } from 'swiper';
import { Keyboard, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./QuizGameplaySection.css";
import RadioGroup from "./components/RadioGroup";

interface IQuizGameplayProps {
  quiz: Quiz;
  user: User;
  questions: Question[];
  answers: Answer[];
  setActiveTab: (index: number) => void;
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
  setActiveTab,
}: IQuizGameplayProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<
    Map<string, string | null>
  >(initializeSelectedAnswers(questions));
  const [score, setScore] = useState<number>();
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [isTopResult, setIsTopResult] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { control, reset, setValue } = useForm();
  const swiperRef = useRef<SwiperCore | null>(null) as MutableRefObject<SwiperCore | null>;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const correctAnswers = useMemo(() => answers?.filter(answer => answer.correct_answer), [answers]);

  const pagination = {
    clickable: true,
    renderBullet: function (index: number, className: string) {
      const isSelected = selectedAnswers.get(questions[index].id) !== null;
      const isCorrect = correctAnswers.some(answer => answer.question_id === questions[index].id && answer.id === selectedAnswers.get(questions[index].id));
      return `<span 
        class="${clsx({
          [className]: true,
          'selectedAnswer': !isFinished && isSelected,
          'correctAnswer': isFinished && isCorrect,
          'wrongAnswer': isFinished && !isCorrect
        })}"
        >${index + 1}  
      </span>`;
    }
  };

  const groupedAnswers = useMemo(
    () =>
      answers?.reduce((acc, answer) => {
        acc[answer.question_id] = acc[answer.question_id] || [];
        acc[answer.question_id].push(answer);
        return acc;
      }, {} as { [key: string]: Answer[] }),
    [answers]
  );

  const handleSelectAnswer = (questionId: string, answerId: string) => {
    setSelectedAnswers((prev) => new Map(prev.set(questionId, answerId)));
    setValue(questionId, answerId);
  
    if (!isTransitioning && swiperRef.current !== null) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
  
      timeoutRef.current = setTimeout(() => {
        if (!swiperRef.current || !swiperRef.current.pagination) {
          return;
        }
        swiperRef.current.pagination.render();
        swiperRef.current.slideNext();
        timeoutRef.current = null;
      }, 500);
    }
  };
  

  const handleFinishQuiz = async (totalSeconds: number) => {
    setIsFinished(true);
    const totalScore = Array.from(selectedAnswers).reduce(
      (score, [questionId, answerId]) => {
        const correctAnswer = correctAnswers.find(answer => answer.question_id === questionId);
        return correctAnswer?.id === answerId ? score + 1 : score;
      },
      0
    );
    setScore(totalScore);
    swiperRef.current?.pagination.render();
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
    }, 10000);
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
    setTimeout(() => {
      if (swiperRef.current) {
        swiperRef.current.pagination.render();
        swiperRef.current.slideTo(0);
      }
    }, 0);
  };

  return (
    <Flex
      gap={1}
      wrap="wrap"
      flexDirection="column"
      width="600px"
    >
      {
        isTopResult && <Button
          position="fixed"
          bottom="50%"
          right="20px"
          fontSize="12px"
          colorPalette="green"
          onClick={() => setActiveTab(1)}
          wordBreak="break-word"
          w="150px"
          whiteSpace="normal"
          className="fa-fade"
        >
          High Score! Go to leaderboard
          <i className="fa-solid fa-arrow-right"></i>
        </Button>
      }
      <Confetti isShown={isTopResult} />
      <Flex justifyContent="space-between" alignItems="center">
        <QuizGameplayHeader
          quiz={quiz}
          user={user}
        >
          <QuizTimer
            key={resetKey}
            quizTime={formatToSeconds(quiz.time)}
            hasStarted={hasStarted}
            isFinished={isFinished}
            handleFinishQuiz={handleFinishQuiz}
          />
        </QuizGameplayHeader>
        {score !== undefined && (
          <QuizResultSection
            score={score}
            questionCount={questions.length}
            averageScore={quiz.average_score || 0}
          />
        )}
      </Flex>
      {!hasStarted ? (
        <Flex flex={1} justifyContent="center" alignItems="center" flexWrap="wrap" direction="column">
          <Flex alignItems="center" flex={1}>
            <Button px={12} onClick={() => setHasStarted(true)} >Start quiz</Button>
          </Flex>
          <chakra.div flex={1}>
          </chakra.div>
        </Flex>
      ) : (
        <chakra.form width="100%">
          <Swiper
            pagination={pagination}
            modules={[Pagination, Keyboard]}
            keyboard={{
              enabled: true
            }}
            className="mySwiper swiper"
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onTransitionStart={() => setIsTransitioning(true)}
            onTransitionEnd={() => setIsTransitioning(false)}
          >
            {questions.map((question, index) => {
              return (
                <SwiperSlide key={question.id} onFocus={() => {
                  if (!swiperRef.current) return;
                  swiperRef.current.el.scrollLeft = 0;
                  swiperRef.current?.slideTo(index);
                }}>
                  <Heading
                    as="h2"
                    size="sm"
                    p={3}
                    bg="#333333"
                    color="whitesmoke"
                    textAlign="center"
                  >
                    {index + 1 + ". " + question.title}
                  </Heading>
                  <hr />
                  <Controller
                    control={control}
                    name={question.id}
                    render={({field}) => (
                      <RadioGroup 
                        field={field}
                        question={question} 
                        isFinished={isFinished} 
                        selectedAnswers={selectedAnswers} 
                        groupedAnswers={groupedAnswers} 
                        handleSelectAnswer={handleSelectAnswer}
                        resetKey={resetKey}
                      />
                    )}
                  />
                  <br />
                </SwiperSlide>
              );
            })}
          </Swiper>
          <Flex justifyContent="space-between">
            <Button
              onClick={() => setIsFinished(true)}
              disabled={isFinished}
            >
              Finish quiz
            </Button>
            {isFinished && (
              <Button
                type="reset"
                onClick={resetQuiz}
              >
                <i className="fa-solid fa-repeat"></i>
              </Button>
            )}
          </Flex>
        </chakra.form>
      )}
    </Flex>
  );
}
