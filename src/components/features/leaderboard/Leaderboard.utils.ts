export const recentResultCheck = (created_at: Date) => {
  const created_at_date = new Date(created_at);
  const now = new Date();
  const diff = now.getTime() - created_at_date.getTime();
  if (diff < 5 * 60 * 1000) return true;

  return false;
};
