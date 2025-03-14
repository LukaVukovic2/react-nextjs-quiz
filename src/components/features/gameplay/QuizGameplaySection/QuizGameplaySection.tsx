"use client";
import QuizGameplayHeader from "../QuizGameplayHeader/QuizGameplayHeader";
import QuizResultSection from "../QuizResultSection/QuizResultSection";
import QuizTimer from "../QuizTimer/QuizTimer";
import { updateQuizPlay } from "../../../shared/utils/actions/quiz/updateQuizPlay";
import { MutableRefObject, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Flex, chakra } from "@chakra-ui/react";
import { Button } from "@/styles/theme/components/button";
import { QuizDetails } from "@/app/typings/quiz";
import { User } from "@/app/typings/user";
import { Answer } from "@/app/typings/answer";
import { Question, QuestionType } from "@/app/typings/question";
import { Result } from "@/app/typings/result";
import { v4 as uuidv4 } from "uuid";
import { updateLeaderboard } from "@/components/shared/utils/actions/leaderboard/updateLeaderboard";
import { ConfettiComponent as Confetti } from "@/components/core/Confetti/Confetti";
import { formatToSeconds } from "@/components/shared/utils/formatTime";
import { Swiper as SwiperCore } from "swiper";
import { initializeSelectedAnswers } from "@/components/shared/utils/initializeSelectedAnswers";
import { groupAnswersByQuestion } from "@/components/shared/utils/groupAnswersByQuestion";
import { calculateScore } from "@/components/shared/utils/calculateScore";
import renderBullet from "@/components/shared/utils/renderBullet";
import QuizGameplayFooter from "../QuizGameplayFooter/QuizGameplayFooter";
import QuizGameplaySwiper from "../QuizGameplaySwiper/QuizGameplaySwiper";
import QuizPauseModal from "../QuizPauseModal/QuizPauseModal";
import "swiper/css/pagination";
import "swiper/css";
import "./QuizGameplaySection.css";
import AuthModal from "@/components/shared/AuthModal/AuthModal";
import { getCookie, setCookie } from "cookies-next";
import { topResultCheck } from "@/components/shared/utils/actions/leaderboard/topResultCheck";
import AlertWrapper from "@/components/core/AlertWrapper/AlertWrapper";
import { useUser } from "@/components/shared/utils/hooks/useUser";

interface IQuizGameplayProps {
  quiz: QuizDetails;
  user: User;
  questions: Question[];
  answers: Answer[];
  questTypes: QuestionType[];
  switchTab: (tab: "Gameplay" | "Leaderboard" | "Reviews") => void;
}

export default function QuizGameplaySection({
  quiz,
  user,
  questions,
  answers,
  questTypes,
  switchTab,
}: IQuizGameplayProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<
    Map<string, string[] | null>
  >(initializeSelectedAnswers(questions));
  const [score, setScore] = useState<number>();
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [isTopResult, setIsTopResult] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const { control, reset, setValue } = useForm();
  const swiperRef = useRef<SwiperCore | null>(
    null
  ) as MutableRefObject<SwiperCore | null>;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { user: player } = useUser();
  const isAnonymous = getCookie("isAnonymous") === "true" || false;

  const correctAnswers = useMemo(
    () => answers?.filter((answer) => answer.correct_answer),
    [answers]
  );
  const groupedAnswers = useMemo(
    () => groupAnswersByQuestion(answers),
    [answers]
  );

  const pagination = {
    clickable: true,
    renderBullet: function (index: number, className: string) {
      return renderBullet({
        index,
        className,
        selectedAnswers,
        questions,
        correctAnswers,
        questTypes,
        isFinished,
      });
    },
  };

  const handleSelectAnswer = (
    questionId: string,
    answerId: string[],
    questionType: string
  ) => {
    setSelectedAnswers((prev) => new Map(prev.set(questionId, answerId)));
    setValue(questionId, answerId);

    if (!isTransitioning && swiperRef.current !== null) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        if (!swiperRef.current || !swiperRef.current.pagination) return;

        swiperRef.current.pagination.render();
        if (questionType === "Single choice") swiperRef.current.slideNext();
        timeoutRef.current = null;
      }, 500);
    }
  };

  const handleFinishQuiz = async (totalSeconds: number) => {
    setIsFinished(true);
    const totalScore = calculateScore(
      selectedAnswers,
      correctAnswers,
      questions,
      questTypes
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
      user_id: player?.id ?? "",
      score: totalScore,
      time: totalSeconds || 0,
    };

    if (isAnonymous) {
      const isTopResult = await topResultCheck(result);
      if (!isTopResult) return;

      const existingResults = JSON.parse(
        getCookie("results") || "[]"
      );
      const newResults = [...existingResults, result];
      setCookie("results", JSON.stringify(newResults), 
        { maxAge: 60 * 60 * 24 }
      );
      setDialogVisible(true);
    } else {
      const success = await updateLeaderboard(result);
      setIsTopResult(success);
      const timeout = setTimeout(() => {
        setIsTopResult(false);
      }, 10000);
      return () => clearTimeout(timeout);
    }
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
      {dialogVisible && (
        <AuthModal
          dialogVisible={dialogVisible}
          setDialogVisible={setDialogVisible}
        >
          <AlertWrapper
            title="You have finished the quiz as a guest. Please log in or sign up to save your result"
            status="info"
          />
        </AuthModal>
      )}

      {isTopResult && (
        <Button
          visual="success"
          onClick={() => switchTab("Leaderboard")}
          className="fa-fade"
          position="fixed"
          bottom="50%"
          right="20px"
          w="150px"
        >
          High Score! Go to leaderboard
          <i className="fa-solid fa-arrow-right"></i>
        </Button>
      )}
      <Confetti isShown={isTopResult} />

      <Flex
        justifyContent="space-between"
        alignItems="center"
      >
        <QuizGameplayHeader
          quiz={quiz}
          user={user}
        >
          <QuizTimer
            key={resetKey}
            quizTime={formatToSeconds(+quiz.time)}
            hasStarted={hasStarted}
            isFinished={isFinished}
            handleFinishQuiz={handleFinishQuiz}
            isPaused={isPaused}
          />
        </QuizGameplayHeader>
        {score !== undefined && (
          <QuizResultSection
            score={score}
            questionCount={questions.length}
            averageScore={quiz.average_score}
          />
        )}
      </Flex>

      {!hasStarted ? (
        <Flex
          flex={1}
          justifyContent="center"
          alignItems="center"
          flexWrap="wrap"
          direction="column"
        >
          <Flex
            alignItems="center"
            flex={1}
          >
            <Button onClick={() => setHasStarted(true)}>Start quiz</Button>
          </Flex>
          <chakra.div flex={1}></chakra.div>
        </Flex>
      ) : (
        <chakra.form width="100%">
          <QuizGameplaySwiper
            questions={questions}
            questTypes={questTypes}
            selectedAnswers={selectedAnswers}
            groupedAnswers={groupedAnswers}
            isFinished={isFinished}
            handleSelectAnswer={handleSelectAnswer}
            resetKey={resetKey}
            setIsTransitioning={setIsTransitioning}
            pagination={pagination}
            swiperRef={swiperRef}
            control={control}
          />
          <QuizGameplayFooter
            isFinished={isFinished}
            setIsFinished={setIsFinished}
            resetQuiz={resetQuiz}
            setIsPaused={setIsPaused}
          />
        </chakra.form>
      )}
      <QuizPauseModal
        isPaused={isPaused}
        setIsPaused={setIsPaused}
        title={quiz.title}
      />
    </Flex>
  );
}