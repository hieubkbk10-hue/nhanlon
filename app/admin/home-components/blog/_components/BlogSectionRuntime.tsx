'use client';

import React from 'react';
import Link from 'next/link';
import { AdminImage } from '@/app/admin/components/AdminImage';
import { PublicImage } from '@/components/shared/PublicImage';
import { ArrowRight, ArrowUpRight, Calendar, ChevronRight, FileText, Newspaper } from 'lucide-react';
import { cn } from '../../../components/ui';
import { SectionHeader } from '../../_shared/components/SectionHeader';
import type { BlogColorTokens } from '../_lib/colors';
import type { BlogPreviewItem, BlogStyle } from '../_types';

type BlogSectionContext = 'preview' | 'site';
type PreviewDevice = 'desktop' | 'tablet' | 'mobile';
type BlogBreakpoint = 'mobile' | 'tablet' | 'desktop';

interface BlogSectionRuntimeProps {
  items: BlogPreviewItem[];
  title?: string;
  subtitle?: string;
  style: BlogStyle;
  tokens: BlogColorTokens;
  context: BlogSectionContext;
  device?: PreviewDevice;
  showAuthor?: boolean;
  showExcerpt?: boolean;
  showDate?: boolean;
  viewAllHref?: string;
  getItemHref?: (item: BlogPreviewItem) => string;
  fontClassName?: string;
  fontStyle?: React.CSSProperties;
  // Header config (shared SectionHeader)
  hideHeader?: boolean;
  showTitleHeader?: boolean;
  showSubtitleHeader?: boolean;
  showBadge?: boolean;
  badgeText?: string;
  headerAlign?: 'left' | 'center' | 'right';
  titleColorPrimary?: boolean;
  subtitleAboveTitle?: boolean;
  uppercaseText?: boolean;
  // Grid columns
  desktopColumns?: 3 | 4;
}

const FALLBACK_TITLE = 'Tin tức mới nhất';

const getPreviewLimit = (style: BlogStyle, _device: PreviewDevice) => {
  if (style === 'layout5') {
    return 8;
  }

  if (style === 'layout3') {
    return 5;
  }

  if (style === 'layout4' || style === 'layout6' || style === 'layout7') {
    return 3;
  }

  return 4;
};

export const getBlogVisibleItemLimit = (
  style: BlogStyle,
  context: BlogSectionContext,
  device: PreviewDevice,
) => {
  if (context === 'site') {
    return getPreviewLimit(style, 'desktop');
  }

  return getPreviewLimit(style, device);
};

const getBlogBreakpoint = (context: BlogSectionContext, device: PreviewDevice): BlogBreakpoint => {
  if (context === 'preview') {
    return device;
  }

  return 'desktop';
};

const getOuterShellClassName = (_style: BlogStyle) => {
  const baseShell = 'mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8';
  return baseShell;
};

const getResponsiveClassName = (
  context: BlogSectionContext,
  breakpoint: BlogBreakpoint,
  classes: Record<BlogBreakpoint, string>,
) => {
  if (context === 'preview') {
    return classes[breakpoint];
  }

  return `${classes.mobile} md:${classes.tablet} lg:${classes.desktop}`;
};

const toText = (value?: string) => {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : undefined;
};

const resolveDate = (item: BlogPreviewItem) => {
  if (item.date && item.date.trim().length > 0) {return item.date;}
  return undefined;
};

const ImageView = ({
  item,
  alt,
  sizes,
  context,
  className,
}: {
  item: BlogPreviewItem;
  alt: string;
  sizes: string;
  context: BlogSectionContext;
  className?: string;
}) => {
  if (!item.thumbnail) {
    return (
      <div className={cn('w-full h-full flex items-center justify-center', className)}>
        <FileText size={28} className="text-slate-400" />
      </div>
    );
  }

  if (context === 'preview') {
    return <AdminImage src={item.thumbnail} alt={alt} fill className={cn('object-cover', className)} sizes={sizes} />;
  }

  return <PublicImage mode="thumb" src={item.thumbnail} alt={alt} fill className={cn('object-cover', className)} sizes={sizes} />;
};

const resolveCategoryLabel = (category?: string) => {
  const normalized = category?.trim();
  return normalized && normalized.length > 0 ? normalized : 'Tin tức';
};

const renderViewAll = ({
  context,
  href,
  className,
  children,
}: {
  context: BlogSectionContext;
  href: string;
  className?: string;
  children: React.ReactNode;
}) => {
  if (context === 'site') {
    return <Link href={href} className={className}>{children}</Link>;
  }

  return <div className={className}>{children}</div>;
};

const ItemLink = ({
  item,
  href,
  context,
  className,
  children,
}: {
  item: BlogPreviewItem;
  href?: string;
  context: BlogSectionContext;
  className?: string;
  children: React.ReactNode;
}) => {
  if (context === 'site' && href) {
    return <Link href={href} className={className}>{children}</Link>;
  }
  return <div className={className} data-item-id={item.id}>{children}</div>;
};

export function BlogSectionRuntime({
  items,
  title,
  subtitle,
  style,
  tokens,
  context,
  device = 'desktop',
  showAuthor = true,
  showExcerpt = true,
  showDate = true,
  viewAllHref = '/posts',
  getItemHref,
  fontClassName,
  fontStyle,
  // Header config
  hideHeader = false,
  showTitleHeader = true,
  showSubtitleHeader = true,
  showBadge = true,
  badgeText = '',
  headerAlign = 'left',
  titleColorPrimary = false,
  subtitleAboveTitle = false,
  uppercaseText = false,
  // Grid columns
  desktopColumns = 4,
}: BlogSectionRuntimeProps) {
  const breakpoint = getBlogBreakpoint(context, device);
  const layout4PageSize = desktopColumns;
  const layout5PageSize = desktopColumns === 3 ? 6 : 8;
  const layout6PageSize = desktopColumns;
  const layout7PageSize = 3;
  const visibleItems = React.useMemo(
    () => items.slice(0, getBlogVisibleItemLimit(style, context, device)),
    [context, device, items, style],
  );
  const [layout4Page, setLayout4Page] = React.useState(0);
  const [layout5Page, setLayout5Page] = React.useState(0);
  const [layout6Page, setLayout6Page] = React.useState(0);
  const [layout7Page, setLayout7Page] = React.useState(0);
  const layout4Items = React.useMemo(
    () => (style === 'layout4' ? items : visibleItems),
    [items, style, visibleItems],
  );
  const layout5Items = React.useMemo(
    () => (style === 'layout5' ? items : visibleItems),
    [items, style, visibleItems],
  );
  const layout6Items = React.useMemo(
    () => (style === 'layout6' ? items : visibleItems),
    [items, style, visibleItems],
  );
  const layout7Items = React.useMemo(
    () => (style === 'layout7' ? items : visibleItems),
    [items, style, visibleItems],
  );
  const layout4TotalPages = React.useMemo(
    () => (style === 'layout4' ? Math.ceil(layout4Items.length / layout4PageSize) : 1),
    [layout4Items.length, style],
  );
  const layout5TotalPages = React.useMemo(
    () => (style === 'layout5' ? Math.ceil(layout5Items.length / layout5PageSize) : 1),
    [layout5Items.length, style],
  );
  const layout6TotalPages = React.useMemo(
    () => (style === 'layout6' ? Math.ceil(layout6Items.length / layout6PageSize) : 1),
    [layout6Items.length, style],
  );
  const layout7TotalPages = React.useMemo(
    () => (style === 'layout7' ? Math.ceil(layout7Items.length / layout7PageSize) : 1),
    [layout7Items.length, style],
  );
  const layout4CanPaginate = style === 'layout4' && layout4Items.length > layout4PageSize;
  const layout5CanPaginate = style === 'layout5' && layout5Items.length > layout5PageSize;
  const layout6CanPaginate = style === 'layout6' && layout6Items.length > layout6PageSize;
  const layout7CanPaginate = style === 'layout7' && layout7Items.length > layout7PageSize;
  const layout4PagedItems = React.useMemo(() => {
    if (style !== 'layout4') {
      return visibleItems;
    }

    const startIndex = layout4Page * layout4PageSize;
    return layout4Items.slice(startIndex, startIndex + layout4PageSize);
  }, [layout4Items, layout4Page, style, visibleItems]);
  const layout5PagedItems = React.useMemo(() => {
    if (style !== 'layout5') {
      return visibleItems;
    }

    const startIndex = layout5Page * layout5PageSize;
    return layout5Items.slice(startIndex, startIndex + layout5PageSize);
  }, [layout5Items, layout5Page, style, visibleItems]);
  const layout6PagedItems = React.useMemo(() => {
    if (style !== 'layout6') {
      return visibleItems;
    }

    const startIndex = layout6Page * layout6PageSize;
    return layout6Items.slice(startIndex, startIndex + layout6PageSize);
  }, [layout6Items, layout6Page, style, visibleItems, layout6PageSize]);
  const layout7PagedItems = React.useMemo(() => {
    if (style !== 'layout7') {
      return visibleItems;
    }

    const startIndex = layout7Page * layout7PageSize;
    return layout7Items.slice(startIndex, startIndex + layout7PageSize);
  }, [layout7Items, layout7Page, style, visibleItems]);
  const layout1Categories = React.useMemo(
    () => Array.from(new Set(items.map((item) => resolveCategoryLabel(item.category)))),
    [items],
  );
  const [activeLayout1Category, setActiveLayout1Category] = React.useState<string | undefined>(layout1Categories[0]);

  React.useEffect(() => {
    if (layout1Categories.length === 0) {
      setActiveLayout1Category(undefined);
      return;
    }

    setActiveLayout1Category((current) => (
      current && layout1Categories.includes(current)
        ? current
        : layout1Categories[0]
    ));
  }, [layout1Categories]);

  React.useEffect(() => {
    if (style !== 'layout4') {
      if (layout4Page !== 0) {
        setLayout4Page(0);
      }
      return;
    }

    const lastPage = Math.max(layout4TotalPages - 1, 0);
    if (layout4Page > lastPage) {
      setLayout4Page(lastPage);
    }
  }, [layout4Page, layout4TotalPages, style]);

  React.useEffect(() => {
    if (style !== 'layout5') {
      if (layout5Page !== 0) {
        setLayout5Page(0);
      }
      return;
    }

    const lastPage = Math.max(layout5TotalPages - 1, 0);
    if (layout5Page > lastPage) {
      setLayout5Page(lastPage);
    }
  }, [layout5Page, layout5TotalPages, style]);

  React.useEffect(() => {
    if (style !== 'layout6') {
      if (layout6Page !== 0) {
        setLayout6Page(0);
      }
      return;
    }

    const lastPage = Math.max(layout6TotalPages - 1, 0);
    if (layout6Page > lastPage) {
      setLayout6Page(lastPage);
    }
  }, [layout6Page, layout6TotalPages, style]);

  React.useEffect(() => {
    if (style !== 'layout7') {
      if (layout7Page !== 0) {
        setLayout7Page(0);
      }
      return;
    }

    const lastPage = Math.max(layout7TotalPages - 1, 0);
    if (layout7Page > lastPage) {
      setLayout7Page(lastPage);
    }
  }, [layout7Page, layout7TotalPages, style]);

  const layout1Items = React.useMemo(() => {
    if (style !== 'layout1') {
      return visibleItems;
    }

    const filteredItems = activeLayout1Category
      ? items.filter((item) => resolveCategoryLabel(item.category) === activeLayout1Category)
      : items;

    return filteredItems.slice(0, getBlogVisibleItemLimit(style, context, device));
  }, [activeLayout1Category, context, device, items, style, visibleItems]);

  const sectionTitle = toText(title) ?? FALLBACK_TITLE;
  const sectionSubtitle = toText(subtitle);
  const outerShellClassName = getOuterShellClassName(style);

  // Shared SectionHeader rendering for all layouts
  const renderSectionHeader = (className?: string) => {
    if (hideHeader) { return null; }
    return (
      <SectionHeader
        title={sectionTitle}
        subtitle={sectionSubtitle}
        badgeText={badgeText}
        hideHeader={hideHeader}
        showTitle={showTitleHeader}
        showSubtitle={showSubtitleHeader}
        showBadge={showBadge}
        headerAlign={headerAlign}
        titleColorPrimary={titleColorPrimary}
        subtitleAboveTitle={subtitleAboveTitle}
        uppercaseText={uppercaseText}
        brandColor={tokens.primary.solid}
        className={className}
      />
    );
  };
  const _hasHeaderConfig = !!(badgeText || subtitle);
  const layout14GridClassName = getResponsiveClassName(context, breakpoint, desktopColumns === 3
    ? { desktop: 'grid-cols-3', tablet: 'grid-cols-3', mobile: 'grid-cols-1' }
    : { desktop: 'grid-cols-4', tablet: 'grid-cols-2', mobile: 'grid-cols-2' }
  );
  const layout46GridClassName = getResponsiveClassName(context, breakpoint, desktopColumns === 3
    ? { desktop: 'grid-cols-3', tablet: 'grid-cols-3', mobile: 'grid-cols-1' }
    : { desktop: 'grid-cols-4', tablet: 'grid-cols-2', mobile: 'grid-cols-2' }
  );
  const layout7GridClassName = getResponsiveClassName(context, breakpoint, {
    desktop: 'grid-cols-3',
    tablet: 'grid-cols-2',
    mobile: 'grid-cols-1',
  });
  const layout3GridClassName = getResponsiveClassName(context, breakpoint, {
    desktop: 'grid-cols-2',
    tablet: 'grid-cols-2',
    mobile: 'grid-cols-1',
  });
  const layout3ItemGapClassName = getResponsiveClassName(context, breakpoint, {
    desktop: 'gap-6',
    tablet: 'gap-6',
    mobile: 'gap-3',
  });
  const layout3ListGapClassName = getResponsiveClassName(context, breakpoint, {
    desktop: 'gap-8',
    tablet: 'gap-6',
    mobile: 'gap-4',
  });
  const layout3ThumbWidthClassName = getResponsiveClassName(context, breakpoint, {
    desktop: 'w-32',
    tablet: 'w-28',
    mobile: 'w-24',
  });
  const layout3TitleClassName = getResponsiveClassName(context, breakpoint, {
    desktop: 'text-lg',
    tablet: 'text-base',
    mobile: 'text-base',
  });
  const layout3ExcerptClampClassName = getResponsiveClassName(context, breakpoint, {
    desktop: 'line-clamp-3',
    tablet: 'line-clamp-2',
    mobile: 'line-clamp-2',
  });
  const _layout4HeaderClassName = getResponsiveClassName(context, breakpoint, {
    desktop: 'flex-row items-end justify-between',
    tablet: 'flex-row items-end justify-between',
    mobile: 'flex-col items-start',
  });
  const _layoutTextScaleClassName = getResponsiveClassName(context, breakpoint, {
    desktop: 'text-5xl',
    tablet: 'text-4xl',
    mobile: 'text-3xl',
  });
  const layoutButtonRowClassName = getResponsiveClassName(context, breakpoint, {
    desktop: 'flex-row items-center justify-between gap-3',
    tablet: 'flex-row items-center justify-between gap-3',
    mobile: 'flex-col items-start gap-3',
  });
  const layoutDetailButtonClassName = getResponsiveClassName(context, breakpoint, {
    desktop: 'px-4 text-xs',
    tablet: 'px-4 text-xs',
    mobile: 'px-3 text-[10px]',
  });
  const layoutDateTextClassName = getResponsiveClassName(context, breakpoint, {
    desktop: 'text-xs',
    tablet: 'text-xs',
    mobile: 'text-[10px]',
  });
  const layout5WrapperPaddingClassName = getResponsiveClassName(context, breakpoint, {
    desktop: 'p-8',
    tablet: 'p-6',
    mobile: 'p-4',
  });
  const layout5GapClassName = getResponsiveClassName(context, breakpoint, {
    desktop: 'gap-x-6 gap-y-8',
    tablet: 'gap-x-6 gap-y-8',
    mobile: 'gap-x-3 gap-y-5',
  });
  const layout5TitleClassName = getResponsiveClassName(context, breakpoint, {
    desktop: 'text-base',
    tablet: 'text-base',
    mobile: 'text-sm',
  });
  const layout6WrapperPaddingClassName = getResponsiveClassName(context, breakpoint, {
    desktop: 'p-8',
    tablet: 'p-6',
    mobile: 'p-4',
  });
  const hasDisplayItems =
    style === 'layout4' ? layout4Items.length > 0
      : style === 'layout5' ? layout5Items.length > 0
        : style === 'layout6' ? layout6Items.length > 0
          : style === 'layout7' ? layout7Items.length > 0
            : visibleItems.length > 0;

  if (!hasDisplayItems) {
    return (
      <section className={cn('px-4 py-8 md:py-10', fontClassName)} style={{ backgroundColor: tokens.sectionBg, ...fontStyle }}>
        <div className={outerShellClassName}>
          <div className="rounded-3xl border px-6 py-10 text-center" style={{ backgroundColor: tokens.cardBg, borderColor: tokens.cardBorder }}>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: tokens.imageFallbackBg }}>
              <Newspaper size={28} style={{ color: tokens.imageFallbackIcon }} />
            </div>
            <h3 className="mb-2 text-2xl font-bold" style={{ color: tokens.heading }}>{sectionTitle}</h3>
            <p style={{ color: tokens.mutedText }}>Chưa có bài viết nào để hiển thị.</p>
          </div>
        </div>
      </section>
    );
  }

  const getHref = (item: BlogPreviewItem) => getItemHref?.(item);

  if (style === 'layout1') {
    return (
      <section className={cn('px-4 py-8 md:py-10', fontClassName)} style={{ backgroundColor: tokens.sectionBg, ...fontStyle }}>
        <div className={outerShellClassName}>
          {renderSectionHeader('mb-8')}
          <div className="mb-8 text-center">
            {layout1Categories.length > 1 ? (
              <div className="flex flex-wrap justify-center gap-4">
                {layout1Categories.map((category) => {
                  const isActive = category === activeLayout1Category;

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => { setActiveLayout1Category(category); }}
                      className={cn(
                        'rounded-md px-6 py-2 font-medium whitespace-nowrap shadow-sm transition-colors',
                        isActive ? 'text-white' : 'bg-white',
                      )}
                      style={isActive
                        ? { backgroundColor: tokens.primary.solid }
                        : { color: tokens.primary.solid }}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          <div className={cn('mb-8 grid gap-3 md:gap-6', layout14GridClassName)}>
            {layout1Items.map((item) => (
              <ItemLink key={item.id} item={item} href={getHref(item)} context={context} className="group">
                <article className="flex h-full flex-col border bg-white shadow-sm transition-shadow hover:shadow-md" style={{ borderColor: tokens.cardBorder, backgroundColor: tokens.cardBg }}>
                  <div className="relative aspect-[3/2] w-full overflow-hidden">
                    <ImageView item={item} alt={item.title} sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw" context={context} className="transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="flex flex-1 flex-col px-2.5 py-3 md:p-5">
                    <h3 className="mb-2 line-clamp-2 text-sm font-bold leading-snug text-slate-900 md:text-base" style={{ color: tokens.bodyText }}>{item.title}</h3>
                    {showExcerpt && item.excerpt ? (
                      <p className="mb-4 line-clamp-2 flex-1 text-xs text-slate-500 md:mb-6 md:line-clamp-3 md:text-sm" style={{ color: tokens.mutedText }}>{item.excerpt}</p>
                    ) : <div className="flex-1" />}
                    <div className={cn('mt-auto flex border-t pt-3', layoutButtonRowClassName)} style={{ borderColor: tokens.cardBorder }}>
                      {showDate ? (
                        <div className={cn('flex items-center gap-1.5', layoutDateTextClassName)} style={{ color: tokens.mutedText }}>
                          <Calendar size={14} />
                          <span>{resolveDate(item)}</span>
                        </div>
                      ) : <div />}
                      <button type="button" className={cn('rounded-full py-1.5 font-semibold', layoutDetailButtonClassName)} style={{ backgroundColor: tokens.primary.solid, color: tokens.primary.textOnSolid }}>
                        Đọc ngay
                      </button>
                    </div>
                  </div>
                </article>
              </ItemLink>
            ))}
          </div>

          {renderViewAll({
            context,
            href: viewAllHref,
            className: 'flex w-full justify-center',
            children: (
              <div className="flex w-full items-center justify-center gap-1 border-t py-3 font-semibold transition-colors" style={{ borderColor: tokens.cardBorder, color: tokens.primary.solid }}>
                Xem tất cả <ChevronRight size={16} />
              </div>
            ),
          })}
        </div>
      </section>
    );
  }

  if (style === 'layout2') {
    return (
      <section className={cn('px-4 py-8 md:py-10', fontClassName)} style={{ backgroundColor: tokens.sectionBg, ...fontStyle }}>
        <div className={outerShellClassName}>
          {renderSectionHeader('mb-8')}

          <div className={cn('mb-8 grid gap-3 md:gap-6', layout14GridClassName)}>
            {visibleItems.slice(0, 4).map((item) => (
              <ItemLink key={item.id} item={item} href={getHref(item)} context={context} className="group cursor-pointer pb-3 md:pb-4">
                <article className={cn('flex h-full flex-col', breakpoint === 'mobile' ? 'border-b' : 'border-b-0')} style={{ borderColor: tokens.cardBorder }}>
                  <div className="relative mb-3 md:mb-4 aspect-[4/3] w-full overflow-hidden rounded-sm border bg-slate-100" style={{ borderColor: `${tokens.cardBorder}80` }}>
                    <ImageView item={item} alt={item.title} sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw" context={context} className="transition-transform duration-300 group-hover:scale-105" />
                    {showDate && resolveDate(item) ? (
                      <div className="absolute left-3 top-3 px-2 py-1 text-center text-white shadow-sm" style={{ backgroundColor: tokens.secondary.solid }}>
                        <div className="text-lg font-bold leading-none">{resolveDate(item)?.split('/')[0] ?? ''}</div>
                        <div className="text-[10px] font-medium leading-tight">{resolveDate(item)?.split('/').slice(1).join('/') ?? ''}</div>
                      </div>
                    ) : null}
                  </div>
                  <h3 className={cn('mb-2 line-clamp-2 text-base font-bold transition-colors', breakpoint !== 'mobile' && 'line-clamp-1')} style={{ color: tokens.bodyText }}>{item.title}</h3>
                  {showExcerpt && item.excerpt ? (
                    <p className="line-clamp-3 text-sm leading-relaxed" style={{ color: tokens.mutedText }}>{item.excerpt}</p>
                  ) : null}
                </article>
              </ItemLink>
            ))}
          </div>

          {renderViewAll({
            context,
            href: viewAllHref,
            className: 'mt-2 flex justify-center',
            children: (
              <span className="rounded px-8 py-2.5 font-bold text-white" style={{ backgroundColor: tokens.secondary.solid }}>
                Xem tất cả
              </span>
            ),
          })}
        </div>
      </section>
    );
  }

  if (style === 'layout3') {
    const [featuredItem, ...listItems] = visibleItems;

    return (
      <section className={cn('px-4 py-8 md:py-10', fontClassName)} style={{ backgroundColor: tokens.sectionBg, ...fontStyle }}>
        <div className={outerShellClassName}>
          {renderSectionHeader('mb-6')}

          <div className={cn('grid gap-6', layout3GridClassName, breakpoint === 'desktop' && 'md:gap-8 lg:gap-12')}>
            {featuredItem ? (
              <ItemLink item={featuredItem} href={getHref(featuredItem)} context={context} className="group flex flex-col">
                <article className="flex flex-col">
                  <div className="relative mb-6 aspect-[4/3] w-full overflow-hidden rounded-sm bg-slate-100">
                    <ImageView item={featuredItem} alt={featuredItem.title} sizes="(min-width: 768px) 50vw, 100vw" context={context} className="transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold leading-snug md:text-2xl" style={{ color: tokens.primary.solid }}>{featuredItem.title}</h3>
                  {showDate && resolveDate(featuredItem) ? (
                    <p className="mb-3 text-sm font-medium" style={{ color: tokens.bodyText }}>{resolveDate(featuredItem)}</p>
                  ) : null}
                  {showExcerpt && featuredItem.excerpt ? (
                    <p className="mt-3 line-clamp-3 leading-relaxed" style={{ color: tokens.mutedText }}>{featuredItem.excerpt}</p>
                  ) : null}
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium" style={{ color: tokens.bodyText }}>
                    Xem thêm <ArrowRight size={16} />
                  </span>
                </article>
              </ItemLink>
            ) : null}

            <div className={cn('flex flex-col', layout3ListGapClassName)}>
              {listItems.slice(0, 4).map((item) => (
                <ItemLink key={item.id} item={item} href={getHref(item)} context={context} className="group cursor-pointer">
                  <article className={cn('flex', layout3ItemGapClassName)}>
                    <div className={cn('relative aspect-square shrink-0 overflow-hidden rounded-sm bg-slate-100', layout3ThumbWidthClassName)}>
                      <ImageView item={item} alt={item.title} sizes="128px" context={context} className="transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <h4 className={cn('mb-2 line-clamp-2 font-bold', layout3TitleClassName)} style={{ color: tokens.primary.solid }}>{item.title}</h4>
                      {showDate && resolveDate(item) ? (
                        <p className="mb-2 text-xs font-medium" style={{ color: tokens.bodyText }}>{resolveDate(item)}</p>
                      ) : null}
                      {showExcerpt && item.excerpt ? (
                        <p className={cn('text-sm', layout3ExcerptClampClassName)} style={{ color: tokens.mutedText }}>{item.excerpt}</p>
                      ) : null}
                    </div>
                  </article>
                </ItemLink>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (style === 'layout4') {
    const canGoToPreviousLayout4Page = layout4Page > 0;
    const canGoToNextLayout4Page = layout4Page < layout4TotalPages - 1;

    return (
      <section className={cn('px-4 py-8 md:py-10', fontClassName)} style={{ backgroundColor: tokens.sectionBg, ...fontStyle, '--token-primary': tokens.primary.solid, '--token-secondary-text': tokens.secondary.solid } as React.CSSProperties}>
        <div className={cn(outerShellClassName, 'flex flex-col items-start')}>
          <div className="mb-6 md:mb-8 w-full">
            {renderSectionHeader('mb-0')}
            {layout4CanPaginate ? (
              <div className="flex justify-end items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => { setLayout4Page((current) => Math.max(current - 1, 0)); }}
                  disabled={!canGoToPreviousLayout4Page}
                  aria-label="Trang trước"
                  className={cn(
                    'w-8 h-8 md:w-10 md:h-10 rounded-full border flex items-center justify-center transition-colors',
                    canGoToPreviousLayout4Page ? 'border-slate-200 hover:bg-slate-50' : 'border-slate-100 opacity-40 cursor-not-allowed',
                  )}
                >
                  <ChevronRight size={18} className="rotate-180" style={{ color: canGoToPreviousLayout4Page ? tokens.primary.solid : undefined }} />
                </button>
                <button
                  type="button"
                  onClick={() => { setLayout4Page((current) => Math.min(current + 1, layout4TotalPages - 1)); }}
                  disabled={!canGoToNextLayout4Page}
                  aria-label="Trang sau"
                  className={cn(
                    'w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors',
                    canGoToNextLayout4Page ? 'text-white' : 'opacity-40 cursor-not-allowed border border-slate-100',
                  )}
                  style={canGoToNextLayout4Page ? { backgroundColor: tokens.primary.solid } : undefined}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            ) : null}
          </div>

          <div className={cn('mb-8 md:mb-10 grid w-full gap-5 md:gap-6', layout46GridClassName)}>
            {layout4PagedItems.map((item) => (
              <ItemLink key={item.id} item={item} href={getHref(item)} context={context} className="group cursor-pointer bg-white">
                <article className="flex flex-col bg-white">
                  <div
                    className="relative z-0 mb-6 aspect-[4/3] overflow-hidden rounded-[2rem] border bg-slate-100"
                    style={{ borderColor: tokens.cardBorder }}
                  >
                    <ImageView item={item} alt={item.title} sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" context={context} className="transition-transform duration-700 group-hover:scale-105" />
                    {showDate && resolveDate(item) ? (
                      <div className="absolute bottom-4 right-4 rounded-full bg-black px-4 py-1.5 text-xs font-bold text-white shadow-lg">
                        {resolveDate(item)}
                      </div>
                    ) : null}
                  </div>
                  <div className="px-2">
                    <h3 className="mb-2 line-clamp-2 text-lg font-bold leading-tight transition-colors group-hover:text-[var(--token-primary)]" style={{ color: tokens.bodyText }}>
                      {item.title}
                    </h3>
                    {showAuthor && item.author ? (
                      <p className="mb-3 flex items-center gap-1 text-xs text-slate-500">
                        Đăng bởi: <span style={{ color: tokens.primary.solid }}>{item.author}</span>
                      </p>
                    ) : null}
                    {showExcerpt && item.excerpt ? (
                      <p className="mb-4 line-clamp-2 text-sm leading-relaxed" style={{ color: tokens.mutedText }}>{item.excerpt}</p>
                    ) : null}
                    <span className="text-sm font-bold transition-colors group-hover:text-[var(--token-primary)]" style={{ color: tokens.bodyText }}>
                      Đọc tiếp › ›
                    </span>
                  </div>
                </article>
              </ItemLink>
            ))}
          </div>

          {renderViewAll({
            context,
            href: viewAllHref,
            className: 'flex w-full justify-center',
            children: (
              <div className="flex items-center gap-3 rounded-full py-2 pl-6 pr-2 font-bold uppercase text-white shadow-md transition-opacity hover:opacity-90" style={{ backgroundColor: tokens.primary.solid }}>
                XEM TẤT CẢ
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black">
                  <ArrowUpRight size={16} style={{ color: tokens.primary.solid }} />
                </div>
              </div>
            ),
          })}
        </div>
      </section>
    );
  }

  if (style === 'layout5') {
    const canGoToPreviousLayout5Page = layout5Page > 0;
    const canGoToNextLayout5Page = layout5Page < layout5TotalPages - 1;

    return (
      <section className={cn('px-4 py-8 md:py-10', fontClassName)} style={{ backgroundColor: tokens.sectionBg, ...fontStyle }}>
        <div className={cn(outerShellClassName, 'rounded-md border bg-white shadow-sm', layout5WrapperPaddingClassName)} style={{ borderColor: `${tokens.cardBorder}80`, backgroundColor: tokens.cardBg }}>
          <div className="mb-6 md:mb-8">
            {renderSectionHeader('mb-0')}
            {layout5CanPaginate ? (
              <div className="flex justify-end items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => { setLayout5Page((current) => Math.max(current - 1, 0)); }}
                  disabled={!canGoToPreviousLayout5Page}
                  aria-label="Trang trước"
                  className={cn(
                    'w-8 h-8 md:w-10 md:h-10 rounded-full border flex items-center justify-center transition-colors',
                    canGoToPreviousLayout5Page ? 'border-slate-200 hover:bg-slate-50' : 'border-slate-100 opacity-40 cursor-not-allowed',
                  )}
                >
                  <ChevronRight size={18} className="rotate-180" style={{ color: canGoToPreviousLayout5Page ? tokens.primary.solid : undefined }} />
                </button>
                <button
                  type="button"
                  onClick={() => { setLayout5Page((current) => Math.min(current + 1, layout5TotalPages - 1)); }}
                  disabled={!canGoToNextLayout5Page}
                  aria-label="Trang sau"
                  className={cn(
                    'w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors',
                    canGoToNextLayout5Page ? 'text-white' : 'opacity-40 cursor-not-allowed border border-slate-100',
                  )}
                  style={canGoToNextLayout5Page ? { backgroundColor: tokens.primary.solid } : undefined}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            ) : null}
          </div>

          <div className={cn('mb-8 grid', layout14GridClassName, layout5GapClassName)}>
            {layout5PagedItems.map((item) => (
              <ItemLink key={item.id} item={item} href={getHref(item)} context={context} className="group cursor-pointer">
                <article className="flex flex-col">
                  <div className="relative mb-3 aspect-[16/10] w-full overflow-hidden rounded-md bg-slate-100">
                    <ImageView item={item} alt={item.title} sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw" context={context} className="transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <h3 className={cn('mb-2 line-clamp-2 font-semibold leading-snug', layout5TitleClassName)} style={{ color: tokens.bodyText }}>{item.title}</h3>
                    {showDate && resolveDate(item) ? (
                      <div className="mt-auto inline-flex items-center gap-1.5 text-[13px]" style={{ color: tokens.mutedText }}>
                        <Calendar size={14} />
                        <span>Thứ Ba, {resolveDate(item)}</span>
                      </div>
                    ) : null}
                  </div>
                </article>
              </ItemLink>
            ))}
          </div>

          {renderViewAll({
            context,
            href: viewAllHref,
            className: 'flex justify-center pt-2',
            children: (
              <div className="rounded px-6 py-2.5 text-white" style={{ backgroundColor: tokens.primary.solid }}>
                Xem tất cả
              </div>
            ),
          })}
        </div>
      </section>
    );
  }

  if (style === 'layout6') {
    const canGoToPreviousLayout6Page = layout6Page > 0;
    const canGoToNextLayout6Page = layout6Page < layout6TotalPages - 1;

    return (
      <section className={cn('px-4 py-8 md:py-10', fontClassName)} style={{ backgroundColor: tokens.sectionBg, ...fontStyle }}>
        <div className={cn(outerShellClassName, 'rounded-3xl border bg-gray-50/50', layout6WrapperPaddingClassName)} style={{ borderColor: tokens.cardBorder }}>
          <div className="mb-6 md:mb-8">
            {renderSectionHeader('mb-0')}
            {layout6CanPaginate ? (
              <div className="flex justify-end items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => { setLayout6Page((current) => Math.max(current - 1, 0)); }}
                  disabled={!canGoToPreviousLayout6Page}
                  aria-label="Trang trước"
                  className={cn(
                    'w-8 h-8 md:w-10 md:h-10 rounded-full border flex items-center justify-center transition-colors',
                    canGoToPreviousLayout6Page ? 'border-slate-200 hover:bg-slate-50' : 'border-slate-100 opacity-40 cursor-not-allowed',
                  )}
                >
                  <ChevronRight size={18} className="rotate-180" style={{ color: canGoToPreviousLayout6Page ? tokens.primary.solid : undefined }} />
                </button>
                <button
                  type="button"
                  onClick={() => { setLayout6Page((current) => Math.min(current + 1, layout6TotalPages - 1)); }}
                  disabled={!canGoToNextLayout6Page}
                  aria-label="Trang sau"
                  className={cn(
                    'w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors',
                    canGoToNextLayout6Page ? 'text-white' : 'opacity-40 cursor-not-allowed border border-slate-100',
                  )}
                  style={canGoToNextLayout6Page ? { backgroundColor: tokens.primary.solid } : undefined}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            ) : null}
          </div>

          <div className={cn('mb-6 md:mb-8 grid gap-5 md:gap-6', layout46GridClassName)}>
            {layout6PagedItems.map((item) => (
              <ItemLink key={item.id} item={item} href={getHref(item)} context={context} className="group flex h-full cursor-pointer">
                <article className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md" style={{ borderColor: tokens.cardBorder, backgroundColor: tokens.cardBg }}>
                  <div className="relative aspect-[16/10] w-full">
                    <ImageView item={item} alt={item.title} sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" context={context} />
                    {showDate && resolveDate(item) ? (
                      <div className="absolute top-0 left-4 flex flex-col items-center justify-center rounded-b-lg px-3 py-2 text-white shadow-sm" style={{ backgroundColor: tokens.primary.solid }}>
                        <span className="text-xl font-bold leading-none">{resolveDate(item)?.split('/')[0] ?? ''}</span>
                        <span className="text-[10px] font-medium uppercase tracking-wider">{resolveDate(item)?.split('/').slice(1).join('/') ?? ''}</span>
                      </div>
                    ) : null}
                  </div>

                  <div className="flex flex-1 flex-col p-4 pb-4 md:p-5 md:pb-6">
                    <h3 className="mb-3 line-clamp-2 text-lg font-semibold leading-snug transition-colors group-hover:text-[var(--token-primary)]" style={{ color: tokens.bodyText }}>
                      {item.title}
                    </h3>
                    {showExcerpt && item.excerpt ? (
                      <p className="flex-1 line-clamp-3 text-sm leading-relaxed" style={{ color: tokens.mutedText }}>{item.excerpt}</p>
                    ) : <div className="flex-1" />}
                  </div>
                </article>
              </ItemLink>
            ))}
          </div>

          {renderViewAll({
            context,
            href: viewAllHref,
            className: 'mt-2 flex justify-center',
            children: (
              <div className="rounded-full border px-8 py-2.5 text-sm font-medium transition-colors" style={{ borderColor: tokens.primary.solid, color: tokens.primary.solid }}>
                Xem tất cả
              </div>
            ),
          })}
        </div>
      </section>
    );
  }

  // Layout 7: Bean Construction style
  const canGoToPreviousLayout7Page = layout7Page > 0;
  const canGoToNextLayout7Page = layout7Page < layout7TotalPages - 1;

  return (
    <section className={cn('section-index section_blog py-[60px]', fontClassName)} style={{ backgroundColor: tokens.sectionBg, fontFamily: '"Manrope", sans-serif', fontSize: '14px', lineHeight: '23.8px', ...fontStyle }}>
      <div className={cn(outerShellClassName, "relative mx-auto max-w-[1170px] px-[10px]")}>
        {!hideHeader && (
          <>
            <div className="section-title-blog mb-[15px] flex flex-col" style={{ textAlign: headerAlign }}>
              {showSubtitleHeader && subtitle && (
                <div className="sub_title text-[14px] font-[700] uppercase mb-[15px]" style={{ color: tokens.primary.solid }}>
                  {subtitle}
                </div>
              )}
              {showTitleHeader && (
                <h2 className="text-[40px] font-[800] leading-[56px] mb-[5px]" style={{ fontFamily: '"Raleway", sans-serif' }}>
                  <span style={{ color: titleColorPrimary ? tokens.primary.solid : tokens.heading }}>{sectionTitle}</span>
                </h2>
              )}
            </div>
            
            {showBadge && badgeText && (
              <div className="desc mb-[20px] text-[16px] leading-[27.2px]" style={{ color: tokens.mutedText, textAlign: headerAlign, margin: headerAlign === 'center' ? '0 auto 20px' : '0 0 20px' }}> 
                {badgeText}
              </div>
            )}
          </>
        )}

        <div className="swiper_blogs swiper-container relative">
          {layout7CanPaginate && (
            <>
              <button
                type="button"
                onClick={() => { setLayout7Page((current) => Math.max(current - 1, 0)); }}
                disabled={!canGoToPreviousLayout7Page}
                className={cn(
                  'swiper-button-prev absolute left-[-55px] top-[43%] -translate-y-1/2 z-10 w-[60px] h-[60px] rounded-[50%] flex items-center justify-center transition-all opacity-0 xl:opacity-100',
                  canGoToPreviousLayout7Page ? 'cursor-pointer hover:scale-105' : 'opacity-35 cursor-not-allowed',
                )}
                style={{ backgroundColor: tokens.primary.solid, color: '#fff' }}
              >
                <svg width="58" height="58" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg" className="rotate-180">
                  <path d="M18.5 29H39.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M29 18.5L39.5 29L29 39.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </button>
              <button
                type="button"
                onClick={() => { setLayout7Page((current) => Math.min(current + 1, layout7TotalPages - 1)); }}
                disabled={!canGoToNextLayout7Page}
                className={cn(
                  'swiper-button-next absolute right-[-55px] top-[43%] -translate-y-1/2 z-10 w-[60px] h-[60px] rounded-[50%] flex items-center justify-center transition-all opacity-0 xl:opacity-100',
                  canGoToNextLayout7Page ? 'cursor-pointer hover:scale-105' : 'opacity-35 cursor-not-allowed',
                )}
                style={{ backgroundColor: tokens.primary.solid, color: '#fff' }}
              >
                <svg width="58" height="58" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.5 29H39.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M29 18.5L39.5 29L29 39.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </button>
            </>
          )}

          <div className={cn("swiper-wrapper grid gap-[20px]", layout7GridClassName)}>
            {layout7PagedItems.map((item) => (
              <div key={item.id} className="swiper-slide h-auto">
                <ItemLink item={item} href={getHref(item)} context={context} className="group flex h-full cursor-pointer flex-col">
                  <article className="item_blog flex h-full flex-col overflow-hidden bg-white">
                    <div className="image-blog relative w-full overflow-hidden rounded-[20px] bg-[#f8f8f8]" style={{ paddingBottom: '63.5%' }}>
                      <ImageView item={item} alt={item.title} sizes="(min-width: 1170px) 369px, (min-width: 768px) 50vw, 100vw" context={context} className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.02]" />
                      {showDate && resolveDate(item) && (
                        <span className="user_date absolute bottom-[10px] right-[10px] z-[2] flex items-center justify-center rounded-[40px] bg-black px-[33px] py-[7px] text-[14px] leading-[19.6px] text-white"> 
                          {resolveDate(item)}
                        </span> 
                      )}
                    </div>
                    <div className="blog_content flex flex-1 flex-col bg-white py-[10px]"> 
                      <h3 className="mb-[7px]">
                        <span className="block h-[44px] overflow-hidden text-[16px] font-[600] leading-[22px] transition-colors group-hover:text-[var(--token-primary)]" style={{ color: tokens.heading, '--token-primary': tokens.primary.solid } as React.CSSProperties}>
                          {item.title}
                        </span>
                      </h3>
                      {showAuthor && (
                        <p className="update_date flex justify-between mb-[7px] text-[12px] leading-[20.4px]" style={{ color: 'rgb(131, 131, 131)' }}>
                          <span className="user_name">Đăng bởi: <b className="font-[500]" style={{ color: tokens.primary.solid }}>{item.author || 'Bean Construction'}</b></span> 
                        </p>
                      )}
                      <div className="conten_info_blog flex flex-col flex-1 min-h-[73.8px]">
                        {showExcerpt && item.excerpt && (
                          <p className="blog_description mb-[10px] h-[40px] overflow-hidden text-[14px] leading-[20px]" style={{ color: tokens.bodyText }}>
                            {item.excerpt}
                          </p>
                        )}
                        <div className="mt-auto">
                          <span className="read_more text-[14px] font-[600] transition-colors group-hover:text-[var(--token-primary)] inline-block" style={{ color: tokens.bodyText, '--token-primary': tokens.primary.solid } as React.CSSProperties}>
                            Đọc tiếp &gt;&gt;
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                </ItemLink>
              </div>
            ))}
          </div>
          
          {layout7CanPaginate && (
            <div className="flex xl:hidden justify-center items-center gap-4 mt-[30px]">
              <button
                type="button"
                onClick={() => { setLayout7Page((current) => Math.max(current - 1, 0)); }}
                disabled={!canGoToPreviousLayout7Page}
                className={cn(
                  'w-[44px] h-[44px] rounded-full flex items-center justify-center transition-all shadow-sm',
                  canGoToPreviousLayout7Page ? 'cursor-pointer' : 'opacity-40 cursor-not-allowed',
                )}
                style={{ backgroundColor: canGoToPreviousLayout7Page ? tokens.primary.solid : '#f1f5f9', color: canGoToPreviousLayout7Page ? '#fff' : '#94a3b8' }}
              >
                <svg width="20" height="20" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg" className="rotate-180">
                  <path d="M18.5 29H39.5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M29 18.5L39.5 29L29 39.5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </button>
              <button
                type="button"
                onClick={() => { setLayout7Page((current) => Math.min(current + 1, layout7TotalPages - 1)); }}
                disabled={!canGoToNextLayout7Page}
                className={cn(
                  'w-[44px] h-[44px] rounded-full flex items-center justify-center transition-all shadow-sm',
                  canGoToNextLayout7Page ? 'cursor-pointer' : 'opacity-40 cursor-not-allowed',
                )}
                style={{ backgroundColor: canGoToNextLayout7Page ? tokens.primary.solid : '#f1f5f9', color: canGoToNextLayout7Page ? '#fff' : '#94a3b8' }}
              >
                <svg width="20" height="20" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.5 29H39.5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M29 18.5L39.5 29L29 39.5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </button>
            </div>
          )}
        </div>

        {renderViewAll({
          context,
          href: viewAllHref,
          className: 'box_see_blog mt-[25px] flex justify-center',
          children: (
            <div className="theme-btn btn-style-three exp-btn-title inline-block font-[700] uppercase text-white transition-transform hover:scale-105 cursor-pointer rounded-[50px] pt-[8px] pb-[8px] pl-[26px] pr-[8px]" style={{ backgroundColor: tokens.primary.solid }}>
              <span className="btn-wrap">
                <span className="text-one flex items-center justify-center text-center">
                  XEM TẤT CẢ 
                  <i className="flex h-[50px] w-[50px] items-center justify-center rounded-[50px] bg-black ml-[15px] italic">
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0.46967 7.46967C0.176777 7.76256 0.176777 8.23744 0.46967 8.53033C0.762563 8.82322 1.23744 8.82322 1.53033 8.53033L0.46967 7.46967ZM8.75 1C8.75 0.585786 8.41421 0.25 8 0.25L1.25 0.25C0.835786 0.25 0.5 0.585786 0.5 1C0.5 1.41421 0.835786 1.75 1.25 1.75L7.25 1.75V7.75C7.25 8.16421 7.58579 8.5 8 8.5C8.41421 8.5 8.75 8.16421 8.75 7.75V1ZM1 8L1.53033 8.53033L8.53033 1.53033L8 1L7.46967 0.46967L0.46967 7.46967L1 8Z" fill="white"></path>
                    </svg>
                  </i>
                </span>
              </span>
            </div>
          ),
        })}
      </div>
    </section>
  );
}
