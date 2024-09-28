"use client";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  Input,
  useSteps,
  chakra,
  Text,
  useToast,
  Card,
  CardBody,
  Stack,
  StackDivider
} from "@chakra-ui/react";
import { AddIcon, CheckCircleIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { createQuiz } from "@/components/features/quizzes/QuizForm/QuizForm.utils";
import { v4 as uuidv4 } from "uuid";
import { Question } from "@/app/typings/question";
import { Answer } from "@/app/typings/answer";
import StepperProgress from "@/components/shared/StepperProgress/StepperProgress";
import { steps } from "@/components/shared/utils/steps";
import QuestionList from "@/components/shared/QuestionList/QuestionList";
import { navigateHome } from "@/components/shared/utils/redirection/navigateHome";

export default function QuizForm() {
  const toast = useToast();
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizId] = useState(uuidv4());
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
  const isFormValid = activeStep == 0 ? isValid : questions.length > 0;
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
        quizId,
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
    if ((isFormValid && index - activeStep < 2) || index < activeStep)
      setActiveStep(index);
  };

  const handleCreateQuiz = async () => {
    const formData = {
      quiz: {
        id: quizId,
        user_id: "",
        title: getValues().title,
        category: getValues().category,
        timer: getValues().timer,
      },
      questions: {
        questions,
      },
    };
    const success = await createQuiz(formData);
    toast({
      title: success ? "Quiz created" : "Error creating quiz",
      status: success ? "success" : "error",
      duration: 5000,
      isClosable: true,
    });
    if(success){
      navigateHome();
    }
  };

  return (
    <chakra.div px={20} py={5}>
      <StepperProgress activeStep={activeStep} setStepIfValid={setStepIfValid} />

      <chakra.form
        as={Flex}
        flexDirection="column"
        gap={10}
        my={5}
        mx={activeStep === 0 ? "20%" : 0}
      >
        {activeStep === 0 && (
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
                placeholder="Timer (in seconds)"
                {...register("timer", { required: true })}
                type="number"
                onBlur={() => trigger("timer")}
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
        {activeStep === 1 && (
          <>
            <Flex gap={10}>
              <chakra.div flex={1}>
                <Card>
                  <CardBody>
                    <Stack divider={<StackDivider />} spacing='4'>
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
                            isDisabled={currentQuestion.correct}
                            {...register("correctAnswer")}
                            isChecked={isCorrect}
                            onChange={(e) => setIsCorrect(e.target.checked)}
                          >
                            Correct Answer
                          </Checkbox>
                        </FormControl>
                      </Box>
                    </Stack>
                    <Button
                      isDisabled={!getValues("answer")}
                      onClick={addAnswer}
                    >
                      New Answer
                    </Button>
                  </CardBody>
                </Card>
              </chakra.div>
              <chakra.div flex={1}>
                <Text>Current Question</Text>
                <Text mb={2}>Title: {getValues("questionTitle")}</Text>
                <Text>Answers:</Text>
                {answers.map((answer) => (
                  <Box key={answer.answer}>
                    <p>
                      {answer.answer}{" "}
                      {answer.correct_answer && (
                        <CheckCircleIcon color="green.400" />
                      )}
                    </p>
                  </Box>
                ))}
                <Button
                  isDisabled={isQuestionValid}
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
        {activeStep === 2 && (
          <div>
            <Text>This is your Quiz!</Text>
            <b>{getValues("title")}</b>
            <QuestionList questions={questions} />
          </div>
        )}
        <Flex justifyContent="space-between">
          <Button
            onClick={() => setActiveStep(activeStep - 1)}
            isDisabled={activeStep === 0}
          >
            Back
          </Button>
          {activeStep < steps.length - 1 ? (
            <Button
              isDisabled={!isFormValid}
              onClick={() => setActiveStep(activeStep + 1)}
            >
              Next
            </Button>
          ) : (
            <Button onClick={handleCreateQuiz}>Create Quiz</Button>
          )}
        </Flex>
      </chakra.form>
    </chakra.div>
  );
}
