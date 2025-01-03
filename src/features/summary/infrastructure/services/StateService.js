import { store } from '../../../../store';
import {
  setWebSocketConnected,
  setCurrentSummary,
  setLoading,
  setError,
  setSummaries
} from '../store/summarySlice';
import { summaryEventEmitter, SummaryEvents } from '../../domain/events/SummaryEventEmitter';

export class StateService {
  constructor() {
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    summaryEventEmitter.on(SummaryEvents.SUMMARY_CREATED, this.handleSummaryCreated.bind(this));
    summaryEventEmitter.on(SummaryEvents.SUMMARY_UPDATED, this.handleSummaryUpdated.bind(this));
    summaryEventEmitter.on(SummaryEvents.SUMMARY_DELETED, this.handleSummaryDeleted.bind(this));
    summaryEventEmitter.on(SummaryEvents.SUMMARY_ERROR, this.handleError.bind(this));
    summaryEventEmitter.on(SummaryEvents.WEBSOCKET_CONNECTED, this.handleWebSocketConnected.bind(this));
    summaryEventEmitter.on(SummaryEvents.WEBSOCKET_DISCONNECTED, this.handleWebSocketDisconnected.bind(this));
  }

  dispatch(action) {
    store.dispatch(action);
  }

  setLoading(isLoading) {
    this.dispatch(setLoading(isLoading));
  }

  setError(error) {
    this.dispatch(setError(error));
  }

  handleSummaryCreated(summary) {
    this.dispatch(setCurrentSummary(summary));
  }

  handleSummaryUpdated(summary) {
    this.dispatch(setCurrentSummary(summary));
  }

  handleSummaryDeleted() {
    this.dispatch(setCurrentSummary(null));
  }

  handleError(error) {
    this.dispatch(setError(error.message));
    this.setLoading(false);
  }

  handleWebSocketConnected() {
    this.dispatch(setWebSocketConnected(true));
  }

  handleWebSocketDisconnected() {
    this.dispatch(setWebSocketConnected(false));
    this.setLoading(false);
  }

  updateSummaries(summaries) {
    this.dispatch(setSummaries(summaries));
  }
}