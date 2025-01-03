// src/features/summary/infrastructure/repositories/SummaryRepositoryImpl.js

import { SummaryRepository } from '../../domain/repositories/SummaryRepository';
import { Summary } from '../../domain/entities/Summary';
import { summaryApi } from '../services/api';

/**
 * @implements {SummaryRepository}
 */
export class SummaryRepositoryImpl extends SummaryRepository {
  /**
   * @param {string} [username]
   * @returns {Promise<Summary[]>}
   */
  async getSummaryAll(username) {
    const response = await summaryApi.getSummaryAll(username);
    return response.data.summary_list.map(data => this.mapToSummary(data));
  }

  /**
   * @param {string} videoId
   * @returns {Promise<Summary>}
   */
  async getSummary(videoId) {
    const response = await summaryApi.getSummary(videoId);
    return this.mapToSummary(response.data.summary_info);
  }

  /**
   * @param {string} url
   * @param {string} [username]
   * @returns {Promise<Summary>}
   */
  async createSummary(url, username) {
    const response = await summaryApi.createSummary(url, username);
    return this.mapToSummary(response.data.summary_info);
  }

  /**
   * @param {string} videoId
   * @param {string} [username]
   * @returns {Promise<void>}
   */
  async deleteSummary(videoId, username) {
    await summaryApi.deleteSummary(videoId, username);
  }

  /**
   * API 응답 데이터를 Summary 엔터티로 변환
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
      data.status || 'pending'
    );
  }
}