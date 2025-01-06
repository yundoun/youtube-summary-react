export const extractPreview = (summaryText) => {
  if (!summaryText) return '요약 생성 중...';

  // 특수문자 제거 및 정리
  const cleanText = summaryText.replace(/[#*[\]()]/g, '').trim();

  // 전체 줄거리 요약 부분 추출
  const summaryMatch = cleanText.match(
    /전체 줄거리 요약(.*?)(?=타임라인 분석|주요 구간별 내용|$)/s
  );

  if (summaryMatch && summaryMatch[1]) {
    // 전체 줄거리 요약에서 첫 3문장 추출
    const sentences = summaryMatch[1]
      .trim()
      .split(/(?<=[.!?])\s+/)
      .filter(Boolean)
      .slice(0, 3);

    return sentences.join(' ');
  }

  // 전체 줄거리 요약이 없는 경우 일반 텍스트에서 첫 3문장 추출
  const sentences = cleanText
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean)
    .slice(0, 3);

  return sentences.join(' ');
};