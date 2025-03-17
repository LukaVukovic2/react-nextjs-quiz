"use client";
import QuizGameplayHeader from "../QuizGameplayHeader/QuizGameplayHeader";
import QuizResultSection from "../QuizResultSection/QuizResultSection";
import QuizTimer from "../QuizTimer/QuizTimer";
import { updateQuizPlay } from "../../../shared/utils/actions/quiz/updateQuizPlay";
import { MutableRefObject, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Flex, chakra } from "@chakra-ui/react";
import { Button } from "@/styles/theme/components/button";
import { QuizContent } from "@/app/typings/quiz";
import { QuestionType } from "@/app/typings/question";
import { Result } from "@/app/typings/result";
import { v4 as uuidv4 } from "uuid";
import { updateLeaderboard } from "@/components/shared/utils/actions/leaderboard/updateLeaderboard";
import { ConfettiComponent as Confetti } from "@/components/core/Confetti/Confetti";
import { Swiper as SwiperCore } from "swiper";
import { initializeSelectedAnswers } from "@/components/shared/utils/initializeSelectedAnswers";
import { groupAnswersByQuestion } from "@/components/shared/utils/groupAnswersByQuestion";
import { calculateScore } from "@/components/shared/utils/calculateScore";
import QuizGameplayFooter from "../QuizGameplayFooter/QuizGameplayFooter";
import QuizGameplaySwiper from "../QuizGameplaySwiper/QuizGameplaySwiper";
import QuizPauseModal from "../QuizPauseModal/QuizPauseModal";
import "swiper/css/pagination";
import "swiper/css";
import "./QuizGameplaySection.css";
import AuthModal from "@/components/shared/AuthModal/AuthModal";
import { topResultCheck } from "@/components/shared/utils/actions/leaderboard/topResultCheck";
import AlertWrapper from "@/components/core/AlertWrapper/AlertWrapper";
import { useUser } from "@/components/shared/utils/hooks/useUser";
import { addToCookieList } from "@/components/shared/utils/addToCookieList";
import { PlayStatus } from "@/app/typings/playStatus";

interface IQuizGameplayProps {
  quizContent: QuizContent;
  questTypes: QuestionType[];
  highlightTab: (value: boolean) => void;
  isTopResult: boolean;
}

export default function QuizGameplaySection({
  quizContent: { quiz, questions, answers, user },
  questTypes,
  highlightTab,
  isTopResult
}: IQuizGameplayProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<
    Map<string, string[] | null>
  >(initializeSelectedAnswers(questions));
  const [score, setScore] = useState<number | null>(null);
  const [playStatus, setPlayStatus] = useState<PlayStatus>("playing"); 
  const [resetKey, setResetKey] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const { control, reset, setValue } = useForm();
  const swiperRef = useRef<SwiperCore | null>(
    null
  ) as MutableRefObject<SwiperCore | null>;
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

    if (player?.is_anonymous) {
      const isTopResult = await topResultCheck(result);
      if (!isTopResult) return;
      addToCookieList("results", result);
      setDialogVisible(true);
    } else {
      const success = await updateLeaderboard(result);
      highlightTab(success);
      const timeout = setTimeout(() => {
        highlightTab(false);
      }, 10000);
      return () => clearTimeout(timeout);
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
      <Confetti isShown={isTopResult} />
      
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
        >
          <QuizTimer
            key={resetKey}
            quizTime={+quiz.time}
            handleFinishQuiz={handleFinishQuiz}
            playStatus={playStatus}
          />
        </QuizGameplayHeader>
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