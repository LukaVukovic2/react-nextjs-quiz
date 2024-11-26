import { useContext } from "react";
import { steps } from "../utils/steps";
import {
  StepsContent,
  StepsItem,
  StepsList,
  StepsRoot,
} from "@/components/ui/steps";
import { QuizFormContext } from "@/components/features/quizzes/QuizForm/utils/QuizFormContext";

export default function StepperProgress() {
  const { currentStep, setStepIfValid } = useContext(QuizFormContext);
  return (
    <StepsRoot
      size="lg"
      step={currentStep - 1}
      count={steps.length}
      colorPalette="cyan"
    >
      <StepsList>
        {steps.map((step, index) => (
          <StepsItem
            key={step.title}
            index={index}
            title={step.title}
            onClick={() => setStepIfValid(index + 1)}
          />
        ))}
      </StepsList>
      <StepsContent index={2}>This is your Quiz!</StepsContent>
    </StepsRoot>
  );
}
