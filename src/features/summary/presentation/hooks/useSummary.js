import { useSelector } from 'react-redux';
import { summaryUseCases } from '../../domain/useCases/summaryUseCase';
import { extractVideoId } from '../../../../core/utils/videoId';

/**
 * Custom Hook: useSummary
 * - 요약 데이터를 관리하고 관련된 유틸리티 함수를 제공하는 React Hook.
 * - Redux 상태를 읽고 요약 관련 유스케이스 함수를 제공합니다.
 */
export const useSummary = () => {
  // Redux 상태에서 summaryFeature의 summary 데이터를 추출
  const {
    summaries,           // 모든 요약 데이터를 저장한 배열
    currentSummary,      // 현재 선택된 또는 처리 중인 요약 데이터
    isLoading,           // 로딩 상태 플래그
    error,               // 에러 메시지
    isWebSocketConnected, // WebSocket 연결 상태
    webSocketScripts     // WebSocket에서 실시간으로 받은 데이터
  } = useSelector(state => state.summaryFeature.summary);

  /**
   * createSummary:
   * - 새로운 요약을 생성하는 함수.
   * - URL에서 비디오 ID를 추출하고, 유효하지 않으면 에러를 발생시킴.
   * 
   * @param {string} url - YouTube URL.
   * @param {string|null} username - 요청 시 사용자 이름(선택적).
   * @returns {Promise<Object>} - 생성된 요약 데이터.
   */
  const createSummary = async (url, username) => {
    // YouTube URL에서 비디오 ID 추출
    const videoId = extractVideoId(url);

    // 비디오 ID가 유효하지 않을 경우 에러 발생
    if (!videoId) throw new Error('Invalid YouTube URL');

    // summaryUseCases의 createSummary 함수 호출
    return await summaryUseCases.createSummary(url, username);
  };

  /**
   * 반환값:
   * - Redux 상태 값과 요약 관련 유스케이스 함수들을 포함.
   * - 컴포넌트에서 간단히 사용하기 위해 모든 데이터를 한 객체로 제공.
   */
  return {
    summaries,                      // 모든 요약 데이터
    currentSummary,                 // 현재 선택된 요약 데이터
    isLoading,                      // 로딩 상태
    error,                          // 에러 메시지
    isWebSocketConnected,           // WebSocket 연결 상태
    webSocketScripts,               // WebSocket 실시간 데이터
    createSummary,                  // 요약 생성 함수
    fetchAllSummaries: summaryUseCases.fetchAllSummaries, // 모든 요약 데이터 가져오기
    fetchSummary: summaryUseCases.fetchSummary,           // 특정 요약 데이터 가져오기
    deleteSummary: summaryUseCases.deleteSummary          // 요약 데이터 삭제
  };
};
