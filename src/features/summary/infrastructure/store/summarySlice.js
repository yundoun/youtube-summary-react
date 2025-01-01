import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  summaries: [],
  currentSummary: null,
  isLoading: false,
  error: null,
  isWebSocketConnected: false,
  webSocketSummary: null,
};

const summarySlice = createSlice({
  name: 'summary',
  initialState,
  reducers: {
    setSummaries: (state, action) => {
      state.summaries = action.payload.map((summary) =>
        summary.toPlainObject ? summary.toPlainObject() : summary
      );
    },
    setCurrentSummary: (state, action) => {
      const { videoId, summary, thumbnailUrl, status } = action.payload;

      // 현재 요약 데이터 설정
      state.currentSummary = {
        videoId,
        summary: summary || state.currentSummary?.summary || '',
        thumbnailUrl: thumbnailUrl || state.currentSummary?.thumbnailUrl || '',
        status: status || state.currentSummary?.status || 'pending',
      };

      // summaries 배열 업데이트
      const index = state.summaries.findIndex((s) => s.videoId === videoId);
      if (index >= 0) {
        state.summaries[index] = state.currentSummary;
      } else {
        state.summaries.push(state.currentSummary);
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
    setWebSocketSummary: (state, action) => {
      state.webSocketSummary = action.payload;

      // 현재 요약 상태에 WebSocket 데이터 추가
      if (state.currentSummary) {
        state.currentSummary.summary = action.payload;
      }
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
  setWebSocketSummary,
} = summarySlice.actions;

export default summarySlice.reducer;
