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
  Card,
  CardBody,
  CardHeader,
  Text
} from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {supabaseInsert} from "@/components/shared/Supabase/insert";
import {v4 as uuidv4} from "uuid";
import { Question } from "@/app/typings/question";
import { Answer } from "@/app/typings/answer";

const steps = [
  { title: "First", description: "Quiz Info" },
  { title: "Second", description: "Add Questions" },
  { title: "Third", description: "Create Quiz" },
];

export default function QuizForm() {
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });
  const [isCorrect, setIsCorrect] = useState(false);
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizId] = useState(uuidv4());
  const [question_id, setQuestionId] = useState(uuidv4());
  const [answers, setAnswers] = useState<Answer[]>([]);
  const { register, getValues, resetField} = useForm({});

  const questionList = questions.map((question, index) => (
    <Box key={index}>
      <p>{question.title}</p>
      {
        question.answers && question.answers.map((answer, index) => (
          <p key={index}>{answer.answer} {answer.correct_answer && <i className="fa-solid fa-check"></i>}</p>
        ))
      }
    </Box>
  ))

  const addAnswer = () => {
    const newAnswers = [...answers, {
      answer: getValues().answer,
      correct_answer: getValues().correctAnswer,
      question_id
    }];
    setAnswers(newAnswers);
    resetField("answer");
    resetField("correctAnswer", {defaultValue: false});
    setIsCorrect(false);
  }

  const addQuestion = () => {
    const id = question_id;
    setQuestions([...questions, {
      id,
      title: getValues().questionTitle,
      quizId,
      answers
    }]);
    setAnswers([]);
    resetField("questionTitle");
    resetField("answer");
    resetField("correctAnswer", {defaultValue: false});
    setIsCorrect(false);
    setQuestionId(uuidv4());
  }

  const createQuiz = async () => {
    const formData = {
      quiz: {
        id: quizId,
        user_id: "",
        title: getValues().title,
        category: getValues().category,
        timer: getValues().timer
      },
      questions: {
        questions
      }
    }
    console.log(formData);
    const success = await supabaseInsert(formData);
    console.log(success);
  }

  return (
    <div>
      <Stepper
        size="lg"
        index={activeStep}
      >
        {steps.map((step, index) => (
          <Step
            key={index}
            onClick={() => setActiveStep(index)}
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

      <chakra.form as={Flex} flexDirection="column" gap="10px">
        {activeStep === 0 && (
          <>
            <FormControl>
              <Input
                placeholder="Title"
                {...register("title")}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Timer (in seconds)"
                {...register("timer")}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Category"
                {...register("category")}
              />
            </FormControl>
          </>
        )}
        {activeStep === 1 && (
          <>
            <FormControl>
              <Input
                placeholder="Question title"
                {...register("questionTitle")}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Answer"
                {...register("answer")}
              />
            </FormControl>
            <FormControl>
              <Checkbox {...register('correctAnswer')} isChecked={isCorrect}
          onChange={(e) => setIsCorrect(e.target.checked)}>
                Correct Answer
              </Checkbox>
            </FormControl>
              <Button onClick={addAnswer}>New Answer</Button>
            <Card>
              <CardHeader>
                Current Question
              </CardHeader>
              <CardBody>
                <Text>Title: {getValues().questionTitle}</Text> <br />
                <Text>Answers:</Text>
                {answers.map((answer, index) => (
                  <Box key={index}>
                    <p>{answer.answer} {answer.correct_answer && <i className="fa-solid fa-check"></i>}</p>
                  </Box>
                ))}
              </CardBody>
            </Card>
            <Button onClick={addQuestion}>Add Question</Button>
            {questionList}
          </>)
          
        }
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
            <Button onClick={() => setActiveStep(activeStep + 1)}>Next</Button>
          ) : (
            <Button onClick={createQuiz}>Create Quiz</Button>
          )}
        </Flex>
      </chakra.form>
    </div>
  );
}
