"use client";
import { Container, Flex, chakra } from "@chakra-ui/react";
import { Button } from "@/styles/theme/components/button";
import { steps } from "@/components/shared/utils/steps";
import StepperProgress from "@/components/shared/StepperProgress/StepperProgress";
import { createQuiz } from "@/components/shared/utils/actions/quiz/createQuiz";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Question } from "@/app/typings/question";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { toaster } from "@/components/ui/toaster";
import { useStep } from "usehooks-ts";
import QuizDetailsForm from "./components/QuizDetailsForm";
import QuizQuestionForm from "./components/QuizQuestionForm";
import { QuizType } from "@/app/typings/quiz_type";
import { QuestionType } from "@/app/typings/question_type";
import QuestionListAccordion from "@/components/shared/QuestionListAccordion/QuestionListAccordion";
import { StepsContent } from "@/components/ui/steps";
import { getCookie, setCookie } from "cookies-next";
import AuthModal from "@/components/shared/AuthModal/AuthModal";
import AlertWrapper from "@/components/core/AlertWrapper/AlertWrapper";

export default function NewQuizForm({
  quizTypes,
  questTypes,
}: {
  quizTypes: QuizType[];
  questTypes: QuestionType[];
}) {
  const { push } = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [currentStep, helpers] = useStep(3);
  useEffect(() => {
    setIsClient(true);
  }, []);
  const { setStep, goToNextStep, goToPrevStep } = helpers;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizId, setQuizId] = useState(uuidv4());
  const methods = useForm({ mode: "onChange" });

  if (!isClient) return null;
  
  const isAnonymous = getCookie("isAnonymous") === "true" || false;
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
        id: quizId,
        user_id: "",
        title: formValues.title,
        time: "" + formValues.time,
        id_quiz_type: formValues.quiz_type[0],
      },
      questions: {
        questions,
      },
    };
    if(isAnonymous) {
      const anonCreatedQuizzes = JSON.parse(
        getCookie("quizzes") || "[]"
      );
      const quiz = { ...formData.quiz };
      const answers = formData.questions.questions.flatMap((question: Question) => question.answers);
      const questions = formData.questions.questions.map((question: Question) => {
        delete question.answers;
        return question;
      });
      const formatedData = { quiz, questions, answers };

      const newQuizzes = [...anonCreatedQuizzes, formatedData];
      setCookie("quizzes", JSON.stringify(newQuizzes), {
        maxAge: 60 * 60 * 24,
      });

      setDialogVisible(true);
      resetForm();
    } else {
      const success = await createQuiz(formData);
  
      toaster.create({
        title: success ? "Quiz created" : "Error creating quiz",
        type: success ? "success" : "error",
        duration: 5000
      });
      push("/quizzes");
    }
  };

  const resetForm = () => {
    methods.reset();
    setQuestions([]);
    setStep(1);
    setQuizId(uuidv4());
  }

  return (
    <>
      {
        dialogVisible && (
          <AuthModal
            dialogVisible={dialogVisible}
            setDialogVisible={setDialogVisible}
          >
            <AlertWrapper
              title="Please log in or sign up in order to save your quiz"
              status="info"            
            />
          </AuthModal>
        )
      }
      <Container
        maxW="3xl"
        as={Flex}
        flexDirection="column"
        px={20}
        py={5}
        flex={1}
      >
        <FormProvider {...methods}>
          <StepperProgress
            currentStep={currentStep}
            setStep={setStepIfValid}
          >
            <StepsContent index={2}>This is your Quiz!</StepsContent>
          </StepperProgress>
          <chakra.form
            as={Flex}
            flexDirection="column"
            gap={5}
            my={5}
            flex={1}
          >
            {currentStep === 1 && <QuizDetailsForm quizTypes={quizTypes} />}
            {currentStep === 2 && (
              <QuizQuestionForm
                questions={questions}
                questTypes={questTypes}
                quizId={quizId}
                setQuestions={setQuestions}
              />
            )}
            {currentStep === 3 && <QuestionListAccordion questions={questions} />}
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
          </chakra.form>
        </FormProvider>
      </Container>
    </>
  );
}