import { Answer } from "@/app/typings/answer";
import { Question } from "@/app/typings/question";
import { Quiz } from "@/app/typings/quiz";
import { deleteAnswer } from "@/components/shared/utils/quiz/answer/deleteAnswer";
import { CheckCircleIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Button,
  chakra,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

interface QuizUpdateFormProps {
  quiz: Quiz;
  questions_and_answers: Array<{
    question: Question;
    answers: Answer[];
  }>;
}

export default function QuizUpdateForm({
  quiz,
  questions_and_answers,
}: QuizUpdateFormProps) {
  const {
    register,
    trigger,
    formState: { isValid },
  } = useForm();

  const toast = useToast();

  console.log(quiz);

  const handleDeleteAnswer = async (id: number) => {
    console.log(id);
    const success = await deleteAnswer(id);
    console.log(success);
    toast({
      title: success ? "Answer deleted" : "Error deleting answer",
      status: success ? "info" : "error",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <chakra.form style={{ overflow: "scroll", height: "70vh" }}>
      <FormControl>
        <FormLabel>Quiz title</FormLabel>
        <Input
          placeholder="Quiz Title"
          defaultValue={quiz.title}
          {...register("title", { required: true })}
          onBlur={() => trigger("title")}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Quiz category</FormLabel>
        <Input
          placeholder="Category"
          defaultValue={quiz.category}
          {...register("category", { required: true })}
          onBlur={() => trigger("category")}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Quiz timer</FormLabel>
        <Input
          placeholder="Timer (HH:MM:SS)"
          defaultValue={quiz.timer}
          {...register("timer", {
            required: true,
            pattern: {
              value: /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/,
              message: "Invalid time format. Use HH:MM:SS",
            },
          })}
          onBlur={() => trigger("timer")}
        />
      </FormControl>

      <Text>Questions</Text>
      <Flex
        flexDirection="column"
        gap={5}
      >
        {questions_and_answers.map((qa, index) => (
          <div key={index}>
            <FormControl
              display="flex"
              alignItems="baseline"
              mb={3}
            >
              <FormLabel>{index + 1}.</FormLabel>
              <InputGroup>
                <Input
                  placeholder="Question"
                  defaultValue={qa.question.title}
                  {...register(`q_title${index + 1}`, { required: true })}
                  onBlur={() => trigger(`q_title${index + 1}`)}
                />
              </InputGroup>
            </FormControl>
            {qa.answers.map((answer, i) => (
              <FormControl key={i}>
                <InputGroup>
                  {answer.correct_answer && <InputLeftElement>
                    <CheckCircleIcon color="green.400" />
                  </InputLeftElement>}
                  <Input
                    placeholder="Answer"
                    defaultValue={answer.answer}
                    {...register(`answer${index + 1}${i + 1}`, {
                      required: true,
                    })}
                    onBlur={() => trigger(`answer${index + 1}${i + 1}`)}
                  />
                  <InputRightElement>
                    <Button variant="ghost" onClick={() => answer.id && handleDeleteAnswer(answer.id)}>
                      <DeleteIcon color="red.500" boxSize="5"/>
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            ))}
          </div>
        ))}
      </Flex>

      <Button isDisabled={!isValid}>Update Quiz</Button>
    </chakra.form>
  );
}
