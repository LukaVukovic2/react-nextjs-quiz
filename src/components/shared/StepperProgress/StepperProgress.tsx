import { steps } from "../utils/steps";
import { StepsContent, StepsItem, StepsList, StepsRoot } from "@/components/ui/steps";

interface IStepperProgress {
  currentStep: number;
  setStepIfValid: (index: number) => void;
}

export default function StepperProgress({
  currentStep,
  setStepIfValid,
}: IStepperProgress) {
  return (
    <StepsRoot
      size="lg"
      step={currentStep}
      count={steps.length}
    >
      <StepsList>
        {steps.map((step, index) => (
          <StepsItem key={step.title} index={index} title={step.title} onClick={() => setStepIfValid(index + 1)} />
        ))}
      </StepsList>
      <StepsContent index={0}>
        General Quiz Info
      </StepsContent>
      <StepsContent index={1}>
        Add Questions
      </StepsContent>
      <StepsContent index={2}>
        This is your Quiz!
      </StepsContent>
    </StepsRoot>
  );
}
