export const formatToSeconds = (quizTime: string) => {
  const [hours, minutes, seconds] = quizTime.split(":");
  const time = new Date();
  time.setSeconds(
    time.getSeconds() +
      +hours * 3600 +
      +minutes * 60 +
      +seconds
  );
  return time;
};