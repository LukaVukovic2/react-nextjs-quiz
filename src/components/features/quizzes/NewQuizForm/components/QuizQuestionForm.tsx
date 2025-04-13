import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { QuestionType } from "@/typings/question";
import SelectOption from "@/components/core/SelectOption/SelectOption";
import { chakra, createListCollection, Flex } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import QuestionListAccordion from "@/components/shared/lists/QuestionListAccordion/QuestionListAccordion";
import QuestionTypeForm from "./QuestionTypeForm";
import { v4 as uuidv4 } from "uuid";
import "../NewQuizForm.css";
import { Answer } from "@/typings/answer";
import { Qa } from "@/typings/qa";

interface IQuizQuestionFormProps {
  qaList: Qa[];
  setQaList: React.Dispatch<React.SetStateAction<Qa[]>>;
  questTypes: QuestionType[];
  quizId: string;
}

export default function QuizQuestionForm({
  qaList,
  setQaList,
  questTypes,
  quizId,
}: IQuizQuestionFormProps) {
  const [currentQa, setCurrentQa] = useState<Qa>({
    question: {
      id: uuidv4(),
      title: "",
      quiz_id: quizId,
      id_quest_type: "",
    },
    answers: [],
  });

  const { control } = useFormContext();

  const types = createListCollection({
    items: questTypes.map((type: QuestionType) => ({
      value: type.id,
      label: type.type_name,
    })),
  });

  const initializeCurrentAnswers = (typeId: string, question_id: string) => {
    const typeName = questTypes.find((type) => type.id === typeId)?.type_name;
    const blankAnswers: Answer[] = [
      {
        id: uuidv4(),
        answer: "",
        correct_answer: true,
        question_id,
      },
    ];
    if (typeName === "Single choice" || typeName === "Multiple choice") {
      blankAnswers.push({
        id: uuidv4(),
        answer: "",
        correct_answer: false,
        question_id,
      });
    }

    setCurrentQa((prev) => {
      return {
        ...prev,
        answers: blankAnswers,
      };
    });
  };

  return (
    <Flex
      flexDirection="column"
      flex={1}
    >
      <Flex
        flexDirection="column"
        gap={2}
        flex={1}
      >
        <Field
          label="Choose question type"
          helperText="You can add different types of questions to your quiz"
        >
          <Controller
            control={control}
            name="questionType"
            render={({ field }) => (
              <SelectOption
                list={types}
                defaultMessage="Select question type"
                field={{
                  ...field,
                  value: field.value || [],
                  onChange: (e) => {
                    field.onChange(e);
                    setCurrentQa((prev) => ({
                      ...prev,
                      question: {
                        ...prev.question,
                        id_quest_type: e[0],
                      },
                    }));
                    initializeCurrentAnswers(e[0], currentQa.question.id);
                  },
                }}
              />
            )}
          />
        </Field>
        <Flex
          flexDirection="column"
          gap={4}
        >
          {currentQa.question.id_quest_type && (
            <QuestionTypeForm
              setQaList={setQaList}
              currentQa={currentQa}
              setCurrentQa={setCurrentQa}
              questTypes={questTypes}
              initializeCurrentAnswers={initializeCurrentAnswers}
            />
          )}
        </Flex>
      </Flex>
      <chakra.div flex={1}>
        <QuestionListAccordion qaList={qaList} />
      </chakra.div>
    </Flex>
  );
}
