import { Question } from "@/app/typings/question";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { List, ListItem, Text } from "@chakra-ui/react";

export default function QuestionList({ questions }: { questions: Question[] }) {
  return (
    <List>
      {
        questions.map((question, index) => (
          <ListItem key={question.id} mb={2}>
            {index + 1 + ". " + question.title}
            {question.answers &&
              question.answers.map((answer) => (
                <Text key={answer.answer}>
                  {answer.answer + " "}
                  {answer.correct_answer && <CheckCircleIcon color="green.400" />}
                </Text>
              ))
            }
          </ListItem>
        ))
      }
    </List>
  )
}