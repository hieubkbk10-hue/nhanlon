'use client';

import type { ImageItem } from '../../../components/MultiImageUploader';
import type { SectionHeaderConfig } from '../../_shared/types/sectionHeader';

export type PartnersStyle = 'grid' | 'marquee' | 'badge' | 'carousel' | 'clean' | 'divider' | 'logoCloud';
export type PartnersAlign = 'left' | 'center' | 'right';
export type PartnersDisplayMode = 'withName' | 'logoOnly';
export type PartnersHeaderAlign = 'left' | 'center' | 'right';

export interface PartnerItem extends ImageItem {
  id: string | number;
  url: string;
  link: string;
  name?: string;
}

export interface PartnersConfig extends SectionHeaderConfig {
  items: PartnerItem[];
  style: PartnersStyle;
  subheading?: string;
  align: PartnersAlign;
  displayMode: PartnersDisplayMode;
}

export const DEFAULT_PARTNERS_ALIGN: PartnersAlign = 'center';
export const DEFAULT_PARTNERS_DISPLAY_MODE: PartnersDisplayMode = 'withName';

export const DEFAULT_PARTNERS_CONFIG: Partial<PartnersConfig> = {
  hideHeader: false,
  showTitle: true,
  showSubtitle: true,
  subtitle: '',
  headerAlign: 'center',
  titleColorPrimary: false,
  subtitleAboveTitle: false,
  uppercaseText: false,
  showBadge: true,
  badgeText: 'Đối tác',
  align: DEFAULT_PARTNERS_ALIGN,
  displayMode: DEFAULT_PARTNERS_DISPLAY_MODE,
  style: 'grid',
};

export const normalizePartnersStyle = (value: unknown): PartnersStyle => {
  if (value === 'grid' || value === 'marquee' || value === 'badge' || value === 'carousel' || value === 'clean' || value === 'divider' || value === 'logoCloud') {
    return value;
  }

  if (value === 'mono') {
    return 'marquee';
  }

  if (value === 'featured') {
    return 'grid';
  }

  return 'grid';
};

export const normalizePartnersAlign = (value: unknown): PartnersAlign => {
  if (value === 'left' || value === 'center' || value === 'right') {
    return value;
  }

  return DEFAULT_PARTNERS_ALIGN;
};

export const normalizePartnersDisplayMode = (value: unknown): PartnersDisplayMode => {
  if (value === 'logoOnly') {
    return 'logoOnly';
  }

  return DEFAULT_PARTNERS_DISPLAY_MODE;
};
