import { Answer } from "@/app/typings/answer";
import { Question } from "@/app/typings/question";
import SelectOption from "@/components/core/SelectOption/SelectOption";
import { useQuizUpdateContext } from "@/components/shared/utils/contexts/QuizUpdateContext";
import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import { Button } from "@/styles/theme/components/button";
import { FormControl } from "@chakra-ui/form-control";
import { DeleteIcon } from "@chakra-ui/icons";
import { Input, ListCollection, Text } from "@chakra-ui/react";
import { FocusEvent } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

interface IQuizUpdateQuestionProps {
  index: number;
  question: Question;
  questType: string;
  questTypes: ListCollection;
}

export default function QuizUpdateQuestion({
  index,
  question,
  questType,
  questTypes,
}: IQuizUpdateQuestionProps) {
  const { control, register, trigger } = useFormContext();
  
  const { questionsArr, dirtyQuestions, deletedQuestions, answersArr, dirtyAnswers } = useQuizUpdateContext(
    ["questionsArr", "dirtyQuestions", "deletedQuestions", "answersArr", "dirtyAnswers"]);

  const handleUpdateQuestion = async (
    e: FocusEvent<HTMLInputElement, Element>,
    q: Question
  ) => {
    const { value } = e.target;

    const validateInput = await trigger("q_title" + q.id);
    if (!validateInput) return;

    const dirtyQuest = dirtyQuestions.get as Question[];
    const questionIndex = dirtyQuest.findIndex((question) => question.id === q.id);
    const newQuestion: Question = {
      id: q.id,
      title: value,
      quiz_id: q.quiz_id,
      id_quest_type: q.id_quest_type,
    };

    const updatedQuestions = questionIndex === -1 ? [...dirtyQuest, newQuestion] : dirtyQuest.map((q, index) => (index === questionIndex ? newQuestion : q));
    dirtyQuestions.set(updatedQuestions);
  };

  const selectQuestionType = (value: string, question: Question) => {
    if (!value) return;
    const questType = questTypes.items.find(qt => qt.value === value)?.label;
  
    const prevDirtyQuestions = dirtyQuestions.get as Question[];
    const dirtyQuestionIndex = prevDirtyQuestions.findIndex((q) => q.id === question.id);
    const newDirtyQuestion: Question = { ...question, id_quest_type: value };
  
    const updatedDirtyQuestions =
      dirtyQuestionIndex === -1
        ? [...prevDirtyQuestions, newDirtyQuestion]
        : prevDirtyQuestions.map((q, index) =>
            index === dirtyQuestionIndex ? newDirtyQuestion : q
          );
  
    dirtyQuestions.set(updatedDirtyQuestions);
  
    const prevQuestions = questionsArr.get as Question[];
    const questionIndex = prevQuestions.findIndex((q) => q.id === question.id);
    const newQuestion: Question = { ...question, id_quest_type: value };
  
    const updatedQuestions =
      questionIndex === -1
        ? [...prevQuestions, newQuestion]
        : prevQuestions.map((q, index) => (index === questionIndex ? newQuestion : q));
  
    questionsArr.set(updatedQuestions);

    const answerId = uuidv4();
    const defaultCorrectAns: Answer = {
      id: uuidv4(),
      answer: "",
      question_id: question.id,
      correct_answer: true,
    };
    if(questType === "Short answer"){
      answersArr.set([
        ...(answersArr.get as Answer[]),
        defaultCorrectAns
      ]);
      dirtyAnswers.set([...((dirtyAnswers.get as Answer[]) || []), defaultCorrectAns]);
    }
    else {
      const defaultFalseAns: Answer = {
        ...defaultCorrectAns,
        id: answerId,
        correct_answer: !defaultCorrectAns.correct_answer,
      };
      answersArr.set([
        ...(answersArr.get as Answer[]),
        defaultCorrectAns,
        defaultFalseAns,
      ]);
      dirtyAnswers.set([...((dirtyAnswers.get as Answer[]) || []), defaultCorrectAns, defaultFalseAns]);
    }
  };
  

  const handleDeleteQuestion = async (id: string) => {
    questionsArr.set([...(questionsArr.get as Question[]).filter((question) => question.id !== id)]);
    dirtyQuestions.set([...(dirtyQuestions.get as Question[]).filter((question) => question.id !== id)]);
    deletedQuestions.set([...(deletedQuestions.get as string[]), id]);
    answersArr.set([...(answersArr.get as Answer[]).filter((answer) => answer.question_id !== id)]);
    dirtyAnswers.set([...(dirtyAnswers.get as Answer[]).filter((answer) => answer.question_id !== id)]);
    trigger();
  };

  return (
    <>
      {questType === undefined ? (
        <FormControl>
          <Field label="Question type">
            <Controller
              name="id_quest_type"
              control={control}
              defaultValue={question.id_quest_type}
              rules={{ required: true }}
              render={({ field }) => (
                <SelectOption
                  field={{
                    ...field,
                    value: question.id_quest_type || "",
                    onChange: (e) => selectQuestionType(e[0], question),
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
              onClick={() => handleDeleteQuestion(question.id)}
              disabled={(questionsArr.get as Question[]).length === 1}
            >
              <DeleteIcon color="red" />
            </Button>
          }
        >
          <Input
            placeholder="Question"
            defaultValue={question.title}
            {...register(`q_title${question.id}`, { required: true })}
            onBlur={(e) => handleUpdateQuestion(e, question)}
          />
        </InputGroup>
      </FormControl>
    </>
  );
}