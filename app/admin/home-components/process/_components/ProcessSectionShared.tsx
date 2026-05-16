'use client';

import React from 'react';
import { Layers } from 'lucide-react';
import { cn } from '../../../components/ui';
import { BrowserFrame } from '../../_shared/components/BrowserFrame';
import { ColorInfoPanel } from '../../_shared/components/ColorInfoPanel';
import { PreviewWrapper } from '../../_shared/components/PreviewWrapper';
import { deviceWidths, type PreviewDevice } from '../../_shared/hooks/usePreviewDevice';
import { getAPCALc, getProcessColors, type ProcessColorTokens } from '../_lib/colors';
import type { ProcessBrandMode, ProcessStyle } from '../_types';

type ProcessSectionContext = 'preview' | 'site';

type ProcessSharedStep = {
  key: string;
  icon: string;
  title: string;
  description: string;
};

interface ProcessSectionSharedProps {
  steps: ProcessSharedStep[];
  sectionTitle: string;
  style: ProcessStyle;
  brandColor: string;
  secondary: string;
  mode: ProcessBrandMode;
  context: ProcessSectionContext;
  previewDevice?: PreviewDevice;
  setPreviewDevice?: (device: PreviewDevice) => void;
  includePreviewWrapper?: boolean;
  previewStyle?: ProcessStyle;
  onPreviewStyleChange?: (style: ProcessStyle) => void;
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
  fontStyle?: React.CSSProperties;
  fontClassName?: string;
  desktopColumns?: 3 | 4;
}

const PROCESS_STYLES: Array<{ id: ProcessStyle; label: string }> = [
  { id: 'horizontal', label: 'Horizontal' },
  { id: 'stepper', label: 'Stepper' },
  { id: 'cards', label: 'Cards' },
  { id: 'accordion', label: 'Accordion' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'grid', label: 'Grid' },
  { id: 'alternating', label: 'Alternating' },
];

const PREVIEW_MAX_VISIBLE_BY_STYLE: Record<ProcessStyle, Record<PreviewDevice, number>> = {
  horizontal: { desktop: 4, tablet: 4, mobile: 4 },
  stepper: { desktop: 4, tablet: 4, mobile: 4 },
  cards: { desktop: 4, tablet: 4, mobile: 4 },
  accordion: { desktop: 4, tablet: 4, mobile: 4 },
  minimal: { desktop: 4, tablet: 4, mobile: 4 },
  grid: { desktop: 4, tablet: 4, mobile: 4 },
  alternating: { desktop: 4, tablet: 4, mobile: 4 },
};

const getMaxVisible = (
  style: ProcessStyle,
  context: ProcessSectionContext,
  previewDevice: PreviewDevice,
) => {
  if (context === 'site') {
    return PREVIEW_MAX_VISIBLE_BY_STYLE[style].desktop;
  }
  return PREVIEW_MAX_VISIBLE_BY_STYLE[style][previewDevice];
};

const getSectionPadding = (context: ProcessSectionContext, device: PreviewDevice) => {
  if (context === 'preview') {
    return cn('py-5 px-4', device === 'mobile' ? 'py-4 px-3' : 'md:py-6 md:px-6');
  }
  return 'py-6 md:py-10 px-4';
};

const getResponsiveGridClass = (count: number, desktopColumns: 3 | 4 = 4) => {
  if (count <= 1) { return 'grid-cols-1'; }
  if (desktopColumns === 3) {
    // 3 cols desktop / 3 tablet / 1 mobile
    return 'grid-cols-1 md:grid-cols-3';
  }
  // 4 cols desktop / 2 tablet / 2 mobile
  if (count <= 2) { return 'grid-cols-2'; }
  return 'grid-cols-2 md:grid-cols-4';
};

const getSharedInfoText = (style: ProcessStyle, total: number, visible: number, mode: ProcessBrandMode) => {
  if (total === 0) {return `Chưa có bước nào • ${mode === 'dual' ? '2 màu' : '1 màu'}`;}

  const remaining = Math.max(total - visible, 0);
  const base = `${total} bước`;
  const styleLabel = PROCESS_STYLES.find((item) => item.id === style)?.label ?? 'Horizontal';
  const hiddenLabel = remaining > 0 ? ` • +${remaining} ẩn` : '';
  const modeLabel = mode === 'dual' ? ' • 2 màu' : ' • 1 màu';
  return `${base} • ${styleLabel}${hiddenLabel}${modeLabel}`;
};

const renderEmptyState = (tokens: ProcessColorTokens) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: tokens.emptyIconBg }}>
      <Layers size={32} style={{ color: tokens.emptyIconColor }} />
    </div>
    <h3 className="font-medium mb-1" style={{ color: tokens.bodyText }}>Chưa có bước nào</h3>
    <p className="text-sm" style={{ color: tokens.mutedText }}>Thêm bước đầu tiên để bắt đầu</p>
  </div>
);

const renderHorizontal = ({
  tokens,
  steps,
  sectionTitle,
  context,
  previewDevice,
  headerConfig = {},
  desktopColumns = 4,
}: {
  tokens: ProcessColorTokens;
  steps: ProcessSharedStep[];
  sectionTitle: string;
  context: ProcessSectionContext;
  previewDevice: PreviewDevice;
  headerConfig?: HeaderConfig;
  desktopColumns?: 3 | 4;
}) => {
  if (steps.length === 0) {return renderEmptyState(tokens);}

  const maxVisible = getMaxVisible('horizontal', context, previewDevice);
  const visibleSteps = steps.slice(0, maxVisible);
  const remainingCount = steps.length - visibleSteps.length;
  const containerClass = getSectionPadding(context, previewDevice);
  const isSite = context === 'site';
  const isMobile = previewDevice === 'mobile';

  // Dot size: site uses responsive, admin uses JS
  const dotClass = isSite
    ? 'w-8 h-8 sm:w-10 sm:h-10'
    : (isMobile ? 'w-8 h-8' : 'w-10 h-10');

  const lineHeight = isSite ? 40 : (isMobile ? 32 : 40);
  const lineMarginTop = isSite ? -40 : (isMobile ? -32 : -40);

  return (
    <div className={containerClass} style={{ backgroundColor: tokens.neutralBackground }}>
      {renderSectionHeader({ tokens, sectionTitle, previewDevice, headerConfig, showBadgeInline: true })}

      <div className="relative">
        {/* Progress line behind dots */}
        <div className={cn('grid', getResponsiveGridClass(Math.min(visibleSteps.length, 5), desktopColumns))}>
          <div className="col-span-full relative" style={{ height: lineHeight }}>
            {/* Track line - from center of first col to center of last col */}
            <div
              className="absolute top-1/2 h-0.5 -translate-y-1/2"
              style={{
                backgroundColor: tokens.progressTrack,
                left: `${100 / (visibleSteps.length * 2)}%`,
                right: `${100 / (visibleSteps.length * 2)}%`,
              }}
            />
            <div
              className="absolute top-1/2 h-0.5 -translate-y-1/2"
              style={{
                backgroundColor: tokens.progressFill,
                left: `${100 / (visibleSteps.length * 2)}%`,
                right: `${100 / (visibleSteps.length * 2)}%`,
              }}
            />
          </div>
        </div>

        {/* Dots + text unified grid */}
        <div className={cn('grid gap-3', getResponsiveGridClass(Math.min(visibleSteps.length, 5), desktopColumns))} style={{ marginTop: lineMarginTop }}>
          {visibleSteps.map((step, idx) => (
            <div key={step.key} className="flex flex-col items-center text-center">
              <div
                className={cn(
                  'flex items-center justify-center rounded-full font-bold text-xs border-2 relative z-10 mb-2',
                  dotClass,
                )}
                style={{
                  backgroundColor: tokens.stepDotBg,
                  color: tokens.stepDotText,
                  borderColor: tokens.neutralSurface,
                  boxShadow: `0 2px 8px ${tokens.stepDotShadow}`,
                }}
              >
                {step.icon || idx + 1}
              </div>
              <h4 className={cn('font-semibold mb-1', isSite ? 'text-xs sm:text-sm' : 'text-sm')} style={{ color: tokens.bodyText }}>
                {step.title || `Bước ${idx + 1}`}
              </h4>
              <p className="text-xs" style={{ color: tokens.mutedText }}>
                {step.description || 'Mô tả...'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {remainingCount > 0 && (
        <div className="text-center mt-4">
          <span className="text-xs" style={{ color: tokens.secondary }}>+{remainingCount} bước khác</span>
        </div>
      )}
    </div>
  );
};

const padNumber = (n: number) => String(n).padStart(2, '0');

const renderStepper = ({
  tokens,
  steps,
  sectionTitle,
  context,
  previewDevice,
  headerConfig = {},
  desktopColumns: _desktopColumns = 4,
}: {
  tokens: ProcessColorTokens;
  steps: ProcessSharedStep[];
  sectionTitle: string;
  context: ProcessSectionContext;
  previewDevice: PreviewDevice;
  headerConfig?: HeaderConfig;
  desktopColumns?: 3 | 4;
}) => {
  if (steps.length === 0) {return renderEmptyState(tokens);}

  const maxVisible = getMaxVisible('stepper', context, previewDevice);
  const visibleSteps = steps.slice(0, maxVisible);
  const remainingCount = steps.length - visibleSteps.length;

  const [activeStep, setActiveStep] = React.useState<number>(0);


  return (
    <div className={getSectionPadding(context, previewDevice)} style={{ backgroundColor: tokens.neutralBackground }}>
      {renderSectionHeader({ tokens, sectionTitle, previewDevice, headerConfig, showBadgeInline: true })}

      <div className={cn('mx-auto', previewDevice === 'mobile' ? 'max-w-sm' : 'max-w-2xl')}>
        {visibleSteps.map((step, idx) => {
          const isActive = activeStep === idx;
          const stepNum = step.icon && /^\d+$/.test(step.icon) ? padNumber(Number(step.icon)) : (step.icon || padNumber(idx + 1));

          return (
            <div
              key={step.key}
              className="flex items-center cursor-pointer group"
              onClick={() => setActiveStep(idx)}
            >
              {/* Step number + vertical line */}
              <div className="relative flex flex-col items-center justify-center flex-shrink-0 w-10 self-stretch">
                {/* Vertical line from center downward */}
                {idx < visibleSteps.length - 1 && (
                  <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5"
                    style={{ backgroundColor: tokens.connectorLine, top: '50%' }}
                  />
                )}
                {/* Vertical line from top to center (from previous step) */}
                {idx > 0 && (
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5"
                    style={{ backgroundColor: tokens.connectorLine, bottom: '50%' }}
                  />
                )}
                {/* Step dot */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-colors duration-200 relative z-10"
                  style={{
                    backgroundColor: isActive ? tokens.stepDotBg : `${tokens.stepDotBg}18`,
                    color: isActive ? tokens.stepDotText : tokens.stepDotBg,
                  }}
                >
                  {stepNum}
                </div>
              </div>

              {/* Horizontal connector line (dot → card) */}
              <div className="w-4 h-0.5 flex-shrink-0" style={{ backgroundColor: tokens.connectorLine }} />

              {/* Card content */}
              <div
                className={cn(
                  'flex-1 rounded-xl border-2 p-4 transition-colors duration-200',
                  previewDevice === 'mobile' && 'p-3',
                  idx < visibleSteps.length - 1 && 'mb-3',
                )}
                style={{
                  backgroundColor: tokens.neutralSurface,
                  borderColor: isActive ? tokens.stepDotBg : tokens.cardBorder,
                }}
              >
                <h4
                  className={cn(
                    'font-bold mb-1 tracking-tight',
                    previewDevice === 'mobile' ? 'text-base' : 'text-lg',
                  )}
                  style={{ color: tokens.bodyText }}
                >
                  {step.title || `Bước ${idx + 1}`}
                </h4>
                <p
                  className={cn(
                    'leading-relaxed',
                    previewDevice === 'mobile' ? 'text-xs' : 'text-sm',
                  )}
                  style={{ color: tokens.mutedText }}
                >
                  {step.description || 'Mô tả bước này...'}
                </p>
              </div>
            </div>
          );
        })}

        {remainingCount > 0 && (
          <div className="text-center mt-4">
            <span className="text-xs" style={{ color: tokens.secondary }}>+{remainingCount} bước khác</span>
          </div>
        )}
      </div>
    </div>
  );
};

const renderCards = ({
  tokens,
  steps,
  sectionTitle,
  context,
  previewDevice,
  headerConfig = {},
  desktopColumns = 4,
}: {
  tokens: ProcessColorTokens;
  steps: ProcessSharedStep[];
  sectionTitle: string;
  context: ProcessSectionContext;
  previewDevice: PreviewDevice;
  headerConfig?: HeaderConfig;
  desktopColumns?: 3 | 4;
}) => {
  if (steps.length === 0) {return renderEmptyState(tokens);}

  const maxVisible = getMaxVisible('cards', context, previewDevice);
  const visibleSteps = steps.slice(0, maxVisible);
  const isMobile = previewDevice === 'mobile';
  const isTablet = previewDevice === 'tablet';
  const isSite = context === 'site';

  // Grid: responsive based on desktopColumns
  const gridClass = desktopColumns === 3
    ? (isSite
      ? 'grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-3'
      : cn('grid', isMobile ? 'grid-cols-1 gap-5' : 'grid-cols-3 gap-3'))
    : (isSite
      ? 'grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-2'
      : cn('grid', isMobile ? 'grid-cols-2 gap-4' : (isTablet ? 'grid-cols-2 gap-4' : 'grid-cols-4 gap-2')));

  // Circle: site uses responsive sizing, admin uses JS conditional
  const circleClass = isSite
    ? 'w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24'
    : (isMobile ? 'w-20 h-20' : 'w-24 h-24');

  const numberClass = isSite
    ? 'text-xl sm:text-2xl lg:text-3xl'
    : (isMobile ? 'text-2xl' : 'text-3xl');

  const titleClass = isSite
    ? 'text-sm lg:text-base'
    : (isMobile ? 'text-sm' : 'text-base');

  const descClass = isSite
    ? 'text-xs lg:text-sm'
    : (isMobile ? 'text-xs' : 'text-sm');

  return (
    <div className={getSectionPadding(context, previewDevice)} style={{ backgroundColor: tokens.neutralBackground }}>
      {renderSectionHeader({ tokens, sectionTitle, previewDevice, headerConfig, showBadgeInline: true })}

      <div className={gridClass}>
        {visibleSteps.map((step, idx) => {
          const stepNum = step.icon && /^\d+$/.test(step.icon) ? padNumber(Number(step.icon)) : padNumber(idx + 1);
          const isLast = idx === visibleSteps.length - 1;

          return (
            <div key={step.key} className="relative flex flex-col items-center text-center">
              {/* Dashed S-curve arrow connector — desktop only */}
              {!isLast && (
                <div className={cn(
                  'absolute top-10 left-[45%] w-[115%] z-0',
                  isSite ? 'hidden lg:block' : (!isMobile && !isTablet ? 'block' : 'hidden'),
                )}>
                  <svg
                    viewBox="0 0 140 50"
                    className="w-full h-14 overflow-visible"
                    fill="none"
                  >
                    <path
                      d="M5 38 C40 38, 45 8, 70 22 C95 38, 100 8, 135 8"
                      stroke={tokens.connectorLine}
                      strokeWidth="1.5"
                      strokeDasharray="5 4"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <path
                      d="M128 3 L136 8 L128 13"
                      stroke={tokens.connectorLine}
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                </div>
              )}

              {/* Number circle */}
              <div className="relative mb-3 z-10">
                <div
                  className={cn('rounded-full flex items-center justify-center shadow-lg', circleClass)}
                  style={{ backgroundColor: tokens.primary }}
                >
                  <span
                    className={cn('font-bold', numberClass)}
                    style={{ color: tokens.stepDotText }}
                  >
                    {stepNum}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h3
                className={cn('font-semibold mb-1 italic', titleClass)}
                style={{ color: tokens.bodyText }}
              >
                {step.title || `Bước ${idx + 1}`}
              </h3>

              {/* Description */}
              <p
                className={cn('leading-relaxed px-2', descClass)}
                style={{ color: tokens.mutedText }}
              >
                {step.description || 'Mô tả bước này...'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const renderAccordion = ({
  tokens,
  steps,
  sectionTitle,
  context,
  previewDevice,
  headerConfig = {},
  desktopColumns: _desktopColumns = 4,
}: {
  tokens: ProcessColorTokens;
  steps: ProcessSharedStep[];
  sectionTitle: string;
  context: ProcessSectionContext;
  previewDevice: PreviewDevice;
  headerConfig?: HeaderConfig;
  desktopColumns?: 3 | 4;
}) => {
  if (steps.length === 0) {return renderEmptyState(tokens);}

  const maxVisible = getMaxVisible('accordion', context, previewDevice);
  const visibleSteps = steps.slice(0, maxVisible);
  const isMobile = previewDevice === 'mobile';
  const isTablet = previewDevice === 'tablet';
  const isSite = context === 'site';

  // Generate zigzag positions for N steps
  const stepCount = visibleSteps.length;
  const getStepPosition = (idx: number, total: number) => {
    const xPercent = total <= 1 ? 50 : 14 + (idx * (72 / (total - 1)));
    // Zigzag: even index = bottom (55%), odd index = top (15% — circle sits on the wave)
    const isTop = idx % 2 !== 0;
    const yPercent = isTop ? 26 : 55;
    return { x: xPercent, y: yPercent };
  };

  // Build SVG path — line oscillates between top and bottom rows
  const buildWavePath = (total: number) => {
    if (total <= 1) {return '';}
    const points = Array.from({ length: total }, (_, i) => {
      const pos = getStepPosition(i, total);
      return { x: pos.x * 10, y: pos.y === 26 ? 95 : 160 };
    });

    let path = `M${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const midX = (curr.x + next.x) / 2;
      path += ` Q${midX} ${curr.y === 160 ? 35 : 220}, ${next.x} ${next.y}`;
    }
    return path;
  };

  const wavePath = buildWavePath(stepCount);

  // Circle styles
  const circleSize = isMobile || isTablet ? 'w-16 h-16' : 'w-20 h-20';
  const circleTextSize = isMobile || isTablet ? 'text-2xl' : 'text-3xl';
  const siteCircleSize = 'w-16 h-16 lg:w-20 lg:h-20';
  const siteCircleText = 'text-2xl lg:text-3xl';

  const resolvedCircle = isSite ? siteCircleSize : circleSize;
  const resolvedText = isSite ? siteCircleText : circleTextSize;

  return (
    <div className={getSectionPadding(context, previewDevice)} style={{ backgroundColor: tokens.neutralBackground }}>
      {renderSectionHeader({ tokens, sectionTitle, previewDevice, headerConfig, showBadgeInline: true })}

      {/* Desktop Layout - Zigzag wave */}
      <div className={cn(
        'relative',
        isSite ? 'hidden md:block' : (isMobile || isTablet ? 'hidden' : 'block'),
      )} style={{ height: 420 }}>
        {/* Wavy dashed SVG line — behind circles */}
        {wavePath && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            viewBox="0 0 1000 200"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
          >
            <path
              d={wavePath}
              stroke={tokens.connectorLine}
              strokeWidth="2"
              strokeDasharray="8 6"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        )}

        {/* Step circles positioned along the wave */}
        {visibleSteps.map((step, idx) => {
          const pos = getStepPosition(idx, stepCount);
          const stepNum = step.icon && /^\d+$/.test(step.icon) ? step.icon : String(idx + 1);

          return (
            <div
              key={step.key}
              className="absolute flex flex-col items-center text-center z-10"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: 'translateX(-50%)',
              }}
            >
              <div
                className={cn(
                  'rounded-full bg-white flex items-center justify-center border-4 mb-2',
                  resolvedCircle,
                )}
                style={{
                  borderColor: tokens.primary,
                  boxShadow: `0 8px 20px ${tokens.primary}30`,
                }}
              >
                <span
                  className={cn('font-bold', resolvedText)}
                  style={{ color: tokens.primary }}
                >
                  {stepNum}
                </span>
              </div>
              <h4
                className="text-sm font-semibold leading-tight max-w-[220px] mb-1"
                style={{ color: tokens.bodyText }}
              >
                {step.title || `Bước ${idx + 1}`}
              </h4>
              <p
                className="text-xs leading-relaxed max-w-[220px]"
                style={{ color: tokens.mutedText }}
              >
                {step.description || 'Mô tả bước này...'}
              </p>
            </div>
          );
        })}
      </div>

      {/* Mobile/Tablet Layout - Simple 2-col grid */}
      <div className={cn(
        isSite ? 'md:hidden' : (isMobile || isTablet ? 'block' : 'hidden'),
      )}>
        <div className={cn('grid gap-4', isSite ? 'grid-cols-2' : (isMobile ? 'grid-cols-1' : 'grid-cols-2'))}>
          {visibleSteps.map((step, idx) => {
            const stepNum = step.icon && /^\d+$/.test(step.icon) ? step.icon : String(idx + 1);

            return (
              <div key={step.key} className="flex flex-col items-center text-center">
                <div
                  className="w-16 h-16 rounded-full bg-white flex items-center justify-center border-4 mb-2"
                  style={{
                    borderColor: tokens.primary,
                    boxShadow: `0 6px 16px ${tokens.primary}30`,
                  }}
                >
                  <span className="text-2xl font-bold" style={{ color: tokens.primary }}>
                    {stepNum}
                  </span>
                </div>
                <h4 className="text-xs font-semibold leading-tight px-2 mb-1" style={{ color: tokens.bodyText }}>
                  {step.title || `Bước ${idx + 1}`}
                </h4>
                <p className="text-xs leading-relaxed px-2" style={{ color: tokens.mutedText }}>
                  {step.description || 'Mô tả bước này...'}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const renderMinimal = ({
  tokens,
  steps,
  sectionTitle,
  context,
  previewDevice,
  headerConfig = {},
  desktopColumns = 4,
}: {
  tokens: ProcessColorTokens;
  steps: ProcessSharedStep[];
  sectionTitle: string;
  context: ProcessSectionContext;
  previewDevice: PreviewDevice;
  headerConfig?: HeaderConfig;
  desktopColumns?: 3 | 4;
}) => {
  if (steps.length === 0) {return renderEmptyState(tokens);}

  const maxVisible = getMaxVisible('minimal', context, previewDevice);
  const visibleSteps = steps.slice(0, maxVisible);
  const remainingCount = steps.length - visibleSteps.length;

  const isSite = context === 'site';
  const isMobile = previewDevice === 'mobile';
  const isTablet = previewDevice === 'tablet';
  const isCompact = isMobile || isTablet;

  // Derive tint color from primary for icon circle backgrounds
  const iconCircleBg = `${tokens.primary}1A`; // 10% opacity of primary

  // Smart badge/accent color on dark band (#0a0f18)
  // Single: brand if readable on dark, else white
  // Dual: primary if readable → secondary if readable → white
  const DARK_BAND_BG = '#0a0f18';
  const MIN_CONTRAST = 45; // APCA Lc threshold for small bold text
  const primaryLc = getAPCALc(tokens.primary, DARK_BAND_BG);
  const secondaryLc = getAPCALc(tokens.secondary, DARK_BAND_BG);
  const badgeAccentColor = primaryLc >= MIN_CONTRAST
    ? tokens.primary
    : (secondaryLc >= MIN_CONTRAST ? tokens.secondary : '#ffffff');

  // Badge info from headerConfig
  const {
    showBadge = true,
    badgeText = '',
    showTitle = true,
    subtitle = '',
    showSubtitle = true,
  } = headerConfig;

  const resolvedBadge = typeof badgeText === 'string' ? badgeText.trim() : '';
  const resolvedSubtitle = typeof subtitle === 'string' ? subtitle.trim() : '';
  const hasBadge = showBadge && resolvedBadge.length > 0;
  const hasSubtitle = showSubtitle && resolvedSubtitle.length > 0;

  // Layout classes
  const outerPadding = isSite
    ? 'py-6 md:py-10 lg:py-14'
    : (isCompact ? 'py-4 px-3' : 'py-5 md:py-10 px-4');

  const flexDirection = isSite
    ? 'flex-col lg:flex-row'
    : (isCompact ? 'flex-col' : 'flex-row');

  const headerWidth = isSite
    ? 'w-full lg:w-[30%]'
    : (isCompact ? 'w-full' : 'w-[30%]');

  const cardsWidth = isSite
    ? 'w-full lg:w-[70%]'
    : (isCompact ? 'w-full' : 'w-[70%]');

  // Cards grid: use desktopColumns setting
  const mdColsMap: Record<number, string> = {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  };
  const desktopColsClass = mdColsMap[desktopColumns] ?? 'md:grid-cols-4';
  const gridClass = desktopColumns === 3
    ? (isSite
      ? `grid-cols-1 ${desktopColsClass}`
      : (isCompact ? 'grid-cols-1' : desktopColsClass))
    : (isSite
      ? `grid-cols-2 ${desktopColsClass}`
      : (isCompact ? 'grid-cols-2' : desktopColsClass));

  const gapClass = isSite
    ? 'gap-2 md:gap-3'
    : (isCompact ? 'gap-2' : 'gap-2 md:gap-3');

  // Card sizing
  const cardPadding = isSite
    ? 'p-4 md:p-5 lg:p-6'
    : (isCompact ? 'p-3' : 'p-4 md:p-5 lg:p-6');

  const iconSize = isSite
    ? 'w-[36px] h-[36px] md:w-[43px] md:h-[43px] lg:w-[50px] lg:h-[50px]'
    : (isCompact ? 'w-[31px] h-[31px]' : 'w-[36px] h-[36px] md:w-[43px] md:h-[43px] lg:w-[50px] lg:h-[50px]');

  const iconInner = isSite
    ? 'w-[1rem] h-[1rem] md:w-[1.2rem] md:h-[1.2rem] lg:w-[1.4rem] lg:h-[1.4rem]'
    : (isCompact ? 'w-[0.85rem] h-[0.85rem]' : 'w-[1rem] h-[1rem] md:w-[1.2rem] md:h-[1.2rem]');

  const cardMinH = isSite
    ? 'min-h-[280px] lg:min-h-[380px]'
    : (isCompact ? 'min-h-[200px]' : 'min-h-[280px] lg:min-h-[380px]');

  const titleSize = isSite
    ? 'text-[1rem] md:text-[1.08rem] lg:text-[1.2rem]'
    : (isCompact ? 'text-xs' : 'text-[1rem] md:text-[1.08rem] lg:text-[1.2rem]');

  const descSize = isSite
    ? 'text-[11px] md:text-[12px] lg:text-[13px]'
    : (isCompact ? 'text-[10px]' : 'text-[11px] md:text-[12px]');

  const headingSize = isSite
    ? 'text-[14px] md:text-base lg:text-[1.4rem]'
    : (isCompact ? 'text-[10px]' : 'text-[14px] md:text-base lg:text-[1.35rem]');

  return (
    <div className={outerPadding} style={{ backgroundColor: tokens.neutralBackground }}>
      <div className="relative w-full max-w-[1360px] mx-auto flex items-center">
        {/* Dark Background Band */}
        <div
          className={cn(
            'absolute left-0 right-0',
            isSite
              ? 'top-0 bottom-[120px] md:bottom-[160px] lg:top-[20%] lg:bottom-[20%] lg:right-4'
              : (isCompact
                ? 'top-0 bottom-[100px]'
                : 'top-[20%] bottom-[20%] right-4'),
          )}
          style={{ backgroundColor: '#0a0f18' }}
        />

        <div className={cn('relative z-10 w-full flex items-stretch gap-3 px-4 md:px-6 lg:px-8', flexDirection)}>
          {/* Header Text Block */}
          <div className={cn('flex flex-col justify-start py-4', headerWidth, isSite ? 'lg:justify-center lg:py-0' : (!isCompact ? 'justify-center py-0' : ''))}>
            {hasBadge && (
              <div className="flex items-center gap-2 mb-3 lg:mb-4" style={{ color: badgeAccentColor }}>
                <Layers className={cn('stroke-[2]', isSite ? 'w-4 h-4 lg:w-5 lg:h-5' : (isCompact ? 'w-3.5 h-3.5' : 'w-4 h-4'))} />
                <span className={cn('font-bold', isSite ? 'text-[12px] lg:text-[13px]' : (isCompact ? 'text-[10px]' : 'text-xs'))}>{resolvedBadge}</span>
              </div>
            )}
            {showTitle && (
              <h2
                className={cn('font-bold tracking-tight leading-[1.2]', headingSize)}
                style={{ color: '#ffffff' }}
              >
                {sectionTitle || 'Quy trình làm việc'}
              </h2>
            )}
            {hasSubtitle && (
              <p
                className={cn('mt-1.5 leading-relaxed', isSite ? 'text-[9px] lg:text-[11px]' : (isCompact ? 'text-[7px]' : 'text-[9px]'))}
                style={{ color: 'rgba(255,255,255,0.65)' }}
              >
                {resolvedSubtitle}
              </p>
            )}
          </div>

          {/* Cards */}
          <div className={cn('grid', gridClass, gapClass, cardsWidth)}>
            {visibleSteps.map((step, idx) => {
              const _stepNum = padNumber(step.icon && /^\d+$/.test(step.icon) ? Number(step.icon) : idx + 1);

              return (
                <div
                  key={step.key}
                  className={cn(
                    'bg-white border border-[#e2e8f0]/80 flex flex-col relative shadow-sm hover:shadow-md transition-shadow',
                    cardPadding,
                    cardMinH,
                  )}
                >


                  {/* Icon circle */}
                  <div
                    className={cn('rounded-full flex items-center justify-center mb-5 mt-1', iconSize, isSite ? 'lg:mb-9' : (!isCompact ? 'lg:mb-9' : 'mb-4'))}
                    style={{ backgroundColor: iconCircleBg }}
                  >
                    <span className={iconInner} style={{ color: tokens.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: isCompact ? '0.72rem' : '1rem' }}>
                      {step.icon || (idx + 1)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className={cn('font-bold tracking-tight mb-2 lg:mb-3.5', titleSize)}
                    style={{ color: tokens.bodyText }}
                  >
                    {step.title || `Bước ${idx + 1}`}
                  </h3>

                  {/* Description */}
                  <p
                    className={cn('leading-[1.6] lg:leading-[1.65]', descSize)}
                    style={{ color: tokens.mutedText }}
                  >
                    {step.description || 'Mô tả bước này...'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {remainingCount > 0 && (
        <div className="text-center mt-4">
          <span className="text-xs" style={{ color: tokens.secondary }}>+{remainingCount} bước khác</span>
        </div>
      )}
    </div>
  );
};

const renderGrid = ({
  tokens,
  steps,
  sectionTitle,
  context,
  previewDevice,
  headerConfig = {},
  desktopColumns = 4,
}: {
  tokens: ProcessColorTokens;
  steps: ProcessSharedStep[];
  sectionTitle: string;
  context: ProcessSectionContext;
  previewDevice: PreviewDevice;
  headerConfig?: HeaderConfig;
  desktopColumns?: 3 | 4;
}) => {
  if (steps.length === 0) {return renderEmptyState(tokens);}

  const maxVisible = getMaxVisible('grid', context, previewDevice);
  const visibleSteps = steps.slice(0, maxVisible);
  const remainingCount = steps.length - visibleSteps.length;

  return (
    <div className={getSectionPadding(context, previewDevice)} style={{ backgroundColor: tokens.neutralBackground }}>
      {renderSectionHeader({ tokens, sectionTitle, previewDevice, headerConfig, showBadgeInline: true })}

      <div className={cn(
        'grid gap-3',
        desktopColumns === 3
          ? (previewDevice === 'mobile' ? 'grid-cols-1' : 'grid-cols-3')
          : (previewDevice === 'mobile' ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'),
      )}>
        {visibleSteps.map((step, idx) => (
          <div
            key={step.key}
            className="rounded-xl p-4 border"
            style={{ backgroundColor: tokens.neutralSurface, borderColor: tokens.cardBorder }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm mb-3"
              style={{ backgroundColor: tokens.stepDotBg, color: tokens.stepDotText }}
            >
              {step.icon || idx + 1}
            </div>
            <h4 className="font-semibold text-sm mb-1.5" style={{ color: tokens.bodyText }}>
              {step.title || `Bước ${idx + 1}`}
            </h4>
            <p className="text-xs leading-relaxed" style={{ color: tokens.mutedText }}>
              {step.description || 'Mô tả...'}
            </p>
          </div>
        ))}
      </div>

      {remainingCount > 0 && (
        <div className="text-center mt-4">
          <span className="text-xs" style={{ color: tokens.secondary }}>+{remainingCount} bước khác</span>
        </div>
      )}
    </div>
  );
};

const isImageUrl = (value: string) => /^https?:\/\//i.test(value) || value.startsWith('/');

const renderAlternating = ({
  tokens,
  steps,
  sectionTitle,
  context,
  previewDevice,
  headerConfig = {},
  desktopColumns: _desktopColumns = 4,
}: {
  tokens: ProcessColorTokens;
  steps: ProcessSharedStep[];
  sectionTitle: string;
  context: ProcessSectionContext;
  previewDevice: PreviewDevice;
  headerConfig?: HeaderConfig;
  desktopColumns?: 3 | 4;
}) => {
  if (steps.length === 0) {return renderEmptyState(tokens);}

  const maxVisible = getMaxVisible('alternating', context, previewDevice);
  const visibleSteps = steps.slice(0, maxVisible);
  const remainingCount = steps.length - visibleSteps.length;
  const isSite = context === 'site';
  const isMobile = previewDevice === 'mobile';
  const isTablet = previewDevice === 'tablet';
  const hasDistinctAccents = tokens.primary.toLowerCase() !== tokens.secondary.toLowerCase();
  const sectionBackground = tokens.cardStepBg;
  const sectionText = tokens.cardStepText;
  const cardBackground = hasDistinctAccents ? tokens.stepDotBg : tokens.neutralSurface;
  const cardText = hasDistinctAccents ? tokens.stepDotText : tokens.bodyText;
  const cardIconBackground = hasDistinctAccents ? tokens.neutralSurface : tokens.cardStepBg;
  const cardIconText = hasDistinctAccents ? tokens.stepDotBg : tokens.cardStepText;

  const outerPadding = isSite
    ? 'py-6 px-3 md:py-8 lg:py-10'
    : (isMobile ? 'py-5 px-3' : 'py-7 px-4');
  const trackClass = isSite
    ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'
    : cn('grid gap-4', isMobile ? 'grid-cols-1' : (isTablet ? 'grid-cols-2' : 'grid-cols-4'));
  const itemWidthClass = 'w-full min-w-0';
  const itemHeightClass = isMobile ? 'min-h-[250px]' : 'min-h-[320px]';

  const renderDarkHeader = () => {
    const {
      hideHeader = false,
      showTitle = true,
      showSubtitle = true,
      subtitle = '',
      headerAlign = 'center',
      subtitleAboveTitle = false,
      uppercaseText = false,
      showBadge = true,
      badgeText = '',
    } = headerConfig;

    if (hideHeader) {return null;}
    const resolvedTitle = typeof sectionTitle === 'string' ? sectionTitle.trim() : '';
    const resolvedSubtitle = typeof subtitle === 'string' ? subtitle.trim() : '';
    const resolvedBadge = typeof badgeText === 'string' ? badgeText.trim() : '';
    const hasTitle = showTitle && resolvedTitle.length > 0;
    const hasSubtitle = showSubtitle && resolvedSubtitle.length > 0;
    const hasBadge = showBadge && resolvedBadge.length > 0;

    if (!hasTitle && !hasSubtitle && !hasBadge) {return null;}

    const alignClass = headerAlign === 'center' ? 'text-center' : headerAlign === 'right' ? 'text-right' : 'text-left';
    const textTransform = uppercaseText ? 'uppercase' as const : undefined;
    const titleEl = hasTitle && (
      <h2 className={cn('font-bold tracking-tight', isMobile ? 'text-2xl' : 'text-3xl')} style={{ color: sectionText, textTransform }}>
        {resolvedTitle}
      </h2>
    );
    const subtitleEl = hasSubtitle && (
      <p className="text-sm leading-relaxed" style={{ color: sectionText, textTransform }}>
        {resolvedSubtitle}
      </p>
    );
    const badgeEl = hasBadge && (
      <div>
        <span
          className="inline-flex rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-wider"
          style={{
            backgroundColor: tokens.neutralSurface,
            borderColor: tokens.neutralBorder,
            color: tokens.secondary,
          }}
        >
          {resolvedBadge}
        </span>
      </div>
    );

    return (
      <div className={cn(alignClass, 'mx-auto mb-5 max-w-3xl space-y-1.5')}>
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
    );
  };

  return (
    <div className={cn('relative z-[1] overflow-hidden', outerPadding)} style={{ backgroundColor: sectionBackground }}>
      {renderDarkHeader()}

      <div className={trackClass}>
        {visibleSteps.map((step, idx) => {
          const inverted = idx % 2 === 1;
          const stepNum = step.icon && /^\d+$/.test(step.icon) ? step.icon : String(idx + 1);
          const iconIsImage = isImageUrl(step.icon);

          const rhythmSpacerEl = (
            <div aria-hidden="true" className={cn('shrink-0', isMobile ? 'h-5' : 'h-8')} />
          );

          const cardEl = (
            <div
              className={cn(
                'relative w-full min-w-0 text-center transition-all duration-300',
                inverted
                  ? (isMobile ? 'mb-6 pt-4 pb-14' : 'mb-8 pt-4 pb-14')
                  : (isMobile ? 'mt-6 pt-14 pb-4' : 'mt-8 pt-14 pb-4'),
                isMobile ? 'px-3' : 'px-4',
              )}
              style={{
                backgroundColor: cardBackground,
                borderRadius: '38px 6px',
              }}
            >
              <div
                className={cn(
                  'absolute left-1/2 flex h-[72px] w-[72px] -translate-x-1/2 items-center justify-center rounded-full',
                  inverted ? 'bottom-[-32px]' : 'top-[-32px]',
                )}
                style={{ backgroundColor: cardIconBackground }}
              >
                {iconIsImage ? (
                  <img
                    src={step.icon}
                    alt={step.title || `Bước ${idx + 1}`}
                    className="max-h-11 max-w-11 object-contain"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-2xl font-bold" style={{ color: cardIconText }}>
                    {step.icon || stepNum}
                  </span>
                )}
              </div>

              <h3 className="mb-2 overflow-hidden text-ellipsis whitespace-nowrap text-lg font-bold leading-6" style={{ color: cardText }}>
                {step.title || `Bước ${idx + 1}`}
              </h3>
              <p className="min-h-12 overflow-hidden break-words text-sm leading-5" style={{ color: cardText }}>
                {step.description || 'Mô tả bước này...'}
              </p>
            </div>
          );

          return (
            <div
              key={step.key}
              className={cn(
                'relative flex min-w-0 flex-col text-center',
                itemWidthClass,
                itemHeightClass,
                inverted ? 'justify-end' : 'justify-start',
              )}
            >
              {inverted ? (
                <>
                  {cardEl}
                  {rhythmSpacerEl}
                </>
              ) : (
                <>
                  {rhythmSpacerEl}
                  {cardEl}
                </>
              )}
            </div>
          );
        })}
      </div>

      {remainingCount > 0 && (
        <div className="mt-4 text-center">
          <span className="text-xs" style={{ color: sectionText }}>+{remainingCount} bước khác</span>
        </div>
      )}
    </div>
  );
};

type HeaderConfig = {
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
};

const renderSectionHeader = ({
  tokens,
  sectionTitle,
  previewDevice,
  headerConfig,
  showBadgeInline = false,
}: {
  tokens: ProcessColorTokens;
  sectionTitle: string;
  previewDevice: PreviewDevice;
  headerConfig: HeaderConfig;
  showBadgeInline?: boolean;
}) => {
  const {
    hideHeader = false,
    showTitle = true,
    showSubtitle = true,
    subtitle = '',
    headerAlign = 'center',
    titleColorPrimary = false,
    subtitleAboveTitle = false,
    uppercaseText = false,
    showBadge = true,
    badgeText = '',
  } = headerConfig;

  if (hideHeader) {return null;}
  if (!showTitle && !showSubtitle && !showBadge) {return null;}

  const resolvedTitle = typeof sectionTitle === 'string' ? sectionTitle.trim() : '';
  const resolvedSubtitle = typeof subtitle === 'string' ? subtitle.trim() : '';
  const resolvedBadge = typeof badgeText === 'string' ? badgeText.trim() : '';
  const hasTitle = showTitle && resolvedTitle.length > 0;
  const hasSubtitle = showSubtitle && resolvedSubtitle.length > 0;
  const hasBadge = showBadge && resolvedBadge.length > 0 && showBadgeInline;

  if (!hasTitle && !hasSubtitle && !hasBadge) {return null;}

  const textTransform = uppercaseText ? 'uppercase' as const : undefined;
  const alignClass = headerAlign === 'center' ? 'text-center' : headerAlign === 'right' ? 'text-right' : 'text-left';

  const titleEl = hasTitle && (
    <h2
      className={cn('font-bold tracking-tight', previewDevice === 'mobile' ? 'text-xl' : 'text-2xl')}
      style={{ color: titleColorPrimary ? tokens.primary : '#0f172a', textTransform }}
    >
      {resolvedTitle}
    </h2>
  );

  const subtitleEl = hasSubtitle && (
    <p className="text-sm leading-relaxed" style={{ color: tokens.mutedText, textTransform }}>
      {resolvedSubtitle}
    </p>
  );

  const badgeEl = hasBadge && (
    <div className={cn('mb-1', alignClass)}>
      <span className="inline-block px-3 py-1 text-[11px] font-medium tracking-wider uppercase bg-slate-100 text-slate-600 rounded-full border border-slate-200">
        {resolvedBadge}
      </span>
    </div>
  );

  return (
    <div className={cn(alignClass, 'mb-4')}>
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
    </div>
  );
};

const ProcessSectionContent = ({
  steps,
  sectionTitle,
  style,
  tokens,
  context,
  previewDevice,
  headerConfig,
  desktopColumns = 4,
}: {
  steps: ProcessSharedStep[];
  sectionTitle: string;
  style: ProcessStyle;
  tokens: ProcessColorTokens;
  context: ProcessSectionContext;
  previewDevice: PreviewDevice;
  headerConfig: HeaderConfig;
  desktopColumns?: 3 | 4;
}) => {
  if (style === 'horizontal') {
    return renderHorizontal({ context, previewDevice, sectionTitle, steps, tokens, headerConfig, desktopColumns });
  }

  if (style === 'stepper') {
    return renderStepper({ context, previewDevice, sectionTitle, steps, tokens, headerConfig, desktopColumns });
  }

  if (style === 'cards') {
    return renderCards({ context, previewDevice, sectionTitle, steps, tokens, headerConfig, desktopColumns });
  }

  if (style === 'accordion') {
    return renderAccordion({ context, previewDevice, sectionTitle, steps, tokens, headerConfig, desktopColumns });
  }

  if (style === 'minimal') {
    return renderMinimal({ context, previewDevice, sectionTitle, steps, tokens, headerConfig, desktopColumns });
  }

  if (style === 'alternating') {
    return renderAlternating({ context, previewDevice, sectionTitle, steps, tokens, headerConfig, desktopColumns });
  }

  return renderGrid({ context, previewDevice, sectionTitle, steps, tokens, headerConfig, desktopColumns });
};

export function ProcessSectionShared({
  steps,
  sectionTitle,
  style,
  brandColor,
  secondary,
  mode,
  context,
  previewDevice = 'desktop',
  setPreviewDevice,
  includePreviewWrapper = false,
  previewStyle,
  onPreviewStyleChange,
  hideHeader = false,
  showTitle = true,
  showSubtitle = true,
  subtitle = '',
  headerAlign = 'center',
  titleColorPrimary = false,
  subtitleAboveTitle = false,
  uppercaseText = false,
  showBadge = true,
  badgeText = '',
  fontStyle,
  fontClassName,
  desktopColumns = 4,
}: ProcessSectionSharedProps) {
  const tokens = React.useMemo(() => getProcessColors(brandColor, secondary, mode), [brandColor, secondary, mode]);
  const selectedStyle = previewStyle ?? style;
  const maxVisible = getMaxVisible(selectedStyle, context, previewDevice);
  const info = getSharedInfoText(selectedStyle, steps.length, Math.min(steps.length, maxVisible), mode);

  const headerConfig: HeaderConfig = { hideHeader, showTitle, showSubtitle, subtitle, headerAlign, titleColorPrimary, subtitleAboveTitle, uppercaseText, showBadge, badgeText };

  if (!includePreviewWrapper || context === 'site') {
    return (
      <ProcessSectionContent
        steps={steps}
        sectionTitle={sectionTitle}
        style={selectedStyle}
        tokens={tokens}
        context={context}
        previewDevice={previewDevice}
        headerConfig={headerConfig}
        desktopColumns={desktopColumns}
      />
    );
  }

  return (
    <>
      <PreviewWrapper
        title="Preview Process"
        device={previewDevice}
        setDevice={(nextDevice) => { setPreviewDevice?.(nextDevice); }}
        previewStyle={selectedStyle}
        setPreviewStyle={(next) => onPreviewStyleChange?.(next as ProcessStyle)}
        styles={PROCESS_STYLES}
        info={info}
        deviceWidthClass={deviceWidths[previewDevice]}
        fontStyle={fontStyle}
        fontClassName={fontClassName}
      >
        <BrowserFrame>
          <ProcessSectionContent
            steps={steps}
            sectionTitle={sectionTitle}
            style={selectedStyle}
            tokens={tokens}
            context="preview"
            previewDevice={previewDevice}
            headerConfig={headerConfig}
            desktopColumns={desktopColumns}
          />
        </BrowserFrame>
      </PreviewWrapper>
      {mode === 'dual' && (
        <ColorInfoPanel
          brandColor={tokens.primary}
          secondary={tokens.secondary}
          description="Màu phụ được áp dụng cho: progress, dot timeline, badge và border accent của Process."
        />
      )}
      {mode === 'single' && (
        <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400">Màu chính:</span>
            <div
              className="w-8 h-8 rounded border-2 border-slate-300 dark:border-slate-600 shadow-sm"
              style={{ backgroundColor: tokens.primary }}
              title={tokens.primary}
            />
            <span className="font-mono text-slate-600 dark:text-slate-400">{tokens.primary}</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Chế độ 1 màu: mọi accent secondary của Process tự động dùng lại màu chính.
          </p>
        </div>
      )}
    </>
  );
}
