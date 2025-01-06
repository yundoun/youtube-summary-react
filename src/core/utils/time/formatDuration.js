export const formatDuration = (durationInSeconds) => {
  if (!durationInSeconds) return '불러오는 중';

  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  const seconds = Math.floor(durationInSeconds % 60);

  if (hours > 0) {
    return `${hours}시간 ${minutes > 0 ? `${minutes}분` : ''}`;
  } else if (minutes > 0) {
    return `${minutes}분 ${seconds > 0 ? `${seconds}초` : ''}`;
  } else {
    return `${seconds}초`;
  }
};