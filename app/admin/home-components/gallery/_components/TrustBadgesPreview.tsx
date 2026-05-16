'use client';

import React, { useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Image as ImageIcon, Maximize2, Plus, Shield, ZoomIn } from 'lucide-react';
import { cn } from '../../../components/ui';
import { BrowserFrame } from '../../_shared/components/BrowserFrame';
import { ColorInfoPanel } from '../../_shared/components/ColorInfoPanel';
import { PreviewImage } from '../../_shared/components/PreviewImage';
import { PreviewWrapper } from '../../_shared/components/PreviewWrapper';
import { SectionHeader } from '../../_shared/components/SectionHeader';
import { deviceWidths, usePreviewDevice } from '../../_shared/hooks/usePreviewDevice';
import { getPreviewDeviceClass } from '../../_shared/lib/previewResponsive';
import type { TrustBadgesStyle } from '../_types';
import { getGalleryColorTokens } from '../_lib/colors';

// Best Practices: Grayscale-to-color hover, lightbox/zoom indicator, verification links, alt text accessibility
interface TrustBadgeItem { id: number; url: string; link: string; name?: string }
export interface TrustBadgesConfig { heading?: string; subHeading?: string; badgeText?: string; showTitle?: boolean; showSubtitle?: boolean; showBadge?: boolean; headerAlign?: 'left' | 'center' | 'right'; titleColorPrimary?: boolean; subtitleAboveTitle?: boolean; uppercaseText?: boolean; hideHeader?: boolean }

export const TrustBadgesPreview = ({ 
  items, 
  brandColor, 
  secondary,
  mode,
  selectedStyle, 
  onStyleChange,
  desktopColumns = 4,
  config,
  fontStyle,
  fontClassName,
}: { 
  items: TrustBadgeItem[]; 
  brandColor: string;
  secondary: string; 
  mode: 'single' | 'dual';
  selectedStyle?: TrustBadgesStyle; 
  onStyleChange?: (style: TrustBadgesStyle) => void;
  desktopColumns?: 3 | 4;
  config?: TrustBadgesConfig;
  fontStyle?: React.CSSProperties;
  fontClassName?: string;
}) => {
  const { device, setDevice } = usePreviewDevice();
  const [carouselIndex, setCarouselIndex] = useState(0);
  const colors = getGalleryColorTokens({ primary: brandColor, secondary, mode });
  const previewStyle = selectedStyle ?? 'cards';
  const setPreviewStyle = (s: string) => onStyleChange?.(s as TrustBadgesStyle);
  const normalizedDesktopColumns = desktopColumns === 3 ? 3 : 4;
  const desktopGridClassName = normalizedDesktopColumns === 3 ? 'grid-cols-3' : 'grid-cols-4';
  const desktopCardGridClassName = normalizedDesktopColumns === 3 ? 'grid-cols-3' : 'grid-cols-4';
  const responsiveGridClassName = getPreviewDeviceClass(device, {
    mobile: normalizedDesktopColumns === 3 ? 'grid-cols-1' : 'grid-cols-2',
    tablet: normalizedDesktopColumns === 3 ? 'grid-cols-3' : 'grid-cols-2',
    desktop: desktopGridClassName,
  });
  const responsiveCardGridClassName = getPreviewDeviceClass(device, {
    mobile: normalizedDesktopColumns === 3 ? 'grid-cols-1' : 'grid-cols-2',
    tablet: normalizedDesktopColumns === 3 ? 'grid-cols-3' : 'grid-cols-2',
    desktop: desktopCardGridClassName,
  });
  const _titleClassName = getPreviewDeviceClass(device, {
    mobile: 'text-xl',
    tablet: 'text-2xl',
    desktop: 'text-3xl',
  });

  const styles = [
    { id: 'grid', label: 'Grid' }, 
    { id: 'cards', label: 'Cards' }, 
    { id: 'stack', label: 'Stack' },
    { id: 'wall', label: 'Wall' },
    { id: 'carousel', label: 'Carousel' },
    { id: 'seal', label: 'Seal' }
  ];

  // Max visible  // Max visible items pattern
  const MAX_VISIBLE = device === 'mobile' ? 4 : 8;
  const visibleItems = items.slice(0, MAX_VISIBLE);
  const remainingCount = items.length - MAX_VISIBLE;

  // Empty State Component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: colors.placeholderBg }}>
        <Shield size={36} style={{ color: colors.placeholderIcon }} />
      </div>
      <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Chưa có chứng nhận</h3>
      <p className="text-sm text-slate-500 max-w-xs">Thêm chứng nhận, giải thưởng hoặc badge để tăng độ tin cậy</p>
    </div>
  );

  // Shared SectionHeader
  const sharedHeader = (
    <SectionHeader
      title={config?.heading ?? 'Chứng nhận & Giải thưởng'}
      subtitle={config?.subHeading ?? 'Được công nhận bởi các tổ chức uy tín'}
      badgeText={config?.badgeText}
      hideHeader={config?.hideHeader}
      showTitle={config?.showTitle ?? true}
      showSubtitle={config?.showSubtitle ?? true}
      showBadge={config?.showBadge ?? false}
      headerAlign={config?.headerAlign ?? 'center'}
      titleColorPrimary={config?.titleColorPrimary}
      subtitleAboveTitle={config?.subtitleAboveTitle}
      uppercaseText={config?.uppercaseText}
      brandColor={brandColor}
    />
  );

  // +N More Items Badge
  const MoreItemsBadge = ({ count }: { count: number }) => count > 0 ? (
    <div className="flex items-center justify-center py-4 mt-4">
      <span className="text-sm font-medium px-4 py-2 rounded-full" style={{ backgroundColor: colors.badgeBg, color: colors.badgeText }}>
        +{count} chứng nhận khác
      </span>
    </div>
  ) : null;

  // Style 1: Clean trust grid
  const renderGridStyle = () => (
    <section className={cn("w-full bg-white dark:bg-slate-950", device === 'mobile' ? 'py-8 px-3' : 'py-14 px-6')}>
      <div className="container max-w-7xl mx-auto">
        {sharedHeader}
        {items.length === 0 ? <EmptyState /> : (
          <>
            <div className={cn(
              "grid gap-3 md:gap-4",
              responsiveGridClassName
            )}>
              {visibleItems.map((item) => (
                <div 
                  key={item.id} 
                  className="group relative aspect-[4/3] rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
                  style={{ 
                    border: `1px solid ${colors.neutralBorder}`,
                    backgroundColor: colors.neutralSurface,
                    boxShadow: '0 16px 40px rgba(15, 23, 42, 0.06)',
                    padding: device === 'mobile' ? '14px' : '18px'
                  }}
                >
                  {item.url ? (
                    <PreviewImage src={item.url} className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.03]" alt={item.name ?? 'Chứng nhận'} />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: colors.accentSurface }}>
                      <Shield size={device === 'mobile' ? 26 : 30} style={{ color: colors.subheading }} />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.badgeBg }}>
                      <Maximize2 size={14} style={{ color: colors.badgeText }} />
                    </div>
                  </div>
                  {item.name && (
                    <div className="absolute bottom-2 left-2 right-2 text-center">
                      <span className="block truncate rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold text-slate-600 shadow-sm dark:bg-slate-900/90 dark:text-slate-300">{item.name}</span>
                    </div>
                  )}
                </div>
              ))}
              {remainingCount > 0 && (
                <div 
                  className="aspect-[4/3] rounded-2xl flex flex-col items-center justify-center cursor-pointer"
                  style={{ backgroundColor: colors.accentSurface, border: `1px dashed ${colors.accentBorder}` }}
                >
                  <Plus size={28} style={{ color: colors.subheading }} className="mb-1" />
                  <span className="text-lg font-bold" style={{ color: colors.subheading }}>+{remainingCount}</span>
                  <span className="text-[10px]" style={{ color: colors.mutedText }}>xem thêm</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );

  // Style 2: SaaS proof cards
  const renderCardsStyle = () => {
    const cardItems = items.slice(0, device === 'mobile' ? 2 : (device === 'tablet' ? 4 : normalizedDesktopColumns));
    const cardRemaining = items.length - cardItems.length;
    return (
      <section className={cn("w-full bg-slate-50 dark:bg-slate-950", device === 'mobile' ? 'py-8 px-3' : 'py-14 px-6')}>
        <div className="container max-w-7xl mx-auto">
          {sharedHeader}
          {items.length === 0 ? <EmptyState /> : (
            <>
              <div className={cn(
                "grid gap-4 md:gap-5",
                responsiveCardGridClassName
              )}>
                {cardItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="group relative flex flex-col rounded-3xl overflow-hidden cursor-pointer h-full transition-all duration-300 hover:-translate-y-1"
                    style={{ border: `1px solid ${colors.neutralBorder}`, backgroundColor: colors.neutralSurface, boxShadow: '0 18px 45px rgba(15, 23, 42, 0.08)' }}
                  >
                    <div className={cn("flex items-center justify-center relative overflow-hidden", device === 'mobile' ? 'aspect-[4/3] p-6' : 'aspect-[4/3] p-7')} style={{ backgroundColor: colors.neutralBackground }}>
                      {item.url ? (
                        <PreviewImage src={item.url} className="w-full h-full object-contain transition-transform duration-500 z-10 group-hover:scale-[1.04]" alt={item.name ?? 'Chứng nhận'} />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl" style={{ backgroundColor: colors.accentSurface }}>
                          <Shield size={34} style={{ color: colors.subheading }} />
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                        <span className="px-4 py-2 rounded-full font-medium flex items-center gap-2 text-sm" style={{ color: colors.subheading, backgroundColor: colors.neutralSurface, border: `1px solid ${colors.sectionAccentBar}` }}>
                          <ZoomIn size={16} /> Xem chi tiết
                        </span>
                      </div>
                    </div>
                    <div className={cn("border-t flex items-center justify-between transition-colors", device === 'mobile' ? 'py-3 px-4 min-h-[48px]' : 'py-4 px-5')} style={{ borderColor: colors.neutralBorder, backgroundColor: colors.neutralSurface }}>
                      <span className="font-semibold truncate text-sm" style={{ color: colors.subheading }}>
                        {item.name ?? 'Chứng nhận'}
                      </span>
                      <ArrowUpRight size={16} className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: colors.subheading }} />
                    </div>
                  </div>
                ))}
              </div>
              <MoreItemsBadge count={cardRemaining} />
            </>
          )}
        </div>
      </section>
    );
  };

  // Style 3: Stack - trust proof strips with a strong SaaS rhythm
  const renderStackStyle = () => {
    const stackItems = items.slice(0, device === 'mobile' ? 3 : 3);
    const stackRemaining = items.length - stackItems.length;
    return (
      <section className={cn("w-full overflow-hidden bg-slate-50 dark:bg-slate-950", device === 'mobile' ? 'py-10 px-3' : 'py-14 px-6')}>
        <div className="container max-w-7xl mx-auto">
          {sharedHeader}
          {items.length === 0 ? <EmptyState /> : (
            <div className={cn("grid items-start", device === 'mobile' ? 'grid-cols-1 gap-4' : 'grid-cols-[0.92fr_1.5fr] gap-6')}>
              <div className="rounded-2xl border bg-white p-5 shadow-sm dark:bg-slate-900 md:p-6" style={{ borderColor: colors.neutralBorder, boxShadow: '0 18px 45px rgba(15, 23, 42, 0.06)' }}>
                <div className="mb-6">
                  <p className="text-base font-bold" style={{ color: colors.heading }}>Bộ tín hiệu tin cậy</p>
                  <p className="mt-2 text-xs leading-5" style={{ color: colors.mutedText }}>Hiển thị rõ cam kết trước khi khách ra quyết định.</p>
                </div>
                <div className="space-y-3">
                  {stackItems.map((item, index) => {
                    const active = index === 0;
                    return (
                    <div
                      key={item.id}
                      className="flex min-h-14 items-center gap-4 rounded-lg border bg-white px-4 py-3 transition-all duration-300 dark:bg-slate-900"
                      style={{
                        borderColor: active ? colors.sectionAccentBar : colors.neutralBorder,
                        boxShadow: active ? `0 12px 28px ${colors.sectionAccentBar}18` : '0 8px 20px rgba(15, 23, 42, 0.04)',
                      }}
                    >
                      <span className="w-5 shrink-0 text-sm font-semibold" style={{ color: active ? colors.sectionAccentBar : colors.subheading }}>{index + 1}</span>
                      <span className="min-w-0 flex-1 truncate text-sm font-extrabold uppercase tracking-tight" style={{ color: colors.heading }}>{item.name ?? `Chứng nhận ${index + 1}`}</span>
                      <ArrowUpRight size={17} style={{ color: active ? colors.sectionAccentBar : colors.mutedText }} />
                    </div>
                    );
                  })}
                </div>
              </div>
              <div className={cn("grid gap-4", device === 'mobile' ? 'grid-cols-1' : 'grid-cols-3')}>
                {stackItems.map((item) => (
                  <div key={item.id} className="group overflow-hidden rounded-xl border bg-white p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 dark:bg-slate-900" style={{ borderColor: colors.neutralBorder, boxShadow: '0 18px 45px rgba(15, 23, 42, 0.07)' }}>
                    <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg" style={{ backgroundColor: colors.neutralBackground }}>
                      {item.url ? (
                        <PreviewImage src={item.url} className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]" alt={item.name ?? 'Chứng nhận'} />
                      ) : (
                        <Shield size={40} style={{ color: colors.subheading }} />
                      )}
                    </div>
                    <p className="mt-5 truncate text-sm font-extrabold uppercase tracking-tight" style={{ color: colors.heading }}>{item.name ?? 'Chứng nhận'}</p>
                    <div className="mx-auto mt-3 h-0.5 w-8 rounded-full" style={{ backgroundColor: colors.sectionAccentBar }} />
                  </div>
                ))}
              </div>
              {stackRemaining > 0 && <MoreItemsBadge count={stackRemaining} />}
            </div>
          )}
        </div>
      </section>
    );
  };

  // Style 4: Framed Wall - Certificate frames hanging on wall
  const renderWallStyle = () => {
    const wallItems = items.slice(0, device === 'mobile' ? 4 : 6);
    const wallRemaining = items.length - wallItems.length;
    return (
      <section className={cn("w-full", device === 'mobile' ? 'py-10 px-3' : 'py-12 px-6')} style={{ backgroundColor: colors.neutralBackground }}>
        <div className="container max-w-7xl mx-auto">
          {sharedHeader}
          {items.length === 0 ? <EmptyState /> : (
            <>
              <div className={cn(
                "grid gap-4 md:gap-5",
                responsiveGridClassName
              )}>
                {wallItems.map((item) => (
                  <div 
                    key={item.id} 
                    className={cn(
                      "group relative w-full rounded-2xl flex flex-col cursor-pointer transition-all duration-300 hover:-translate-y-0.5",
                      device === 'mobile' ? 'min-h-[170px] p-2' : 'min-h-[210px] p-3'
                    )}
                    style={{ border: `1px solid ${colors.neutralBorder}`, backgroundColor: colors.neutralSurface, boxShadow: '0 16px 40px rgba(15, 23, 42, 0.06)' }}
                  >
                    <div className="mb-3 h-1.5 w-10 rounded-full" style={{ backgroundColor: colors.sectionAccentBar }} />
                    <div className="flex-1 flex items-center justify-center rounded-xl p-3 relative overflow-hidden" style={{ backgroundColor: colors.neutralBackground, border: `1px solid ${colors.neutralBorder}` }}>
                      {item.url ? (
                        <PreviewImage src={item.url} className="w-full h-full object-contain" alt={item.name ?? 'Chứng nhận'} />
                      ) : (
                        <Shield size={28} className="text-slate-300" />
                      )}
                    </div>
                    <div className={cn("flex items-center justify-center", device === 'mobile' ? 'h-7 mt-1' : 'h-8 mt-1')}>
                      <span className={cn("font-semibold text-center truncate px-1", device === 'mobile' ? 'text-[10px]' : 'text-xs')} style={{ color: colors.subheading }}>
                        {item.name ? (item.name.length > 18 ? item.name.slice(0, 16) + '...' : item.name) : 'Certificate'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <MoreItemsBadge count={wallRemaining} />
            </>
          )}
        </div>
      </section>
    );
  };

  // Style 5: Carousel - Horizontal scroll với navigation arrows
  const renderCarouselStyle = () => {
    const itemsPerView = device === 'mobile'
      ? (normalizedDesktopColumns === 3 ? 1 : 2)
      : (device === 'tablet' ? (normalizedDesktopColumns === 3 ? 3 : 2) : normalizedDesktopColumns);
    const maxIndex = Math.max(0, items.length - itemsPerView);
    return (
      <section className={cn("w-full bg-white dark:bg-slate-900", device === 'mobile' ? 'py-8 px-3' : 'py-12 px-6')}>
        <div className="container max-w-7xl mx-auto">
          {sharedHeader}
          {items.length === 0 ? <EmptyState /> : (
            <div className="relative">
              {items.length > itemsPerView && (
                <>
                  <button
                    onClick={() =>{  setCarouselIndex(Math.max(0, carouselIndex - 1)); }}
                    disabled={carouselIndex === 0}
                    className={cn("absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors", carouselIndex === 0 ? 'opacity-40 cursor-not-allowed' : '')}
                    style={{ border: `1px solid ${colors.sectionAccentBar}`, left: device === 'mobile' ? '-4px' : '-16px', backgroundColor: colors.neutralSurface }}
                  >
                    <ChevronLeft size={20} style={{ color: colors.heading }} />
                  </button>
                  <button
                    onClick={() =>{  setCarouselIndex(Math.min(maxIndex, carouselIndex + 1)); }}
                    disabled={carouselIndex >= maxIndex}
                    className={cn("absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors", carouselIndex >= maxIndex ? 'opacity-40 cursor-not-allowed' : '')}
                    style={{ border: `1px solid ${colors.sectionAccentBar}`, right: device === 'mobile' ? '-4px' : '-16px', backgroundColor: colors.neutralSurface }}
                  >
                    <ChevronRight size={20} style={{ color: colors.heading }} />
                  </button>
                </>
              )}
              <div className={cn("overflow-hidden", device === 'mobile' ? 'mx-2' : 'mx-6')}>
                <div className="flex transition-transform duration-300 ease-out gap-4" style={{ transform: `translateX(-${carouselIndex * (100 / itemsPerView)}%)` }}>
                  {items.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex-shrink-0 group cursor-pointer"
                      style={{ width: `calc(${100 / itemsPerView}% - ${(itemsPerView - 1) * 16 / itemsPerView}px)` }}
                    >
                      <div 
                        className="aspect-[4/3] rounded-2xl flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5"
                        style={{ backgroundColor: colors.neutralBackground, border: `1px solid ${colors.neutralBorder}`, padding: device === 'mobile' ? '12px' : '16px' }}
                      >
                        {item.url ? (
                          <PreviewImage src={item.url} className="w-full h-full object-contain transition-transform duration-300" alt={item.name ?? 'Chứng nhận'} />
                        ) : (
                          <Shield size={32} className="text-slate-300" />
                        )}
                      </div>
                      {item.name && (
                        <p className="text-center text-xs font-medium text-slate-500 mt-2 truncate px-1">{item.name}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {items.length > itemsPerView && (
                <div className="flex justify-center gap-2 mt-6">
                  {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                    <button key={idx} onClick={() =>{  setCarouselIndex(idx); }} className={cn("h-2 rounded-full transition-all", carouselIndex === idx ? 'w-6' : 'w-2')} style={{ backgroundColor: carouselIndex === idx ? colors.subheading : colors.neutralBorder }} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    );
  };

  // Style 6: Seal - circular verification hub with satellite badges
  const renderSealStyle = () => {
    const sealItems = items.slice(0, 3);
    const sealRemaining = items.length - sealItems.length;
    return (
      <section className={cn("relative w-full overflow-hidden bg-slate-50 dark:bg-slate-950", device === 'mobile' ? 'py-10 px-3' : 'py-16 px-6')}>
        <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-white/70 blur-2xl dark:bg-slate-900/70" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-white/70 blur-2xl dark:bg-slate-900/70" />
        <div className="container max-w-7xl mx-auto">
          {sharedHeader}
          {items.length === 0 ? <EmptyState /> : (
            <div className={cn("relative grid items-center", device === 'mobile' ? 'grid-cols-1 gap-6' : 'grid-cols-[0.9fr_1.15fr] gap-10')}>
              <div className="relative mx-auto flex aspect-square w-full max-w-[380px] items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-dashed opacity-60" style={{ borderColor: colors.neutralBorder }} />
                <div className="absolute inset-8 rounded-full border border-dashed opacity-80" style={{ borderColor: colors.neutralBorder }} />
                <div className="absolute inset-20 rounded-full border" style={{ borderColor: colors.sectionAccentBar }} />
                <span className="absolute left-5 top-1/2 h-2 w-2 rounded-full" style={{ backgroundColor: colors.sectionAccentBar }} />
                <span className="absolute right-8 top-1/4 h-2 w-2 rounded-full" style={{ backgroundColor: colors.sectionAccentBar }} />
                <span className="absolute bottom-16 right-14 h-2 w-2 rounded-full" style={{ backgroundColor: colors.sectionAccentBar }} />
                <div className="relative z-10 flex h-44 w-44 flex-col items-center justify-center rounded-full border bg-white text-center shadow-xl dark:bg-slate-900" style={{ borderColor: colors.sectionAccentBar }}>
                  <Shield size={34} style={{ color: colors.heading }} />
                  <span className="mt-4 text-xs font-bold uppercase tracking-[0.32em]" style={{ color: colors.mutedText }}>Verified</span>
                  <div className="mt-3 h-0.5 w-8 rounded-full" style={{ backgroundColor: colors.sectionAccentBar }} />
                  <span className="mt-3 text-5xl font-black leading-none" style={{ color: colors.heading }}>{sealItems.length}</span>
                </div>
                {sealItems.map((item, index) => {
                  const positions = [
                    'left-1/2 top-0 -translate-x-1/2',
                    'right-0 top-[36%]',
                    'bottom-2 left-[62%] -translate-x-1/2',
                  ];
                  return (
                    <div key={item.id} className={cn("absolute z-20 flex h-20 w-20 items-center justify-center rounded-2xl border bg-white p-2 shadow-lg dark:bg-slate-900", positions[index])} style={{ borderColor: colors.neutralBorder }}>
                      {item.url ? (
                        <PreviewImage src={item.url} className="h-full w-full object-contain" alt={item.name ?? 'Chứng nhận'} />
                      ) : (
                        <Shield size={28} style={{ color: colors.subheading }} />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="grid gap-4">
                {sealItems.map((item, index) => (
                  <div key={item.id} className="group flex min-h-24 items-center gap-4 rounded-2xl border bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-x-1 dark:bg-slate-900" style={{ borderColor: colors.neutralBorder, boxShadow: '0 18px 45px rgba(15, 23, 42, 0.06)' }}>
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg" style={{ backgroundColor: colors.neutralBackground }}>
                      {item.url ? (
                        <PreviewImage src={item.url} className="h-full w-full object-contain" alt={item.name ?? 'Chứng nhận'} />
                      ) : (
                        <Shield size={26} style={{ color: colors.subheading }} />
                      )}
                    </div>
                    <div className="h-12 w-px shrink-0" style={{ backgroundColor: colors.neutralBorder }} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-extrabold uppercase tracking-tight" style={{ color: colors.heading }}>{item.name ?? 'Chứng nhận'}</p>
                      <p className="text-xs" style={{ color: colors.mutedText }}>Tín hiệu #{index + 1} trong bộ chứng nhận</p>
                    </div>
                    <ArrowUpRight size={18} style={{ color: colors.heading }} />
                  </div>
                ))}
                <MoreItemsBadge count={sealRemaining} />
              </div>
            </div>
          )}
        </div>
      </section>
    );
  };

  // Image Guidelines Component
  const renderImageGuidelines = () => (
    <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
      <div className="flex items-start gap-2">
        <ImageIcon size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-slate-600 dark:text-slate-400">
          {previewStyle === 'grid' && (
            <p><strong>300×300px</strong> (1:1) • Ảnh vuông, nền trong suốt PNG.</p>
          )}
          {previewStyle === 'cards' && (
            <p><strong>400×320px</strong> (5:4) • Ảnh chứng nhận rõ ràng.</p>
          )}
          {previewStyle === 'stack' && (
            <p><strong>240×160px</strong> (3:2) • Badge/logo rõ nét, layout trust stack SaaS.</p>
          )}
          {previewStyle === 'wall' && (
            <p><strong>250×300px</strong> (5:6) • Khung ảnh dọc như bằng khen treo tường.</p>
          )}
          {previewStyle === 'carousel' && (
            <p><strong>280×280px</strong> (1:1) • Grid vuông, navigation arrows, responsive.</p>
          )}
          {previewStyle === 'seal' && (
            <p><strong>240×240px</strong> (1:1) • Logo/chứng nhận gọn trong hub xác thực.</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <PreviewWrapper 
        title="Preview Chứng nhận" 
        device={device} 
        setDevice={setDevice} 
        previewStyle={previewStyle} 
        setPreviewStyle={setPreviewStyle} 
        styles={styles} 
        info={`${items.length} chứng nhận • ${mode === 'dual' ? '2 màu' : '1 màu'}`}
        deviceWidthClass={deviceWidths[device]}
        fontStyle={fontStyle}
        fontClassName={fontClassName}
      >
        <BrowserFrame>
          {previewStyle === 'grid' && renderGridStyle()}
          {previewStyle === 'cards' && renderCardsStyle()}
          {previewStyle === 'stack' && renderStackStyle()}
          {previewStyle === 'wall' && renderWallStyle()}
          {previewStyle === 'carousel' && renderCarouselStyle()}
          {previewStyle === 'seal' && renderSealStyle()}
        </BrowserFrame>
      </PreviewWrapper>
      {mode === 'dual' ? <ColorInfoPanel brandColor={brandColor} secondary={secondary} /> : null}
      {renderImageGuidelines()}
    </>
  );
};

