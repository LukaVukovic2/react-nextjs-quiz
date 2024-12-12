import { Heading } from "@/styles/theme/components/heading";
import { Control, Controller, FieldValues } from "react-hook-form";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperCore } from "swiper";
import CheckboxGroup from "./components/CheckboxGroup";
import RadioGroup from "./components/RadioGroup";
import ShortAnswerInput from "./components/ShortAnswerInput";
import { Question } from "@/app/typings/question";
import { QuestionType } from "@/app/typings/question_type";
import { Answer } from "@/app/typings/answer";
import { Keyboard, Pagination } from "swiper/modules";

interface IQuizGameplaySwiperProps {
  questions: Question[];
  questTypes: QuestionType[];
  selectedAnswers: Map<string, string[] | null>;
  groupedAnswers: { [key: string]: Answer[] };
  isFinished: boolean;
  handleSelectAnswer: (questionId: string, answerId: string[], questionType: string) => void;
  resetKey: number;
  setIsTransitioning: React.Dispatch<React.SetStateAction<boolean>>;
  pagination: {
    clickable: boolean;
    renderBullet: (index: number, className: string) => string;
  };
  swiperRef: React.MutableRefObject<SwiperCore | null>;
  control: Control<FieldValues>;
}

export default function QuizGameplaySwiper({
  questions,
  questTypes,
  selectedAnswers,
  groupedAnswers,
  isFinished,
  handleSelectAnswer,
  resetKey,
  setIsTransitioning,
  pagination,
  swiperRef,
  control
}: IQuizGameplaySwiperProps
) {
  return (
    <Swiper
      pagination={pagination}
      modules={[Pagination, Keyboard]}
      keyboard={{
        enabled: true,
      }}
      className="mySwiper swiper"
      onSwiper={(swiper) => (swiperRef.current = swiper)}
      onTransitionStart={() => setIsTransitioning(true)}
      onTransitionEnd={() => setIsTransitioning(false)}
    >
      {questions.map((question, index) => {
        const typeName = questTypes.find(
          (type) => type.id === question.id_quest_type
        )?.type_name;
        const selectedAnsId = selectedAnswers.get(question.id);
        const answerOptions = groupedAnswers[question.id];

        return (
          <SwiperSlide
            key={question.id}
            onFocus={() => {
              if (!swiperRef.current) return;
              swiperRef.current.el.scrollLeft = 0;
              swiperRef.current?.slideTo(index);
            }}
          >
            <Heading
              as="h2"
              size="h6"
              visual="reversed"
              textAlign="center"
              p={2}
            >
              {index + 1 + ". " + question.title}
            </Heading>
            <Controller
              control={control}
              name={question.id}
              render={({ field }) => {
                const commonProps = {
                  field,
                  question,
                  isFinished,
                  handleSelectAnswer,
                  resetKey,
                };
                switch (typeName) {
                  case "Single choice": {
                    return (
                      <RadioGroup
                        {...commonProps}
                        selectedAnsId={(selectedAnsId ?? "") as string}
                        answerOptions={answerOptions}
                      />
                    );
                  }
                  case "Multiple choice": {
                    return (
                      <CheckboxGroup
                        {...commonProps}
                        selectedAnsIds={(selectedAnsId ?? []) as string[]}
                        answerOptions={answerOptions}
                      />
                    );
                  }
                  default: {
                    return (
                      <ShortAnswerInput
                        {...commonProps}
                        acceptableAnswers={answerOptions}
                      />
                    );
                  }
                }
              }}
            />
            <br />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
