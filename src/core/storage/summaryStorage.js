// core/storage/summaryStorage.js
import { getDB } from './db';

export const summaryStorage = {
  async getAllSummaries() {
    const db = await getDB();
    const summaries = await db.getAll('summaries');
    console.log('Local Summaries:', summaries); // 디버깅 로그 추가
    return summaries;
  },


  async getSummary(videoId) {
    const db = await getDB();
    return db.get('summaries', videoId);
  },

  async saveSummary(summary) {
    const db = await getDB();
    return db.put('summaries', {
      videoId: summary.videoId,
      title: summary.title,
      summary: summary.summary,
      script: summary.script,
      status: summary.status
    });
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
    console.log('Syncing with server...', serverSummaries); // 디버깅 로그 추가

    // 서버 데이터 유효성 검사
    if (!serverSummaries || !Array.isArray(serverSummaries)) {
      console.error('Invalid serverSummaries:', serverSummaries); // 에러 로그 추가
      return;
    }

    try {
      const db = await getDB();
      const tx = db.transaction('summaries', 'readwrite');
      await tx.store.clear();

      // 데이터 삽입
      await Promise.all(
        serverSummaries.map(summary =>
          tx.store.put({
            videoId: summary.videoId,
            title: summary.title,
            summary: summary.summary,
            script: summary.script,
            status: summary.status,
            created_at: summary.created_at,
            thumbnailUrl: summary.thumbnailUrl
          })
        )
      );

      await tx.done;
      console.log('Sync successful!'); // 동기화 완료 로그
    } catch (error) {
      console.error('Error during syncWithServer:', error); // 에러 로그 추가
    }
  }
};