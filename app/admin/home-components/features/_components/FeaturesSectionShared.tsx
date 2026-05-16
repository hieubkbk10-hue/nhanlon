'use client';

import React from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, icons, Plus, Zap } from 'lucide-react';
import { cn } from '@/app/admin/components/ui';
import { SectionHeader } from '../../_shared/components/SectionHeader';
import useEmblaCarousel from 'embla-carousel-react';
import type { FeatureItem, FeaturesBrandMode, FeaturesStyle } from '../_types';
import { getFeaturesColorTokens } from '../_lib/colors';

const resolveDevice = (device?: 'mobile' | 'tablet' | 'desktop') => device ?? 'desktop';

const normalizeItems = (items: FeatureItem[]): FeatureItem[] => {
  if (!Array.isArray(items)) {return [];}
  return items
    .map((item, index) => {
      const source = item as Partial<FeatureItem> | null;
      if (!source || typeof source !== 'object') {return null;}
      return {
        id: typeof source.id === 'number' ? source.id : index + 1,
        icon: typeof source.icon === 'string' && source.icon.trim().length > 0 ? source.icon : 'Zap',
        title: typeof source.title === 'string' ? source.title : '',
        description: typeof source.description === 'string' ? source.description : '',
        ...(typeof source.image === 'string' ? { image: source.image } : {}),
      };
    })
    .filter((item): item is FeatureItem => item !== null);
};

const getItemKey = (item: FeatureItem, idx: number) => {
  const normalizedTitle = item.title.trim().toLowerCase();
  const normalizedDescription = item.description.trim().toLowerCase();
  const normalizedIcon = (item.icon ?? '').toLowerCase();
  return item.id || `${normalizedIcon}-${normalizedTitle}-${normalizedDescription}-${idx}`;
};

interface FeaturesSectionSharedProps {
  items: FeatureItem[];
  style: FeaturesStyle;
  title?: string;
  brandColor: string;
  secondary: string;
  mode: FeaturesBrandMode;
  context: 'preview' | 'site';
  device?: 'mobile' | 'tablet' | 'desktop';
  className?: string;
  skipHeader?: boolean;
  showIcons?: boolean;
  hideHeader?: boolean;
  showTitle?: boolean;
  subtitle?: string;
  showSubtitle?: boolean;
  headerAlign?: 'left' | 'center' | 'right';
  titleColorPrimary?: boolean;
  subtitleAboveTitle?: boolean;
  uppercaseText?: boolean;
  showBadge?: boolean;
  badgeText?: string;
}

export function FeaturesSectionShared({
  items,
  style,
  title,
  brandColor,
  secondary,
  mode,
  context,
  device,
  className,
  skipHeader = false,
  showIcons = true,
  hideHeader,
  showTitle,
  subtitle,
  showSubtitle,
  headerAlign,
  titleColorPrimary,
  subtitleAboveTitle,
  uppercaseText,
  showBadge,
  badgeText,
}: FeaturesSectionSharedProps) {
  const normalizedItems = React.useMemo(() => normalizeItems(items), [items]);
  const previewDevice = resolveDevice(device);

  const colors = React.useMemo(() => getFeaturesColorTokens({
    primary: brandColor,
    secondary,
    mode,
  }), [brandColor, secondary, mode]);

  const sectionTitle = title?.trim() || 'Tính năng nổi bật';

  const getIcon = React.useCallback((iconName?: string) => icons[iconName as keyof typeof icons] || Zap, []);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
  });
  
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  React.useEffect(() => {
    if (!emblaApi) {return;}
    const updateScrollButtons = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };
    emblaApi.on('reInit', updateScrollButtons);
    emblaApi.on('select', updateScrollButtons);
    updateScrollButtons();
  }, [emblaApi]);

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
        style={{ backgroundColor: colors.badgeBackground, color: colors.badgeText }}
      >
        <Zap size={28} />
      </div>
      <h3 className="font-semibold mb-1" style={{ color: colors.body }}>Chưa có tính năng nào</h3>
      <p className="text-sm" style={{ color: colors.muted }}>Thêm tính năng đầu tiên để bắt đầu</p>
    </div>
  );

  const isPreview = context === 'preview';
  const isMobile = previewDevice === 'mobile';
  const isTablet = previewDevice === 'tablet';

  const renderSharedHeader = () => {
    if (skipHeader) {return null;}
    return (
      <SectionHeader
        title={sectionTitle}
        subtitle={subtitle}
        badgeText={badgeText}
        hideHeader={hideHeader}
        showTitle={showTitle}
        showSubtitle={showSubtitle}
        showBadge={showBadge}
        headerAlign={headerAlign}
        titleColorPrimary={titleColorPrimary}
        subtitleAboveTitle={subtitleAboveTitle}
        uppercaseText={uppercaseText}
        brandColor={brandColor}
      />
    );
  };

  const renderIconGridStyle = () => {
    if (normalizedItems.length === 0) {return renderEmptyState();}

    const maxVisible = isPreview ? (isMobile ? 4 : 6) : 6;
    const visibleItems = normalizedItems.slice(0, maxVisible);
    const remainingCount = normalizedItems.length - maxVisible;

    const gridClass = cn(
      'grid gap-4 md:gap-6',
      visibleItems.length === 1 ? 'max-w-md mx-auto' : '',
      visibleItems.length === 2 ? 'max-w-2xl mx-auto grid-cols-1 sm:grid-cols-2' : '',
      visibleItems.length >= 3
        ? (isPreview
          ? (isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-2' : 'grid-cols-3')
          : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3')
        : '',
    );

    return (
      <div className={cn('py-8 px-4', isPreview && (isMobile ? 'py-6 px-3' : 'md:py-12 md:px-6'))}>
        {!skipHeader && (
          <div className="text-center mb-8 md:mb-12">
            {renderSharedHeader()}
          </div>
        )}

        <div className={gridClass}>
          {visibleItems.map((item, idx) => {
            const IconComponent = getIcon(item.icon);
            return (
              <div
                key={getItemKey(item, idx)}
                className="bg-white rounded-2xl p-6 border transition-colors flex flex-col h-full"
                style={{
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.cardBorder,
                }}
              >
                {showIcons ? (
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: colors.iconChipBackground, color: colors.iconChipText }}
                  >
                    <IconComponent size={24} strokeWidth={2} />
                  </div>
                ) : null}
                <h3 className="font-bold text-lg mb-2 line-clamp-1" style={{ color: colors.body }}>
                  {item.title || 'Tên tính năng'}
                </h3>
                <p className="text-sm leading-relaxed line-clamp-2 min-h-[2.5rem]" style={{ color: colors.muted }}>
                  {item.description || 'Mô tả tính năng...'}
                </p>
              </div>
            );
          })}

          {remainingCount > 0 && (
            <div
              className="flex items-center justify-center rounded-2xl aspect-square border-2 border-dashed"
              style={{ borderColor: colors.neutralBorder, backgroundColor: colors.badgeBackground }}
            >
              <div className="text-center" style={{ color: colors.muted }}>
                <Plus size={30} className="mx-auto mb-2" />
                <span className="text-lg font-bold">+{remainingCount}</span>
                <p className="text-xs">tính năng khác</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAlternatingStyle = () => {
    if (normalizedItems.length === 0) {return renderEmptyState();}

    const maxItems = isPreview ? (isMobile ? 4 : 6) : 6;
    const visibleItems = normalizedItems.slice(0, maxItems);
    const remainingCount = normalizedItems.length - maxItems;

    return (
      <div className={cn('py-6 px-4', isPreview && (isMobile ? 'py-4 px-3' : 'md:py-10 md:px-6'))}>
        {!skipHeader && (
          <div className="text-center mb-6">
            {renderSharedHeader()}
          </div>
        )}

        <div className={cn('max-w-3xl mx-auto', isPreview && isMobile ? 'space-y-2' : 'grid grid-cols-1 md:grid-cols-2 gap-3')}>
          {visibleItems.map((item, idx) => {
            const IconComponent = getIcon(item.icon);
            return (
              <div
                key={getItemKey(item, idx)}
                className="flex items-center gap-3 p-3 rounded-xl border"
                style={{ backgroundColor: colors.badgeBackground, borderColor: colors.cardBorder }}
              >
                {showIcons ? (
                  <div className="relative flex-shrink-0">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: colors.iconChipBackground, color: colors.iconChipText }}
                    >
                      <IconComponent size={18} strokeWidth={2} />
                    </div>
                    <span
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                      style={{ backgroundColor: colors.timelineDot }}
                    >
                      {idx + 1}
                    </span>
                  </div>
                ) : null}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm line-clamp-1" style={{ color: colors.body }}>
                    {item.title || 'Tên tính năng'}
                  </h3>
                  <p className="text-xs line-clamp-1" style={{ color: colors.muted }}>
                    {item.description || 'Mô tả tính năng...'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {remainingCount > 0 && (
          <div className="text-center mt-4">
            <span className="text-sm" style={{ color: colors.actionText }}>
              +{remainingCount} tính năng khác
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderCompactStyle = () => {
    if (normalizedItems.length === 0) {return renderEmptyState();}

    const maxItems = isPreview ? (isMobile ? 4 : 8) : 8;
    const visibleItems = normalizedItems.slice(0, maxItems);
    const remainingCount = normalizedItems.length - maxItems;

    return (
      <div className={cn('py-8 px-4', isPreview && (isMobile ? 'py-6 px-3' : 'md:py-12 md:px-6'))}>
        {!skipHeader && (
          <div
            className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b-2 mb-6"
            style={{ borderColor: colors.sectionRule }}
          >
            <div className="space-y-2">
              {renderSharedHeader()}
            </div>
            {remainingCount > 0 && <span className="text-sm" style={{ color: colors.muted }}>+{remainingCount} tính năng khác</span>}
          </div>
        )}

        <div className={cn('grid gap-3', isPreview ? (isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-4') : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4')}>
          {visibleItems.map((item, idx) => {
            const IconComponent = getIcon(item.icon);
            return (
              <div
                key={getItemKey(item, idx)}
                className="flex items-start gap-3 p-4 rounded-xl border"
                style={{ backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }}
              >
                {showIcons ? (
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: colors.iconChipBackground, color: colors.iconChipText }}
                  >
                    <IconComponent size={18} strokeWidth={2} />
                  </div>
                ) : null}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm mb-0.5 truncate" style={{ color: colors.body }}>
                    {item.title || 'Tính năng'}
                  </h3>
                  <p className="text-xs line-clamp-2 min-h-[2rem]" style={{ color: colors.muted }}>
                    {item.description || 'Mô tả...'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCardsStyle = () => {
    if (normalizedItems.length === 0) {return renderEmptyState();}

    const maxVisible = isPreview ? (isMobile ? 4 : 6) : 6;
    const visibleItems = normalizedItems.slice(0, maxVisible);
    const remainingCount = normalizedItems.length - maxVisible;

    const gridClass = cn(
      'grid gap-5',
      visibleItems.length === 1 ? 'max-w-sm mx-auto' : '',
      visibleItems.length === 2 ? 'max-w-2xl mx-auto grid-cols-1 sm:grid-cols-2' : '',
      visibleItems.length >= 3
        ? (isPreview
          ? (isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-2' : 'grid-cols-3')
          : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3')
        : '',
    );

    return (
      <div className={cn('py-8 px-4', isPreview && (isMobile ? 'py-6 px-3' : 'md:py-12 md:px-6'))}>
        {!skipHeader && (
          <div className="text-center mb-8 md:mb-12">
            {renderSharedHeader()}
          </div>
        )}

        <div className={gridClass}>
          {visibleItems.map((item, idx) => {
            const IconComponent = getIcon(item.icon);
            return (
              <div
                key={getItemKey(item, idx)}
                className="relative rounded-2xl overflow-hidden border flex flex-col"
                style={{ backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }}
              >
                <div className="h-1" style={{ backgroundColor: colors.primary }} />
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-4">
                    {showIcons ? (
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: colors.iconChipBackground, color: colors.iconChipText }}
                      >
                        <IconComponent size={22} strokeWidth={2} />
                      </div>
                    ) : null}
                    <span className="text-3xl font-bold opacity-25" style={{ color: colors.primary }}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-2 line-clamp-1" style={{ color: colors.body }}>
                    {item.title || 'Tên tính năng'}
                  </h3>
                  <p className="text-sm leading-relaxed line-clamp-3 min-h-[3.75rem] flex-1" style={{ color: colors.muted }}>
                    {item.description || 'Mô tả tính năng...'}
                  </p>
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: colors.neutralBorder }}>
                    <span className="inline-flex items-center gap-1 text-sm font-medium" style={{ color: colors.actionText }}>
                      Tìm hiểu thêm <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {remainingCount > 0 && (
            <div
              className="flex items-center justify-center rounded-2xl border-2 border-dashed min-h-[250px]"
              style={{ borderColor: colors.neutralBorder, backgroundColor: colors.badgeBackground }}
            >
              <div className="text-center" style={{ color: colors.muted }}>
                <Plus size={32} className="mx-auto mb-2" />
                <span className="text-lg font-bold">+{remainingCount}</span>
                <p className="text-xs">tính năng khác</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const itemsPerView = style === 'carousel'
    ? (isPreview ? (isMobile ? 1 : isTablet ? 2 : 3) : 3)
    : 1;
  const maxCarouselIndex = Math.max(0, normalizedItems.length - itemsPerView);
  const [carouselIndex, setCarouselIndex] = React.useState(0);

  React.useEffect(() => {
    if (carouselIndex > maxCarouselIndex) {
      setCarouselIndex(maxCarouselIndex);
    }
  }, [carouselIndex, maxCarouselIndex]);

  const renderCarouselStyle = () => {
    if (normalizedItems.length === 0) {return renderEmptyState();}

    return (
      <div className={cn('py-8 px-4', isPreview && (isMobile ? 'py-6 px-3' : 'md:py-12 md:px-6'))}>
        <div className="flex items-end justify-between mb-8 gap-4">
          {!skipHeader && (
            <div>
              {renderSharedHeader()}
            </div>
          )}
          {normalizedItems.length > itemsPerView && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCarouselIndex((current) => Math.max(0, current - 1))}
                disabled={carouselIndex === 0}
                className="w-10 h-10 rounded-full border flex items-center justify-center disabled:opacity-40"
                style={{ borderColor: colors.neutralBorder, color: colors.body }}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={() => setCarouselIndex((current) => Math.min(maxCarouselIndex, current + 1))}
                disabled={carouselIndex >= maxCarouselIndex}
                className="w-10 h-10 rounded-full border flex items-center justify-center disabled:opacity-40"
                style={{ borderColor: colors.neutralBorder, color: colors.body }}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        <div className="overflow-hidden">
          <div
            className="flex gap-5 transition-transform duration-300"
            style={{ transform: `translateX(-${carouselIndex * (100 / itemsPerView)}%)`, width: `${(normalizedItems.length / itemsPerView) * 100}%` }}
          >
            {normalizedItems.map((item, idx) => {
              const IconComponent = getIcon(item.icon);
              return (
                <div key={getItemKey(item, idx)} className="flex-shrink-0" style={{ width: `${100 / normalizedItems.length}%` }}>
                  <div
                    className="rounded-2xl p-6 border h-full flex flex-col"
                    style={{ backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }}
                  >
                    {showIcons ? (
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                        style={{ backgroundColor: colors.iconChipBackground, color: colors.iconChipText }}
                      >
                        <IconComponent size={24} strokeWidth={2} />
                      </div>
                    ) : null}
                    <h3 className="font-bold text-lg mb-2 line-clamp-1" style={{ color: colors.body }}>
                      {item.title || 'Tên tính năng'}
                    </h3>
                    <p className="text-sm leading-relaxed line-clamp-3 min-h-[3.75rem]" style={{ color: colors.muted }}>
                      {item.description || 'Mô tả tính năng...'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {normalizedItems.length > itemsPerView && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: maxCarouselIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCarouselIndex(idx)}
                className={cn('w-2 h-2 rounded-full transition-all', idx === carouselIndex ? 'w-6' : '')}
                style={{ backgroundColor: idx === carouselIndex ? colors.primary : colors.neutralBorder }}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderTimelineStyle = () => {
    if (normalizedItems.length === 0) {return renderEmptyState();}

    const maxItems = isPreview ? (isMobile ? 4 : 6) : 6;
    const visibleItems = normalizedItems.slice(0, maxItems);
    const remainingCount = normalizedItems.length - maxItems;

    return (
      <div className={cn('py-6 px-4', isPreview && (isMobile ? 'py-4 px-3' : 'md:py-10 md:px-6'))}>
        {!skipHeader && (
          <div className="text-center mb-6">
            {renderSharedHeader()}
          </div>
        )}

        <div className="max-w-2xl mx-auto relative">
          <div
            className={cn('absolute top-0 bottom-0 w-px', isPreview && isMobile ? 'left-3' : 'left-1/2')}
            style={{ backgroundColor: colors.timelineLine }}
          />

          <div className={cn('relative', isPreview && isMobile ? 'space-y-3' : 'space-y-4')}>
            {visibleItems.map((item, idx) => {
              const IconComponent = getIcon(item.icon);
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={getItemKey(item, idx)}
                  className={cn(
                    'relative flex items-center',
                    isPreview && isMobile ? 'pl-8' : (isEven ? 'flex-row pr-[52%]' : 'flex-row-reverse pl-[52%]'),
                  )}
                >
                  <div
                    className={cn(
                      'absolute flex items-center justify-center w-6 h-6 rounded-full border-2 border-white shadow z-10',
                      isPreview && isMobile ? 'left-0' : 'left-1/2 -translate-x-1/2',
                    )}
                    style={{ backgroundColor: colors.timelineDot }}
                  >
                    {showIcons ? <IconComponent size={12} className="text-white" strokeWidth={2.5} /> : null}
                  </div>

                  <div
                    className="flex-1 rounded-lg p-3 border"
                    style={{ backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: colors.badgeBackground, color: colors.badgeText }}
                      >
                        {idx + 1}
                      </span>
                      <h3 className="font-semibold text-sm line-clamp-1" style={{ color: colors.body }}>
                        {item.title || 'Tên tính năng'}
                      </h3>
                    </div>
                    <p className="text-xs line-clamp-1 pl-6" style={{ color: colors.muted }}>
                      {item.description || 'Mô tả tính năng...'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {remainingCount > 0 && (
            <div className="text-center mt-4">
              <span className="text-sm" style={{ color: colors.actionText }}>
                +{remainingCount} tính năng khác
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCarousel6Style = () => {
    if (normalizedItems.length === 0) {return renderEmptyState();}

    const carouselBackground = '#fbf0df';
    const cardBackground = '#fffaf2';
    const cardBorder = '#8a5a2b';
    const columns = isMobile ? 1 : isTablet ? 3 : 6;
    const showNavigation = isPreview ? normalizedItems.length > columns : normalizedItems.length > 1;
    const siteNavigationClass = !isPreview
      ? cn(
        normalizedItems.length <= 1 && 'hidden',
        normalizedItems.length > 1 && normalizedItems.length <= 3 && 'md:hidden',
        normalizedItems.length > 3 && normalizedItems.length <= 6 && 'lg:hidden',
      )
      : '';
    const basisClass = isPreview
      ? (isMobile ? 'basis-[82%]' : isTablet ? 'basis-[33.333333%]' : 'basis-[16.666667%]')
      : 'basis-[82%] md:basis-[33.333333%] lg:basis-[16.666667%]';

    return (
      <div
        className={cn('py-4 md:py-6 overflow-hidden', isPreview && (isMobile ? 'py-4' : 'md:py-6'))}
        style={{ backgroundColor: carouselBackground }}
      >
        <div className="flex items-end justify-between mb-4 md:mb-5 gap-4 px-3 md:px-5 lg:px-6">
          {!skipHeader && (
            <div className="flex-1">
              {renderSharedHeader()}
            </div>
          )}
          {showNavigation && (
            <div className={cn('flex gap-2 shrink-0 pb-2', siteNavigationClass)}>
              <button
                type="button"
                onClick={() => emblaApi?.scrollPrev()}
                disabled={!canScrollPrev}
                className="w-9 h-9 rounded-full border flex items-center justify-center disabled:opacity-40 transition-opacity"
                style={{ borderColor: cardBorder, color: '#6b431d', backgroundColor: cardBackground }}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => emblaApi?.scrollNext()}
                disabled={!canScrollNext}
                className="w-9 h-9 rounded-full border flex items-center justify-center disabled:opacity-40 transition-opacity"
                style={{ borderColor: cardBorder, color: '#6b431d', backgroundColor: cardBackground }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        <div className="overflow-hidden px-3 md:px-5 lg:px-6" ref={emblaRef}>
          <div className="flex -ml-2.5 md:-ml-3 touch-pan-y items-stretch">
            {normalizedItems.map((item, idx) => {
              const IconComponent = getIcon(item.icon);
              return (
                <div key={getItemKey(item, idx)} className={cn('flex-none pl-2.5 md:pl-3 min-w-0 flex', basisClass)}>
                  <div
                    className="w-full h-full flex flex-col relative group rounded-[14px] border-2 overflow-hidden shadow-[0_1px_2px_rgba(73,45,18,0.12)]"
                    style={{ backgroundColor: cardBackground, borderColor: cardBorder }}
                  >
                    {item.image ? (
                      <div className="w-full aspect-[4/3] relative overflow-hidden shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : null}

                    <div
                      className={cn(
                        "px-2.5 pb-3 md:px-3 md:pb-3.5 flex flex-col flex-1 items-center text-center transition-all",
                        item.image ? "pt-0" : "pt-3 md:pt-4"
                      )}
                      style={{ backgroundColor: cardBackground }}
                    >
                      {showIcons ? (
                        <div
                          className={cn(
                            "w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm border-[3px]",
                            item.image ? "-mt-6 mb-2.5 relative z-10" : "mb-2.5 mt-0"
                          )}
                          style={{ backgroundColor: '#6b431d', color: '#fff8ea', borderColor: cardBackground }}
                        >
                          <IconComponent size={21} strokeWidth={2} />
                        </div>
                      ) : null}
                      <h3 className="font-bold text-[13px] md:text-[14px] mb-1.5 leading-snug text-balance break-words" style={{ color: '#6b431d' }}>
                        {item.title || 'Tên tính năng'}
                      </h3>
                      <p className="text-[11px] md:text-xs leading-snug break-words" style={{ color: '#6f5a45' }}>
                        {item.description || 'Mô tả tính năng...'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const styleRenderer: Record<FeaturesStyle, () => React.ReactNode> = {
    iconGrid: renderIconGridStyle,
    alternating: renderAlternatingStyle,
    compact: renderCompactStyle,
    cards: renderCardsStyle,
    carousel: renderCarouselStyle,
    timeline: renderTimelineStyle,
    carousel6: renderCarousel6Style,
  };

  const content = styleRenderer[style] ? styleRenderer[style]() : renderIconGridStyle();

  return (
    <div className={className} style={{ backgroundColor: style === 'carousel6' ? '#fbf0df' : colors.sectionBackground }}>
      {content}
    </div>
  );
}
