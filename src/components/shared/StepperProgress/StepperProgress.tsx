import { Stepper, Step, StepIndicator, StepStatus, StepIcon, StepNumber, Box, StepTitle, StepDescription, StepSeparator } from "@chakra-ui/react"
import { steps } from "../utils/steps"

interface IStepperProgress {
  activeStep: number;
  setStepIfValid: (index: number) => void;
}

export default function StepperProgress({activeStep, setStepIfValid}: IStepperProgress) {
  return (
    <Stepper
        size="lg"
        index={activeStep}
      >
        {steps.map((step, index) => (
          <Step
            key={index}
            onClick={() => setStepIfValid(index)}
          >
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>

            <Box flexShrink="0">
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </Box>

            <StepSeparator />
          </Step>
        ))}
      </Stepper>
  )
}