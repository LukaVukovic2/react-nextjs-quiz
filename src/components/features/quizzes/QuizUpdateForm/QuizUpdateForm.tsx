import { chakra, Flex, Text } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { Button } from "@/styles/theme/components/button";
import { AddIcon } from "@chakra-ui/icons";
import { updateQuiz } from "@/components/shared/utils/actions/quiz/updateQuiz";
import { useContext, useState } from "react";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { Answer } from "@/app/typings/answer";
import { Question } from "@/app/typings/question";
import { QuizBasic } from "@/app/typings/quiz";
import { QuizType } from "@/app/typings/quiz_type";
import { MyQuizzesContext } from "@/components/shared/utils/contexts/MyQuizzesContext";
import QuizUpdateAnswer from "../QuizUpdateAnswer/QuizUpdateAnswer";
import QuizUpdateQuestion from "../QuizUpdateQuestion/QuizUpdateQuestion";
import { QuizUpdateContext } from "@/components/shared/utils/contexts/QuizUpdateContext";
import QuizUpdateInfo from "../QuizUpdateInfo/QuizUpdateInfo";
import "./QuizUpdateForm.css";
import { Qa } from "@/app/typings/qa";
import { Button as SubmitButton } from "@chakra-ui/react";

interface QuizUpdateFormProps {
  quiz: QuizBasic;
  quizType: QuizType;
  qaList: Qa[];
  closeDialog: () => void;
}

export default function QuizUpdateForm({
  quiz,
  quizType,
  qaList,
  closeDialog,
}: QuizUpdateFormProps) {
  const methods = useForm({ mode: "onChange" });
  const {formState: { isValid, isSubmitting }, handleSubmit} = methods;
  
  const { quizTypes, questTypes } = useContext(MyQuizzesContext);
  const [questionsArr, setQuestionsArr] = useState<Question[]>(qaList.map(({question}) => question));
  const [answersArr, setAnswersArr] = useState<Answer[]>(qaList.map(({answers}) => answers).flat());
  const [dirtyQuestions, setDirtyQuestions] = useState<Question[]>([]);
  const [dirtyAnswers, setDirtyAnswers] = useState<Answer[]>([]);
  const [deletedQuestions, setDeletedQuestions] = useState<string[]>([]);
  const [deletedAnswers, setDeletedAnswers] = useState<string[]>([]);

  const questTypeMap = new Map(
    questTypes.items.map((type) => [type.value, type.label])
  );

  const addNewQuestion = () => {
    const id = uuidv4();
    const newQuestion = {id, quiz_id: quiz.id} as Question;
    setQuestionsArr([...questionsArr, newQuestion]);
    setDirtyQuestions([...dirtyQuestions, newQuestion]);
  };

  const addNewAnswer = (question: Question, questType: string) => {
    const newAnswer: Answer = {
      id: uuidv4(),
      answer: "",
      question_id: question.id,
      correct_answer: questType === "Short answer",
    };
    setAnswersArr([...answersArr, newAnswer]);
    setDirtyAnswers([...dirtyAnswers, newAnswer]);
  };

  const onSubmit = async (data: FieldValues) => {
    const updatedData = {
      dirtyQuizFields: {id: quiz.id, id_quiz_type: String(data.id_quiz_type), title: data.title, time: data.time[0]} as QuizBasic,
      dirtyQuestions,
      dirtyAnswers,
      deletedQuestions,
      deletedAnswers
    }
    const success = await updateQuiz(updatedData);
    toaster.create({
      title: success ? "Quiz updated" : "Error updating quiz",
      type: success ? "success" : "error",
      duration: 3000,
    });
    if (success){
      resetDirtyFields();
      closeDialog();
    }
  };

  const resetDirtyFields = () => {
    setDirtyQuestions([]);
    setDirtyAnswers([]);
  }

  return (
    <QuizUpdateContext.Provider
      value={{
        answersArr,
        setAnswersArr,
        questionsArr,
        setQuestionsArr,
        dirtyQuestions,
        setDirtyQuestions,
        deletedQuestions,
        setDeletedQuestions,
        dirtyAnswers,
        setDirtyAnswers,
        deletedAnswers,
        setDeletedAnswers,
      }}
    >
      <FormProvider {...methods}>
        <chakra.form
          overflowY="scroll"
          height="70vh"
          onSubmit={handleSubmit(onSubmit)}
        >
          <QuizUpdateInfo
            quiz={quiz}
            quizType={quizType}
            quizTypes={quizTypes}
          />

          <Text>Questions</Text>
          <Flex
            flexDirection="column"
            gap={5}
            my={3}
          >
            {questionsArr.map((q, index) => {
              const questType = questTypeMap.get(q.id_quest_type);
              const hasEmptyAnswers = answersArr.some((ans) => ans.question_id === q.id && !ans.answer);
              const isDisableAns = !q.id_quest_type || hasEmptyAnswers;
              return (
                <div key={q.id}>
                  <QuizUpdateQuestion
                    index={index}
                    question={q}
                    questType={questType}
                  />

                  <QuizUpdateAnswer
                    question={q}
                    questType={questType}
                  />
                  <Button
                    onClick={() => addNewAnswer(q, questType)}
                    disabled={isDisableAns}
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

          <SubmitButton
            disabled={!isValid || isSubmitting}
            loadingText="Updating..."
            loading={isSubmitting}
            type="submit"
          >
            Update Quiz
          </SubmitButton>
        </chakra.form>
      </FormProvider>
    </QuizUpdateContext.Provider>
  );
}