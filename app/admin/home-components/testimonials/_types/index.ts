export type TestimonialsAvatarType = 'initials' | 'image' | 'icon' | 'upload';
export type TestimonialsStyle = 'cards' | 'slider' | 'marquee' | 'showcase' | 'quote' | 'minimal' | 'split-carousel' | 'overlap-carousel';
export type TestimonialsDesktopColumns = 3 | 4;

export type TestimonialsBrandMode = 'single' | 'dual';
export type TestimonialsHarmony = 'analogous' | 'complementary' | 'triadic';

export interface TestimonialsPersistItem {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatarType: TestimonialsAvatarType;
  avatarUrl?: string;
  avatarIcon?: string;
  avatar?: string;
}

export interface TestimonialsItem extends TestimonialsPersistItem {
  id: string;
}

export type TestimonialsHeaderAlign = 'left' | 'center' | 'right';

export interface TestimonialsConfig {
  items: TestimonialsPersistItem[];
  style: TestimonialsStyle;
  desktopColumns?: TestimonialsDesktopColumns;
  splitBackgroundImage?: string;
  splitBackgroundOverlayOpacity?: number;
  harmony?: TestimonialsHarmony;
  // Header fields
  hideHeader?: boolean;
  showTitle?: boolean;
  showSubtitle?: boolean;
  subtitle?: string;
  headerAlign?: TestimonialsHeaderAlign;
  titleColorPrimary?: boolean;
  subtitleAboveTitle?: boolean;
  uppercaseText?: boolean;
  showBadge?: boolean;
  badgeText?: string;
}

const VALID_TESTIMONIAL_STYLES: TestimonialsStyle[] = ['cards', 'slider', 'marquee', 'showcase', 'quote', 'minimal', 'split-carousel', 'overlap-carousel'];
const VALID_AVATAR_TYPES: TestimonialsAvatarType[] = ['initials', 'image', 'icon', 'upload'];

const toText = (value: unknown) => {
  if (typeof value === 'string') {return value;}
  if (typeof value === 'number') {return String(value);}
  return '';
};

const toRating = (value: unknown) => {
  const rating = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(rating)) {return 5;}
  return Math.max(1, Math.min(5, Math.round(rating)));
};

export const createTestimonialsItem = (seed: number | string): TestimonialsItem => ({
  avatar: '',
  avatarIcon: '',
  avatarType: 'initials',
  avatarUrl: '',
  company: '',
  content: '',
  id: `testimonial-${seed}`,
  name: '',
  rating: 5,
  role: '',
});

export const normalizeTestimonialsAvatarType = (value: unknown): TestimonialsAvatarType => {
  if (VALID_AVATAR_TYPES.includes(value as TestimonialsAvatarType)) {
    return value as TestimonialsAvatarType;
  }

  return 'initials';
};

export const normalizeTestimonialsStyle = (value: unknown): TestimonialsStyle => {
  if (VALID_TESTIMONIAL_STYLES.includes(value as TestimonialsStyle)) {
    return value as TestimonialsStyle;
  }

  if (value === 'masonry') {return 'marquee';}
  if (value === 'carousel') {return 'showcase';}
  return 'cards';
};

export const normalizeTestimonialsDesktopColumns = (value: unknown): TestimonialsDesktopColumns => (
  value === 4 ? 4 : 3
);

export const normalizeTestimonialsPersistItem = (raw: unknown): TestimonialsPersistItem => {
  const item = typeof raw === 'object' && raw !== null ? raw as Record<string, unknown> : {};
  const avatar = toText(item.avatar);
  const avatarUrl = toText(item.avatarUrl) || avatar;
  const avatarIcon = toText(item.avatarIcon);
  const avatarType = normalizeTestimonialsAvatarType(item.avatarType);
  const resolvedAvatarType = avatarType === 'initials'
    ? (avatarIcon ? 'icon' : (avatarUrl ? 'image' : 'initials'))
    : avatarType;

  return {
    avatar,
    avatarIcon: resolvedAvatarType === 'icon' ? avatarIcon : '',
    avatarType: resolvedAvatarType,
    avatarUrl: (resolvedAvatarType === 'image' || resolvedAvatarType === 'upload') ? avatarUrl : '',
    company: toText(item.company),
    content: toText(item.content),
    name: toText(item.name),
    rating: toRating(item.rating),
    role: toText(item.role),
  };
};

export const normalizeTestimonialsItem = (raw: unknown, index: number): TestimonialsItem => {
  const item = typeof raw === 'object' && raw !== null ? raw as Record<string, unknown> : {};
  const normalized = normalizeTestimonialsPersistItem(item);
  const idCandidate = item.id;
  const id = typeof idCandidate === 'string' && idCandidate.trim().length > 0
    ? idCandidate
    : `testimonial-${index + 1}`;

  return {
    ...normalized,
    id,
  };
};

export const toTestimonialsPersistItem = (item: TestimonialsItem): TestimonialsPersistItem => {
  const normalized = normalizeTestimonialsPersistItem(item);
  return {
    ...normalized,
    avatar: (normalized.avatarType === 'image' || normalized.avatarType === 'upload') ? normalized.avatarUrl ?? '' : '',
  };
};

export const TESTIMONIALS_ICON_CHOICES = [
  'User', 'Smile', 'Briefcase', 'Heart', 'Star',
  'Sparkles', 'Building', 'Coffee', 'Globe', 'Zap',
  'ThumbsUp', 'Award', 'BadgeCheck', 'Camera', 'Headphones',
] as const;
