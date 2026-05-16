/** Layout controls the container/background style */
export type MarqueeStyle = 'ribbon' | 'gradient' | 'minimal' | 'dark' | 'split' | 'stripe';

export type MarqueeBrandMode = 'single' | 'dual';

export type MarqueeDirection = 'left' | 'right';

export type MarqueeSpeed = 'slow' | 'normal' | 'fast';

/** Text rendering style — per-item */
export type MarqueeTextStyle = 'normal' | 'outlined' | 'bold' | 'shadow';

export type MarqueeHeaderAlign = 'left' | 'center' | 'right';

export type MarqueeScale = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface MarqueePersistItem {
  text: string;
  separator?: string;
  textStyle?: MarqueeTextStyle;
}

export interface MarqueeItem extends MarqueePersistItem {
  id: string;
}

export interface MarqueeConfig {
  items: MarqueePersistItem[];
  style: MarqueeStyle;
  direction: MarqueeDirection;
  speed: MarqueeSpeed;
  pauseOnHover: boolean;
  scale: MarqueeScale;
  uppercase: boolean;
  hideHeader?: boolean;
  showTitle?: boolean;
  showSubtitle?: boolean;
  subtitle?: string;
  headerAlign?: MarqueeHeaderAlign;
  titleColorPrimary?: boolean;
  subtitleAboveTitle?: boolean;
  uppercaseText?: boolean;
  showBadge?: boolean;
  badgeText?: string;
}

const VALID_MARQUEE_STYLES: MarqueeStyle[] = ['ribbon', 'gradient', 'minimal', 'dark', 'split', 'stripe'];
const VALID_DIRECTIONS: MarqueeDirection[] = ['left', 'right'];
const VALID_SPEEDS: MarqueeSpeed[] = ['slow', 'normal', 'fast'];
const VALID_TEXT_STYLES: MarqueeTextStyle[] = ['normal', 'outlined', 'bold', 'shadow'];

const toText = (value: unknown) => {
  if (typeof value === 'string') { return value; }
  if (typeof value === 'number') { return String(value); }
  return '';
};

export const createMarqueeItem = (seed: number | string): MarqueeItem => ({
  id: `marquee-${seed}`,
  text: '',
  separator: '✦',
  textStyle: 'normal',
});

export const normalizeMarqueeStyle = (value: unknown): MarqueeStyle => {
  if (VALID_MARQUEE_STYLES.includes(value as MarqueeStyle)) {
    return value as MarqueeStyle;
  }
  // Backward compatibility: map old styles to new
  if (value === 'outlined' || value === 'neon') { return 'minimal'; }
  if (value === 'wave') { return 'stripe'; }
  return 'ribbon';
};

export const normalizeMarqueeDirection = (value: unknown): MarqueeDirection => {
  if (VALID_DIRECTIONS.includes(value as MarqueeDirection)) {
    return value as MarqueeDirection;
  }
  return 'left';
};

export const normalizeMarqueeSpeed = (value: unknown): MarqueeSpeed => {
  if (VALID_SPEEDS.includes(value as MarqueeSpeed)) {
    return value as MarqueeSpeed;
  }
  return 'normal';
};

export const normalizeMarqueeTextStyle = (value: unknown): MarqueeTextStyle => {
  if (VALID_TEXT_STYLES.includes(value as MarqueeTextStyle)) {
    return value as MarqueeTextStyle;
  }
  return 'normal';
};

export const normalizeMarqueeScale = (value: unknown): MarqueeScale => {
  const n = typeof value === 'number' ? value : 1;
  if (n >= 1 && n <= 10) { return Math.round(n) as MarqueeScale; }
  return 1;
};

export const normalizeMarqueePersistItem = (raw: unknown): MarqueePersistItem => {
  const item = typeof raw === 'object' && raw !== null ? raw as Record<string, unknown> : {};
  return {
    text: toText(item.text),
    separator: toText(item.separator) || '✦',
    textStyle: normalizeMarqueeTextStyle(item.textStyle),
  };
};

export const normalizeMarqueeItem = (raw: unknown, index: number): MarqueeItem => {
  const item = typeof raw === 'object' && raw !== null ? raw as Record<string, unknown> : {};
  const normalized = normalizeMarqueePersistItem(item);
  const idCandidate = item.id;
  const id = typeof idCandidate === 'string' && idCandidate.trim().length > 0
    ? idCandidate
    : `marquee-${index + 1}`;

  return {
    ...normalized,
    id,
  };
};

export const toMarqueePersistItem = (item: MarqueeItem): MarqueePersistItem => ({
  text: item.text,
  separator: item.separator,
  textStyle: item.textStyle,
});
