export const getLocaleDateString = (date: Date): string => {
  return new Date(date).toLocaleDateString();
}