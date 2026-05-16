'use client';

import type { ImageItem } from '../../../components/MultiImageUploader';

export type HeroStyle = 'slider' | 'fade' | 'bento' | 'triple' | 'triple2' | 'fullscreen' | 'split' | 'parallax';
export type HeroHarmony = 'analogous' | 'complementary' | 'triadic';

export interface HeroContent {
  badge?: string;
  heading?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  countdownText?: string;
  showFullscreenContent?: boolean;
  /** Màu cho text highlight trong heading, dùng cú pháp {text} */
  highlightColor?: string;
  /** Căn chỉnh text: left | center | right */
  textAlign?: 'left' | 'center' | 'right';
  /** Màu nền nút chính (override brand color) */
  primaryButtonColor?: string;
  /** Màu nền nút phụ */
  secondaryButtonColor?: string;
  /** Độ đậm backdrop overlay (0-100), default ~50 */
  overlayOpacity?: number;
}

export interface HeroSlide extends ImageItem {
  id: string | number;
  url: string;
  link: string;
  mediaType?: 'image' | 'video';
}

