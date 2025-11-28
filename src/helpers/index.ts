export const createUUID = () => {
  return crypto.randomUUID();
};

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

export const getDates = ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) => {
  if (!startDate || !endDate) return [];
  const dates = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
    const formattedDate = d.toLocaleDateString('zh-TW');
    const weekDay = d.toLocaleDateString('zh-TW', { weekday: 'short' });
    dates.push({ date: formattedDate, weekDay });
  }

  return dates;
};

// 根據行程類型回傳對應顏色
export const getTypeColor = (type: string) => {
  switch (type) {
    case 'meal':
      return 'bg-orange-500';
    case 'attraction':
      return 'bg-blue-500';
    case 'shopping':
      return 'bg-green-500';
    case 'transport':
      return 'bg-purple-500';
    default:
      return 'bg-gray-500';
  }
};

// 判斷是否為今天
export const isToday = (date: string) => {
  const today = new Date();
  const todayString = `${today.getFullYear()}/${String(
    today.getMonth() + 1
  ).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;
  return date === todayString;
};
