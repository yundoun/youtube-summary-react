import { combineReducers } from '@reduxjs/toolkit';
import summaryReducer from './summarySlice';
import networkReducer from './networkSlice';

export const summaryFeatureReducer = combineReducers({
  summary: summaryReducer,
  network: networkReducer
});