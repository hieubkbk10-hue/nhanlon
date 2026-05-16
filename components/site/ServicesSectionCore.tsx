'use client';

import React from 'react';
import { formatHex, oklch } from 'culori';
import { APCAcontrast, sRGBtoY } from 'apca-w3';
import { PublicImage } from '@/components/shared/PublicImage';
import { icons } from 'lucide-react';
import type { ServiceItem, ServiceItemMediaAlign, ServiceItemMediaPlacement, ServicesColorTokens, ServicesStyle } from '@/app/admin/home-components/services/_types';
import { getAPCATextColor } from '@/app/admin/home-components/services/_lib/colors';

const StarIcon = icons.Star;

const ServiceIcon = ({ name, size = 24, style }: { name?: string; size?: number; style?: React.CSSProperties }) => {
  const IconComponent = (name && icons[name as keyof typeof icons]) || StarIcon;
  return <IconComponent size={size} style={style} />;
};

const ServiceMedia = ({
  item,
  iconSize,
  iconStyle,
  imageClassName,
  imageStyle,
}: {
  item: ServiceItem;
  iconSize: number;
  iconStyle?: React.CSSProperties;
  imageClassName?: string;
  imageStyle?: React.CSSProperties;
}) => {
  if (item.mediaType === 'image' && item.image) {
    return (
      <div className={`relative overflow-hidden ${imageClassName ?? ''}`} style={imageStyle}>
        <PublicImage
          src={item.image}
          alt={item.title || 'Service image'}
          fill
          sizes="64px"
          className="object-cover"
          mode="logo"
        />
      </div>
    );
  }

  return <ServiceIcon name={item.icon} size={iconSize} style={iconStyle} />;
};

const getServiceKey = (item: ServiceItem, index: number) => {
  return `${item.mediaType}-${item.icon}-${item.image}-${item.title}-${item.description}-${index}`;
};

const serviceTitleClassName = 'text-[13px] font-bold uppercase leading-tight tracking-wide';
const serviceBodyClassName = 'mt-0.5 text-[12px] leading-4';
const serviceTitleFontStyle = { fontFamily: 'var(--font-roboto-slab), var(--font-be-vietnam-pro), serif' } as React.CSSProperties;
const serviceBodyFontStyle = { fontFamily: 'var(--font-be-vietnam-pro), sans-serif' } as React.CSSProperties;

const getDisplayTitle = (title?: string) => title?.trim() || 'Dịch vụ';

const getMediaAlignClassName = (align?: ServiceItemMediaAlign) => {
  if (align === 'left') {return 'justify-start';}
  if (align === 'right') {return 'justify-end';}
  return 'justify-center';
};

const getTextAlignClassName = (align?: ServiceItemMediaAlign) => {
  if (align === 'left') {return 'text-left';}
  if (align === 'right') {return 'text-right';}
  return 'text-center';
};

const getMediaWrapperClassName = (placement?: ServiceItemMediaPlacement, align?: ServiceItemMediaAlign) => {
  if (placement === 'left') {
    return 'mb-0 flex shrink-0 items-center justify-center self-center';
  }
  return `mb-1.5 flex min-h-[28px] ${getMediaAlignClassName(align)} items-center`;
};

const renderAlignedMedia = ({
  item,
  placement,
  align,
  iconSize,
  iconStyle,
  imageClassName,
  imageStyle,
  wrapperClassName,
  surfaceClassName,
  surfaceColor,
}: {
  item: ServiceItem;
  placement?: ServiceItemMediaPlacement;
  align?: ServiceItemMediaAlign;
  iconSize: number;
  iconStyle?: React.CSSProperties;
  imageClassName?: string;
  imageStyle?: React.CSSProperties;
  wrapperClassName?: string;
  surfaceClassName: string;
  surfaceColor: string;
}) => (
  <div className={wrapperClassName ?? getMediaWrapperClassName(placement, align)}>
    <div className={surfaceClassName} style={{ backgroundColor: surfaceColor }}>
      <ServiceMedia item={item} iconSize={iconSize} iconStyle={iconStyle} imageClassName={imageClassName} imageStyle={imageStyle} />
    </div>
  </div>
);

const clampCarouselLightness = (value: number) => Math.min(Math.max(value, 0.08), 0.92);
const clampRibbonLightness = (value: number) => Math.min(Math.max(value, 0.06), 0.82);

const getRibbonShadeColor = (baseColor: string, lightnessShift: number, chromaScale = 0.95) => {
  const parsed = oklch(baseColor);
  if (!parsed) {return baseColor;}

  return formatHex(oklch({
    ...parsed,
    l: clampRibbonLightness((parsed.l ?? 0.5) + lightnessShift),
    c: (parsed.c ?? 0) * chromaScale,
  }));
};

const getCarouselItemBackground = (baseColor: string, index: number, total: number) => {
  const parsed = oklch(baseColor);
  if (!parsed) {return baseColor;}

  if (total <= 1) {
    return formatHex(oklch({ ...parsed, l: clampCarouselLightness((parsed.l ?? 0.6) + 0.04) }));
  }

  const progress = index / Math.max(total - 1, 1);
  const lightnessShift = 0.18 - (0.26 * progress);
  return formatHex(oklch({
    ...parsed,
    l: clampCarouselLightness((parsed.l ?? 0.6) + lightnessShift),
  }));
};

export type ServicesCoreDevice = 'desktop' | 'tablet' | 'mobile';

export const ServicesSectionCore = ({
  items,
  style,
  headerAlign = 'left',
  desktopColumns = 3,
  mediaPlacement = 'top',
  mediaAlign = 'center',
  subtitle,
  showTitle = true,
  showSubtitle = true,
  title,
  colors,
  device = 'desktop',
  isPreview = false,
  carouselId,
}: {
  items: ServiceItem[];
  style: ServicesStyle;
  headerAlign?: 'left' | 'center' | 'right';
  desktopColumns?: 3 | 4;
  mediaPlacement?: ServiceItemMediaPlacement;
  mediaAlign?: 'left' | 'center' | 'right';
  subtitle?: string;
  showTitle?: boolean;
  showSubtitle?: boolean;
  title: string;
  colors: ServicesColorTokens;
  device?: ServicesCoreDevice;
  isPreview?: boolean;
  carouselId?: string;
}) => {
  void carouselId;
  const sectionTitle = getDisplayTitle(title);
  const sectionSubtitle = subtitle?.trim() || '';
  const shouldShowTitle = showTitle !== false;
  const shouldShowSubtitle = showSubtitle !== false && Boolean(sectionSubtitle);
  const headerAlignClassName = headerAlign === 'center' ? 'text-center' : headerAlign === 'right' ? 'text-right' : 'text-left';

  const renderSectionHeader = () => {
    if (!shouldShowTitle && !shouldShowSubtitle) {return null;}

    return (
      <div className={`space-y-2 ${headerAlignClassName}`}>
        {shouldShowTitle ? <h2 className="text-2xl font-bold tracking-tight md:text-3xl" style={{ color: colors.heading }}>{sectionTitle}</h2> : null}
        {shouldShowSubtitle ? <p className="text-sm font-medium" style={{ color: colors.subheading }}>{sectionSubtitle}</p> : null}
      </div>
    );
  };

  const visibleForPreview = items.slice(0, 6);
  const cardsGridClassName = isPreview
    ? (device === 'mobile'
      ? (desktopColumns === 4 ? 'grid grid-cols-2 gap-4' : 'grid grid-cols-1 gap-4')
      : device === 'tablet'
        ? (desktopColumns === 4 ? 'grid grid-cols-2 gap-4' : 'grid grid-cols-3 gap-4')
        : (desktopColumns === 4 ? 'grid grid-cols-4 gap-4' : 'grid grid-cols-3 gap-4'))
    : (desktopColumns === 4 ? 'grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4' : 'grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-3');
  const stripGridClassName = isPreview
    ? (device === 'mobile'
      ? (desktopColumns === 4 ? 'grid grid-cols-2' : 'grid grid-cols-1')
      : device === 'tablet'
        ? (desktopColumns === 4 ? 'grid grid-cols-2' : 'grid grid-cols-3')
        : (desktopColumns === 4 ? 'grid grid-cols-4' : 'grid grid-cols-3'))
    : (desktopColumns === 4 ? 'grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4' : 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3');

  const visibleForRuntime = items.slice(0, 6);
  const displayFeaturedItems = isPreview ? visibleForPreview : visibleForRuntime;

  if (items.length === 0) {
    return (
      <section className="px-4 py-10">
        <div className="mx-auto max-w-4xl rounded-xl border p-8 text-center" style={{ backgroundColor: colors.placeholderBackground, borderColor: colors.neutralBorder }}>
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg" style={{ backgroundColor: colors.placeholderIconBackground }}>
            <ServiceIcon size={24} style={{ color: colors.placeholderIcon }} />
          </div>
          <h3 className="text-lg font-semibold" style={{ color: colors.bodyText }}>Chưa có dịch vụ nào</h3>
          <p className="mt-1 text-sm" style={{ color: colors.placeholderText }}>Thêm mục đầu tiên để bắt đầu</p>
        </div>
      </section>
    );
  }

  if (style === 'elegantGrid') {
    const background = colors.primary;
    const text = getAPCATextColor(background, 18, 600);
    const subtext = text === '#ffffff' ? 'rgba(255,255,255,0.78)' : 'rgba(15,23,42,0.72)';
    const surface = text === '#ffffff' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.48)';
    const divider = text === '#ffffff' ? 'rgba(255,255,255,0.16)' : 'rgba(15,23,42,0.1)';

    return (
      <section className="px-4 pb-5 pt-2 md:pb-[22px] md:pt-2">
        <div className="mx-auto max-w-7xl space-y-2">
          {renderSectionHeader()}
          <div className="overflow-hidden rounded-sm" style={{ backgroundColor: background }}>
            <div className={`${stripGridClassName} divide-y md:divide-y-0`} style={{ borderColor: divider }}>
              {displayFeaturedItems.map((item, idx) => {
                const stackedLayout = mediaPlacement !== 'left';
                const textAlignClassName = stackedLayout ? getTextAlignClassName(mediaAlign) : 'text-left';
                const articleClassName = stackedLayout
                  ? `flex min-h-[54px] flex-col px-1.5 py-2.5 ${textAlignClassName}`
                  : 'flex min-h-[54px] items-center gap-3 px-1.5 py-2.5';

                return (
                  <article key={getServiceKey(item, idx)} className={articleClassName}>
                    {renderAlignedMedia({
                      item,
                      placement: mediaPlacement,
                      align: mediaPlacement === 'left' ? 'center' : mediaAlign,
                      iconSize: 28,
                      iconStyle: { color: text },
                      imageClassName: 'h-11 w-11 rounded object-cover',
                      surfaceClassName: 'flex h-11 w-11 items-center justify-center rounded-sm border',
                      surfaceColor: surface,
                    })}
                    <div className="min-w-0">
                      <h3 className={serviceTitleClassName} style={{ ...serviceTitleFontStyle, color: text }}>{item.title || 'Tiêu đề'}</h3>
                      <p className={serviceBodyClassName} style={{ ...serviceBodyFontStyle, color: subtext }}>{item.description || 'Mô tả dịch vụ...'}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (style === 'modernList') {
    const stripBg = colors.primary;
    const baseTextColor = getAPCATextColor(stripBg, 13, 700);
    // Thử dùng secondary cho title nếu đủ contrast trên nền primary
    const secondaryLc = Math.abs(
      (() => {
        try {
          const sRgb = (hex: string): [number, number, number] => {
            const h = hex.replace('#', '');
            return [
              Number.parseInt(h.slice(0, 2), 16),
              Number.parseInt(h.slice(2, 4), 16),
              Number.parseInt(h.slice(4, 6), 16),
            ];
          };
          return Number(APCAcontrast(sRGBtoY(sRgb(colors.secondary)), sRGBtoY(sRgb(stripBg))));
        } catch { return 0; }
      })(),
    );
    const titleColor = secondaryLc >= 45 ? colors.secondary : baseTextColor;
    const descColor = baseTextColor === '#ffffff'
      ? 'rgba(255,255,255,0.82)' : 'rgba(15,23,42,0.72)';
    const iconColor = baseTextColor;
    const stackedLayout = mediaPlacement !== 'left';

    return (
      <section>
        <div style={{ backgroundColor: stripBg }}>
          <div className="mx-auto max-w-7xl px-4 pb-5 pt-2 md:pb-[22px] md:pt-2">
            <div className={`${stripGridClassName} gap-y-5`}>
              {displayFeaturedItems.map((item, idx) => {
                if (stackedLayout) {
                  const textAlignClassName = getTextAlignClassName(mediaAlign);
                  return (
                    <article key={getServiceKey(item, idx)} className={`px-1.5 ${textAlignClassName}`}>
                      <div className={`mb-1.5 flex min-h-[28px] items-center ${getMediaAlignClassName(mediaAlign)}`}>
                        <ServiceMedia
                          item={item}
                          iconSize={28}
                          iconStyle={{ color: iconColor }}
                          imageClassName="h-11 w-11 rounded object-cover"
                        />
                      </div>
                      <h3 className={serviceTitleClassName} style={{ ...serviceTitleFontStyle, color: titleColor }}>
                        {item.title || 'Tiêu đề'}
                      </h3>
                      <p className={serviceBodyClassName} style={{ ...serviceBodyFontStyle, color: descColor }}>
                        {item.description || 'Mô tả dịch vụ...'}
                      </p>
                    </article>
                  );
                }

                return (
                  <article key={getServiceKey(item, idx)} className="flex items-center gap-3 px-1.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center">
                      <ServiceMedia
                        item={item}
                        iconSize={28}
                        iconStyle={{ color: iconColor }}
                        imageClassName="h-11 w-11 rounded object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className={serviceTitleClassName} style={{ ...serviceTitleFontStyle, color: titleColor }}>
                        {item.title || 'Tiêu đề'}
                      </h3>
                      <p className={serviceBodyClassName} style={{ ...serviceBodyFontStyle, color: descColor }}>
                        {item.description || 'Mô tả dịch vụ...'}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (style === 'bigNumber') {
    return (
      <section className="px-4 pb-5 pt-2 md:pb-[22px] md:pt-2">
        <div className="mx-auto max-w-7xl space-y-2">
          {renderSectionHeader()}
          <div className="overflow-hidden rounded-[32px] border" style={{ borderColor: colors.cardBorder, backgroundColor: colors.cardBackground }}>
            <div className={`${stripGridClassName} divide-y md:divide-y-0`} style={{ borderColor: colors.neutralBorder }}>
              {displayFeaturedItems.slice(0, desktopColumns).map((item, idx) => {
                const stackedLayout = mediaPlacement !== 'left';
                const textAlignClassName = stackedLayout ? getTextAlignClassName(mediaAlign) : 'text-left';
                const articleClassName = stackedLayout ? `px-1.5 py-2.5 ${textAlignClassName}` : 'flex items-center gap-3 px-1.5 py-2.5';

                return (
                  <article key={getServiceKey(item, idx)} className={articleClassName}>
                    {mediaPlacement === 'left' ? (
                      <>
                        {renderAlignedMedia({
                          item,
                          placement: mediaPlacement,
                          align: 'center',
                          iconSize: 28,
                          iconStyle: { color: colors.sectionAccent },
                          imageClassName: 'h-11 w-11 rounded object-cover',
                          surfaceClassName: 'flex h-11 w-11 items-center justify-center rounded-full',
                          surfaceColor: colors.primaryTint,
                        })}
                        <div className="min-w-0 flex-1">
                          <h3 className={serviceTitleClassName} style={{ ...serviceTitleFontStyle, color: colors.bodyText }}>{item.title || 'Tiêu đề'}</h3>
                          <p className={serviceBodyClassName} style={{ ...serviceBodyFontStyle, color: colors.mutedText }}>{item.description || 'Mô tả dịch vụ...'}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        {renderAlignedMedia({
                          item,
                          placement: mediaPlacement,
                          align: mediaAlign,
                          iconSize: 28,
                          iconStyle: { color: colors.sectionAccent },
                          imageClassName: 'h-11 w-11 rounded object-cover',
                          surfaceClassName: 'flex h-11 w-11 items-center justify-center rounded-full',
                          surfaceColor: colors.primaryTint,
                        })}
                        <h3 className={serviceTitleClassName} style={{ ...serviceTitleFontStyle, color: colors.bodyText }}>{item.title || 'Tiêu đề'}</h3>
                        <p className={serviceBodyClassName} style={{ ...serviceBodyFontStyle, color: colors.mutedText }}>{item.description || 'Mô tả dịch vụ...'}</p>
                      </>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (style === 'cards') {
    return (
      <section className="px-4 pb-5 pt-2 md:pb-[22px] md:pt-2">
        <div className="mx-auto max-w-7xl space-y-2">
          {renderSectionHeader()}
          <div className={cardsGridClassName}>
            {displayFeaturedItems.map((item, idx) => (
              <article key={getServiceKey(item, idx)} className="rounded-xl border bg-white px-1.5 py-2.5" style={{ borderColor: colors.cardBorder, backgroundColor: colors.cardBackground }}>
                {mediaPlacement === 'left' ? (
                  <div className="flex items-start gap-3">
                    {renderAlignedMedia({
                      item,
                      placement: mediaPlacement,
                      align: 'center',
                      iconSize: 28,
                      iconStyle: { color: colors.iconColor },
                      imageClassName: 'h-11 w-11 rounded object-cover',
                      wrapperClassName: 'mt-0.5 flex shrink-0 self-start items-start justify-center',
                      surfaceClassName: 'flex h-11 w-11 items-center justify-center rounded-lg',
                      surfaceColor: colors.neutralSurface,
                    })}
                    <div className="min-w-0 flex-1">
                      <h3 className={serviceTitleClassName} style={{ ...serviceTitleFontStyle, color: colors.bodyText }}>{item.title || 'Tiêu đề'}</h3>
                      <p className={serviceBodyClassName} style={{ ...serviceBodyFontStyle, color: colors.mutedText }}>{item.description || 'Mô tả dịch vụ...'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    {renderAlignedMedia({
                      item,
                      placement: mediaPlacement,
                      align: 'center',
                      iconSize: 28,
                      iconStyle: { color: colors.iconColor },
                      imageClassName: 'h-11 w-11 rounded object-cover',
                      surfaceClassName: 'flex h-11 w-11 items-center justify-center rounded-lg mx-auto',
                      surfaceColor: colors.neutralSurface,
                    })}
                    <h3 className={serviceTitleClassName} style={{ ...serviceTitleFontStyle, color: colors.bodyText }}>{item.title || 'Tiêu đề'}</h3>
                    <p className={serviceBodyClassName} style={{ ...serviceBodyFontStyle, color: colors.mutedText }}>{item.description || 'Mô tả dịch vụ...'}</p>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (style === 'carousel') {
    const carouselItems = displayFeaturedItems;

    return (
      <section className="px-4 pb-5 pt-2 md:pb-[22px] md:pt-2">
        <div className="mx-auto max-w-7xl space-y-2">
          {renderSectionHeader()}
          <div className="overflow-hidden rounded-sm">
            <div className={`${stripGridClassName} divide-y md:divide-y-0`}>
              {carouselItems.map((item, idx) => {
                const stackedLayout = mediaPlacement !== 'left';
                const textAlignClassName = stackedLayout ? getTextAlignClassName(mediaAlign) : 'text-left';
                const articleClassName = stackedLayout
                  ? `flex min-h-[54px] flex-col px-1.5 py-2.5 ${textAlignClassName}`
                  : 'flex min-h-[54px] items-center gap-3 px-1.5 py-2.5';
                const itemBackground = getCarouselItemBackground(colors.primary, idx, carouselItems.length);
                const itemText = getAPCATextColor(itemBackground, 16, 600);
                const itemSubtext = itemText === '#ffffff' ? 'rgba(255,255,255,0.78)' : 'rgba(15,23,42,0.72)';
                const itemMediaSurface = itemText === '#ffffff' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.48)';
                return (
                  <article key={getServiceKey(item, idx)} className={articleClassName} style={{ backgroundColor: itemBackground }}>
                    {renderAlignedMedia({
                      item,
                      placement: mediaPlacement,
                      align: mediaPlacement === 'left' ? 'center' : mediaAlign,
                      iconSize: 28,
                      iconStyle: { color: itemText },
                      imageClassName: 'h-11 w-11 rounded object-cover',
                      surfaceClassName: `flex h-11 w-11 items-center justify-center rounded-sm border ${mediaPlacement === 'left' ? '' : 'mx-auto'}`,
                      surfaceColor: itemMediaSurface,
                    })}
                    <div className="min-w-0">
                      <h3 className={serviceTitleClassName} style={{ ...serviceTitleFontStyle, color: itemText }}>{item.title || 'Tiêu đề'}</h3>
                      <p className={serviceBodyClassName} style={{ ...serviceBodyFontStyle, color: itemSubtext }}>{item.description || 'Mô tả dịch vụ...'}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (style === 'builderPolicy') {
    const policyItems = displayFeaturedItems.slice(0, 4);
    const stackedLayout = mediaPlacement !== 'left';
    const policyTextAlignClassName = stackedLayout ? getTextAlignClassName(mediaAlign) : 'text-left';
    const policyMediaAlignClassName = stackedLayout ? getMediaAlignClassName(mediaAlign) : 'justify-center';
    const gridClassName = isPreview
      ? (device === 'mobile'
        ? 'grid grid-cols-1 gap-[30px]'
        : device === 'tablet'
          ? 'grid grid-cols-2 gap-[30px]'
          : 'grid grid-cols-4 gap-[30px]')
      : 'grid grid-cols-1 gap-[30px] sm:grid-cols-2 lg:grid-cols-4';

    return (
      <section className="px-4 pb-5 pt-2 md:pb-[22px] md:pt-2">
        <div className="mx-auto max-w-[1320px] space-y-2">
          {renderSectionHeader()}
          <div
            className="relative overflow-hidden rounded-[20px] p-[30px]"
            style={{ backgroundColor: '#d71920', fontFamily: 'Mulish, var(--font-active), var(--font-be-vietnam-pro), sans-serif' }}
          >
            <div className={gridClassName}>
              {policyItems.map((item, idx) => (
                <article
                  key={getServiceKey(item, idx)}
                  className={stackedLayout ? `relative h-full ${policyTextAlignClassName}` : 'relative flex h-full items-center gap-4 text-left'}
                >
                  <div className={stackedLayout ? policyTextAlignClassName : 'flex min-w-0 items-center gap-4'}>
                    <div className={stackedLayout ? `mb-[15px] flex min-h-[60px] items-center ${policyMediaAlignClassName}` : 'flex h-[60px] w-[64px] shrink-0 items-center justify-center'}>
                      {item.mediaType === 'image' && item.image ? (
                        <span className="relative inline-block h-[60px] w-[64px] align-middle">
                          <PublicImage
                            src={item.image}
                            alt={item.title || 'Service image'}
                            fill
                            sizes="64px"
                            className="object-contain"
                            mode="logo"
                          />
                        </span>
                      ) : (
                        <ServiceIcon name={item.icon} size={60} style={{ color: '#ffffff' }} />
                      )}
                    </div>
                    <div className={`min-w-0 text-white ${policyTextAlignClassName}`}>
                      <div className="text-base font-bold leading-6">
                        {item.title || 'Tiêu đề'}
                      </div>
                      <div className="text-sm font-normal leading-[21px] text-white">
                        {item.description || 'Mô tả dịch vụ...'}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const isSingleMode = colors.primary === colors.secondary;
  const ribbonBg = colors.primary;
  const ribbonIconColor = getAPCATextColor(ribbonBg, 16, 700);
  const cardBg = isSingleMode ? colors.neutralSurface : colors.secondary;
  const cardTitleColor = getAPCATextColor(cardBg, 15, 700);
  const cardDescColor = cardTitleColor === '#ffffff' ? 'rgba(255,255,255,0.85)' : (isSingleMode ? colors.mutedText : 'rgba(0,0,0,0.75)');
  const ribbonClipPath = 'polygon(0 0, 100% 0, 100% 100%, 50% calc(100% - 7px), 0 100%)';
  const ribbonSideColor = getRibbonShadeColor(ribbonBg, -0.18, 0.92);
  const ribbonTopColor = getRibbonShadeColor(ribbonBg, -0.1, 0.96);
  const ribbonHighlightColor = getRibbonShadeColor(ribbonBg, 0.06, 1.02);

  return (
    <section className="px-4 pb-5 pt-2 md:pb-[22px] md:pt-2">
      <div className="mx-auto max-w-7xl space-y-2">
        {renderSectionHeader()}
        <div className={cardsGridClassName}>
          {displayFeaturedItems.map((item, idx) => {
            return (
              <article
                key={getServiceKey(item, idx)}
                className="relative flex min-h-[54px] flex-col justify-center rounded-md py-2.5 pl-[76px] pr-4 text-left shadow-sm"
                style={{ backgroundColor: cardBg }}
              >
                <div
                  className="absolute left-4 top-[-7px] z-10 h-[58px] w-12 drop-shadow-[0_6px_5px_rgba(0,0,0,0.2)]"
                >
                  <div
                    className="absolute -left-1 top-0 h-[9px] w-3 rounded-tl-sm"
                    style={{
                      backgroundColor: ribbonSideColor,
                      transform: 'skewX(-24deg)',
                    }}
                  />
                  <div
                    className="absolute -right-1 top-0 h-[9px] w-3 rounded-tr-sm"
                    style={{
                      backgroundColor: ribbonSideColor,
                      transform: 'skewX(24deg)',
                    }}
                  />
                  <div
                    className="absolute left-0 top-0 h-[7px] w-full"
                    style={{
                      backgroundColor: ribbonTopColor,
                    }}
                  />
                  <div
                    className="relative flex h-full w-full justify-center overflow-hidden pt-3 shadow-[inset_4px_0_7px_rgba(255,255,255,0.13),inset_-5px_0_8px_rgba(0,0,0,0.14)]"
                    style={{
                      backgroundColor: ribbonBg,
                      clipPath: ribbonClipPath,
                    }}
                  >
                    <span className="absolute left-0 top-[7px] h-full w-2 opacity-35" style={{ backgroundColor: ribbonHighlightColor }} />
                    <span className="absolute right-0 top-[7px] h-full w-1.5 bg-black/10" />
                    <ServiceMedia
                      item={item}
                      iconSize={24}
                      iconStyle={{ color: ribbonIconColor }}
                      imageClassName="h-7 w-7 rounded-sm border border-white/30 bg-white/80 p-0.5"
                    />
                  </div>
                </div>

                <div className="relative z-0">
                  <h3 className={serviceTitleClassName} style={{ ...serviceTitleFontStyle, color: cardTitleColor }}>
                    {item.title || 'Tiêu đề'}
                  </h3>
                  <p className={serviceBodyClassName} style={{ ...serviceBodyFontStyle, color: cardDescColor }}>
                    {item.description || 'Mô tả dịch vụ...'}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};















