export const API_ENDPOINTS = {
  CONTENT: import.meta.env.VITE_API_CONTENT,
  CONTENT_ALL: import.meta.env.VITE_API_CONTENT_ALL,
  WS_SUMMARY: import.meta.env.VITE_WS_SUMMARY,
  WS_PING: import.meta.env.VITE_WS_PING,
};

export const MESSAGE_TYPES = {
  SUMMARY: 'summary',
  COMPLETE: 'complete',
  PING: 'ping',
};
