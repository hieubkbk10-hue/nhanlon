import React, { useState } from 'react';
import { Bot, GripVertical, Package, Plus, Trash2 } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, cn } from '../../../components/ui';
import { SettingsImageUploader } from '../../../components/SettingsImageUploader';
import { DEFAULT_DEMO_CATEGORY_PRODUCTS_SECTIONS } from '../_lib/constants';
import type {
  CategoryProductsSelectionMode,
  CategoryProductsSection,
  DemoCategoryProduct,
  DemoCategoryProductsSection,
} from '../_types';
import { AiDemoCategoryProductsImport } from '../../product-list/_components/AiDemoProductsImport';

interface CategoryProductsFormProps {
  sections: CategoryProductsSection[];
  setSections: (sections: CategoryProductsSection[]) => void;
  columnsDesktop: number;
  setColumnsDesktop: (value: number) => void;
  columnsMobile: number;
  setColumnsMobile: (value: number) => void;
  showViewAll: boolean;
  setShowViewAll: (value: boolean) => void;
  categoriesData: { _id: string; name: string }[];
  selectionMode: CategoryProductsSelectionMode;
  setSelectionMode: (value: CategoryProductsSelectionMode) => void;
  demoSections: DemoCategoryProductsSection[];
  setDemoSections: React.Dispatch<React.SetStateAction<DemoCategoryProductsSection[]>>;
}

export const CategoryProductsForm = ({
  sections,
  setSections,
  columnsDesktop,
  setColumnsDesktop,
  columnsMobile,
  setColumnsMobile,
  showViewAll,
  setShowViewAll,
  categoriesData,
  selectionMode,
  setSelectionMode,
  demoSections,
  setDemoSections,
}: CategoryProductsFormProps) => {
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);

  const addSection = () => {
    if (!categoriesData || categoriesData.length === 0) {return;}
    const newId = Math.max(0, ...sections.map(s => s.id)) + 1;
    setSections([...sections, { categoryId: '', id: newId, itemCount: 4 }]);
  };

  const removeSection = (id: number) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const updateSection = (id: number, updates: Partial<CategoryProductsSection>) => {
    setSections(sections.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const loadDefaultDemo = () => {
    const now = Date.now();
    setDemoSections(DEFAULT_DEMO_CATEGORY_PRODUCTS_SECTIONS.map((section, sectionIndex) => ({
      ...section,
      id: `demo-section-${now + sectionIndex}`,
      products: section.products.map((product, productIndex) => ({
        ...product,
        id: `demo-product-${now + sectionIndex}-${productIndex}`,
      })),
    })));
  };

  const addDemoSection = () => {
    setDemoSections(prev => [
      ...prev,
      {
        categoryImage: '',
        categoryName: '',
        id: `demo-section-${Date.now()}`,
        products: [],
      },
    ]);
  };

  const updateDemoSection = (id: string, patch: Partial<DemoCategoryProductsSection>) => {
    setDemoSections(prev => prev.map(section => section.id === id ? { ...section, ...patch } : section));
  };

  const removeDemoSection = (id: string) => {
    setDemoSections(prev => prev.filter(section => section.id !== id));
  };

  const addDemoProduct = (sectionId: string) => {
    setDemoSections(prev => prev.map(section => section.id === sectionId ? {
      ...section,
      products: [
        ...section.products,
        { id: `demo-product-${Date.now()}`, image: '', name: '', price: 0 },
      ],
    } : section));
  };

  const updateDemoProduct = (sectionId: string, productId: string, patch: Partial<DemoCategoryProduct>) => {
    setDemoSections(prev => prev.map(section => section.id === sectionId ? {
      ...section,
      products: section.products.map(product => product.id === productId ? { ...product, ...patch } : product),
    } : section));
  };

  const removeDemoProduct = (sectionId: string, productId: string) => {
    setDemoSections(prev => prev.map(section => section.id === sectionId ? {
      ...section,
      products: section.products.filter(product => product.id !== productId),
    } : section));
  };

  const handleDragStart = (id: number) => {
    setDraggedId(id);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  const handleDragOver = (e: React.DragEvent, id: number) => {
    e.preventDefault();
    if (draggedId !== id) {
      setDragOverId(id);
    }
  };

  const handleDrop = (e: React.DragEvent, targetId: number) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) {return;}

    const newSections = [...sections];
    const draggedIndex = newSections.findIndex(s => s.id === draggedId);
    const targetIndex = newSections.findIndex(s => s.id === targetId);

    const [draggedItem] = newSections.splice(draggedIndex, 1);
    newSections.splice(targetIndex, 0, draggedItem);

    setSections(newSections);
    setDraggedId(null);
    setDragOverId(null);
  };

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Cấu hình hiển thị</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Số cột (Desktop)</Label>
              <select
                value={columnsDesktop}
                onChange={(e) =>{  setColumnsDesktop(Number.parseInt(e.target.value)); }}
                className="w-full h-9 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm"
              >
                <option value={3}>3 cột</option>
                <option value={4}>4 cột</option>
                <option value={5}>5 cột</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Số cột (Mobile)</Label>
              <select
                value={columnsMobile}
                onChange={(e) =>{  setColumnsMobile(Number.parseInt(e.target.value)); }}
                className="w-full h-9 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm"
              >
                <option value={1}>1 cột</option>
                <option value={2}>2 cột</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="showViewAll"
              checked={showViewAll}
              onChange={(e) =>{  setShowViewAll(e.target.checked); }}
              className="w-4 h-4 rounded border-slate-300"
            />
            <Label htmlFor="showViewAll" className="cursor-pointer">Hiển thị nút “Xem danh mục”</Label>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">
            {selectionMode === 'demo' ? `Dữ liệu demo (${demoSections.length})` : `Các section danh mục (${sections.length})`}
          </CardTitle>
          <div className="flex items-center gap-2">
            {selectionMode === 'demo' && (
              <>
                <Button type="button" variant="outline" size="sm" onClick={loadDefaultDemo} className="gap-2">
                  <Bot size={14} /> Mẫu mặc định
                </Button>
                <AiDemoCategoryProductsImport buttonClassName="h-9" onApply={setDemoSections} />
              </>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={selectionMode === 'demo' ? addDemoSection : addSection}
              disabled={selectionMode === 'real' ? sections.length >= 6 || categoriesData.length === 0 : demoSections.length >= 6}
              className="gap-2"
            >
              <Plus size={14} /> Thêm
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nguồn dữ liệu</Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelectionMode('real')}
                className={cn('flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all', selectionMode === 'real' ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'border-slate-200 hover:border-slate-300 dark:border-slate-700')}
              >
                Dữ liệu thật
              </button>
              <button
                type="button"
                onClick={() => setSelectionMode('demo')}
                className={cn('flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all', selectionMode === 'demo' ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'border-slate-200 hover:border-slate-300 dark:border-slate-700')}
              >
                Dữ liệu demo
              </button>
            </div>
            <p className="text-xs text-slate-500">
              {selectionMode === 'real' ? 'Chọn danh mục và sản phẩm thật trong hệ thống.' : 'Tự nhập danh mục, ảnh và sản phẩm mẫu cho component.'}
            </p>
          </div>

          {selectionMode === 'real' ? (
            <>
              {categoriesData.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">
                  Chưa có danh mục sản phẩm. Vui lòng tạo danh mục trước.
                </p>
              ) : (sections.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">
                  Chưa có section nào. Nhấn &quot;Thêm&quot; để bắt đầu.
                </p>
              ) : (
                sections.map((item, idx) => (
              <div 
                key={item.id} 
                draggable
                onDragStart={() =>{  handleDragStart(item.id); }}
                onDragEnd={handleDragEnd}
                onDragOver={(e) =>{  handleDragOver(e, item.id); }}
                onDrop={(e) =>{  handleDrop(e, item.id); }}
                className={cn(
                  'p-4 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-3 transition-all',
                  draggedId === item.id && 'opacity-50 scale-[0.98]',
                  dragOverId === item.id && 'ring-2 ring-blue-500 ring-offset-2'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical size={16} className="text-slate-400 cursor-grab active:cursor-grabbing" />
                    <Label className="font-semibold">Section {idx + 1}</Label>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-500 h-8 w-8" 
                    onClick={() =>{  removeSection(item.id); }}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-500">Danh mục</Label>
                    <select
                      value={item.categoryId}
                      onChange={(e) =>{  updateSection(item.id, { categoryId: e.target.value }); }}
                      className="w-full h-9 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm"
                    >
                      <option value="">-- Chọn danh mục --</option>
                      {categoriesData.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-slate-500">Số sản phẩm hiển thị</Label>
                    <Input
                      type="number"
                      min={2}
                      max={12}
                      value={item.itemCount}
                      onChange={(e) =>{  updateSection(item.id, { itemCount: Number.parseInt(e.target.value) || 4 }); }}
                    />
                  </div>
                </div>
              </div>
                ))
              ))}

              <p className="text-xs text-slate-500">
                Tối đa 6 section. Mỗi section là 1 danh mục với các sản phẩm thuộc danh mục đó.
              </p>
            </>
          ) : (
            <div className="space-y-4">
              {demoSections.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">
                  Chưa có dữ liệu demo. Nhấn &quot;Mẫu mặc định&quot; hoặc &quot;Thêm&quot; để bắt đầu.
                </p>
              ) : (
                demoSections.map((section, sectionIndex) => (
                  <div key={section.id} className="rounded-lg border border-slate-200 bg-white p-4 space-y-4 dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Package size={16} className="text-amber-500" />
                        <Label className="font-semibold">Danh mục demo {sectionIndex + 1}</Label>
                      </div>
                      <Button type="button" variant="ghost" size="icon" className="text-red-500 h-8 w-8" onClick={() => removeDemoSection(section.id)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-xs text-slate-500">Tên danh mục</Label>
                        <Input value={section.categoryName} onChange={(e) => updateDemoSection(section.id, { categoryName: e.target.value })} placeholder="Ví dụ: Điện thoại nổi bật" />
                      </div>
                      <div className="space-y-2">
                        <SettingsImageUploader
                          label="Ảnh danh mục"
                          value={section.categoryImage ?? ''}
                          onChange={(url) => updateDemoSection(section.id, { categoryImage: url ?? '' })}
                          folder="home-components/category-products"
                          naming={{ entityName: section.categoryName || 'demo-category', field: 'category-image', index: sectionIndex + 1 }}
                          previewSize="sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Sản phẩm ({section.products.length})</Label>
                        <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => addDemoProduct(section.id)}>
                          <Plus size={13} /> Thêm sản phẩm
                        </Button>
                      </div>

                      {section.products.length === 0 ? (
                        <p className="rounded-lg bg-slate-50 py-4 text-center text-sm text-slate-500 dark:bg-slate-800">
                          Chưa có sản phẩm demo.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {section.products.map((product, productIndex) => (
                            <div key={product.id} className="grid gap-2 rounded-lg bg-slate-50 p-3 dark:bg-slate-800 md:grid-cols-[180px,1fr,120px,120px,auto] md:items-start">
                              <SettingsImageUploader
                                label="Ảnh sản phẩm"
                                value={product.image ?? ''}
                                onChange={(url) => updateDemoProduct(section.id, product.id, { image: url ?? '', storageId: undefined })}
                                folder="home-components/category-products"
                                naming={{ entityName: product.name || 'demo-product', field: 'product-image', index: productIndex + 1 }}
                                previewSize="sm"
                              />
                              <Input value={product.name} onChange={(e) => updateDemoProduct(section.id, product.id, { name: e.target.value })} placeholder="Tên sản phẩm" className="h-8 text-xs" />
                              <Input type="number" value={product.price ?? 0} onChange={(e) => updateDemoProduct(section.id, product.id, { price: Number.parseInt(e.target.value) || 0 })} placeholder="Giá" className="h-8 text-xs" />
                              <Input type="number" value={product.salePrice ?? ''} onChange={(e) => updateDemoProduct(section.id, product.id, { salePrice: Number.parseInt(e.target.value) || undefined })} placeholder="Giá sale" className="h-8 text-xs" />
                              <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500" onClick={() => removeDemoProduct(section.id, product.id)}>
                                <Trash2 size={13} />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              <p className="text-xs text-slate-500">
                Tối đa 6 danh mục demo. Ảnh danh mục và sản phẩm có thể upload, kéo thả, dán clipboard hoặc nhập URL.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};
