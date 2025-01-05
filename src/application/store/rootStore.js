import { configureStore } from '@reduxjs/toolkit';
import { summaryFeatureReducer } from '../../features/summary/application/store';

export const store = configureStore({
  reducer: {
    summaryFeature: summaryFeatureReducer
  }
});