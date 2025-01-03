// features/summary/infrastructure/repositories/SummaryRepositoryImpl.js

import { SummaryRepository } from '../../domain/repositories/SummaryRepository';
import { Summary } from '../../domain/entities/Summary';
import { summaryStorage } from '../../../../core/storage/summaryStorage';

/**
 * @implements {SummaryRepository}
 */
export class SummaryRepositoryImpl extends SummaryRepository {
  /**
   * 모든 요약 데이터를 로컬 스토리지에서 조회
   * @param {string} [username]
   * @returns {Promise<Summary[]>}
   */
  async getSummaryAll() {
    const summaries = await summaryStorage.getAll();
    return summaries.map(data => this.mapToSummary(data));
  }

  /**
   * 특정 비디오 ID의 요약 데이터를 로컬 스토리지에서 조회
   * @param {string} videoId
   * @returns {Promise<Summary>}
   */
  async getSummary(videoId) {
    const summary = await summaryStorage.get(videoId);
    if (!summary) {
      throw new Error('Summary not found in local storage');
    }
    return this.mapToSummary(summary);
  }

  /**
   * 새로운 요약 데이터를 로컬 스토리지에 생성
   * @param {string} url
   * @param {string} [username]
   * @returns {Promise<Summary>}
   */
  async createSummary(url, username) {
    const summary = await summaryStorage.create({
      url,
      username,
      status: 'pending'
    });
    return this.mapToSummary(summary);
  }

  /**
   * 요약 데이터를 로컬 스토리지에서 삭제
   * @param {string} videoId
   * @param {string} [username]
   * @returns {Promise<void>}
   */
  async deleteSummary(videoId) {
    await summaryStorage.delete(videoId);
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