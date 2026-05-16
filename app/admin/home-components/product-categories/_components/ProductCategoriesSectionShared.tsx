'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Image as ImageIcon, Package } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from '../../../components/ui';
import { SectionHeader } from '../../_shared/components/SectionHeader';
import { PreviewImage } from '../../_shared/components/PreviewImage';
import { getCategoryIcon } from '@/app/admin/components/CategoryImageSelector';
import type { ProductCategoriesColors } from '../_lib/colors';
import type { ProductCategoriesAlign, ProductCategoriesBrandMode, ProductCategoriesResolvedItem, ProductCategoriesStyle } from '../_types';

type ProductCategoriesContext = 'preview' | 'site';
type ProductCategoriesDevice = 'desktop' | 'tablet' | 'mobile';

export interface ProductCategoriesSectionSharedProps {
  title?: string;
  subtitle?: string;
  subheading?: string;
  align?: ProductCategoriesAlign;
  headerAlign?: ProductCategoriesAlign;
  hideHeader?: boolean;
  showTitle?: boolean;
  showSubtitle?: boolean;
  titleColorPrimary?: boolean;
  subtitleAboveTitle?: boolean;
  uppercaseText?: boolean;
  showBadge?: boolean;
  badgeText?: string;
  brandColor?: string;
  style: ProductCategoriesStyle;
  items: ProductCategoriesResolvedItem[];
  colors: ProductCategoriesColors;
  context: ProductCategoriesContext;
  device?: ProductCategoriesDevice;
  mode?: ProductCategoriesBrandMode;
  showProductCount?: boolean;
  fontClassName?: string;
  fontStyle?: React.CSSProperties;
  previewCtaLabel?: string;
  viewAllHref?: string;
  getItemHref?: (item: ProductCategoriesResolvedItem) => string | undefined;
  renderImage?: (item: ProductCategoriesResolvedItem, className: string) => React.ReactNode;
}

const DEFAULT_TITLE = 'Danh mục sản phẩm';
const DEFAULT_ALIGN: ProductCategoriesAlign = 'center';
const DEFAULT_SLIDE_BASIS_CLASSNAMES: Record<ProductCategoriesDevice, string> = {
  mobile: 'basis-[40%]',
  tablet: 'basis-[28.571%]',
  desktop: 'basis-[18.181%]',
};
const STYLE_SLIDE_BASIS_CLASSNAMES: Partial<Record<ProductCategoriesStyle, Record<ProductCategoriesDevice, string>>> = {
  carousel: {
    mobile: 'basis-[58%]',
    tablet: 'basis-[24%]',
    desktop: 'basis-[18.181%]',
  },
  cards: {
    mobile: 'basis-[76%]',
    tablet: 'basis-[28%]',
    desktop: 'basis-[18.181%]',
  },
};
const PREVIEW_ONLY_SLIDE_BASIS_CLASSNAMES: Partial<Record<ProductCategoriesStyle, Record<ProductCategoriesDevice, string>>> = {
};
const SITE_SLIDE_BASIS_CLASSNAMES: Partial<Record<ProductCategoriesStyle, Record<ProductCategoriesDevice, string>>> = {
};

const getResponsiveClassName = (
  context: ProductCategoriesContext,
  device: ProductCategoriesDevice,
  classes: Record<ProductCategoriesDevice, string>,
) => {
  if (context === 'preview') {
    return classes[device];
  }

  return `${classes.mobile} md:${classes.tablet} lg:${classes.desktop}`;
};

const CategoryLink = ({
  href,
  context,
  className,
  style,
  children,
}: {
  href?: string;
  context: ProductCategoriesContext;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) => {
  if (context === 'site' && href) {
    return <Link href={href} className={className} style={style}>{children}</Link>;
  }

  return <div className={className} style={style}>{children}</div>;
};

export function ProductCategoriesSectionShared({
  title,
  subtitle,
  subheading,
  align = DEFAULT_ALIGN,
  headerAlign,
  hideHeader,
  showTitle,
  showSubtitle,
  titleColorPrimary,
  subtitleAboveTitle,
  uppercaseText,
  showBadge,
  badgeText,
  brandColor,
  style,
  items,
  colors,
  context,
  device = 'desktop',
  showProductCount = true,
  fontClassName,
  fontStyle,
  viewAllHref = '/products',
  getItemHref,
  renderImage,
}: ProductCategoriesSectionSharedProps) {
  const sectionTitle = title?.trim() || DEFAULT_TITLE;
  const sectionSubheading = (subtitle ?? subheading)?.trim() || '';
  const sectionAlign = headerAlign ?? align ?? DEFAULT_ALIGN;
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
  });
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(items.length > 1);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  React.useEffect(() => {
    if (!emblaApi) {
      return;
    }

    const updateScrollState = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
      setScrollSnaps(emblaApi.scrollSnapList());
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.reInit();
    updateScrollState();
    emblaApi.on('select', updateScrollState);
    emblaApi.on('reInit', updateScrollState);

    return () => {
      emblaApi.off('select', updateScrollState);
      emblaApi.off('reInit', updateScrollState);
    };
  }, [emblaApi, items.length, style, device, context]);

  const renderVisual = (
    item: ProductCategoriesResolvedItem,
    className: string,
    iconSize: number,
    imageClassName = className,
  ) => {
    const iconData = item.displayIcon ? getCategoryIcon(item.displayIcon) : null;

    if (item.displayIcon && iconData) {
      return (
        <div className={cn('flex h-full w-full items-center justify-center', className)} style={{ backgroundColor: colors.iconContainerBg }}>
          {React.createElement(iconData.icon, { size: iconSize, style: { color: colors.primary.solid } })}
        </div>
      );
    }

    if (item.displayImage) {
      if (renderImage) {
        return renderImage(item, imageClassName);
      }

      return <PreviewImage src={item.displayImage} alt={item.name} className={imageClassName} />;
    }

    return (
      <div className={cn('flex h-full w-full items-center justify-center bg-slate-100', className)}>
        <Package size={iconSize} className="text-slate-300" />
      </div>
    );
  };

  const renderHeader = (extraAction?: React.ReactNode) => {
    if (hideHeader) {
      return extraAction ? (
        <div className="mb-1 flex justify-end md:mb-2">
          {extraAction}
        </div>
      ) : null;
    }

    return (
      <div className="mb-5 md:mb-8">
        <SectionHeader
          title={sectionTitle}
          subtitle={sectionSubheading}
          showTitle={showTitle}
          showSubtitle={showSubtitle}
          headerAlign={sectionAlign}
          titleColorPrimary={titleColorPrimary ?? true}
          subtitleAboveTitle={subtitleAboveTitle}
          uppercaseText={uppercaseText}
          showBadge={showBadge}
          badgeText={badgeText}
          brandColor={brandColor ?? colors.primary.solid}
          className="mb-0"
        />
        {extraAction ? (
          <div className="mt-3 flex justify-start md:mt-4 md:justify-end">
            {extraAction}
          </div>
        ) : null}
      </div>
    );
  };

  const renderViewAllLink = () => (
    <CategoryLink
      href={viewAllHref}
      context={context}
      className="group inline-flex items-center gap-2 text-sm font-semibold whitespace-nowrap"
    >
      <span style={{ color: colors.primary.solid }}>Xem tất cả</span>
      <ArrowRight size={16} style={{ color: colors.primary.solid }} className="transition-transform duration-200 group-hover:translate-x-0.5" />
    </CategoryLink>
  );

  const renderDots = () => {
    if (scrollSnaps.length <= 1) return null;

    return (
      <div className="flex items-center justify-center gap-1.5 pt-3 md:pt-4">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Trang ${index + 1}`}
            onClick={() => emblaApi?.scrollTo(index)}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              index === selectedIndex
                ? 'w-4'
                : 'w-1.5 opacity-30 hover:opacity-50',
            )}
            style={{ backgroundColor: colors.primary.solid }}
          />
        ))}
      </div>
    );
  };

  const sectionVerticalSpacing = hideHeader ? 'py-4 md:py-6' : 'py-8 md:py-12';
  const compactSectionVerticalSpacing = hideHeader ? 'py-3 md:py-5' : 'py-6 md:py-10';
  const tightSectionVerticalSpacing = hideHeader ? 'py-3 md:py-4' : 'py-5 md:py-8';

  const titleClassName = getResponsiveClassName(context, device, {
    mobile: 'text-[12px]',
    tablet: 'text-[13px]',
    desktop: 'text-[14px]',
  });
  const countClassName = getResponsiveClassName(context, device, {
    mobile: 'text-[10px]',
    tablet: 'text-[11px]',
    desktop: 'text-[12px]',
  });

  const getSlideClassName = (currentStyle: ProductCategoriesStyle) => {
    const classNames = context === 'preview'
      ? PREVIEW_ONLY_SLIDE_BASIS_CLASSNAMES[currentStyle]
        ?? STYLE_SLIDE_BASIS_CLASSNAMES[currentStyle]
        ?? DEFAULT_SLIDE_BASIS_CLASSNAMES
      : SITE_SLIDE_BASIS_CLASSNAMES[currentStyle]
        ?? STYLE_SLIDE_BASIS_CLASSNAMES[currentStyle]
        ?? DEFAULT_SLIDE_BASIS_CLASSNAMES;

    return context === 'preview'
      ? classNames[device]
      : `${classNames.mobile} md:${classNames.tablet} lg:${classNames.desktop}`;
  };

  const renderSwipeRow = (
    currentStyle: ProductCategoriesStyle,
    renderCard: (item: ProductCategoriesResolvedItem) => React.ReactNode,
  ) => (
    <div className="overflow-hidden w-full pb-3" ref={emblaRef}>
      <div className="flex backface-hidden -ml-3 md:-ml-4 touch-pan-y items-stretch">
        {items.map((item) => (
          <div
            key={item.itemId}
            className={cn('flex h-full flex-none pl-3 md:pl-4 min-w-0', getSlideClassName(currentStyle))}
          >
            {renderCard(item)}
          </div>
        ))}
      </div>
    </div>
  );

  const renderMosaicSmallCard = (item: ProductCategoriesResolvedItem, className?: string) => (
    <CategoryLink
      key={item.itemId}
      href={getItemHref?.(item)}
      context={context}
      className={cn('group flex min-h-[76px] items-center justify-between gap-3 overflow-hidden rounded-lg bg-white px-3 py-2 transition-colors hover:bg-slate-50', className)}
      style={{ border: `1px solid ${colors.cardBorder}` }}
    >
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug" style={{ color: colors.categoryNameText }}>
          {item.name}
        </h3>
        {showProductCount ? (
          <p className="mt-1 text-xs" style={{ color: colors.productCountText }}>
            {item.productCount} sản phẩm
          </p>
        ) : null}
      </div>
      <div className="h-14 w-20 shrink-0 overflow-hidden rounded-md bg-white">
        {renderVisual(item, 'h-full w-full object-contain transition-transform duration-300 group-hover:scale-105', 26)}
      </div>
    </CategoryLink>
  );

  const renderMosaicFeaturedCard = (item: ProductCategoriesResolvedItem) => (
    <CategoryLink
      key={item.itemId}
      href={getItemHref?.(item)}
      context={context}
      className="group relative flex min-h-[280px] overflow-hidden rounded-lg bg-white"
      style={{ border: `1px solid ${colors.cardBorder}` }}
    >
      <div className="absolute inset-0">
        {renderVisual(item, 'h-full w-full object-contain p-8 transition-transform duration-500 group-hover:scale-105', 52)}
      </div>
      <div className="relative z-10 flex w-full flex-col items-center justify-start p-4 text-center">
        <h3 className="line-clamp-2 text-base font-bold leading-snug" style={{ color: colors.categoryNameText }}>
          {item.name}
        </h3>
        {showProductCount ? (
          <p className="mt-1 text-xs" style={{ color: colors.productCountText }}>
            {item.productCount} sản phẩm
          </p>
        ) : null}
      </div>
    </CategoryLink>
  );

  const renderCompactGridCard = (item: ProductCategoriesResolvedItem) => (
    <CategoryLink
      key={item.itemId}
      href={getItemHref?.(item)}
      context={context}
      className="group flex h-full min-w-0 flex-col items-center justify-between rounded-md bg-white px-2 py-3 text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm md:px-3 md:py-4"
    >
      <div
        className={cn(
          'flex w-full items-center justify-center overflow-hidden',
          getResponsiveClassName(context, device, {
            mobile: 'h-20',
            tablet: 'h-24',
            desktop: 'h-28',
          }),
        )}
      >
        {renderVisual(
          item,
          'h-full w-full object-contain',
          34,
          'h-full w-full object-contain transition-transform duration-300 group-hover:scale-105',
        )}
      </div>
      <div className="mt-3 flex min-h-[28px] max-w-full items-center justify-center rounded-md px-3 py-1.5" style={{ backgroundColor: colors.primary.solid }}>
        <h3 className={cn('break-words font-semibold leading-tight', titleClassName)} style={{ color: colors.primary.textOnSolid }}>
          {item.name}
        </h3>
      </div>
    </CategoryLink>
  );

  if (items.length === 0) {
    return (
      <section className={cn('w-full px-4 md:px-6', sectionVerticalSpacing, fontClassName)} style={fontStyle}>
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center rounded-[1.75rem] border px-6 py-12 text-center" style={{ borderColor: colors.cardBorder, backgroundColor: colors.emptyState.background }}>
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: colors.emptyState.iconBg }}>
              <Package size={30} style={{ color: colors.emptyState.icon }} />
            </div>
            {!hideHeader ? (
              <h3 className="mb-2 text-xl font-bold text-slate-900">{sectionTitle}</h3>
            ) : null}
            <p className="text-sm" style={{ color: colors.emptyState.text }}>Chưa có danh mục nào để hiển thị.</p>
          </div>
        </div>
      </section>
    );
  }

  if (style === 'grid') {
    return (
      <section className={cn('w-full px-4 md:px-6', sectionVerticalSpacing, fontClassName)} style={fontStyle}>
        <div className="mx-auto max-w-7xl">
          {renderHeader(renderViewAllLink())}
          {renderSwipeRow('grid', (item) => (
              <CategoryLink
                key={item.itemId}
                href={getItemHref?.(item)}
                context={context}
                className="group flex h-full flex-col items-center text-center"
              >
                <div
                  className={cn(
                    'relative mb-2 aspect-square w-full overflow-hidden rounded-full border-[3px] bg-white p-1 transition-transform duration-300 group-hover:-translate-y-1 md:mb-3 md:p-1.5',
                    getResponsiveClassName(context, device, {
                      mobile: 'max-w-[88px]',
                      tablet: 'max-w-[108px]',
                      desktop: 'max-w-[120px]',
                    }),
                  )}
                  style={{ borderColor: colors.primary.solid }}
                >
                  {renderVisual(item, 'rounded-full object-contain', 42, 'h-full w-full rounded-full object-contain transition-transform duration-500 group-hover:scale-105')}
                </div>
                <h3 className={cn('break-words whitespace-normal font-semibold leading-snug', showProductCount && 'min-h-[2.25rem]', titleClassName)} style={{ color: colors.categoryNameText }}>
                  {item.name}
                </h3>
                {showProductCount ? (
                  <p className={cn('mt-1', countClassName)} style={{ color: colors.productCountText }}>
                    {item.productCount} sản phẩm
                  </p>
                ) : null}
              </CategoryLink>
            ))}
          {renderDots()}
        </div>
      </section>
    );
  }

  if (style === 'carousel') {
    const shouldShowCarouselControls = items.length > 4;

    return (
      <section className={cn('w-full px-4 md:px-6', sectionVerticalSpacing, fontClassName)} style={fontStyle}>
        <div className="mx-auto max-w-7xl">
          {renderHeader(
            <div className="flex items-center gap-2">
              {shouldShowCarouselControls ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    aria-label="Cuộn trước"
                    onClick={() => emblaApi?.scrollPrev()}
                    disabled={!canScrollPrev}
                    className="flex h-10 w-10 items-center justify-center rounded-full border bg-white transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
                    style={{ borderColor: '#111111', color: '#111111' }}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    aria-label="Cuộn sau"
                    onClick={() => emblaApi?.scrollNext()}
                    disabled={!canScrollNext}
                    className="flex h-10 w-10 items-center justify-center rounded-full border bg-white transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
                    style={{ borderColor: '#111111', color: '#111111' }}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              ) : null}
              {renderViewAllLink()}
            </div>,
          )}
          <div className="relative">
            {renderSwipeRow('carousel', (item) => (
                <CategoryLink
                  key={item.itemId}
                  href={getItemHref?.(item)}
                  context={context}
                  className="group block h-full w-full"
                >
                  <article className={cn('flex h-full w-full flex-col overflow-hidden rounded-sm border bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg', showProductCount ? 'min-h-[236px] md:min-h-[284px]' : 'min-h-[212px] md:min-h-[256px]')} style={{ borderColor: '#111111' }}>
                    <div className="aspect-[3/4] w-full overflow-hidden bg-white p-2">
                      {renderVisual(item, 'h-full w-full object-cover rounded-sm', 36, 'h-full w-full rounded-sm object-cover transition-transform duration-500 group-hover:scale-105')}
                    </div>
                    <div className={cn('flex flex-1 flex-col justify-center border-t px-3 text-center md:px-4', showProductCount ? 'min-h-[72px] py-3 md:min-h-[92px] md:py-4' : 'min-h-[48px] py-2 md:min-h-[56px] md:py-2.5')} style={{ borderColor: '#111111' }}>
                      <h3 className={cn('break-words whitespace-normal font-bold uppercase tracking-[0.08em] leading-snug', showProductCount ? 'min-h-[2.6rem] md:min-h-[3rem]' : 'min-h-[1.8rem] md:min-h-[2rem]', titleClassName)} style={{ color: colors.categoryNameText }}>
                        {item.name}
                      </h3>
                      {showProductCount ? (
                        <p className={cn('mt-1', countClassName)} style={{ color: colors.productCountText }}>{item.productCount} sản phẩm</p>
                      ) : null}
                    </div>
                  </article>
                </CategoryLink>
            ))}
          </div>
          {renderDots()}
        </div>
      </section>
    );
  }

  if (style === 'cards') {
    return (
      <section className={cn('w-full px-4 md:px-6', sectionVerticalSpacing, fontClassName)} style={{ backgroundColor: colors.sectionBg, ...fontStyle }}>
        <div className="mx-auto max-w-7xl">
          {renderHeader(renderViewAllLink())}
          {renderSwipeRow('cards', (item) => (
              <CategoryLink
                key={item.itemId}
                href={getItemHref?.(item)}
                context={context}
                className="group block h-full w-full cursor-grab select-none active:cursor-grabbing"
              >
                <article className={cn('relative flex h-full w-full overflow-hidden rounded-[20px] border-[3px] bg-slate-900 shadow-xl shadow-slate-200/60 md:rounded-2xl', showProductCount ? 'min-h-[224px] md:min-h-[260px]' : 'min-h-[200px] md:min-h-[236px]')} style={{ borderColor: colors.primary.solid }}>
                  <div className="absolute inset-0">
                    {renderVisual(item, 'h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-65', 38)}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="relative z-10 mt-auto flex w-full min-w-0 flex-col items-start px-3 pb-3 pt-10 text-white md:px-5 md:pb-5 md:pt-12">
                    <h3 className="mb-2 break-words whitespace-normal text-[13px] font-bold leading-tight md:text-base">{item.name}</h3>
                    {showProductCount ? (
                      <p className="mb-3 text-[10px] md:text-xs" style={{ color: colors.secondaryAccent }}>{item.productCount} sản phẩm</p>
                    ) : null}
                    <span className="inline-flex min-h-[36px] items-center rounded-sm px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors md:min-h-[44px] md:px-4 md:text-xs" style={{ backgroundColor: colors.primary.solid, color: colors.buttonText }}>
                      Xem ngay
                    </span>
                  </div>
                </article>
              </CategoryLink>
            ))}
          {renderDots()}
        </div>
      </section>
    );
  }

  if (style === 'marquee') {
    return (
      <section className={cn('w-full px-4 md:px-6', sectionVerticalSpacing, fontClassName)} style={fontStyle}>
        <div className="mx-auto max-w-7xl rounded-xl bg-white">
          {renderHeader(renderViewAllLink())}
          <div
            className="rounded-lg"
          >
            {renderSwipeRow('marquee', (item) => (
              <CategoryLink
                key={item.itemId}
                href={getItemHref?.(item)}
                context={context}
                className={cn('group flex h-full cursor-grab flex-col items-center justify-start bg-white p-2 text-center transition-colors hover:bg-slate-50 active:cursor-grabbing md:p-3', showProductCount ? 'min-h-[176px] md:min-h-[196px]' : 'min-h-[148px] md:min-h-[164px]')}
              >
                <div className="mb-2 flex h-24 w-24 items-center justify-center overflow-hidden md:h-32 md:w-32">
                  {renderVisual(item, 'h-full w-full object-contain', 38, 'h-full w-full object-contain transition-transform duration-300 group-hover:-translate-y-1')}
                </div>
                <h3 className={cn('min-h-[3rem] break-words whitespace-normal font-medium leading-snug transition-colors', titleClassName)} style={{ color: colors.categoryNameText }}>
                  {item.name}
                </h3>
                {showProductCount ? (
                  <p className={cn('mt-1', countClassName)} style={{ color: colors.productCountText }}>{item.productCount} sản phẩm</p>
                ) : null}
              </CategoryLink>
            ))}
          </div>
          {renderDots()}
        </div>
      </section>
    );
  }

  if (style === 'icon-grid') {
    const colsClass = getResponsiveClassName(context, device, {
      mobile: 'grid-cols-3',
      tablet: 'grid-cols-3',
      desktop: 'grid-cols-8',
    });

    return (
      <section className={cn('w-full px-4 md:px-6', compactSectionVerticalSpacing, fontClassName)} style={fontStyle}>
        <div className="mx-auto max-w-7xl">
          {renderHeader(renderViewAllLink())}
          <div className={cn('grid gap-x-2 gap-y-1 md:gap-x-3 md:gap-y-1.5', colsClass)}>
            {items.map((item) => (
              <CategoryLink
                key={item.itemId}
                href={getItemHref?.(item)}
                context={context}
                className="group flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-50 md:gap-3 md:px-3 md:py-2"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden md:h-12 md:w-12">
                  {renderVisual(
                    item,
                    'h-full w-full object-contain',
                    22,
                    'h-full w-full object-contain transition-transform duration-300 group-hover:scale-110',
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3
                    className={cn(
                      'break-words whitespace-normal font-medium leading-tight',
                      titleClassName,
                    )}
                    style={{ color: colors.categoryNameText }}
                  >
                    {item.name}
                  </h3>
                  {showProductCount ? (
                    <p className={cn('mt-0.5', countClassName)} style={{ color: colors.productCountText }}>
                      {item.productCount} sản phẩm
                    </p>
                  ) : null}
                </div>
              </CategoryLink>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (style === 'mosaic') {
    const mosaicItems = items.slice(0, 9);
    const featuredItem = mosaicItems[4];
    const leftItems = mosaicItems.slice(0, 4);
    const rightItems = mosaicItems.slice(5, 9);
    const mobileItems = featuredItem
      ? [featuredItem, ...leftItems, ...rightItems]
      : mosaicItems;

    return (
      <section className={cn('w-full px-4 md:px-6', compactSectionVerticalSpacing, fontClassName)} style={fontStyle}>
        <div className="mx-auto max-w-7xl">
          {renderHeader(renderViewAllLink())}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:hidden">
            {mobileItems.map((item, index) => renderMosaicSmallCard(
              item,
              featuredItem && index === 0 ? 'col-span-2 md:col-span-1' : undefined,
            ))}
          </div>
          <div className="hidden gap-3 lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(180px,1fr)_minmax(0,2fr)]">
            <div className="grid grid-cols-2 grid-rows-2 gap-3">
              {leftItems.map((item) => renderMosaicSmallCard(item))}
            </div>
            {featuredItem ? renderMosaicFeaturedCard(featuredItem) : null}
            <div className="grid grid-cols-2 grid-rows-2 gap-3">
              {rightItems.map((item) => renderMosaicSmallCard(item))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (style === 'compact-grid') {
    // Literal classes so Tailwind v4 JIT detects: grid-cols-2 md:grid-cols-4 lg:grid-cols-7
    const colsClass = context === 'preview'
      ? { mobile: 'grid-cols-2', tablet: 'grid-cols-4', desktop: 'grid-cols-7' }[device]
      : 'grid-cols-2 md:grid-cols-4 lg:grid-cols-7';

    return (
      <section className={cn('w-full px-4 md:px-6', tightSectionVerticalSpacing, fontClassName)} style={{ backgroundColor: '#f3f4f6', ...fontStyle }}>
        <div className="mx-auto max-w-7xl">
          {renderHeader(renderViewAllLink())}
          <div className={cn('grid gap-2 md:gap-3', colsClass)}>
            {items.map(renderCompactGridCard)}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={cn('w-full px-4 md:px-6', sectionVerticalSpacing, fontClassName)} style={fontStyle}>
      <div className="mx-auto max-w-7xl rounded-2xl p-4 md:p-6" style={{ backgroundColor: colors.showcaseBackground }}>
        {renderHeader(renderViewAllLink())}
        {renderSwipeRow('circular', (item) => (
            <CategoryLink
              key={item.itemId}
              href={getItemHref?.(item)}
              context={context}
              className="group block h-full cursor-grab select-none active:cursor-grabbing"
            >
              <article className={cn('flex h-full flex-col overflow-hidden rounded-xl bg-white p-2 text-center shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_-3px_rgba(6,81,237,0.15)] md:p-3', showProductCount ? 'min-h-[208px] md:min-h-[244px]' : 'min-h-[176px] md:min-h-[208px]')}>
                <div className="mb-3 flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-white p-0">
                  {renderVisual(item, 'h-[95%] w-[95%] rounded-sm object-cover transition-transform duration-500 group-hover:scale-110', 40)}
                </div>
                <div className={cn('mt-auto flex flex-col justify-start', showProductCount ? 'min-h-[56px]' : 'min-h-[32px]')}>
                  <h3 className={cn('break-words whitespace-normal font-bold leading-tight', titleClassName)} style={{ color: colors.neutral.text }}>
                    {item.name}
                  </h3>
                  {showProductCount ? (
                    <p className={cn('mt-1', countClassName)} style={{ color: colors.productCountText }}>{item.productCount} sản phẩm</p>
                  ) : null}
                </div>
              </article>
            </CategoryLink>
          ))}
        {renderDots()}
      </div>
    </section>
  );
}

export const getProductCategoriesPreviewInfo = ({
  count,
  style,
  mode,
}: {
  count: number;
  style: ProductCategoriesStyle;
  mode: ProductCategoriesBrandMode;
}) => {
  const modeLabel = mode === 'dual' ? '2 màu' : '1 màu';
  if (count === 0) {
    return `Chưa có danh mục • ${modeLabel}`;
  }

  const map: Record<ProductCategoriesStyle, string> = {
    grid: `${count} danh mục • Ảnh/icon tròn 400×400px • ${modeLabel}`,
    carousel: `${count} danh mục • Ảnh dọc 600×800px • ${modeLabel}`,
    cards: `${count} danh mục • Ảnh phủ 800×1000px • ${modeLabel}`,
    marquee: `${count} danh mục • Ảnh object-contain 300×300px • ${modeLabel}`,
    circular: `${count} danh mục • Ảnh premium 600×600px • ${modeLabel}`,
    'icon-grid': `${count} danh mục • Ảnh cutout nhỏ 80×80px • ${modeLabel}`,
    mosaic: `${Math.min(count, 9)} / 9 danh mục • Mosaic 9 ô • ${modeLabel}`,
    'compact-grid': `${count} danh mục • Grid card gọn 2/4/7 cột • ${modeLabel}`,
  };

  return map[style];
};

export const ProductCategoriesPreviewHint = ({
  style,
}: {
  style: ProductCategoriesStyle;
}) => {
  const content: Record<ProductCategoriesStyle, string> = {
    grid: '400×400px (1:1) • Avatar tròn tinh tế, ưu tiên sản phẩm/icon rõ nền sáng.',
    carousel: '600×800px (3:4) • Ảnh dọc kiểu catalogue/book card cho layout ngang.',
    cards: '800×1000px (4:5) • Ảnh lifestyle hoặc category cover, overlay CTA trên ảnh.',
    marquee: '300×300px (1:1) • Ảnh object-contain cho grid ô vuông sạch và đều.',
    circular: '600×600px (1:1) • Ảnh vuông sắc nét cho grid premium card lớn.',
    'icon-grid': '80×80px • Ảnh sản phẩm cutout nền trắng, grid gọn gàng 8 cột.',
    mosaic: '9 danh mục • 4 ô trái + 1 ô lớn giữa + 4 ô phải; nếu nhiều hơn sẽ chỉ hiển thị 9.',
    'compact-grid': '300×300px (1:1) • Card trắng gọn, ảnh object-contain và nhãn dùng màu chính với chữ tương phản; mobile 2 cột, tablet 4 cột, desktop 7 cột.',
  };

  return (
    <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
      <div className="flex items-start gap-2">
        <ImageIcon size={14} className="mt-0.5 flex-shrink-0 text-slate-400" />
        <p>{content[style]}</p>
      </div>
    </div>
  );
};
