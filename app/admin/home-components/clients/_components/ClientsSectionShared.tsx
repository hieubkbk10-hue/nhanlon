'use client';

import React from 'react';
import { PreviewImage } from '../../_shared/components/PreviewImage';
import { SectionHeader } from '../../_shared/components/SectionHeader';
import type { ClientsColorTokens } from '../_lib/colors';
import type { ClientItem, ClientsHeaderAlign, ClientsStyle } from '../_types';
import { normalizeClientItems, type NormalizedClientItem } from '../_lib/items';

export { normalizeClientItems } from '../_lib/items';

interface ClientsSectionSharedProps {
  context: 'preview' | 'site';
  title: string;
  style: ClientsStyle;
  items: ClientItem[];
  tokens: ClientsColorTokens;
  device?: 'mobile' | 'tablet' | 'desktop';
  skipHeader?: boolean;
  hideHeader?: boolean;
  showTitle?: boolean;
  subtitle?: string;
  showSubtitle?: boolean;
  headerAlign?: ClientsHeaderAlign;
  titleColorPrimary?: boolean;
  subtitleAboveTitle?: boolean;
  uppercaseText?: boolean;
  showBadge?: boolean;
  badgeText?: string;
  noBorderRadius?: boolean;
  brandColor: string;
}

export const normalizeClientsStyleSafe = (value: unknown): ClientsStyle => {
  if (
    value === 'layout01'
    || value === 'layout02'
    || value === 'layout03'
    || value === 'layout04'
    || value === 'layout05'
    || value === 'layout06'
    || value === 'layout07'
  ) {
    return value;
  }
  if (value === 'single') {return 'layout02';}
  if (value === 'duo') {return 'layout04';}
  if (value === 'grid') {return 'layout06';}
  if (value === 'feature') {return 'layout01';}
  return 'layout02';
};

const isExternalLink = (value: string) => /^https?:\/\//i.test(value);

const renderBannerItem = (
  item: NormalizedClientItem,
  index: number,
  tokens: ClientsColorTokens,
  sizeClass: string,
  overlayClass = '',
  noBorderRadius = false,
) => {
  const radiusClass = noBorderRadius ? 'rounded-none' : 'rounded-xl md:rounded-2xl';
  const frame = (
    <div
      className={`group relative overflow-hidden ring-1 ring-black/5 ${radiusClass} ${sizeClass}`}
      style={{ backgroundColor: tokens.cardBackground, borderColor: tokens.cardBorder }}
    >
      <PreviewImage
        src={item.url}
        alt={`Banner ${index + 1}`}
        className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
      />
      <div
        className={`pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/[0.03] ${overlayClass}`}
      />
      {item.link ? (
        <div className="absolute bottom-3 left-3 rounded-full px-3 py-1 text-[11px] font-medium text-white backdrop-blur-sm" style={{ backgroundColor: tokens.waveBadgeBackground }}>
          Xem chi tiết
        </div>
      ) : null}
    </div>
  );

  if (!item.link) {
    return <div key={item.key}>{frame}</div>;
  }

  return (
    <a
      key={item.key}
      href={item.link}
      target={isExternalLink(item.link) ? '_blank' : undefined}
      rel={isExternalLink(item.link) ? 'noopener noreferrer' : undefined}
      className="block"
    >
      {frame}
    </a>
  );
};

export function ClientsSectionShared({
  context: _context,
  title,
  style,
  items,
  tokens,
  device: _device = 'desktop',
  skipHeader = false,
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
  noBorderRadius,
  brandColor,
}: ClientsSectionSharedProps) {
  const normalizedItems = React.useMemo(() => normalizeClientItems(items), [items]);
  const selectedStyle = normalizeClientsStyleSafe(style);

  if (normalizedItems.length === 0) {
    return null;
  }

  const sectionTitle = title.trim().length > 0 ? title : 'Khách hàng tin tưởng';
  const effectiveStyle = selectedStyle;

  const innerContent = (
    <div className="mx-auto max-w-7xl space-y-6 px-4">
      {!skipHeader && (
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
      )}

      {effectiveStyle === 'layout01' ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-5">
          {renderBannerItem(normalizedItems[0], 0, tokens, 'w-full h-full min-h-[350px] sm:min-h-[400px] aspect-square md:aspect-auto', '', noBorderRadius)}
          <div className="flex h-full flex-col gap-3 md:gap-5">
            <div className="grid grid-cols-2 gap-3 md:gap-5">
              {normalizedItems.slice(1, 3).map((item, index) => renderBannerItem(item, index + 1, tokens, 'aspect-square w-full', '', noBorderRadius))}
            </div>
            {normalizedItems[3] ? renderBannerItem(normalizedItems[3], 3, tokens, 'aspect-[8/3] md:flex-1 w-full', '', noBorderRadius) : null}
          </div>
        </div>
      ) : null}

      {effectiveStyle === 'layout02' ? (
        renderBannerItem(normalizedItems[0], 0, tokens, 'w-full aspect-[8/3]', '', noBorderRadius)
      ) : null}

      {effectiveStyle === 'layout03' ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-5">
          <div className="col-span-1 md:col-span-2">
            {renderBannerItem(normalizedItems[0], 0, tokens, 'w-full aspect-[8/3]', '', noBorderRadius)}
          </div>
          {normalizedItems.slice(1, 3).map((item, index) => renderBannerItem(item, index + 1, tokens, 'w-full aspect-[16/9]', '', noBorderRadius))}
        </div>
      ) : null}

      {effectiveStyle === 'layout04' ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-5">
          {normalizedItems.slice(0, 2).map((item, index) => renderBannerItem(item, index, tokens, 'w-full aspect-[8/3]', '', noBorderRadius))}
        </div>
      ) : null}

      {effectiveStyle === 'layout05' ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:gap-5">
          {normalizedItems.slice(0, 3).map((item, index) => renderBannerItem(item, index, tokens, 'w-full aspect-[16/9]', '', noBorderRadius))}
        </div>
      ) : null}

      {effectiveStyle === 'layout06' ? (
        <div className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
          {normalizedItems.map((item, index) => renderBannerItem(item, index, tokens, 'w-full aspect-[3/4]', '', noBorderRadius))}
        </div>
      ) : null}

      {effectiveStyle === 'layout07' ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-5">
          {normalizedItems.slice(0, 4).map((item, index) => renderBannerItem(item, index, tokens, 'w-full aspect-[24/9]', '', noBorderRadius))}
        </div>
      ) : null}
    </div>
  );

  // khi skipHeader=true (context=site) - caller đã có section wrapper
  if (skipHeader) {
    return <>{innerContent}</>;
  }

  return (
    <section className="w-full py-8 px-3" style={{ backgroundColor: tokens.neutralBackground }} aria-label={sectionTitle}>
      {innerContent}
    </section>
  );
}

