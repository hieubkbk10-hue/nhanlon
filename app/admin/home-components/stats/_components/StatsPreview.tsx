'use client';

import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Sparkles } from 'lucide-react';
import { cn } from '../../../components/ui';
import { BrowserFrame } from '../../_shared/components/BrowserFrame';
import { ColorInfoPanel } from '../../_shared/components/ColorInfoPanel';
import { PreviewWrapper } from '../../_shared/components/PreviewWrapper';
import { SectionHeader } from '../../_shared/components/SectionHeader';
import { deviceWidths, usePreviewDevice } from '../../_shared/hooks/usePreviewDevice';
import { STATS_STYLES } from '../_lib/constants';
import { AnimatedValue } from './AnimatedValue';
import {
  getCardsColors,
  getCounterColors,
  getGradientColors,
  getHorizontalColors,
  getIconsColors,
  getMinimalColors,
  getSolarHeroColors,
} from '../_lib/colors';
import type { StatsBrandMode, StatsItem, StatsStyle } from '../_types';

const resolveIconComponent = (iconName?: string) => {
  if (!iconName) {return Sparkles;}
  const iconMap = LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>>;
  return iconMap[iconName] ?? Sparkles;
};

const getItemAlignClass = (align?: 'left' | 'center' | 'right') => {
  if (align === 'left') {return 'items-start text-left';}
  if (align === 'right') {return 'items-end text-right';}
  return 'items-center text-center';
};

const getIconWrapperClass = (align?: 'left' | 'center' | 'right') => {
  // Icon wrapper needs flex to properly align icon
  if (align === 'left') {return 'flex justify-start';}
  if (align === 'right') {return 'flex justify-end';}
  return 'flex justify-center';
};

// Helper for left placement: icon wrapper always centered vertically
const getMediaWrapperClass = (mediaPlacement?: 'top' | 'left', mediaAlign?: 'left' | 'center' | 'right') => {
  if (mediaPlacement === 'left') {
    return 'mb-0 flex shrink-0 items-center justify-center self-center';
  }
  return getIconWrapperClass(mediaAlign);
};

// Helper for item container layout
const getItemContainerClass = (mediaPlacement?: 'top' | 'left', mediaAlign?: 'left' | 'center' | 'right') => {
  if (mediaPlacement === 'left') {
    return 'flex items-center gap-3 text-left';
  }
  return cn('flex flex-col', getItemAlignClass(mediaAlign));
};

export const StatsPreview = ({
  items,
  brandColor,
  secondary,
  mode,
  selectedStyle,
  onStyleChange,
  fontStyle,
  fontClassName,
  title,
  showTitle,
  showSubtitle,
  subtitle,
  headerAlign,
  desktopColumns,
  mediaPlacement,
  mediaAlign,
  backgroundImage,
  fullWidth,
  titleColorPrimary,
  subtitleAboveTitle,
  uppercaseText,
  showBadge,
  badgeText,
  enableAnimation,
  hideHeader,
}: {
  items: StatsItem[];
  brandColor: string;
  secondary: string;
  mode: StatsBrandMode;
  selectedStyle?: StatsStyle;
  onStyleChange?: (style: StatsStyle) => void;
  fontStyle?: React.CSSProperties;
  fontClassName?: string;
  title?: string;
  showTitle?: boolean;
  showSubtitle?: boolean;
  subtitle?: string;
  headerAlign?: 'left' | 'center' | 'right';
  desktopColumns?: 3 | 4;
  mediaPlacement?: 'top' | 'left';
  mediaAlign?: 'left' | 'center' | 'right';
  backgroundImage?: string;
  fullWidth?: boolean;
  hideHeader?: boolean;
  titleColorPrimary?: boolean;
  subtitleAboveTitle?: boolean;
  uppercaseText?: boolean;
  showBadge?: boolean;
  badgeText?: string;
  enableAnimation?: boolean;
}) => {
  const { device, setDevice } = usePreviewDevice();
  const previewStyle = selectedStyle ?? 'horizontal';
  const setPreviewStyle = (style: string) => onStyleChange?.(style as StatsStyle);
  const modeLabel = mode === 'dual' ? '2 màu' : '1 màu';
  const columnsLabel = desktopColumns === 3 ? '3 cột' : '4 cột';
  const info = `${items.filter((item) => item.value || item.label).length} số liệu • ${modeLabel} • ${columnsLabel}`;

  const sharedHeader = (
    <SectionHeader
      title={title}
      subtitle={subtitle}
      headerAlign={headerAlign}
      titleColorPrimary={titleColorPrimary}
      subtitleAboveTitle={subtitleAboveTitle}
      uppercaseText={uppercaseText}
      showTitle={showTitle}
      showSubtitle={showSubtitle}
      showBadge={showBadge}
      badgeText={badgeText}
      hideHeader={hideHeader}
      brandColor={brandColor}
    />
  );

  const containerClass = fullWidth ? 'w-full' : 'max-w-7xl mx-auto';

  const renderHorizontalStyle = () => {
    const colors = getHorizontalColors(brandColor, secondary, mode);
    
    // Responsive logic based on device state and desktopColumns
    let displayCount: number = desktopColumns ?? 4;
    let layoutClass = 'flex-row justify-around';
    
    if (device === 'mobile') {
      displayCount = desktopColumns === 3 ? 1 : 2;
      layoutClass = desktopColumns === 3 ? 'flex-col' : 'flex-row flex-wrap justify-center';
    } else if (device === 'tablet') {
      displayCount = desktopColumns === 3 ? 3 : 2;
      layoutClass = 'flex-row flex-wrap justify-around';
    }
    
    // Font sizes: mobile/tablet -10%, desktop +10%
    const valueFontSize = device === 'desktop' ? 'text-[26px]' : device === 'tablet' ? 'text-[19px]' : 'text-[18px]';
    const labelFontSize = device === 'desktop' ? 'text-[13px]' : 'text-[10px]';
    const iconSize = device === 'mobile' ? 18 : device === 'tablet' ? 20 : 26;
    const circleSize = device === 'mobile' ? 'w-11 h-11' : device === 'tablet' ? 'w-12 h-12' : 'w-[60px] h-[60px]';
    
    return (
      <div>
        {sharedHeader}
        <div className={containerClass}>
          <section 
            className="w-full rounded-lg overflow-hidden" 
            style={{ backgroundColor: colors.sectionBg }}
          >
            <div className={cn(
              'flex items-center',
              layoutClass,
              device === 'mobile' ? 'gap-4 py-4 px-3' : 'gap-6 py-6 px-6'
            )}>
              {items.slice(0, displayCount).map((item, idx) => {
                const IconCmp = item.iconType === 'lucide' && item.iconName ? resolveIconComponent(item.iconName) : null;
                const iconElement = item.iconType === 'lucide' && IconCmp ? (
                  <IconCmp size={iconSize} style={{ color: colors.iconColor }} />
                ) : item.iconType === 'upload' && item.iconUrl ? (
                  <img src={item.iconUrl} alt="" className={cn("object-contain", device === 'mobile' ? 'w-8 h-8' : device === 'tablet' ? 'w-9 h-9' : 'w-11 h-11')} />
                ) : item.iconType === 'url' && item.iconUrl ? (
                  <img src={item.iconUrl} alt="" className={cn("object-contain", device === 'mobile' ? 'w-[18px] h-[18px]' : device === 'tablet' ? 'w-5 h-5' : 'w-[26px] h-[26px]')} />
                ) : null;

                return (
                  <div
                    key={idx}
                    className="flex items-center gap-3"
                  >
                    {iconElement && (
                      <div 
                        className={cn(
                          "rounded-full flex items-center justify-center shrink-0 overflow-hidden",
                          circleSize
                        )}
                        style={{ backgroundColor: colors.iconBg }}
                      >
                        {iconElement}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <AnimatedValue
                        value={item.value || '0'}
                        enabled={enableAnimation || false}
                        className={cn(
                          "font-bold tracking-tight tabular-nums leading-none mb-0.5",
                          valueFontSize
                        )}
                        style={{ color: colors.valueColor }}
                      />
                      <h3 
                        className={cn(
                          "font-medium leading-tight",
                          labelFontSize
                        )}
                        style={{ color: colors.labelColor }}
                      >
                        {item.label || 'Label'}
                      </h3>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    );
  };

  const renderCardsStyle = () => {
    const colors = getCardsColors(brandColor, secondary, mode);
    
    // Responsive logic
    let displayCount: number = desktopColumns ?? 4;
    let gridClass = '';
    
    if (device === 'mobile') {
      displayCount = desktopColumns === 3 ? 1 : 4; // Show all 4 items in 2x2 grid
      gridClass = desktopColumns === 3 ? 'grid-cols-1' : 'grid-cols-2';
    } else if (device === 'tablet') {
      displayCount = desktopColumns === 3 ? 3 : 4;
      gridClass = desktopColumns === 3 ? 'grid-cols-3' : 'grid-cols-2';
    } else {
      displayCount = desktopColumns ?? 4;
      gridClass = desktopColumns === 3 ? 'grid-cols-3' : 'grid-cols-4';
    }
    
    // Font sizes
    const valueFontSize = device === 'desktop' ? 'text-[26px]' : device === 'tablet' ? 'text-[19px]' : 'text-[18px]';
    const labelFontSize = device === 'desktop' ? 'text-[13px]' : 'text-[10px]';
    const iconSize = device === 'mobile' ? 28 : device === 'tablet' ? 32 : 36;
    
    return (
      <div>
        {sharedHeader}
        <div className={containerClass}>
          <section className={cn("w-full", device === 'mobile' ? 'p-2' : 'p-3')}>
            <div className={cn('grid divide-x divide-y divide-gray-200', gridClass, device === 'desktop' && 'divide-y-0')}>
              {items.slice(0, displayCount).map((item, idx) => {
                const IconCmp = item.iconType === 'lucide' && item.iconName ? resolveIconComponent(item.iconName) : null;
                const iconElement = item.iconType === 'lucide' && IconCmp ? (
                  <IconCmp size={iconSize} style={{ color: colors.iconColor }} />
                ) : item.iconType === 'upload' && item.iconUrl ? (
                  <img src={item.iconUrl} alt="" className={cn("object-cover", device === 'mobile' ? 'w-12 h-12' : device === 'tablet' ? 'w-14 h-14' : 'w-16 h-16')} />
                ) : item.iconType === 'url' && item.iconUrl ? (
                  <img src={item.iconUrl} alt="" className={cn("object-contain", device === 'mobile' ? 'w-7 h-7' : device === 'tablet' ? 'w-8 h-8' : 'w-9 h-9')} />
                ) : null;

                return (
                  <div
                    key={idx}
                    className={cn("flex items-center gap-3 justify-center", device === 'mobile' ? 'py-3 px-4' : 'py-4 px-4')}
                  >
                    {iconElement && (
                      <div className="shrink-0">
                        {iconElement}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <AnimatedValue
                        value={item.value || '0'}
                        enabled={enableAnimation || false}
                        className={cn(
                          "font-bold tracking-tight tabular-nums leading-none mb-0.5",
                          valueFontSize
                        )}
                        style={{ color: colors.valueColor }}
                      />
                      <h3 
                        className={cn(
                          "font-medium leading-tight",
                          labelFontSize
                        )}
                        style={{ color: colors.labelColor }}
                      >
                        {item.label || 'Label'}
                      </h3>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    );
  };

  const renderIconsStyle = () => {
    const colors = getIconsColors(brandColor, secondary, mode);
    let gridClass = '';
    if (device === 'mobile') {
      gridClass = desktopColumns === 3 ? 'grid-cols-1' : 'grid-cols-2';
    } else if (device === 'tablet') {
      gridClass = desktopColumns === 3 ? 'grid-cols-3' : 'grid-cols-2';
    } else {
      gridClass = desktopColumns === 3 ? 'grid-cols-3' : 'grid-cols-4';
    }
    return (
      <div>
        {sharedHeader}
        <div className={containerClass}>
          <section className={cn("w-full", device === 'mobile' ? 'py-3 px-2' : 'py-4 px-3')}>
            <div className={cn('grid gap-4', device === 'mobile' ? 'gap-3' : '', gridClass)}>
              {items.slice(0, desktopColumns).map((item, idx) => {
                const IconCmp = item.iconType === 'lucide' && item.iconName ? resolveIconComponent(item.iconName) : null;
                const hasIcon = item.iconType === 'lucide' || item.iconType === 'url' || item.iconType === 'upload';
                
                const circleElement = (
                  <div
                    className={cn(
                      "relative rounded-full flex items-center justify-center border shadow-sm shrink-0 overflow-hidden",
                      device === 'mobile' ? 'w-16 h-16' : 'w-20 h-20',
                      mediaPlacement === 'left' ? 'mb-0' : 'mb-2'
                    )}
                    style={{
                      backgroundColor: colors.circleBg,
                      borderColor: colors.ring,
                    }}
                  >
                    {item.iconType === 'lucide' && IconCmp ? (
                      <IconCmp size={device === 'mobile' ? 24 : 30} style={{ color: colors.textOnCircle }} />
                    ) : item.iconType === 'upload' && item.iconUrl ? (
                      <img src={item.iconUrl} alt="" className={cn("object-contain", device === 'mobile' ? 'w-11 h-11' : 'w-14 h-14')} />
                    ) : item.iconType === 'url' && item.iconUrl ? (
                      <img src={item.iconUrl} alt="" className={cn("object-contain", device === 'mobile' ? 'w-6 h-6' : 'w-7 h-7')} />
                    ) : (
                      <AnimatedValue
                        value={item.value || '0'}
                        enabled={enableAnimation || false}
                        className={cn(
                          "font-bold tracking-tight z-10 tabular-nums",
                          device === 'mobile' ? 'text-lg' : 'text-xl'
                        )}
                        style={{ color: colors.textOnCircle }}
                      />
                    )}
                  </div>
                );

                return (
                  <div key={idx} className={cn(getItemContainerClass(mediaPlacement, mediaAlign))}>
                    {circleElement}
                    <div className={cn(mediaPlacement === 'left' ? 'flex-1' : '')}>
                      <h3
                        className={cn(
                          "font-semibold text-slate-800 dark:text-slate-200",
                          device === 'mobile' ? 'text-xs' : 'text-sm'
                        )}
                        style={{ color: colors.label }}
                      >
                        {item.label || 'Label'}
                      </h3>
                      {hasIcon && (
                        <AnimatedValue
                          value={item.value || '0'}
                          enabled={enableAnimation || false}
                          className={cn("font-bold tabular-nums mt-1", device === 'mobile' ? 'text-base' : 'text-lg')}
                          style={{ color: brandColor }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    );
  };

  const renderGradientStyle = () => {
    const colors = getGradientColors(brandColor, secondary, mode);
    let gridClass = '';
    if (device === 'mobile') {
      gridClass = desktopColumns === 3 ? 'grid-cols-1' : 'grid-cols-2';
    } else if (device === 'tablet') {
      gridClass = desktopColumns === 3 ? 'grid-cols-3' : 'grid-cols-2';
    } else {
      gridClass = desktopColumns === 3 ? 'grid-cols-3' : 'grid-cols-4';
    }
    return (
      <div>
        {sharedHeader}
        <div className={containerClass}>
          <section className={cn("w-full", device === 'mobile' ? 'p-2' : 'p-4')}>
            <div
              className="rounded-2xl overflow-hidden border"
              style={{
                background: colors.background,
                borderColor: colors.border
              }}
            >
              <div className={cn('grid', gridClass)}>
                {items.slice(0, desktopColumns).map((item, idx) => {
                  const IconCmp = item.iconType === 'lucide' && item.iconName ? resolveIconComponent(item.iconName) : null;
                  const iconSize = device === 'mobile' ? 20 : 24;
                  const iconElement = item.iconType === 'lucide' && IconCmp ? (
                    <IconCmp size={iconSize} style={{ color: colors.text }} />
                  ) : item.iconType === 'upload' && item.iconUrl ? (
                    <img src={item.iconUrl} alt="" className={cn("object-cover", device === 'mobile' ? 'w-10 h-10' : 'w-12 h-12')} />
                  ) : item.iconType === 'url' && item.iconUrl ? (
                    <img src={item.iconUrl} alt="" className={cn("object-contain", device === 'mobile' ? 'w-5 h-5' : 'w-6 h-6')} />
                  ) : null;

                  return (
                    <div
                      key={idx}
                      className={cn(
                        "relative justify-center p-4",
                        getItemContainerClass(mediaPlacement, mediaAlign),
                        device === 'mobile' ? 'p-3' : 'p-5',
                        idx !== items.slice(0, desktopColumns).length - 1 && (device === 'mobile' ? '' : 'border-r border-white/10')
                      )}
                    >
                      {iconElement && (
                        <div className={cn(mediaPlacement === 'left' ? 'mb-0' : 'mb-1', getMediaWrapperClass(mediaPlacement, mediaAlign))}>
                          {iconElement}
                        </div>
                      )}
                      <div className={cn(mediaPlacement === 'left' ? 'flex-1' : '')}>
                        <AnimatedValue
                          value={item.value || '0'}
                          enabled={enableAnimation || false}
                          className={cn(
                            "font-extrabold tracking-tight tabular-nums leading-none mb-1",
                            device === 'mobile' ? 'text-2xl' : 'text-3xl'
                          )}
                          style={{ color: colors.text }}
                        />
                        <h3
                          className={cn(
                            "font-medium opacity-90 relative z-10",
                            device === 'mobile' ? 'text-[10px]' : 'text-xs'
                          )}
                          style={{ color: colors.label }}
                        >
                          {item.label || 'Label'}
                        </h3>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  };

  const renderMinimalStyle = () => {
    const colors = getMinimalColors(brandColor, secondary, mode);
    let gridClass = '';
    if (device === 'mobile') {
      gridClass = desktopColumns === 3 ? 'grid-cols-1' : 'grid-cols-2';
    } else if (device === 'tablet') {
      gridClass = desktopColumns === 3 ? 'grid-cols-3' : 'grid-cols-2';
    } else {
      gridClass = desktopColumns === 3 ? 'grid-cols-3' : 'grid-cols-4';
    }
    
    // Font sizes: mobile/tablet -10%, desktop +10%
    const valueFontSize = device === 'desktop' ? 'text-[33px]' : device === 'tablet' ? 'text-[27px]' : 'text-[22px]';
    const labelFontSize = device === 'desktop' ? 'text-[15px]' : device === 'tablet' ? 'text-[11px]' : 'text-[11px]';
    const iconSize = device === 'mobile' ? 16 : device === 'tablet' ? 18 : 22;
    
    return (
      <div>
        {sharedHeader}
        <div className={containerClass}>
          <section className={cn("w-full bg-slate-50 dark:bg-slate-900", device === 'mobile' ? 'py-6 px-3' : 'py-8 px-4')}>
            <div className={cn('grid gap-4', device === 'mobile' ? '' : '', gridClass)}>
              {items.slice(0, desktopColumns).map((item, idx) => {
                const IconCmp = item.iconType === 'lucide' && item.iconName ? resolveIconComponent(item.iconName) : null;
                const iconElement = item.iconType === 'lucide' && IconCmp ? (
                  <IconCmp size={iconSize} style={{ color: colors.accent }} />
                ) : item.iconType === 'upload' && item.iconUrl ? (
                  <img src={item.iconUrl} alt="" className={cn("object-cover", device === 'mobile' ? 'w-9 h-9' : device === 'tablet' ? 'w-10 h-10' : 'w-12 h-12')} />
                ) : item.iconType === 'url' && item.iconUrl ? (
                  <img src={item.iconUrl} alt="" className={cn("object-contain", device === 'mobile' ? 'w-4 h-4' : device === 'tablet' ? 'w-[18px] h-[18px]' : 'w-[22px] h-[22px]')} />
                ) : null;

                return (
                  <div
                    key={idx}
                    className={cn(getItemContainerClass(mediaPlacement, mediaAlign))}
                  >
                    {iconElement && (
                      <div className={cn(mediaPlacement === 'left' ? 'mb-0' : 'mb-2', getMediaWrapperClass(mediaPlacement, mediaAlign))}>
                        {iconElement}
                      </div>
                    )}
                    <div className={cn(mediaPlacement === 'left' ? 'flex-1' : '')}>
                      {mediaPlacement !== 'left' && (
                        <div
                          className="w-10 h-0.5 rounded-full mb-3"
                          style={{ backgroundColor: colors.accent }}
                        />
                      )}
                      <AnimatedValue
                        value={item.value || '0'}
                        enabled={enableAnimation || false}
                        className={cn(
                          "font-bold tracking-tight tabular-nums leading-none text-slate-900 dark:text-white",
                          valueFontSize
                        )}
                        style={{ color: colors.value }}
                      />
                      <h3 className={cn(
                        "font-medium text-slate-500 dark:text-slate-400 mt-1",
                        labelFontSize
                      )}>
                        {item.label || 'Label'}
                      </h3>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    );
  };

  const renderCounterStyle = () => {
    const colors = getCounterColors(brandColor, secondary, mode);
    let gridClass = '';
    if (device === 'mobile') {
      gridClass = desktopColumns === 3 ? 'grid-cols-1' : 'grid-cols-2';
    } else if (device === 'tablet') {
      gridClass = desktopColumns === 3 ? 'grid-cols-3' : 'grid-cols-2';
    } else {
      gridClass = desktopColumns === 3 ? 'grid-cols-3' : 'grid-cols-4';
    }
    
    // Font sizes: mobile/tablet -10%, desktop +10%
    const valueFontSize = device === 'desktop' ? 'text-[33px]' : device === 'tablet' ? 'text-[27px]' : 'text-[22px]';
    const labelFontSize = device === 'desktop' ? 'text-[15px]' : device === 'tablet' ? 'text-[11px]' : 'text-[11px]';
    const iconSize = device === 'mobile' ? 16 : device === 'tablet' ? 18 : 22;
    
    return (
      <div>
        {sharedHeader}
        <div className={containerClass}>
          <section className={cn("w-full rounded-lg overflow-hidden", device === 'mobile' ? 'py-6 px-3' : 'py-8 px-4')} style={{ backgroundColor: colors.background }}>
            <div className={cn('grid gap-4', device === 'mobile' ? '' : '', gridClass)}>
              {items.slice(0, desktopColumns).map((item, idx) => {
                const IconCmp = item.iconType === 'lucide' && item.iconName ? resolveIconComponent(item.iconName) : null;
                const iconElement = item.iconType === 'lucide' && IconCmp ? (
                  <IconCmp size={iconSize} style={{ color: colors.accent }} />
                ) : item.iconType === 'upload' && item.iconUrl ? (
                  <img src={item.iconUrl} alt="" className={cn("object-cover", device === 'mobile' ? 'w-9 h-9' : device === 'tablet' ? 'w-10 h-10' : 'w-12 h-12')} />
                ) : item.iconType === 'url' && item.iconUrl ? (
                  <img src={item.iconUrl} alt="" className={cn("object-contain", device === 'mobile' ? 'w-4 h-4' : device === 'tablet' ? 'w-[18px] h-[18px]' : 'w-[22px] h-[22px]')} />
                ) : null;

                return (
                  <div
                    key={idx}
                    className={cn(getItemContainerClass(mediaPlacement, mediaAlign))}
                  >
                    {iconElement && (
                      <div className={cn(mediaPlacement === 'left' ? 'mb-0' : 'mb-2', getMediaWrapperClass(mediaPlacement, mediaAlign))}>
                        {iconElement}
                      </div>
                    )}
                    <div className={cn(mediaPlacement === 'left' ? 'flex-1' : '')}>
                      {mediaPlacement !== 'left' && (
                        <div
                          className="w-10 h-0.5 rounded-full mb-3"
                          style={{ backgroundColor: colors.accent }}
                        />
                      )}
                      <AnimatedValue
                        value={item.value || '0'}
                        enabled={enableAnimation || false}
                        className={cn(
                          "font-bold tracking-tight tabular-nums leading-none",
                          valueFontSize
                        )}
                        style={{ color: colors.value }}
                      />
                      <h3 className={cn(
                        "font-medium mt-1",
                        labelFontSize
                      )}
                      style={{ color: colors.label }}
                      >
                        {item.label || 'Label'}
                      </h3>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    );
  };

  const renderSolarHeroStyle = () => {
    const colors = getSolarHeroColors(brandColor, secondary, mode);
    const gridClass = device === 'mobile' ? 'grid-cols-1' : device === 'tablet' ? 'grid-cols-2' : 'grid-cols-4';
    const iconSize = device === 'mobile' ? 'h-12 w-12' : 'h-[60px] w-[60px]';
    const valueSize = device === 'desktop' ? 'text-[38px]' : device === 'tablet' ? 'text-[30px]' : 'text-[28px]';

    return (
      <div
        className={cn('relative bg-cover bg-center bg-no-repeat', device === 'mobile' ? 'px-2 py-5' : 'px-2 py-8')}
        style={backgroundImage ? { backgroundImage: `url("${backgroundImage}")` } : { backgroundColor: colors.sectionBg }}
      >
        {sharedHeader}
        <div className={containerClass}>
          <div className={cn('relative z-[1] grid gap-2.5', gridClass)}>
            {items.slice(0, 4).map((item, idx) => {
              const IconCmp = item.iconType === 'lucide' && item.iconName ? resolveIconComponent(item.iconName) : null;
              const iconElement = item.iconType === 'lucide' && IconCmp ? (
                <IconCmp size={device === 'mobile' ? 44 : 54} style={{ color: colors.icon }} />
              ) : (item.iconType === 'upload' || item.iconType === 'url') && item.iconUrl ? (
                <img src={item.iconUrl} alt={item.label || ''} className={cn('object-contain', iconSize)} />
              ) : (
                <Sparkles size={device === 'mobile' ? 44 : 54} style={{ color: colors.icon }} />
              );

              return (
                <article key={idx} className="flex min-w-0 flex-col">
                  <div className="flex items-center justify-between gap-2.5 rounded-t-[14px] border px-3 py-3" style={{ backgroundColor: colors.cardSurface, borderColor: colors.border }}>
                    <div className="min-w-0">
                      <AnimatedValue
                        value={item.value || '0'}
                        enabled={enableAnimation || false}
                        className={cn('mb-2 font-bold leading-none tracking-tight tabular-nums', valueSize)}
                        style={{ color: colors.value }}
                      />
                      <h3 className="text-sm font-medium leading-snug" style={{ color: colors.label }}>{item.label || 'Label'}</h3>
                    </div>
                    <div className="shrink-0">{iconElement}</div>
                  </div>
                  <p
                    className="min-h-[84px] flex-1 rounded-b-[14px] px-3 py-3 text-sm leading-relaxed"
                    style={{ backgroundColor: colors.descriptionBg, color: colors.descriptionText }}
                  >
                    {item.description || `${item.label || 'Số liệu'} nổi bật, khẳng định năng lực và uy tín của thương hiệu.`}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <PreviewWrapper
        title="Preview Stats"
        device={device}
        setDevice={setDevice}
        previewStyle={previewStyle}
        setPreviewStyle={setPreviewStyle}
        styles={STATS_STYLES}
        info={info}
        deviceWidthClass={deviceWidths[device]}
        fontStyle={fontStyle}
        fontClassName={fontClassName}
      >
        <BrowserFrame>
          {previewStyle === 'horizontal' && renderHorizontalStyle()}
          {previewStyle === 'cards' && renderCardsStyle()}
          {previewStyle === 'icons' && renderIconsStyle()}
          {previewStyle === 'gradient' && renderGradientStyle()}
          {previewStyle === 'minimal' && renderMinimalStyle()}
          {previewStyle === 'counter' && renderCounterStyle()}
          {previewStyle === 'solar-hero' && renderSolarHeroStyle()}
        </BrowserFrame>
      </PreviewWrapper>
      <ColorInfoPanel brandColor={brandColor} secondary={secondary} />
    </>
  );
};
