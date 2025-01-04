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

      // 현재 요약이 없거나 다른 비디오인 경우 새로 생성
      if (!state.currentSummary || state.currentSummary.videoId !== videoId) {
        const newSummary = { videoId, status, summary, ...rest };
        state.currentSummary = newSummary;

        // summaries 배열에도 추가
        const index = state.summaries.findIndex(s => s.videoId === videoId);
        if (index >= 0) {
          state.summaries[index] = newSummary;
        } else {
          state.summaries.unshift(newSummary);
        }
        return;
      }

      // 기존 요약 업데이트
      switch (_action) {
        case 'UPDATE_SUMMARY':
          state.currentSummary = {
            ...state.currentSummary,
            summary,
            status: 'in_progress',
            ...rest
          };
          break;

        case 'UPDATE_STATUS':
          state.currentSummary = {
            ...state.currentSummary,
            status,
            ...rest,
            // summary가 있는 경우에만 업데이트
            ...(summary && { summary })
          };
          break;

        default:
          state.currentSummary = {
            ...state.currentSummary,
            ...action.payload
          };
      }

      // summaries 배열도 업데이트
      const index = state.summaries.findIndex(s => s.videoId === videoId);
      if (index >= 0) {
        state.summaries[index] = state.currentSummary;
      } else {
        state.summaries.unshift(state.currentSummary);
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