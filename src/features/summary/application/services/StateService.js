import { store } from '../../../../application/store/rootStore';
import {
  setWebSocketConnected,
  setCurrentSummary,
  setLoading,
  setError,
  setSummaries,
  setProcessStep,         // 추가
  startProcessing,        // 추가
  finishProcessing,      // 추가
  setProcessError        // 추가
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
    this.dispatch(setProcessError(error));
  }

  handleSummaryCreated(summary) {
    this.setLoading(true);
    this.dispatch(startProcessing());  // 처리 시작
    this.dispatch(setCurrentSummary({
      ...summary,
      _action: 'CREATE'
    }));
  }

  handleSummaryUpdated(summary) {
    console.log('[StateService] Summary Updated', {
      status: summary.status,
      processStep: summary.processStep,
      action: summary._action
    });

    const currentState = store.getState().summaryFeature.summary;
    const currentSummary = currentState.currentSummary;

    // processStep이 있는 경우 처리 단계 업데이트
    if (summary.processStep !== undefined) {
      this.dispatch(setProcessStep(summary.processStep));
    }

    // status가 completed이고 processStep이 4(완료)인 경우
    if (summary.status === 'completed' && summary.processStep === 4) {
      this.dispatch(setCurrentSummary({
        ...summary,
        summary: currentSummary?.summary,
        _action: 'UPDATE_STATUS'
      }));
      // 완료 처리
      setTimeout(() => {
        this.dispatch(finishProcessing());
        this.setLoading(false);
      }, 1500);  // 1.5초 후 완료 처리
    } else {
      // 그 외의 경우 일반적인 업데이트 처리
      this.dispatch(setCurrentSummary({
        ...summary,
        _action: summary.status === 'in_progress' ? 'UPDATE_SUMMARY' : 'UPDATE_STATUS'
      }));
    }
  }

  handleSummaryDeleted() {
    this.dispatch(setCurrentSummary(null));
    this.dispatch(finishProcessing());  // 처리 완료
  }

  handleError(error) {
    this.setError(error.message);
    this.dispatch(finishProcessing());  // 에러 발생 시 처리 완료
    this.setLoading(false);
  }

  handleWebSocketConnected(data) {
    console.log('[StateService] WebSocket Connected - Step 1 (스크립트 추출)', data);
    this.dispatch(setWebSocketConnected(true));
    // 웹소켓 연결과 함께 전달된 processStep 설정
    if (data && data.processStep !== undefined) {
      console.log(`[StateService] Setting process step to: ${data.processStep}`);
      this.dispatch(setProcessStep(data.processStep));
    }
    this.setLoading(true);
  }

  handleWebSocketDisconnected(data) {
    this.dispatch(setWebSocketConnected(false));
    // 웹소켓 연결 종료와 함께 전달된 processStep 설정
    if (data && data.processStep !== undefined) {
      this.dispatch(setProcessStep(data.processStep));
    }
    // loading 상태는 summary complete 이벤트에서 처리
  }

  updateSummaries(summaries) {
    this.dispatch(setSummaries(summaries));
  }
}