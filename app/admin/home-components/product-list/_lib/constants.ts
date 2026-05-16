import type { DemoProductItem, ProductListConfig, ProductListStyle, ProductListTextConfig } from '../_types';

export const PRODUCT_LIST_STYLES: { id: ProductListStyle; label: string }[] = [
  { id: 'commerce', label: 'Commerce' },
  { id: 'minimal', label: 'E-commerce' },
  { id: 'bento', label: 'Bento' },
  { id: 'carousel', label: 'Carousel' },
  { id: 'wine-carousel', label: 'Wine Carousel' },
  { id: 'compact', label: 'Compact' },
  { id: 'showcase', label: 'Showcase' },
];

export const normalizeProductListStyle = (value: unknown): ProductListStyle => {
  if (
    value === 'minimal'
    || value === 'commerce'
    || value === 'bento'
    || value === 'carousel'
    || value === 'wine-carousel'
    || value === 'compact'
    || value === 'showcase'
  ) {
    return value;
  }

  return 'commerce';
};

export const DEFAULT_PRODUCT_LIST_CONFIG: ProductListConfig = {
  itemCount: 8,
  sortBy: 'newest',
};

export const DEFAULT_PRODUCT_LIST_TEXT: ProductListTextConfig = {
  subTitle: 'Bộ sưu tập',
  sectionTitle: 'Sản phẩm nổi bật',
};

export const DEFAULT_DEMO_PRODUCTS: DemoProductItem[] = [
  { id: 'demo-1', name: 'iPhone 15 Pro Max', image: '/demo/products/product-1.png', price: '34.990.000đ', originalPrice: '36.990.000đ', category: 'Smartphone', tag: 'new' },
  { id: 'demo-2', name: 'MacBook Pro M3', image: '/demo/products/product-2.png', price: '45.990.000đ', category: 'Laptop', tag: '' },
  { id: 'demo-3', name: 'Sony WH-1000XM5', image: '/demo/products/product-3.png', price: '8.490.000đ', originalPrice: '9.290.000đ', category: 'Audio', tag: 'sale' },
  { id: 'demo-4', name: 'Apple Watch Ultra 2', image: '/demo/products/product-4.png', price: '21.990.000đ', category: 'Wearable', tag: 'new' },
  { id: 'demo-5', name: 'iPad Air 5 M1', image: '/demo/products/product-5.png', price: '14.990.000đ', originalPrice: '16.500.000đ', category: 'Tablet', tag: 'sale' },
  { id: 'demo-6', name: 'Marshall Stanmore III', image: '/demo/products/product-6.png', price: '9.890.000đ', category: 'Audio', tag: '' },
  { id: 'demo-7', name: 'Logitech MX Master 3S', image: '/demo/products/product-7.png', price: '2.490.000đ', category: 'Accessories', tag: '' },
  { id: 'demo-8', name: 'Fujifilm X-T5', image: '/demo/products/product-8.png', price: '42.990.000đ', originalPrice: '45.000.000đ', category: 'Camera', tag: 'hot' },
];
