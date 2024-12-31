export class Summary {
  constructor(videoId, title, summary, script, status = 'pending') {
    this.videoId = videoId;
    this.title = title;
    this.summary = summary;
    this.script = script;
    this.status = status;
    this.createdAt = new Date().toISOString();
  }

  get thumbnailUrl() {
    return `https://img.youtube.com/vi/${this.videoId}/maxresdefault.jpg`;
  }

  toPlainObject() {
    return {
      videoId: this.videoId,
      title: this.title,
      summary: this.summary,
      script: this.script,
      status: this.status,
      createdAt: this.createdAt,
      thumbnailUrl: this.thumbnailUrl,
    };
  }
}
