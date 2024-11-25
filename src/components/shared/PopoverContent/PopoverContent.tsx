import { Quiz } from "@/app/typings/quiz";
import { PopoverContent as Content, PopoverArrow, PopoverBody, PopoverTitle } from "@/components/ui/popover";
import { Text } from "@chakra-ui/react";

export default function PopoverContent({quiz}: {quiz: Quiz}) {
  return (
    <Content>
      <PopoverArrow />
      <PopoverBody>
        <PopoverTitle fontWeight="{fontWeights.bold}">Quiz Details</PopoverTitle>
        <Text>Created: {new Date(quiz?.created_at || "").toLocaleDateString()}</Text>
        <Text>Last updated: {new Date(quiz?.updated_at || "").toLocaleDateString()}</Text>
        <Text>Category: {quiz.category}</Text>
        <Text>Plays: {quiz.plays}</Text>
        <Text>Rating: { quiz.number_of_ratings ? quiz.average_rating + ` (${quiz.number_of_ratings})` : "not rated yet"}</Text>
      </PopoverBody>
    </Content>
  );
}