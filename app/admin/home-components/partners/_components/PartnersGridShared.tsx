"use client";

import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { cn } from '../../../components/ui';
import { getPartnersColors, type PartnersBrandMode } from '../_lib/colors';
import type { PartnersAlign, PartnersDisplayMode } from '../_types';
import { PartnersSectionHeader } from './PartnersSectionHeader';

export type PartnerGridItem = {
  id?: string | number;
  url?: string;
  link?: string;
  name?: string;
};

export const PartnersGridShared = ({
  items,
  title,
  subheading,
  align = 'center',
  displayMode = 'withName',
  brandColor,
  secondary,
  mode = 'dual',
  maxVisible = 20,
  columnsClassName,
  openInNewTab = false,
  renderImage,
  className,
  skipHeader = false,
}: {
  items: PartnerGridItem[];
  title?: string;
  subheading?: React.ReactNode;
  align?: PartnersAlign;
  displayMode?: PartnersDisplayMode;
  brandColor: string;
  secondary: string;
  mode?: PartnersBrandMode;
  maxVisible?: number;
  columnsClassName?: string;
  openInNewTab?: boolean;
  renderImage: (item: PartnerGridItem, className: string) => React.ReactNode;
  className?: string;
  skipHeader?: boolean;
}) => {
  if (items.length === 0) {return null;}

  const visibleItems = items.slice(0, maxVisible);
  const visibleCount = visibleItems.length;
  const colors = React.useMemo(() => getPartnersColors(brandColor, secondary, mode), [brandColor, secondary, mode]);
  const linkProps = openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  const showName = displayMode === 'withName';

  // Smart responsive columns based on item count
  const autoColumnsClassName = visibleCount === 1
    ? 'grid-cols-1'
    : visibleCount === 2
      ? 'grid-cols-2'
      : visibleCount === 3
        ? 'grid-cols-2 sm:grid-cols-3'
        : visibleCount <= 4
          ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
          : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6';

  const resolvedColumnsClassName = columnsClassName ?? autoColumnsClassName;

  // Constrain width for small item counts
  const gridWrapperClassName = visibleCount === 1
    ? 'mx-auto max-w-[220px]'
    : visibleCount === 2
      ? 'mx-auto w-full max-w-[440px]'
      : visibleCount === 3
        ? 'mx-auto w-full max-w-[640px]'
        : 'w-full';

  return (
    <section className={cn('w-full bg-white', skipHeader ? 'pb-8 md:pb-12' : 'py-8 md:py-12', className)}>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
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
        <div className={cn('mt-5 md:mt-8', gridWrapperClassName)}>
          <div className={cn('grid gap-3 md:gap-4', resolvedColumnsClassName)}>
            {visibleItems.map((item, idx) => (
              <a
                key={item.id ?? `${item.url ?? ''}-${idx}`}
                href={item.link ?? '#'}
                className={cn(
                  'group relative flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border bg-white transition-all duration-200',
                  'hover:shadow-md hover:-translate-y-0.5',
                  showName ? 'gap-2.5 p-4 md:p-5' : 'p-4 md:p-6',
                )}
                style={{ borderColor: colors.itemBorder }}
                onMouseEnter={(event) => { event.currentTarget.style.borderColor = colors.primary; }}
                onMouseLeave={(event) => { event.currentTarget.style.borderColor = colors.itemBorder; }}
                {...linkProps}
              >
                {/* Logo — full color, respect ratio */}
                <div className={cn(
                  'flex w-full items-center justify-center',
                  showName ? 'h-12 md:h-14' : 'h-14 md:h-16',
                )}>
                  {item.url ? (
                    renderImage(item, 'mx-auto h-full w-auto max-w-full object-contain')
                  ) : (
                    <ImageIcon size={showName ? 32 : 40} className="text-slate-300" />
                  )}
                </div>

                {/* Partner name */}
                {showName && (
                  <span className="w-full truncate text-center text-xs font-medium text-slate-500 md:text-sm">
                    {item.name ?? `Đối tác ${idx + 1}`}
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
