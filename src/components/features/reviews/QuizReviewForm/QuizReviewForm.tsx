"use client";
import {
  Card,
  chakra,
  Heading,
  Textarea
} from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { Toaster, toaster } from "@/components/ui/toaster";
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
  } = useForm({ defaultValues: { rating: "3", comment: "" } });
  const id = useParams().id as string;

  const addNewReview = async () => {
    const formData = new FormData();
    formData.append("comment", getValues("comment"));
    formData.append("rating", getValues("rating"));

    const success = await addReview(formData, id);
    toaster.create({
      title: success ? "Review added" : "Failed to add review",
      type: success ? "success" : "error",
      duration: 3000
    });
    reset();
  };

  return (
    <Card.Root mb={5}>
      <Card.Header>
        <Heading size="md" py={2}>Add a review</Heading>
      </Card.Header>
      <Card.Body>
        <chakra.form onSubmit={handleSubmit(addNewReview)}>
          <Textarea
            {...register("comment")}
            placeholder="Enter your comment"
          />
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
            disabled={!isValid || isSubmitting}
            type="submit"
          >
            Submit
          </Button>
          <Toaster />
        </chakra.form>
      </Card.Body>
    </Card.Root>
  );
}
