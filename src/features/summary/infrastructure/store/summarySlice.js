// src/features/summary/infrastructure/store/summarySlice.js

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
    // 기존 리듀서들 유지
    setSummaries: (state, action) => {
      state.summaries = action.payload.map((summary) =>
        summary.toPlainObject ? summary.toPlainObject() : summary
      );
    },

    setCurrentSummary: (state, action) => {
      const { videoId, _action, ...updates } = action.payload;

      // 요약 업데이트 로직 단순화
      if (_action === 'UPDATE_SUMMARY' || _action === 'UPDATE_STATUS') {
        // currentSummary 업데이트
        if (state.currentSummary && state.currentSummary.videoId === videoId) {
          state.currentSummary = {
            ...state.currentSummary,
            ...updates
          };
        }

        // summaries 배열 업데이트
        const index = state.summaries.findIndex((s) => s.videoId === videoId);
        if (index >= 0) {
          state.summaries[index] = {
            ...state.summaries[index],
            ...updates
          };
        }
      } else {
        // 새로운 요약 데이터 설정
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

    // WebSocket 관련 리듀서 단순화
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