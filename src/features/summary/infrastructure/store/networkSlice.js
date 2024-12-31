import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isConnected: navigator.onLine,
  retryAttempts: 0
};

const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    setNetworkStatus: (state, action) => {
      state.isConnected = action.payload;
    },
    incrementRetryAttempts: (state) => {
      state.retryAttempts += 1;
    },
    resetRetryAttempts: (state) => {
      state.retryAttempts = 0;
    }
  }
});

export const {
  setNetworkStatus,
  incrementRetryAttempts,
  resetRetryAttempts
} = networkSlice.actions;

export default networkSlice.reducer;