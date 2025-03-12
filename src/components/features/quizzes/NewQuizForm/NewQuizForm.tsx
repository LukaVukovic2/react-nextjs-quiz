"use client";
import { Container, Flex, chakra } from "@chakra-ui/react";
import { Button } from "@/styles/theme/components/button";
import { steps } from "@/components/shared/utils/steps";
import StepperProgress from "@/components/shared/StepperProgress/StepperProgress";
import { createQuiz } from "@/components/shared/utils/actions/quiz/createQuiz";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
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
import { SubmitButton } from "@/components/core/SubmitButton/SubmitButton";

export default function NewQuizForm({
  quizTypes,
  questTypes,
}: {
  quizTypes: QuizType[];
  questTypes: QuestionType[];
}) {

  const [dialogVisible, setDialogVisible] = useState(false);
  const [qaList, setQaList] = useState<Qa[]>([]);
  const [quizId, setQuizId] = useState(() => uuidv4());
  const methods = useForm({ mode: "onChange" });
  const { handleSubmit, formState: {isSubmitting, isValid}, getValues, reset } = methods;
  const [currentStep, helpers] = useStep(3);
  const { setStep, goToNextStep, goToPrevStep } = helpers;
  
  const isAnonymous = getCookie("isAnonymous") === "true";
  const minQuizQuestionCount =
    Number(process.env.NEXT_PUBLIC_MIN_QUIZ_QUESTION_COUNT) ?? 0;
  const isFormValid =
    currentStep === 1
      ? isValid
      : qaList.length >= minQuizQuestionCount;

  const changeStep = (index: number) => {
    if ((isFormValid && index - currentStep < 2) || index < currentStep) {
      setStep(index);
    }
  };
  const onSubmit = async () => {
    const formValues = getValues();
    const quiz = {
      id: quizId,
      user_id: "",
      title: formValues.title,
      time: String(formValues.time),
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
    reset();
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
            setStep={changeStep}
          >
            <StepsContent index={2}>This is your Quiz!</StepsContent>
          </StepperProgress>
          <chakra.form
            onSubmit={handleSubmit(onSubmit)}
            >
            <Flex
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
                  type="button"
                >
                  Back
                </Button>
                {currentStep < steps.length ? (
                  <Button
                    onClick={goToNextStep}
                    disabled={!isFormValid}
                    type="button"
                  >
                    Next
                  </Button>
                ) : (
                  <SubmitButton
                    loading={isSubmitting}
                    loadingText="Creating..."
                    disabled={!isFormValid || isSubmitting}
                  >
                    Create Quiz
                  </SubmitButton>
                )}
              </Flex>
            </Flex>
          </chakra.form>
        </FormProvider>
      </Container>
    </>
  );
}