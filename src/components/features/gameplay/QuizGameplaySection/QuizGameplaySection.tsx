"use client";
import QuizGameplayHeader from "../QuizGameplayHeader/QuizGameplayHeader";
import QuizResultSection from "../QuizResultSection/QuizResultSection";
import { updateQuizPlay } from "@/utils/actions/quiz/updateQuizPlay";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Flex, chakra } from "@chakra-ui/react";
import { Button } from "@/styles/theme/components/button";
import { QuizContent } from "@/typings/quiz";
import { QuestionType } from "@/typings/question";
import { Result } from "@/typings/result";
import { v4 as uuidv4 } from "uuid";
import { updateLeaderboard } from "@/utils/actions/leaderboard/updateLeaderboard";
import { Swiper } from "swiper";
import QuizGameplayFooter from "../QuizGameplayFooter/QuizGameplayFooter";
import QuizGameplaySwiper from "../QuizGameplaySwiper/QuizGameplaySwiper";
import QuizPauseModal from "../QuizPauseModal/QuizPauseModal";
import "swiper/css/pagination";
import "swiper/css";
import "./QuizGameplaySection.css";
import AuthModal from "@/components/shared/AuthModal/AuthModal";
import { topResultCheck } from "@/utils/actions/leaderboard/topResultCheck";
import AlertWrapper from "@/components/core/AlertWrapper/AlertWrapper";
import { useUser } from "@/utils/hooks/useUser";
import { PlayStatus } from "@/typings/playStatus";
import {
  manageSlideTransition,
  addToCookieList,
  calculateScore,
  groupAnswersByQuestion,
  initializeSelectedAnswers,
} from "./QuizGameplaySection.utils";

interface IQuizGameplayProps {
  quizContent: QuizContent;
  questTypes: QuestionType[];
  highlightTab: (value: boolean) => void;
}

export default function QuizGameplaySection({
  quizContent: { quiz, questions, answers, user },
  questTypes,
  highlightTab,
}: IQuizGameplayProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<
    Map<string, string[] | null>
  >(initializeSelectedAnswers(questions));
  const [score, setScore] = useState<number | null>(null);
  const [playStatus, setPlayStatus] = useState<PlayStatus>("uninitiated");
  const [resetKey, setResetKey] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const { control, reset, setValue } = useForm();
  const swiperRef = useRef<Swiper | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { user: player } = useUser();
  const correctAnswers = useMemo(
    () => answers?.filter((answer) => answer.correct_answer),
    [answers]
  );
  const groupedAnswers = useMemo(
    () => groupAnswersByQuestion(answers),
    [answers]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  const handleSelectAnswer = (
    questionId: string,
    answerId: string[],
    questionType: string
  ) => {
    setSelectedAnswers((prev) => new Map(prev.set(questionId, answerId)));
    setValue(questionId, answerId);
    manageSlideTransition(questionType, isTransitioning, swiperRef, timeoutRef);
  };

  const startQuiz = () => setPlayStatus("playing");

  const handleFinishQuiz = async (totalSeconds: number) => {
    setPlayStatus("finished");
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

    if (totalScore === 0) return;

    if (player?.is_anonymous) {
      const isTopResult = await topResultCheck(result);
      if (!isTopResult) return;
      addToCookieList("results", result);
      setDialogVisible(true);
    } else {
      const success = await updateLeaderboard(result);
      highlightTab(success);
      timeoutRef.current = setTimeout(() => {
        highlightTab(false);
      }, 10000);
    }
  };

  const resetQuiz = () => {
    setPlayStatus("playing");
    setSelectedAnswers(initializeSelectedAnswers(questions));
    setScore(null);
    setResetKey((prev) => prev + 1);
    highlightTab(false);
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

      <Flex
        justifyContent="space-between"
        alignItems="center"
      >
        <QuizGameplayHeader
          quiz={quiz}
          user={user}
          resetKey={resetKey}
          quizTime={+quiz.time}
          handleFinishQuiz={handleFinishQuiz}
          playStatus={playStatus}
        />

        {score !== null && (
          <QuizResultSection
            score={score}
            questionCount={questions.length}
            averageScore={quiz.average_score}
          />
        )}
      </Flex>

      {playStatus === "uninitiated" ? (
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
            <Button onClick={startQuiz}>Start quiz</Button>
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
            playStatus={playStatus}
            handleSelectAnswer={handleSelectAnswer}
            resetKey={resetKey}
            setIsTransitioning={setIsTransitioning}
            swiperRef={swiperRef}
            correctAnswers={correctAnswers}
            control={control}
          />

          <QuizGameplayFooter
            playStatus={playStatus}
            setPlayStatus={setPlayStatus}
            resetQuiz={resetQuiz}
          />
        </chakra.form>
      )}

      <QuizPauseModal
        playStatus={playStatus}
        setPlayStatus={setPlayStatus}
        title={quiz.title}
      />
    </Flex>
  );
}
