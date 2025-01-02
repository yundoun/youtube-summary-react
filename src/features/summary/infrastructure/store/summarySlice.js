import { createSlice } from '@reduxjs/toolkit';

// 초기 상태 정의
const initialState = {
  summaries: [],                 // 모든 요약 데이터를 저장하는 배열
  currentSummary: null,          // 현재 생성 중이거나 선택된 요약 데이터
  isLoading: false,              // 로딩 상태 여부
  error: null,                   // 에러 메시지
  isWebSocketConnected: false,   // WebSocket 연결 상태
  webSocketSummary: null,        // WebSocket에서 받은 실시간 요약 데이터
};

// summarySlice 정의
const summarySlice = createSlice({
  name: 'summary',                // slice 이름
  initialState,                   // 초기 상태
  reducers: {
    /**
     * setSummaries:
     * - 전체 요약 데이터를 업데이트.
     * - 서버에서 가져온 데이터를 `summaries` 배열에 저장.
     */
    setSummaries: (state, action) => {
      state.summaries = action.payload.map((summary) =>
        summary.toPlainObject ? summary.toPlainObject() : summary
      );
    },

    /**
     * setCurrentSummary:
     * - 현재 처리 중이거나 선택된 요약 데이터를 설정.
     * - 요약 데이터를 `currentSummary`에 저장하며, 기존 데이터가 있으면 업데이트.
     * - `summaries` 배열에서도 해당 비디오 ID가 존재하면 업데이트하고, 없으면 새로 추가.
     */
    setCurrentSummary: (state, action) => {
      const { videoId, _action, ...updates } = action.payload;

      if (_action === 'UPDATE_SUMMARY') {
        // summary 필드만 업데이트
        state.currentSummary = {
          ...state.currentSummary,
          summary: updates.summary,
          status: updates.status
        };

        // summaries 배열도 같은 방식으로 업데이트
        const index = state.summaries.findIndex((s) => s.videoId === videoId);
        if (index >= 0) {
          state.summaries[index] = {
            ...state.summaries[index],
            summary: updates.summary,
            status: updates.status
          };
        }
      } else if (_action === 'UPDATE_STATUS') {
        // status만 업데이트
        if (state.currentSummary) {
          state.currentSummary.status = updates.status;
        }
        const index = state.summaries.findIndex((s) => s.videoId === videoId);
        if (index >= 0) {
          state.summaries[index].status = updates.status;
        }
      } else {
        // 초기 설정 (POST 응답 처리)
        state.currentSummary = {
          videoId,
          ...updates
        };

        const index = state.summaries.findIndex((s) => s.videoId === videoId);
        if (index >= 0) {
          state.summaries[index] = state.currentSummary;
        } else {
          state.summaries.push(state.currentSummary);
        }
      }
    },

    /**
     * setLoading:
     * - 로딩 상태를 설정.
     * - POST 요청 또는 요약 데이터를 가져오는 동안 `true`로 설정.
     */
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    /**
     * setError:
     * - 에러 메시지를 설정.
     * - 요청 실패 또는 기타 오류 발생 시 에러 메시지를 저장.
     */
    setError: (state, action) => {
      state.error = action.payload;
    },

    /**
     * removeSummary:
     * - 특정 비디오 ID를 가진 요약 데이터를 `summaries` 배열에서 삭제.
     * - 사용자가 요약 데이터를 삭제할 때 호출.
     */
    removeSummary: (state, action) => {
      state.summaries = state.summaries.filter(
        (summary) => summary.videoId !== action.payload
      );
    },

    /**
     * setWebSocketConnected:
     * - WebSocket 연결 상태를 설정.
     * - WebSocket 연결이 성공하면 `true`, 연결이 끊어지면 `false`.
     */
    setWebSocketConnected: (state, action) => {
      state.isWebSocketConnected = action.payload;
    },

    /**
     * setWebSocketSummary:
     * - WebSocket에서 수신된 요약 데이터를 `currentSummary`에 반영.
     * - 현재 선택된 요약 데이터와 비교하여 일치하는 경우 업데이트.
     */
    setWebSocketSummary: (state, action) => {
      const { videoId, summary } = action.payload;

      if (state.currentSummary && state.currentSummary.videoId === videoId) {
        // 현재 요약 데이터의 내용 업데이트
        state.currentSummary.summary = summary;

        // 썸네일 URL 설정 (기존 URL이 없는 경우 기본 URL 사용)
        state.currentSummary.thumbnailUrl =
          state.currentSummary.thumbnailUrl || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }
    },
  },
});

// 액션 생성자 내보내기
export const {
  setSummaries,
  setCurrentSummary,
  setLoading,
  setError,
  removeSummary,
  setWebSocketConnected,
  setWebSocketSummary,
} = summarySlice.actions;

// 리듀서 내보내기
export default summarySlice.reducer;
