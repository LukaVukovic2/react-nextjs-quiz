import { Qa } from "@/app/typings/qa";
import { QuestionType } from "@/app/typings/question_type";
import ChoiceQuestionInput from "@/components/shared/ChoiceQuestionInput/ChoiceQuestionInput";
import ShortAnswerOptionInput from "@/components/shared/ShortAnswerOptionInput/ShortAnswerOptionInput";
import { Field } from "@/components/ui/field";
import { Button } from "@/styles/theme/components/button";
import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

interface IQuestionTypeFormProps {
  setQaList: React.Dispatch<React.SetStateAction<Qa[]>>;
  currentQa: Qa;
  setCurrentQa: React.Dispatch<React.SetStateAction<Qa>>;
  questTypes: QuestionType[];
  initializeCurrentAnswers: (typeId: string, questionId: string) => void;
}

export default function QuestionTypeForm({
  setQaList,
  currentQa,
  setCurrentQa,
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
      correct_answer: type_name === "Short answer",
      question_id: currentQa.question.id,
    };
    setCurrentQa((prev) => {
      return {
        ...prev,
        answers: [...(prev.answers || []), currentAnswer],
      };
    });
    trigger(`correctAnswer_${currentQa.question.id}`);
    trigger(`answer${currentAnswer.id}`);
  };

  const addNewQuestion = () => {
    const id = uuidv4();
    setQaList((prev) => [...prev, currentQa]);
    setCurrentQa((prev) => ({
      question: {
        ...prev.question,
        id,
        title: "", 
      },
      answers: [],
    }));
    trigger();
    initializeCurrentAnswers(currentQa.question.id_quest_type, id);
  };

  const changeCorrectAnswer = (answerId: string, selectedTypeName: string) => {
    setCurrentQa((prev) => ({
      ...prev,
      answers: prev.answers.map((ans) => ({
        ...ans,
        correct_answer:
          selectedTypeName === "Single choice"
            ? ans.id === answerId
            : ans.id === answerId
            ? !ans.correct_answer
            : ans.correct_answer,
      })),
    }));
    trigger(`correctAnswer_${currentQa.question.id}`);
  };

  const changeQuestionTitle = (title: string) => {
    setCurrentQa((prev) => ({
      ...prev,
      question: {
        ...prev.question,
        title
      }
    }));
    trigger("questionTitle");
  };

  const updateAnswer = (
    value: string,
    answerId: string
  ) => {
    setCurrentQa((prev) => {
      return {
        ...prev,
        answers: prev.answers.map((ans) => {
          if (ans.id === answerId) {
            return {
              ...ans,
              answer: value,
            };
          }
          return ans;
        }),
      };
    });
  };

  const deleteAnswer = (answerId: string) => {
    setCurrentQa((prev) => {
      return {
        ...prev,
        answers: prev.answers.filter((ans) => ans.id !== answerId),
      };
    });
  };

  const selectedTypeName =
    questTypes.find((type) => type.id === currentQa.question.id_quest_type)
      ?.type_name || "";

  const commonProps = {
    currentQa,
    updateAnswer,
    deleteAnswer,
  };

  return (
    <>
      {selectedTypeName && (
        <>
          <FormControl>
            <Field>
              <Input
                placeholder="Question title"
                value={currentQa.question.title}
                {...register("questionTitle", { required: true })}
                onChange={(e) => changeQuestionTitle(e.target.value)}
                autoComplete="off"
              />
            </Field>
          </FormControl>
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
              disabled={!isValid}
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