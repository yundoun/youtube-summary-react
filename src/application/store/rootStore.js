import { configureStore } from '@reduxjs/toolkit';
import { summaryFeatureReducer } from '../../features/summary/aplication/store';

export const store = configureStore({
  reducer: {
    summaryFeature: summaryFeatureReducer
  }
});