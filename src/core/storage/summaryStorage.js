// core/storage/summaryStorage.js
import { getDB } from './db';

export const summaryStorage = {
  async getAllSummaries() {
    const db = await getDB();
    return db.getAll('summaries');
  },

  async getSummary(videoId) {
    const db = await getDB();
    return db.get('summaries', videoId);
  },

  async saveSummary(summary) {
    const db = await getDB();
    return db.put('summaries', summary);
  },

  async deleteSummary(videoId) {
    const db = await getDB();
    return db.delete('summaries', videoId);
  },

  async clearSummaries() {
    const db = await getDB();
    return db.clear('summaries');
  },

  async syncWithServer(serverSummaries) {
    const db = await getDB();
    const tx = db.transaction('summaries', 'readwrite');
    await tx.store.clear();
    await Promise.all(serverSummaries.map(summary => tx.store.add(summary)));
  }
};