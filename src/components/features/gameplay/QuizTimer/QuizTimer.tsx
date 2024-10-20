import { useEffect } from "react";
import { useTimer } from "react-timer-hook";

interface IQuizTimerProps {
  quizTime: Date;
  hasStarted: boolean;
  isFinished: boolean;
  handleFinishQuiz: () => void;
}

export default function QuizTimer({
  quizTime,
  hasStarted,
  isFinished,
  handleFinishQuiz,
}: IQuizTimerProps) {
  const {
    seconds,
    minutes,
    hours,
    start,
    pause
  } = useTimer({
    expiryTimestamp: quizTime,
    autoStart: false,
    onExpire: () => handleFinishQuiz(),
  });

  useEffect(() => {
    if (hasStarted && !isFinished) {
      start();
    } else {
      pause();
    }
  }, [hasStarted, isFinished, start, pause]);

  return (
    <div>
      {hours ? String(hours).padStart(2, "0") + ":" : ""}
      {String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0")}
    </div>
  );
}
