"use client";
import { Answer } from "@/app/typings/answer";
import { Question, QuestionType } from "@/app/typings/question";
import { QuizDetails } from "@/app/typings/quiz";
import { Result } from "@/app/typings/result";
import { User } from "@/app/typings/user";
import QuizGameplaySection from "@/components/features/gameplay/QuizGameplaySection/QuizGameplaySection";
import QuizLeaderboard from "@/components/features/leaderboard/QuizLeaderboard/QuizLeaderboard";
import { Flex, Tabs } from "@chakra-ui/react";
import { useState } from "react";
import "./QuizTabs.css"
import QuizReviewForm from "@/components/features/reviews/QuizReviewForm/QuizReviewForm";
import QuizReviewList from "@/components/features/reviews/QuizReviewList/QuizReviewList";
import { Review } from "@/app/typings/review";
import { useUser } from "../utils/hooks/useUser";

interface IQuizTabsProps {
  quizData: {
    quiz: QuizDetails;
    questions: Question[];
    answers: Answer[];
    user: User;
  },
  topResults: Result[];
  questTypes: QuestionType[];
  reviews: {
    reviewDetails: Review;
    reviewer: User;
  }[];
}

export default function QuizTabs({
  quizData: { quiz, questions, answers, user },
  topResults,
  questTypes,
  reviews
}: IQuizTabsProps) {
  const [value, setValue] = useState("Gameplay");
  const switchTab = (tab: "Gameplay" | "Leaderboard" | "Reviews") => setValue(tab);
  const { user: activeUser } = useUser();

  return (
    <Tabs.Root
      fitted
      variant="enclosed"
      value={value}
      onValueChange={(e) => setValue(e.value)}
    >
      <Tabs.List mb="1em">
        <Tabs.Trigger value="Gameplay">Gameplay</Tabs.Trigger>
        <Tabs.Trigger value="Leaderboard">Leaderboard</Tabs.Trigger>
        <Tabs.Trigger value="Reviews">Reviews</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="Gameplay" p={0}>
        {questions && answers ? (
          <QuizGameplaySection
            user={user}
            quiz={quiz}
            questions={questions}
            answers={answers}
            questTypes={questTypes}
            switchTab={switchTab}
          />
        ) : (
          "Data not found"
        )}
      </Tabs.Content>
      <Tabs.Content value="Leaderboard">
        <QuizLeaderboard topResults={topResults} activeUser={activeUser as User | null} />
      </Tabs.Content>
      <Tabs.Content value="Reviews">
        <Flex width="600px" flexDirection="column">
          <QuizReviewForm />
          <QuizReviewList id={user.id} reviews={reviews}/>
        </Flex>
      </Tabs.Content>
    </Tabs.Root>
  );
}