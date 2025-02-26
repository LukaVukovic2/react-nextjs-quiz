"use client";
import { Container, Flex, chakra } from "@chakra-ui/react";
import { Button } from "@/styles/theme/components/button";
import { steps } from "@/components/shared/utils/steps";
import StepperProgress from "@/components/shared/StepperProgress/StepperProgress";
import { createQuiz } from "@/components/shared/utils/actions/quiz/createQuiz";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
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
import { Qa } from "@/app/typings/qa";

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

  const [qaList, setQaList] = useState<Qa[]>([]);

  const [quizId, setQuizId] = useState(uuidv4());
  const methods = useForm({ mode: "onChange" });

  if (!isClient) return null;
  
  const isAnonymous = getCookie("isAnonymous") === "true" || false;
  const minQuizQuestionCount =
    Number(process.env.NEXT_PUBLIC_MIN_QUIZ_QUESTION_COUNT) || 0;
  const isFormValid =
    currentStep === 1
      ? methods.formState.isValid
      : qaList.length >= minQuizQuestionCount;

  const setStepIfValid = (index: number) => {
    if ((isFormValid && index - currentStep < 2) || index < currentStep) {
      setStep(index);
    }
  };

  const handleCreateQuiz = async () => {
    const formValues = methods.getValues();
    const quiz = {
      id: quizId,
      user_id: "",
      title: formValues.title,
      time: "" + formValues.time,
      id_quiz_type: formValues.quiz_type[0],
    }
    const questions = qaList.map(({question}: Qa) => question);
    const answers = qaList.flatMap(({answers}: Qa) => answers);
    const formatedData = { quiz, questions, answers };
    
    if(isAnonymous) {
      const anonCreatedQuizzes = JSON.parse(
        getCookie("quizzes") || "[]"
      );
      
      const newQuizzes = [...anonCreatedQuizzes, formatedData];
      setCookie("quizzes", JSON.stringify(newQuizzes), {
        maxAge: 60 * 60 * 24,
      });

      setDialogVisible(true);
    } else {
      const success = await createQuiz(formatedData);
      
      toaster.create({
        title: success ? "Quiz created" : "Error creating quiz",
        type: success ? "success" : "error",
        duration: 5000
      });
    }
    resetForm();
  };

  const resetForm = () => {
    methods.reset();
    setQaList([]);
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
                qaList={qaList}
                questTypes={questTypes}
                quizId={quizId}
                setQaList={setQaList}
              />
            )}
            {currentStep === 3 && <QuestionListAccordion qaList={qaList} />}
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