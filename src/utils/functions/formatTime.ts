export const formatToSeconds = (quizTime: number) => {
  const time = new Date();
  time.setSeconds(
    time.getSeconds() +
    quizTime
  );
  return time;
};

export const formatToMMSS = (totalSeconds: number) => {
  let minutes = 0;
  while(totalSeconds >= 60) {
    totalSeconds -= 60;
    minutes++;
  }
  return `${String(minutes).padStart(2, "0")}:${totalSeconds.toString().padStart(2, "0")}`;
}