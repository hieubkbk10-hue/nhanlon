'use client';

import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/app/admin/components/ui';
import { SectionHeader } from '@/app/admin/home-components/_shared/components/SectionHeader';
import { extractSectionHeaderConfig } from '@/app/admin/home-components/_shared/hooks/useSectionHeaderState';
import { getCardsColors, getCounterColors, getGradientColors, getHorizontalColors, getIconsColors, getMinimalColors, getSolarHeroColors } from '@/app/admin/home-components/stats/_lib/colors';
import { AnimatedValue } from '@/app/admin/home-components/stats/_components/AnimatedValue';
import type { StatsItem, StatsStyle } from '@/app/admin/home-components/stats/_types';
import type { HomeComponentSectionProps } from '../types';

const resolveIconComponent = (iconName?: string) => {
  if (!iconName) { return Sparkles; }
  const iconMap = LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>>;
  return iconMap[iconName] ?? Sparkles;
};

const getItemAlignClass = (align?: 'left' | 'center' | 'right') => {
  if (align === 'left') { return 'items-start text-left'; }
  if (align === 'right') { return 'items-end text-right'; }
  return 'items-center text-center';
};

const getIconWrapperClass = (align?: 'left' | 'center' | 'right') => {
  if (align === 'left') { return 'flex justify-start'; }
  if (align === 'right') { return 'flex justify-end'; }
  return 'flex justify-center';
};

const getMediaWrapperClass = (mediaPlacement?: 'top' | 'left', mediaAlign?: 'left' | 'center' | 'right') => {
  if (mediaPlacement === 'left') {
    return 'mb-0 flex shrink-0 items-center justify-center self-center';
  }
  return getIconWrapperClass(mediaAlign);
};

const getItemContainerClass = (mediaPlacement?: 'top' | 'left', mediaAlign?: 'left' | 'center' | 'right') => {
  if (mediaPlacement === 'left') {
    return 'flex items-center justify-center gap-2 text-left';
  }
  return `flex flex-col ${getItemAlignClass(mediaAlign)}`;
};

export function StatsRuntimeSection({ config, brandColor, secondary, mode, title }: HomeComponentSectionProps) {
  const items = (config.items as StatsItem[]) || [];
  const style = (config.style as StatsStyle) || 'horizontal';
  const headerConfig = extractSectionHeaderConfig(config);
  const desktopColumns = (config.desktopColumns as 3 | 4) || 4;
  const fullWidth = typeof config.fullWidth === 'boolean' ? config.fullWidth : false;
  const mediaPlacement = (config.mediaPlacement as 'top' | 'left') || 'top';
  const mediaAlign = (config.mediaAlign as 'left' | 'center' | 'right') || 'center';
  const backgroundImage = typeof config.backgroundImage === 'string' ? config.backgroundImage : '';
  const enableAnimation = typeof config.enableAnimation === 'boolean' ? config.enableAnimation : false;

  const sharedHeader = (
    <SectionHeader
      title={title}
      subtitle={headerConfig.subtitle}
      badgeText={headerConfig.badgeText}
      hideHeader={headerConfig.hideHeader}
      showTitle={headerConfig.showTitle}
      showSubtitle={headerConfig.showSubtitle}
      showBadge={headerConfig.showBadge}
      headerAlign={headerConfig.headerAlign}
      titleColorPrimary={headerConfig.titleColorPrimary}
      subtitleAboveTitle={headerConfig.subtitleAboveTitle}
      uppercaseText={headerConfig.uppercaseText}
      brandColor={brandColor}
    />
  );

  const containerClass = fullWidth ? 'w-full' : 'max-w-7xl mx-auto';

  const gc = (cols: 3 | 4) => ({
    grid: cols === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4',
    tablet: cols === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2',
    mobile: cols === 3 ? 'grid-cols-1' : 'grid-cols-2',
  });

  if (style === 'horizontal') {
    const colors = getHorizontalColors(brandColor, secondary, mode);
    const { grid, tablet, mobile } = gc(desktopColumns);
    return (
      <section className="py-8 px-3">
        <div className={containerClass}>
          {sharedHeader}
          <div className="w-full rounded-lg overflow-hidden" style={{ backgroundColor: colors.sectionBg }}>
            <div className={`grid ${mobile} ${tablet} ${grid} gap-4 py-6 px-6`}>
              {items.slice(0, desktopColumns).map((item, idx) => {
                const IconCmp = item.iconType === 'lucide' && item.iconName ? resolveIconComponent(item.iconName) : null;
                const iconEl = item.iconType === 'lucide' && IconCmp
                  ? <IconCmp size={24} className="sm:w-5 sm:h-5 md:w-[26px] md:h-[26px]" style={{ color: colors.iconColor }} />
                  : item.iconType === 'upload' && item.iconUrl
                    ? <img src={item.iconUrl} alt="" className="w-8 h-8 sm:w-9 sm:h-9 md:w-11 md:h-11 object-contain" />
                  : item.iconType === 'url' && item.iconUrl
                    ? <img src={item.iconUrl} alt="" className="w-[18px] h-[18px] sm:w-5 sm:h-5 md:w-[26px] md:h-[26px] object-contain" />
                    : null;
                return (
                  <div key={idx} className="flex items-center gap-3 justify-center">
                    {iconEl && (
                      <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-[60px] md:h-[60px] rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: colors.iconBg }}>
                        {iconEl}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <AnimatedValue value={item.value} enabled={enableAnimation} className="text-[18px] sm:text-[19px] md:text-[26px] font-bold tracking-tight tabular-nums leading-none mb-0.5" style={{ color: colors.valueColor }} />
                      <h3 className="text-[10px] md:text-[13px] font-medium leading-tight" style={{ color: colors.labelColor }}>{item.label}</h3>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (style === 'cards') {
    const colors = getCardsColors(brandColor, secondary, mode);
    const { grid, tablet, mobile } = gc(desktopColumns);
    return (
      <section className="py-8 px-3">
        {sharedHeader}
        <div className={containerClass}>
          <div className="w-full rounded-lg overflow-hidden border bg-white" style={{ borderColor: colors.border }}>
            <div className={`grid ${mobile} ${tablet} ${grid} divide-x divide-y divide-gray-200 md:divide-y-0`}>
              {items.slice(0, desktopColumns).map((item, idx) => {
                const IconCmp = item.iconType === 'lucide' && item.iconName ? resolveIconComponent(item.iconName) : null;
                const iconEl = item.iconType === 'lucide' && IconCmp
                  ? <IconCmp size={36} className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9" style={{ color: colors.iconColor }} />
                  : item.iconType === 'upload' && item.iconUrl
                    ? <img src={item.iconUrl} alt="" className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-cover" />
                  : item.iconType === 'url' && item.iconUrl
                    ? <img src={item.iconUrl} alt="" className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 object-contain" />
                    : null;
                return (
                  <div key={idx} className="flex items-center gap-3 justify-center py-4 px-4">
                    {iconEl && <div className="shrink-0">{iconEl}</div>}
                    <div className="flex flex-col">
                      <AnimatedValue value={item.value} enabled={enableAnimation} className="text-[18px] sm:text-[19px] md:text-[26px] font-bold tracking-tight tabular-nums leading-none mb-0.5" style={{ color: colors.valueColor }} />
                      <h3 className="text-[10px] md:text-[13px] font-medium leading-tight" style={{ color: colors.labelColor }}>{item.label}</h3>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (style === 'icons') {
    const colors = getIconsColors(brandColor, secondary, mode);
    const { grid, tablet, mobile } = gc(desktopColumns);
    return (
      <section className="py-8 px-3">
        {sharedHeader}
        <div className={containerClass}>
          <div className={`grid gap-5 ${mobile} ${tablet} ${grid}`}>
            {items.slice(0, desktopColumns).map((item, idx) => {
              const IconCmp = item.iconType === 'lucide' && item.iconName ? resolveIconComponent(item.iconName) : null;
              const hasIcon = item.iconType === 'lucide' || item.iconType === 'url' || item.iconType === 'upload';
              const circleEl = (
                <div className={`relative w-20 h-20 rounded-full flex items-center justify-center border shadow-sm shrink-0 ${mediaPlacement === 'left' ? 'mb-0 mr-2' : 'mb-1'}`} style={{ backgroundColor: colors.circleBg, borderColor: colors.ring }}>
                  {item.iconType === 'lucide' && IconCmp
                    ? <IconCmp size={29} style={{ color: colors.textOnCircle }} />
                    : item.iconType === 'upload' && item.iconUrl
                      ? <img src={item.iconUrl} alt="" className="w-11 h-11 md:w-14 md:h-14 object-contain" />
                    : item.iconType === 'url' && item.iconUrl
                      ? <img src={item.iconUrl} alt="" className="w-7 h-7 object-contain" />
                      : <AnimatedValue value={item.value} enabled={enableAnimation} className="text-xl font-bold tracking-tight z-10 tabular-nums" style={{ color: colors.textOnCircle }} />
                  }
                </div>
              );
              return (
                <div key={idx} className={getItemContainerClass(mediaPlacement, mediaAlign)}>
                  {circleEl}
                  <div className={mediaPlacement === 'left' ? 'flex flex-col justify-center' : 'flex flex-col items-center justify-center'}>
                    <h3 className="text-sm font-semibold" style={{ color: colors.label }}>{item.label}</h3>
                    {hasIcon && <AnimatedValue value={item.value} enabled={enableAnimation} className="text-lg font-bold tabular-nums mt-1" style={{ color: brandColor }} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  if (style === 'gradient') {
    const colors = getGradientColors(brandColor, secondary, mode);
    const { grid, tablet, mobile } = gc(desktopColumns);
    return (
      <section className="py-8 px-3">
        {sharedHeader}
        <div className={containerClass}>
          <div className="rounded-2xl overflow-hidden border" style={{ background: colors.background, borderColor: colors.border }}>
            <div className={`grid ${mobile} ${tablet} ${grid}`}>
              {items.slice(0, desktopColumns).map((item, idx) => {
                const IconCmp = item.iconType === 'lucide' && item.iconName ? resolveIconComponent(item.iconName) : null;
                const iconEl = item.iconType === 'lucide' && IconCmp
                  ? <IconCmp size={24} style={{ color: colors.text }} />
                  : item.iconType === 'upload' && item.iconUrl
                    ? <img src={item.iconUrl} alt="" className="w-10 h-10 md:w-12 md:h-12 object-cover" />
                  : item.iconType === 'url' && item.iconUrl
                    ? <img src={item.iconUrl} alt="" className="w-6 h-6 object-contain" />
                    : null;
                return (
                  <div key={idx} className={cn(`relative p-5`, getItemContainerClass(mediaPlacement, mediaAlign), idx !== items.slice(0, desktopColumns).length - 1 ? 'md:border-r md:border-white/10' : '')}>
                    {iconEl && (
                      <div className={cn(mediaPlacement === 'left' ? 'mb-0 mr-2' : 'mb-1', getMediaWrapperClass(mediaPlacement, mediaAlign))}>{iconEl}</div>
                    )}
                    <div className={mediaPlacement === 'left' ? 'flex flex-col justify-center' : 'flex flex-col items-center justify-center'}>
                      <AnimatedValue value={item.value} enabled={enableAnimation} className="text-3xl font-extrabold tracking-tight tabular-nums leading-none mb-1.5" style={{ color: colors.text }} />
                      <h3 className="text-xs font-medium opacity-90" style={{ color: colors.label }}>{item.label}</h3>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (style === 'minimal') {
    const colors = getMinimalColors(brandColor, secondary, mode);
    const { grid, tablet, mobile } = gc(desktopColumns);
    return (
      <section className="py-8 px-3">
        {sharedHeader}
        <div className={containerClass}>
          <div className="bg-slate-50 rounded-lg py-8 px-5">
            <div className={`grid gap-5 ${mobile} ${tablet} ${grid}`}>
              {items.slice(0, desktopColumns).map((item, idx) => {
                const IconCmp = item.iconType === 'lucide' && item.iconName ? resolveIconComponent(item.iconName) : null;
                const iconEl = item.iconType === 'lucide' && IconCmp
                  ? <IconCmp size={22} className="w-4 h-4 sm:w-[18px] sm:h-[18px] md:w-[22px] md:h-[22px]" style={{ color: colors.accent }} />
                  : item.iconType === 'upload' && item.iconUrl
                    ? <img src={item.iconUrl} alt="" className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 object-cover" />
                  : item.iconType === 'url' && item.iconUrl
                    ? <img src={item.iconUrl} alt="" className="w-4 h-4 sm:w-[18px] sm:h-[18px] md:w-[22px] md:h-[22px] object-contain" />
                    : null;
                return (
                  <div key={idx} className={getItemContainerClass(mediaPlacement, mediaAlign)}>
                    {iconEl && (
                      <div className={cn(mediaPlacement === 'left' ? 'mb-0 mr-2' : 'mb-1', getMediaWrapperClass(mediaPlacement, mediaAlign))}>{iconEl}</div>
                    )}
                    <div className={mediaPlacement === 'left' ? 'flex flex-col justify-center' : 'flex flex-col items-center justify-center'}>
                      {mediaPlacement !== 'left' && <div className="w-10 h-0.5 rounded-full mb-2.5" style={{ backgroundColor: colors.accent }} />}
                      <AnimatedValue value={item.value} enabled={enableAnimation} className="text-[22px] sm:text-[27px] md:text-[33px] font-bold tracking-tight tabular-nums leading-none" style={{ color: colors.value }} />
                      <h3 className="text-[11px] md:text-[15px] font-medium text-slate-500 mt-1">{item.label}</h3>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (style === 'solar-hero') {
    const colors = getSolarHeroColors(brandColor, secondary, mode);
    const gridClass = desktopColumns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4';
    const tabletClass = desktopColumns === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2';
    return (
      <section
        className="bg-cover bg-center bg-no-repeat px-2 py-5 md:py-8"
        style={backgroundImage ? { backgroundImage: `url("${backgroundImage}")` } : { backgroundColor: colors.sectionBg }}
      >
        <div className={containerClass}>
          {sharedHeader}
          <div className={`relative z-[1] grid grid-cols-1 ${tabletClass} ${gridClass} gap-2.5`}>
            {items.slice(0, desktopColumns).map((item, idx) => {
              const IconCmp = item.iconType === 'lucide' && item.iconName ? resolveIconComponent(item.iconName) : null;
              const iconEl = item.iconType === 'lucide' && IconCmp
                ? <IconCmp size={54} className="h-11 w-11 md:h-[54px] md:w-[54px]" style={{ color: colors.icon }} />
                : (item.iconType === 'upload' || item.iconType === 'url') && item.iconUrl
                  ? <img src={item.iconUrl} alt={item.label || ''} className="h-12 w-12 object-contain md:h-[60px] md:w-[60px]" />
                  : <Sparkles size={54} className="h-11 w-11 md:h-[54px] md:w-[54px]" style={{ color: colors.icon }} />;

              return (
                <article key={idx} className="flex min-w-0 flex-col">
                  <div className="flex items-center justify-between gap-2.5 rounded-t-[14px] border px-3 py-3" style={{ backgroundColor: colors.cardSurface, borderColor: colors.border }}>
                    <div className="min-w-0">
                      <AnimatedValue value={item.value} enabled={enableAnimation} className="mb-2 text-[28px] font-bold leading-none tracking-tight tabular-nums md:text-[38px]" style={{ color: colors.value }} />
                      <h3 className="text-sm font-medium leading-snug" style={{ color: colors.label }}>{item.label}</h3>
                    </div>
                    <div className="shrink-0">{iconEl}</div>
                  </div>
                  <p className="min-h-[84px] flex-1 rounded-b-[14px] px-3 py-3 text-sm leading-relaxed" style={{ backgroundColor: colors.descriptionBg, color: colors.descriptionText }}>
                    {item.description || `${item.label || 'Số liệu'} nổi bật, khẳng định năng lực và uy tín của thương hiệu.`}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // counter (default fallback)
  const colors = getCounterColors(brandColor, secondary, mode);
  const { grid, tablet, mobile } = gc(desktopColumns);
  return (
    <section className="py-8 px-3">
      {sharedHeader}
      <div className={containerClass}>
        <div className="rounded-lg py-8 px-5" style={{ backgroundColor: colors.background }}>
          <div className={`grid gap-5 ${mobile} ${tablet} ${grid}`}>
            {items.slice(0, desktopColumns).map((item, idx) => {
              const IconCmp = item.iconType === 'lucide' && item.iconName ? resolveIconComponent(item.iconName) : null;
              const iconEl = item.iconType === 'lucide' && IconCmp
                ? <IconCmp size={22} className="w-4 h-4 sm:w-[18px] sm:h-[18px] md:w-[22px] md:h-[22px]" style={{ color: colors.accent }} />
                : item.iconType === 'upload' && item.iconUrl
                  ? <img src={item.iconUrl} alt="" className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 object-cover" />
                : item.iconType === 'url' && item.iconUrl
                  ? <img src={item.iconUrl} alt="" className="w-4 h-4 sm:w-[18px] sm:h-[18px] md:w-[22px] md:h-[22px] object-contain" />
                  : null;
              return (
                <div key={idx} className={getItemContainerClass(mediaPlacement, mediaAlign)}>
                  {iconEl && (
                    <div className={cn(mediaPlacement === 'left' ? 'mb-0 mr-2' : 'mb-1', getMediaWrapperClass(mediaPlacement, mediaAlign))}>{iconEl}</div>
                  )}
                  <div className={mediaPlacement === 'left' ? 'flex flex-col justify-center' : 'flex flex-col items-center justify-center'}>
                    {mediaPlacement !== 'left' && <div className="w-10 h-0.5 rounded-full mb-2.5" style={{ backgroundColor: colors.accent }} />}
                    <AnimatedValue value={item.value} enabled={enableAnimation} className="text-[22px] sm:text-[27px] md:text-[33px] font-bold tracking-tight tabular-nums leading-none" style={{ color: colors.value }} />
                    <h3 className="text-[11px] md:text-[15px] font-medium mt-1" style={{ color: colors.label }}>{item.label}</h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}