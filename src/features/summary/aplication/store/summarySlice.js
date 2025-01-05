import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dependencyContainer } from '../../infrastructure/di/DependencyContainer';

const summaryUseCases = dependencyContainer.getSummaryUseCases();

// 비동기로 선택된 요약을 가져오는 Thunk
export const fetchSelectedSummary = createAsyncThunk(
  'summary/fetchSelectedSummary',
  async (videoId, { getState, dispatch }) => {
    // 현재 상태에서 이미 해당 videoId의 요약이 있는지 확인
    const { summaries } = getState().summaryFeature.summary;
    const existingSummary = summaries.find(s => s.videoId === videoId);
    if (existingSummary) {
      return existingSummary;
    }
    try {
      // 로딩 상태를 true로 설정
      dispatch(setLoading(true));
      // 요약 데이터를 서버에서 가져오기
      const summary = await summaryUseCases.getSummary(videoId);
      return summary;
    } catch (error) {
      throw new Error(error.message); // 에러 발생 시 처리
    } finally {
      // 로딩 상태를 false로 설정
      dispatch(setLoading(false));
    }
  }
);

// 초기 상태 정의
const initialState = {
  summaries: [], // 모든 요약 데이터
  currentSummary: null, // 현재 활성화된 요약
  isLoading: false, // 로딩 상태
  error: null, // 에러 메시지
  isWebSocketConnected: false, // 웹소켓 연결 상태
  processStatus: {
    currentStep: 0, // 현재 진행 단계
    isProcessing: false, // 처리 중 여부
    processError: null // 처리 중 발생한 에러
  },
  selectedSummary: null // 선택된 요약
};

// Redux slice 생성
const summarySlice = createSlice({
  name: 'summary',
  initialState,
  reducers: {
    // 요약 리스트 설정
    setSummaries: (state, action) => {
      state.summaries = action.payload.map((summary) => ({
        ...summary,
        ...(summary.toPlainObject ? summary.toPlainObject() : {}),
      }));
    },

    // 현재 활성화된 요약 설정
    setCurrentSummary: (state, action) => {
      const { videoId, status, summary, _action, ...rest } = action.payload;

      // 새 요약 데이터 설정
      if (!state.currentSummary || state.currentSummary.videoId !== videoId) {
        const newSummary = { videoId, status, summary, ...rest };
        state.currentSummary = newSummary;

        // 기존 요약 리스트에서 갱신
        const index = state.summaries.findIndex(s => s.videoId === videoId);
        if (index >= 0) {
          state.summaries[index] = newSummary;
        } else {
          state.summaries.unshift(newSummary);
        }
        return;
      }

      // 요약 상태 업데이트
      switch (_action) {
        case 'UPDATE_SUMMARY': // 요약 내용 업데이트
          state.currentSummary = {
            ...state.currentSummary,
            summary,
            status: 'in_progress',
            ...rest
          };
          break;

        case 'UPDATE_STATUS': // 상태만 업데이트
          state.currentSummary = {
            ...state.currentSummary,
            status,
            ...rest,
            ...(summary && { summary })
          };
          break;

        default: // 기본 동작
          state.currentSummary = {
            ...state.currentSummary,
            ...action.payload
          };
      }

      // 요약 리스트 갱신
      const index = state.summaries.findIndex(s => s.videoId === videoId);
      if (index >= 0) {
        state.summaries[index] = state.currentSummary;
      } else {
        state.summaries.unshift(state.currentSummary);
      }
    },

    // 처리 단계 업데이트
    setProcessStep: (state, action) => {
      state.processStatus.currentStep = action.payload;
    },

    // 처리 시작
    startProcessing: (state) => {
      state.processStatus.isProcessing = true;
      state.processStatus.currentStep = 1;
      state.processStatus.processError = null;
    },

    // 처리 종료
    finishProcessing: (state) => {
      state.processStatus.isProcessing = false;
      state.processStatus.currentStep = 0;
    },

    // 처리 중 에러 설정
    setProcessError: (state, action) => {
      state.processStatus.processError = action.payload;
      state.processStatus.isProcessing = false;
    },

    // 선택된 요약 설정
    setSelectedSummary: (state, action) => {
      const summary = action.payload;
      state.selectedSummary = summary;

      // 요약 리스트 갱신
      const index = state.summaries.findIndex(
        (s) => s.videoId === summary.videoId
      );
      if (index >= 0) {
        state.summaries[index] = summary;
      } else {
        state.summaries = [summary, ...state.summaries];
      }
    },

    // 선택된 요약 초기화
    clearSelectedSummary: (state) => {
      state.selectedSummary = null;
    },

    // 로딩 상태 설정
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    // 에러 메시지 설정
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // 요약 제거
    removeSummary: (state, action) => {
      state.summaries = state.summaries.filter(
        (summary) => summary.videoId !== action.payload
      );
      if (state.currentSummary?.videoId === action.payload) {
        state.currentSummary = null;
      }
    },

    // 웹소켓 연결 상태 설정
    setWebSocketConnected: (state, action) => {
      state.isWebSocketConnected = action.payload;
    },

    // 현재 요약 초기화
    clearCurrentSummary: (state) => {
      state.currentSummary = null;
    }
  },

  // 비동기 처리 추가
  extraReducers: (builder) => {
    builder
      .addCase(fetchSelectedSummary.pending, (state) => {
        state.isLoading = true; // 로딩 상태 활성화
        state.error = null;
      })
      .addCase(fetchSelectedSummary.fulfilled, (state, action) => {
        // 선택된 요약 가져오기 성공
        console.log('선택된 요약을 가져왔습니다:', action.payload);
        state.selectedSummary = action.payload;

        // 요약 리스트 갱신
        const index = state.summaries.findIndex(
          (s) => s.videoId === action.payload.videoId
        );
        if (index >= 0) {
          state.summaries[index] = action.payload;
        } else {
          state.summaries = [action.payload, ...state.summaries];
        }
        state.isLoading = false; // 로딩 상태 비활성화
      })
      .addCase(fetchSelectedSummary.rejected, (state, action) => {
        // 에러 처리
        state.isLoading = false;
        state.error = action.error.message;
        state.selectedSummary = null;
      });
  }
});

// Action 및 Reducer 내보내기
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
