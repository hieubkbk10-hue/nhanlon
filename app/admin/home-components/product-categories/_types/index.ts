'use client';

export type ProductCategoriesStyle = 'grid' | 'carousel' | 'cards' | 'marquee' | 'circular' | 'icon-grid' | 'mosaic' | 'compact-grid';
export type ProductCategoriesBrandMode = 'single' | 'dual';
export type ProductCategoriesAlign = 'left' | 'center' | 'right';

export interface CategoryConfigItem {
  id: number;
  categoryId: string;
  customImage?: string;
  imageMode?: 'product-image' | 'default' | 'icon' | 'upload' | 'url';
}

export interface CategoryData {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
}

export interface ProductCategoriesResolvedItem {
  id: string;
  itemId: number | string;
  name: string;
  slug?: string;
  description?: string;
  displayImage?: string;
  displayIcon?: string;
  productCount: number;
}

export type ProductCategoriesSelectionMode = 'real' | 'demo';

export interface DemoProductCategoryItem {
  id: string;
  name: string;
  image?: string;
  description?: string;
  productCount?: number;
}

export interface ProductCategoriesConfig {
  categories: CategoryConfigItem[];
  style: ProductCategoriesStyle;
  showProductCount: boolean;
  hideHeader?: boolean;
  showTitle?: boolean;
  subtitle?: string;
  showSubtitle?: boolean;
  headerAlign?: ProductCategoriesAlign;
  titleColorPrimary?: boolean;
  subtitleAboveTitle?: boolean;
  uppercaseText?: boolean;
  showBadge?: boolean;
  badgeText?: string;
  subheading?: string;
  align?: ProductCategoriesAlign;
  selectionMode?: ProductCategoriesSelectionMode;
  demoCategories?: DemoProductCategoryItem[];
}
