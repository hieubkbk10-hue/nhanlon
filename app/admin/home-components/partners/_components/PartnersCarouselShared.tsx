"use client";

import React from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from '@/app/admin/components/ui';
import { getPartnersColors, type PartnersBrandMode } from '../_lib/colors';
import type { PartnersAlign, PartnersDisplayMode } from '../_types';
import { PartnersSectionHeader } from './PartnersSectionHeader';

type PartnersCarouselItem = {
  id?: string | number;
  url: string;
  link?: string;
  name?: string;
};

const PartnersCarouselInner = ({
  items,
  brandColor,
  secondary,
  mode = 'dual',
  title,
  subheading,
  align = 'center',
  displayMode = 'withName',
  openInNewTab = false,
  skipHeader = false,
  renderImage,
  className,
}: {
  items: PartnersCarouselItem[];
  brandColor: string;
  secondary: string;
  mode?: PartnersBrandMode;
  title?: string;
  subheading?: React.ReactNode;
  align?: PartnersAlign;
  displayMode?: PartnersDisplayMode;
  openInNewTab?: boolean;
  skipHeader?: boolean;
  renderImage?: (item: PartnersCarouselItem, className: string) => React.ReactNode;
  className?: string;
}) => {
  const colors = React.useMemo(() => getPartnersColors(brandColor, secondary, mode), [brandColor, secondary, mode]);
  const showName = displayMode === 'withName';

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    dragFree: true,
    containScroll: 'trimSnaps',
  });

  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  React.useEffect(() => {
    if (!emblaApi) { return; }
    const update = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };
    update();
    emblaApi.on('select', update);
    emblaApi.on('reInit', update);
    return () => { emblaApi.off('select', update); emblaApi.off('reInit', update); };
  }, [emblaApi]);

  if (items.length === 0) {
    return (
      <section className={cn('w-full py-6 bg-white dark:bg-slate-900', className)}>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: colors.iconBg }}>
            <ImageIcon size={28} style={{ color: colors.iconColor }} />
          </div>
          <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-1">Chưa có đối tác nào</h3>
          <p className="text-sm text-slate-500">Thêm logo đối tác đầu tiên</p>
        </div>
      </section>
    );
  }

  const showNav = canScrollPrev || canScrollNext;

  return (
    <section className={cn('w-full bg-white', skipHeader ? 'pb-6 md:pb-10' : 'py-6 md:py-10', className)}>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        {!skipHeader && (
          <div className="flex items-end justify-between gap-3 mb-5 md:mb-8">
            <div className="flex-1 min-w-0">
              <PartnersSectionHeader
                title={title ?? 'Đối tác'}
                subheading={subheading}
                align={align}
                brandColor={brandColor}
                secondary={secondary}
                mode={mode}
              />
            </div>
            {showNav && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  aria-label="Trước"
                  disabled={!canScrollPrev}
                  onClick={() => emblaApi?.scrollPrev()}
                  className={cn(
                    'inline-flex h-8 w-8 items-center justify-center rounded-full border transition-all',
                    canScrollPrev
                      ? 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
                      : 'border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed',
                  )}
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  type="button"
                  aria-label="Tiếp"
                  disabled={!canScrollNext}
                  onClick={() => emblaApi?.scrollNext()}
                  className={cn(
                    'inline-flex h-8 w-8 items-center justify-center rounded-full border transition-all',
                    canScrollNext
                      ? 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
                      : 'border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed',
                  )}
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Embla viewport */}
        <div className={cn('overflow-hidden', skipHeader && 'mt-5 md:mt-8')} ref={emblaRef}>
          <div className="flex gap-3 md:gap-4">
            {items.map((item, index) => {
              const key = item.id ?? item.link ?? index;
              return (
                <a
                  key={key}
                  href={item.link || '#'}
                  target={openInNewTab ? '_blank' : undefined}
                  rel={openInNewTab ? 'noopener noreferrer' : undefined}
                  className={cn(
                    'group flex shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-white transition-all duration-200 hover:shadow-md select-none',
                    showName
                      ? 'w-[150px] flex-col gap-2 p-4 md:w-[170px] md:p-5'
                      : 'w-[120px] p-4 md:w-[140px] md:p-5',
                  )}
                  onMouseEnter={(event) => { event.currentTarget.style.borderColor = colors.primary; }}
                  onMouseLeave={(event) => { event.currentTarget.style.borderColor = ''; }}
                  draggable={false}
                >
                  <div className={cn(
                    'flex w-full items-center justify-center pointer-events-none',
                    showName ? 'h-10 md:h-12' : 'h-12 md:h-14',
                  )}>
                    {item.url
                      ? (renderImage
                          ? renderImage(item, 'h-full w-auto max-w-full object-contain pointer-events-none')
                          : <ImageIcon size={28} className="text-slate-300" />)
                      : <ImageIcon size={showName ? 24 : 36} className="text-slate-300" />}
                  </div>
                  {showName && (
                    <span className="w-full truncate text-center text-xs font-medium text-slate-500 md:text-sm pointer-events-none">
                      {item.name ?? `Đối tác ${index + 1}`}
                    </span>
                  )}
                </a>
              );
            })}
          </div>
        </div>

        {/* Nav buttons khi skipHeader (site mode) */}
        {skipHeader && showNav && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              type="button"
              aria-label="Trước"
              disabled={!canScrollPrev}
              onClick={() => emblaApi?.scrollPrev()}
              className={cn(
                'inline-flex h-8 w-8 items-center justify-center rounded-full border transition-all',
                canScrollPrev
                  ? 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
                  : 'border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed',
              )}
            >
              <ChevronLeft size={15} />
            </button>
            <button
              type="button"
              aria-label="Tiếp"
              disabled={!canScrollNext}
              onClick={() => emblaApi?.scrollNext()}
              className={cn(
                'inline-flex h-8 w-8 items-center justify-center rounded-full border transition-all',
                canScrollNext
                  ? 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
                  : 'border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed',
              )}
            >
              <ChevronRight size={15} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export const PartnersCarouselShared = (props: Parameters<typeof PartnersCarouselInner>[0]) => {
  return <PartnersCarouselInner {...props} />;
};
