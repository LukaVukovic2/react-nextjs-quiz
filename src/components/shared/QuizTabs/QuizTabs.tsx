"use server";
import QuizGameplaySection from "@/components/features/gameplay/QuizGameplaySection/QuizGameplaySection";
import QuizReviewSection from "@/components/features/reviews/QuizReviewSection/QuizReviewSection";
import createClient from "../utils/createClient";
import { Quiz } from "@/app/typings/quiz";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react";

export default async function QuizTabs({ quiz, page }: { quiz: Quiz, page: string }) {
  const supabase = createClient();

  const { data: questions } = await supabase
    .from("question")
    .select("*", { count: "exact" })
    .eq("quiz_id", quiz.id);

  const questionIds = questions?.map((q) => q.id);

  const { data: answers } = await supabase
    .from("answer")
    .select("*")
    .in("question_id", questionIds ?? []);

  const { data: user } = await supabase
    .from("profile")
    .select("*")
    .eq("id", quiz?.user_id)
    .single();

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
            <div>Data not found</div>
          )}
        </TabPanel>
        <TabPanel>
          <div>Leaderboard</div>
        </TabPanel>
        <TabPanel>
          <QuizReviewSection id={quiz.id} page={page} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
