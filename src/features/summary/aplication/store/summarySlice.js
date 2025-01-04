import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dependencyContainer } from '../../infrastructure/di/DependencyContainer';

const summaryUseCases = dependencyContainer.getSummaryUseCases();

// Async Thunk 추가
export const fetchSelectedSummary = createAsyncThunk(
  'summary/fetchSelectedSummary',
  async (videoId, { getState, dispatch }) => {
    const { summaries } = getState().summaryFeature.summary;
    // 먼저 existing summaries에서 찾기
    const existingSummary = summaries.find(s => s.videoId === videoId);
    if (existingSummary) {
      return existingSummary;
    }
    // 없으면 API에서 가져오기
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
  // 새로운 상태 추가
  processStatus: {
    currentStep: 0, // 0: 초기, 1: 스크립트 추출, 2: AI 분석, 3: 요약 생성
    isProcessing: false,
    processError: null
  },
  // 상세 페이지를 위한 상태
  selectedSummary: null
};

const summarySlice = createSlice({
  name: 'summary',
  initialState,
  reducers: {
    // 기존 리듀서들 유지
    setSummaries: (state, action) => {
      state.summaries = action.payload.map((summary) =>
        summary.toPlainObject ? summary.toPlainObject() : summary
      );
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

    // 프로세스 상태 관리를 위한 새로운 리듀서들
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

    // 상세 페이지를 위한 새로운 리듀서들
    setSelectedSummary: (state, action) => {
      const summary = action.payload;
      state.selectedSummary = summary;

      // summaries 배열에도 추가/업데이트
      const index = state.summaries.findIndex(s => s.videoId === summary.videoId);
      if (index >= 0) {
        state.summaries[index] = summary;
      } else {
        state.summaries.push(summary);
      }
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchSelectedSummary.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(fetchSelectedSummary.fulfilled, (state, action) => {
          state.selectedSummary = action.payload;
          state.isLoading = false;

          // summaries 배열 업데이트
          const index = state.summaries.findIndex(
            s => s.videoId === action.payload.videoId
          );
          if (index >= 0) {
            state.summaries[index] = action.payload;
          } else {
            state.summaries.push(action.payload);
          }
        })
        .addCase(fetchSelectedSummary.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.error.message;
          state.selectedSummary = null;
        });
    },


    clearSelectedSummary: (state) => {
      state.selectedSummary = null;
    },

    // 기존 리듀서들
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
  // 새로운 액션들 추가
  setProcessStep,
  startProcessing,
  finishProcessing,
  setProcessError,
  setSelectedSummary,
  clearSelectedSummary,
} = summarySlice.actions;

export default summarySlice.reducer;