import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function getYouTubeVideoId(url) {
  if (!url) return null;
  let videoId = null;
  const standardMatch = url.match(/[?&]v=([^&]+)/);
  if (standardMatch) {
    videoId = standardMatch[1];
  } else {
    const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
    if (shortMatch) {
      videoId = shortMatch[1];
    } else {
      const embedMatch = url.match(/embed\/([^?&]+)/);
      if (embedMatch) {
        videoId = embedMatch[1];
      }
    }
  }
  return videoId;
}