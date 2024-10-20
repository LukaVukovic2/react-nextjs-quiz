"use client";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  chakra,
  FormLabel,
  Heading,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { SliderInput } from "@/components/core/Slider/Slider";
import { addReview } from "@/components/shared/utils/actions/review/addReview";
import { useParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

export default function QuizReviewForm() {
  const {
    handleSubmit,
    register,
    control,
    formState: { isValid, isSubmitting },
    reset,
    getValues
  } = useForm();
  const toast = useToast();
  const id = useParams().id as string;

  const addNewReview = async () => {
    const formData = new FormData();
    formData.append("comment", getValues("comment"));
    formData.append("rating", getValues("rating"));

    const success = await addReview(formData, id);
    toast({
      title: success ? "Review added" : "Failed to add review",
      status: success ? "success" : "error",
      duration: 3000,
    });
    reset();
  };

  return (
    <Card mb={5}>
      <CardHeader>
        <Heading size="md" py={2}>Add a review</Heading>
      </CardHeader>
      <CardBody>
        <chakra.form onSubmit={handleSubmit(addNewReview)}>
          <Textarea
            {...register("comment")}
            placeholder="Enter your comment"
          />
          <FormLabel>Rating</FormLabel>
          <Controller
            control={control}
            name="rating"
            rules={{
              required: true,
              min: { value: 1, message: "Rating must be between 1 and 5" },
              max: { value: 5, message: "Rating must be between 1 and 5" },
            }}
            render={({ field }) => <SliderInput {...field} />}
          />
          <Button
            isLoading={isSubmitting}
            isDisabled={!isValid || isSubmitting}
            type="submit"
          >
            Submit
          </Button>
        </chakra.form>
      </CardBody>
    </Card>
  );
}
