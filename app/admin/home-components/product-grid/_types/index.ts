'use client';

export type ProductGridStyle = 'minimal' | 'commerce' | 'compact' | 'magazine' | 'catalog' | 'mosaic' | 'tabbed' | 'storefront';

export type ProductGridSortBy = 'newest' | 'bestseller' | 'random';

export type ProductGridSelectionMode = 'auto' | 'manual' | 'demo';

export { type DemoProductItem } from '../../product-list/_types';

export interface ProductGridConfig {
  itemCount: number;
  sortBy: ProductGridSortBy;
  selectionMode: ProductGridSelectionMode;
  selectedProductIds: string[];
  demoProducts?: import('../../product-list/_types').DemoProductItem[];
  subTitle: string;
  sectionTitle: string;
  style: ProductGridStyle;
  showCategoryTabs?: boolean;
  categoryTabIds?: string[];
  desktopColumns?: 3 | 4 | 5 | 6;
}
