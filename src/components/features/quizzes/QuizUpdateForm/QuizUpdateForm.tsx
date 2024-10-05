import { Answer } from "@/app/typings/answer";
import { Question } from "@/app/typings/question";
import { Quiz } from "@/app/typings/quiz";
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

const styles = {
  fontSize: "0.8rem"
}

export default function QuizUpdateForm({
  quiz,
  questions_and_answers,
  onClose
}: QuizUpdateFormProps) {

  const { register, trigger, formState: { isValid }} = useForm();
  const [dirtyQuizFields, setDirtyQuizFields] = useState<Quiz>();
  const [dirtyQuestions, setDirtyQuestions] = useState<Question[]>([]);
  const [deletedQuestions, setDeletedQuestions] = useState<string[]>([]);
  const [questionsArr, setQuestionsArr] = useState<Question[]>([]);
  const [dirtyAnswers, setDirtyAnswers] = useState<Answer[]>([]);
  const [deletedAnswers, setDeletedAnswers] = useState<string[]>([]);
  const [answersArr, setAnswersArr] = useState<Answer[]>([]);

  useEffect(() => {
    const answers = questions_and_answers.map((qa) => qa.answers).flat();
    setAnswersArr(answers);
    setQuestionsArr(questions_and_answers.map((qa) => qa.question));
  }, [questions_and_answers]);

  console.log("Dirty answers");
  console.log(dirtyAnswers);

  const toast = useToast();

  const handleDeleteQuestion = async (id: string) => {
    setQuestionsArr((prev) => prev.filter((question) => question.id !== id));
    setDirtyQuestions((prev) => prev.filter((question) => question.id !== id));
    setDeletedQuestions((prev) => [...prev, id]);
    setAnswersArr((prev) => prev.filter((answer) => answer.question_id !== id));
    setDirtyAnswers((prev) => prev.filter((answer) => answer.question_id !== id));
  }

  const handleDeleteAnswer = async (id: string) => {
    setAnswersArr((prev) => prev.filter((ans) => ans.id !== id));
    setDirtyAnswers((prev) => prev.filter((ans) => ans.id !== id));
    setDeletedAnswers((prev) => [...prev, id]);
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
          }
        ];
      } else {
        const updatedQuestions = [...prev];
        updatedQuestions[questionIndex] = {
          id: q.id,
          title: value,
          quizId: q.quizId,
        };
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

  const addNewQuestion = () => {
    const id = uuidv4();
    const answerId = uuidv4();
    const newQuestion: Question = {
      id,
      title: "",
      quizId: quiz.id,
    };
    const newAnswer: Answer = {
      id: uuidv4(),
      answer: "",
      question_id: id,
      correct_answer: true,
    };
    setQuestionsArr((prev) => [...prev, newQuestion]);
    setDirtyQuestions((prev) => [...prev, newQuestion]);
    setAnswersArr((prev) => [...prev, newAnswer, {...newAnswer, id: answerId, correct_answer: !newAnswer.correct_answer}]);
    setDirtyAnswers((prev) => [...prev, newAnswer, {...newAnswer, id: answerId, correct_answer: !newAnswer.correct_answer}]);
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
    formData.append("deletedQuestions", JSON.stringify(deletedQuestions));
    formData.append("deletedAnswers", JSON.stringify(deletedAnswers));

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
        <FormLabel>Quiz playtime</FormLabel>
        <Input
          placeholder="Quiz playtime (HH:MM:SS)"
          defaultValue={quiz.time}
          {...register("time", {
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
        my={3}
      >
        {questionsArr.map((q, index) => (
          <div key={q.id}>
            <FormControl
              display="flex"
              alignItems="baseline"
              mb={3}
            >
              <FormLabel>{index + 1}.</FormLabel>
              <InputGroup>
                <Input
                  placeholder="Question"
                  defaultValue={q.title}
                  {...register(`q_title${q.id}`, { required: true })}
                  onBlur={(e) => handleUpdateQuestion(e, q)}
                />
                <InputRightElement>
                  <Button
                    variant="ghost"
                    onClick={() => handleDeleteQuestion(q.id)}
                    isDisabled={questionsArr.length === 1}
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
              if (answer.question_id !== q.id) return null;
              
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
                          style={{cursor: "pointer"}}
                          />
                      }
                    </InputLeftElement>
                    
                    <Input
                      placeholder="Answer"
                      defaultValue={answer.answer}
                      {...register(`answer${q.id}${answer.id}`, {
                        required: true,
                      })}
                      onBlur={(e) => handleUpdateAnswer(e, answer)}
                    />
                    <InputRightElement>
                      <Button
                        variant="ghost"
                        onClick={() => handleDeleteAnswer(answer.id)}
                        isDisabled={answer.correct_answer}
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
            <Flex 
              onClick={() => addNewAnswer(q.id)}   
              isDisabled={answersArr.filter((ans) => ans.question_id === q.id).some((answer) => !answer.answer)}
              style={styles}
              as={Button} gap={1}
            >
              <AddIcon boxSize={2} />
              Add answer
            </Flex>
          </div>
        ))}
        <Flex>
          <Flex style={styles} onClick={addNewQuestion} as={Button} gap={1}>
            <AddIcon boxSize={2} />  
            Add question
          </Flex>
        </Flex>
      </Flex>

      <Button colorScheme="green" isDisabled={!isValid} onClick={handleSubmit}>Update Quiz</Button>
    </chakra.form>
  );
}