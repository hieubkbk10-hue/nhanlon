'use client';

import type { DemoProductCategoryItem } from '../_types';

export const PRODUCT_CATEGORIES_STYLES = [
  { id: 'grid' as const, label: 'Layout 1' },
  { id: 'carousel' as const, label: 'Layout 2' },
  { id: 'cards' as const, label: 'Layout 3' },
  { id: 'marquee' as const, label: 'Layout 4' },
  { id: 'circular' as const, label: 'Layout 5' },
  { id: 'icon-grid' as const, label: 'Layout 6' },
  { id: 'mosaic' as const, label: 'Layout 7' },
  { id: 'compact-grid' as const, label: 'Layout 8' },
];

export const DEFAULT_DEMO_PRODUCT_CATEGORIES: DemoProductCategoryItem[] = [
  { id: 'demo-1', name: 'Điện thoại & Phụ kiện', image: '/demo/categories/phone.png', productCount: 128 },
  { id: 'demo-2', name: 'Laptop & Máy tính', image: '/demo/categories/laptop.png', productCount: 85 },
  { id: 'demo-3', name: 'Thời trang Nam', image: '/demo/categories/men-fashion.png', productCount: 256 },
  { id: 'demo-4', name: 'Thời trang Nữ', image: '/demo/categories/women-fashion.png', productCount: 312 },
  { id: 'demo-5', name: 'Đồ gia dụng', image: '/demo/categories/home.png', productCount: 167 },
  { id: 'demo-6', name: 'Mỹ phẩm & Làm đẹp', image: '/demo/categories/beauty.png', productCount: 94 },
  { id: 'demo-7', name: 'Đồng hồ & Trang sức', image: '/demo/categories/watch.png', productCount: 73 },
  { id: 'demo-8', name: 'Giày dép', image: '/demo/categories/shoes.png', productCount: 189 },
  { id: 'demo-9', name: 'Thể thao & Dã ngoại', image: '/demo/categories/sports.png', productCount: 142 },
  { id: 'demo-10', name: 'Sách & Văn phòng phẩm', image: '/demo/categories/books.png', productCount: 204 },
  { id: 'demo-11', name: 'Đồ chơi trẻ em', image: '/demo/categories/toys.png', productCount: 118 },
  { id: 'demo-12', name: 'Thực phẩm & Đồ uống', image: '/demo/categories/food.png', productCount: 276 },
  { id: 'demo-13', name: 'Nội thất', image: '/demo/categories/furniture.png', productCount: 63 },
  { id: 'demo-14', name: 'Sức khỏe', image: '/demo/categories/health.png', productCount: 97 },
  { id: 'demo-15', name: 'Phụ kiện ô tô', image: '/demo/categories/auto.png', productCount: 54 },
  { id: 'demo-16', name: 'Máy ảnh & Quay phim', image: '/demo/categories/camera.png', productCount: 41 },
  { id: 'demo-17', name: 'Âm thanh & Tai nghe', image: '/demo/categories/audio.png', productCount: 86 },
  { id: 'demo-18', name: 'Đồ dùng nhà bếp', image: '/demo/categories/kitchen.png', productCount: 153 },
];
