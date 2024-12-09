import {
  chakra,
  Flex,
  Input,
  Text,
} from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { Button } from "@/styles/theme/components/button";
import { InputGroup } from "@/components/ui/input-group";
import { FormLabel, FormControl } from "@chakra-ui/form-control";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { updateQuiz } from "@/components/shared/utils/actions/quiz/updateQuiz";
import { FocusEvent, useContext, useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { Answer } from "@/app/typings/answer";
import { Question } from "@/app/typings/question";
import { Quiz } from "@/app/typings/quiz";
import { QuizType } from "@/app/typings/quiz_type";
import SelectOption from "@/components/core/SelectOption/SelectOption";
import { MyQuizzesContext } from "@/components/shared/utils/contexts/MyQuizzesContext";
import { Field } from "@/components/ui/field";
import QuizUpdateQuestion from "./components/QuizUpdateQuestion";
import "./QuizUpdateForm.css";

interface QuizUpdateFormProps {
  quiz: Quiz;
  quizType: QuizType;
  questions_and_answers: Array<{
    question: Question;
    answers: Answer[];
  }>;
  onClose: () => void;
}

export default function QuizUpdateForm({ quiz, quizType, questions_and_answers, onClose }: QuizUpdateFormProps) {
  const methods = useForm();
  const { register, trigger, control, formState: {isValid}} = methods;
  const [dirtyQuizFields, setDirtyQuizFields] = useState<Quiz>();
  const [dirtyQuestions, setDirtyQuestions] = useState<Question[]>([]);
  const [deletedQuestions, setDeletedQuestions] = useState<string[]>([]);
  const [questionsArr, setQuestionsArr] = useState<Question[]>([]);
  const [dirtyAnswers, setDirtyAnswers] = useState<Answer[]>([]);
  const [deletedAnswers, setDeletedAnswers] = useState<string[]>([]);
  const [answersArr, setAnswersArr] = useState<Answer[]>([]);
  const { quizTypes, questTypes } = useContext(MyQuizzesContext);

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

  const handleUpdateQuizInfo = async (e: FocusEvent<HTMLInputElement, Element>, id: string) => {
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

  const selectQuizType = (value: string) => {
    if (!value) return;
    setDirtyQuizFields((prev) =>
      ({
        ...prev,
        id: quiz.id,
        id_quiz_type: value,
      } as Quiz)
    );
  }

  const handleUpdateQuestion = async (e: FocusEvent<HTMLInputElement, Element>, q: Question) => {
    const { value } = e.target;

    const validateInput = await trigger("q_title" + q.id);
    if (!validateInput) return;

    setDirtyQuestions((prev) => {
      const questionIndex = prev.findIndex((question) => question.id === q.id);
      const newQuestion: Question = { id: q.id, title: value, quiz_id: q.quiz_id, id_quest_type: q.id_quest_type };

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
    value: string,
    a: Answer
  ) => {

    const validateInput = await trigger(`answer${a.question_id}${a.id}`);
    if (!validateInput) return;

    const updatedAnswers = answersArr.map((answer) => {
      if (answer.id === a.id) {
        return { ...answer, answer: value };
      }
      return answer;
    });

    setAnswersArr([...updatedAnswers]);

    setDirtyAnswers((prev) => {
      const dirtyAns = [...prev];
      updatedAnswers.forEach((answer) => {
        const answerIndex = dirtyAns.findIndex((ans) => ans.id === answer.id);
        if (answer.id === a.id) {
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
      id_quest_type: ""
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

  const addNewAnswer = (question_id: string) => {
    const newAnswer: Answer = {
      id: uuidv4(),
      answer: "",
      question_id,
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

  const changeCorrectAnswer = (questionId: string, answerId: string, questionType: string) => {
    const updatedAnswers = answersArr.map((answer) => {
      if (answer.question_id === questionId) {
        if (questionType === "Single choice") {
          return {
            ...answer,
            correct_answer: answer.id === answerId,
          };
        } else if (questionType === "Multiple choice") {
          return {
            ...answer,
            correct_answer: answer.id === answerId ? !answer.correct_answer : answer.correct_answer,
          };
        }
      }
      return answer;
    });
    setAnswersArr(updatedAnswers);
    setDirtyAnswers((prev) => {
      const dirtyAns = [...prev];
      updatedAnswers.forEach((answer) => {
        const answerIndex = dirtyAns.findIndex((ans) => ans.id === answer.id);
        if (answer.question_id === questionId) {
          if (answerIndex === -1) {
            dirtyAns.push(answer);
          } else {
            dirtyAns[answerIndex] = answer;
          }
        }
      });

      return dirtyAns;
    });
  }

  const selectQuestionType = (value: string, question: Question) => {
    if (!value) return;
    setDirtyQuestions((prev) => {
      const questionIndex = prev.findIndex((q) => q.id === question.id);
      const newQuestion: Question = { ...question, id_quest_type: value };

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
    setQuestionsArr((prev) => {
      const questionIndex = prev.findIndex((q) => q.id === question.id);
      const newQuestion: Question = { ...question, id_quest_type: value };

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
  }


  return (
    <FormProvider {...methods}>
      <chakra.form overflowY="scroll" height="70vh">
        <FormControl>
          <FormLabel>Quiz title</FormLabel>
          <Input
            placeholder="Quiz Title"
            defaultValue={quiz.title}
            {...register("title", { required: true })}
            onBlur={(e) => handleUpdateQuizInfo(e, quiz.id)}
          />
        </FormControl>
        {
          quizTypes &&
          <FormControl>
            <FormLabel>Quiz type</FormLabel>
            <Controller 
              name="id_quiz_type"
              control={control}
              defaultValue={quizType.id}
              rules={{ required: true }}
              render={({ field }) => (
                <SelectOption 
                  field={{
                    ...field,
                    value: field.value || quizType.id || "",
                    onChange: (e) => selectQuizType(e[0])
                  }}
                  list={quizTypes}
                  defaultMessage="Select quiz type"
                />
              )}
            />
          </FormControl>
        }
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
            onBlur={(e) => handleUpdateQuizInfo(e, quiz.id)}
          />
        </FormControl>

        <Text>Questions</Text>
        <Flex
          flexDirection="column"
          gap={5}
          my={3}
        >
          {questionsArr.map((q, index) => {
            const questType = questTypes.items.find((type) => type.value === q.id_quest_type)?.label;
            return (
            <div key={q.id}>
              {
                questType === undefined ? (
                  <FormControl>
                    <Field label="Question type">
                      <Controller 
                        name="id_quest_type"
                        control={control}
                        defaultValue={q.id_quest_type}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <SelectOption 
                            field={{
                              ...field,
                              value: q.id_quest_type || "",
                              onChange: (e) => selectQuestionType(e[0], q)
                            }}
                            list={questTypes}
                            defaultMessage="Select question type"
                          />
                        )}
                      />
                    </Field>
                  </FormControl>
                ): 
                <Text>{questType}</Text>
              }
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
              <QuizUpdateQuestion
                answersArr={answersArr.filter((answer) => answer.question_id === q.id)}
                question={q}
                questType={questType}
                handleDeleteAnswer={handleDeleteAnswer}
                handleUpdateAnswer={handleUpdateAnswer}
                changeCorrectAnswer={changeCorrectAnswer}  
              />
              <Button
                onClick={() => addNewAnswer(q.id)}
                disabled={answersArr
                  .filter((ans) => ans.question_id === q.id)
                  .some((answer) => !answer.answer)}
                visual="ghost"
              >
                <AddIcon fontSize="12px" />
                Add answer
              </Button>
            </div>
            );
          })}
          <Flex>
            <Button
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
          type="button"
        >
          Update Quiz
        </Button>
      </chakra.form>
    </FormProvider>
  );
}