import { Question } from "@/app/typings/question";
import { QuestionType } from "@/app/typings/question_type";
import ChoiceQuestionInput from "@/components/shared/ChoiceQuestionInput/ChoiceQuestionInput";
import ShortAnswerOptionInput from "@/components/shared/ShortAnswerOptionInput/ShortAnswerOptionInput";
import { Field } from "@/components/ui/field";
import { Button } from "@/styles/theme/components/button";
import { Input } from "@chakra-ui/react";
import debounce from "debounce";
import { useFormContext } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

interface IQuestionTypeFormProps {
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  currentQuestion: Question;
  setCurrentQuestion: React.Dispatch<React.SetStateAction<Question>>;
  questTypes: QuestionType[];
  initializeCurrentAnswers: (typeId: string) => void;
}

export default function QuestionTypeForm({
  setQuestions,
  currentQuestion,
  setCurrentQuestion,
  questTypes,
  initializeCurrentAnswers,
}: IQuestionTypeFormProps) {
  const {
    register,
    trigger,
    formState: { isValid },
  } = useFormContext();

  const addNewAnswer = (type_name?: string) => {
    const currentAnswer = {
      id: uuidv4(),
      answer: "",
      correct_answer: type_name === "Short answer" ? true : false,
      question_id: currentQuestion.id,
    };
    setCurrentQuestion((prev) => {
      return {
        ...prev,
        answers: [...(prev.answers || []), currentAnswer],
      };
    });
    trigger(`correctAnswer_${currentQuestion.id}`);
    trigger(`answer${currentAnswer.id}`);
  };

  const addNewQuestion = () => {
    setQuestions((prev) => [...prev, currentQuestion]);
    setCurrentQuestion((prev) => ({
      ...prev,
      id: uuidv4(),
      title: "",
      answers: [],
    }));
    trigger();
    initializeCurrentAnswers(currentQuestion.id_quest_type);
  };

  const changeCorrectAnswer = (answerId: string, selectedTypeName: string) => {
    setCurrentQuestion((prev) => ({
      ...prev,
      answers: (prev.answers || []).map((ans) => ({
        ...ans,
        correct_answer:
          selectedTypeName === "Single choice"
            ? ans.id === answerId
            : ans.id === answerId
            ? !ans.correct_answer
            : ans.correct_answer,
      })),
    }));
    trigger(`correctAnswer_${currentQuestion.id}`);
  };

  const changeQuestionTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentQuestion((prev) => ({
      ...prev,
      title: e.target.value,
    }));
    trigger("questionTitle");
  };

  const updateAnswer = (
    e: React.FocusEvent<HTMLInputElement>,
    answerId: string
  ) => {
    setCurrentQuestion((prev) => {
      return {
        ...prev,
        answers: (prev.answers ?? []).map((ans) => {
          if (ans.id === answerId) {
            return {
              ...ans,
              answer: e.target.value,
            };
          }
          return ans;
        }),
      };
    });
  };

  const deleteAnswer = (answerId: string) => {
    setCurrentQuestion((prev) => {
      return {
        ...prev,
        answers: (prev.answers ?? []).filter((ans) => ans.id !== answerId),
      };
    });
  };

  const selectedTypeName =
    questTypes.find((type) => type.id === currentQuestion.id_quest_type)
      ?.type_name || "";

  const commonProps = {
    currentQuestion,
    updateAnswer,
    deleteAnswer,
  };

  return (
    <>
      {selectedTypeName && (
        <>
          <Field>
            <Input
              placeholder="Question title"
              value={currentQuestion.title}
              {...register("questionTitle", { required: true })}
              onChange={debounce((e) => changeQuestionTitle(e), 500)}
              autoComplete="off"
            />
          </Field>
          {selectedTypeName === "Single choice" ||
          selectedTypeName === "Multiple choice" ? (
            <ChoiceQuestionInput
              {...commonProps}
              changeCorrectAnswer={changeCorrectAnswer}
              selectedTypeName={selectedTypeName}
            />
          ) : selectedTypeName === "Short answer" ? (
            <ShortAnswerOptionInput {...commonProps} />
          ) : (
            <div>Please select a question type to proceed.</div>
          )}
          <div>
            <Button
              visual="ghost"
              onClick={() => addNewAnswer(selectedTypeName)}
            >
              Add answer
            </Button>
            <Button
              disabled={!isValid}
              onClick={addNewQuestion}
            >
              Add question
            </Button>
          </div>
        </>
      )}
    </>
  );
}
