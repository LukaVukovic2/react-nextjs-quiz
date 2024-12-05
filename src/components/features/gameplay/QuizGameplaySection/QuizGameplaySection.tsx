"use client";
import QuizGameplayHeader from "../QuizGameplayHeader/QuizGameplayHeader";
import QuizResultSection from "../QuizResultSection/QuizResultSection";
import QuizTimer from "../QuizTimer/QuizTimer";
import { updateQuizPlay } from "../../../shared/utils/actions/quiz/updateQuizPlay";
import { MutableRefObject, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Flex, chakra } from "@chakra-ui/react";
import { Heading } from "@/styles/theme/components/heading";
import { Button } from "@/styles/theme/components/button";
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
import RadioGroup from "./components/RadioGroup";
import { QuestionType } from "@/app/typings/question_type";
import { Swiper } from "swiper/react";
import { SwiperSlide } from "swiper/react";
import { Swiper as SwiperCore } from 'swiper';
import { Keyboard, Pagination } from "swiper/modules";
import "swiper/css/pagination";
import "swiper/css";
import "./QuizGameplaySection.css";
import CheckboxGroup from "./components/CheckboxGroup";
import ShortAnswerInput from "./components/ShortAnswerInput";

interface IQuizGameplayProps {
  quiz: Quiz;
  user: User;
  questions: Question[];
  answers: Answer[];
  questTypes: QuestionType[];
  setActiveTab: (index: number) => void;
}

const initializeSelectedAnswers = (
  questions: Question[]
): Map<string, string[] | null> => {
  const map = new Map<string, string[] | null>();
  questions.forEach((question) => map.set(question.id, null));
  return map;
};

export default function QuizGameplaySection({
  quiz,
  user,
  questions,
  answers,
  questTypes,
  setActiveTab,
}: IQuizGameplayProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<
    Map<string, string[] | null>
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
      const selectedQuestionAns = selectedAnswers.get(questions[index].id);
      const correctAnswersForQuestion = correctAnswers.filter(answer => answer.question_id === questions[index].id);
      const isSelected = selectedQuestionAns !== null;
      const selectedAnswersArr = Array.isArray(selectedQuestionAns) ? selectedQuestionAns : [];
      const typeName = questTypes.find(type => type.id === questions[index].id_quest_type)?.type_name;
      let isCorrect = false;
      let hasIncorrectAnswers = false;
      let hasCorrectAnswers = false;
      let hasCorrectAnswerNotSelected = false;

      if (typeName === "Short answer") {
        const acceptableAnswers = correctAnswers
          .filter(answer => answer.question_id === questions[index].id)
          .map(answer => answer.answer.toLowerCase());
        const userInput = String(selectedQuestionAns).toLowerCase().trim();
        isCorrect = acceptableAnswers.some(answer => answer === userInput);
      } else if (typeName === "Single choice") {
        isCorrect = String(selectedQuestionAns) === correctAnswersForQuestion[0]?.id;
      } else if (typeName === "Multiple choice") {
        hasIncorrectAnswers = selectedAnswersArr.some(id => !correctAnswersForQuestion.some(ans => ans.id === id));
        hasCorrectAnswers = correctAnswersForQuestion.some(answer => selectedAnswersArr.includes(answer.id));
        hasCorrectAnswerNotSelected = correctAnswersForQuestion.some(answer => !selectedAnswersArr.includes(answer.id));
      }
      return `
        <span 
          class="${clsx({
            [className]: true,
            'selectedAnswer': !isFinished && isSelected,
            'correctAnswer': isFinished && (isCorrect || (!hasIncorrectAnswers && hasCorrectAnswers && !hasCorrectAnswerNotSelected)),
            'partiallyCorrect': isFinished && hasCorrectAnswers && (hasIncorrectAnswers || hasCorrectAnswerNotSelected),
            'wrongAnswer': isFinished && !isCorrect
          })}"
          >${index + 1}  
        </span>
      `;
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

  const calculateScore = () => {
    let totalScore = 0;

    Array.from(selectedAnswers).forEach(([questionId, selected]) => {
      const correctAnswersForQuestion = correctAnswers.filter(
        (answer) => answer.question_id === questionId
      );

      const typeId = questions.find((q) => q.id === questionId)?.id_quest_type;
      const questionType = questTypes.find((type) => type.id === typeId)?.type_name;
      const selectedArr = Array.isArray(selected) ? selected : [];

      if (questionType === "Single choice" || questionType === "Multiple choice") {
        const correctIds = correctAnswersForQuestion.map((answer) => answer.id);
        const correctSelections = correctIds.filter((id) => selected?.includes(id)).length;
        const incorrectSelections = selectedArr?.filter((id) => !correctIds.includes(id)).length || 0;
        const isNegativeQuestionScore = incorrectSelections > correctSelections;
        const questionScore = 
          (isNegativeQuestionScore ? 0 : correctSelections - incorrectSelections) / (correctIds.length || 1);
        totalScore += questionScore;
      } else if (questionType === "Short answer") {
        const acceptableAnswers = correctAnswersForQuestion.map((answer) => answer.answer.toLowerCase());
        const userInput = String(selected).toLowerCase().trim();

        const isCorrect = acceptableAnswers.some((answer) => answer === userInput);

        totalScore += isCorrect ? 1 : 0;
      } else {
        console.warn(`Unknown question type for question ID: ${questionId}`);
      }
    });

    return totalScore;
  };

  const handleSelectAnswer = (questionId: string, answerId: string[]) => {
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
    const totalScore = calculateScore();
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
          visual="success"
          onClick={() => setActiveTab(1)}
          className="fa-fade"
          position="fixed"
          bottom="50%"
          right="20px"
          w="150px"
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
            <Button onClick={() => setHasStarted(true)} >Start quiz</Button>
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
              const typeName = questTypes.find(type => type.id === question.id_quest_type)?.type_name;
              return (
                <SwiperSlide key={question.id} onFocus={() => {
                  if (!swiperRef.current) return;
                  swiperRef.current.el.scrollLeft = 0;
                  swiperRef.current?.slideTo(index);
                }}>
                  <Heading
                    as="h2"
                    size="h6"
                    visual="reversed"
                    textAlign="center"
                    p="{spacing.2}"
                  >
                    {index + 1 + ". " + question.title}
                  </Heading>
                  <Controller
                    control={control}
                    name={question.id}
                    render={({field}) => {
                      switch (typeName) {
                        case "Single choice": {
                          return (
                            <RadioGroup 
                              field={field}
                              question={question} 
                              isFinished={isFinished} 
                              selectedAnswers={selectedAnswers} 
                              groupedAnswers={groupedAnswers} 
                              handleSelectAnswer={handleSelectAnswer}
                              resetKey={resetKey}
                            />
                          );
                        }
                        case "Multiple choice": {
                          return (
                            <CheckboxGroup 
                              field={field}
                              question={question}
                              isFinished={isFinished}
                              selectedAnswers={selectedAnswers}
                              groupedAnswers={groupedAnswers}
                              handleSelectAnswer={handleSelectAnswer}
                              resetKey={resetKey}
                            />
                          )
                        }
                        default: {
                          return(
                            <ShortAnswerInput 
                              field={field}
                              isFinished={isFinished}
                              groupedAnswers={groupedAnswers}
                              handleSelectAnswer={handleSelectAnswer}
                              question={question}
                              resetKey={resetKey}
                            />
                          )
                        }
                    }}}
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
