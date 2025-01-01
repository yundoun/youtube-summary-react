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

      // Ensure thumbnailUrl is always generated
      const generatedThumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

      state.currentSummary = {
        videoId,
        summary: summary || state.currentSummary?.summary || '',
        thumbnailUrl: thumbnailUrl || generatedThumbnailUrl,
        status: status || state.currentSummary?.status || 'pending',
      };

      // Update summaries array
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
      const { videoId, summary } = action.payload;

      if (state.currentSummary && state.currentSummary.videoId === videoId) {
        state.currentSummary.summary = summary;
        state.currentSummary.thumbnailUrl =
          state.currentSummary.thumbnailUrl || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
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
