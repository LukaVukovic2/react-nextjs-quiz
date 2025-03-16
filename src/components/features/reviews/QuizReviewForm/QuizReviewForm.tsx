"use client";
import { Card, chakra, Textarea } from "@chakra-ui/react";
import { Heading } from "@/styles/theme/components/heading";
import { toaster } from "@/components/ui/toaster";
import SliderInput from "@/components/core/Slider/Slider";
import { addReview } from "@/components/shared/utils/actions/review/addReview";
import { useParams } from "next/navigation";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { Alert } from "@/components/ui/alert";
import { useUser } from "@/components/shared/utils/hooks/useUser";
import { SubmitButton } from "@/components/core/SubmitButton/SubmitButton";
import { FaStar } from "react-icons/fa";

export default function QuizReviewForm() {
  const {
    handleSubmit,
    register,
    control,
    formState: { isValid, isSubmitting },
    reset,
  } = useForm({ defaultValues: { rating: "3", comment: "" } });
  const quizId = useParams().id as string;
  const { user } = useUser();

  const addNewReview = async (formData: FieldValues) => {
    const success = await addReview(formData, quizId, user?.id || "");
    toaster.create({
      title: success ? "Review added" : "Failed to add review",
      type: success ? "success" : "error",
      duration: 3000,
    });
    reset();
  };

  return user?.is_anonymous ? (
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
            render={({ field }) => <SliderInput field={{...field}} thumbIcon={<FaStar size={12}/>} />}
          />
          <SubmitButton
            disabled={!isValid || isSubmitting || !!user?.is_anonymous}
            loading={isSubmitting}
            loadingText="Posting..."
          >
            Post
          </SubmitButton>
        </chakra.form>
      </Card.Body>
    </Card.Root>
  );
}