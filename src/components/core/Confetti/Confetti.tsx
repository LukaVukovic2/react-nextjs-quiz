"use client";
import { useWindowSize } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";

export const ConfettiComponent = ({isShown}: {isShown: boolean}) => {
  const { width, height } = useWindowSize();
  const [pieces, setPieces] = useState(0);

  useEffect(() => {
    setPieces(isShown ? 200 : 0);
  }, [isShown]);

  return (
    <Confetti 
      style={{ position: "fixed", top: 0, left: 0 }}
      width={width ?? 0}
      height={height ?? 0}
      numberOfPieces={pieces}
    />
  );
}
