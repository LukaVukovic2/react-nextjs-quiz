"use client";
import { useWindowSize } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";

export const ConfettiComponent = ({isShown}: {isShown: boolean}) => {
  const { width, height } = useWindowSize();
  const [pieces, setPieces] = useState(200);

  useEffect(() => {
    if (!isShown) {
      setPieces(0);
    } else {
      setPieces(200);
    }
  }, [isShown]);

  return (
    <Confetti 
      width={width ?? 0}
      height={height ?? 0}
      numberOfPieces={pieces}
    />
  );
}
