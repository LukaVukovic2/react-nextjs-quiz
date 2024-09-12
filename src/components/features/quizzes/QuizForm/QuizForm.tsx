"use client";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  Input,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  Stepper,
  StepSeparator,
  StepStatus,
  StepTitle,
  useSteps,
  chakra,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabaseInsert } from "@/components/shared/Supabase/insert";
import { v4 as uuidv4 } from "uuid";
import { Question } from "@/app/typings/question";
import { Answer } from "@/app/typings/answer";

const steps = [
  { title: "First", description: "Quiz Info" },
  { title: "Second", description: "Add Questions" },
  { title: "Third", description: "Create Quiz" },
];

export default function QuizForm() {
  const toast = useToast();
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizId] = useState(uuidv4());
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

  const questionList = questions.map((question, index) => (
    <Box key={index}>
      <p>{question.title}</p>
      {question.answers &&
        question.answers.map((answer, index) => (
          <p key={index}>
            {answer.answer}{" "}
            {answer.correct_answer && <i className="fa-solid fa-check"></i>}
          </p>
        ))}
    </Box>
  ));

  const addAnswer = () => {
    const answer = {
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

  const createQuiz = async () => {
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
    const success = await supabaseInsert(formData);
    toast({
      title: success ? "Quiz created" : "Error creating quiz",
      status: success ? "success" : "error",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <div>
      <Stepper
        size="lg"
        index={activeStep}
      >
        {steps.map((step, index) => (
          <Step
            key={index}
            onClick={() => setStepIfValid(index)}
          >
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>

            <Box flexShrink="0">
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </Box>

            <StepSeparator />
          </Step>
        ))}
      </Stepper>

      <h1>Quiz Form</h1>

      <chakra.form
        as={Flex}
        flexDirection="column"
        gap="10px"
      >
        {activeStep === 0 && (
          <div>
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
          </div>
        )}
        {activeStep === 1 && (
          <Flex gap={10}>
            <chakra.div flex={1}>
              <FormControl>
                <Input
                  placeholder="Question title"
                  {...register("questionTitle", { required: true })}
                  onBlur={() => trigger("questionTitle")}
                />
              </FormControl>
              <FormControl>
                <Input
                  placeholder="Answer"
                  {...register("answer", { required: true })}
                  onBlur={() => trigger("answer")}
                />
              </FormControl>
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
              <Button
                isDisabled={!getValues("answer")}
                onClick={addAnswer}
              >
                New Answer
              </Button>
            </chakra.div>
            <chakra.div flex={1}>
              <Text>Current Question:</Text>
              <Text>Title: {getValues().questionTitle}</Text> <br />
              <Text>Answers:</Text>
              {answers.map((answer, index) => (
                <Box key={index}>
                  <p>
                    {answer.answer}{" "}
                    {answer.correct_answer && (
                      <i className="fa-solid fa-check"></i>
                    )}
                  </p>
                </Box>
              ))}
              <Button
                isDisabled={
                  !currentQuestion.correct || !currentQuestion.incorrect
                }
                onClick={addQuestion}
              >
                Add Question
              </Button>
            </chakra.div>
          </Flex>
        )}
        <Text>Your Questions:</Text>
        {questionList}
        {activeStep === 2 && (
          <>
            <p>Step 3</p>
            <Text>This is your Quiz!</Text>
            {questionList}
          </>
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
            <Button onClick={createQuiz}>Create Quiz</Button>
          )}
        </Flex>
      </chakra.form>
    </div>
  );
}
