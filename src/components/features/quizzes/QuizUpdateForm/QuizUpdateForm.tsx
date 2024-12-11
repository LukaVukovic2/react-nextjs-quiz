import { chakra, Flex, Input, Text } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { Button } from "@/styles/theme/components/button";
import { FormLabel, FormControl } from "@chakra-ui/form-control";
import { AddIcon } from "@chakra-ui/icons";
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
import "./QuizUpdateForm.css";
import QuizUpdateAnswer from "../QuizUpdateAnswer/QuizUpdateAnswer";
import QuizUpdateQuestion from "../QuizUpdateQuestion/QuizUpdateQuestion";
import { useQuizUpdateContext } from "@/components/shared/utils/contexts/QuizUpdateContext";

interface QuizUpdateFormProps {
  quiz: Quiz;
  quizType: QuizType;
  questions_and_answers: Array<{
    question: Question;
    answers: Answer[];
  }>;
  onClose: () => void;
}

export default function QuizUpdateForm({
  quiz,
  quizType,
  questions_and_answers,
  onClose,
}: QuizUpdateFormProps) {
  const methods = useForm();
  const {
    register,
    trigger,
    control,
    formState: { isValid },
  } = methods;
  const [dirtyQuizFields, setDirtyQuizFields] = useState<Quiz>();
  const { quizTypes, questTypes } = useContext(MyQuizzesContext);
  const { answersArr, questionsArr, dirtyQuestions, deletedQuestions, dirtyAnswers, deletedAnswers } = useQuizUpdateContext([
    "answersArr",
    "questionsArr",
    "dirtyQuestions",
    "deletedQuestions",
    "dirtyAnswers",
    "deletedAnswers"
  ]);

  const formDataEntries = {
    quiz: dirtyQuizFields,
    questions: dirtyQuestions.get,
    answers: dirtyAnswers.get,
    deletedQuestions: deletedQuestions.get,
    deletedAnswers: deletedAnswers.get,
  };

  useEffect(() => {
    const answers: Answer[] = questions_and_answers
      .map((qa) => qa.answers)
      .flat();
    answersArr.set(answers);
    questionsArr.set(questions_and_answers.map((qa) => qa.question));
  }, [questions_and_answers]);

  const handleUpdateQuizInfo = async (
    e: FocusEvent<HTMLInputElement, Element>,
    id: string
  ) => {
    const { name, value } = e.target;

    const validateInput = await trigger(name);
    if (!validateInput) return;

    setDirtyQuizFields(
      (prev) =>
        ({
          ...prev,
          id,
          [name]: value,
        } as Quiz)
    );
  };

  const selectQuizType = (value: string) => {
    if (!value) return;
    setDirtyQuizFields(
      (prev) =>
        ({
          ...prev,
          id: quiz.id,
          id_quiz_type: value,
        } as Quiz)
    );
  };

  const addNewQuestion = () => {
    const id = uuidv4();
    const newQuestion: Question = {
      id,
      title: "",
      quiz_id: quiz.id,
      id_quest_type: "",
    };
    questionsArr.set([...(questionsArr.get as Question[]), newQuestion]);
    dirtyQuestions.set([...(dirtyQuestions.get as Question[]), newQuestion]);
  };

  const addNewAnswer = (question: Question) => {
    const questType = questTypes.items.find(type => type.value === question.id_quest_type)?.label;
    const newAnswer: Answer = {
      id: uuidv4(),
      answer: "",
      question_id: question.id,
      correct_answer: questType === "Short answer",
    };
    answersArr.set([...(answersArr.get as Answer[]), newAnswer]);
    dirtyAnswers.set([...((dirtyAnswers.get as Answer[]) || []), newAnswer]);
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
      duration: 3000,
    });
    if (success) {
      setDirtyQuizFields(undefined);
      dirtyQuestions.set([]);
      dirtyAnswers.set([]);
    }
    onClose();
  };

  return (
    <FormProvider {...methods}>
      <chakra.form
        overflowY="scroll"
        height="70vh"
      >
        <FormControl>
          <FormLabel>Quiz title</FormLabel>
          <Input
            placeholder="Quiz Title"
            defaultValue={quiz.title}
            {...register("title", { required: true })}
            onBlur={(e) => handleUpdateQuizInfo(e, quiz.id)}
          />
        </FormControl>
        {quizTypes && (
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
                    onChange: (e) => selectQuizType(e[0]),
                  }}
                  list={quizTypes}
                  defaultMessage="Select quiz type"
                />
              )}
            />
          </FormControl>
        )}
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
          {(questionsArr.get as Question[]).map((q, index) => {
            const questType = questTypes.items.find(
              (type) => type.value === q.id_quest_type
            )?.label;
            return (
              <div key={q.id}>
                <QuizUpdateQuestion
                  index={index}
                  question={q}
                  questType={questType}
                  questTypes={questTypes}
                />

                <QuizUpdateAnswer
                  question={q}
                  questType={questType}
                />
                <Button
                  onClick={() => addNewAnswer(q)}
                  disabled={(answersArr.get as Answer[])
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
              <AddIcon fontSize="12px" />
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