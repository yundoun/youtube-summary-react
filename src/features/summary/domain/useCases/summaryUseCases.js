import { summaryEventEmitter, SummaryEvents } from '../events/SummaryEventEmitter';

export class SummaryUseCases {
  constructor(summaryRepository) {
    this.summaryRepository = summaryRepository;
  }

  /**
   * 모든 요약 조회
   * @param {string} username - 사용자명
   */
  async getSummaryAll(username) {
    try {
      const summaries = await this.summaryRepository.getSummaryAll(username);
      return summaries.map(summary => summary.toPlainObject());
    } catch (error) {
      console.error('Error in getSummaryAll:', error);
      summaryEventEmitter.emit(SummaryEvents.SUMMARY_ERROR, {
        error: error.message,
        operation: 'getSummaryAll'
      });
      throw error;
    }
  }

  /**
   * 특정 요약 조회
   * @param {string} videoId - 비디오 ID
   */
  async getSummary(videoId) {
    try {
      const summary = await this.summaryRepository.getSummary(videoId);
      return summary.toPlainObject();
    } catch (error) {
      console.error('Error in getSummary:', error);
      summaryEventEmitter.emit(SummaryEvents.SUMMARY_ERROR, {
        error: error.message,
        operation: 'getSummary',
        videoId
      });
      throw error;
    }
  }

  /**
   * 새로운 요약 생성
   * @param {string} url - YouTube URL
   * @param {string} username - 사용자명
   */
  async createSummary(url, username) {
    try {
      const summary = await this.summaryRepository.createSummary(url, username);
      const summaryData = summary.toPlainObject();

      summaryEventEmitter.emit(SummaryEvents.SUMMARY_CREATED, summaryData);
      return summaryData;
    } catch (error) {
      console.error('Error in createSummary:', error);
      summaryEventEmitter.emit(SummaryEvents.SUMMARY_ERROR, {
        error: error.message,
        operation: 'createSummary',
        url
      });
      throw error;
    }
  }

  /**
   * 요약 삭제
   * @param {string} videoId - 비디오 ID
   * @param {string} username - 사용자명
   */
  async deleteSummary(videoId, username) {
    try {
      await this.summaryRepository.deleteSummary(videoId, username);
      summaryEventEmitter.emit(SummaryEvents.SUMMARY_DELETED, { videoId });
    } catch (error) {
      console.error('Error in deleteSummary:', error);
      summaryEventEmitter.emit(SummaryEvents.SUMMARY_ERROR, {
        error: error.message,
        operation: 'deleteSummary',
        videoId
      });
      throw error;
    }
  }
}