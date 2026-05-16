'use client';

import React from 'react';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  cn,
} from '../../../components/ui';
import { SettingsImageUploader } from '@/app/admin/components/SettingsImageUploader';
import { IconPopoverPicker } from '../../_shared/components/IconPopoverPicker';
import {
  CONTACT_ICON_OPTIONS,
  } from '../../contact/_lib/iconOptions';
import type { BenefitItem, BenefitsEditorState } from '../_types';
import { AiDemoBenefitsImport } from '../../product-list/_components/AiDemoProductsImport';

interface BenefitsFormProps {
  state: BenefitsEditorState;
  onChange: (updater: (prev: BenefitsEditorState) => BenefitsEditorState) => void;
  mode: 'single' | 'dual';
}

const MIN_ITEMS = 1;
const MAX_ITEMS = 5;

const createItem = (seed: number): BenefitItem => ({
  description: '',
  icon: 'check',
  id: `benefit-${seed}`,
  title: '',
});

const normalizeBenefitsIconValue = (value?: string) => {
  const trimmed = (value ?? '').trim();
  if (!trimmed) {return 'check';}

  const legacyMap: Record<string, string> = {
    Check: 'check',
    Shield: 'shield',
    Star: 'star',
    Target: 'target',
    Trophy: 'trophy',
    Zap: 'zap',
  };

  if (legacyMap[trimmed]) {return legacyMap[trimmed];}

  const hasUppercase = /[A-Z]/.test(trimmed);
  if (hasUppercase) {
    return trimmed
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/\s+/g, '-')
      .toLowerCase();
  }

  return trimmed;
};

export function BenefitsForm({ state, onChange, mode: _mode }: BenefitsFormProps) {
  const [draggedId, setDraggedId] = React.useState<string | null>(null);
  const [dragOverId, setDragOverId] = React.useState<string | null>(null);


  const addItem = () => {
    onChange((prev) => {
      if (prev.items.length >= MAX_ITEMS) {return prev;}
      return {
        ...prev,
        items: [...prev.items, createItem(Date.now())],
      };
    });
  };

  const removeItem = (id: string) => {
    onChange((prev) => {
      if (prev.items.length <= MIN_ITEMS) {return prev;}
      return {
        ...prev,
        items: prev.items.filter((item) => item.id !== id),
      };
    });
  };

  const updateItem = (id: string, patch: Partial<BenefitItem>) => {
    onChange((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  };

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  const handleDragOver = (event: React.DragEvent, id: string) => {
    event.preventDefault();
    if (draggedId !== id) {
      setDragOverId(id);
    }
  };

  const handleDrop = (event: React.DragEvent, targetId: string) => {
    event.preventDefault();
    if (!draggedId || draggedId === targetId) {return;}

    onChange((prev) => {
      const next = [...prev.items];
      const draggedIndex = next.findIndex((item) => item.id === draggedId);
      const targetIndex = next.findIndex((item) => item.id === targetId);
      if (draggedIndex < 0 || targetIndex < 0) {return prev;}

      const [moved] = next.splice(draggedIndex, 1);
      next.splice(targetIndex, 0, moved);

      return {
        ...prev,
        items: next,
      };
    });

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Ảnh minh họa (tùy chọn)</Label>
              <SettingsImageUploader
                value={state.visualImage}
                onChange={(url) => {
                  onChange((prev) => ({ ...prev, visualImage: url ?? '' }));
                }}
                folder="home-components"
                label="Ảnh dùng cho layout 3, 4, 5"
                previewSize="sm"
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Item nổi bật</Label>
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: MAX_ITEMS }, (_, idx) => {
                    const selected = state.highlightIndex === idx;
                    const disabled = idx >= state.items.length;
                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={disabled}
                        onClick={() => {
                          onChange((prev) => ({ ...prev, highlightIndex: idx }));
                        }}
                        className={cn(
                          'h-9 rounded-md border text-xs transition-colors',
                          selected
                            ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300'
                            : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300',
                          disabled && 'cursor-not-allowed opacity-40',
                        )}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                  <div>
                    <p className="text-sm font-medium">Hiện số thứ tự</p>
                    <p className="text-xs text-slate-500">Dùng cho layout 1, 3, 6</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={state.showItemNumbers}
                    onClick={() => {
                      onChange((prev) => ({ ...prev, showItemNumbers: !prev.showItemNumbers }));
                    }}
                    className={cn(
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      state.showItemNumbers ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700',
                    )}
                  >
                    <span
                      className={cn(
                        'inline-block h-5 w-5 transform rounded-full bg-white transition-transform',
                        state.showItemNumbers ? 'translate-x-5' : 'translate-x-1',
                      )}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                  <div>
                    <p className="text-sm font-medium">Hiện trang trí nền</p>
                    <p className="text-xs text-slate-500">Arrow, line, shape minh họa</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={state.showDecorativeVisuals}
                    onClick={() => {
                      onChange((prev) => ({ ...prev, showDecorativeVisuals: !prev.showDecorativeVisuals }));
                    }}
                    className={cn(
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      state.showDecorativeVisuals ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700',
                    )}
                  >
                    <span
                      className={cn(
                        'inline-block h-5 w-5 transform rounded-full bg-white transition-transform',
                        state.showDecorativeVisuals ? 'translate-x-5' : 'translate-x-1',
                      )}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {state.style === '5' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <Label>Nút CTA (tùy chọn)</Label>
                <Input
                  placeholder="Tìm hiểu thêm"
                  value={state.buttonText}
                  onChange={(event) => {
                    const next = event.target.value;
                    onChange((prev) => ({ ...prev, buttonText: next }));
                  }}
                />
              </div>

              <div>
                <Label>Link nút CTA</Label>
                <Input
                  placeholder="/lien-he"
                  value={state.buttonLink}
                  onChange={(event) => {
                    const next = event.target.value;
                    onChange((prev) => ({ ...prev, buttonLink: next }));
                  }}
                />
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">
            Lợi ích ({state.items.length}/{MAX_ITEMS})
          </CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addItem}
            disabled={state.items.length >= MAX_ITEMS}
            className="gap-2"
          >
            <Plus size={14} /> Thêm
          </Button>
          <div onClick={(e) => e.stopPropagation()}>
            <AiDemoBenefitsImport onApply={(items) => {
              onChange((prev) => ({ ...prev, items: items as BenefitItem[] }));
            }} />
          </div>
        </CardHeader>

        <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-start">
          {state.items.map((item, idx) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => { handleDragStart(item.id); }}
              onDragEnd={handleDragEnd}
              onDragOver={(event) => { handleDragOver(event, item.id); }}
              onDrop={(event) => { handleDrop(event, item.id); }}
              className={cn(
                'p-4 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-3 transition-all cursor-grab active:cursor-grabbing',
                draggedId === item.id && 'opacity-50 scale-[0.98]',
                dragOverId === item.id && 'ring-2 ring-blue-500 ring-offset-2',
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical size={16} className="text-slate-400" />
                  <Label className="font-medium">Lợi ích {idx + 1}</Label>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-red-500 h-8 w-8"
                  onClick={() => { removeItem(item.id); }}
                  disabled={state.items.length <= MIN_ITEMS}
                >
                  <Trash2 size={14} />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-1">
                  <Label className="text-xs text-slate-500">Icon Lucide</Label>
                  <IconPopoverPicker
                    value={normalizeBenefitsIconValue(item.icon)}
                    onChange={(nextValue) => updateItem(item.id, { icon: nextValue })}
                    options={CONTACT_ICON_OPTIONS}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label className="text-xs text-slate-500">Tiêu đề lợi ích</Label>
                  <Input
                    placeholder="Tiêu đề lợi ích"
                    value={item.title}
                    onChange={(event) => { updateItem(item.id, { title: event.target.value }); }}
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs text-slate-500">Nội dung benefit</Label>
                <Input
                  placeholder="Nội dung benefit (max 150 ký tự)"
                  value={item.description}
                  maxLength={150}
                  onChange={(event) => { updateItem(item.id, { description: event.target.value }); }}
                />
                <p className="text-xs text-slate-400 text-right mt-1">{item.description.length}/150</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
