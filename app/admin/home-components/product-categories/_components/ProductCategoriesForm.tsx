'use client';

import React from 'react';
import { AdminImage as Image } from '@/app/admin/components/AdminImage';
import { Bot, ChevronDown, GripVertical, Package, Plus, Trash2, X } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, cn } from '../../../components/ui';
import { CategoryImageSelector } from '../../../components/CategoryImageSelector';
import { SettingsImageUploader } from '../../../components/SettingsImageUploader';
import type { CategoryConfigItem, DemoProductCategoryItem, ProductCategoriesSelectionMode } from '../_types';
import { DEFAULT_DEMO_PRODUCT_CATEGORIES } from '../_lib/constants';
import { normalizeDemoImageSrc } from '../_lib/imageSrc';
import { AiDemoProductCategoriesImport } from '../../product-list/_components/AiDemoProductsImport';

const ClearableInput = ({ value, onChange, className, ...rest }: React.ComponentProps<typeof Input> & { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
  <div className="relative">
    <Input {...rest} value={value} onChange={onChange} className={cn(className, value && 'pr-7')} />
    {value && (
      <button type="button" className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700" onClick={() => onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)}>
        <X size={12} />
      </button>
    )}
  </div>
);

export const ProductCategoriesForm = ({
  productCategoriesItems, setProductCategoriesItems,
  productCategoriesShowCount, setProductCategoriesShowCount,
  onAutoGenerate, autoGenerateReady, autoGenerateLoading,
  productCategoriesData, brandColor,
  selectionMode = 'real', onSelectionModeChange,
  demoCategories = [], setDemoCategories,
  defaultExpanded = true,
}: {
  productCategoriesItems: CategoryConfigItem[];
  setProductCategoriesItems: (items: CategoryConfigItem[]) => void;
  productCategoriesShowCount: boolean;
  setProductCategoriesShowCount: (value: boolean) => void;
  onAutoGenerate?: () => void;
  autoGenerateReady?: boolean;
  autoGenerateLoading?: boolean;
  productCategoriesData: { _id: string; name: string; image?: string }[];
  brandColor: string;
  selectionMode?: ProductCategoriesSelectionMode;
  onSelectionModeChange?: (mode: ProductCategoriesSelectionMode) => void;
  demoCategories?: DemoProductCategoryItem[];
  setDemoCategories?: React.Dispatch<React.SetStateAction<DemoProductCategoryItem[]>>;
  defaultExpanded?: boolean;
}) => {
  const [displayExpanded, setDisplayExpanded] = React.useState(defaultExpanded);
  const [dataExpanded, setDataExpanded] = React.useState(defaultExpanded);

  // Duplicate detection for real mode
  const categoryIdCounts = productCategoriesItems.reduce<Record<string, number>>((acc, item) => {
    if (!item.categoryId) {return acc;}
    acc[item.categoryId] = (acc[item.categoryId] || 0) + 1;
    return acc;
  }, {});
  const duplicateCategoryIds = new Set(
    Object.entries(categoryIdCounts).filter(([, count]) => count > 1).map(([id]) => id)
  );
  const duplicateCount = duplicateCategoryIds.size;
  const handleRemoveDuplicates = () => {
    const seen = new Set<string>();
    setProductCategoriesItems(productCategoriesItems.filter((item) => {
      if (!item.categoryId) {return true;}
      if (seen.has(item.categoryId)) {return false;}
      seen.add(item.categoryId);
      return true;
    }));
  };

  // Demo helpers
  const addDemoItem = () => {
    setDemoCategories?.(prev => [...prev, { id: `demo-${Date.now()}`, name: '', image: '', productCount: 0 }]);
  };
  const updateDemoItem = (id: string, patch: Partial<DemoProductCategoryItem>) => {
    setDemoCategories?.(prev => prev.map(item => item.id === id ? { ...item, ...patch } : item));
  };
  const removeDemoItem = (id: string) => {
    if (demoCategories.length <= 1) return;
    setDemoCategories?.(prev => prev.filter(d => d.id !== id));
  };
  const loadDefaultDemo = () => {
    setDemoCategories?.(DEFAULT_DEMO_PRODUCT_CATEGORIES.map((d, i) => ({ ...d, id: `demo-${Date.now() + i}` })));
  };

  return (
  <>
    {/* Card 1: Display config */}
    <Card className="mb-6">
      <CardHeader className="cursor-pointer" onClick={() => setDisplayExpanded(!displayExpanded)}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Cấu hình hiển thị</CardTitle>
          <ChevronDown size={16} className={cn('transition-transform duration-200 text-slate-400', displayExpanded ? 'rotate-180' : '')} />
        </div>
      </CardHeader>
      {displayExpanded && (
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <input type="checkbox" id="showProductCount" checked={productCategoriesShowCount} onChange={(e) => setProductCategoriesShowCount(e.target.checked)} className="w-4 h-4 rounded border-slate-300" />
          <Label htmlFor="showProductCount" className="cursor-pointer">Hiển thị số lượng sản phẩm</Label>
        </div>
      </CardContent>
      )}
    </Card>

    {/* Card 3: Category selection / Demo */}
    <Card className="mb-6">
      <CardHeader className="cursor-pointer" onClick={() => setDataExpanded(!dataExpanded)}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            {selectionMode === 'demo' ? `Danh mục demo (${demoCategories.length})` : `Chọn danh mục (${productCategoriesItems.length})`}
          </CardTitle>
          <div className="flex items-center gap-2">
            {selectionMode === 'real' && dataExpanded && (
              <>
                <Button type="button" variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onAutoGenerate?.(); }} disabled={!autoGenerateReady || autoGenerateLoading} className="gap-2">Sinh nhanh</Button>
                <Button type="button" variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); const newId = Math.max(0, ...productCategoriesItems.map(c => c.id)) + 1; setProductCategoriesItems([...productCategoriesItems, { categoryId: '', customImage: '', id: newId }]); }} disabled={productCategoriesItems.length >= 12 || !productCategoriesData?.length} className="gap-2"><Plus size={14} /> Thêm</Button>
              </>
            )}
            {selectionMode === 'demo' && dataExpanded && (
              <>
                <Button type="button" variant="outline" size="sm" className="gap-1 text-xs" onClick={(e) => { e.stopPropagation(); loadDefaultDemo(); }}><Bot size={11} /> Mẫu mặc định</Button>
                <span onClick={(e) => e.stopPropagation()}>
                  <AiDemoProductCategoriesImport onApply={(items) => setDemoCategories?.(items)} />
                </span>
                <Button type="button" variant="outline" size="sm" className="gap-1 text-xs" onClick={(e) => { e.stopPropagation(); addDemoItem(); }}><Plus size={12} /> Thêm</Button>
              </>
            )}
            <ChevronDown size={16} className={cn('transition-transform duration-200 text-slate-400 shrink-0', dataExpanded ? 'rotate-180' : '')} />
          </div>
        </div>
      </CardHeader>
      {dataExpanded && (
      <CardContent className="space-y-4">
        {/* Mode toggle */}
        {onSelectionModeChange && (
          <div className="space-y-2">
            <Label>Nguồn dữ liệu</Label>
            <div className="flex gap-2">
              <button type="button" onClick={() => onSelectionModeChange('real')} className={cn("flex-1 py-2.5 px-4 rounded-lg border text-sm font-medium transition-all", selectionMode === 'real' ? "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400" : "border-slate-200 dark:border-slate-700 hover:border-slate-300")}>Dữ liệu thật</button>
              <button type="button" onClick={() => onSelectionModeChange('demo')} className={cn("flex-1 py-2.5 px-4 rounded-lg border text-sm font-medium transition-all", selectionMode === 'demo' ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400" : "border-slate-200 dark:border-slate-700 hover:border-slate-300")}>Dữ liệu demo</button>
            </div>
            <p className="text-xs text-slate-500">{selectionMode === 'real' ? 'Chọn danh mục sản phẩm thật từ hệ thống' : 'Dữ liệu mẫu gắn theo component — không cần tạo danh mục thật'}</p>
          </div>
        )}

        {/* Real mode */}
        {selectionMode === 'real' && (
          <>
            <p className="text-xs text-slate-500">Sinh nhanh sẽ tự chọn tất cả danh mục có sản phẩm và có ít nhất 1 thumbnail sản phẩm để làm ảnh đại diện.</p>
            {duplicateCount > 0 && (
              <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                <div className="flex items-center justify-between gap-3">
                  <div>⚠️ Có {duplicateCount} danh mục bị trùng lặp.</div>
                  <button type="button" className="text-amber-900 underline underline-offset-4" onClick={handleRemoveDuplicates}>Xóa trùng lặp</button>
                </div>
              </div>
            )}
            {!productCategoriesData?.length ? (
              <p className="text-sm text-slate-500 text-center py-4">Chưa có danh mục sản phẩm. Vui lòng tạo danh mục trước.</p>
            ) : (productCategoriesItems.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">Chưa chọn danh mục nào. Nhấn &quot;Thêm&quot; để bắt đầu.</p>
            ) : (
              productCategoriesItems.map((item, idx) => (
                <div key={item.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><GripVertical size={16} className="text-slate-400 cursor-move" /><Label>Danh mục {idx + 1}</Label></div>
                    <Button type="button" variant="ghost" size="icon" className="text-red-500 h-8 w-8" onClick={() => setProductCategoriesItems(productCategoriesItems.filter(c => c.id !== item.id))}><Trash2 size={14} /></Button>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-xs text-slate-500">Danh mục</Label>
                      <select value={item.categoryId} onChange={(e) => setProductCategoriesItems(productCategoriesItems.map(c => c.id === item.id ? {...c, categoryId: e.target.value} : c))} className={`w-full h-9 rounded-md border bg-white dark:bg-slate-900 px-3 text-sm ${duplicateCategoryIds.has(item.categoryId) ? 'border-amber-400' : 'border-slate-200 dark:border-slate-700'}`}>
                        <option value="">-- Chọn danh mục --</option>
                        {productCategoriesData?.map(cat => (<option key={cat._id} value={cat._id}>{cat.name}</option>))}
                      </select>
                      {duplicateCategoryIds.has(item.categoryId) && (<p className="text-xs text-amber-700">Danh mục này bị trùng, trang chủ sẽ chỉ hiển thị 1 lần.</p>)}
                    </div>
                    {item.categoryId && (
                      <div className="space-y-2">
                        <Label className="text-xs text-slate-500">Hình ảnh hiển thị</Label>
                        <CategoryImageSelector value={item.customImage || ''} onChange={(value, mode) => setProductCategoriesItems(productCategoriesItems.map(c => c.id === item.id ? {...c, customImage: value, imageMode: mode} : c))} categoryId={item.categoryId} categoryImage={productCategoriesData?.find(cat => cat._id === item.categoryId)?.image} brandColor={brandColor} />
                      </div>
                    )}
                  </div>
                </div>
              ))
            ))}
            <p className="text-xs text-slate-500">Tối đa 12 danh mục. Mỗi danh mục có thể: sử dụng ảnh gốc, chọn icon, upload ảnh, hoặc nhập URL.</p>
          </>
        )}

        {/* Demo mode */}
        {selectionMode === 'demo' && setDemoCategories && (
          <div className="space-y-3">
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {demoCategories.map((item, index) => {
                const imageSrc = normalizeDemoImageSrc(item.image);

                return (
                  <div key={item.id} className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
                    <div className="flex items-center gap-2 px-3 py-2">
                      <span className="w-5 h-5 flex items-center justify-center bg-amber-500 text-white text-[10px] rounded-full font-medium shrink-0">{index + 1}</span>
                      {imageSrc ? (
                        <Image src={imageSrc} alt="" width={36} height={36} className="w-9 h-9 object-cover rounded shrink-0" />
                      ) : (
                        <div className="w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center shrink-0"><Package size={12} className="text-slate-400" /></div>
                      )}
                      <ClearableInput placeholder="Tên danh mục *" className="h-8 flex-1 text-xs min-w-0" value={item.name} onChange={(e) => updateDemoItem(item.id, { name: e.target.value })} />
                      <Input placeholder="SL" type="number" className="h-8 w-16 text-xs shrink-0" value={item.productCount ?? ''} onChange={(e) => updateDemoItem(item.id, { productCount: Number.parseInt(e.target.value) || 0 })} />
                      <Button type="button" variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-slate-400 hover:text-red-500" onClick={() => removeDemoItem(item.id)}><Trash2 size={13} /></Button>
                    </div>
                    <div className="border-t border-slate-100 dark:border-slate-800 px-3 py-1.5">
                      <SettingsImageUploader
                        label="Ảnh đại diện"
                        value={item.image ?? ''}
                        onChange={(url) => updateDemoItem(item.id, { image: url ?? '' })}
                        folder="home-components/product-categories"
                        naming={{ entityName: item.name || 'demo-category', field: 'image', index: index + 1 }}
                        previewSize="sm"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            {demoCategories.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 py-8 text-center dark:border-slate-700">
                <Package size={24} className="mb-2 text-slate-300" />
                <p className="text-sm text-slate-500 mb-3">Chưa có danh mục demo</p>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" className="gap-1" onClick={loadDefaultDemo}><Bot size={12} /> Tải mẫu</Button>
                  <AiDemoProductCategoriesImport buttonClassName="h-9" onApply={(items) => setDemoCategories?.(items)} />
                  <Button type="button" variant="outline" size="sm" className="gap-1" onClick={addDemoItem}><Plus size={12} /> Thêm mới</Button>
                </div>
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
