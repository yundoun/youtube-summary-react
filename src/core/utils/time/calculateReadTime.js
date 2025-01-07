export const calculateReadTime = (summaryText) => {
  if (!summaryText) return '계산하는 중';

  const words = summaryText.split(/\s+/).length;
  const wordsPerMinute = 200;
  const minutes = Math.ceil(words / wordsPerMinute);

  return `${minutes}분`;
};