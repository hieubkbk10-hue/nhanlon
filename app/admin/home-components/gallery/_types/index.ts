'use client';

import type { ImageItem } from '../../../components/MultiImageUploader';
import type { SectionHeaderConfig } from '../../_shared/types/sectionHeader';

export type GalleryStyle = 'spotlight' | 'explore' | 'stories' | 'grid' | 'marquee' | 'masonry';
export type TrustBadgesStyle = 'grid' | 'cards' | 'stack' | 'wall' | 'carousel' | 'seal';

export function normalizeTrustBadgesStyle(value: unknown): TrustBadgesStyle {
  if (value === 'grid' || value === 'cards' || value === 'stack' || value === 'wall' || value === 'carousel' || value === 'seal') {
    return value;
  }
  if (value === 'marquee') { return 'stack'; }
  if (value === 'featured') { return 'seal'; }
  return 'cards';
}

export interface GalleryItem extends ImageItem {
  id: string | number;
  url: string;
  link: string;
  name?: string;
}

export interface GalleryConfig extends SectionHeaderConfig {
  items: GalleryItem[];
  style: GalleryStyle;
  harmony?: string;
}
