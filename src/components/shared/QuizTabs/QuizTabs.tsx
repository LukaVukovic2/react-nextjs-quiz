"use client";
import { QuestionType } from "@/app/typings/question";
import { QuizContent } from "@/app/typings/quiz";
import { Result } from "@/app/typings/result";
import { User } from "@/app/typings/user";
import QuizGameplaySection from "@/components/features/gameplay/QuizGameplaySection/QuizGameplaySection";
import QuizLeaderboard from "@/components/features/leaderboard/QuizLeaderboard/QuizLeaderboard";
import { chakra, Tabs } from "@chakra-ui/react";
import { useState } from "react";
import "./QuizTabs.css"
import QuizReviewForm from "@/components/features/reviews/QuizReviewForm/QuizReviewForm";
import QuizReviewList from "@/components/features/reviews/QuizReviewList/QuizReviewList";
import { Review } from "@/app/typings/review";
import { useUser } from "../utils/hooks/useUser";

interface IQuizTabsProps {
  quizContent: QuizContent,
  topResults: Result[];
  questTypes: QuestionType[];
  reviews: {
    reviewDetails: Review;
    reviewer: User;
  }[];
}

export default function QuizTabs({
  quizContent,
  topResults,
  questTypes,
  reviews
}: IQuizTabsProps) {
  const [isHighlightedTab, setIsHighlightTab] = useState(false);
  const highlightTab = (value: boolean) => setIsHighlightTab(value);
  const { user: activeUser } = useUser();

  return (
    <Tabs.Root
      fitted
      variant="enclosed"
      defaultValue="Gameplay"
    >
      <Tabs.List mb="1em">
        <Tabs.Trigger value="Gameplay">Gameplay</Tabs.Trigger>
        <Tabs.Trigger 
          value="Leaderboard"
          className={`tab ${isHighlightedTab ? 'highlighted fa-fade' : ''}`}
        >
          Leaderboard
        </Tabs.Trigger>
        <Tabs.Trigger value="Reviews">Reviews</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="Gameplay" p={0}>
        {quizContent.questions && quizContent.answers ? (
          <QuizGameplaySection
            quizContent={quizContent}
            questTypes={questTypes}
            highlightTab={highlightTab}
            isTopResult={isHighlightedTab}
          />
        ) : (
          "Data not found"
        )}
      </Tabs.Content>
      <Tabs.Content value="Leaderboard">
        <QuizLeaderboard 
          topResults={topResults} 
          activeUser={activeUser as User | null} 
        />
      </Tabs.Content>
      <Tabs.Content value="Reviews">
        <chakra.div width="600px">
          <QuizReviewForm />
          <QuizReviewList 
            id={quizContent.quiz.id} 
            reviews={reviews}
          />
        </chakra.div>
      </Tabs.Content>
    </Tabs.Root>
  );
}