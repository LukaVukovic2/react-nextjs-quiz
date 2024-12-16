import { useEffect, useState } from "react";
import { useTimer } from "react-timer-hook";
import "./QuizTimer.css";
import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface IQuizTimerProps {
  quizTime: Date;
  hasStarted: boolean;
  isFinished: boolean;
  handleFinishQuiz: (time: number) => void;
  isPaused: boolean;
}

export default function QuizTimer({
  quizTime,
  hasStarted,
  isFinished,
  handleFinishQuiz,
  isPaused,
}: IQuizTimerProps) {
  const [isTimeUp, setIsTimeUp] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  const {
    totalSeconds,
    seconds,
    minutes,
    start,
    resume,
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

  useEffect(() => {
    if (hasStarted && isPaused) {
      pause();
      router.push(pathname + "?timeLeft=" + totalSeconds);
    } else if (hasStarted && !isPaused) {
      resume();
    }
  }, [isPaused]);

  return (
    <div className={clsx({
      "timer": true,
      "fa-bounce": totalSeconds < 10 && !isTimeUp,
    })}>
      {String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0")}
    </div>
  );
}
