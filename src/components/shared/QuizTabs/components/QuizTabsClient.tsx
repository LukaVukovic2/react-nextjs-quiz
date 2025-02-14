"use client";
import { Answer } from "@/app/typings/answer";
import { Question } from "@/app/typings/question";
import { Quiz } from "@/app/typings/quiz";
import { Result } from "@/app/typings/result";
import { User } from "@/app/typings/user";
import LoadingSpinner from "@/components/core/LoadingSpinner/LoadingSpinner";
import QuizGameplaySection from "@/components/features/gameplay/QuizGameplaySection/QuizGameplaySection";
import QuizLeaderboard from "@/components/features/leaderboard/QuizLeaderboard/QuizLeaderboard";
import { Tabs } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { QuestionType } from "@/app/typings/question_type";
import "./QuizTabsClient.css"

interface IQuizTabsClientProps {
  quiz: Quiz;
  questions: Question[];
  user: User;
  answers: Answer[];
  topResults: Result[];
  questTypes: QuestionType[];
  children: React.ReactNode;
}

export default function QuizTabsClient({
  quiz,
  questions,
  user,
  answers,
  topResults,
  questTypes,
  children,
}: IQuizTabsClientProps) {
  const [loaded, setLoaded] = useState(false);
  const [value, setValue] = useState("Gameplay");

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) {
    return <LoadingSpinner text="Loading quiz data..." />;
  }
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
            setActiveTab={() => setValue("Leaderboard")}
          />
        ) : (
          "Data not found"
        )}
      </Tabs.Content>
      <Tabs.Content value="Leaderboard">
        <QuizLeaderboard topResults={topResults} />
      </Tabs.Content>
      <Tabs.Content value="Reviews">{children}</Tabs.Content>
    </Tabs.Root>
  );
}
