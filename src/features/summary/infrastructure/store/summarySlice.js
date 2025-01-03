import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  summaries: [],
  currentSummary: null,
  isLoading: false,
  error: null,
  isWebSocketConnected: false,
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
      const { videoId, status, summary, _action, ...rest } = action.payload;

      // 현재 요약 업데이트
      if (_action === 'UPDATE_SUMMARY') {
        if (state.currentSummary?.videoId === videoId) {
          state.currentSummary = {
            ...state.currentSummary,
            summary,
            status: 'in_progress'
          };
        }
      } else if (_action === 'UPDATE_STATUS') {
        if (state.currentSummary?.videoId === videoId) {
          state.currentSummary = {
            ...state.currentSummary,
            status: 'completed'
          };
          // 완료된 요약을 summaries 배열에 추가/업데이트
          const index = state.summaries.findIndex(s => s.videoId === videoId);
          if (index >= 0) {
            state.summaries[index] = state.currentSummary;
          } else {
            state.summaries.unshift(state.currentSummary);
          }
        }
      } else {
        // 새로운 요약 생성
        const newSummary = { videoId, status, summary, ...rest };
        state.currentSummary = newSummary;

        // 새 요약을 summaries 배열에 추가
        const index = state.summaries.findIndex(s => s.videoId === videoId);
        if (index >= 0) {
          state.summaries[index] = newSummary;
        } else {
          state.summaries.unshift(newSummary);
        }
      }
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    removeSummary: (state, action) => {
      state.summaries = state.summaries.filter(
        (summary) => summary.videoId !== action.payload
      );
      if (state.currentSummary?.videoId === action.payload) {
        state.currentSummary = null;
      }
    },

    setWebSocketConnected: (state, action) => {
      state.isWebSocketConnected = action.payload;
    },

    clearCurrentSummary: (state) => {
      state.currentSummary = null;
    }
  },
});

export const {
  setSummaries,
  setCurrentSummary,
  setLoading,
  setError,
  removeSummary,
  setWebSocketConnected,
  clearCurrentSummary,
} = summarySlice.actions;

export default summarySlice.reducer;