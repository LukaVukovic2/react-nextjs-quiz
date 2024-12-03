import { Quiz } from "@/app/typings/quiz";
import { PopoverContent as Content, PopoverArrow, PopoverBody, PopoverTitle } from "@/components/ui/popover";
import { Text } from "@chakra-ui/react";

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
        <Text>Rating: { quiz.number_of_ratings ? quiz.average_rating + ` (${quiz.number_of_ratings})` : "not rated yet"}</Text>
      </PopoverBody>
    </Content>
  );
}