"use client";
import { Card, chakra, Textarea } from "@chakra-ui/react";
import { Heading } from "@/styles/theme/components/heading";
import { Button } from "@/styles/theme/components/button";
import { Toaster, toaster } from "@/components/ui/toaster";
import { SliderInput } from "@/components/core/Slider/Slider";
import { addReview } from "@/components/shared/utils/actions/review/addReview";
import { useParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { Alert } from "@/components/ui/alert";
import { getCookie } from "cookies-next";

export default function QuizReviewForm() {
  const {
    handleSubmit,
    register,
    control,
    formState: { isValid, isSubmitting },
    reset,
    getValues,
  } = useForm({ defaultValues: { rating: "3", comment: "" } });
  const id = useParams().id as string;
  const isAnonymous = getCookie("isAnonymous") === "true";

  const addNewReview = async () => {
    const formData = new FormData();
    formData.append("comment", getValues("comment"));
    formData.append("rating", getValues("rating"));

    const success = await addReview(formData, id);
    toaster.create({
      title: success ? "Review added" : "Failed to add review",
      type: success ? "success" : "error",
      duration: 3000,
    });
    reset();
  };

  return isAnonymous ? (
    <Alert
      status="warning"
      title="You can't add a review as a guest"
      mb={5}
    />
  ) : (
    <Card.Root mb={5}>
      <Card.Header>
        <Heading
          as="h2"
          size="h4"
        >
          Add a review
        </Heading>
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
            visual="outline"
            disabled={!isValid || isSubmitting || !!isAnonymous}
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
