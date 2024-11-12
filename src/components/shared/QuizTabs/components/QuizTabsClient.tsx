"use client";
import { Answer } from "@/app/typings/answer";
import { Question } from "@/app/typings/question";
import { Quiz } from "@/app/typings/quiz";
import { User } from "@/app/typings/user";
import LoadingSpinner from "@/components/core/LoadingSpinner/LoadingSpinner";
import QuizGameplaySection from "@/components/features/gameplay/QuizGameplaySection/QuizGameplaySection";
import QuizLeaderboard from "@/components/features/leaderboard/QuizLeaderboard/QuizLeaderboard";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface IQuizTabsClientProps {
  quiz: Quiz;
  questions: Question[];
  user: User;
  answers: Answer[];
  children: React.ReactNode;
}

export default function QuizTabsClient({ quiz, questions, user, answers, children }: IQuizTabsClientProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) {
    return <LoadingSpinner text="Initializing quiz, please wait..." />;
  }
  return (
    <Tabs
      isFitted
      variant="enclosed"
    >
      <TabList mb="1em">
        <Tab>Gameplay</Tab>
        <Tab>Leaderboard</Tab>
        <Tab>Reviews</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          {questions && answers ? (
            <QuizGameplaySection
              user={user}
              quiz={quiz}
              questions={questions}
              answers={answers}
            />
          ) : (
            "Data not found"
          )}
        </TabPanel>
        <TabPanel>
          <QuizLeaderboard />
        </TabPanel>
        <TabPanel>
          {children}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}