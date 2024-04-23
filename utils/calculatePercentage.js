export const calculatePercentage = (thisMonth, lastMonth) => {
  if (thisMonth == 0) return thisMonth * 100;
  if (lastMonth == 0) return thisMonth * 100;
  const percent = (thisMonth / lastMonth) * 100;
  return percent.toFixed(0);
};
