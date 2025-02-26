import { Flex, Text } from "@chakra-ui/react";
import { Avatar } from "@/components/ui/avatar";
import { Review } from "@/app/typings/review";
import TimeAgo from "@/components/core/TimeAgo/TimeAgo";
import { User } from "@/app/typings/user";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface IQuizReviewItemProps {
  review: {
    reviewDetails: Review;
    reviewer: User;
  }
}

export default function QuizReviewItem({review}: IQuizReviewItemProps) {
  const { reviewer, reviewDetails } = review;
  const date = new Date(reviewDetails.created_at || "");
  const Star = reviewDetails.rating === 5 ? FaStar : reviewDetails.rating >= 2 ? FaStarHalfAlt : FaRegStar;

  return (
    <>
      <Flex gap={5}>
        <Flex direction="column" alignItems="center">
          <Avatar src={reviewer?.avatar ? reviewer.avatar : "https://fakeimg.pl/48x48/"} />
          <Flex alignItems="center" gap={1}>
            <Star />
            <Text>{reviewDetails.rating}</Text>
          </Flex>
        </Flex>

        <Flex direction="column" gap={1} flex={1}>
          <Flex gap={2} alignItems="center">
            <Text fontWeight="bold">{reviewer?.username || "Unknown user"}</Text> 
            <TimeAgo date={date}/>
          </Flex>
          <Flex>
          </Flex>
          <div>{reviewDetails.comment || "-"}</div>
        </Flex>
      </Flex>
      <hr />
    </>
  );
}
