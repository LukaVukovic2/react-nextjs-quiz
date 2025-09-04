"use client";
import { QuestionType } from "@/typings/question";
import { QuizContent } from "@/typings/quiz";
import { Result } from "@/typings/result";
import { User } from "@/typings/user";
import QuizGameplaySection from "@/components/features/gameplay/QuizGameplaySection/QuizGameplaySection";
import { Flex, Tabs } from "@chakra-ui/react";
import { lazy, Suspense, useState } from "react";
import styles from "./QuizLayout.module.css";
import { Review } from "@/typings/review";
import { useUser } from "@/utils/hooks/useUser";
import LoadingSpinner from "@/components/core/LoadingSpinner/LoadingSpinner";
import { ConfettiComponent as Confetti } from "@/components/core/Confetti/Confetti";
const QuizLeaderboard = lazy(
  () =>
    import("@/components/features/leaderboard/QuizLeaderboard/QuizLeaderboard")
);
const QuizReviewForm = lazy(
  () => import("@/components/features/reviews/QuizReviewForm/QuizReviewForm")
);
const QuizReviewList = lazy(
  () => import("@/components/features/reviews/QuizReviewList/QuizReviewList")
);

interface IQuizLayoutProps {
  quizContent: QuizContent;
  topResults: Result[];
  questTypes: QuestionType[];
  reviews: {
    reviewDetails: Review;
    reviewer: User;
  }[];
}

export default function QuizLayout({
  quizContent,
  topResults,
  questTypes,
  reviews,
}: IQuizLayoutProps) {
  const [isTopResult, setIsTopResult] = useState(false);
  const highlightTab = (value: boolean) => setIsTopResult(value);
  const { user: activeUser } = useUser();

  return (
    <Tabs.Root
      lazyMount
      fitted
      variant="plain"
      defaultValue="Gameplay"
    >
      <Tabs.List
        bg="bg.muted"
        rounded="l3"
        p="1"
        mb="1em"
      >
        <Tabs.Trigger value="Gameplay">Gameplay</Tabs.Trigger>
        <Tabs.Trigger
          value="Leaderboard"
          className={`${styles.tab} ${isTopResult ? styles.highlighted + " fa-fade" : ""}`}
        >
          Leaderboard
        </Tabs.Trigger>
        <Tabs.Trigger value="Reviews">Reviews</Tabs.Trigger>
        <Tabs.Indicator rounded="l2" />
      </Tabs.List>
      <Flex
        justify="center"
        flex={1}
      >
        <Tabs.Content value="Gameplay">
          <QuizGameplaySection
            quizContent={quizContent}
            questTypes={questTypes}
            highlightTab={highlightTab}
          />
        </Tabs.Content>
        <Tabs.Content value="Leaderboard">
          <Suspense
            fallback={<LoadingSpinner text="Loading leaderboard stats..." />}
          >
            <QuizLeaderboard
              topResults={topResults}
              activeUser={activeUser as User | null}
            />
          </Suspense>
        </Tabs.Content>
        <Tabs.Content value="Reviews">
          <Suspense fallback={<LoadingSpinner text="Loading reviews..." />}>
            <Flex
              maxWidth="600px"
              direction="column"
            >
              <QuizReviewForm />
              <QuizReviewList
                id={quizContent.quiz.id}
                reviews={reviews}
              />
            </Flex>
          </Suspense>
        </Tabs.Content>
      </Flex>
      <Confetti isShown={isTopResult} />
    </Tabs.Root>
  );
}
