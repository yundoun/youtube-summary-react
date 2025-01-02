import { summaryApi } from '../../infrastructure/services/api';
import { store } from '../../../../store';
import { summaryStorage } from '../../../../core/storage/summaryStorage'
import { Summary } from '../../domain/entities/Summary';

import {
  setLoading,
  setError,
  setSummaries,
  setCurrentSummary,
  removeSummary
} from '../../infrastructure/store/summarySlice';

export const summaryUseCases = {
  /**
   * fetchAllSummaries:
   * - 모든 요약 데이터를 서버에서 가져와 상태(store)에 저장.
   * - 서버에서 받은 데이터를 Summary 객체로 변환하고, 이를 순수 객체 형태로 저장.
   * 
   * @param {string|null} username - 요청 시 사용자 이름을 전달(선택적).
   */
  async fetchAllSummaries(username = null) {
    // 로딩 상태를 true로 설정
    store.dispatch(setLoading(true));
    try {
      // 서버 API 호출하여 모든 요약 데이터를 가져옴
      const response = await summaryApi.getSummaryAll(username);

      // 서버 응답 데이터를 Summary 객체로 매핑
      const summaries = response.data.summary_list.map(
        item => new Summary(item.videoId, item.title, item.summary, item.script)
      );

      // Summary 객체를 순수 객체로 변환하여 Redux 상태에 저장
      const plainSummaries = summaries.map(summary =>
        summary.toPlainObject ? summary.toPlainObject() : summary
      );

      // 변환된 데이터를 Redux 상태에 저장
      store.dispatch(setSummaries(plainSummaries));
    } catch (error) {
      // 오류 발생 시 에러 메시지를 Redux 상태에 저장
      store.dispatch(setError(error.message));
    } finally {
      // 로딩 상태를 false로 설정
      store.dispatch(setLoading(false));
    }
  },

  /**
   * createSummary:
   * - 새 요약을 생성하고 상태(store)에 저장.
   * - 서버에 요청하여 요약 데이터를 생성하고, 로컬 저장소에도 저장.
   * 
   * @param {string} url - YouTube URL.
   * @param {string|null} username - 요청 시 사용자 이름을 전달(선택적).
   * @returns {Summary} - 생성된 Summary 객체를 반환.
   */
  async createSummary(url, username = null) {
    store.dispatch(setLoading(true));
    try {
      const response = await summaryApi.createSummary(url, username);
      const { videoId, title, summary, script, status } = response.data.summary_info;

      // Summary 인스턴스 생성 시 title 포함
      const summaryInstance = new Summary(
        videoId,
        title,  // title 추가
        summary,
        script,
        status || 'pending'
      );

      // 로컬 저장소와 Redux store에 저장
      await summaryStorage.saveSummary(summaryInstance);
      store.dispatch(setCurrentSummary(summaryInstance.toPlainObject()));

      return summaryInstance;
    } catch (error) {
      store.dispatch(setError(error.message));
      throw error;
    } finally {
      store.dispatch(setLoading(false));
    }
  },

  /**
   * syncWithLocalStorage:
   * - 로컬 저장소에 저장된 요약 데이터를 Redux 상태에 동기화.
   */
  async syncWithLocalStorage() {
    store.dispatch(setLoading(true));
    try {
      // 로컬 저장소에서 요약 데이터를 가져옴
      const summaries = await summaryStorage.getAllSummaries();

      // Summary 객체를 POJO로 변환
      const transformedSummaries = summaries.map((item) =>
        item.toPlainObject ? item.toPlainObject() : item
      );

      // Redux 상태에 변환된 데이터 저장
      store.dispatch(setSummaries(transformedSummaries));
    } catch (error) {
      // 오류 발생 시 에러 메시지를 Redux 상태에 저장
      store.dispatch(setError(error.message));
      console.error('Sync Error:', error);
    } finally {
      store.dispatch(setLoading(false));
    }
  },

  /**
   * deleteSummary:
   * - 특정 비디오 ID를 가진 요약 데이터를 삭제.
   * - 서버와 로컬 저장소에서 데이터를 삭제하고, Redux 상태를 갱신.
   * 
   * @param {string} videoId - 삭제할 요약 데이터의 비디오 ID.
   * @param {string|null} username - 요청 시 사용자 이름을 전달(선택적).
   */
  async deleteSummary(videoId, username = null) {
    // 로딩 상태를 true로 설정
    store.dispatch(setLoading(true));
    try {
      // 서버에서 요약 데이터를 삭제
      await summaryApi.deleteSummary(videoId, username);

      // 로컬 저장소에서 요약 데이터를 삭제
      await summaryStorage.deleteSummary(videoId);

      // Redux 상태에서 해당 요약 데이터를 제거
      store.dispatch(removeSummary(videoId));

    } catch (error) {
      // 오류 발생 시 에러 메시지를 Redux 상태에 저장
      store.dispatch(setError(error.message));
    } finally {
      // 로딩 상태를 false로 설정
      store.dispatch(setLoading(false));
    }
  },

  /**
   * fetchSummary:
   * - 특정 비디오 ID에 해당하는 요약 데이터를 서버에서 가져와 Redux 상태에 저장.
   * 
   * @param {string} videoId - 가져올 요약 데이터의 비디오 ID.
   * @returns {Object} - 서버에서 가져온 요약 데이터.
   */
  async fetchSummary(videoId) {
    // 로딩 상태를 true로 설정
    store.dispatch(setLoading(true));
    try {
      // 서버 API 호출하여 특정 요약 데이터를 가져옴
      const response = await summaryApi.getSummary(videoId);

      // 가져온 요약 데이터를 Redux 상태에 저장
      store.dispatch(setCurrentSummary(response.data.summary_info));

      // 가져온 데이터를 반환
      return response.data;
    } catch (error) {
      // 오류 발생 시 에러 메시지를 Redux 상태에 저장
      store.dispatch(setError(error.message));
    } finally {
      // 로딩 상태를 false로 설정
      store.dispatch(setLoading(false));
    }
  }
};
