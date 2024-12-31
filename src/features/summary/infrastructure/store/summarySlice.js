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
      state.summaries = action.payload.map(summary =>
        summary.toPlainObject ? summary.toPlainObject() : summary
      );
    },
    setCurrentSummary: (state, action) => {
      state.currentSummary = action.payload.toPlainObject
        ? action.payload.toPlainObject()
        : action.payload;

      // 요약이 완료되면 summaries 배열도 업데이트
      if (action.payload.status === 'completed') {
        const index = state.summaries.findIndex(s => s.videoId === action.payload.videoId);
        if (index >= 0) {
          state.summaries[index] = action.payload;
        } else {
          state.summaries.push(action.payload);
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
        summary => summary.videoId !== action.payload
      );
    },
    setWebSocketConnected: (state, action) => {
      state.isWebSocketConnected = action.payload;
    },
    setWebSocketSummary: (state, action) => {
      state.webSocketSummary = action.payload;
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