import { Quiz } from "@/app/typings/quiz";
import { PopoverContent as Content, PopoverArrow, PopoverBody, PopoverTitle } from "@/components/ui/popover";
import { Rating } from "@/components/ui/rating";
import { Flex, Text } from "@chakra-ui/react";

export default function PopoverContent({quiz}: {quiz: Quiz}) {
  const created_at = new Date(quiz?.created_at || "").toLocaleDateString();
  const updated_at = new Date(quiz?.updated_at || "").toLocaleDateString();
  return (
    <Content>
      <PopoverArrow />
      <PopoverBody>
        <PopoverTitle fontWeight="{fontWeights.bold}">Quiz Details</PopoverTitle>
        <Text>Created: {created_at}</Text>
        <Text>Last updated: {quiz.updated_at ? updated_at : created_at}</Text>
        <Text>Plays: {quiz.plays || 0}</Text>
        <Flex alignItems="center" gap={1}>
          Rating: {quiz.number_of_ratings ? (
            <>
              <Rating allowHalf readOnly defaultValue={quiz.rating} size="sm" colorPalette="orange" /> 
              ({quiz.number_of_ratings || 0})
            </>
          ) : "not rated yet"}
        </Flex>
      </PopoverBody>
    </Content>
  );
}