import { useEffect, useRef } from "react";
import { useTimer } from "react-timer-hook";
import "./QuizTimer.css";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { formatToSeconds } from "@/utils/functions/formatTime";
import { PlayStatus } from "@/typings/playStatus";

interface IQuizTimerProps {
  quizTime: number;
  handleFinishQuiz: (time: number) => void;
  playStatus: PlayStatus;
}

export default function QuizTimer({
  quizTime,
  handleFinishQuiz,
  playStatus,
}: IQuizTimerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const previousPlayStatus = useRef(playStatus);

  const { totalSeconds, seconds, minutes, start, resume, pause, restart } =
    useTimer({
      expiryTimestamp: formatToSeconds(+quizTime),
      autoStart: false,
      onExpire: () => {
        if (playStatus === "playing") handleFinishQuiz(totalSeconds);
      },
    });

  useEffect(() => {
    switch (playStatus) {
      case "playing":
        if (previousPlayStatus.current === "uninitiated") {
          start();
        } else if (previousPlayStatus.current === "paused") {
          resume();
        } else {
          restart(formatToSeconds(+quizTime));
        }
        break;
      case "finished":
        handleFinishQuiz(totalSeconds);
        pause();
        break;
      case "paused":
        pause();
        router.push(`${pathname}?timeLeft=${totalSeconds}`);
        break;
      default:
        break;
    }
    previousPlayStatus.current = playStatus;
  }, [playStatus]);

  return (
    <div
      className={clsx({
        timer: true,
        "fa-bounce": totalSeconds < 10 && playStatus === "playing",
      })}
    >
      {String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0")}
    </div>
  );
}
