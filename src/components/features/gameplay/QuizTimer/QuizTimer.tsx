import { useEffect, useState } from "react";
import { useTimer } from "react-timer-hook";
import "./QuizTimer.css";
import clsx from "clsx";

interface IQuizTimerProps {
  quizTime: Date;
  hasStarted: boolean;
  isFinished: boolean;
  handleFinishQuiz: (time: number) => void;
}

export default function QuizTimer({
  quizTime,
  hasStarted,
  isFinished,
  handleFinishQuiz,
}: IQuizTimerProps) {
  const [isTimeUp, setIsTimeUp] = useState(false);
  
  const {
    totalSeconds,
    seconds,
    minutes,
    start,
    pause,
  } = useTimer({
    expiryTimestamp: quizTime,
    autoStart: false,
    onExpire: () => {
      if (!isTimeUp) {
        handleFinishQuiz(totalSeconds);
        setIsTimeUp(true);
      }
    },
  });

  useEffect(() => {
    if (hasStarted && !isFinished) {
      start();
      setIsTimeUp(false); 
    } else {
      pause();
    }
  }, [hasStarted, isFinished]);

  useEffect(() => {
    if (isFinished && !isTimeUp) {
      handleFinishQuiz(totalSeconds);
      setIsTimeUp(true);
    }
  }, [isFinished, isTimeUp]);

  return (
    <div className={clsx({
      "timer": true,
      "fa-bounce": totalSeconds < 10 && !isTimeUp,
    })}>
      {String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0")}
    </div>
  );
}
