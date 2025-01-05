import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dependencyContainer } from '../../infrastructure/di/DependencyContainer';

const summaryUseCases = dependencyContainer.getSummaryUseCases();

export const fetchSelectedSummary = createAsyncThunk(
  'summary/fetchSelectedSummary',
  async (videoId, { getState, dispatch }) => {
    const { summaries } = getState().summaryFeature.summary;
    const existingSummary = summaries.find(s => s.videoId === videoId);
    if (existingSummary) {
      return existingSummary;
    }
    try {
      dispatch(setLoading(true));
      const summary = await summaryUseCases.getSummary(videoId);
      return summary;
    } catch (error) {
      throw new Error(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

const initialState = {
  summaries: [],
  currentSummary: null,
  isLoading: false,
  error: null,
  isWebSocketConnected: false,
  processStatus: {
    currentStep: 0,
    isProcessing: false,
    processError: null
  },
  selectedSummary: null
};

const summarySlice = createSlice({
  name: 'summary',
  initialState,
  reducers: {
    setSummaries: (state, action) => {
      state.summaries = action.payload.map((summary) => ({
        ...summary,
        ...(summary.toPlainObject ? summary.toPlainObject() : {}),
      }));
    },

    setCurrentSummary: (state, action) => {
      const { videoId, status, summary, _action, ...rest } = action.payload;

      if (!state.currentSummary || state.currentSummary.videoId !== videoId) {
        const newSummary = { videoId, status, summary, ...rest };
        state.currentSummary = newSummary;

        const index = state.summaries.findIndex(s => s.videoId === videoId);
        if (index >= 0) {
          state.summaries[index] = newSummary;
        } else {
          state.summaries.unshift(newSummary);
        }
        return;
      }

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
            ...(summary && { summary })
          };
          break;

        default:
          state.currentSummary = {
            ...state.currentSummary,
            ...action.payload
          };
      }

      const index = state.summaries.findIndex(s => s.videoId === videoId);
      if (index >= 0) {
        state.summaries[index] = state.currentSummary;
      } else {
        state.summaries.unshift(state.currentSummary);
      }
    },

    setProcessStep: (state, action) => {
      state.processStatus.currentStep = action.payload;
    },

    startProcessing: (state) => {
      state.processStatus.isProcessing = true;
      state.processStatus.currentStep = 1;
      state.processStatus.processError = null;
    },

    finishProcessing: (state) => {
      state.processStatus.isProcessing = false;
      state.processStatus.currentStep = 0;
    },

    setProcessError: (state, action) => {
      state.processStatus.processError = action.payload;
      state.processStatus.isProcessing = false;
    },

    setSelectedSummary: (state, action) => {
      const summary = action.payload;
      state.selectedSummary = summary;

      const index = state.summaries.findIndex(
        (s) => s.videoId === summary.videoId
      );
      if (index >= 0) {
        state.summaries[index] = summary;
      } else {
        state.summaries = [summary, ...state.summaries];
      }
    },

    clearSelectedSummary: (state) => {
      state.selectedSummary = null;
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

  extraReducers: (builder) => {
    builder
      .addCase(fetchSelectedSummary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSelectedSummary.fulfilled, (state, action) => {
        console.log('선택된 요약을 가져왔습니다:', action.payload);
        state.selectedSummary = action.payload;

        const index = state.summaries.findIndex(
          (s) => s.videoId === action.payload.videoId
        );
        if (index >= 0) {
          state.summaries[index] = action.payload;
        } else {
          state.summaries = [action.payload, ...state.summaries];
        }
        state.isLoading = false;
      })
      .addCase(fetchSelectedSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        state.selectedSummary = null;
      });
  }
});

export const {
  setSummaries,
  setCurrentSummary,
  setLoading,
  setError,
  removeSummary,
  setWebSocketConnected,
  clearCurrentSummary,
  setProcessStep,
  startProcessing,
  finishProcessing,
  setProcessError,
  setSelectedSummary,
  clearSelectedSummary,
} = summarySlice.actions;

export default summarySlice.reducer;