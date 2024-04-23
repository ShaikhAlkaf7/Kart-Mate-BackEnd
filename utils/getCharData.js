export const getChartData = (length, docArr, property) => {
  const data = new Array(length).fill(0);
  const today = new Date();
  docArr?.forEach((i) => {
    const creationDate = i?.createdAt;
    const monthlyDiff = (today.getMonth() - creationDate?.getMonth() + 12) % 12;

    if (monthlyDiff < length) {
      data[length - monthlyDiff - 1] += property ? i[property] : 1;
    }
  });
  return data;
};
