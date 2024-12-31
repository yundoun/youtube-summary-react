import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  summaries: [],
  currentSummary: null,
  isLoading: false,
  error: null,
  isWebSocketConnected: false, // WebSocket 상태 추가
};

const summarySlice = createSlice({
  name: 'summary',
  initialState,
  reducers: {
    setSummaries: (state, action) => {
      // 클래스 인스턴스를 순수 객체로 변환
      state.summaries = action.payload.map(summary =>
        summary.toPlainObject ? summary.toPlainObject() : summary
      );
    },
    setCurrentSummary: (state, action) => {
      state.currentSummary = action.payload.toPlainObject
        ? action.payload.toPlainObject()
        : action.payload;
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    removeSummary: (state, action) => {
      state.summaries = state.summaries.filter(
        summary => summary.videoId !== action.payload
      );
    },
    setWebSocketConnected: (state, action) => { // 추가된 액션
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
  setWebSocketConnected, // 추가된 액션 export
} = summarySlice.actions;

export default summarySlice.reducer;
