import { steps } from "../utils/steps";
import {
  StepsItem,
  StepsList,
  StepsRoot,
} from "@/components/ui/steps";

interface IStepperProgressProps {
  currentStep: number;
  setStep: (index: number) => void;
  children?: React.ReactNode;
}

export default function StepperProgress({currentStep, setStep, children}: IStepperProgressProps) {
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
            onClick={() => setStep(index + 1)}
          />
        ))}
      </StepsList>
      {children}
    </StepsRoot>
  );
}
