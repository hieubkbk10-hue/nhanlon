'use client';

import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { cn } from '../../../components/ui';
import { getPartnersColors, type PartnersBrandMode } from '../_lib/colors';
import type { PartnersAlign, PartnersDisplayMode } from '../_types';
import { PartnersSectionHeader } from './PartnersSectionHeader';

type PartnersCleanItem = {
  id?: string | number;
  url?: string;
  link?: string;
  name?: string;
};

export const PartnersCleanShared = ({
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
  className,
}: {
  items: PartnersCleanItem[];
  title?: string;
  subheading?: React.ReactNode;
  align?: PartnersAlign;
  displayMode?: PartnersDisplayMode;
  brandColor: string;
  secondary: string;
  mode?: PartnersBrandMode;
  renderImage: (item: PartnersCleanItem, className: string) => React.ReactNode;
  openInNewTab?: boolean;
  skipHeader?: boolean;
  className?: string;
}) => {
  if (items.length === 0) {return null;}

  const _colors = React.useMemo(() => getPartnersColors(brandColor, secondary, mode), [brandColor, secondary, mode]);
  const linkProps = openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  const showName = displayMode === 'withName';

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
        {/* Inline flow: logos with optional names, wrap naturally */}
        <div className={cn(
          'mt-5 flex flex-wrap items-center justify-center md:mt-8',
          showName ? 'gap-x-8 gap-y-5 md:gap-x-12 md:gap-y-6' : 'gap-x-6 gap-y-4 md:gap-x-10 md:gap-y-6',
        )}>
          {items.map((item, index) => (
            <a
              key={item.id ?? `${item.url ?? ''}-${index}`}
              href={item.link ?? '#'}
              className={cn(
                'group flex items-center transition-opacity duration-200 hover:opacity-80',
                showName ? 'gap-2 md:gap-2.5' : 'justify-center',
              )}
              {...linkProps}
            >
              {item.url
                ? (
                  <div className={showName
                    ? 'flex h-7 w-7 items-center justify-center overflow-hidden md:h-8 md:w-8'
                    : 'flex h-9 w-[80px] items-center justify-center overflow-hidden md:h-10 md:w-[100px]'
                  }>
                    {renderImage(item, 'h-full w-full object-contain')}
                  </div>
                )
                : <ImageIcon size={showName ? 24 : 36} className="text-slate-400" />}
              {showName && (
                <span className="whitespace-nowrap text-sm font-medium text-slate-600 md:text-base">
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
