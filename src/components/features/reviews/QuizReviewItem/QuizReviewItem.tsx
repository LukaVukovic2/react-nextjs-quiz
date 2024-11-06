import Star from "@/components/core/Star/Star";
import { Avatar, Flex, Heading, Text } from "@chakra-ui/react";
import { Review } from "@/app/typings/review";
import TimeAgo from "@/components/core/TimeAgo/TimeAgo";
import { User } from "@/app/typings/user";

export default function QuizReviewItem({ review, reviewer }: { review: Review, reviewer: User }) {
  const date = new Date(review.created_at || "");

  return (
    <>
      <Flex gap={5}>
        <Flex direction="column" alignItems="center">
          <Avatar src={reviewer?.avatar ? reviewer.avatar : "https://fakeimg.pl/48x48/"} />
          <Flex alignItems="center" gap={1}>
            <Star />
            <Text>{review.rating}</Text>
          </Flex>
        </Flex>

        <Flex direction="column" gap={1} flex={1}>
          <Flex gap={2} alignItems="center">
            <Heading as="h3" size="sm">{reviewer?.username || "Unknown user"}</Heading> 
            <TimeAgo date={date}/>
          </Flex>
          <Flex>
          </Flex>
          <div>{review.comment || "-"}</div>
        </Flex>
      </Flex>
      <hr />
    </>
  );
}
