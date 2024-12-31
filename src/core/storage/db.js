import { openDB } from 'idb';

const DB_NAME = 'youtube-summary';
const DB_VERSION = 1;

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      db.createObjectStore('summaries', { keyPath: 'videoId' });
    }
  });
};

export const getDB = () => openDB(DB_NAME, DB_VERSION);