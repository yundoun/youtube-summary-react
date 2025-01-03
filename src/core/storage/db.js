import { openDB } from 'idb';

const DB_NAME = 'youtube-summary';
const DB_VERSION = 2;

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // 기존 객체 저장소가 있다면 삭제
      if (db.objectStoreNames.contains('summaries')) {
        db.deleteObjectStore('summaries');
      }

      // 새로운 객체 저장소 생성
      const store = db.createObjectStore('summaries', { keyPath: 'videoId' });

      // 인덱스 생성
      store.createIndex('title', 'title', { unique: false });
      store.createIndex('summary', 'summary', { unique: false });
      store.createIndex('script', 'script', { unique: false });
      store.createIndex('status', 'status', { unique: false });
      store.createIndex('thumbnailUrl', 'thumbnailUrl', { unique: false });
      store.createIndex('created_at', 'created_at', { unique: false });
    }
  });
};


export const getDB = () => openDB(DB_NAME, DB_VERSION);