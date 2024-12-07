import { Question } from "@/app/typings/question";
import { Box, Text } from "@chakra-ui/react";
import { getLetterByIndex } from "../utils/getLetterByIndex";
import AnswerGroupBox from "../AnswerGroupBox/AnswerGroupBox";

export default function QuestionList({ questions }: { questions: Question[] }) {
  return (
    questions.length > 0 ? 
      <Box as="ul">
      {
        questions.map((question, index) => (
          <Box as="li" key={question.id}>
            <Text fontWeight="bold" mb={1}>
              {index + 1 + ". " + question.title}
            </Text>
            {question.answers &&
              question.answers.map((answer, index) => {
                const letter = getLetterByIndex(index);
                return <AnswerGroupBox key={answer.id} answer={answer} letter={letter} />
              })
            }
          </Box>
        ))
      }
    </Box> : <Text color="dark.800">No questions added yet</Text>
  )
}