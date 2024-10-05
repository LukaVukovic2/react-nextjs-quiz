import { Question } from "@/app/typings/question";
import { useRadioGroup } from "@chakra-ui/react";

const useRadioGroups = (questions: Question[], handleSelectAnswer: (questionId: string, answerId: string) => void) => {
  const radioGroups = questions.map((question) => {
    const { getRootProps, getRadioProps } = useRadioGroup({
      name: question.id,
      onChange: (answerId: string) => {
        handleSelectAnswer(question.id, answerId);
      },
    });
    return { id: question.id, getRootProps, getRadioProps };
  });

  return radioGroups.reduce((acc: { [key: string]: any }, group) => {
    acc[group.id] = { getRootProps: group.getRootProps, getRadioProps: group.getRadioProps };
    return acc;
  }, {});
};

export default useRadioGroups;