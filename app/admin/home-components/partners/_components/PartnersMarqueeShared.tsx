"use client";

import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { cn } from '../../../components/ui';
import { getPartnersColors, type PartnersBrandMode } from '../_lib/colors';
import type { PartnersAlign, PartnersDisplayMode } from '../_types';

export type PartnerMarqueeItem = {
  id?: string | number;
  url?: string;
  link?: string;
  name?: string;
};

const normalizeItems = (items: PartnerMarqueeItem[]) => {
  const seen = new Set<string>();
  return items
    .filter(item => item.url)
    .filter((item) => {
      const key = `${item.url ?? ''}::${item.link ?? ''}`;
      if (seen.has(key)) {return false;}
      seen.add(key);
      return true;
    });
};

export const PartnersMarqueeShared = ({
  items,
  title,
  subheading,
  align: _align = 'center',
  displayMode = 'withName',
  brandColor,
  secondary,
  mode = 'dual',
  speed: _speed = 0.8,
  renderImage,
  openInNewTab = false,
  skipHeader = false,
  className,
}: {
  items: PartnerMarqueeItem[];
  title?: string;
  subheading?: React.ReactNode;
  align?: PartnersAlign;
  displayMode?: PartnersDisplayMode;
  brandColor: string;
  secondary: string;
  mode?: PartnersBrandMode;
  speed?: number;
  renderImage: (item: PartnerMarqueeItem, className: string) => React.ReactNode;
  openInNewTab?: boolean;
  skipHeader?: boolean;
  className?: string;
}) => {
  const normalizedItems = React.useMemo(() => normalizeItems(items), [items]);
  const _colors = React.useMemo(() => getPartnersColors(brandColor, secondary, mode), [brandColor, secondary, mode]);

  if (normalizedItems.length === 0) {return null;}

  const showName = displayMode === 'withName';
  const linkProps = openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  // Logo grid — flexbox wrap + center for balanced last row
  const logoGrid = (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-4 md:gap-x-6 md:gap-y-5">
      {normalizedItems.map((item, index) => {
        const keyBase = item.id ?? item.url ?? item.name ?? index;
        return (
          <a
            key={keyBase}
            href={item.link ?? '#'}
            className="group flex w-[100px] flex-col items-center gap-1.5 transition-opacity duration-200 hover:opacity-80 md:w-[120px]"
            {...linkProps}
          >
            {/* Logo — direct, no circle wrapper */}
            <div className="flex h-14 w-full items-center justify-center md:h-16">
              {item.url
                ? renderImage(item, 'h-full w-auto max-w-full object-contain')
                : <ImageIcon size={28} className="text-slate-300" />}
            </div>
            {/* Partner name */}
            {showName && (
              <span className="w-full truncate text-center text-[11px] font-medium text-slate-500 md:text-xs">
                {item.name ?? `Đối tác ${index + 1}`}
              </span>
            )}
          </a>
        );
      })}
    </div>
  );

  // Skip header: chỉ render grid (parent sẽ handle header)
  if (skipHeader) {
    return (
      <section className={cn('w-full py-8 md:py-12', className)} style={{ backgroundColor: '#f7f3ee' }}>
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          {logoGrid}
        </div>
      </section>
    );
  }

  // Full layout: 2 cột — trái header, phải logo grid
  return (
    <section className={cn('w-full py-10 md:py-14', className)} style={{ backgroundColor: '#f7f3ee' }}>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12 xl:gap-16">
          {/* Cột trái: Header text */}
          <div className="flex-shrink-0 lg:w-[320px] xl:w-[360px]">
            <div className="flex flex-col items-start text-left">
              {/* Badge — short label */}
              <span
                className="mb-4 inline-block rounded-sm border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-600 md:text-[11px]"
                style={{ borderColor: '#d1ccc6' }}
              >
                Đối tác chúng tôi
              </span>
              {/* Title — italic style */}
              <h2
                className="text-xl font-bold leading-snug tracking-tight md:text-2xl xl:text-[1.65rem]"
                style={{ color: '#1a1a2e', fontStyle: 'italic' }}
              >
                {title || 'Tự Hào Là Đối Tác Tin Cậy'}
              </h2>
              {/* Description — subheading */}
              {subheading && (
                <p className="mt-3 text-sm leading-relaxed text-slate-500 md:text-[13px] md:leading-relaxed">
                  {subheading}
                </p>
              )}
            </div>
          </div>

          {/* Cột phải: Logo grid */}
          <div className="flex-1 min-w-0">
            {logoGrid}
          </div>
        </div>
      </div>
    </section>
  );
};
