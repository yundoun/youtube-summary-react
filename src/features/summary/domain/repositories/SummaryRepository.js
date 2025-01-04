/* eslint-disable no-unused-vars */
// src/features/summary/domain/repositories/SummaryRepository.js

/**
 * @typedef {Object} SummaryData
 * @property {string} videoId - 비디오 ID
 * @property {string} title - 제목
 * @property {string} summary - 요약 내용
 * @property {Array<string>} script - 스크립트
 * @property {string} [status] - 상태
 */

/**
 * Summary 도메인을 위한 repository 인터페이스
 */
export class SummaryRepository {
  /**
   * 모든 요약 데이터 조회
   * @param {string} [username] - 선택적 사용자명으로 특정 사용자의 요약만 조회 가능
   * @returns {Promise<import('../entities/Summary').Summary[]>}
   */
  async getSummaryAll(username) {
    throw new Error('SummaryRepository: getSummaryAll method must be implemented');
  }

  /**
   * 특정 ID의 요약 데이터 조회
   * @param {string} videoId - 조회할 비디오 ID
   * @returns {Promise<import('../entities/Summary').Summary>}
   */
  async getSummary(videoId) {
    throw new Error('SummaryRepository: getSummary method must be implemented');
  }

  /**
   * 새로운 요약 생성
   * @param {string} url - YouTube URL
   * @param {string} [username] - 선택적 사용자명
   * @returns {Promise<import('../entities/Summary').Summary>}
   */
  async createSummary(url, username) {
    throw new Error('SummaryRepository: createSummary method must be implemented');
  }

  /**
   * 요약 데이터 삭제
   * @param {string} videoId - 삭제할 비디오 ID
   * @param {string} [username] - 선택적 사용자명
   * @returns {Promise<void>}
   */
  async deleteSummary(videoId, username) {
    throw new Error('SummaryRepository: deleteSummary method must be implemented');
  }
}