/**
 * Detect xem URL có phải video hay không (dựa vào extension/pattern).
 * Hỗ trợ: .mp4, .webm, .ogg, Dropbox raw links chứa .mp4?
 */
export function isVideoUrl(url: string): boolean {
  if (!url) return false;
  try {
    const { pathname } = new URL(url);
    const ext = pathname.split('.').pop()?.toLowerCase();
    return ext === 'mp4' || ext === 'webm' || ext === 'ogg';
  } catch {
    // Fallback: check bằng string match cho URL không hợp lệ
    const lower = url.toLowerCase();
    return /\.mp4(\?|$)/i.test(lower)
      || /\.webm(\?|$)/i.test(lower)
      || /\.ogg(\?|$)/i.test(lower);
  }
}

/**
 * Auto-detect mediaType từ URL.
 * Return 'video' nếu URL là video, undefined nếu là ảnh (default).
 */
export function detectMediaType(url: string): 'video' | undefined {
  return isVideoUrl(url) ? 'video' : undefined;
}
