import { chakra, Flex, Text } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { Button } from "@/styles/theme/components/button";
import { AddIcon } from "@chakra-ui/icons";
import { updateQuiz } from "@/components/shared/utils/actions/quiz/updateQuiz";
import { useContext, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { Answer } from "@/app/typings/answer";
import { Question } from "@/app/typings/question";
import { Quiz } from "@/app/typings/quiz";
import { QuizType } from "@/app/typings/quiz_type";
import { MyQuizzesContext } from "@/components/shared/utils/contexts/MyQuizzesContext";
import QuizUpdateAnswer from "../QuizUpdateAnswer/QuizUpdateAnswer";
import QuizUpdateQuestion from "../QuizUpdateQuestion/QuizUpdateQuestion";
import { QuizUpdateContext } from "@/components/shared/utils/contexts/QuizUpdateContext";
import QuizUpdateInfo from "../QuizUpdateInfo/QuizUpdateInfo";
import "./QuizUpdateForm.css";

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
    formState: { isValid },
  } = methods;
  const { quizTypes, questTypes } = useContext(MyQuizzesContext);
  
  const [answersArr, setAnswersArr] = useState<Answer[]>([]);
  const [questionsArr, setQuestionsArr] = useState<Question[]>([]);
  const [dirtyQuestions, setDirtyQuestions] = useState<Question[]>([]);
  const [deletedQuestions, setDeletedQuestions] = useState<string[]>([]);
  const [dirtyAnswers, setDirtyAnswers] = useState<Answer[]>([]);
  const [deletedAnswers, setDeletedAnswers] = useState<string[]>([]);
  const [dirtyQuizFields, setDirtyQuizFields] = useState<Quiz>();

  const formDataEntries = {
    quiz: dirtyQuizFields,
    questions: dirtyQuestions,
    answers: dirtyAnswers,
    deletedQuestions: deletedQuestions,
    deletedAnswers: deletedAnswers,
  };

  useEffect(() => {
    const answers: Answer[] = questions_and_answers
      .map((qa) => qa.answers)
      .flat();
    setAnswersArr(answers);
    setQuestionsArr(questions_and_answers.map((qa) => qa.question));
  }, [questions_and_answers]);

  const addNewQuestion = () => {
    const id = uuidv4();
    const newQuestion: Question = {
      id,
      title: "",
      quiz_id: quiz.id,
      id_quest_type: "",
    };
    setQuestionsArr([...questionsArr, newQuestion]);
    setDirtyQuestions([...dirtyQuestions, newQuestion]);
  };

  const addNewAnswer = (question: Question) => {
    const questType = questTypes.items.find(
      (type) => type.value === question.id_quest_type
    )?.label;
    const newAnswer: Answer = {
      id: uuidv4(),
      answer: "",
      question_id: question.id,
      correct_answer: questType === "Short answer",
    };
    setAnswersArr([...answersArr, newAnswer]);
    setDirtyAnswers([...dirtyAnswers, newAnswer]);
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
      setDirtyQuestions([]);
      setDirtyAnswers([]);
    }
    onClose();
  };

  return (
    <QuizUpdateContext.Provider value={{
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
      dirtyQuizFields,
      setDirtyQuizFields
    }}>
      <FormProvider {...methods}>
        <chakra.form
          overflowY="scroll"
          height="70vh"
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
              const questType = questTypes.items.find(
                (type) => type.value === q.id_quest_type
              )?.label;
              const answersForQuestion = answersArr.filter(ans => ans.question_id === q.id);
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
                    disabled={(!q.id_quest_type || answersForQuestion
                      .some((answer) => !answer.answer))}
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
    </QuizUpdateContext.Provider>
  );
}