import { Answer } from "@/app/typings/answer";
import { Question, QuestionType } from "@/app/typings/question";

export const calculateScore = (
  selectedAnswers: Map<string, string[] | null>,
  correctAnswers: Answer[],
  questions: Question[],
  questTypes: QuestionType[]
) => {
  let totalScore = 0;

  Array.from(selectedAnswers).forEach(([questionId, selected]) => {
    const correctAnswersForQuestion = correctAnswers.filter(
      (answer) => answer.question_id === questionId
    );

    const typeId = questions.find((q) => q.id === questionId)?.id_quest_type;
    const questionType = questTypes.find(
      (type) => type.id === typeId
    )?.type_name;
    const selectedArr = Array.isArray(selected) ? selected : [];

    if (
      questionType === "Single choice" ||
      questionType === "Multiple choice"
    ) {
      const correctIds = correctAnswersForQuestion.map((answer) => answer.id);
      const correctSelections = correctIds.filter((id) =>
        selected?.includes(id)
      ).length;
      const incorrectSelections =
        selectedArr?.filter((id) => !correctIds.includes(id)).length || 0;
      const isNegativeQuestionScore = incorrectSelections > correctSelections;
      const questionScore =
        (isNegativeQuestionScore
          ? 0
          : correctSelections - incorrectSelections) / (correctIds.length || 1);
      totalScore += questionScore;
    } else if (questionType === "Short answer") {
      const acceptableAnswers = correctAnswersForQuestion.map((answer) =>
        answer.answer.toLowerCase()
      );
      const userInput = String(selected).toLowerCase().trim();

      const isCorrect = acceptableAnswers.some(
        (answer) => answer === userInput
      );

      totalScore += isCorrect ? 1 : 0;
    } else {
      console.warn(`Unknown question type for question ID: ${questionId}`);
    }
  });

  return totalScore;
};