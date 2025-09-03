import { QuizDetails } from "@/typings/quiz";
import { Card, Flex, Float, Status, Tag, Text } from "@chakra-ui/react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa6";
import { RxCalendar } from "react-icons/rx";
import Link from "next/link";
import TimeAgoComponent from "@/components/core/TimeAgo/TimeAgo";
import { formatToMMSS } from "@/utils/functions/formatTime";
import styles from "./QuizItem.module.css";

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
  return (
    <Card.Root
      className={styles.card}
      variant="elevated"
    >
      <Card.Body>
        {avgRating > 4.5 && (
          <Float
            offsetX={15}
            placement="top-start"
          >
            <Tag.Root
              colorPalette="red"
              className={styles.spikyBorder}
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
          <Text className={styles.title}>{quiz.title}</Text>
          <Flex className={styles.container}>
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
          <Flex className={styles.container}>
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
