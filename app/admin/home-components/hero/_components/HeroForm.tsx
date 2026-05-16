'use client';

import React from 'react';
import { ToggleSwitch } from '@/components/modules/shared';
import { Card, CardContent, CardHeader, CardTitle, Input, Label } from '../../../components/ui';
import { MultiImageUploader } from '../../../components/MultiImageUploader';
import type { HeroContent, HeroSlide, HeroStyle } from '../_types';
import { AiDemoHeroImport } from '../../product-list/_components/AiDemoProductsImport';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

export const HeroForm = ({
  heroSlides,
  setHeroSlides,
  heroStyle,
  heroContent,
  setHeroContent,
  noBorderRadius,
  setNoBorderRadius,
}: {
  heroSlides: HeroSlide[];
  setHeroSlides: (slides: HeroSlide[]) => void;
  heroStyle: HeroStyle;
  heroContent: HeroContent;
  setHeroContent: (content: HeroContent) => void;
  noBorderRadius?: boolean;
  setNoBorderRadius?: (value: boolean) => void;
}) => (
  <>
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Danh sách Banner (Slider)</CardTitle>
        <AiDemoHeroImport onApply={(items) => setHeroSlides(items as HeroSlide[])} />
      </CardHeader>
      <CardContent>
        <MultiImageUploader<HeroSlide>
          items={heroSlides}
          onChange={setHeroSlides}
          folder="hero-banners"
          imageKey="url"
          extraFields={[{ key: 'link', placeholder: 'URL liên kết (khi click vào banner)', type: 'url' }]}
          minItems={1}
          maxItems={10}
          aspectRatio="banner"
          columns={1}
          showReorder={true}
          addButtonText="Thêm Banner"
          emptyText="Chưa có banner nào"
          allowVideoUrl
        />
        {setNoBorderRadius ? (
          <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
            <label className="inline-flex cursor-pointer select-none items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <input
                type="checkbox"
                checked={Boolean(noBorderRadius)}
                onChange={(event) => setNoBorderRadius(event.target.checked)}
                className="h-3.5 w-3.5 rounded border-slate-300"
              />
              Bỏ bo góc ảnh banner
            </label>
          </div>
        ) : null}
      </CardContent>
    </Card>

    {['fullscreen', 'split', 'parallax'].includes(heroStyle) && (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Nội dung Hero ({heroStyle})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {heroStyle === 'fullscreen' && (
            <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2">
              <div className="space-y-0.5">
                <Label className="text-sm">Hiển thị nội dung Hero</Label>
                <p className="text-xs text-slate-500">Tắt để ẩn chữ và lớp mờ trên ảnh</p>
              </div>
              <ToggleSwitch
                enabled={heroContent.showFullscreenContent !== false}
                onChange={() =>
                  setHeroContent({
                    ...heroContent,
                    showFullscreenContent: !(heroContent.showFullscreenContent !== false),
                  })
                }
              />
            </div>
          )}
          {(heroStyle === 'fullscreen' || heroStyle === 'parallax') && (
            <div className="flex items-center gap-4 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2">
              <Label className="text-sm shrink-0">Backdrop</Label>
              <input
                type="range"
                min={0}
                max={100}
                value={heroContent.overlayOpacity ?? 50}
                onChange={(e) => setHeroContent({ ...heroContent, overlayOpacity: Number(e.target.value) })}
                className="flex-1 h-1.5 accent-blue-500 cursor-pointer"
              />
              <span className="text-xs text-slate-500 tabular-nums w-8 text-right">{heroContent.overlayOpacity ?? 50}%</span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Badge / Nhãn</Label>
              <Input 
                value={heroContent.badge} 
                onChange={(e) =>{  setHeroContent({ ...heroContent, badge: e.target.value }); }}
                placeholder="VD: Nổi bật, Hot, Mới..."
              />
            </div>
            <div className="space-y-2">
              <Label>Màu highlight</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={heroContent.highlightColor || '#ef4444'}
                  onChange={(e) => setHeroContent({ ...heroContent, highlightColor: e.target.value })}
                  className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer p-0.5"
                />
                <Input
                  value={heroContent.highlightColor || '#ef4444'}
                  onChange={(e) => setHeroContent({ ...heroContent, highlightColor: e.target.value })}
                  placeholder="#ef4444"
                  className="flex-1 text-sm font-mono"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2">
            <Label className="text-sm shrink-0">Căn chỉnh</Label>
            <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              {(['left', 'center', 'right'] as const).map((align) => {
                const Icon = align === 'left' ? AlignLeft : align === 'center' ? AlignCenter : AlignRight;
                const isActive = (heroContent.textAlign || 'left') === align;
                return (
                  <button
                    key={align}
                    type="button"
                    onClick={() => setHeroContent({ ...heroContent, textAlign: align })}
                    className={`px-3 py-1.5 transition-colors ${isActive ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                  >
                    <Icon size={16} />
                  </button>
                );
              })}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Tiêu đề chính</Label>
              <span className="text-[11px] text-slate-400">Dùng <code className="px-1 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-blue-600 dark:text-blue-400">{'{text}'}</code> để tô màu · Enter để xuống dòng</span>
            </div>
            <textarea 
              value={heroContent.heading} 
              onChange={(e) =>{  setHeroContent({ ...heroContent, heading: e.target.value }); }}
              placeholder={"VD: Nhanh Chóng - An Toàn\nCùng Bean {Cargo}"}
              rows={2}
              className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label>Mô tả</Label>
            <textarea 
              value={heroContent.description} 
              onChange={(e) =>{  setHeroContent({ ...heroContent, description: e.target.value }); }}
              placeholder="Mô tả ngắn gọn..."
              className="w-full min-h-[60px] rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nút chính</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={heroContent.primaryButtonColor || '#000000'}
                  onChange={(e) => setHeroContent({ ...heroContent, primaryButtonColor: e.target.value })}
                  className="w-9 h-9 shrink-0 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer p-0.5"
                  title="Màu nút chính"
                />
                <Input 
                  value={heroContent.primaryButtonText} 
                  onChange={(e) =>{  setHeroContent({ ...heroContent, primaryButtonText: e.target.value }); }}
                  placeholder="VD: Khám phá ngay, Mua ngay..."
                />
              </div>
            </div>
            {heroStyle === 'fullscreen' && (
              <div className="space-y-2">
                <Label>Nút phụ</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={heroContent.secondaryButtonColor || '#ffffff'}
                    onChange={(e) => setHeroContent({ ...heroContent, secondaryButtonColor: e.target.value })}
                    className="w-9 h-9 shrink-0 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer p-0.5"
                    title="Màu nút phụ"
                  />
                  <Input 
                    value={heroContent.secondaryButtonText} 
                    onChange={(e) =>{  setHeroContent({ ...heroContent, secondaryButtonText: e.target.value }); }}
                    placeholder="VD: Tìm hiểu thêm..."
                  />
                </div>
              </div>
            )}
            {heroStyle === 'parallax' && (
              <div className="space-y-2">
                <Label>Text đếm ngược / Phụ</Label>
                <Input 
                  value={heroContent.countdownText} 
                  onChange={(e) =>{  setHeroContent({ ...heroContent, countdownText: e.target.value }); }}
                  placeholder="VD: Còn 3 ngày, Chỉ hôm nay..."
                />
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Liên kết nút chính</Label>
              <Input 
                value={heroContent.primaryButtonLink} 
                onChange={(e) =>{  setHeroContent({ ...heroContent, primaryButtonLink: e.target.value }); }}
                placeholder="/contact hoặc https://..."
              />
            </div>
            {heroStyle === 'fullscreen' && (
              <div className="space-y-2">
                <Label>Liên kết nút phụ</Label>
                <Input 
                  value={heroContent.secondaryButtonLink} 
                  onChange={(e) =>{  setHeroContent({ ...heroContent, secondaryButtonLink: e.target.value }); }}
                  placeholder="/pricing hoặc https://..."
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )}
  </>
);
