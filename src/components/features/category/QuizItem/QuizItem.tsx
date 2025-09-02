import { QuizDetails } from "@/typings/quiz";
import { Card, Flex, Float, Status, Tag, Text } from "@chakra-ui/react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa6";
import { RxCalendar } from "react-icons/rx";
import Link from "next/link";
import TimeAgoComponent from "@/components/core/TimeAgo/TimeAgo";
import { formatToMMSS } from "@/utils/functions/formatTime";

export default function QuizItem({ quiz }: { quiz: QuizDetails }) {
  const avgRating = +quiz?.rating.toFixed(1);
  const avgScore = +(quiz?.average_score * 100).toFixed(1);
  const difficulty =
    avgScore > 90
      ? "Easy"
      : avgRating > 50
      ? "Medium"
      : avgRating > 1
      ? "Hard"
      : "Unknown";
  const Star =
    avgRating > 4.5 ? (
      <FaStar size={20} />
    ) : avgRating > 1 ? (
      <FaStarHalfAlt size={20} />
    ) : (
      <FaRegStar size={20} />
    );

  const styles = {
    boxShadow: "none",
    clipPath: `polygon(
    7% 0%, 12.5% 10%, 18% 0%, 25% 10%, 32% 0%, 38% 10%, 44% 0%, 50% 10%,
    56% 0%, 62.5% 10%, 68% 0%, 75% 10%, 82% 0%, 88% 10%, 94% 0%,
    97.5% 7%, 100% 18%, 97.5% 32%, 100% 44%,
    97.5% 56%, 100% 68%, 97.5% 82%, 100% 94%,
    93% 100%, 87.5% 90%, 82% 100%, 75% 90%, 68% 100%, 62.5% 90%, 56% 100%, 50% 90%,
    44% 100%, 38% 90%, 32% 100%, 25% 90%, 18% 100%, 12.5% 90%, 7% 100%, 0% 93%,
    2.5% 82%,  0% 68%,  2.5% 56%,
    0% 44%,  2.5% 32%,  0% 18%, 2.5% 7%`,
  };

  return (
    <Card.Root
      variant="elevated"
      position="relative"
      flex={1}
      px="2.5%"
    >
      <Card.Body>
        {avgRating > 4.5 && (
          <Float offsetX={10}>
            <Tag.Root
              colorPalette="red"
              style={styles}
              size="lg"
            >
              <Tag.Label>Top Rated</Tag.Label>
            </Tag.Root>
          </Float>
        )}
        <Link
          href={`/quizzes/${quiz.id}`}
          data-testid="quiz_link"
        >
          <Text fontSize="xl">{quiz.title}</Text>
          <Flex justifyContent="space-between">
            <Flex
              alignItems="center"
              gap={2}
            >
              <RxCalendar size={20} />
              <TimeAgoComponent date={quiz.created_at} />
            </Flex>
            <Flex
              alignItems="center"
              gap={2}
            >
              {Star}
              {quiz?.number_of_ratings ? (
                <span>{avgRating}</span>
              ) : (
                <span>Not rated yet</span>
              )}
            </Flex>
          </Flex>
          <Flex justifyContent="space-between">
            <Flex
              alignItems="center"
              gap={2}
            >
              <FaRegClock size={20} />
              {formatToMMSS(+quiz.time)}
            </Flex>
            <Flex>
              {
                <Status.Root
                  colorPalette={
                    difficulty === "Easy"
                      ? "green"
                      : difficulty === "Medium"
                      ? "yellow"
                      : difficulty === "Hard"
                      ? "red"
                      : "blue"
                  }
                >
                  <Status.Indicator />
                  {difficulty}
                </Status.Root>
              }
            </Flex>
          </Flex>
        </Link>
      </Card.Body>
    </Card.Root>
  );
}
