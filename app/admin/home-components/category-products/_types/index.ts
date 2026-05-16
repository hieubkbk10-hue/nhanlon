export type CategoryProductsStyle = 'grid' | 'carousel' | 'cards' | 'bento' | 'magazine' | 'showcase' | 'wine-grid';
export type CategoryProductsBrandMode = 'single' | 'dual';
export type CategoryProductsHarmony = 'analogous' | 'complementary' | 'triadic';
export type CategoryProductsSelectionMode = 'real' | 'demo';

export interface CategoryProductsSection {
  id: number;
  categoryId: string;
  itemCount: number;
}

export interface CategoryProductsConfig {
  sections: CategoryProductsSection[];
  style: CategoryProductsStyle;
  showViewAll: boolean;
  columnsDesktop: number;
  columnsMobile: number;
  harmony?: CategoryProductsHarmony;
  selectionMode?: CategoryProductsSelectionMode;
  demoSections?: DemoCategoryProductsSection[];
}

export interface CategoryProductsProduct {
  _id: string;
  name: string;
  image?: string;
  price?: number;
  salePrice?: number;
  categoryId?: string;
  hasVariants?: boolean;
}

export interface DemoCategoryProduct {
  id: string;
  name: string;
  image?: string;
  storageId?: string;
  price?: number;
  salePrice?: number;
}

export interface DemoCategoryProductsSection {
  id: string;
  categoryName: string;
  categoryImage?: string;
  products: DemoCategoryProduct[];
}
