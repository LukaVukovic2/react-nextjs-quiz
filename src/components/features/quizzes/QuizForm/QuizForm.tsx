"use client";
import { Flex, chakra } from "@chakra-ui/react";
import { Button } from "@/styles/theme/components/button";
import { steps } from "@/components/shared/utils/steps";
import QuestionList from "@/components/shared/QuestionList/QuestionList";
import StepperProgress from "@/components/shared/StepperProgress/StepperProgress";
import { createQuiz } from "@/components/shared/utils/actions/quiz/createQuiz";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Question } from "@/app/typings/question";
import { Answer } from "@/app/typings/answer";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { Toaster, toaster } from "@/components/ui/toaster";
import { useStep } from "usehooks-ts";
import QuizDetailsForm from "./components/QuizDetailsForm";
import QuizQuestionForm from "./components/QuizQuestionForm";
import { QuizFormContext } from "../../../shared/utils/contexts/QuizFormContext";
import { QuizType } from "@/app/typings/quiz_type";

export default function QuizForm({ quizTypes }: { quizTypes: QuizType[] }) {
  const { push } = useRouter();

  const [currentStep, helpers] = useStep(3);
  const { setStep, goToNextStep, goToPrevStep } = helpers;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [quiz_id] = useState(uuidv4());
  const [questionTitle, setQuestionTitle] = useState("");
  const [question_id, setQuestionId] = useState(uuidv4());
  const [answers, setAnswers] = useState<Answer[]>([]);
  const methods = useForm({
    mode: "onChange",
  });

  const [isCorrect, setIsCorrect] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState({
    correct: false,
    incorrect: false,
  });

  const minQuizQuestionCount =
    Number(process.env.NEXT_PUBLIC_MIN_QUIZ_QUESTION_COUNT) || 0;
  const isFormValid =
    currentStep === 1
      ? methods.formState.isValid
      : questions.length >= minQuizQuestionCount;

  const setStepIfValid = (index: number) => {
    if ((isFormValid && index - currentStep < 2) || index < currentStep) {
      setStep(index);
    }
  };

  const handleCreateQuiz = async () => {
    const formValues = methods.getValues();
    const formData = {
      quiz: {
        id: quiz_id,
        user_id: "",
        title: formValues.title,
        time: "" + formValues.time,
        id_quiz_type: formValues.quiz_type[0],
      },
      questions: {
        questions,
      },
    };
    const success = await createQuiz(formData);

    toaster.create({
      title: success ? "Quiz created" : "Error creating quiz",
      type: success ? "success" : "error",
      duration: 5000,
    });
    push("/quizzes");
  };

  return (
    <QuizFormContext.Provider
      value={{
        currentStep,
        quiz_id,
        questions,
        setQuestions,
        questionTitle,
        setQuestionTitle,
        question_id,
        setQuestionId,
        answers,
        setAnswers,
        isCorrect,
        setIsCorrect,
        currentQuestion,
        setCurrentQuestion,
        setStepIfValid,
        quizTypes,
      }}
    >
      <FormProvider {...methods}>
        <chakra.div
          px={20}
          py={5}
        >
          <StepperProgress />
          <chakra.form
            as={Flex}
            flexDirection="column"
            gap={5}
            my={5}
          >
            {currentStep === 1 && <QuizDetailsForm />}
            {currentStep === 2 && <QuizQuestionForm />}
            {currentStep === 3 && <QuestionList questions={questions} />}
            <Flex justifyContent="space-between">
              <Button
                onClick={goToPrevStep}
                disabled={currentStep === 1}
              >
                Back
              </Button>
              {currentStep < steps.length ? (
                <Button
                  onClick={goToNextStep}
                  disabled={!isFormValid}
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
      </FormProvider>
    </QuizFormContext.Provider>
  );
}
