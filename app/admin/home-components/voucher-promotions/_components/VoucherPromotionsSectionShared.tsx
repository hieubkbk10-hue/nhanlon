'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, ChevronLeft, ChevronRight, icons, Tag } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { BrowserFrame } from '../../_shared/components/BrowserFrame';
import { PreviewImage } from '../../_shared/components/PreviewImage';
import { SectionHeader } from '../../_shared/components/SectionHeader';
import type { PreviewDevice } from '../../_shared/hooks/usePreviewDevice';
import type { VoucherPromotionItem, VoucherPromotionsCtaVariant, VoucherPromotionsDesktopColumns, VoucherPromotionsStyle } from '../_types';
import type { VoucherPromotionsColorTokens } from '../_lib/colors';
import { formatVoucherExpiry } from '@/lib/home-components/voucher-promotions';

interface VoucherPromotionsSectionSharedProps {
  context: 'preview' | 'site';
  style: VoucherPromotionsStyle;
  heading: string;
  description: string;
  ctaLabel?: string;
  ctaUrl?: string;
  showCta?: boolean;
  ctaVariant?: VoucherPromotionsCtaVariant;
  vouchers: VoucherPromotionItem[];
  tokens: VoucherPromotionsColorTokens;
  copiedCode?: string | null;
  onCopy?: (code: string) => void;
  currentIndex?: number;
  onCurrentIndexChange?: (index: number) => void;
  device?: PreviewDevice;
  hideHeader?: boolean;
  showTitleHeader?: boolean;
  showSubtitleHeader?: boolean;
  showBadge?: boolean;
  badgeText?: string;
  headerAlign?: 'left' | 'center' | 'right';
  titleColorPrimary?: boolean;
  subtitleAboveTitle?: boolean;
  uppercaseText?: boolean;
  brandColor?: string;
  desktopColumns?: VoucherPromotionsDesktopColumns;
  iconName?: string;
}

const formatDiscount = (voucher: VoucherPromotionItem) => {
  if (voucher.discountType === 'percent' && voucher.discountValue) {
    return `Giảm ${voucher.discountValue}%`;
  }
  if (voucher.discountType === 'fixed' && voucher.discountValue) {
    return `Giảm ${voucher.discountValue.toLocaleString('vi-VN')}đ`;
  }
  if (voucher.discountType === 'free_shipping') {
    return 'Miễn phí vận chuyển';
  }
  return 'Ưu đãi đặc biệt';
};


const Header = ({
  heading,
  description,
  ctaLabel,
  ctaUrl,
  align,
  tokens,
  hideHeader,
  showTitleHeader,
  showSubtitleHeader,
  showBadge,
  badgeText,
  headerAlign,
  titleColorPrimary,
  subtitleAboveTitle,
  uppercaseText,
  brandColor,
}: {
  heading: string;
  description: string;
  ctaLabel?: string;
  ctaUrl?: string;
  align: 'left' | 'center';
  tokens: VoucherPromotionsColorTokens;
  hideHeader?: boolean;
  showTitleHeader?: boolean;
  showSubtitleHeader?: boolean;
  showBadge?: boolean;
  badgeText?: string;
  headerAlign?: 'left' | 'center' | 'right';
  titleColorPrimary?: boolean;
  subtitleAboveTitle?: boolean;
  uppercaseText?: boolean;
  brandColor?: string;
}) => (
  <div className={`space-y-2 ${align === 'center' ? 'text-center' : 'text-left'}`}>
    <SectionHeader
      title={heading}
      subtitle={description}
      badgeText={badgeText}
      hideHeader={hideHeader}
      showTitle={showTitleHeader}
      showSubtitle={showSubtitleHeader}
      showBadge={showBadge}
      headerAlign={headerAlign ?? align}
      titleColorPrimary={titleColorPrimary}
      subtitleAboveTitle={subtitleAboveTitle}
      uppercaseText={uppercaseText}
      brandColor={brandColor ?? tokens.heading}
      className="mb-0"
    />
    {ctaLabel && ctaUrl && (
      <a
        href={ctaUrl}
        className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm md:text-base font-semibold border transition-colors"
        style={{
          color: tokens.ctaOutlineText,
          borderColor: tokens.ctaOutlineBorder,
          backgroundColor: tokens.ctaOutlineBg,
        }}
      >
        {ctaLabel}
        <ArrowRight size={16} />
      </a>
    )}
  </div>
);


const getTicketFace = (voucher: VoucherPromotionItem) => {
  if (voucher.discountType === 'free_shipping') {
    return { label: 'Freeship', value: '' };
  }
  if (voucher.discountType === 'gift') {
    return { label: 'Quà tặng', value: '' };
  }
  if (voucher.discountType === 'percent' && voucher.discountValue) {
    return { label: 'Giảm', value: `${voucher.discountValue}%` };
  }
  if (voucher.discountType === 'fixed' && voucher.discountValue) {
    const value = voucher.discountValue >= 1000
      ? `${Math.round(voucher.discountValue / 1000)}K`
      : `${voucher.discountValue.toLocaleString('vi-VN')}đ`;
    return { label: 'Giảm', value };
  }
  return { label: 'Ưu đãi', value: '' };
};

const getVoucherIconComponent = (iconName?: string) => {
  const iconMap = icons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>>;
  return iconMap[iconName || 'BadgePercent'] ?? icons.BadgePercent;
};

export function VoucherPromotionsSectionShared({
  context,
  style,
  heading,
  description,
  ctaLabel,
  ctaUrl,
  showCta = true,
  ctaVariant = 'button',
  vouchers,
  tokens,
  copiedCode,
  onCopy,
  currentIndex = 0,
  onCurrentIndexChange,
  device,
  hideHeader,
  showTitleHeader,
  showSubtitleHeader,
  showBadge,
  badgeText,
  headerAlign,
  titleColorPrimary,
  subtitleAboveTitle,
  uppercaseText,
  brandColor,
  desktopColumns = 4,
  iconName = 'BadgePercent',
}: VoucherPromotionsSectionSharedProps) {
  const [selectedVoucher, setSelectedVoucher] = React.useState<VoucherPromotionItem | null>(null);

  const normalizedIndex = vouchers.length > 0 ? ((currentIndex % vouchers.length) + vouchers.length) % vouchers.length : 0;
  const enterpriseGridClass = (() => {
    if (device === 'mobile') {
      return desktopColumns === 3 ? 'grid-cols-1' : 'grid-cols-2';
    }
    if (device === 'tablet') {
      return desktopColumns === 3 ? 'grid-cols-3' : 'grid-cols-2';
    }
    return desktopColumns === 3
      ? 'grid-cols-1 md:grid-cols-3'
      : 'grid-cols-2 lg:grid-cols-4';
  })();
  const enterpriseCompact = device === 'mobile' && desktopColumns === 4;
  const carouselSlideClass = (() => {
    if (device === 'mobile') {
      return desktopColumns === 3 ? 'basis-full' : 'basis-1/2';
    }
    if (device === 'tablet') {
      return desktopColumns === 3 ? 'basis-1/3' : 'basis-1/2';
    }
    return desktopColumns === 3
      ? 'basis-full md:basis-1/3'
      : 'basis-1/2 lg:basis-1/4';
  })();
  const visibleCarouselItems = device === 'mobile'
    ? (desktopColumns === 3 ? 1 : 2)
    : device === 'tablet'
      ? (desktopColumns === 3 ? 3 : 2)
      : desktopColumns;
  const shouldShowCarouselControls = vouchers.length > visibleCarouselItems;
  const VoucherIcon = getVoucherIconComponent(iconName);
  const [carouselRef, carouselApi] = useEmblaCarousel({
    align: 'center',
    containScroll: 'trimSnaps',
    dragFree: false,
    duration: 26,
    watchDrag: shouldShowCarouselControls,
  });
  const [canCarouselPrev, setCanCarouselPrev] = React.useState(false);
  const [canCarouselNext, setCanCarouselNext] = React.useState(false);

  const updateCarouselState = React.useCallback(() => {
    if (!carouselApi) {return;}
    setCanCarouselPrev(carouselApi.canScrollPrev());
    setCanCarouselNext(carouselApi.canScrollNext());
    onCurrentIndexChange?.(carouselApi.selectedScrollSnap());
  }, [carouselApi, onCurrentIndexChange]);

  React.useEffect(() => {
    if (!carouselApi) {return;}
    updateCarouselState();
    carouselApi.on('select', updateCarouselState);
    carouselApi.on('reInit', updateCarouselState);

    return () => {
      carouselApi.off('select', updateCarouselState);
      carouselApi.off('reInit', updateCarouselState);
    };
  }, [carouselApi, updateCarouselState]);

  if (vouchers.length === 0) {
    return null;
  }

  const nextIndex = (index: number) => {
    if (!onCurrentIndexChange) {return;}
    onCurrentIndexChange(((index % vouchers.length) + vouchers.length) % vouchers.length);
  };

  const renderHeader = (align: 'left' | 'center', showCtaInHeader = true) => {
    const canShowCta = Boolean(showCta && showCtaInHeader && ctaLabel && ctaUrl);
    const hasVisibleHeaderContent = Boolean(
      !hideHeader
      && ((showTitleHeader !== false && heading)
        || (showSubtitleHeader !== false && description)
        || (showBadge && badgeText)),
    );

    if (!hasVisibleHeaderContent && !canShowCta) {
      return null;
    }

    return (
      <Header
        heading={heading}
        description={description}
        ctaLabel={canShowCta ? ctaLabel : undefined}
        ctaUrl={canShowCta ? ctaUrl : undefined}
        align={align}
        tokens={tokens}
        hideHeader={!hasVisibleHeaderContent}
        showTitleHeader={showTitleHeader}
        showSubtitleHeader={showSubtitleHeader}
        showBadge={showBadge}
        badgeText={badgeText}
        headerAlign={headerAlign}
        titleColorPrimary={titleColorPrimary}
        subtitleAboveTitle={subtitleAboveTitle}
        uppercaseText={uppercaseText}
        brandColor={brandColor}
      />
    );
  };

  const renderTopRightCta = () => {
    if (!showCta || !ctaLabel || !ctaUrl || ctaVariant !== 'textRight') {return null;}

    return (
      <div className="flex justify-end">
        <a
          href={ctaUrl}
          className="inline-flex items-center gap-1.5 text-xs font-semibold transition-opacity hover:opacity-80"
          style={{ color: tokens.ctaOutlineText }}
        >
          {ctaLabel}
          <ArrowRight size={13} />
        </a>
      </div>
    );
  };

  const renderBottomCta = () => {
    if (!showCta || !ctaLabel || !ctaUrl) {return null;}
    if (ctaVariant === 'textRight') {return null;}

    return (
      <div className="flex justify-center">
        <a
          href={ctaUrl}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-colors"
          style={{
            backgroundColor: tokens.ctaOutlineBg,
            borderColor: tokens.ctaOutlineBorder,
            color: tokens.ctaOutlineText,
          }}
        >
          {ctaLabel}
          <ArrowRight size={16} />
        </a>
      </div>
    );
  };

  const renderVoucherInfoPopup = () => {
    if (!selectedVoucher) {return null;}
    if (typeof document === 'undefined') {return null;}

    const conditions = [
      selectedVoucher.description,
      selectedVoucher.minOrderAmount ? `Áp dụng cho đơn hàng từ ${selectedVoucher.minOrderAmount.toLocaleString('vi-VN')}đ` : null,
      selectedVoucher.maxDiscountAmount ? `Giảm tối đa ${selectedVoucher.maxDiscountAmount.toLocaleString('vi-VN')}đ` : null,
    ].filter(Boolean);

    return createPortal(
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4 py-6"
        onClick={() => setSelectedVoucher(null)}
      >
        <div
          className="w-full max-w-sm overflow-hidden rounded-md bg-white shadow-2xl ring-1 ring-black/10"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between px-4 py-2.5 text-sm font-medium text-white" style={{ backgroundColor: tokens.primary }}>
            <span>Thông tin voucher</span>
            <button
              type="button"
              className="flex h-6 w-6 items-center justify-center rounded text-white/90 hover:bg-white/10 hover:text-white"
              onClick={() => setSelectedVoucher(null)}
              aria-label="Đóng thông tin voucher"
            >
              ×
            </button>
          </div>
          <div className="divide-y divide-slate-100 text-sm">
            <div className="grid grid-cols-[96px,1fr] gap-3 px-4 py-3">
              <div className="text-slate-600">Mã giảm giá:</div>
              <div className="font-medium text-slate-900">{selectedVoucher.code}</div>
            </div>
            <div className="grid grid-cols-[96px,1fr] gap-3 px-4 py-3">
              <div className="text-slate-600">Ngày hết hạn:</div>
              <div className="text-slate-900">{selectedVoucher.endDate ? formatVoucherExpiry(selectedVoucher.endDate) : 'Không giới hạn'}</div>
            </div>
            <div className="grid grid-cols-[96px,1fr] gap-3 px-4 py-3">
              <div className="text-slate-600">Điều kiện:</div>
              <div className="space-y-1 text-slate-900">
                {conditions.length > 0 ? conditions.map((condition, index) => (
                  <p key={index} className={index > 0 ? 'font-semibold' : undefined}>{condition}</p>
                )) : <p>Áp dụng theo điều kiện chương trình.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>,
      document.body,
    );
  };

  const wrapper = (content: React.ReactNode) => {
    if (context === 'preview') {
      return <BrowserFrame>{content}</BrowserFrame>;
    }
    return content;
  };

  if (style === 'ticketHorizontal') {
    return wrapper(
      <section className="px-4 py-6 md:py-8" style={{ backgroundColor: tokens.sectionBg }}>
        <div className="mx-auto max-w-6xl space-y-5">
          {renderHeader('center', false)}
          {renderTopRightCta()}
          <div className={`grid gap-4 ${enterpriseGridClass}`}>
            {vouchers.map((voucher) => {
              const ticketFace = getTicketFace(voucher);

              return (
                <div
                  key={voucher.code}
                  className="relative flex overflow-hidden rounded-lg border bg-white shadow-[0_2px_8px_rgba(15,23,42,0.06)]"
                  style={{ borderColor: `${tokens.primary}30` }}
                >
                  {/* Left: branded square block */}
                  <div className="relative flex w-[86px] shrink-0 items-center justify-center px-1.5 py-3">
                    <div className="flex h-[66px] w-[66px] flex-col items-center justify-center rounded-lg text-center text-white" style={{ backgroundColor: tokens.primary }}>
                      {voucher.thumbnail ? (
                        <PreviewImage
                          src={voucher.thumbnail}
                          alt={voucher.name}
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded object-contain"
                        />
                      ) : (
                        <>
                          {ticketFace.value ? (
                            <>
                              <div className="text-[9px] font-medium leading-tight text-white/80">{ticketFace.label}</div>
                              <div className="text-[18px] font-extrabold leading-none">{ticketFace.value}</div>
                            </>
                          ) : (
                            <>
                              <VoucherIcon size={24} className="text-white" />
                              <div className="mt-0.5 text-[9px] font-semibold leading-tight text-white/90">{ticketFace.label}</div>
                            </>
                          )}
                        </>
                      )}
                    </div>

                    {/* Dashed separator */}
                    <div className="absolute right-0 top-[14px] bottom-[14px] border-r border-dashed" style={{ borderColor: `${tokens.primary}25` }} />
                    {/* Top notch */}
                    <div className="absolute -top-[7px] right-[-7px] z-10 h-3.5 w-3.5 rounded-full" style={{ backgroundColor: tokens.sectionBg }} />
                    {/* Bottom notch */}
                    <div className="absolute -bottom-[7px] right-[-7px] z-10 h-3.5 w-3.5 rounded-full" style={{ backgroundColor: tokens.sectionBg }} />
                  </div>

                  {/* Right: content */}
                  <div className="relative flex min-w-0 flex-1 flex-col justify-center py-2 pl-3 pr-2.5">
                    {/* Info button */}
                    <button
                      type="button"
                      className="absolute right-2 top-1.5 flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-semibold leading-none"
                      style={{ borderColor: tokens.primary, color: tokens.primary }}
                      onClick={() => setSelectedVoucher(voucher)}
                      aria-label={`Thông tin voucher ${voucher.code}`}
                    >
                      i
                    </button>

                    {/* Title & description */}
                    <div className="pr-6">
                      <div className="break-words text-[12px] font-bold uppercase leading-tight tracking-wide" style={{ color: tokens.bodyText }}>
                        {voucher.name || formatDiscount(voucher)}
                      </div>
                      <div className="mt-0.5 break-words text-[10px] leading-snug" style={{ color: tokens.mutedText }}>
                        {voucher.description || formatDiscount(voucher)}
                      </div>
                    </div>

                    {/* Code + Copy */}
                    <div className="mt-1.5 flex items-end justify-between gap-1.5">
                      <div className="min-w-0 shrink-0 leading-tight">
                        <div className="text-[9px] font-medium" style={{ color: tokens.mutedText }}>Nhập mã</div>
                        <div className="text-[12px] font-bold uppercase" style={{ color: tokens.primary }}>
                          {voucher.code}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onCopy?.(voucher.code)}
                        className="shrink-0 rounded px-2 py-1 text-[10px] font-semibold text-white transition-opacity hover:opacity-90"
                        style={{ backgroundColor: tokens.primary }}
                      >
                        {copiedCode === voucher.code ? 'Đã copy' : 'Sao chép'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {renderBottomCta()}
          {renderVoucherInfoPopup()}
        </div>
      </section>
    );
  }

  if (style === 'couponGrid') {
    return wrapper(
      <section className="px-4 py-6 md:py-8" style={{ backgroundColor: tokens.sectionBg }}>
        <div className="mx-auto max-w-6xl space-y-5">
          {renderHeader('center', false)}
          {renderTopRightCta()}
          <div className={`grid gap-4 ${enterpriseGridClass}`}>
            {vouchers.map((voucher) => (
              <div
                key={voucher.code}
                className="relative overflow-hidden rounded-lg border bg-white shadow-[0_2px_8px_rgba(15,23,42,0.06)]"
                style={{ borderColor: tokens.cardBorder }}
              >
                {/* Accent top line */}
                <div className="h-1" style={{ backgroundColor: tokens.accentLine }} />
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="text-[9px] uppercase tracking-wider font-medium" style={{ color: tokens.badgeText }}>Voucher</div>
                      <div className="mt-0.5 break-words text-[13px] font-extrabold uppercase leading-tight tracking-wide" style={{ color: tokens.bodyText }}>
                        {voucher.code}
                      </div>
                      <div className="mt-0.5 break-words text-[11px] font-medium leading-snug" style={{ color: tokens.bodyText }}>
                        {voucher.name}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold leading-none"
                      style={{ borderColor: tokens.primary, color: tokens.primary }}
                      onClick={() => setSelectedVoucher(voucher)}
                      aria-label={`Thông tin voucher ${voucher.code}`}
                    >
                      i
                    </button>
                  </div>
                  {voucher.description && (
                    <p className="mt-1.5 break-words text-[10px] leading-snug" style={{ color: tokens.mutedText }}>
                      {voucher.description}
                    </p>
                  )}
                  <div className="mt-2 flex items-end justify-between gap-2">
                    <span className="text-[9px] leading-tight" style={{ color: tokens.mutedText }}>
                      {voucher.endDate ? `HSD: ${formatVoucherExpiry(voucher.endDate)}` : formatDiscount(voucher)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onCopy?.(voucher.code)}
                      className="shrink-0 rounded px-2.5 py-1 text-[10px] font-bold text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: tokens.primary }}
                    >
                      {copiedCode === voucher.code ? 'Đã copy' : 'Copy mã'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {renderBottomCta()}
          {renderVoucherInfoPopup()}
        </div>
      </section>
    );
  }

  if (style === 'stackedBanner') {
    return wrapper(
      <section className="px-4 py-6 md:py-8" style={{ backgroundColor: tokens.sectionBg }}>
        <div className="mx-auto max-w-6xl space-y-5">
          {renderHeader('center', false)}
          {renderTopRightCta()}
          <div className={`grid gap-4 ${enterpriseGridClass}`}>
            {vouchers.map((voucher) => (
              <div
                key={voucher.code}
                className="overflow-hidden rounded-lg border bg-white shadow-[0_2px_8px_rgba(15,23,42,0.06)]"
                style={{ borderColor: tokens.primary }}
              >
                <div className="flex flex-col">
                  <div
                    className="px-2 py-1.5 text-center text-[13px] font-extrabold uppercase leading-tight tracking-wide"
                    style={{ color: tokens.secondary }}
                  >
                    {voucher.code}
                  </div>
                  <div className="grid grid-cols-2" style={{ backgroundColor: tokens.primary }}>
                    <div className="flex min-h-10 items-center px-2.5 py-2 text-[12px] font-extrabold leading-tight text-white">
                      {formatDiscount(voucher)}
                    </div>
                    <div className="min-h-10 border-l border-dashed border-white/80 px-2.5 py-2 text-[10px] font-medium leading-tight text-white">
                      {voucher.description || voucher.name}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2 px-2.5 py-2">
                    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
                      {voucher.thumbnail ? (
                        <PreviewImage
                          src={voucher.thumbnail}
                          alt={voucher.name}
                          width={40}
                          height={40}
                          className="h-10 w-10 object-contain"
                        />
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded text-white" style={{ backgroundColor: tokens.primary }}>
                          <Tag size={18} />
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => onCopy?.(voucher.code)}
                      className="min-w-[84px] shrink-0 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: tokens.secondary }}
                    >
                      {copiedCode === voucher.code ? 'Đã copy' : 'Sao chép'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {renderBottomCta()}
        </div>
      </section>
    );
  }

  if (style === 'carousel') {
    return wrapper(
      <section className="px-4 py-6 md:py-8" style={{ backgroundColor: tokens.sectionBg }}>
        <div className="mx-auto max-w-6xl space-y-5">
          {renderHeader('center', false)}
          {renderTopRightCta()}
          <div className="relative">
            <div ref={carouselRef} className="overflow-hidden">
              <div className="-ml-4 flex">
                {vouchers.map((voucher) => {
                  const isExpired = voucher.endDate ? new Date(voucher.endDate).getTime() < Date.now() : false;

                  return (
                    <div
                      key={voucher.code}
                      className={`min-w-0 shrink-0 grow-0 pl-4 ${carouselSlideClass}`}
                    >
                      <div
                        className="flex min-h-[106px] flex-col justify-between rounded-lg border bg-white px-3 py-3 shadow-[0_2px_8px_rgba(15,23,42,0.06)]"
                        style={{ borderColor: tokens.cardBorder }}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 text-[11px] leading-tight">
                            <div className="break-words font-bold" style={{ color: tokens.primary }}>
                              Mã: {voucher.code}
                            </div>
                            <div className="shrink-0 whitespace-nowrap" style={{ color: tokens.mutedText }}>
                              HSD: {voucher.endDate ? formatVoucherExpiry(voucher.endDate) : 'Không hạn'}
                            </div>
                          </div>
                          <div className="mt-2 break-words text-[11px] leading-snug" style={{ color: tokens.bodyText }}>
                            {voucher.description || voucher.name || formatDiscount(voucher)}
                          </div>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedVoucher(voucher)}
                            className="rounded-full border px-3 py-1.5 text-[11px] font-medium transition-opacity hover:opacity-90"
                            style={{ borderColor: tokens.primary, color: tokens.primary }}
                          >
                            Điều kiện
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (!isExpired) {
                                onCopy?.(voucher.code);
                              }
                            }}
                            disabled={isExpired}
                            className="rounded-full px-3 py-1.5 text-[11px] font-medium transition-opacity hover:opacity-90 disabled:cursor-not-allowed"
                            style={{
                              backgroundColor: isExpired ? tokens.neutralBorder : tokens.primary,
                              color: isExpired ? tokens.bodyText : '#ffffff',
                            }}
                          >
                            {isExpired ? 'Hết hạn' : copiedCode === voucher.code ? 'Đã copy' : 'Sao chép'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {shouldShowCarouselControls && (
              <div className="mt-3 flex items-center justify-between">
                <div className="flex gap-2">
                  {vouchers.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        carouselApi?.scrollTo(index);
                        nextIndex(index);
                      }}
                      className={`h-2 rounded-full transition-all ${index === normalizedIndex ? 'w-6' : 'w-2'}`}
                      style={{ backgroundColor: index === normalizedIndex ? tokens.carouselDotActive : tokens.carouselDotInactive }}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => carouselApi?.scrollPrev()}
                    disabled={!canCarouselPrev}
                    className="flex h-8 w-8 items-center justify-center rounded-full border transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                    style={{ borderColor: tokens.neutralBorder, color: tokens.ctaOutlineText }}
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => carouselApi?.scrollNext()}
                    disabled={!canCarouselNext}
                    className="flex h-8 w-8 items-center justify-center rounded-full border transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                    style={{ borderColor: tokens.neutralBorder, color: tokens.ctaOutlineText }}
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
          {renderBottomCta()}
        </div>
      </section>
    );
  }
  if (style === 'minimal') {
    return wrapper(
      <section className="px-4 py-6 md:py-8" style={{ backgroundColor: tokens.sectionBg }}>
        <div className="mx-auto max-w-6xl space-y-5">
          {renderHeader('center', false)}
          {renderTopRightCta()}
          <div className={`grid gap-4 ${enterpriseGridClass}`}>
            {vouchers.map((voucher) => {
              const isExpired = voucher.endDate ? new Date(voucher.endDate).getTime() < Date.now() : false;

              return (
                <div
                  key={voucher.code}
                  className="relative min-h-[92px] overflow-hidden rounded-lg border bg-white shadow-[0_2px_10px_rgba(15,23,42,0.08)]"
                  style={{ borderColor: tokens.cardBorder }}
                >
                  <div
                    className="absolute bottom-0 left-0 top-0 w-1.5"
                    style={{ backgroundColor: tokens.bodyText }}
                  />
                  <div className="flex min-h-[92px] pl-1.5">
                    <div className="relative flex w-[42px] shrink-0 items-center justify-center bg-white px-1.5">
                      {voucher.thumbnail ? (
                        <PreviewImage
                          src={voucher.thumbnail}
                          alt={voucher.name}
                          width={30}
                          height={30}
                          className="h-[30px] w-[30px] object-contain"
                        />
                      ) : (
                        <div
                          className="flex h-[30px] w-[30px] items-center justify-center rounded"
                          style={{ backgroundColor: `${tokens.primary}22` }}
                        >
                          <VoucherIcon size={19} style={{ color: tokens.primary }} />
                        </div>
                      )}
                      <div
                        className="absolute bottom-3 right-0 top-3 border-r border-dashed"
                        style={{ borderColor: tokens.neutralBorder }}
                      />
                    </div>

                    <div className="relative flex min-w-0 flex-1 flex-col justify-center px-3 py-2.5 pr-9">
                      <button
                        type="button"
                        className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border text-[11px] font-semibold leading-none"
                        style={{ borderColor: tokens.bodyText, color: tokens.bodyText }}
                        onClick={() => setSelectedVoucher(voucher)}
                        aria-label={`Thông tin voucher ${voucher.code}`}
                      >
                        i
                      </button>
                      <div className="min-w-0">
                        <div className="truncate text-[12px] font-extrabold uppercase leading-tight tracking-wide" style={{ color: tokens.bodyText }}>
                          {voucher.name || formatDiscount(voucher)}
                        </div>
                        <div className="mt-1 truncate text-[10px] leading-snug" style={{ color: tokens.mutedText }}>
                          {voucher.description || formatDiscount(voucher)}
                        </div>
                        <div className="mt-2 text-[10px] leading-none" style={{ color: tokens.mutedText }}>
                          Mã: <span className="font-bold uppercase" style={{ color: tokens.bodyText }}>{voucher.code}</span>
                        </div>
                        <div className="mt-1 text-[10px] leading-none" style={{ color: tokens.mutedText }}>
                          HSD: {voucher.endDate ? formatVoucherExpiry(voucher.endDate) : 'Không giới hạn'}
                        </div>
                      </div>
                      {isExpired && (
                        <div
                          className="pointer-events-none absolute bottom-2 right-3 rotate-[-14deg] rounded border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-tight opacity-45"
                          style={{ borderColor: tokens.mutedText, color: tokens.mutedText }}
                        >
                          Hết hạn
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {renderBottomCta()}
          {renderVoucherInfoPopup()}
        </div>
      </section>
    );
  }

  return wrapper(
    <section className="px-4 py-6 md:py-8" style={{ backgroundColor: tokens.sectionBg }}>
      <div className="mx-auto max-w-6xl space-y-5">
        {renderHeader('center', false)}
        {renderTopRightCta()}
        <div className={`grid gap-4 ${enterpriseGridClass}`}>
          {vouchers.map((voucher) => (
            <div
              key={voucher.code}
              className="relative overflow-hidden rounded border bg-white shadow-[0_2px_8px_rgba(15,23,42,0.08)]"
              style={{ borderColor: tokens.cardBorder }}
            >
              <div className={enterpriseCompact ? 'hidden' : desktopColumns === 4 ? 'hidden lg:absolute lg:left-[86px] lg:top-0 lg:block lg:h-full lg:border-l lg:border-dashed' : 'absolute left-[86px] top-0 h-full border-l border-dashed'} style={{ borderColor: tokens.neutralBorder }} />
              <div className={enterpriseCompact ? 'hidden' : desktopColumns === 4 ? 'hidden lg:absolute lg:left-[80px] lg:top-[-7px] lg:block lg:h-3.5 lg:w-3.5 lg:rounded-full' : 'absolute left-[80px] top-[-7px] h-3.5 w-3.5 rounded-full'} style={{ backgroundColor: tokens.sectionBg }} />
              <div className={enterpriseCompact ? 'hidden' : desktopColumns === 4 ? 'hidden lg:absolute lg:bottom-[-7px] lg:left-[80px] lg:block lg:h-3.5 lg:w-3.5 lg:rounded-full' : 'absolute bottom-[-7px] left-[80px] h-3.5 w-3.5 rounded-full'} style={{ backgroundColor: tokens.sectionBg }} />
              <div className={enterpriseCompact ? 'flex min-h-[168px] flex-col' : desktopColumns === 4 ? 'flex min-h-[168px] flex-col lg:min-h-[82px] lg:flex-row' : 'flex min-h-[82px]'}>
                <div className={enterpriseCompact ? 'flex h-14 shrink-0 items-end justify-center px-2 pt-3' : desktopColumns === 4 ? 'flex h-14 shrink-0 items-end justify-center px-2 pt-3 lg:h-auto lg:w-[86px] lg:items-center lg:pt-0' : 'flex w-[86px] shrink-0 items-center justify-center px-2'}>
                  {voucher.thumbnail ? (
                    <PreviewImage
                      src={voucher.thumbnail}
                      alt={voucher.name}
                      width={68}
                      height={54}
                      className={enterpriseCompact ? 'h-10 w-10 object-contain' : 'h-[54px] w-[68px] object-contain'}
                    />
                  ) : (
                    <VoucherIcon
                      size={enterpriseCompact ? 34 : 44}
                      className="shrink-0"
                      style={{ color: tokens.primary }}
                    />
                  )}
                </div>

                <div className={enterpriseCompact ? 'flex min-w-0 flex-1 flex-col justify-between px-2.5 pb-2.5 pt-2 text-center' : desktopColumns === 4 ? 'flex min-w-0 flex-1 flex-col justify-between px-2.5 pb-2.5 pt-2 text-center lg:px-3 lg:py-2.5 lg:text-left' : 'flex min-w-0 flex-1 flex-col justify-between px-3 py-2.5'}>
                  <div className={enterpriseCompact ? 'space-y-1' : desktopColumns === 4 ? 'space-y-1 lg:flex lg:items-start lg:gap-2 lg:space-y-0' : 'flex items-start gap-2'}>
                    <div className="min-w-0 flex-1">
                      <div className={enterpriseCompact ? 'break-words text-[12px] font-extrabold uppercase leading-tight tracking-wide' : desktopColumns === 4 ? 'break-words text-[12px] font-extrabold uppercase leading-tight tracking-wide lg:text-[13px]' : 'break-words text-[13px] font-extrabold uppercase leading-tight tracking-wide'} style={{ color: tokens.bodyText }}>
                        {voucher.code}
                      </div>
                      <div className={enterpriseCompact ? 'text-[10px] leading-snug' : desktopColumns === 4 ? 'text-[10px] leading-snug lg:mt-1 lg:text-[11px]' : 'mt-1 text-[11px] leading-snug'} style={{ color: tokens.mutedText }}>
                        {voucher.description || voucher.name}
                      </div>
                    </div>
                    <button
                      type="button"
                      className={enterpriseCompact ? 'absolute right-2 top-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold' : desktopColumns === 4 ? 'absolute right-2 top-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold lg:static' : 'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold'}
                      style={{ borderColor: tokens.primary, color: tokens.primary }}
                      onClick={() => setSelectedVoucher(voucher)}
                      aria-label={`Thông tin voucher ${voucher.code}`}
                    >
                      !
                    </button>
                  </div>

                  <div className={enterpriseCompact ? 'space-y-2' : desktopColumns === 4 ? 'space-y-2 lg:flex lg:items-end lg:justify-between lg:gap-2 lg:space-y-0' : 'flex items-end justify-between gap-2'}>
                    <span className={enterpriseCompact ? 'block text-[9px] leading-tight' : desktopColumns === 4 ? 'block text-[9px] leading-tight lg:text-[10px]' : 'text-[10px]'} style={{ color: tokens.mutedText }}>
                      {voucher.endDate ? `HSD: ${formatVoucherExpiry(voucher.endDate)}` : formatDiscount(voucher)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onCopy?.(voucher.code)}
                      className={enterpriseCompact ? 'w-full shrink-0 px-2 py-1.5 text-[10px] font-bold leading-none text-white transition-opacity hover:opacity-90' : desktopColumns === 4 ? 'w-full shrink-0 px-2 py-1.5 text-[10px] font-bold leading-none text-white transition-opacity hover:opacity-90 lg:w-auto lg:rounded-none lg:px-3' : 'shrink-0 rounded-none px-3 py-1.5 text-[10px] font-bold leading-none text-white transition-opacity hover:opacity-90'}
                      style={{ backgroundColor: tokens.primary }}
                    >
                      {copiedCode === voucher.code ? 'Đã copy' : 'Copy mã'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {renderBottomCta()}
        {renderVoucherInfoPopup()}
      </div>
    </section>
  );
}
