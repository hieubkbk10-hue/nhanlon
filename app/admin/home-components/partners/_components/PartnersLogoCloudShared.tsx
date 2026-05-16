"use client";

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Image as ImageIcon } from 'lucide-react';
import { cn } from '@/app/admin/components/ui';

type PartnersLogoCloudItem = {
  id?: string | number;
  url: string;
  link?: string;
  name?: string;
};

const AUTOPLAY_INTERVAL_MS = 2600;

export const PartnersLogoCloudShared = ({
  items,
  brandColor = '#ECAA4D',
  openInNewTab = false,
  renderImage,
  className,
}: {
  items: PartnersLogoCloudItem[];
  brandColor?: string;
  openInNewTab?: boolean;
  renderImage?: (item: PartnersLogoCloudItem, className: string) => React.ReactNode;
  className?: string;
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
    loop: items.length > 5,
  });

  React.useEffect(() => {
    if (!emblaApi || items.length <= 5) { return; }

    const timer = window.setInterval(() => {
      emblaApi.scrollNext();
    }, AUTOPLAY_INTERVAL_MS);

    return () => { window.clearInterval(timer); };
  }, [emblaApi, items.length]);

  if (items.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-8 text-center', className)}>
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
          <ImageIcon size={28} className="text-slate-400" />
        </div>
        <h3 className="mb-1 font-medium text-slate-900">Chưa có đối tác nào</h3>
        <p className="text-sm text-slate-500">Thêm logo đối tác đầu tiên</p>
      </div>
    );
  }

  return (
    <div
      className={cn('relative w-full', className)}
      role="region"
      aria-roledescription="carousel"
      style={{
        '--partners-logo-cloud-accent': `${brandColor}66`,
        '--partners-logo-cloud-ring': brandColor,
      } as React.CSSProperties}
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="ml-0 flex px-4">
          {items.map((item, index) => {
            const key = item.id ?? item.link ?? item.url ?? index;
            const label = item.name || 'Hình ảnh';
            const content = (
              <>
                {item.url
                  ? renderImage?.(item, 'max-h-[80px] w-auto max-w-full object-contain transition-transform duration-300 hover:scale-105') ?? null
                  : <ImageIcon size={32} className="text-slate-300" />}
              </>
            );
            const innerClassName = 'flex h-full items-center justify-center rounded-xl border border-transparent p-2 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--partners-logo-cloud-accent)] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--partners-logo-cloud-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-white';

            return (
              <div
                key={key}
                role="group"
                aria-roledescription="slide"
                className="min-w-0 shrink-0 grow-0 basis-1/3 pl-4 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
              >
                {item.link ? (
                  <a
                    aria-label={label}
                    className={innerClassName}
                    href={item.link}
                    target={openInNewTab ? '_blank' : undefined}
                    rel={openInNewTab ? 'noopener noreferrer' : undefined}
                    draggable={false}
                  >
                    {content}
                  </a>
                ) : (
                  <div aria-label={label} className={innerClassName}>
                    {content}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
