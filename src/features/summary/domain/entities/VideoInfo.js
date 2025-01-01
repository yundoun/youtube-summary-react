export class VideoInfo {
  constructor(videoId, title, thumbnailUrl = null) {
    this.videoId = videoId;
    this.title = title;
    // Ensure thumbnailUrl is always initialized
    this.thumbnailUrl = thumbnailUrl || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }

  toPlainObject() {
    return {
      videoId: this.videoId,
      title: this.title,
      thumbnailUrl: this.thumbnailUrl,
    };
  }
}
