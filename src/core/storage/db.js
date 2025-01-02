import { openDB } from 'idb';

const DB_NAME = 'youtube-summary';
const DB_VERSION = 1;

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const store = db.createObjectStore('summaries', { keyPath: 'videoId' });
      // 서버 데이터 스키마와 동일하게 필드 추가
      store.createIndex('title', 'title', { unique: false });
      store.createIndex('summary', 'summary', { unique: false });
      store.createIndex('script', 'script', { unique: false });
      store.createIndex('status', 'status', { unique: false });
    }
  });
};


export const getDB = () => openDB(DB_NAME, DB_VERSION);