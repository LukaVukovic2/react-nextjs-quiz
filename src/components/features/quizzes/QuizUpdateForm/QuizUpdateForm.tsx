import { Answer } from "@/app/typings/answer";
import { Question } from "@/app/typings/question";
import { Quiz } from "@/app/typings/quiz";
import { deleteAnswer } from "@/components/shared/utils/quiz/answer/deleteAnswer";
import { deleteQuestion } from "@/components/shared/utils/quiz/question/deleteQuestion";
import { updateQuiz } from "@/components/shared/utils/quiz/updateQuiz";
import { AddIcon, CheckCircleIcon, DeleteIcon } from "@chakra-ui/icons";
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
import { ChangeEvent, FocusEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

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

  const { register, trigger, formState: { isValid }} = useForm();
  const [dirtyQuizFields, setDirtyQuizFields] = useState<Quiz>();
  const [dirtyQuestions, setDirtyQuestions] = useState<Question[]>([]);
  const [dirtyAnswers, setDirtyAnswers] = useState<Answer[]>([]);
  const [answersArr, setAnswersArr] = useState<Answer[]>([]);

  const [correctAnswersMap, setCorrectAnswersMap] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    setAnswersArr(questions_and_answers.map((qa) => qa.answers).flat());

    const correctAnswers = new Map<string, string>();
    questions_and_answers.forEach((qa) => {
      qa.answers.forEach((answer) => {
        if (answer.correct_answer) {
          correctAnswers.set(answer.question_id, answer.id);
        }
      });
    });
    setCorrectAnswersMap(correctAnswers);
  }, [questions_and_answers]);

  console.log("AnsArr") 
  console.log(answersArr);
  console.log("DirtyAns");
  console.log(dirtyAnswers);

  const toast = useToast();

  const validateDeleteAnswer = (questionId: string, answerId: string) => {
    const currentCorrectAnswer = correctAnswersMap.get(questionId);
    const noOfAnswers = answersArr.filter((ans) => ans.question_id === questionId).length;
    return (currentCorrectAnswer === answerId) || noOfAnswers <= 2;
  }

  const handleDeleteQuestion = async (id: string) => {
    const success = await deleteQuestion(id);
    if (success) {
      setDirtyQuestions((prev) => prev.filter((question) => question.id !== id));
    }
    toast({
      title: success ? "Question deleted" : "Error deleting question",
      status: success ? "info" : "error",
      duration: 3000,
      isClosable: true,
    });
  }

  const handleDeleteAnswer = async (id: string) => {
    const success = await deleteAnswer(id);
    if (success) {
      setAnswersArr((prev) => prev.filter((ans) => ans.id !== id));
      setDirtyAnswers((prev) => prev.filter((ans) => ans.id !== id));
      toast({
        title: "Answer deleted",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Error deleting answer",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
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
    
    const validateInput = await trigger(`answer${a.question_id}${a.id}`);
    if (!validateInput && type === "text") return;

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
  
    setAnswersArr([...updatedAnswers]);
  
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

  const addNewAnswer = (questionId: string) => {
    const newAnswer: Answer = {
      id: uuidv4(),
      answer: "",
      question_id: questionId,
      correct_answer: false,
    };
    setAnswersArr((prev) => [...prev, newAnswer]);
    setDirtyAnswers((prev) => [...prev, newAnswer]);
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
            {
            answersArr.map((answer) => {
              if (answer.question_id !== qa.question.id) return null;
              
              return (
                <FormControl key={answer.id}>
                  <InputGroup>
                    <InputLeftElement>
                      {answer.correct_answer ? 
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
                        onClick={() => handleDeleteAnswer(answer.id)}
                        isDisabled={validateDeleteAnswer(qa.question.id, answer.id)}
                      >
                        <DeleteIcon
                          color="red.500"
                          boxSize="5"
                        />
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
              );
            })}
            <Button 
              onClick={() => addNewAnswer(qa.question.id)}   
              isDisabled={answersArr.filter((ans) => ans.question_id === qa.question.id).some((answer) => !answer.answer)}
            >
              <AddIcon boxSize={2} />
            </Button>
          </div>
        ))}
      </Flex>

      <Button isDisabled={!isValid} onClick={handleSubmit}>Update Quiz</Button>
    </chakra.form>
  );
}