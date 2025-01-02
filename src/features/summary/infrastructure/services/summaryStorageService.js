import { summaryStorage } from '../../../../core/storage/summaryStorage';

export const summaryStorageService = {
  saveSummary: async (summaryInstance) => {
    return summaryStorage.saveSummary(summaryInstance);
  },
};