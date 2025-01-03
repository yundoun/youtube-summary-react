import { SummaryRepository } from '../../domain/repositories/SummaryRepository';
import { Summary } from '../../domain/entities/Summary';
import { summaryHttpService } from '../services/summaryHttpService';

export class SummaryRepositoryImpl extends SummaryRepository {
  constructor() {
    super();
    this.httpService = summaryHttpService;
  }

  async getSummaryAll(username) {
    try {
      const response = await this.httpService.getSummaryAll(username);

      // API 응답 구조에 맞게 수정
      const summaryList = response.summary_list || [];

      return summaryList.map(summaryData => new Summary(
        summaryData.videoId,
        summaryData.title,
        summaryData.summary,
        summaryData.script,
        summaryData.status,
        summaryData.thumbnailUrl,
        summaryData.created_at
      ));
    } catch (error) {
      console.error('Error in SummaryRepositoryImpl.getSummaryAll:', error);
      throw error;
    }
  }

  async getSummary(videoId) {
    try {
      const response = await this.httpService.getSummary(videoId);
      const summaryData = response.summary_info;

      return new Summary(
        summaryData.videoId,
        summaryData.title,
        summaryData.summary,
        summaryData.script,
        summaryData.status,
        summaryData.thumbnailUrl,
        summaryData.created_at
      );
    } catch (error) {
      console.error('Error in SummaryRepositoryImpl.getSummary:', error);
      throw error;
    }
  }

  async createSummary(url, username) {
    try {
      const response = await this.httpService.createSummary(url, username);
      const summaryData = response.summary_info;

      return new Summary(
        summaryData.videoId,
        summaryData.title,
        summaryData.summary,
        summaryData.script,
        summaryData.status,
        summaryData.thumbnailUrl,
        summaryData.created_at
      );
    } catch (error) {
      console.error('Error in SummaryRepositoryImpl.createSummary:', error);
      throw error;
    }
  }

  async deleteSummary(videoId, username) {
    try {
      await this.httpService.deleteSummary(videoId, username);
    } catch (error) {
      console.error('Error in SummaryRepositoryImpl.deleteSummary:', error);
      throw error;
    }
  }
}