import {
  chakra,
  Flex,
  IconButton,
  Input,
  Text,
} from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { Button } from "@/styles/theme/components/button";
import { InputGroup } from "@/components/ui/input-group";
import { FormLabel, FormControl } from "@chakra-ui/form-control";
import { AddIcon, CheckCircleIcon, DeleteIcon } from "@chakra-ui/icons";
import { updateQuiz } from "@/components/shared/utils/actions/quiz/updateQuiz";
import { ChangeEvent, FocusEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { Answer } from "@/app/typings/answer";
import { Question } from "@/app/typings/question";
import { Quiz } from "@/app/typings/quiz";
import "./QuizUpdateForm.css";

interface QuizUpdateFormProps {
  quiz: Quiz;
  questions_and_answers: Array<{
    question: Question;
    answers: Answer[];
  }>;
  onClose: () => void;
}

const styles = {
  fontSize: "0.8rem",
};

export default function QuizUpdateForm({ quiz, questions_and_answers, onClose }: QuizUpdateFormProps) {
  const {
    register,
    trigger,
    formState: { isValid },
  } = useForm();
  const [dirtyQuizFields, setDirtyQuizFields] = useState<Quiz>();
  const [dirtyQuestions, setDirtyQuestions] = useState<Question[]>([]);
  const [deletedQuestions, setDeletedQuestions] = useState<string[]>([]);
  const [questionsArr, setQuestionsArr] = useState<Question[]>([]);
  const [dirtyAnswers, setDirtyAnswers] = useState<Answer[]>([]);
  const [deletedAnswers, setDeletedAnswers] = useState<string[]>([]);
  const [answersArr, setAnswersArr] = useState<Answer[]>([]);

  const formDataEntries = {
    quiz: dirtyQuizFields,
    questions: dirtyQuestions,
    answers: dirtyAnswers,
    deletedQuestions: deletedQuestions,
    deletedAnswers: deletedAnswers,
  };

  useEffect(() => {
    const answers = questions_and_answers.map((qa) => qa.answers).flat();
    setAnswersArr(answers);
    setQuestionsArr(questions_and_answers.map((qa) => qa.question));
  }, [questions_and_answers]);

  const handleDeleteQuestion = async (id: string) => {
    setQuestionsArr((prev) => prev.filter((question) => question.id !== id));
    setDirtyQuestions((prev) => prev.filter((question) => question.id !== id));
    setDeletedQuestions((prev) => [...prev, id]);
    setAnswersArr((prev) => prev.filter((answer) => answer.question_id !== id));
    setDirtyAnswers((prev) =>
      prev.filter((answer) => answer.question_id !== id)
    );
  };

  const handleDeleteAnswer = async (id: string) => {
    setAnswersArr((prev) => prev.filter((ans) => ans.id !== id));
    setDirtyAnswers((prev) => prev.filter((ans) => ans.id !== id));
    setDeletedAnswers((prev) => [...prev, id]);
  };

  const handleUpdateQuiz = async (e: FocusEvent<HTMLInputElement, Element>, id: string) => {
    const { name, value } = e.target;

    const validateInput = await trigger(name);
    if (!validateInput) return;

    setDirtyQuizFields((prev) =>
      ({
        ...prev,
        id,
        [name]: value,
      } as Quiz)
    );
  };

  const handleUpdateQuestion = async (e: FocusEvent<HTMLInputElement, Element>, q: Question) => {
    const { value } = e.target;

    const validateInput = await trigger("q_title" + q.id);
    if (!validateInput) return;

    setDirtyQuestions((prev) => {
      const questionIndex = prev.findIndex((question) => question.id === q.id);
      const newQuestion: Question = { id: q.id, title: value, quiz_id: q.quiz_id };

      if (questionIndex === -1) {
        return [
          ...prev,
          newQuestion
        ];
      } else {
        const updatedQuestions = [...prev];
        updatedQuestions[questionIndex] = newQuestion;
        return updatedQuestions;
      }
    });
  };

  const handleUpdateAnswer = async (
    e: ChangeEvent<HTMLInputElement>,
    a: Answer
  ) => {
    const { value, type } = e.target;

    const validateInput = await trigger(`answer${a.question_id}${a.id}`);
    if (!validateInput && type === "text") return;

    const previousCorrectAnswer = answersArr.find(
      (ans) => ans.correct_answer && ans.question_id === a.question_id
    );

    const updatedAnswers = answersArr.map((answer) => {
      if (answer.id === a.id && type === "text") {
        return { ...answer, answer: value };
      }
      if (answer.question_id === a.question_id && type === "radio") {
        return { ...answer, correct_answer: answer.id === a.id };
      }
      return answer;
    });

    setAnswersArr([...updatedAnswers]);

    setDirtyAnswers((prev) => {
      const dirtyAns = [...prev];

      updatedAnswers.forEach((answer) => {
        const answerIndex = dirtyAns.findIndex((ans) => ans.id === answer.id);

        if (type === "radio" && answer.question_id === a.question_id) {
          if (answerIndex !== -1) {
            dirtyAns[answerIndex] = {
              ...answer,
              correct_answer: answer.id === a.id,
            };
          } else if (
            answer.id === a.id ||
            previousCorrectAnswer?.id === answer.id
          ) {
            dirtyAns.push({ ...answer, correct_answer: answer.id === a.id });
          }
        }

        if (type === "text" && answer.id === a.id) {
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
      quiz_id: quiz.id,
    };
    const defaultCorrectAns: Answer = {
      id: uuidv4(),
      answer: "",
      question_id: id,
      correct_answer: true,
    };
    const defaultFalseAns: Answer = {
      ...defaultCorrectAns,
      id: answerId,
      correct_answer: !defaultCorrectAns.correct_answer
    };
    setQuestionsArr((prev) => [...prev, newQuestion]);
    setDirtyQuestions((prev) => [...prev, newQuestion]);
    setAnswersArr((prev) => [
      ...prev,
      defaultCorrectAns,
      defaultFalseAns
    ]);
    setDirtyAnswers((prev) => [
      ...prev,
      defaultCorrectAns,
      defaultFalseAns
    ]);
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
    
    Object.entries(formDataEntries).forEach(([key, value]) => {
      formData.append(key, JSON.stringify(value));
    });

    const success = await updateQuiz(formData);
    toaster.create({
      title: success ? "Quiz updated" : "Error updating quiz",
      type: success ? "success" : "error",
      duration: 3000
    });
    if (success) {
      setDirtyQuizFields(undefined);
      setDirtyQuestions([]);
      setDirtyAnswers([]);
    }
    onClose();
  };

  return (
    <>
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
                <InputGroup
                  flex={1}
                  startElement={
                    <Text
                      fontSize="sm"
                      fontWeight="bold"
                      pr={2}
                    >
                      {index + 1 + "."}
                    </Text>
                  }
                  endElement={
                    <Button
                      visual="ghost"
                      p={0}
                      onClick={() => handleDeleteQuestion(q.id)}
                      disabled={questionsArr.length === 1}
                    >
                      <DeleteIcon
                        color="red"
                      />
                    </Button>
                  }
                >
                  <Input
                    placeholder="Question"
                    defaultValue={q.title}
                    {...register(`q_title${q.id}`, { required: true })}
                    onBlur={(e) => handleUpdateQuestion(e, q)}
                  />
                  
                </InputGroup>
              </FormControl>
              {answersArr.map((answer) => {
                if (answer.question_id !== q.id) return null;

                return (
                  <FormControl key={answer.id}>
                    <InputGroup
                      w="100%"
                      startElement={
                        answer.correct_answer ? (
                          <CheckCircleIcon color="green" fontSize="17px" />
                        ) : (
                          <input
                            type="radio"
                            {...register(`answer${answer.id}`)}
                            onChange={(e) => handleUpdateAnswer(e, answer)}
                            style={{ cursor: "pointer" }}
                          />
                        )
                      }
                      endElement={
                        <Button
                          visual="ghost"
                          p={0}
                          onClick={() => handleDeleteAnswer(answer.id)}
                          disabled={answer.correct_answer}
                        >
                          <DeleteIcon
                            color="red"
                          />
                        </Button>
                      }
                    >
                      <Input
                        placeholder="Answer"
                        defaultValue={answer.answer}
                        {...register(`answer${q.id}${answer.id}`, {
                          required: true,
                        })}
                        onBlur={(e) => handleUpdateAnswer(e, answer)}
                      />
                    </InputGroup>
                  </FormControl>
                );
              })}
              <Button
                onClick={() => addNewAnswer(q.id)}
                disabled={answersArr
                  .filter((ans) => ans.question_id === q.id)
                  .some((answer) => !answer.answer)}
                style={styles}
                visual="ghost"
              >
                <AddIcon fontSize="12px" />
                Add answer
              </Button>
            </div>
          ))}
          <Flex>
            <Button
              style={styles}
              onClick={addNewQuestion}
              visual="ghost"
              disabled={!isValid}
            >
              <AddIcon fontSize="12px"/>
              Add question
            </Button>
          </Flex>
        </Flex>

        <Button
          disabled={!isValid}
          onClick={handleSubmit}
        >
          Update Quiz
        </Button>
      </chakra.form>
    </>
  );
}
