import { store } from '../../../../application/store/rootStore';
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
    this.setLoading(true);
    this.dispatch(setCurrentSummary({
      ...summary,
      _action: 'CREATE'
    }));
  }

  handleSummaryUpdated(summary) {
    const currentState = store.getState().summaryFeature.summary;
    const currentSummary = currentState.currentSummary;

    // status가 completed인 경우 이전 summary 데이터 보존
    if (summary.status === 'completed' && currentSummary?.summary) {
      this.dispatch(setCurrentSummary({
        ...summary,
        summary: currentSummary.summary,
        _action: 'UPDATE_STATUS'
      }));
      this.setLoading(false);
    } else {
      this.dispatch(setCurrentSummary({
        ...summary,
        _action: summary.status === 'in_progress' ? 'UPDATE_SUMMARY' : 'UPDATE_STATUS'
      }));
    }
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
    this.setLoading(true);
  }

  handleWebSocketDisconnected() {
    this.dispatch(setWebSocketConnected(false));
    // loading 상태는 summary complete 이벤트에서 처리하도록 변경
  }

  updateSummaries(summaries) {
    this.dispatch(setSummaries(summaries));
  }
}