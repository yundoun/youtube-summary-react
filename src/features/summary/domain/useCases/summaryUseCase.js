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
  async fetchAllSummaries(username = null) {
    store.dispatch(setLoading(true));
    try {
      const response = await summaryApi.getSummaryAll(username);
      const summaries = response.data.summary_list.map(
        item => new Summary(item.videoId, item.title, item.summary, item.script)
      );

      // 순수 객체로 변환
      const plainSummaries = summaries.map(summary =>
        summary.toPlainObject ? summary.toPlainObject() : summary
      );

      store.dispatch(setSummaries(plainSummaries));
    } catch (error) {
      store.dispatch(setError(error.message));
    } finally {
      store.dispatch(setLoading(false));
    }
  }
  ,

  async createSummary(url, username = null) {
    store.dispatch(setLoading(true));
    try {
      const response = await summaryApi.createSummary(url, username);
      const { videoId, title, summary, script } = response.data.summary_info;
      const summaryInstance = new Summary(videoId, title, summary, script);

      await summaryStorage.saveSummary(summaryInstance);
      store.dispatch(setCurrentSummary(summaryInstance));
      return summaryInstance;
    } catch (error) {
      if (!navigator.onLine) {
        const localSummaries = await summaryStorage.getAllSummaries();
        const summaries = localSummaries.map(
          item => new Summary(item.videoId, item.title, item.summary, item.script)
        );
        store.dispatch(setSummaries(summaries));
      }
      store.dispatch(setError(error.message));
    } finally {
      store.dispatch(setLoading(false));
    }
  }
  ,

  async syncWithLocalStorage() {
    store.dispatch(setLoading(true));
    try {
      const summaries = await summaryStorage.getAllSummaries();
      const transformedSummaries = summaries.map(
        item => new Summary(item.videoId, item.title, item.summary, item.script)
      );
      store.dispatch(setSummaries(transformedSummaries));
    } catch (error) {
      store.dispatch(setError(error.message));
    } finally {
      store.dispatch(setLoading(false));
    }
  }
  ,

  async deleteSummary(videoId, username = null) {
    store.dispatch(setLoading(true));
    try {
      await summaryApi.deleteSummary(videoId, username);
      await summaryStorage.deleteSummary(videoId);
      store.dispatch(removeSummary(videoId));
    } catch (error) {
      store.dispatch(setError(error.message));
    } finally {
      store.dispatch(setLoading(false));
    }
  },

  async fetchSummary(videoId) {
    store.dispatch(setLoading(true));
    try {
      const response = await summaryApi.getSummary(videoId);
      store.dispatch(setCurrentSummary(response.data.summary_info));
      return response.data;
    } catch (error) {
      store.dispatch(setError(error.message));
    } finally {
      store.dispatch(setLoading(false));
    }
  }
};
