"use server";
import Star from "@/components/core/Star/Star";
import TimeAgo from "@/components/core/TimeAgo/TimeAgo";
import createClient from "@/components/shared/utils/createClient";
import { Avatar, Flex, Heading } from "@chakra-ui/react";
import { Review } from "@/app/typings/review";

export default async function QuizReviewItem({ review }: { review: Review }) {
  const supabase = createClient();

  const { data: user } = await supabase
    .from("profile")
    .select("*")
    .eq("id", review.user_id)
    .single();

  const date = new Date(review.created_at || "");

  return (
    <>
      <Flex gap={5}>
        <Flex direction="column" alignItems="center">
          <Avatar src={user?.avatar ? user.avatar : "https://fakeimg.pl/48x48/"} />
          <Flex alignItems="center" gap={1}>
            <Star />
            {review.rating}
          </Flex>
        </Flex>

        <Flex direction="column" gap={1} flex={1}>
          <Flex gap={2} alignItems="center">
            <Heading as="h3" size="sm">{user?.username || "Unknown user"}</Heading> 
            <TimeAgo date={date} />
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
