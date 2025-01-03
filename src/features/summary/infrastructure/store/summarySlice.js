import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  summaries: [],           // 모든 요약 데이터를 저장하는 배열
  currentSummary: null,    // 현재 생성 중이거나 선택된 요약 데이터
  isLoading: false,        // 로딩 상태 여부
  error: null,             // 에러 메시지
  isWebSocketConnected: false,   // WebSocket 연결 상태
};

const summarySlice = createSlice({
  name: 'summary',
  initialState,
  reducers: {
    setSummaries: (state, action) => {
      // Summary 객체가 아니라 plain object인지 확인
      state.summaries = action.payload.map(summary =>
        summary.toPlainObject ? summary.toPlainObject() : summary
      );
    },

    setCurrentSummary: (state, action) => {
      const { videoId, _action, ...updates } = action.payload;

      if (_action === 'UPDATE_SUMMARY') {
        const index = state.summaries.findIndex((s) => s.videoId === videoId);
        if (index >= 0) {
          state.summaries[index] = {
            ...state.summaries[index],
            ...updates,
          };
        }

        if (state.currentSummary?.videoId === videoId) {
          state.currentSummary = {
            ...state.currentSummary,
            ...updates,
          };
        }
      } else {
        const newSummary = { videoId, ...updates };
        state.currentSummary = newSummary;

        const index = state.summaries.findIndex((s) => s.videoId === videoId);
        if (index >= 0) {
          state.summaries[index] = newSummary;
        } else {
          state.summaries.push(newSummary);
        }
      }
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    removeSummary: (state, action) => {
      state.summaries = state.summaries.filter(
        (summary) => summary.videoId !== action.payload
      );
    },

    setWebSocketConnected: (state, action) => {
      state.isWebSocketConnected = action.payload;
    },
  },
});

export const {
  setSummaries,
  setCurrentSummary,
  setLoading,
  setError,
  removeSummary,
  setWebSocketConnected,
} = summarySlice.actions;

export default summarySlice.reducer;
