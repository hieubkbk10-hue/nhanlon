"use client";

import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { cn } from '../../../components/ui';
import { getPartnersColors, type PartnersBrandMode } from '../_lib/colors';
import type { PartnersAlign, PartnersDisplayMode } from '../_types';
import { PartnersSectionHeader } from './PartnersSectionHeader';

export type PartnerBadgeItem = {
  id?: string | number;
  url?: string;
  link?: string;
  name?: string;
};



export const PartnersBadgeShared = ({
  items,
  brandColor,
  secondary,
  mode = 'dual',
  title,
  subheading,
  align = 'center',
  displayMode = 'withName',
  maxVisible = 20,
  renderImage,
  openInNewTab = false,
  skipHeader = false,
  className,

}: {
  items: PartnerBadgeItem[];
  brandColor: string;
  secondary: string;
  mode?: PartnersBrandMode;
  title?: string;
  subheading?: React.ReactNode;
  align?: PartnersAlign;
  displayMode?: PartnersDisplayMode;
  maxVisible?: number;
  renderImage: (item: PartnerBadgeItem, className: string) => React.ReactNode;
  openInNewTab?: boolean;
  skipHeader?: boolean;
  variant?: 'preview' | 'site';
  className?: string;
}) => {
  if (items.length === 0) {return null;}

  const visibleItems = items.slice(0, maxVisible);
  const colors = React.useMemo(() => getPartnersColors(brandColor, secondary, mode), [brandColor, secondary, mode]);
  const shouldAnimate = visibleItems.length > 1;
  const loopCount = shouldAnimate ? 2 : 1;
  const duration = Math.max(12, visibleItems.length * 3);
  const [isPaused, setIsPaused] = React.useState(false);
  const linkProps = openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  const showName = displayMode === 'withName';

  return (
    <section className={cn('w-full bg-white overflow-hidden', skipHeader ? 'pb-6 md:pb-10' : 'py-6 md:py-10', className)}>
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
        {!skipHeader && (
          <PartnersSectionHeader
            title={title ?? 'Đối tác'}
            subheading={subheading}
            align={align}
            brandColor={brandColor}
            secondary={secondary}
            mode={mode}
          />
        )}
      </div>
      {/* Auto-scroll track */}
      <div
        className="relative mt-5 overflow-hidden md:mt-8 [mask-image:_linear-gradient(to_right,transparent_0,_black_32px,_black_calc(100%-32px),transparent_100%)] md:[mask-image:_linear-gradient(to_right,transparent_0,_black_64px,_black_calc(100%-64px),transparent_100%)]"
        onMouseEnter={() => { setIsPaused(true); }}
        onMouseLeave={() => { setIsPaused(false); }}
        onTouchStart={() => { setIsPaused(true); }}
        onTouchEnd={() => { setIsPaused(false); }}
      >
        <style>{`@keyframes badge-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } } .badge-no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
        <div
          className="flex min-w-max items-center"
          style={shouldAnimate ? { animation: `badge-scroll ${duration}s linear infinite`, animationPlayState: isPaused ? 'paused' : 'running' } : undefined}
        >
          {Array.from({ length: loopCount }).map((_, loopIdx) => (
            <div key={`loop-${loopIdx}`} className="flex shrink-0 items-center gap-3 px-1.5 md:gap-4 md:px-2">
              {visibleItems.map((item, idx) => (
                <a
                  key={`${loopIdx}-${item.id ?? idx}`}
                  href={item.link || '#'}
                  className={cn(
                    'group flex shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-white transition-all duration-200 hover:shadow-md select-none',
                    showName
                      ? 'w-[150px] flex-col gap-2 p-4 md:w-[170px] md:p-5'
                      : 'w-[120px] p-4 md:w-[140px] md:p-5',
                  )}
                  onMouseEnter={(event) => { event.currentTarget.style.borderColor = colors.primary; }}
                  onMouseLeave={(event) => { event.currentTarget.style.borderColor = ''; }}
                  {...linkProps}
                >
                  <div className={cn(
                    'flex w-full items-center justify-center',
                    showName ? 'h-10 md:h-12' : 'h-12 md:h-14',
                  )}>
                    {item.url
                      ? renderImage(item, 'h-full w-auto max-w-full object-contain')
                      : <ImageIcon size={showName ? 24 : 36} className="text-slate-300" />}
                  </div>
                  {showName && (
                    <span className="w-full truncate text-center text-xs font-medium text-slate-500 md:text-sm">
                      {item.name ?? `Đối tác ${idx + 1}`}
                    </span>
                  )}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
