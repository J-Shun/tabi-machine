// 格式化日期為 MM/DD 格式
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
};

// 計算兩個日期之間的天數差
export const getDuration = ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return duration;
};
