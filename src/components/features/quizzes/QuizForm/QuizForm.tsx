"use client";
import {
  Box,
  Flex,
  Input,
  chakra,
  Text,
  Card,
  Stack,
  StackSeparator
} from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl } from "@chakra-ui/form-control";
import { AddIcon, CheckCircleIcon } from "@chakra-ui/icons";
import { steps } from "@/components/shared/utils/steps";
import QuestionList from "@/components/shared/QuestionList/QuestionList";
import StepperProgress from "@/components/shared/StepperProgress/StepperProgress";
import { createQuiz } from "@/components/shared/utils/actions/quiz/createQuiz";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Question } from "@/app/typings/question";
import { Answer } from "@/app/typings/answer";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { Toaster, toaster } from "@/components/ui/toaster";
import { useStep } from "usehooks-ts";

export default function QuizForm() {
  const { push } = useRouter();

  const [currentStep, helpers] = useStep(3);
  const {
    setStep,
    goToNextStep,
    goToPrevStep,
  } = helpers

  const [questions, setQuestions] = useState<Question[]>([]);
  const [quiz_id] = useState(uuidv4());
  const [questionTitle, setQuestionTitle] = useState('');
  const [question_id, setQuestionId] = useState(uuidv4());
  const [answers, setAnswers] = useState<Answer[]>([]);
  const {
    register,
    getValues,
    resetField,
    trigger,
    formState: { isValid },
  } = useForm({ mode: "onChange" });

  const [isCorrect, setIsCorrect] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState({
    correct: false,
    incorrect: false,
  });

  const minQuizQuestionCount = Number(process.env.NEXT_PUBLIC_MIN_QUIZ_QUESTION_COUNT) || 0;
  const isFormValid = currentStep === 1 ? isValid : questions.length >= minQuizQuestionCount;

  const validateQuestion = (answer: Answer) => {
    if (answer.correct_answer) {
      setCurrentQuestion((prev) => ({ ...prev, correct: true }));
    } else {
      setCurrentQuestion((prev) => ({ ...prev, incorrect: true }));
    }
  };
  const isQuestionValid = !currentQuestion.correct || !currentQuestion.incorrect || questionTitle === "";

  const addAnswer = () => {
    const answer = {
      id: uuidv4(),
      answer: getValues().answer,
      correct_answer: getValues().correctAnswer,
      question_id,
    };
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    validateQuestion(answer);
    resetField("answer");
    resetField("correctAnswer", { defaultValue: false });
    setIsCorrect(false);
  };

  const addQuestion = () => {
    const id = question_id;
    setQuestions([
      ...questions,
      {
        id,
        title: getValues().questionTitle,
        quiz_id,
        answers,
      },
    ]);
    setAnswers([]);
    resetField("questionTitle");
    resetField("answer");
    resetField("correctAnswer", { defaultValue: false });
    setIsCorrect(false);
    setQuestionId(uuidv4());
    setCurrentQuestion({ correct: false, incorrect: false });
  };

  const setStepIfValid = (index: number) => {
    if ((isFormValid && (index - currentStep < 2)) || (index < currentStep)){
      setStep(index);
    }
  };

  const handleCreateQuiz = async () => {
    const formData = {
      quiz: {
        id: quiz_id,
        user_id: "",
        title: getValues().title,
        category: getValues().category,
        time: getValues().time,
      },
      questions: {
        questions,
      },
    };
    const success = await createQuiz(formData);
    
    toaster.create({
      title: success ? "Quiz created" : "Error creating quiz",
      type: success ? "success" : "error",
      duration: 5000
    });
    push("/quizzes");
  };

  return (
    <chakra.div px={20} py={5}>
      <StepperProgress currentStep={currentStep - 1} setStepIfValid={setStepIfValid} />

      <chakra.form
        as={Flex}
        flexDirection="column"
        gap={10}
        my={5}
        mx={currentStep === 1 ? "20%" : 0}
      >
        {currentStep === 1 && (
          <Flex gap={5} flexDir="column">
            <FormControl>
              <Input
                placeholder="Title"
                {...register("title", { required: true })}
                onBlur={() => trigger("title")}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Time (in seconds)"
                {...register("time", { required: true })}
                type="number"
                onBlur={() => trigger("time")}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Category"
                {...register("category", { required: true })}
                onBlur={() => trigger("category")}
              />
            </FormControl>
          </Flex>
        )}
        {currentStep === 2 && (
          <>
            <Flex gap={10}>
              <chakra.div flex={1}>
                <Card.Root>
                  <Card.Body>
                    <Stack separator={<StackSeparator />} spaceY={4}>
                      <Box>
                        <FormControl>
                          <Input
                            placeholder="Question title"
                            {...register("questionTitle", { required: true })}
                            onChange={(e) => {
                              setQuestionTitle(e.target.value);
                              trigger("questionTitle");
                            }}
                          />
                        </FormControl>
                      </Box>
                      <Box>
                        <FormControl>
                          <Input
                            placeholder="Add answer option"
                            {...register("answer", { required: true })}
                            onBlur={() => trigger("answer")}
                          />
                        </FormControl>
                      </Box>
                      <Box>
                        <FormControl>
                          <Checkbox
                            disabled={currentQuestion.correct}
                            {...register("correctAnswer")}
                            checked={isCorrect}
                            cursor="pointer"
                            onCheckedChange={(e) => setIsCorrect(!!e.checked)}
                          >
                            Correct Answer
                          </Checkbox>
                        </FormControl>
                      </Box>
                    </Stack>
                    <Button
                      disabled={!getValues("answer")}
                      onClick={addAnswer}
                    >
                      New Answer
                    </Button>
                  </Card.Body>
                </Card.Root>
              </chakra.div>
              <chakra.div flex={1}>
                <Text>Current Question</Text>
                <Text mb={2}>Title: {getValues("questionTitle")}</Text>
                <Text>Answers:</Text>
                {answers.map((answer) => (
                  <Box key={answer.answer}>
                    <Text>
                      {answer.answer + " "}
                      {answer.correct_answer && (
                        <CheckCircleIcon color="green.400" />
                      )}
                    </Text>
                  </Box>
                ))}
                <Button
                  disabled={isQuestionValid}
                  onClick={addQuestion}
                  gap={2}
                  bg="green.400"
                  color="white"
                >
                  <AddIcon boxSize={4} />
                  Add Question
                </Button>
              </chakra.div>
            </Flex>
            <Text>Your Questions:</Text>
            <QuestionList questions={questions} />
          </>
        )}
        {currentStep === 3 && (
          <div>
            <b>{getValues("title")}</b>
            <QuestionList questions={questions} />
          </div>
        )}
        <Flex justifyContent="space-between">
          <Button
            onClick={goToPrevStep}
            disabled={currentStep === 1}
          >
            Back
          </Button>
          {currentStep < steps.length ? (
            <Button
              disabled={!isFormValid}
              onClick={goToNextStep}
            >
              Next
            </Button>
          ) : (
            <Button onClick={handleCreateQuiz}>Create Quiz</Button>
          )}
        </Flex>
        <Toaster />
      </chakra.form>
    </chakra.div>
  );
}