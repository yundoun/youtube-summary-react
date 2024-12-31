import { configureStore } from '@reduxjs/toolkit';
import { summaryFeatureReducer } from './features/summary/infrastructure/store';

export const store = configureStore({
  reducer: {
    summaryFeature: summaryFeatureReducer
  }
});