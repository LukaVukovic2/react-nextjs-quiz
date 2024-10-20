import QuizReviewForm from "../QuizReviewForm/QuizReviewForm";
import QuizReviewList from "../QuizReviewList/QuizReviewList";

export default function QuizReviewSection({id, page}: {id: string, page: string}) {
  return (
    <div style={{maxWidth: "600px", margin: "0 auto"}}>
      <QuizReviewForm />
      <QuizReviewList id={id} page={page} />
    </div>
  )
}