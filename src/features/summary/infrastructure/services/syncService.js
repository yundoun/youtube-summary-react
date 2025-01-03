// features/summary/infrastructure/services/syncService.js

import { store } from '../../../../store';
import { setSummaries } from '../store/summarySlice';
import { summaryHttpService } from './summaryHttpService';
import { summaryStorage } from '../../../../core/storage/summaryStorage';

export const syncService = {
  /**
   * 서버의 데이터를 가져와 로컬 스토리지와 동기화
   * @param {string} [username] - 선택적 사용자 이름
   * @returns {Promise<void>}
   */
  async syncWithServer(username) {
    try {
      const response = await summaryHttpService.getSummaryAll(username);
      const serverSummaries = response?.data?.summary_list || [];

      // IndexedDB와 동기화
      await summaryStorage.syncWithServer(serverSummaries);

      // Redux store 업데이트
      store.dispatch(setSummaries(serverSummaries));

      console.log("동기화 완료");
    } catch (error) {
      console.error('Failed to sync with server:', error);
      throw new Error('Failed to sync with server');
    }
  },

  /**
   * 새로운 요약 생성 시 서버와 로컬 스토리지 동시 업데이트
   * @param {string} url - YouTube URL
   * @param {string} [username] - 선택적 사용자 이름
   */
  async createSummary(url, username) {
    try {
      // 1. 서버에 요약 생성 요청
      const response = await summaryHttpService.createSummary(url, username);
      const serverSummary = response.data.summary_info;

      // 2. 로컬 스토리지에 저장 (saveSummary로 수정)
      await summaryStorage.saveSummary(serverSummary);

      return serverSummary;
    } catch (error) {
      console.error('Failed to create summary:', error);
      throw new Error('Failed to create summary');
    }
  },

  /**
   * 요약 삭제 시 서버와 로컬 스토리지 동시 업데이트
   * @param {string} videoId - 비디오 ID
   * @param {string} [username] - 선택적 사용자 이름
   */
  async deleteSummary(videoId, username) {
    try {
      // 1. 서버에서 삭제
      await summaryHttpService.deleteSummary(videoId, username);

      // 2. 로컬 스토리지에서 삭제
      await summaryStorage.deleteSummary(videoId);
    } catch (error) {
      console.error('Failed to delete summary:', error);
      throw new Error('Failed to delete summary');
    }
  },

  /**
   * 오프라인 변경사항을 서버와 동기화
   * @returns {Promise<void>}
   */
  async syncOfflineChanges() {
    try {
      const offlineChanges = await summaryStorage.getOfflineChanges();

      for (const change of offlineChanges) {
        switch (change.type) {
          case 'create':
            await this.createSummary(change.url, change.username);
            break;
          case 'delete':
            await this.deleteSummary(change.videoId, change.username);
            break;
          // 필요한 경우 다른 변경 타입 추가
        }
      }

      // 오프라인 변경사항 클리어
      await summaryStorage.clearOfflineChanges();
    } catch (error) {
      console.error('Failed to sync offline changes:', error);
      throw new Error('Failed to sync offline changes');
    }
  },

  /**
   * 온라인 상태 변경 시 동기화 수행
   */
  async handleOnlineStatusChange() {
    if (navigator.onLine) {
      // 온라인이 되었을 때
      try {
        // 1. 오프라인 변경사항 동기화
        await this.syncOfflineChanges();
        // 2. 서버 데이터와 동기화
        await this.syncWithServer();
      } catch (error) {
        console.error('Failed to handle online status change:', error);
      }
    }
  }
};