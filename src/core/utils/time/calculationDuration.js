export const calculateDuration = (script) => {
  if (!script) return null;

  try {
    const parsedScript = JSON.parse(script);
    return parsedScript.reduce((total, segment) => total + segment.duration, 0);
  } catch (error) {
    console.error('스크립트 파싱 오류:', error);
    return null;
  }
};