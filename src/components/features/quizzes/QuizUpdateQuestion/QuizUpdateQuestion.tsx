import { Answer } from "@/app/typings/answer";
import { Question } from "@/app/typings/question";
import SelectOption from "@/components/core/SelectOption/SelectOption";
import { MyQuizzesContext } from "@/components/shared/utils/contexts/MyQuizzesContext";
import { QuizUpdateContext } from "@/components/shared/utils/contexts/QuizUpdateContext";
import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import { Button } from "@/styles/theme/components/button";
import { FormControl } from "@chakra-ui/form-control";
import { DeleteIcon } from "@chakra-ui/icons";
import { Input, Text } from "@chakra-ui/react";
import debounce from "debounce";
import { useContext } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

interface IQuizUpdateQuestionProps {
  index: number;
  question: Question;
  questType: string;
}

export default function QuizUpdateQuestion({
  index,
  question,
  questType,
}: IQuizUpdateQuestionProps) {
  const { control, register, trigger } = useFormContext();

  const { questTypes } = useContext(MyQuizzesContext);

  const {
    questionsArr,
    setQuestionsArr,
    setDirtyQuestions,
    setDeletedQuestions,
    setAnswersArr,
    setDirtyAnswers,
  } = useContext(QuizUpdateContext);

  const changeQuestionTitle = (
    title: string,
    q: Question
  ) => {
    setDirtyQuestions((prev) => {
      const questionIndex = prev.findIndex((question) => question.id === q.id);
      const newQuestion: Question = {
        id: q.id,
        title,
        quiz_id: q.quiz_id,
        id_quest_type: q.id_quest_type,
      };

      if (questionIndex === -1) {
        return [...prev, newQuestion];
      } else {
        const updatedQuestions = [...prev];
        updatedQuestions[questionIndex] = newQuestion;
        return updatedQuestions;
      }
    });
  };

  const selectQuestionType = (value: string, question: Question) => {
    const questType = questTypes.items.find((qt) => qt.value === value)?.label;

    setDirtyQuestions((prev) => {
      const questionIndex = prev.findIndex((q) => q.id === question.id);
      const newQuestion: Question = {
        ...question,
        id_quest_type: value,
      };

      if (questionIndex === -1) {
        return [...prev, newQuestion];
      } else {
        const updatedQuestions = [...prev];
        updatedQuestions[questionIndex] = newQuestion;
        return updatedQuestions;
      }
    });

    setQuestionsArr((prev) => {
      const questionIndex = prev.findIndex((q) => q.id === question.id);
      const newQuestion: Question = {
        ...question,
        id_quest_type: value,
      };
      const updatedQuestions = [...prev];
      updatedQuestions[questionIndex] = newQuestion;
      return updatedQuestions;
    });

    const answerId = uuidv4();
    const defaultCorrectAns: Answer = {
      id: uuidv4(),
      answer: "",
      question_id: question.id,
      correct_answer: true,
    };
    if (questType === "Short answer") {
      setAnswersArr((prev) => [...prev, defaultCorrectAns]);
      setDirtyAnswers((prev) => [...prev, defaultCorrectAns]);
    } else {
      const defaultFalseAns: Answer = {
        ...defaultCorrectAns,
        id: answerId,
        correct_answer: !defaultCorrectAns.correct_answer,
      };
      setAnswersArr((prev) => [...prev, defaultCorrectAns, defaultFalseAns]);
      setDirtyAnswers((prev) => [...prev, defaultCorrectAns, defaultFalseAns]);
    }
  };

  const deleteQuestion = (id: string) => {
    setQuestionsArr((prev) => prev.filter((question) => question.id !== id));
    setDirtyQuestions((prev) => prev.filter((question) => question.id !== id));
    setDeletedQuestions((prev) => [...prev, id]);
    setAnswersArr((prev) => prev.filter((answer) => answer.question_id !== id));
    setDirtyAnswers((prev) => prev.filter((answer) => answer.question_id !== id));
    trigger();
  };

  return (
    <>
      {questType === undefined ? (
        <FormControl>
          <Field label="Question type">
            <Controller
              name={`quest_type${question.id}`}
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <SelectOption
                  field={{
                    ...field,
                    onChange: (e) => {
                      field.onChange(e[0]);
                      selectQuestionType(e[0], question);
                    },
                  }}
                  list={questTypes}
                  defaultMessage="Select question type"
                />
              )}
            />
          </Field>
        </FormControl>
      ) : (
        <Text>{questType}</Text>
      )}
      <FormControl
        display="flex"
        alignItems="baseline"
        mb={3}
      >
        <InputGroup
          flex={1}
          startElement={
            <Text
              fontSize="sm"
              fontWeight="bold"
              pr={2}
            >
              {index + 1 + "."}
            </Text>
          }
          endElement={
            <Button
              visual="ghost"
              p={0}
              onClick={() => deleteQuestion(question.id)}
              disabled={questionsArr.length === 1}
            >
              <DeleteIcon color="red" />
            </Button>
          }
        >
          <Input
            placeholder="Question"
            defaultValue={question.title}
            {...register(`q_title${question.id}`, { 
              required: true,
              onChange: debounce((e) => changeQuestionTitle(e.target.value, question), 500)
            })}
          />
        </InputGroup>
      </FormControl>
    </>
  );
}