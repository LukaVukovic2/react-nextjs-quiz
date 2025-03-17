import { Heading } from "@/styles/theme/components/heading";
import { Control, Controller, FieldValues } from "react-hook-form";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperCore } from "swiper";
import CheckboxGroup from "./components/CheckboxGroup";
import RadioGroup from "./components/RadioGroup";
import ShortAnswerInput from "./components/ShortAnswerInput";
import { Question, QuestionType } from "@/app/typings/question";
import { Answer } from "@/app/typings/answer";
import { Keyboard, Pagination } from "swiper/modules";
import { renderToStaticMarkup } from "react-dom/server";
import RenderBullet from "./components/RenderBullet";
import { PlayStatus } from "@/app/typings/playStatus";

interface IQuizGameplaySwiperProps {
  questions: Question[];
  questTypes: QuestionType[];
  selectedAnswers: Map<string, string[] | null>;
  groupedAnswers: { [key: string]: Answer[] };
  playStatus: PlayStatus;
  handleSelectAnswer: (
    questionId: string,
    answerId: string[],
    questionType: string
  ) => void;
  resetKey: number;
  setIsTransitioning: React.Dispatch<React.SetStateAction<boolean>>;
  swiperRef: React.MutableRefObject<SwiperCore | null>;
  correctAnswers: Answer[];
  control: Control<FieldValues>;
}

export default function QuizGameplaySwiper({
  questions,
  questTypes,
  selectedAnswers,
  groupedAnswers,
  playStatus,
  handleSelectAnswer,
  resetKey,
  setIsTransitioning,
  swiperRef,
  correctAnswers,
  control,
}: IQuizGameplaySwiperProps) {
  const isFinished = playStatus === "finished";
  const pagination = {
    clickable: true,
    renderBullet: function (index: number, className: string) {
      return renderToStaticMarkup(
        <RenderBullet
          index={index}
          className={className}
          selectedAnswers={selectedAnswers}
          questions={questions}
          correctAnswers={correctAnswers}
          questTypes={questTypes}
          isFinished={isFinished}
        />
      )
    }
  };
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
                return (
                  (typeName === "Single choice" && (
                    <RadioGroup
                      {...commonProps}
                      answerOptions={answerOptions}
                      selectedAnsId={(selectedAnsId ?? "") as string}
                    />
                  )) ||
                  (typeName === "Multiple choice" && (
                    <CheckboxGroup
                      {...commonProps}
                      answerOptions={answerOptions}
                      selectedAnsIds={(selectedAnsId ?? []) as string[]}
                    />
                  )) || (
                    <ShortAnswerInput
                      {...commonProps}
                      acceptableAnswers={answerOptions}
                    />
                  )
                );
              }}
            />
            <br />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}