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
import { ChangeEvent, FocusEvent, useState } from "react";
import { useForm } from "react-hook-form";

interface QuizUpdateFormProps {
  quiz: Quiz;
  questions_and_answers: Array<{
    question: Question;
    answers: Answer[];
  }>;
  onClose: () => void;
}

export default function QuizUpdateForm({
  quiz,
  questions_and_answers,
  onClose
}: QuizUpdateFormProps) {

  const { register, trigger, formState: { isValid }, getValues} = useForm();
  const [dirtyQuizFields, setDirtyQuizFields] = useState<Quiz>();
  const [dirtyQuestions, setDirtyQuestions] = useState<Question[]>([]);
  const [dirtyAnswers, setDirtyAnswers] = useState<Answer[]>([]);
  const [answersArr, setAnswersArr] = useState<Answer[]>(questions_and_answers.map((qa) => qa.answers).flat());

  console.log("AnsArr") 
  console.log(answersArr);
  console.log("DirtyAns");
  console.log(dirtyAnswers);

  const toast = useToast();

  const handleDeleteQuestion = async (id: string) => {
    const success = await deleteQuestion(id);
    if (success) {
      dirtyQuestions.forEach((q) => {
        if (q.id === id) {
          setDirtyQuestions((prev) => {
            return prev.filter((question) => question.id !== id);
          });
        }
      });
    }
    toast({
      title: success ? "Question deleted" : "Error deleting question",
      status: success ? "info" : "error",
      duration: 3000,
      isClosable: true,
    });
  }

  const handleDeleteAnswer = async (id: number) => {
    const success = await deleteAnswer(id);
    if (success) {
      setAnswersArr((prev) => {
        return prev.filter((answer) => answer.id !== id);
      });
      setDirtyAnswers((prev) => {
        return prev.filter((answer) => answer.id !== id);
      });
    }
    toast({
      title: success ? "Answer deleted" : "Error deleting answer",
      status: success ? "info" : "error",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleUpdateQuiz = async (e: FocusEvent<HTMLInputElement, Element>, id: string) => { 
    const { name, value } = e.target;

    const validateInput = await trigger(name);
    if (!validateInput) return;

    setDirtyQuizFields((prev) => ({
      ...prev,
      id,
      [name]: value,
    } as Quiz));
  };

  const handleUpdateQuestion = async (e: FocusEvent<HTMLInputElement, Element>, q: Question) => {
    const { value } = e.target;

    const validateInput = await trigger('q_title' + q.id);
    if (!validateInput) return;

    setDirtyQuestions((prev) => {
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

  const handleUpdateAnswer = async (e: ChangeEvent<HTMLInputElement>, a: Answer) => {
    const { value, type } = e.target;
    
    console.log('Checked value')
    console.log(getValues(`answer${a.id}`))
    const validateInput = await trigger(`answer${a.question_id}${a.id}`);
    if (!validateInput) return;

    const previousCorrectAnswer = answersArr.find((ans) => ans.correct_answer && ans.question_id === a.question_id);
  
    const updatedAnswers = answersArr.map((answer) => {
      if (answer.id === a.id && type === 'text') {
        return { ...answer, answer: value };
      }
      if (answer.question_id === a.question_id && type === 'radio') {
        return { ...answer, correct_answer: answer.id === a.id };
      }
      return answer;
    });
  
    setAnswersArr(updatedAnswers);
  
    setDirtyAnswers((prev) => {
      const dirtyAns = [...prev];
  
      updatedAnswers.forEach((answer) => {
        const answerIndex = dirtyAns.findIndex((ans) => ans.id === answer.id);
  
        if (type === 'radio' && answer.question_id === a.question_id) {
          if (answerIndex !== -1) {
            dirtyAns[answerIndex] = { ...answer, correct_answer: answer.id === a.id };
          } else if (answer.id === a.id || previousCorrectAnswer?.id === answer.id) {
            dirtyAns.push({ ...answer, correct_answer: answer.id === a.id });
          }
        }
  
        if (type === 'text' && answer.id === a.id) {
          if (answerIndex === -1) {
            dirtyAns.push({ ...answer, answer: value });
          } else {
            dirtyAns[answerIndex] = { ...answer, answer: value };
          }
        }
      });
  
      return dirtyAns;
    });
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("quiz", JSON.stringify(dirtyQuizFields));
    formData.append("questions", JSON.stringify(dirtyQuestions));
    formData.append("answers", JSON.stringify(dirtyAnswers));

    const success = await updateQuiz(formData);
    toast({
      title: success ? "Quiz updated" : "Error updating quiz",
      status: success ? "info" : "error",
      duration: 3000,
      isClosable: true,
    });
    if(success) {
      setDirtyQuizFields(undefined);
      setDirtyQuestions([]);
      setDirtyAnswers([]);
    }
    onClose();
  };

  return (
    <chakra.form style={{ overflowY: "scroll", height: "70vh" }}>
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
          <div key={qa.question.id}>
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
                  {...register(`q_title${qa.question.id}`, { required: true })}
                  onBlur={(e) => handleUpdateQuestion(e, qa.question)}
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
            {qa.answers.map((answer) => {
              const isCorrect = answersArr.find((ans) => ans.id === answer.id)?.correct_answer
              return <FormControl key={answer.id}>
                <InputGroup>
                  <InputLeftElement>
                    {isCorrect ? 
                      <CheckCircleIcon color="green.400" /> : 
                      <input
                        type="radio"
                        {...register(`answer${answer.id}`)}
                        onChange={(e) => handleUpdateAnswer(e, answer)}
                        />
                    }
                  </InputLeftElement>
                  
                  <Input
                    placeholder="Answer"
                    defaultValue={answer.answer}
                    {...register(`answer${qa.question.id}${answer.id}`, {
                      required: true,
                    })}
                    onBlur={(e) => handleUpdateAnswer(e, answer)}
                  />
                  <InputRightElement>
                    <Button
                      variant="ghost"
                      onClick={() => answer.id && handleDeleteAnswer(answer.id)}
                      isDisabled={qa.answers.length <= 2 || answer.correct_answer}
                    >
                      <DeleteIcon
                        color="red.500"
                        boxSize="5"
                      />
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
})}
          </div>
        ))}
      </Flex>

      <Button isDisabled={!isValid} onClick={handleSubmit}>Update Quiz</Button>
    </chakra.form>
  );
}