import { SummaryRepository } from '../../domain/repositories/SummaryRepository';
import { Summary } from '../../domain/entities/Summary';
import { summaryStorage } from '../../../../core/storage/summaryStorage';

/**
 * @implements {SummaryRepository}
 */
export class SummaryRepositoryImpl extends SummaryRepository {
  /**
   * 모든 요약 데이터를 로컬 스토리지에서 조회
   * @returns {Promise<Object[]>} 직렬화 가능한 객체 배열 반환
   */
  async getSummaryAll() {
    const summaries = await summaryStorage.getAllSummaries();
    // Summary 객체를 직렬화 가능한 객체로 변환하여 반환
    return summaries.map(data => this.mapToSummary(data).toPlainObject());
  }

  /**
   * 특정 비디오 ID의 요약 데이터를 로컬 스토리지에서 조회
   * @param {string} videoId
   * @returns {Promise<Object>} 직렬화 가능한 객체 반환
   */
  async getSummary(videoId) {
    const summary = await summaryStorage.getSummary(videoId);
    if (!summary) {
      throw new Error('Summary not found in local storage');
    }
    // Summary 객체를 직렬화 가능한 객체로 변환하여 반환
    return this.mapToSummary(summary).toPlainObject();
  }

  /**
   * 요약 데이터를 업데이트하거나 생성
   * @param {Object} summaryData
   * @returns {Promise<Object>} 직렬화 가능한 객체 반환
   */
  async updateSummary(summaryData) {
    await summaryStorage.saveSummary(summaryData);
    // Summary 객체를 직렬화 가능한 객체로 변환하여 반환
    return this.mapToSummary(summaryData).toPlainObject();
  }

  /**
   * 새로운 요약 데이터를 로컬 스토리지에 생성
   * @param {Object} summaryData
   * @returns {Promise<Object>} 직렬화 가능한 객체 반환
   */
  async createSummary(summaryData) {
    await summaryStorage.saveSummary(summaryData);
    // Summary 객체를 직렬화 가능한 객체로 변환하여 반환
    return this.mapToSummary(summaryData).toPlainObject();
  }

  /**
   * 요약 데이터를 로컬 스토리지에서 삭제
   * @param {string} videoId
   * @returns {Promise<void>}
   */
  async deleteSummary(videoId) {
    await summaryStorage.deleteSummary(videoId);
  }

  /**
   * 로컬 스토리지의 데이터를 Summary 엔터티로 변환
   * @private
   * @param {Object} data
   * @returns {Summary}
   */
  mapToSummary(data) {
    return new Summary(
      data.videoId,
      data.title,
      data.summary,
      data.script,
      data.status || 'pending',
      data.thumbnailUrl,
      data.createdAt
    );
  }
}
