'use client';

import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { cn } from '../../../components/ui';
import { getPartnersColors, type PartnersBrandMode } from '../_lib/colors';
import type { PartnersAlign, PartnersDisplayMode } from '../_types';
import { PartnersSectionHeader } from './PartnersSectionHeader';

type PartnersDividerItem = {
  id?: string | number;
  url?: string;
  link?: string;
  name?: string;
};

export const PartnersDividerShared = ({
  items,
  title,
  subheading,
  align = 'center',
  displayMode = 'withName',
  brandColor,
  secondary,
  mode = 'dual',
  renderImage,
  openInNewTab = false,
  skipHeader = false,
  columnsClassName,
  className,
}: {
  items: PartnersDividerItem[];
  title?: string;
  subheading?: React.ReactNode;
  align?: PartnersAlign;
  displayMode?: PartnersDisplayMode;
  brandColor: string;
  secondary: string;
  mode?: PartnersBrandMode;
  renderImage: (item: PartnersDividerItem, className: string) => React.ReactNode;
  openInNewTab?: boolean;
  skipHeader?: boolean;
  columnsClassName?: string;
  className?: string;
}) => {
  if (items.length === 0) {return null;}

  const colors = React.useMemo(() => getPartnersColors(brandColor, secondary, mode), [brandColor, secondary, mode]);
  const linkProps = openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  const showName = displayMode === 'withName';

  const resolvedColumnsClassName = columnsClassName ?? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6';

  return (
    <section className={cn('w-full bg-white', skipHeader ? 'pb-6 md:pb-10' : 'py-6 md:py-10', className)}>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        {!skipHeader && (
          <PartnersSectionHeader
            title={title}
            subheading={subheading}
            align={align}
            brandColor={brandColor}
            secondary={secondary}
            mode={mode}
          />
        )}
        {/* Grid with subtle divider borders — clean, minimal */}
        <div
          className={cn('mt-5 grid md:mt-8', resolvedColumnsClassName)}
          style={{ borderColor: colors.neutralBorder }}
        >
          {items.map((item, index) => (
            <a
              key={item.id ?? `${item.url ?? ''}-${index}`}
              href={item.link ?? '#'}
              className={cn(
                'group flex flex-col items-center justify-center border-b bg-white text-center transition-colors',
                showName ? 'gap-2 p-4 md:p-5' : 'p-4 md:p-6',
                // Right border for all except last in row
                'border-r',
              )}
              style={{ borderColor: colors.neutralBorder }}
              onMouseEnter={(event) => { event.currentTarget.style.backgroundColor = colors.neutralSubtle; }}
              onMouseLeave={(event) => { event.currentTarget.style.backgroundColor = ''; }}
              {...linkProps}
            >
              <div className={cn(
                'flex w-full items-center justify-center',
                showName ? 'h-10 md:h-12' : 'h-12 md:h-14',
              )}>
                {item.url
                  ? renderImage(item, 'mx-auto h-full w-auto max-w-full object-contain')
                  : <ImageIcon size={showName ? 28 : 40} className="text-slate-300" />}
              </div>
              {showName && (
                <span className="w-full truncate text-xs font-medium text-slate-500 md:text-sm">
                  {item.name ?? `Đối tác ${index + 1}`}
                </span>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
