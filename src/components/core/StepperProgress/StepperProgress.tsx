import {
  StepsItem,
  StepsList,
  StepsRoot,
} from "@/components/ui/steps";
import { useMediaQuery } from "usehooks-ts";

interface IStepperProgressProps {
  currentStep: number;
  setStep: (index: number) => void;
  steps: { title: string }[];
}

export default function StepperProgress({currentStep, setStep, steps}: IStepperProgressProps) {
  const mobileMode = useMediaQuery("(max-width: 650px)");
  return (
    <StepsRoot
      size="lg"
      step={currentStep - 1}
      count={steps.length}
      colorPalette="cyan"
      px={3}
      orientation={mobileMode ? "vertical" : "horizontal"}
    >
      <StepsList>
        {steps.map((step, index) => (
          <StepsItem
            key={step.title}
            index={index}
            title={step.title}
            onClick={() => setStep(index + 1)}
            fontSize={mobileMode ? "sm" : "md"}
            py={mobileMode ? 1: 0}
          />
        ))}
      </StepsList>
    </StepsRoot>
  );
}