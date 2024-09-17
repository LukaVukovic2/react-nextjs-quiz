import { Answer } from "@/app/typings/answer";
import { Question } from "@/app/typings/question";
import { Quiz } from "@/app/typings/quiz";
import { deleteAnswer } from "@/components/shared/utils/quiz/answer/deleteAnswer";
import { deleteQuestion } from "@/components/shared/utils/quiz/question/deleteQuestion";
import { updateQuiz } from "@/components/shared/utils/quiz/updateQuiz";
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
import { FocusEvent, useState } from "react";
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

  const [dirtyQuizFields, setDirtyQuizFields] = useState<Quiz>();
  const [dirtyQuestions, setDirtyQuestions] = useState<Question[]>([]);
  const [dirtyAnswers] = useState<Answer[]>();

  console.log(dirtyQuestions);

  const toast = useToast();

  const handleDeleteQuestion = async (id: string) => {
    const success = await deleteQuestion(id);
    toast({
      title: success ? "Question deleted" : "Error deleting question",
      status: success ? "info" : "error",
      duration: 3000,
      isClosable: true,
    });
  }


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

  const handleUpdateQuiz = async (e: FocusEvent<HTMLInputElement, Element>, id: string) => { 
    const { name, value } = e.target;

    console.log(name, value);

    const validateInput = await trigger(name);
    if (!validateInput) return;

    setDirtyQuizFields((prev) => ({
      ...prev,
      id,
      [name]: value,
    } as Quiz));
  };

  const handleUpdateQuestion = async (e: FocusEvent<HTMLInputElement, Element>, q: Question, index: number) => {
    const { value } = e.target;

    const validateInput = await trigger('q_title' + index);
    if (!validateInput) return;

    setDirtyQuestions((prev) => {
      console.log(prev);
      const questionIndex = prev.findIndex((question) => question.id === q.id);
  
      if (questionIndex === -1) {
        return [
          ...prev,
          {
            id: q.id,
            title: value,
            quizId: q.quizId,
          } as Question,
        ];
      } else {
        const updatedQuestions = [...prev];
        updatedQuestions[questionIndex] = {
          id: q.id,
          title: value,
          quizId: q.quizId,
        } as Question;
        return updatedQuestions;
      }
    });
  }

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("quiz", JSON.stringify(dirtyQuizFields));
    formData.append("questions", JSON.stringify(dirtyQuestions));
    formData.append("answers", JSON.stringify(dirtyAnswers));

    const data = await updateQuiz(formData);
    console.log(data);
  };

  return (
    <chakra.form style={{ overflow: "scroll", height: "70vh" }}>
      <FormControl>
        <FormLabel>Quiz title</FormLabel>
        <Input
          placeholder="Quiz Title"
          defaultValue={quiz.title}
          {...register("title", { required: true })}
          onBlur={(e) => handleUpdateQuiz(e, quiz.id)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Quiz category</FormLabel>
        <Input
          placeholder="Category"
          defaultValue={quiz.category}
          {...register("category", { required: true })}
          onBlur={(e) => handleUpdateQuiz(e, quiz.id)}
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
          onBlur={(e) => handleUpdateQuiz(e, quiz.id)}
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
                  onBlur={(e) => handleUpdateQuestion(e, qa.question, index + 1)}
                />
                <InputRightElement>
                  <Button
                    variant="ghost"
                    onClick={() => handleDeleteQuestion(qa.question.id)}
                    isDisabled={questions_and_answers.length === 1}
                  >
                    <DeleteIcon
                      color="red.500"
                      boxSize="5"
                    />
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            {qa.answers.map((answer, i) => (
              <FormControl key={i}>
                <InputGroup>
                  {answer.correct_answer && (
                    <InputLeftElement>
                      <CheckCircleIcon color="green.400" />
                    </InputLeftElement>
                  )}
                  <Input
                    placeholder="Answer"
                    defaultValue={answer.answer}
                    {...register(`answer${index + 1}${i + 1}`, {
                      required: true,
                    })}
                    onBlur={() => trigger(`answer${index + 1}${i + 1}`)}
                  />
                  <InputRightElement>
                    <Button
                      variant="ghost"
                      onClick={() => answer.id && handleDeleteAnswer(answer.id)}
                      isDisabled={qa.answers.length === 1}
                    >
                      <DeleteIcon
                        color="red.500"
                        boxSize="5"
                      />
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            ))}
          </div>
        ))}
      </Flex>

      <Button isDisabled={!isValid} onClick={handleSubmit}>Update Quiz</Button>
    </chakra.form>
  );
}
