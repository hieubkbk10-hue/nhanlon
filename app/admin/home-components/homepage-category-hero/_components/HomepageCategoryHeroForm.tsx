'use client';

import React from 'react';
import { Bot, ChevronDown, Database, GripVertical, Image, ImagePlus, Layers2, Plus, Trash2, X } from 'lucide-react';
import { Button, Card, CardContent, Input, Label, cn } from '../../../components/ui';
import { MultiImageUploader } from '../../../components/MultiImageUploader';
import { DEMO_CATEGORIES_DATA } from '../_lib/constants';
import { HOMEPAGE_CATEGORY_HERO_ICON_OPTIONS, getHomepageCategoryHeroIcon } from '../_lib/icon-options';
import { AiDemoProductCategoriesImport } from '../../product-list/_components/AiDemoProductsImport';
import type {
  HomepageCategoryHeroAutoGenerateConfig,
  HomepageCategoryHeroAutoGenerateMeta,
  HomepageCategoryHeroCategoryItem,
  HomepageCategoryHeroCategoryImageSize,
  HomepageCategoryHeroCategoryImageShape,
  HomepageCategoryHeroCategoryVisualMode,
  HomepageCategoryHeroMenuGroup,
  HomepageCategoryHeroMenuLink,
  HomepageCategoryHeroSelectionMode,
  HomepageCategoryHeroSlide,
} from '../_types';

/* ------------------------------------------------------------------ */
/*  Collapsible sub-section                                            */
/* ------------------------------------------------------------------ */

function SubSection({
  icon: Icon,
  title,
  defaultOpen = true,
  children,
}: {
  icon: React.ElementType;
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <Icon size={15} className="text-slate-400 shrink-0" />
        <span className="flex-1 text-left">{title}</span>
        <ChevronDown
          size={15}
          className={cn(
            'text-slate-400 transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>
      {open && (
        <div className="p-3 space-y-3 bg-white dark:bg-slate-900">
          {children}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Clearable text input                                               */
/* ------------------------------------------------------------------ */

export function ClearableInput({
  value,
  onChange,
  ...rest
}: Omit<React.ComponentProps<typeof Input>, 'onChange'> & {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <Input
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        className={cn('pr-8', rest.className)}
        {...rest}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          tabIndex={-1}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

export type DemoCategoryDataItem = { _id: string; name: string; image?: string };

export function HomepageCategoryHeroForm({
  heroSlides,
  setHeroSlides,
  categoryItems,
  setCategoryItems,
  categoriesData,
  categoryVisualMode,
  setCategoryVisualMode,
  categoryImageSize,
  setCategoryImageSize,
  categoryImageShape,
  setCategoryImageShape,
  autoGenerateConfig: _autoGenerateConfig,
  autoGenerateMeta: _autoGenerateMeta,
  autoGenerateReady,
  autoGenerateLoading,
  hideEmptyCategories,
  setHideEmptyCategories,
  onAutoGenerate,
  onLoadDemo,
  selectionMode = 'manual',
  onSelectionModeChange,
  defaultExpanded = true,
  demoCategoriesData,
  setDemoCategoriesData,
  noBorderRadius,
  setNoBorderRadius,
  noVerticalMargin,
  setNoVerticalMargin,
  bannerImageFit,
  setBannerImageFit,
}: {
  heroSlides: HomepageCategoryHeroSlide[];
  setHeroSlides: (value: HomepageCategoryHeroSlide[]) => void;
  categoryItems: HomepageCategoryHeroCategoryItem[];
  setCategoryItems: (value: HomepageCategoryHeroCategoryItem[]) => void;
  categoriesData: { _id: string; name: string; image?: string }[];
  categoryVisualMode: HomepageCategoryHeroCategoryVisualMode;
  setCategoryVisualMode: (value: HomepageCategoryHeroCategoryVisualMode) => void;
  categoryImageSize: HomepageCategoryHeroCategoryImageSize;
  setCategoryImageSize: (value: HomepageCategoryHeroCategoryImageSize) => void;
  categoryImageShape: HomepageCategoryHeroCategoryImageShape;
  setCategoryImageShape: (value: HomepageCategoryHeroCategoryImageShape) => void;
  autoGenerateConfig: HomepageCategoryHeroAutoGenerateConfig;
  autoGenerateMeta?: HomepageCategoryHeroAutoGenerateMeta;
  autoGenerateReady: boolean;
  autoGenerateLoading: boolean;
  hideEmptyCategories: boolean;
  setHideEmptyCategories: (value: boolean) => void;
  onAutoGenerate: () => void;
  onLoadDemo?: () => void;
  selectionMode?: HomepageCategoryHeroSelectionMode;
  onSelectionModeChange?: (mode: HomepageCategoryHeroSelectionMode) => void;
  defaultExpanded?: boolean;
  demoCategoriesData?: DemoCategoryDataItem[];
  setDemoCategoriesData?: React.Dispatch<React.SetStateAction<DemoCategoryDataItem[]>>;
  noBorderRadius?: boolean;
  setNoBorderRadius?: (value: boolean) => void;
  noVerticalMargin?: boolean;
  setNoVerticalMargin?: (value: boolean) => void;
  bannerImageFit?: 'cover' | 'contain';
  setBannerImageFit?: (value: 'cover' | 'contain') => void;
}) {
  const isDemo = selectionMode === 'demo';
  const resolvedCategoriesData = isDemo ? (demoCategoriesData ?? DEMO_CATEGORIES_DATA) : categoriesData;
  const [expandedCategoryIds, setExpandedCategoryIds] = React.useState<number[]>([]);
  const [iconSearch, setIconSearch] = React.useState<Record<number, string>>({});
  const [editingImageKeys, setEditingImageKeys] = React.useState<Set<string>>(new Set());
  const toggleImageEdit = (key: string) => setEditingImageKeys(prev => {
    const next = new Set(prev);
    if (next.has(key)) { next.delete(key); } else { next.add(key); }
    return next;
  });

  React.useEffect(() => {
    setExpandedCategoryIds((prev) => prev.filter((id) => categoryItems.some((item) => item.id === id)));
  }, [categoryItems]);

  const addCategory = () => {
    const newId = Math.max(0, ...categoryItems.map((item) => item.id)) + 1;
    setCategoryItems([...categoryItems, { id: newId, categoryId: '', groups: [] }]);
    setExpandedCategoryIds((prev) => [...prev, newId]);
  };

  const removeCategory = (id: number) => {
    setCategoryItems(categoryItems.filter((item) => item.id !== id));
  };

  const updateCategory = (id: number, updates: Partial<HomepageCategoryHeroCategoryItem>) => {
    setCategoryItems(categoryItems.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const getCategoryItem = (id: number) => categoryItems.find((item) => item.id === id);

  const addGroup = (id: number) => {
    const target = getCategoryItem(id);
    const list = target?.groups ?? [];
    const nextId = Math.max(0, ...list.map((item) => item.id)) + 1;
    updateCategory(id, { groups: [...list, { id: nextId, title: '', items: [] }] });
  };

  const updateGroup = (id: number, groupId: number, updates: Partial<HomepageCategoryHeroMenuGroup>) => {
    const target = getCategoryItem(id);
    if (!target) {return;}
    const list = (target.groups ?? []).map((group) => (group.id === groupId ? { ...group, ...updates } : group));
    updateCategory(id, { groups: list });
  };

  const removeGroup = (id: number, groupId: number) => {
    const target = getCategoryItem(id);
    if (!target) {return;}
    const list = (target.groups ?? []).filter((group) => group.id !== groupId);
    updateCategory(id, { groups: list });
  };

  const addGroupItem = (id: number, groupId: number) => {
    const target = getCategoryItem(id);
    if (!target) {return;}
    const groups = target.groups ?? [];
    const list = groups.map((group) => {
      if (group.id !== groupId) {return group;}
      const items = group.items ?? [];
      const nextId = Math.max(0, ...items.map((item) => item.id)) + 1;
      return { ...group, items: [...items, { id: nextId, targetType: 'category' as const, categoryId: '' }] };
    });
    updateCategory(id, { groups: list });
  };

  const updateGroupItem = (id: number, groupId: number, itemId: number, updates: Partial<HomepageCategoryHeroMenuLink>) => {
    const target = getCategoryItem(id);
    if (!target) {return;}
    const groups = target.groups ?? [];
    const list = groups.map((group) => {
      if (group.id !== groupId) {return group;}
      const items = (group.items ?? []).map((item) => (item.id === itemId ? { ...item, ...updates } : item));
      return { ...group, items };
    });
    updateCategory(id, { groups: list });
  };

  const removeGroupItem = (id: number, groupId: number, itemId: number) => {
    const target = getCategoryItem(id);
    if (!target) {return;}
    const groups = target.groups ?? [];
    const list = groups.map((group) => {
      if (group.id !== groupId) {return group;}
      const items = (group.items ?? []).filter((item) => item.id !== itemId);
      return { ...group, items };
    });
    updateCategory(id, { groups: list });
  };

  const duplicateCategoryIds = new Set(
    categoryItems
      .filter((item) => item.categoryId)
      .map((item) => item.categoryId)
      .filter((id, index, list) => list.indexOf(id) !== index)
  );

  const totalGroups = categoryItems.reduce((sum, item) => sum + (item.groups?.length ?? 0), 0);
  const totalLinks = categoryItems.reduce(
    (sum, item) => sum + (item.groups ?? []).reduce((groupSum, group) => groupSum + (group.items?.length ?? 0), 0),
    0
  );

  const handleRemoveDuplicates = () => {
    const seen = new Set<string>();
    const deduped = categoryItems.filter((item) => {
      if (!item.categoryId) {return true;}
      if (seen.has(item.categoryId)) {return false;}
      seen.add(item.categoryId);
      return true;
    });
    setCategoryItems(deduped);
    setExpandedCategoryIds((prev) => prev.filter((id) => deduped.some((item) => item.id === id)));
  };

  const toggleCategory = (id: number) => {
    setExpandedCategoryIds((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]));
  };

  const toggleAllCategories = () => {
    if (categoryItems.length === 0) {return;}
    setExpandedCategoryIds((prev) => (prev.length === categoryItems.length ? [] : categoryItems.map((item) => item.id)));
  };

  const allExpanded = categoryItems.length > 0 && expandedCategoryIds.length === categoryItems.length;
  const avatarSizeOptions: Array<{ id: HomepageCategoryHeroCategoryImageSize; label: string }> = [
    { id: '2xs', label: 'Rất nhỏ' },
    { id: 'xs', label: 'Nhỏ' },
    { id: 'sm', label: 'Vừa' },
    { id: 'md', label: 'Lớn' },
    { id: 'lg', label: 'Rất lớn' },
    { id: 'xl', label: 'Cực đại' },
  ];
  const avatarShapeOptions: Array<{ id: HomepageCategoryHeroCategoryImageShape; label: string }> = [
    { id: 'circle', label: 'Tròn' },
    { id: 'rounded', label: 'Vuông bo góc' },
    { id: 'square', label: 'Vuông sắc' },
  ];

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        {/* ── Nguồn dữ liệu ───────────────────────── */}
        <SubSection icon={Database} title="Nguồn dữ liệu" defaultOpen={defaultExpanded}>
          {/* Mode toggle */}
          {onSelectionModeChange && (
            <div className="flex gap-2">
              {(['manual', 'demo'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => onSelectionModeChange(m)}
                  className={cn(
                    'flex-1 py-2.5 px-4 rounded-lg border text-sm font-medium transition-all',
                    selectionMode === m
                      ? m === 'demo'
                        ? 'border-amber-500 bg-amber-500/10 text-amber-600'
                        : 'border-blue-500 bg-blue-500/10 text-blue-600'
                      : 'border-slate-200 hover:border-slate-300',
                  )}
                >
                  {m === 'manual' ? 'Dữ liệu thật' : 'Dữ liệu demo'}
                </button>
              ))}
            </div>
          )}
          <p className="text-xs text-slate-500">
            {isDemo
              ? 'Dữ liệu mẫu gắn theo component — không cần danh mục thật'
              : 'Lấy danh mục và sản phẩm từ database thật'}
          </p>

          {/* Real data controls */}
          {!isDemo && (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                onClick={onAutoGenerate}
                className="gap-2"
                size="sm"
                disabled={!autoGenerateReady || autoGenerateLoading}
              >
                <Bot size={14} /> {autoGenerateLoading ? 'Đang tải...' : 'Sinh từ dữ liệu thật'}
              </Button>
              <label className="ml-auto inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500">
                <input
                  type="checkbox"
                  checked={Boolean(hideEmptyCategories)}
                  onChange={(e) => setHideEmptyCategories(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-slate-300"
                />
                Ẩn mục trống
              </label>
            </div>
          )}

          {/* Demo data controls */}
          {isDemo && onLoadDemo && (
            <Button type="button" variant="outline" size="sm" className="gap-2" onClick={onLoadDemo}>
              <Bot size={14} /> Tải mẫu mặc định
            </Button>
          )}

          {/* Demo categories CRUD */}
          {isDemo && setDemoCategoriesData && (
            <div className="space-y-2 rounded-xl border border-amber-200 bg-amber-50/50 p-3">
              <div className="flex items-center justify-between gap-2">
                <Label className="text-xs text-amber-700">Danh mục demo ({resolvedCategoriesData.length})</Label>
                <div className="flex gap-1.5">
                  <Button
                    type="button" variant="outline" size="sm" className="h-7 gap-1 text-xs"
                    onClick={() => {
                      setDemoCategoriesData(DEMO_CATEGORIES_DATA);
                    }}
                  >
                    <Bot size={11} /> Mẫu mặc định
                  </Button>
                  <AiDemoProductCategoriesImport
                    onApply={(items) => setDemoCategoriesData(items.map((item) => ({
                      _id: item.id,
                      image: item.image,
                      name: item.name,
                    })))}
                  />
                  <Button
                    type="button" variant="outline" size="sm" className="h-7 gap-1 text-xs"
                    onClick={() => {
                      const newId = `demo-custom-${Date.now()}`;
                      setDemoCategoriesData(prev => [...prev, { _id: newId, name: '' }]);
                    }}
                  >
                    <Plus size={12} /> Thêm
                  </Button>
                </div>
              </div>
              <div className="space-y-1.5 max-h-[400px] overflow-y-auto">
                {resolvedCategoriesData.map((cat, index) => (
                  <div key={cat._id} className="flex items-center gap-2 rounded-lg border border-amber-200 bg-white p-2">
                    <span className="w-5 h-5 flex items-center justify-center bg-amber-500 text-white text-[10px] rounded-full font-medium shrink-0">
                      {index + 1}
                    </span>
                    {cat.image ? (
                      <img src={cat.image} alt="" className="w-8 h-8 rounded object-cover shrink-0 border border-slate-200" />
                    ) : (
                      <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center shrink-0 border border-dashed border-slate-200">
                        <ImagePlus size={12} className="text-slate-400" />
                      </div>
                    )}
                    <ClearableInput
                      value={cat.name}
                      onChange={(v) => setDemoCategoriesData(prev => prev.map(c => c._id === cat._id ? { ...c, name: v } : c))}
                      placeholder="Tên danh mục *"
                      className="h-8 flex-1 text-xs min-w-0"
                    />
                    <ClearableInput
                      value={cat.image ?? ''}
                      onChange={(v) => setDemoCategoriesData(prev => prev.map(c => c._id === cat._id ? { ...c, image: v || undefined } : c))}
                      placeholder="URL ảnh"
                      className="h-8 w-40 text-xs shrink-0"
                    />
                    <Button
                      type="button" variant="ghost" size="icon"
                      className="h-7 w-7 shrink-0 text-slate-400 hover:text-red-500"
                      onClick={() => setDemoCategoriesData(prev => prev.filter(c => c._id !== cat._id))}
                    >
                      <Trash2 size={13} />
                    </Button>
                  </div>
                ))}
              </div>
              {resolvedCategoriesData.length === 0 && (
                <p className="py-4 text-center text-xs text-slate-500">Chưa có danh mục demo. Nhấn "Thêm" hoặc "Mẫu mặc định".</p>
              )}
            </div>
          )}

          {/* Summary stats */}
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
              <p className="text-[11px] text-slate-400">Danh mục</p>
              <p className="text-lg font-semibold text-slate-900">{categoryItems.length}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
              <p className="text-[11px] text-slate-400">Nhóm</p>
              <p className="text-lg font-semibold text-slate-900">{totalGroups}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
              <p className="text-[11px] text-slate-400">Link</p>
              <p className="text-lg font-semibold text-slate-900">{totalLinks}</p>
            </div>
          </div>
        </SubSection>

        {/* ── Banner hero + Hiển thị danh mục ─────── */}
        <SubSection icon={Image} title="Banner & hiển thị" defaultOpen={defaultExpanded}>
          <MultiImageUploader<HomepageCategoryHeroSlide>
            items={heroSlides}
            onChange={setHeroSlides}
            folder="homepage-category-hero"
            imageKey="url"
            extraFields={[{ key: 'link', placeholder: 'URL liên kết (tuỳ chọn)', type: 'url' }]}
            minItems={1}
            maxItems={6}
            aspectRatio="banner"
            columns={1}
            showReorder={true}
            addButtonText="Thêm banner"
            emptyText="Chưa có banner hero"
          />
          <p className="text-xs text-slate-500">Ưu tiên 1-3 banner chính.</p>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_200px] pt-2 border-t border-slate-100">
            <div className="space-y-2">
              <Label className="text-sm">Chế độ hiển thị</Label>
              <div className="flex flex-wrap gap-2">
                <Button type="button" size="sm" variant={categoryVisualMode === 'image' ? 'default' : 'outline'} onClick={() => setCategoryVisualMode('image')}>Ảnh</Button>
                <Button type="button" size="sm" variant={categoryVisualMode === 'icon' ? 'default' : 'outline'} onClick={() => setCategoryVisualMode('icon')}>Icon</Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Kích thước avatar</Label>
              <select value={categoryImageSize} onChange={(e) => setCategoryImageSize(e.target.value as HomepageCategoryHeroCategoryImageSize)} className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm">
                {avatarSizeOptions.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Hình dạng avatar</Label>
              <select value={categoryImageShape} onChange={(e) => setCategoryImageShape(e.target.value as HomepageCategoryHeroCategoryImageShape)} className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm">
                {avatarShapeOptions.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {/* Tùy chọn bố cục */}
          {(setNoBorderRadius || setNoVerticalMargin) && (
            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 border-t border-slate-100">
              {setNoBorderRadius && (
                <label className="inline-flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={Boolean(noBorderRadius)}
                    onChange={(e) => setNoBorderRadius(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-slate-300"
                  />
                  Bỏ bo góc
                </label>
              )}
              {setNoVerticalMargin && (
                <label className="inline-flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={Boolean(noVerticalMargin)}
                    onChange={(e) => setNoVerticalMargin(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-slate-300"
                  />
                  Bỏ margin trên/dưới
                </label>
              )}
            </div>
          )}

          {/* Chế độ ảnh banner */}
          {setBannerImageFit && (
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <Label className="text-sm shrink-0">Ảnh banner</Label>
              <div className="flex gap-1.5">
                <Button type="button" size="sm" variant={bannerImageFit === 'cover' ? 'default' : 'outline'} onClick={() => setBannerImageFit('cover')} className="h-7 text-xs px-3">Cover (cắt vừa)</Button>
                <Button type="button" size="sm" variant={bannerImageFit === 'contain' ? 'default' : 'outline'} onClick={() => setBannerImageFit('contain')} className="h-7 text-xs px-3">Contain (hiện đủ)</Button>
              </div>
            </div>
          )}
        </SubSection>

        {/* ── Menu danh mục ────────────────────────── */}
        <SubSection icon={Layers2} title={`Menu danh mục (${categoryItems.length})`} defaultOpen={defaultExpanded}>
          <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 lg:self-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={toggleAllCategories}
              disabled={categoryItems.length === 0}
            >
              {allExpanded ? 'Thu gọn tất cả' : 'Mở tất cả'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addCategory}
              disabled={resolvedCategoriesData.length === 0}
              className="gap-2"
            >
              <Plus size={14} /> Thêm danh mục
            </Button>
          </div>
          </div>
          {duplicateCategoryIds.size > 0 && (
            <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>Có {duplicateCategoryIds.size} danh mục bị trùng. Mỗi danh mục chỉ nên xuất hiện một lần.</div>
                <button type="button" className="font-medium underline underline-offset-4" onClick={handleRemoveDuplicates}>
                  Xóa trùng
                </button>
              </div>
            </div>
          )}

          {resolvedCategoriesData.length === 0 ? (
            <p className="py-4 text-center text-sm text-slate-500">Chưa có danh mục sản phẩm.</p>
          ) : categoryItems.length === 0 ? (
            <p className="py-4 text-center text-sm text-slate-500">Chưa có menu. Nhấn “Sinh ngay” để lấy từ dữ liệu thực hoặc thêm thủ công.</p>
          ) : (
            <div className="space-y-4">
              {categoryItems.map((item, idx) => {
                const groups = item.groups ?? [];
                const isDuplicate = duplicateCategoryIds.has(item.categoryId);
                const isExpanded = expandedCategoryIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={cn(
                      'rounded-2xl border p-4 shadow-sm',
                      isDuplicate ? 'border-amber-300 bg-amber-50/70' : 'border-slate-200 bg-white'
                    )}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <button
                        type="button"
                        onClick={() => toggleCategory(item.id)}
                        className="flex min-w-0 flex-1 items-center gap-2 text-left"
                      >
                        <GripVertical size={16} className="shrink-0 text-slate-400" />
                        <div className="min-w-0 flex-1">
                          <Label className="text-sm font-medium text-slate-900">Danh mục {idx + 1}</Label>
                          <p className="text-xs text-slate-500">{groups.length} nhóm • {groups.reduce((sum, group) => sum + (group.items?.length ?? 0), 0)} link</p>
                        </div>
                        <ChevronDown className={cn('h-4 w-4 shrink-0 text-slate-400 transition-transform', isExpanded ? 'rotate-180' : '')} />
                      </button>
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => removeCategory(item.id)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 grid gap-4 xl:grid-cols-[260px_minmax(0,1fr)]">
                        <div className="space-y-2">
                          <Label className="text-xs text-slate-500">Danh mục gốc</Label>
                          <select
                            value={item.categoryId}
                            onChange={(e) => updateCategory(item.id, { categoryId: e.target.value })}
                            className={cn(
                              'h-10 w-full rounded-md border bg-white px-3 text-sm',
                              isDuplicate ? 'border-amber-400' : 'border-slate-200'
                            )}
                          >
                            <option value="">-- Chọn danh mục --</option>
                            {resolvedCategoriesData.map((cat) => (
                              <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                          </select>
                          {isDuplicate && <p className="text-xs text-amber-700">Danh mục này đang bị trùng.</p>}
                          <div className="mt-3 flex items-center gap-2">
                            <button
                              type="button"
                              className={cn(
                                'relative w-10 h-10 rounded-lg border overflow-hidden shrink-0 group/catimg transition-colors',
                                item.imageOverride ? 'border-blue-300 bg-blue-50' : 'border-dashed border-slate-200 bg-slate-50',
                              )}
                              title="Sửa ảnh đại diện"
                              onClick={() => toggleImageEdit(`cat-${item.id}`)}
                            >
                              {item.imageOverride ? (
                                <img src={item.imageOverride} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <ImagePlus size={14} className="absolute inset-0 m-auto text-slate-300" />
                              )}
                            </button>
                            <ClearableInput
                              value={item.imageOverride ?? ''}
                              onChange={(v) => updateCategory(item.id, { imageOverride: v || undefined })}
                              placeholder="URL ảnh đại diện"
                              className="h-9 text-xs flex-1"
                            />
                          </div>
                          {categoryVisualMode === 'icon' && (
                            <div className="mt-4 space-y-2">
                              <Label className="text-xs text-slate-500">Chọn icon</Label>
                              <ClearableInput
                                value={iconSearch[item.id] ?? ''}
                                onChange={(v) => setIconSearch((prev) => ({ ...prev, [item.id]: v }))}
                                placeholder="Tìm icon..."
                                className="h-9"
                              />
                              <div className="grid grid-cols-6 gap-2 rounded-xl border border-slate-200 bg-white p-2 sm:grid-cols-8">
                                {HOMEPAGE_CATEGORY_HERO_ICON_OPTIONS.filter((option) => {
                                  const search = (iconSearch[item.id] ?? '').trim().toLowerCase();
                                  if (!search) {return true;}
                                  return option.label.toLowerCase().includes(search) || option.name.toLowerCase().includes(search);
                                }).map((option) => {
                                  const isSelected = option.name === item.iconName;
                                  const Icon = option.Icon;
                                  return (
                                    <button
                                      key={option.name}
                                      type="button"
                                      title={option.label}
                                      onClick={() => updateCategory(item.id, { iconName: option.name })}
                                      className={cn(
                                        'flex h-9 w-9 items-center justify-center rounded-lg border text-slate-600 transition-colors',
                                        isSelected
                                          ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                                      )}
                                    >
                                      <Icon className="h-4 w-4" />
                                    </button>
                                  );
                                })}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                {item.iconName ? (
                                  <>
                                    {(() => {
                                      const Icon = getHomepageCategoryHeroIcon(item.iconName);
                                      return Icon ? <Icon className="h-4 w-4 text-slate-600" /> : null;
                                    })()}
                                    <span>Đang chọn: {item.iconName}</span>
                                  </>
                                ) : (
                                  <span>Chưa chọn icon.</span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-3 rounded-xl bg-slate-50 p-3">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <Label className="text-xs text-slate-500">Nhóm menu con</Label>
                            <Button type="button" variant="outline" size="sm" onClick={() => addGroup(item.id)} className="gap-2">
                              <Plus size={14} /> Thêm nhóm
                            </Button>
                          </div>

                          {groups.length === 0 ? (
                            <p className="rounded-lg border border-dashed border-slate-200 bg-white px-3 py-6 text-center text-xs text-slate-500">
                              Chưa có nhóm con.
                            </p>
                          ) : (
                            <div className="grid gap-3 xl:grid-cols-2">
                              {groups.map((group) => (
                                <div key={group.id} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                                  <div className="flex items-center justify-between gap-2">
                                    <Label className="text-xs text-slate-500">Nhóm #{group.id}</Label>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 text-red-500"
                                      onClick={() => removeGroup(item.id, group.id)}
                                    >
                                      <Trash2 size={14} />
                                    </Button>
                                  </div>
                                  <ClearableInput
                                    value={group.title}
                                    onChange={(v) => updateGroup(item.id, group.id, { title: v })}
                                    placeholder="Tiêu đề nhóm"
                                    className="mt-2 h-9"
                                  />
                                  <div className="mt-3 space-y-2">
                                    {(group.items ?? []).map((link) => (
                                      <div key={link.id} className="space-y-1">
                                        <div className="flex items-center gap-1.5">
                                          {/* Thumbnail — click toggle edit URL */}
                                          <button
                                            type="button"
                                            className={cn(
                                              'relative w-7 h-7 rounded border overflow-hidden shrink-0 transition-colors',
                                              link.image ? 'border-blue-300 bg-blue-50' : 'border-dashed border-slate-200 bg-slate-50',
                                              editingImageKeys.has(`link-${item.id}-${group.id}-${link.id}`) && 'ring-2 ring-blue-400',
                                            )}
                                            title="Sửa ảnh"
                                            onClick={() => toggleImageEdit(`link-${item.id}-${group.id}-${link.id}`)}
                                          >
                                            {link.image ? (
                                              <img src={link.image} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                              <ImagePlus size={12} className="absolute inset-0 m-auto text-slate-300" />
                                            )}
                                          </button>
                                          {/* Select danh mục hoặc badge product */}
                                          {link.targetType === 'product' || link.productId ? (
                                            <span className="h-7 flex items-center gap-1 rounded border border-dashed border-slate-200 bg-slate-50 px-2 text-[11px] text-slate-500 truncate min-w-0 flex-1">
                                              {link.label || link.slug || 'Sản phẩm'}
                                              <span className="ml-auto rounded-full bg-slate-200 px-1.5 py-px text-[9px]">SP</span>
                                            </span>
                                          ) : (
                                            <select
                                              value={link.categoryId}
                                              onChange={(e) => updateGroupItem(item.id, group.id, link.id, { targetType: 'category', categoryId: e.target.value })}
                                              className="h-7 flex-1 min-w-0 rounded border border-slate-200 bg-white px-2 text-[11px]"
                                            >
                                              <option value="">-- Danh mục --</option>
                                              {resolvedCategoriesData.map((cat) => (
                                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                                              ))}
                                            </select>
                                          )}
                                          {/* Label override */}
                                          <ClearableInput
                                            value={link.label ?? ''}
                                            onChange={(v) => updateGroupItem(item.id, group.id, link.id, { label: v || undefined })}
                                            placeholder="Label"
                                            className="h-7 w-24 text-[11px] shrink-0"
                                          />
                                          <Button
                                            type="button" variant="ghost" size="icon"
                                            className="h-6 w-6 shrink-0 text-slate-400 hover:text-red-500"
                                            onClick={() => removeGroupItem(item.id, group.id, link.id)}
                                          >
                                            <Trash2 size={12} />
                                          </Button>
                                        </div>
                                        {/* Inline URL ảnh editor */}
                                        {editingImageKeys.has(`link-${item.id}-${group.id}-${link.id}`) && (
                                          <div className="flex items-center gap-1.5 pl-[34px]">
                                            <ImagePlus size={11} className="text-slate-400 shrink-0" />
                                            <ClearableInput
                                              value={link.image ?? ''}
                                              onChange={(v) => updateGroupItem(item.id, group.id, link.id, { image: v || undefined })}
                                              placeholder="Dán URL ảnh sản phẩm"
                                              className="h-6 text-[11px] flex-1"
                                              autoFocus
                                            />
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                    <Button type="button" variant="outline" size="sm" onClick={() => addGroupItem(item.id, group.id)} className="gap-2">
                                      <Plus size={14} /> Thêm link
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <p className="text-xs text-slate-500">Giữ mỗi danh mục 2-4 nhóm để menu ngắn gọn.</p>
        </SubSection>
      </CardContent>
    </Card>
  );
}
