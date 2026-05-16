'use client';

import React from 'react';
import { AdminImage as Image } from '@/app/admin/components/AdminImage';
import { Check, ChevronDown, GripVertical, Layers, Package, Plus, RotateCcw, Search, Trash2, X } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, cn } from '../../../components/ui';
import { SettingsImageUploader } from '../../../components/SettingsImageUploader';
import type { ProductGridSortBy, ProductGridSelectionMode } from '../_types';
import type { DemoProductItem } from '../../product-list/_types';
import { AiDemoProductsImport } from '../../product-list/_components/AiDemoProductsImport';

import { DEFAULT_GRID_DEMO_PRODUCTS } from '../_lib/constants';

export const DEFAULT_DEMO_PRODUCTS: DemoProductItem[] = DEFAULT_GRID_DEMO_PRODUCTS;

export interface ProductGridProductItem {
  _id: string;
  name: string;
  image?: string | null;
  price?: number | null;
  salePrice?: number | null;
  hasVariants?: boolean;
}

export interface CategoryTabItem {
  _id: string;
  name: string;
  image?: string;
  active: boolean;
}

export const ProductGridForm = ({
  itemCount,
  setItemCount,
  sortBy,
  setSortBy,
  selectionMode,
  setSelectionMode,
  selectedProductIds,
  setSelectedProductIds,
  productSearchTerm,
  setProductSearchTerm,
  selectedProducts,
  filteredProducts,
  isLoading,
  demoProducts,
  setDemoProducts,
  categoryTabIds,
  setCategoryTabIds,
  allCategories,
  desktopColumns = 4,
  onDesktopColumnsChange,
  defaultExpanded = true,
}: {
  itemCount: number;
  setItemCount: (value: number) => void;
  sortBy: ProductGridSortBy;
  setSortBy: (value: ProductGridSortBy) => void;
  selectionMode: ProductGridSelectionMode;
  setSelectionMode: (value: ProductGridSelectionMode) => void;
  selectedProductIds: string[];
  setSelectedProductIds: React.Dispatch<React.SetStateAction<string[]>>;
  productSearchTerm: string;
  setProductSearchTerm: (value: string) => void;
  selectedProducts: ProductGridProductItem[];
  filteredProducts: ProductGridProductItem[];
  isLoading: boolean;
  demoProducts: DemoProductItem[];
  setDemoProducts: React.Dispatch<React.SetStateAction<DemoProductItem[]>>;
  categoryTabIds: string[];
  setCategoryTabIds: React.Dispatch<React.SetStateAction<string[]>>;
  allCategories?: CategoryTabItem[];
  desktopColumns?: 3 | 4 | 5 | 6;
  onDesktopColumnsChange?: (cols: 3 | 4 | 5 | 6) => void;
  defaultExpanded?: boolean;
}) => {
  const [colsExpanded, setColsExpanded] = React.useState(defaultExpanded);
  const [tabsExpanded, setTabsExpanded] = React.useState(defaultExpanded);
  const [dataExpanded, setDataExpanded] = React.useState(defaultExpanded);

  const selectedCategories = allCategories
    ? categoryTabIds.map(id => allCategories.find(c => c._id === id)).filter(Boolean) as CategoryTabItem[]
    : [];

  return (
    <>
      {/* ── Số cột desktop ── */}
      {onDesktopColumnsChange && (
        <Card className="mb-6">
          <CardHeader
            className="cursor-pointer"
            onClick={() => setColsExpanded(!colsExpanded)}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Layers size={18} />
                Số cột desktop
              </CardTitle>
              <ChevronDown size={16} className={cn('transition-transform duration-200', colsExpanded ? 'rotate-180' : '')} />
            </div>
          </CardHeader>
          {colsExpanded && (
          <CardContent>
            <div className="grid grid-cols-4 gap-2">
              {([3, 4, 5, 6] as const).map((option) => {
                const selected = desktopColumns === option;
                const info = option === 3 ? 'Tablet 3 · Mobile 1' : option === 4 ? 'Tablet 2 · Mobile 2' : option === 5 ? 'Tablet 3 · Mobile 2' : 'Tablet 3 · Mobile 3';
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => onDesktopColumnsChange(option)}
                    className={cn(
                      'py-2 rounded-md border text-xs transition-colors text-center',
                      selected
                        ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300'
                        : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300',
                    )}
                  >
                    <div className="font-semibold">{option} cột</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{info}</div>
                  </button>
                );
              })}
            </div>
          </CardContent>
          )}
        </Card>
      )}

      {/* ── Tab danh mục ── */}
      <Card className="mb-6">
        <CardHeader
          className="cursor-pointer"
          onClick={() => setTabsExpanded(!tabsExpanded)}
        >
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Layers size={18} />
                Tab danh mục
              </CardTitle>
              <p className="text-xs text-slate-500 mt-1">
                Chọn danh mục hiển thị dưới dạng nút lọc phía trên lưới sản phẩm
              </p>
            </div>
            <ChevronDown size={16} className={cn('transition-transform duration-200 shrink-0', tabsExpanded ? 'rotate-180' : '')} />
          </div>
        </CardHeader>
        {tabsExpanded && (
        <CardContent className="space-y-3">
            {/* Selected tabs */}
            {selectedCategories.length > 0 && (
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-500">Đã chọn ({selectedCategories.length})</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.map(cat => (
                    <span
                      key={cat._id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800"
                    >
                      {cat.name}
                      <button
                        type="button"
                        onClick={() => setCategoryTabIds(prev => prev.filter(id => id !== cat._id))}
                        className="hover:text-red-500 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Available categories */}
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Chọn danh mục hiển thị</Label>
              {!allCategories ? (
                <p className="text-xs text-slate-400">Đang tải danh mục...</p>
              ) : allCategories.length === 0 ? (
                <p className="text-xs text-slate-400">Chưa có danh mục sản phẩm nào</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {allCategories.filter(cat => cat.active).map(cat => {
                    const isSelected = categoryTabIds.includes(cat._id);
                    return (
                      <button
                        key={cat._id}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setCategoryTabIds(prev => prev.filter(id => id !== cat._id));
                          } else {
                            setCategoryTabIds(prev => [...prev, cat._id]);
                          }
                        }}
                        className={cn(
                          'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                          isSelected
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:border-blue-600'
                        )}
                      >
                        {isSelected && <Check size={12} />}
                        {cat.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {selectedCategories.length === 0 && allCategories && allCategories.length > 0 && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                Chưa chọn danh mục — sẽ hiển thị tất cả danh mục active
              </p>
            )}
        </CardContent>
        )}
      </Card>

      {/* ── Nguồn dữ liệu ── */}
      <Card className="mb-6">
        <CardHeader
          className="cursor-pointer"
          onClick={() => setDataExpanded(!dataExpanded)}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Nguồn dữ liệu</CardTitle>
            <ChevronDown size={16} className={cn('transition-transform duration-200', dataExpanded ? 'rotate-180' : '')} />
          </div>
        </CardHeader>
        {dataExpanded && (
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Chế độ chọn sản phẩm</Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>{  setSelectionMode('auto'); }}
                className={cn(
                  "flex-1 py-2.5 px-4 rounded-lg border text-sm font-medium transition-all",
                  selectionMode === 'auto'
                    ? "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                )}
              >
                Tự động
              </button>
              <button
                type="button"
                onClick={() =>{  setSelectionMode('manual'); }}
                className={cn(
                  "flex-1 py-2.5 px-4 rounded-lg border text-sm font-medium transition-all",
                  selectionMode === 'manual'
                    ? "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                )}
              >
                Chọn thủ công
              </button>
              <button
                type="button"
                onClick={() =>{  setSelectionMode('demo'); }}
                className={cn(
                  "flex-1 py-2.5 px-4 rounded-lg border text-sm font-medium transition-all",
                  selectionMode === 'demo'
                    ? "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                )}
              >
                Demo
              </button>
            </div>
            <p className="text-xs text-slate-500">
              {selectionMode === 'auto'
                ? 'Hiển thị sản phẩm tự động theo số lượng và sắp xếp'
                : selectionMode === 'manual'
                  ? 'Chọn từng sản phẩm cụ thể để hiển thị'
                  : 'Nhập dữ liệu demo trực tiếp, không cần sản phẩm thật'}
            </p>
          </div>

          {selectionMode === 'auto' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Số lượng hiển thị</Label>
                <Input
                  type="number"
                  value={itemCount}
                  onChange={(e) =>{  setItemCount(Number.parseInt(e.target.value) || 8); }}
                />
              </div>
              <div className="space-y-2">
                <Label>Sắp xếp theo</Label>
                <select
                  className="w-full h-10 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
                  value={sortBy}
                  onChange={(e) =>{  setSortBy(e.target.value as ProductGridSortBy); }}
                >
                  <option value="newest">Mới nhất</option>
                  <option value="bestseller">Bán chạy nhất</option>
                  <option value="random">Ngẫu nhiên</option>
                </select>
              </div>
            </div>
          )}

          {selectionMode === 'manual' && (
            <div className="space-y-4">
              {selectedProducts.length > 0 && (
                <div className="space-y-2">
                  <Label>Sản phẩm đã chọn ({selectedProducts.length})</Label>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {selectedProducts.map((product, index) => (
                      <div
                        key={product._id}
                        className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg group"
                      >
                        <div className="text-slate-400 cursor-move"><GripVertical size={16} /></div>
                        <span className="w-6 h-6 flex items-center justify-center bg-blue-500 text-white text-xs rounded-full font-medium">{index + 1}</span>
                        {product.image ? (
                          <Image src={product.image} alt="" width={48} height={48} className="w-12 h-12 object-cover rounded" />
                        ) : (
                          <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center"><Package size={16} className="text-slate-400" /></div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{product.name}</p>
                          <p className="text-xs text-slate-500">{product.price?.toLocaleString('vi-VN')}đ</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-red-500"
                          onClick={() =>{  setSelectedProductIds(ids => ids.filter(id => id !== product._id)); }}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Thêm sản phẩm</Label>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Tìm kiếm sản phẩm..."
                    className="pl-9"
                    value={productSearchTerm}
                    onChange={(e) =>{  setProductSearchTerm(e.target.value); }}
                  />
                </div>
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg max-h-[250px] overflow-y-auto">
                  {filteredProducts.length === 0 ? (
                    <div className="p-4 text-center text-sm text-slate-500">
                      {isLoading ? 'Đang tải...' : 'Không tìm thấy sản phẩm'}
                    </div>
                  ) : (
                    filteredProducts.map(product => {
                      const isSelected = selectedProductIds.includes(product._id);
                      return (
                        <div
                          key={product._id}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedProductIds(ids => ids.filter(id => id !== product._id));
                            } else {
                              setSelectedProductIds(ids => [...ids, product._id]);
                            }
                          }}
                          className={cn(
                            "flex items-center gap-3 p-3 cursor-pointer border-b border-slate-100 dark:border-slate-800 last:border-0 transition-colors",
                            isSelected ? "bg-blue-50 dark:bg-blue-500/10" : "hover:bg-slate-50 dark:hover:bg-slate-800"
                          )}
                        >
                          <div className={cn(
                            "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                            isSelected ? "border-blue-500 bg-blue-500" : "border-slate-300 dark:border-slate-600"
                          )}>
                            {isSelected && <Check size={12} className="text-white" />}
                          </div>
                          {product.image ? (
                            <Image src={product.image} alt="" width={40} height={40} className="w-10 h-10 object-cover rounded" />
                          ) : (
                            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded flex items-center justify-center"><Package size={14} className="text-slate-400" /></div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{product.name}</p>
                            <p className="text-xs text-slate-500">{product.price?.toLocaleString('vi-VN')}đ</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Demo mode - Inline demo items */}
          {selectionMode === 'demo' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Sản phẩm demo ({demoProducts.length})</Label>
                <div className="flex gap-1.5">
                  <Button type="button" variant="outline" size="sm"
                    onClick={() => setDemoProducts(DEFAULT_DEMO_PRODUCTS.map((d, i) => ({ ...d, id: `demo-${Date.now() + i}` })))}>
                    <RotateCcw size={14} className="mr-1" /> Mặc định
                  </Button>
                  <AiDemoProductsImport onApply={setDemoProducts} />
                  <Button type="button" variant="outline" size="sm"
                    onClick={() => setDemoProducts(prev => [...prev, { id: `demo-${Date.now()}`, name: '', image: '', price: '', originalPrice: '', description: '', category: '', tag: '' as const }])}>
                    <Plus size={14} className="mr-1" /> Thêm
                  </Button>
                </div>
              </div>
              {demoProducts.map((item, index) => (
                <div key={item.id} className="flex items-start gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <span className="mt-2 w-5 h-5 flex items-center justify-center bg-blue-500 text-white text-[10px] rounded-full font-bold shrink-0">{index + 1}</span>
                  <div className="flex-1 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Input placeholder="Tên sản phẩm" value={item.name} className="col-span-2"
                        onChange={(e) => setDemoProducts(prev => prev.map(d => d.id === item.id ? { ...d, name: e.target.value } : d))} />
                      <Input placeholder="Giá (VD: 350.000)" value={item.price ?? ''}
                        onChange={(e) => setDemoProducts(prev => prev.map(d => d.id === item.id ? { ...d, price: e.target.value } : d))} />
                      <Input placeholder="Giá gốc (tùy chọn)" value={item.originalPrice ?? ''}
                        onChange={(e) => setDemoProducts(prev => prev.map(d => d.id === item.id ? { ...d, originalPrice: e.target.value } : d))} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input placeholder="Danh mục (VD: Thùng carton)" value={item.category ?? ''}
                        onChange={(e) => setDemoProducts(prev => prev.map(d => d.id === item.id ? { ...d, category: e.target.value } : d))} />
                    </div>
                    <SettingsImageUploader
                      label="Ảnh sản phẩm"
                      value={item.image ?? ''}
                      onChange={(url) => setDemoProducts(prev => prev.map(d => d.id === item.id ? { ...d, image: url ?? '' } : d))}
                      folder="home-components/product-grid"
                      naming={{ entityName: item.name || 'demo-product', field: 'image', index: index + 1 }}
                      previewSize="sm"
                    />
                  </div>
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500 shrink-0 mt-1"
                    onClick={() => setDemoProducts(prev => prev.length > 1 ? prev.filter(d => d.id !== item.id) : prev)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              ))}
              {demoProducts.length === 0 && (
                <div className="text-center py-6 text-sm text-slate-500">
                  Chưa có sản phẩm demo.{' '}
                  <button type="button" className="text-blue-600 hover:underline"
                    onClick={() => setDemoProducts(DEFAULT_DEMO_PRODUCTS.map((d, i) => ({ ...d, id: `demo-${Date.now() + i}` })))}>
                    Tạo mặc định
                  </button>
                </div>
              )}
            </div>
          )}
        </CardContent>
        )}
      </Card>
    </>
  );
};
