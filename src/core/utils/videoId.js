export const extractVideoId = (url) => {
  try {
    const youtubeRegex = /(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(youtubeRegex);
    return match ? match[1] : null;
  } catch (e) {
    console.error("Error extracting video ID:", e);
    return null;
  }
};