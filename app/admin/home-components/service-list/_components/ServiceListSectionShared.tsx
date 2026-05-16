'use client';

import React from 'react';
import { AdminImage as Image } from '@/app/admin/components/AdminImage';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowRight, ArrowUpRight, Briefcase, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { cn } from '../../../components/ui';
import type { ServiceListColorTokens } from '../_lib/colors';
import type {
  ServiceListBrandMode,
  ServiceListPreviewItem,
  ServiceListStyle,
} from '../_types';

type ServiceListSharedContext = 'preview' | 'site';
type ServiceListPreviewDevice = 'mobile' | 'tablet' | 'desktop';

type ServiceListSharedItem = ServiceListPreviewItem & { href?: string };

interface ServiceListSectionSharedProps {
  items: ServiceListSharedItem[];
  sectionTitle: string;
  style: ServiceListStyle;
  mode: ServiceListBrandMode;
  tokens: ServiceListColorTokens;
  context: ServiceListSharedContext;
  device?: ServiceListPreviewDevice;
  showViewAll?: boolean;
  viewAllHref?: string;
  onItemClick?: (item: ServiceListSharedItem) => void;
  hideHeader?: boolean;
  showTitle?: boolean;
  showSubtitle?: boolean;
  subtitle?: string;
  headerAlign?: 'left' | 'center' | 'right';
  titleColorPrimary?: boolean;
  subtitleAboveTitle?: boolean;
  uppercaseText?: boolean;
  showBadge?: boolean;
  badgeText?: string;
  imagePriorityCount?: number;
}

const stripHtml = (value?: string) => {
  if (!value) {return '';}
  return value.replaceAll(/<[^>]*>/g, ' ').replaceAll(/\s+/g, ' ').trim();
};

const formatServicePrice = (price?: string | number) => {
  if (typeof price === 'number') {
    if (!Number.isFinite(price) || price <= 0) {return 'Liên hệ';}
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(price);
  }

  if (typeof price === 'string') {
    const trimmed = price.trim();
    if (!trimmed) {return 'Liên hệ';}

    const numeric = Number.parseInt(trimmed.replaceAll(/\D/g, ''), 10);
    if (Number.isFinite(numeric) && numeric > 0) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
      }).format(numeric);
    }

    return trimmed;
  }

  return 'Liên hệ';
};

const ServiceBadge = ({
  tag,
  tokens,
}: {
  tag?: 'new' | 'hot';
  tokens: ServiceListColorTokens;
}) => {
  if (!tag) {return null;}

  if (tag === 'hot') {
    return (
      <span
        className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
        style={{
          backgroundColor: tokens.badgeHotBg,
          borderColor: tokens.badgeHotBg,
          color: tokens.badgeHotText,
        }}
      >
        Hot
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
      style={{
        backgroundColor: tokens.badgeNewBg,
        borderColor: tokens.badgeNewBorder,
        color: tokens.badgeNewText,
      }}
    >
      New
    </span>
  );
};

const ServiceImage = ({
  context,
  src,
  alt,
  className,
  sizes,
  priority = false,
}: {
  context: ServiceListSharedContext;
  src: string;
  alt: string;
  className: string;
  sizes: string;
  priority?: boolean;
}) => (
  <Image
    src={src}
    alt={alt}
    fill
    sizes={sizes}
    className={className}
    priority={priority}
    draggable={false}
    unoptimized={context === 'preview'}
  />
);

export function ServiceListSectionShared({
  items,
  sectionTitle,
  style,
  mode,
  tokens,
  context,
  device = 'desktop',
  showViewAll = true,
  viewAllHref = '/services',
  onItemClick,
  hideHeader = false,
  showTitle = true,
  showSubtitle = true,
  subtitle = '',
  headerAlign = 'left',
  titleColorPrimary = false,
  subtitleAboveTitle = false,
  uppercaseText = false,
  showBadge = true,
  badgeText = '',
  imagePriorityCount = 0,
}: ServiceListSectionSharedProps) {
  const isPreview = context === 'preview';
  const isMobilePreview = isPreview && device === 'mobile';
  const isTabletPreview = isPreview && device === 'tablet';
  const heading = sectionTitle.trim() || 'Dịch vụ';
  const shouldShowViewAll = showViewAll && items.length >= 3;
  const shouldRenderHeaderContent = !hideHeader && (showTitle || showSubtitle || showBadge);


  const showcasePageSize = 8;
  const [showcasePage, setShowcasePage] = React.useState(0);
  const showcaseItems = React.useMemo(
    () => (style === 'showcase' ? items : items.slice(0, 8)),
    [items, style],
  );
  const showcaseTotalPages = React.useMemo(
    () => (style === 'showcase' ? Math.ceil(showcaseItems.length / showcasePageSize) : 1),
    [showcaseItems.length, style],
  );
  const showcaseCanPaginate = style === 'showcase' && showcaseItems.length > showcasePageSize;
  const showcasePagedItems = React.useMemo(() => {
    if (style !== 'showcase') {
      return items.slice(0, 8);
    }

    const startIndex = showcasePage * showcasePageSize;
    return showcaseItems.slice(startIndex, startIndex + showcasePageSize);
  }, [showcaseItems, showcasePage, style, items]);

  React.useEffect(() => {
    if (style !== 'showcase') {
      if (showcasePage !== 0) {
        setShowcasePage(0);
      }
      return;
    }

    const lastPage = Math.max(showcaseTotalPages - 1, 0);
    if (showcasePage > lastPage) {
      setShowcasePage(lastPage);
    }
  }, [showcasePage, showcaseTotalPages, style]);



  const baseSectionPadding = isPreview
    ? cn('py-7 md:py-8', isMobilePreview ? 'px-3' : 'px-4 md:px-6')
    : 'py-12 md:py-16 px-4 md:px-6';

  const viewAllAction = shouldShowViewAll
    ? (
      context === 'site'
        ? (
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-2 text-sm font-medium"
            style={{ color: tokens.ctaGhostText }}
          >
            Xem tất cả <ArrowRight size={16} />
          </Link>
        )
        : (
          <span
            className="inline-flex items-center gap-2 text-sm font-medium"
            style={{ color: tokens.ctaGhostText }}
          >
            Xem tất cả <ArrowRight size={16} />
          </span>
        )
    )
    : null;

  const alignClass = headerAlign === 'center' ? 'text-center' : headerAlign === 'right' ? 'text-right' : 'text-left';
  const flexAlignClass = headerAlign === 'center' ? 'justify-center' : headerAlign === 'right' ? 'justify-end' : 'justify-start';

  const renderHeader = ({
    maxWidthClass = 'max-w-7xl',
    marginClass = 'mb-6 md:mb-8',
  }: {
    maxWidthClass?: string;
    marginClass?: string;
  }) => {
    if (!shouldRenderHeaderContent) {return null;}

    const textTransform = uppercaseText ? 'uppercase' as const : undefined;

    const titleEl = showTitle && (
      <h2
        className={cn(
          'tracking-tight font-bold leading-tight text-balance',
          isPreview
            ? (isMobilePreview ? 'text-xl' : 'text-2xl')
            : 'text-2xl md:text-3xl',
        )}
        style={{ color: titleColorPrimary ? tokens.primary : tokens.heading, textTransform }}
      >
        {heading}
      </h2>
    );

    const subtitleEl = showSubtitle && subtitle && (
      <p
        className="text-sm leading-relaxed"
        style={{ color: tokens.descriptionText, textTransform }}
      >
        {subtitle}
      </p>
    );

    const badgeEl = showBadge && badgeText && (
      <span
        className="inline-block rounded-full px-3 py-0.5 text-xs font-semibold uppercase tracking-wider"
        style={{ backgroundColor: `${tokens.primary}15`, color: tokens.primary }}
      >
        {badgeText}
      </span>
    );

    return (
      <div className={cn(maxWidthClass, 'mx-auto', marginClass, alignClass)}>
        <div className={cn('space-y-2', headerAlign === 'center' ? 'mx-auto max-w-2xl' : '')}>
          {subtitleAboveTitle ? (
            <>
              {badgeEl}
              {subtitleEl}
              {titleEl}
            </>
          ) : (
            <>
              {badgeEl}
              {titleEl}
              {subtitleEl}
            </>
          )}
        </div>
        {shouldShowViewAll && headerAlign !== 'center' && (
          <div className={cn('mt-3 flex', flexAlignClass)}>
            {viewAllAction}
          </div>
        )}
      </div>
    );
  };

  const wrapItem = ({
    item,
    className,
    children,
  }: {
    item: ServiceListSharedItem;
    className: string;
    children: React.ReactNode;
  }) => {
    const key = String(item.id);

    if (context === 'site') {
      return (
        <Link
          key={key}
          href={item.href ?? viewAllHref}
          className={cn(className, 'no-underline text-inherit')}
          onClick={() => { onItemClick?.(item); }}
          draggable={false}
        >
          {children}
        </Link>
      );
    }

    return (
      <div
        key={key}
        className={className}
        onClick={() => { onItemClick?.(item); }}
      >
        {children}
      </div>
    );
  };

  const renderFallback = (size: number) => (
    <div className="h-full w-full flex items-center justify-center" style={{ backgroundColor: tokens.imageFallbackBg }}>
      <Briefcase size={size} style={{ color: tokens.imageFallbackIcon }} />
    </div>
  );

  const renderCardContent = (item: ServiceListSharedItem) => {
    const description = stripHtml(item.description);
    return (
      <>
        <h3 className="font-semibold leading-tight line-clamp-2" style={{ color: tokens.titleText }}>
          {item.name}
        </h3>
        {description ? (
          <p className="mt-1 text-sm line-clamp-2" style={{ color: tokens.descriptionText }}>
            {description}
          </p>
        ) : null}
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-sm font-semibold" style={{ color: tokens.priceText }}>
            {formatServicePrice(item.price)}
          </span>
          <ArrowUpRight size={16} style={{ color: tokens.inlineMetaText }} />
        </div>
      </>
    );
  };

  const renderGrid = () => {
    const gridItems = items.slice(0, isPreview ? (isMobilePreview ? 3 : 6) : 6);

    return (
      <section className={baseSectionPadding} data-mode={mode}>
        {renderHeader({})}

        <div
          className={cn(
            'max-w-7xl mx-auto grid gap-4 md:gap-6',
            isPreview
              ? (isMobilePreview ? 'grid-cols-1' : (isTabletPreview ? 'grid-cols-2' : 'grid-cols-3'))
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
          )}
        >
          {gridItems.map((item, index) => wrapItem({
            item,
            className: 'group block',
            children: (
              <article
                className="relative h-full rounded-xl border p-3 md:p-4"
                style={{
                  backgroundColor: tokens.cardBackground,
                  borderColor: tokens.cardBorder,
                }}
              >
                <div className="relative mb-3 overflow-hidden rounded-lg aspect-[4/3]">
                  {item.image ? (
                    <ServiceImage
                      context={context}
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      priority={!isPreview && index < imagePriorityCount}
                    />
                  ) : renderFallback(32)}

                  {item.tag ? (
                    <div className="absolute left-2 top-2 z-10">
                      <ServiceBadge tag={item.tag} tokens={tokens} />
                    </div>
                  ) : null}
                </div>

                {renderCardContent(item)}
              </article>
            ),
          }))}
        </div>
      </section>
    );
  };

  const renderBento = () => {
    const bentoItems = items.slice(0, 4);
    const remainingCount = Math.max(0, items.length - 4);

    if (isPreview && isMobilePreview) {
      return (
        <section className={baseSectionPadding} data-mode={mode}>
          {renderHeader({})}
          <div className="max-w-7xl mx-auto grid grid-cols-2 gap-3">
            {bentoItems.map((item, index) => wrapItem({
              item,
              className: 'group block',
              children: (
                <article
                  className="relative rounded-xl border p-2.5"
                  style={{
                    backgroundColor: tokens.cardBackground,
                    borderColor: tokens.cardBorder,
                  }}
                >
                  <div className="relative mb-2 overflow-hidden rounded-lg aspect-square">
                    {item.image ? (
                      <ServiceImage
                        context={context}
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                        sizes="(max-width: 768px) 50vw, 160px"
                        priority={!isPreview && index < imagePriorityCount}
                      />
                    ) : renderFallback(24)}

                    {item.tag ? (
                      <div className="absolute left-2 top-2 z-10">
                        <ServiceBadge tag={item.tag} tokens={tokens} />
                      </div>
                    ) : null}
                  </div>

                  <h3 className="text-sm font-semibold line-clamp-2" style={{ color: tokens.titleText }}>
                    {item.name}
                  </h3>
                  <span className="mt-1 block text-xs font-semibold" style={{ color: tokens.priceText }}>
                    {formatServicePrice(item.price)}
                  </span>
                </article>
              ),
            }))}
          </div>
        </section>
      );
    }

    return (
      <section className={baseSectionPadding} data-mode={mode}>
        {renderHeader({})}

        <div
          className={cn(
            'max-w-7xl mx-auto grid gap-4',
            isPreview
              ? (isTabletPreview ? 'grid-cols-3 auto-rows-[220px]' : 'grid-cols-4 auto-rows-[250px]')
              : 'grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[250px]',
          )}
        >
          {bentoItems.map((item, index) => {
            const isFeatured = index === 0;
            const shouldPrioritize = !isPreview && index < imagePriorityCount;
            const isLast = index === 3;

            return wrapItem({
              item,
              className: cn(
                'group block',
                isFeatured && 'col-span-2 row-span-2',
                isLast && 'col-span-2',
              ),
              children: (
                <article
                  className="relative h-full rounded-xl border p-3 md:p-4"
                  style={{
                    backgroundColor: tokens.cardBackground,
                    borderColor: tokens.cardBorder,
                  }}
                >
                  <div className={cn('relative mb-3 overflow-hidden rounded-lg', isFeatured ? 'h-[65%] md:h-[70%]' : 'h-[58%]')}>
                    {item.image ? (
                      <ServiceImage
                        context={context}
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        priority={shouldPrioritize}
                      />
                    ) : renderFallback(isFeatured ? 40 : 28)}

                    {item.tag ? (
                      <div className="absolute left-2 top-2 z-10">
                        <ServiceBadge tag={item.tag} tokens={tokens} />
                      </div>
                    ) : null}

                    {isLast && remainingCount > 0 ? (
                      <span
                        className="absolute right-2 top-2 z-10 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold"
                        style={{
                          backgroundColor: tokens.badgeNewBg,
                          borderColor: tokens.badgeNewBorder,
                          color: tokens.badgeNewText,
                        }}
                      >
                        <Plus size={12} />
                        {remainingCount}
                      </span>
                    ) : null}
                  </div>

                  <h3 className={cn('font-semibold line-clamp-2', isFeatured ? 'text-base md:text-lg' : 'text-sm md:text-base')} style={{ color: tokens.titleText }}>
                    {item.name}
                  </h3>

                  {isFeatured && item.description ? (
                    <p className="mt-1 text-sm line-clamp-2" style={{ color: tokens.descriptionText }}>
                      {stripHtml(item.description)}
                    </p>
                  ) : null}

                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold" style={{ color: tokens.priceText }}>
                      {formatServicePrice(item.price)}
                    </span>
                    <ArrowUpRight size={16} style={{ color: tokens.inlineMetaText }} />
                  </div>
                </article>
              ),
            });
          })}
        </div>
      </section>
    );
  };

  const renderList = () => {
    const listItems = items.slice(0, isPreview && isMobilePreview ? 4 : 6);

    return (
      <section className={baseSectionPadding} data-mode={mode}>
        {renderHeader({ maxWidthClass: 'max-w-4xl' })}

        <div className="max-w-4xl mx-auto space-y-2">
          {listItems.map((item, index) => wrapItem({
            item,
            className: 'group block',
            children: (
              <article
                className="rounded-xl border p-3 md:p-4"
                style={{
                  backgroundColor: tokens.cardBackground,
                  borderColor: tokens.cardBorder,
                }}
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="relative h-20 w-20 md:h-24 md:w-24 overflow-hidden rounded-lg flex-shrink-0">
                    {item.image ? (
                      <ServiceImage
                        context={context}
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                        sizes="96px"
                        priority={!isPreview && index < imagePriorityCount}
                      />
                    ) : renderFallback(24)}

                    {item.tag ? (
                      <div className="absolute left-1.5 top-1.5 z-10">
                        <ServiceBadge tag={item.tag} tokens={tokens} />
                      </div>
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm md:text-base line-clamp-2" style={{ color: tokens.titleText }}>
                      {item.name}
                    </h3>

                    {item.description ? (
                      <p className="mt-1 text-xs md:text-sm line-clamp-2" style={{ color: tokens.descriptionText }}>
                        {stripHtml(item.description)}
                      </p>
                    ) : null}

                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold" style={{ color: tokens.priceText }}>
                        {formatServicePrice(item.price)}
                      </span>
                      <ArrowUpRight size={16} style={{ color: tokens.inlineMetaText }} />
                    </div>
                  </div>
                </div>
              </article>
            ),
          }))}
        </div>
      </section>
    );
  };

  const renderCarousel = () => {
    const displayedItems = items.slice(0, 8);

    const EmblaServiceCarousel = () => {
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

      return (
        <section className={baseSectionPadding} data-mode={mode}>
          <div className="max-w-7xl mx-auto">
            <div className={cn('flex items-end justify-between gap-3', (shouldRenderHeaderContent || canScrollPrev || canScrollNext) && 'mb-4 md:mb-6')}>
              <div className="min-w-0 flex-1">
                {renderHeader({ maxWidthClass: '', marginClass: 'mb-0' })}
              </div>
              {(canScrollPrev || canScrollNext) ? (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={!canScrollPrev}
                    onClick={() => emblaApi?.scrollPrev()}
                    className={cn(
                      'inline-flex h-10 w-10 items-center justify-center rounded-full border transition-all',
                      canScrollPrev
                        ? 'hover:shadow-sm'
                        : 'cursor-not-allowed opacity-40',
                    )}
                    style={{
                      backgroundColor: tokens.navButtonBg,
                      borderColor: tokens.navButtonBorder,
                      color: tokens.navButtonText,
                    }}
                    aria-label="Cuộn trái"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    disabled={!canScrollNext}
                    onClick={() => emblaApi?.scrollNext()}
                    className={cn(
                      'inline-flex h-10 w-10 items-center justify-center rounded-full border transition-all',
                      canScrollNext
                        ? 'hover:shadow-sm'
                        : 'cursor-not-allowed opacity-40',
                    )}
                    style={{
                      backgroundColor: tokens.navButtonBg,
                      borderColor: tokens.navButtonBorder,
                      color: tokens.navButtonText,
                    }}
                    aria-label="Cuộn phải"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              ) : null}
            </div>

            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-3 md:gap-4 backface-hidden touch-pan-y">
                {displayedItems.map((item, index) => wrapItem({
                  item,
                  className: cn(
                    'group flex-none block select-none',
                    isPreview
                      ? (isMobilePreview ? 'w-[72%]' : (isTabletPreview ? 'w-[260px]' : 'w-[290px]'))
                      : 'w-[76vw] sm:w-[280px] lg:w-[300px]',
                  ),
                  children: (
                    <article
                      className="h-full rounded-xl border p-3"
                      style={{
                        backgroundColor: tokens.cardBackground,
                        borderColor: tokens.cardBorder,
                      }}
                    >
                      <div className="relative mb-3 overflow-hidden rounded-lg aspect-[4/3]">
                        {item.image ? (
                          <ServiceImage
                            context={context}
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                            sizes="(max-width: 768px) 100vw, 300px"
                            priority={!isPreview && index < imagePriorityCount}
                          />
                        ) : renderFallback(28)}

                        {item.tag ? (
                          <div className="absolute left-2 top-2 z-10">
                            <ServiceBadge tag={item.tag} tokens={tokens} />
                          </div>
                        ) : null}
                      </div>

                      {renderCardContent(item)}
                    </article>
                  ),
                }))}
              </div>
            </div>
          </div>
        </section>
      );
    };

    return <EmblaServiceCarousel />;
  };

  const renderMinimal = () => {
    const minimalItems = items.slice(0, isPreview ? (isMobilePreview ? 3 : 6) : 6);

    return (
      <section className={baseSectionPadding} data-mode={mode}>
        {renderHeader({})}

        <div
          className={cn(
            'max-w-7xl mx-auto grid gap-5 md:gap-6',
            isPreview
              ? (isMobilePreview ? 'grid-cols-1' : (isTabletPreview ? 'grid-cols-2' : 'grid-cols-3'))
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
          )}
        >
          {minimalItems.map((item, index) => wrapItem({
            item,
            className: 'group block',
            children: (
              <article>
                <div
                  className="relative mb-4 overflow-hidden rounded-2xl border aspect-[3/2]"
                  style={{
                    borderColor: tokens.cardBorder,
                    backgroundColor: tokens.imageFallbackBg,
                  }}
                >
                  {item.image ? (
                    <ServiceImage
                      context={context}
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      priority={!isPreview && index < imagePriorityCount}
                    />
                  ) : renderFallback(36)}

                  {item.tag ? (
                    <div className="absolute left-3 top-3 z-10">
                      <ServiceBadge tag={item.tag} tokens={tokens} />
                    </div>
                  ) : null}
                </div>

                <h3 className="text-base md:text-lg font-semibold line-clamp-2" style={{ color: tokens.titleText }}>
                  {item.name}
                </h3>

                {item.description ? (
                  <p className="mt-1 text-sm line-clamp-2" style={{ color: tokens.descriptionText }}>
                    {stripHtml(item.description)}
                  </p>
                ) : null}

                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="font-semibold" style={{ color: tokens.priceText }}>
                    {formatServicePrice(item.price)}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-medium" style={{ color: tokens.inlineMetaText }}>
                    Chi tiết <ArrowUpRight size={15} />
                  </span>
                </div>
              </article>
            ),
          }))}
        </div>
      </section>
    );
  };

  const renderShowcase = () => {
    const canGoToPreviousShowcasePage = showcasePage > 0;
    const canGoToNextShowcasePage = showcasePage < showcaseTotalPages - 1;

    const showcaseWrapperPaddingClassName = isPreview
      ? (isMobilePreview ? 'p-4' : (isTabletPreview ? 'p-6' : 'p-8'))
      : 'p-4 md:p-6 lg:p-8';

    const showcaseGapClassName = isPreview
      ? (isMobilePreview ? 'gap-x-3 gap-y-5' : 'gap-x-6 gap-y-8')
      : 'gap-x-3 gap-y-5 md:gap-x-6 md:gap-y-8';

    const showcaseTitleClassName = isPreview
      ? (isMobilePreview ? 'text-sm' : 'text-base')
      : 'text-sm md:text-base';

    const showcaseGridClassName = isPreview
      ? (isMobilePreview ? 'grid-cols-2' : (isTabletPreview ? 'grid-cols-3' : 'grid-cols-4'))
      : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

    return (
      <section className={baseSectionPadding} data-mode={mode}>
        <div className={cn('max-w-7xl mx-auto rounded-md border bg-white shadow-sm', showcaseWrapperPaddingClassName)} style={{ borderColor: `${tokens.cardBorder}80`, backgroundColor: tokens.cardBackground }}>
          <div className={cn('flex items-start justify-between gap-3', (shouldRenderHeaderContent || showcaseCanPaginate) && 'mb-6 md:mb-8')}>
            <div className="min-w-0 flex-1">
              {renderHeader({ maxWidthClass: '', marginClass: 'mb-0' })}
            </div>
            {showcaseCanPaginate ? (
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => { setShowcasePage((current) => Math.max(current - 1, 0)); }}
                  disabled={!canGoToPreviousShowcasePage}
                  aria-label="Trang trước"
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-full transition-colors',
                    canGoToPreviousShowcasePage ? 'bg-gray-200 text-gray-500 hover:bg-gray-300' : 'cursor-not-allowed bg-gray-200 text-gray-500 opacity-50',
                  )}
                >
                  <ChevronRight size={18} className="rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={() => { setShowcasePage((current) => Math.min(current + 1, showcaseTotalPages - 1)); }}
                  disabled={!canGoToNextShowcasePage}
                  aria-label="Trang sau"
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-full transition-colors',
                    canGoToNextShowcasePage ? 'bg-gray-300 text-gray-700 hover:bg-gray-400' : 'cursor-not-allowed bg-gray-300 text-gray-700 opacity-50',
                  )}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            ) : null}
          </div>

          <div className={cn('mb-8 grid', showcaseGridClassName, showcaseGapClassName)}>
            {showcasePagedItems.map((item, index) => wrapItem({
              item,
              className: 'group cursor-pointer',
              children: (
                <article className="flex flex-col">
                  <div className="relative mb-3 aspect-[16/10] w-full overflow-hidden rounded-md bg-slate-100">
                    {item.image ? (
                      <ServiceImage
                        context={context}
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                        priority={!isPreview && index < imagePriorityCount}
                      />
                    ) : renderFallback(28)}

                    {item.tag ? (
                      <div className="absolute left-2 top-2 z-10">
                        <ServiceBadge tag={item.tag} tokens={tokens} />
                      </div>
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <h3 className={cn('mb-2 line-clamp-2 font-semibold leading-snug', showcaseTitleClassName)} style={{ color: tokens.titleText }}>
                      {item.name}
                    </h3>
                    <div className="mt-auto inline-flex items-center gap-1.5 text-[13px]" style={{ color: tokens.priceText }}>
                      <span className="font-semibold">{formatServicePrice(item.price)}</span>
                    </div>
                  </div>
                </article>
              ),
            }))}
          </div>

          {shouldShowViewAll ? (
            context === 'site' ? (
              <Link href={viewAllHref} className="flex justify-center pt-2">
                <div className="rounded px-6 py-2.5 text-white" style={{ backgroundColor: tokens.ctaSolidBg }}>
                  Xem tất cả
                </div>
              </Link>
            ) : (
              <div className="flex justify-center pt-2">
                <div className="rounded px-6 py-2.5 text-white" style={{ backgroundColor: tokens.ctaSolidBg }}>
                  Xem tất cả
                </div>
              </div>
            )
          ) : null}
        </div>
      </section>
    );
  };

  if (items.length === 0) {
    return (
      <section className={baseSectionPadding} data-mode={mode}>
        <div className="max-w-7xl mx-auto text-center py-10 rounded-xl border" style={{ borderColor: tokens.neutralBorder, backgroundColor: tokens.neutralBackground }}>
          {shouldRenderHeaderContent ? (
            <h2 className="text-xl font-semibold" style={{ color: tokens.heading }}>{heading}</h2>
          ) : null}
          <p className="mt-2 text-sm" style={{ color: tokens.mutedText }}>Chưa có dịch vụ nào.</p>
        </div>
      </section>
    );
  }

  if (style === 'grid') {return renderGrid();}
  if (style === 'bento') {return renderBento();}
  if (style === 'list') {return renderList();}
  if (style === 'carousel') {return renderCarousel();}
  if (style === 'minimal') {return renderMinimal();}
  return renderShowcase();
}

