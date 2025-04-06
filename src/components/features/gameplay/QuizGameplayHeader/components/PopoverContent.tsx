import { QuizDetails } from "@/typings/quiz";
import {
  PopoverContent as Content,
  PopoverArrow,
  PopoverBody,
  PopoverTitle,
} from "@/components/ui/popover";
import { Rating } from "@/components/ui/rating";
import { Flex, Text } from "@chakra-ui/react";
import { getLocaleDateString } from "@/utils/functions/getLocaleDateString";

export default function PopoverContent({ quiz }: { quiz: QuizDetails }) {
  const created_at = getLocaleDateString(quiz.created_at);
  const updated_at = getLocaleDateString(quiz.updated_at);
  return (
    <Content>
      <PopoverArrow />
      <PopoverBody>
        <PopoverTitle fontWeight="{fontWeights.bold}">
          Quiz Details
        </PopoverTitle>
        <Text>Created: {created_at}</Text>
        <Text>Last updated: {quiz.updated_at ? updated_at : "Never"}</Text>
        <Text>Plays: {quiz.plays}</Text>
        <Flex
          alignItems="center"
          gap={1}
        >
          Rating:{" "}
          {quiz.number_of_ratings ? (
            <>
              <Rating
                allowHalf
                readOnly
                defaultValue={quiz.rating}
                size="sm"
                colorPalette="orange"
              />
              ({quiz.number_of_ratings || 0})
            </>
          ) : (
            "not rated yet"
          )}
        </Flex>
      </PopoverBody>
    </Content>
  );
}