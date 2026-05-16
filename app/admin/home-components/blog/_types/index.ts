export type BlogStyle = 'layout1' | 'layout2' | 'layout3' | 'layout4' | 'layout5' | 'layout6' | 'layout7';

export type BlogSelectionMode = 'auto' | 'manual' | 'demo';
export type BlogBrandMode = 'single' | 'dual';
export type BlogSortBy = 'newest' | 'popular' | 'random';

export interface DemoBlogItem {
  id: string;
  title: string;
  excerpt?: string;
  thumbnail?: string;
  category?: string;
  date?: string;
  author?: string;
}

export interface BlogConfig extends Record<string, unknown> {
  itemCount: number;
  sortBy: BlogSortBy;
  style: BlogStyle;
  selectionMode: BlogSelectionMode;
  selectedPostIds: string[];
  demoPosts?: DemoBlogItem[];
  subtitle: string;
  showAuthor: boolean;
  showExcerpt: boolean;
  showDate: boolean;
}

export interface BlogPreviewItem {
  id: string | number;
  title: string;
  excerpt?: string;
  thumbnail?: string;
  date?: string;
  category?: string;
  readTime?: string;
  views?: number;
  author?: string;
}

const VALID_BLOG_STYLES: BlogStyle[] = ['layout1', 'layout2', 'layout3', 'layout4', 'layout5', 'layout6', 'layout7'];
const VALID_SORT_VALUES: BlogSortBy[] = ['newest', 'popular', 'random'];

const toText = (value: unknown) => {
  if (typeof value === 'string') {return value;}
  if (typeof value === 'number') {return String(value);}
  return '';
};

export const normalizeBlogStyle = (value: unknown): BlogStyle => {
  if (VALID_BLOG_STYLES.includes(value as BlogStyle)) {
    return value as BlogStyle;
  }
  if (value === 'grid') {return 'layout1';}
  if (value === 'list') {return 'layout2';}
  if (value === 'featured') {return 'layout3';}
  if (value === 'magazine') {return 'layout4';}
  if (value === 'carousel') {return 'layout5';}
  if (value === 'minimal') {return 'layout6';}
  return 'layout1';
};

export const normalizeBlogSortBy = (value: unknown): BlogSortBy => {
  if (VALID_SORT_VALUES.includes(value as BlogSortBy)) {
    return value as BlogSortBy;
  }
  return 'newest';
};

export const normalizeBlogSelectionMode = (value: unknown): BlogSelectionMode => (
  value === 'manual' ? 'manual' : value === 'demo' ? 'demo' : 'auto'
);

export const normalizeBlogSelectedPostIds = (value: unknown): string[] => (
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : []
);

export const normalizeBlogConfig = (raw: Record<string, unknown> | null | undefined): BlogConfig => {
  const config = raw ?? {};
  const itemCount = typeof config.itemCount === 'number'
    ? config.itemCount
    : Number(config.itemCount);

  return {
    itemCount: Number.isFinite(itemCount) && itemCount > 0 ? Math.round(itemCount) : 8,
    selectedPostIds: normalizeBlogSelectedPostIds(config.selectedPostIds),
    selectionMode: normalizeBlogSelectionMode(config.selectionMode),
    demoPosts: Array.isArray(config.demoPosts) ? config.demoPosts as DemoBlogItem[] : [],
    showAuthor: typeof config.showAuthor === 'boolean' ? config.showAuthor : true,
    showDate: typeof config.showDate === 'boolean' ? config.showDate : true,
    showExcerpt: typeof config.showExcerpt === 'boolean' ? config.showExcerpt : true,
    sortBy: normalizeBlogSortBy(config.sortBy),
    style: normalizeBlogStyle(config.style),
    subtitle: toText(config.subtitle),
  };
};
