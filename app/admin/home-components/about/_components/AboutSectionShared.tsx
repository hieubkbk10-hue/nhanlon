'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Image as ImageIcon, Phone } from 'lucide-react';
import { cn } from '../../../components/ui';
import type { PreviewDevice } from '../../_shared/hooks/usePreviewDevice';
import { getAboutIconComponent } from '../_lib/iconRegistry';
import type { AboutBrandMode, AboutPersistFeature, AboutPersistStat, AboutStyle } from '../_types';
import type { AboutColorTokens } from '../_lib/colors';

type AboutSectionContext = 'preview' | 'site';

export interface AboutSectionSharedProps {
  context: AboutSectionContext;
  mode: AboutBrandMode;
  style: AboutStyle;
  title: string;
  subHeading?: string;
  heading?: string;
  highlightText?: string;
  description?: string;
  phone?: string;
  image?: string;
  images?: string[];
  imageCaption?: string;
  buttonText?: string;
  buttonLink?: string;
  features: AboutPersistFeature[];
  stats?: AboutPersistStat[];
  tokens: AboutColorTokens;
  device?: PreviewDevice;
  imagePriority?: boolean;
}

const sanitizeText = (value?: string) => (typeof value === 'string' ? value : '').trim();

const AboutImage = ({
  src,
  alt,
  className,
  context,
  imagePriority,
}: {
  src: string;
  alt: string;
  className: string;
  context: AboutSectionContext;
  imagePriority: boolean;
}) => {
  if (!src.trim()) {
    return null;
  }

  if (context === 'preview') {
    return <img src={src} alt={alt} className={className} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={imagePriority ? 'eager' : 'lazy'}
    />
  );
};

const AboutButton = ({
  context,
  href,
  text,
  className,
  style,
  withArrow = false,
}: {
  context: AboutSectionContext;
  href: string;
  text: string;
  className: string;
  style: React.CSSProperties;
  withArrow?: boolean;
}) => {
  if (context === 'site') {
    return (
      <Link href={href} className={className} style={style}>
        <span>{text}</span>
        {withArrow ? <ArrowRight size={16} /> : null}
      </Link>
    );
  }

  return (
    <span className={className} style={style}>
      <span>{text}</span>
      {withArrow ? <ArrowRight size={16} /> : null}
    </span>
  );
};

export function AboutSectionShared({
  context,
  mode,
  style,
  title,
  subHeading,
  heading,
  highlightText,
  description,
  phone,
  image,
  images,
  imageCaption: _imageCaption,
  buttonText,
  buttonLink,
  features,
  stats,
  tokens,
  device = 'desktop',
  imagePriority = false,
}: AboutSectionSharedProps) {
  const isPreview = context === 'preview';
  const isMobilePreview = isPreview && device === 'mobile';
  const _isTabletPreview = isPreview && device === 'tablet';

  const resolvedHeading = sanitizeText(heading) || sanitizeText(title) || 'Về chúng tôi';
  const resolvedDescription = sanitizeText(description);
  const resolvedSubHeading = sanitizeText(subHeading);
  const resolvedHighlightText = sanitizeText(highlightText);
  const resolvedPhone = sanitizeText(phone);
  const resolvedButtonText = sanitizeText(buttonText);
  const resolvedButtonLink = sanitizeText(buttonLink) || '/about';
  const resolvedImages = (Array.isArray(images) ? images : [])
    .map((value) => sanitizeText(value))
    .filter(Boolean);
  const primaryImage = sanitizeText(image) || resolvedImages[0] || '';
  const galleryImages = [primaryImage, resolvedImages[1] || primaryImage, resolvedImages[2] || resolvedImages[1] || primaryImage];
  const visibleFeatures = features.filter((feature) => sanitizeText(feature.title));
  const solarStat = Array.isArray(stats) ? stats.find((stat) => sanitizeText(stat.value) || sanitizeText(stat.label)) : undefined;
  const solarStatValue = sanitizeText(solarStat?.value) || '18+';
  const solarStatLabel = sanitizeText(solarStat?.label) || 'năm kinh nghiệm';

  const brandInfo = mode === 'single' ? '1 màu (single)' : '2 màu (dual)';

  const renderEmptyImage = (size = 44) => (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ backgroundColor: tokens.imageFallbackBg }}
    >
      <ImageIcon size={size} style={{ color: tokens.imageFallbackIcon }} />
    </div>
  );

  const renderIcon = (name: string, className = 'w-4 h-4') => {
    const IconComponent = getAboutIconComponent(name);
    return <IconComponent className={className} />;
  };

  const renderFeatureMedia = (feature: AboutPersistFeature, className = 'w-4 h-4') => {
    if (feature.mediaType === 'image' && sanitizeText(feature.image)) {
      return (
        <AboutImage
          src={sanitizeText(feature.image)}
          alt={sanitizeText(feature.title) || 'feature'}
          className="w-full h-full object-cover"
          context={context}
          imagePriority={imagePriority}
        />
      );
    }

    return renderIcon(feature.iconName || 'CheckCircle2', className);
  };

  const renderSolarBadgeIcon = (className = 'h-[27px] w-[27px]') => (
    <svg viewBox="0 0 27 27" fill="none" className={className} aria-hidden="true">
      <path
        d="M21.6001 6.11887C21.0028 5.87086 20.5285 5.39582 20.2814 4.79819L20.2817 4.80182L19.414 2.7069C19.1664 2.10938 18.6916 1.63466 18.094 1.38714C17.4965 1.13962 16.8251 1.13957 16.2276 1.387L14.1325 2.25112C13.5352 2.49897 12.8639 2.49948 12.2662 2.25252L10.1735 1.38566C9.57583 1.13809 8.90431 1.13809 8.30666 1.38566C7.709 1.63322 7.23417 2.10808 6.98661 2.70575L6.11915 4.80005C5.87097 5.39662 5.39624 5.87035 4.79915 6.11724L2.70643 6.98411C2.41034 7.10664 2.1413 7.28633 1.91467 7.51288C1.68805 7.73944 1.50829 8.00844 1.38566 8.3045C1.26303 8.60056 1.19994 8.91789 1.19999 9.23834C1.20004 9.55879 1.26324 9.8761 1.38596 10.1721L2.25155 12.2679C2.49939 12.8652 2.4999 13.5365 2.25295 14.1342L1.38612 16.227C1.13907 16.8246 1.1394 17.4958 1.38705 18.0932C1.6347 18.6905 2.10939 19.1651 2.70679 19.4125L4.80101 20.28C5.39824 20.528 5.87255 21.0031 6.11965 21.6007L6.98737 23.6956C7.23509 24.2926 7.70966 24.7669 8.30683 25.0143C8.904 25.2617 9.57494 25.2619 10.1723 25.0149L12.2665 24.1486C12.8638 23.9008 13.5351 23.9003 14.1327 24.1472L16.2254 25.0141C16.8231 25.2617 17.4946 25.2617 18.0923 25.0141C18.6899 24.7665 19.1648 24.2917 19.4123 23.694L20.2798 21.5997C20.5278 21.0025 21.0028 20.5281 21.6004 20.281L23.6931 19.4142C23.9892 19.2916 24.2583 19.1119 24.4849 18.8854C24.7115 18.6588 24.8913 18.3898 25.0139 18.0938C25.1365 17.7977 25.1996 17.4804 25.1996 17.1599C25.1995 16.8395 25.1363 16.5222 25.0136 16.2261L24.1483 14.134C23.8995 13.5363 23.8998 12.8641 24.1475 12.2661L25.0143 10.1734C25.2619 9.57567 25.2619 8.90413 25.0143 8.30645C24.7668 7.70877 24.2919 7.23392 23.6943 6.98635L21.6001 6.11887Z"
        fill={tokens.primary}
        stroke={tokens.primary}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M7.91467 13.6246L11.429 17.3146L18.4575 9.93457" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const renderClassic = () => (
    <section className={cn('py-8', isPreview ? (isMobilePreview ? 'px-3' : 'px-4 md:px-6') : 'px-4 md:px-8')}>
      <div className="max-w-7xl mx-auto rounded-[2rem] overflow-hidden border relative font-[family-name:var(--font-be-vietnam-pro)]" style={{ backgroundColor: '#f9f7f4', borderColor: tokens.neutralBorder }}>
        <div className="absolute top-0 right-0 w-48 h-48 -translate-y-8 translate-x-8 opacity-[0.03] pointer-events-none">
          <svg viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 0 C70 0 100 20 100 50 C100 80 80 100 50 100 C20 100 0 70 0 50 C0 20 30 0 50 0 Z" />
          </svg>
        </div>
        <div className="grid lg:grid-cols-2 gap-4 md:gap-8 items-center relative z-10 p-4 md:p-8">
          <div className="flex justify-center w-full">
            <div className="relative w-full aspect-video md:aspect-[4/3] rounded-[2rem] overflow-hidden shadow-lg">
              {primaryImage
                ? <AboutImage src={primaryImage} alt={resolvedHeading} className="w-full h-full object-cover" context={context} imagePriority={imagePriority} />
                : renderEmptyImage(48)}
              {resolvedPhone ? (
                <div className="absolute bottom-4 left-4 rounded-xl flex items-center p-1.5 shadow-xl w-max" style={{ backgroundColor: tokens.primary, opacity: 0.95 }}>
                  <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: tokens.secondary }}>
                    <Phone className="w-4 h-4" style={{ color: tokens.ctaSolidText }} />
                  </div>
                  <div className="px-2.5" style={{ color: tokens.ctaSolidText }}>
                    <p className="text-[9px] uppercase font-bold opacity-90 tracking-wider">Gọi ngay</p>
                    <p className="text-sm font-extrabold leading-none mt-0.5">{resolvedPhone}</p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col w-full">
            <div className="inline-block bg-white px-4 py-1.5 rounded-full text-xs font-black tracking-wider mb-3 self-start shadow-sm text-gray-900">
              {resolvedSubHeading || 'VỀ CHÚNG TÔI'}
            </div>
            <h2 className="text-3xl lg:text-5xl font-black mb-3 text-gray-950 tracking-tight">
              {resolvedHeading} {resolvedHighlightText ? <span style={{ color: tokens.primary }}>{resolvedHighlightText}</span> : null}
            </h2>
            {resolvedDescription ? (
              <p className="text-gray-900 font-medium leading-relaxed mb-6 text-sm bg-white/80 shadow-sm p-4 rounded-xl border border-white">
                {resolvedDescription}
              </p>
            ) : null}

            {visibleFeatures.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 mb-6">
                {visibleFeatures.slice(0, 4).map((feature) => (
                  <div key={feature.title} className="flex items-center gap-3 bg-white/60 p-2 rounded-lg border border-white/50">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm overflow-hidden" style={{ color: tokens.primary }}>
                      {renderFeatureMedia(feature, 'w-4 h-4 stroke-[2.5]')}
                    </div>
                    <span className="font-extrabold text-gray-950 text-sm leading-tight">{feature.title}</span>
                  </div>
                ))}
              </div>
            ) : null}

            {resolvedButtonText ? (
              <AboutButton
                context={context}
                href={resolvedButtonLink}
                text={resolvedButtonText}
                withArrow
                className="rounded-full self-start inline-flex items-center gap-2 px-8 py-3 shadow-md font-bold text-sm"
                style={{ backgroundColor: tokens.primary, color: tokens.ctaSolidText }}
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );

  const renderBento = () => (
    <section className="py-8 px-0">
      <div className="max-w-7xl mx-auto w-full rounded-2xl overflow-hidden flex flex-col-reverse lg:flex-row relative" style={{ backgroundColor: '#f9fafb' }}>
        <div className="w-full lg:w-3/5 p-4 md:p-8 xl:p-10 flex flex-col justify-center z-10 bg-white/80 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none">
          <div className="flex items-center gap-2 font-semibold text-sm mb-3" style={{ color: tokens.primary }}>
            <span className="w-6 h-px bg-current"></span>
            {resolvedSubHeading || 'VỀ CHÚNG TÔI'}
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-5 leading-tight tracking-tight">
            {resolvedHeading} {resolvedHighlightText}
          </h2>
          {visibleFeatures.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 mb-6">
              {visibleFeatures.slice(0, 4).map((feature) => (
                <div key={feature.title} className="flex items-center gap-3 bg-white/60 p-2 rounded lg:bg-transparent lg:p-0">
                  <div className="w-6 h-6 rounded flex items-center justify-center shrink-0 overflow-hidden" style={{ backgroundColor: tokens.sectionAltBg, color: tokens.primary }}>
                    {renderFeatureMedia(feature, 'w-3.5 h-3.5')}
                  </div>
                  <span className="font-semibold text-gray-800 text-xs lg:text-sm leading-tight">{feature.title}</span>
                </div>
              ))}
            </div>
          ) : null}

          <div className="grid grid-cols-1 lg:flex items-center gap-4 lg:gap-6">
            {resolvedButtonText ? (
              <AboutButton
                context={context}
                href={resolvedButtonLink}
                text={resolvedButtonText}
                withArrow
                className="text-white px-6 py-3 rounded text-sm font-bold inline-flex items-center justify-center gap-2 uppercase tracking-wide w-full lg:w-auto"
                style={{ backgroundColor: '#111827' }}
              />
            ) : null}
            {resolvedPhone ? (
              <div className="flex items-center justify-center lg:justify-start gap-3 group cursor-pointer bg-white/50 lg:bg-transparent p-2 lg:p-0 rounded-lg">
                <div className="w-10 h-10 shrink-0 rounded-full border border-gray-300 flex items-center justify-center transition-colors" style={{ color: tokens.primary }}>
                  <Phone className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1 lg:flex-none">
                  <p className="text-[10px] text-gray-500 font-medium truncate uppercase tracking-wide">Gọi ngay cho chúng tôi</p>
                  <p className="font-bold text-gray-900 text-sm truncate">{resolvedPhone}</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div className="w-full lg:w-2/5 min-h-[250px] lg:min-h-full lg:absolute lg:right-0 top-0 bottom-0 relative">
          {primaryImage
            ? <AboutImage src={primaryImage} alt={resolvedHeading} className="w-full h-full object-cover object-center absolute inset-0" context={context} imagePriority={imagePriority} />
            : renderEmptyImage(48)}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#f9fafb] lg:via-[#f9fafb]/50 lg:to-transparent"></div>
        </div>
      </div>
    </section>
  );

  const renderMinimal = () => (
    <section className="py-8 px-0">
      <div className="max-w-7xl mx-auto w-full bg-[#fdfaf6] rounded-2xl flex flex-col lg:flex-row gap-4 lg:gap-8 p-3 lg:p-8 relative overflow-hidden border" style={{ borderColor: tokens.neutralBorder }}>
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #d1d5db 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
        <div className="w-full lg:w-1/2 relative z-10 grid grid-cols-2 gap-3 shrink-0">
          <div className="w-full min-h-[220px] lg:min-h-[320px] rounded-xl overflow-hidden shadow-md">
            {galleryImages[0] ? <AboutImage src={galleryImages[0]} alt="img1" className="w-full h-full object-cover" context={context} imagePriority={imagePriority} /> : renderEmptyImage(40)}
          </div>
          <div className="flex flex-col gap-3">
            <div className="w-full h-[120px] lg:h-[150px] rounded-xl overflow-hidden shadow-md">
              {galleryImages[1] ? <AboutImage src={galleryImages[1]} alt="img2" className="w-full h-full object-cover" context={context} imagePriority={imagePriority} /> : renderEmptyImage(32)}
            </div>
            <div className="w-full flex-1 min-h-[120px] rounded-xl overflow-hidden shadow-md">
              {galleryImages[2] ? <AboutImage src={galleryImages[2]} alt="img3" className="w-full h-full object-cover" context={context} imagePriority={imagePriority} /> : renderEmptyImage(32)}
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 flex flex-col z-10 justify-center py-2 lg:py-4">
          <h2 className="text-xl lg:text-3xl font-black mb-3 uppercase tracking-tight text-gray-950" style={{ color: tokens.secondary }}>
            {resolvedHeading} <br className="hidden lg:block" /> {resolvedHighlightText}
          </h2>
          {resolvedDescription ? <p className="text-gray-900 mb-5 text-xs lg:text-sm leading-relaxed text-justify font-semibold">{resolvedDescription}</p> : null}
          {visibleFeatures.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 mb-5">
              {visibleFeatures.slice(0, 4).map((feature) => (
                <div key={feature.title} className="flex items-center gap-2">
                  <div className="shrink-0 w-5 h-5 overflow-hidden flex items-center justify-center" style={{ color: tokens.primary }}>
                    {renderFeatureMedia(feature, 'w-5 h-5 stroke-[2.5]')}
                  </div>
                  <span className="text-gray-950 font-extrabold text-xs xl:text-[13px]">{feature.title}</span>
                </div>
              ))}
            </div>
          ) : null}
          {resolvedButtonText ? (
            <div className="mt-auto pt-2">
              <AboutButton
                context={context}
                href={resolvedButtonLink}
                text={resolvedButtonText}
                className="text-white px-6 py-2.5 rounded font-black shadow-md uppercase text-[11px] tracking-widest self-start inline-flex"
                style={{ backgroundColor: tokens.primary, color: tokens.ctaSolidText }}
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );

  const renderSplit = () => (
    <section className="py-8 px-0">
      <div className="max-w-7xl mx-auto w-full bg-[#fafafa] overflow-hidden flex flex-col lg:flex-row relative items-center shadow-sm border rounded-2xl" style={{ borderColor: tokens.neutralBorder }}>
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.03] pointer-events-none overflow-hidden">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-[150%] lg:w-[100%] h-auto text-gray-900 -rotate-12 scale-150">
            <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
          </svg>
        </div>
        <div className="w-full lg:w-5/12 relative flex justify-center items-end min-h-[220px] lg:min-h-[350px] pt-6 lg:pt-8">
          {primaryImage
            ? <AboutImage src={primaryImage} alt="Professional" className="w-auto h-full max-h-[350px] object-contain relative z-10 px-4 drop-shadow-xl" context={context} imagePriority={imagePriority} />
            : renderEmptyImage(48)}
        </div>
        <div className="w-full lg:w-7/12 p-5 lg:p-10 xl:p-12 flex flex-col justify-center relative z-10">
          <div className="text-gray-950 font-extrabold mb-2 text-sm tracking-wide">{resolvedSubHeading || 'VỀ CHÚNG TÔI'}</div>
          <h2 className="text-3xl lg:text-[34px] leading-[1.2] text-[#112338] font-black mb-4 tracking-tight">{resolvedHeading} {resolvedHighlightText}</h2>
          <div className="flex flex-col gap-3 text-gray-800 text-sm leading-relaxed mb-6 font-medium">
            {resolvedDescription ? <p>{resolvedDescription}</p> : null}
            {visibleFeatures.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 mt-2">
                {visibleFeatures.slice(0, 4).map((feature) => (
                  <div key={feature.title} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: tokens.secondary }}></div>
                    <span className="text-gray-950 font-bold text-xs">{feature.title}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          {resolvedButtonText ? (
            <AboutButton
              context={context}
              href={resolvedButtonLink}
              text={resolvedButtonText}
              className="px-6 py-3 font-extrabold text-xs tracking-widest uppercase w-max shadow-md rounded-sm inline-flex"
              style={{ backgroundColor: tokens.secondary, color: '#ffffff' }}
            />
          ) : null}
        </div>
      </div>
    </section>
  );

  const renderTimeline = () => (
    <section className="py-8 px-0">
      <div className="max-w-7xl mx-auto w-full bg-white flex flex-col lg:flex-row gap-4 lg:gap-6 relative overflow-hidden lg:overflow-visible py-2 rounded-xl border shadow-sm" style={{ borderColor: tokens.neutralBorder }}>
        <div className="w-full lg:w-[55%] flex flex-col justify-center pt-3 lg:py-4 pl-3 lg:pl-8 xl:pl-10 pr-3 lg:pr-0 relative z-10">
          <div className="inline-block mb-2 self-start">
            <span className="font-extrabold tracking-[0.1em] text-[10px] uppercase pb-0.5 border-b-2" style={{ color: tokens.primary, borderBottomColor: tokens.primary }}>
              {resolvedSubHeading || 'VỀ CHÚNG TÔI'}
            </span>
          </div>
          <h2 className="text-2xl lg:text-[34px] font-black text-gray-950 mb-3 leading-[1.1] tracking-tight">
            {resolvedHeading} <br className="hidden sm:block" />{resolvedHighlightText}
          </h2>
          {resolvedDescription ? <p className="text-gray-700 mb-4 leading-snug text-[11px] lg:text-xs font-semibold max-w-xl text-justify sm:text-left">{resolvedDescription}</p> : null}
          {visibleFeatures.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {visibleFeatures.slice(0, 4).map((feature) => (
                <div key={feature.title} className="flex items-center gap-1.5">
                  <div className="shrink-0 w-3.5 h-3.5 overflow-hidden flex items-center justify-center" style={{ color: tokens.primary }}>
                    {renderFeatureMedia(feature, 'w-3.5 h-3.5 stroke-[3]')}
                  </div>
                  <span className="text-gray-950 font-extrabold text-[10px] uppercase">{feature.title}</span>
                </div>
              ))}
            </div>
          ) : null}
          {resolvedButtonText ? (
            <div className="pt-2">
              <AboutButton
                context={context}
                href={resolvedButtonLink}
                text={resolvedButtonText}
                className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wide inline-flex"
                style={{ backgroundColor: tokens.primary, color: tokens.ctaSolidText }}
              />
            </div>
          ) : null}
        </div>
        <div className="w-full lg:w-[45%] relative min-h-[200px] lg:min-h-[320px] p-3 lg:py-4 lg:pr-6">
          <div className="w-full h-full relative">
            {primaryImage ? <AboutImage src={primaryImage} alt="Interior" className="w-full h-full object-cover rounded-xl shadow-sm" context={context} imagePriority={imagePriority} /> : renderEmptyImage(40)}
            {resolvedButtonText ? (
              <div className="absolute -left-2 -bottom-2 lg:-left-6 lg:-bottom-2 z-20">
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center p-1 shadow-sm border border-white" style={{ backgroundColor: tokens.sectionAltBg }}>
                  <AboutButton
                    context={context}
                    href={resolvedButtonLink}
                    text=""
                    className="w-full h-full rounded-full border flex items-center justify-center group"
                    style={{ backgroundColor: 'transparent', borderColor: tokens.primary, color: tokens.primary }}
                    withArrow
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );

  const renderShowcase = () => (
    <section className="py-8 px-0">
      <div className="max-w-7xl mx-auto w-full bg-white overflow-hidden relative flex flex-col lg:flex-row shadow-sm border rounded-xl">
        <div className="absolute top-0 left-0 w-[150%] lg:w-full flex overflow-hidden pointer-events-none select-none z-0 -ml-8 lg:ml-0">
          <span className="text-[120px] lg:text-[220px] xl:text-[260px] font-black tracking-tighter leading-none text-gray-50 uppercase">
            {resolvedHighlightText || 'ABOUT'}
          </span>
        </div>
        <div className="w-full lg:w-[45%] xl:w-5/12 flex flex-col justify-center p-4 lg:p-8 xl:p-10 relative z-10 pt-10 lg:pt-10">
          <div className="text-gray-800 font-bold mb-1.5 text-[10px] lg:text-[11px] tracking-wider uppercase">
            {resolvedSubHeading || 'VỀ CHÚNG TÔI'}
          </div>
          <h2 className="text-2xl lg:text-[28px] font-black text-gray-950 mb-3 tracking-tight uppercase leading-[1.1]">
            {resolvedHeading}
          </h2>
          {resolvedDescription ? <p className="text-gray-700 text-[11px] lg:text-[12px] leading-relaxed mb-4 font-semibold text-justify">{resolvedDescription}</p> : null}
          {visibleFeatures.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 mb-5">
              {visibleFeatures.slice(0, 4).map((feature) => (
                <div key={feature.title} className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tokens.primary }}></div>
                  <span className="text-gray-900 text-[10px] lg:text-[11px] font-extrabold">{feature.title}</span>
                </div>
              ))}
            </div>
          ) : null}
          {resolvedButtonText ? (
            <AboutButton
              context={context}
              href={resolvedButtonLink}
              text={resolvedButtonText}
              className="px-6 py-2.5 font-bold text-[10px] hover:bg-opacity-90 transition-all w-max rounded-sm shadow-md inline-flex"
              style={{ backgroundColor: tokens.primary, color: tokens.ctaSolidText }}
            />
          ) : null}
        </div>
        <div className="w-full lg:w-[55%] xl:w-7/12 relative min-h-[260px] lg:min-h-[330px]">
          {primaryImage ? <AboutImage src={primaryImage} alt="Garden Nature" className="w-full h-full object-cover lg:object-left object-center" context={context} imagePriority={imagePriority} /> : renderEmptyImage(48)}
        </div>
      </div>
    </section>
  );

  const renderSpaCollage = () => (
    <section className="py-8 px-0">
      <div
        className={cn(
          'max-w-7xl mx-auto w-full overflow-hidden rounded-[0.875rem] border shadow-sm',
          'grid grid-cols-1 lg:grid-cols-[0.95fr_2.1fr] gap-4 lg:gap-5 p-4 md:p-5 lg:p-6',
        )}
        style={{ backgroundColor: '#f5ecdc', borderColor: '#eadbc5' }}
      >
        <div className="relative z-10 flex flex-col justify-center">
          <div className="mb-2 flex items-center gap-3">
            <span className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: tokens.secondary }}>
              {resolvedSubHeading || 'VỀ CHÚNG TÔI'}
            </span>
            <span className="h-px w-12 bg-[#c9ad8a]" />
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-[34px] font-black leading-[1.12] tracking-tight text-[#523a2a]">
            {resolvedHeading}
            {resolvedHighlightText ? (
              <>
                <span className="hidden sm:inline"> </span>
                <span className="block sm:inline" style={{ color: tokens.secondary }}>{resolvedHighlightText}</span>
              </>
            ) : null}
          </h2>
          <div className="my-3 text-[#c9a36d]/55" aria-hidden="true">
            <svg viewBox="0 0 180 18" className="h-4 w-36" fill="none">
              <path d="M2 9h52" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M126 9h52" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M64 9c7-7 16-7 26 0s19 7 26 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M86 7c-2-5 3-7 6-3 2 4-2 7-6 3Z" fill="currentColor" opacity="0.45" />
              <path d="M94 11c2 5-3 7-6 3-2-4 2-7 6-3Z" fill="currentColor" opacity="0.3" />
            </svg>
          </div>
          {resolvedDescription ? (
            <p className="max-w-md text-[13px] md:text-sm font-semibold leading-relaxed text-[#6a5444]">
              {resolvedDescription}
            </p>
          ) : null}
          {visibleFeatures.length > 0 ? (
            <div className="mt-4 space-y-2.5">
              {visibleFeatures.slice(0, 4).map((feature) => (
                <div key={feature.title} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#efe1cc] text-[#8b6a48]">
                    {renderFeatureMedia(feature, 'w-3.5 h-3.5 stroke-[2.8]')}
                  </span>
                  <span className="text-xs md:text-[13px] font-extrabold leading-snug text-[#5f4938]">{feature.title}</span>
                </div>
              ))}
            </div>
          ) : null}
          {resolvedButtonText ? (
            <AboutButton
              context={context}
              href={resolvedButtonLink}
              text={resolvedButtonText}
              className="mt-5 inline-flex w-max items-center gap-2 rounded-xl px-6 py-3 text-sm font-black shadow-sm transition-colors"
              style={{ backgroundColor: '#c89f62', color: '#2b1c12' }}
            />
          ) : null}
        </div>

        <div className="grid min-h-[280px] grid-cols-1 gap-3 md:grid-cols-[1.75fr_1fr] lg:min-h-[330px]">
          <div className="min-h-[240px] overflow-hidden rounded-[0.675rem] border-2 border-[#fff8ed] shadow-md">
            {galleryImages[0]
              ? <AboutImage src={galleryImages[0]} alt={resolvedHeading} className="h-full w-full object-cover" context={context} imagePriority={imagePriority} />
              : renderEmptyImage(48)}
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
            <div className="min-h-[130px] overflow-hidden rounded-[0.575rem] border-2 border-[#fff8ed] shadow-md">
              {galleryImages[1]
                ? <AboutImage src={galleryImages[1]} alt={`${resolvedHeading} 2`} className="h-full w-full object-cover" context={context} imagePriority={imagePriority} />
                : renderEmptyImage(36)}
            </div>
            <div className="min-h-[130px] overflow-hidden rounded-[0.575rem] border-2 border-[#fff8ed] shadow-md">
              {galleryImages[2]
                ? <AboutImage src={galleryImages[2]} alt={`${resolvedHeading} 3`} className="h-full w-full object-cover" context={context} imagePriority={imagePriority} />
                : renderEmptyImage(36)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const renderSolarFeature = () => (
    <section className="py-8 px-0 font-[family-name:var(--font-be-vietnam-pro)]">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-7 lg:flex-row lg:gap-0">
        <div className="relative order-1 w-full px-2.5 lg:w-1/2">
          <div className="relative mx-auto text-center">
            <div className="mx-auto mt-2 w-full max-w-[557px] overflow-hidden rounded-[1.75rem] lg:mt-[30px]">
              {primaryImage
                ? <AboutImage src={primaryImage} alt={resolvedHeading} className="h-auto w-full object-cover" context={context} imagePriority={imagePriority} />
                : <div className="aspect-[557/476] w-full rounded-[1.75rem]">{renderEmptyImage(48)}</div>}
            </div>
            <div
              className="absolute right-0 top-0 rounded-[5px_30px] border-[2.4px] border-white px-4 py-4 text-center text-white shadow-lg sm:px-6 sm:py-6"
              style={{ backgroundColor: tokens.secondary }}
            >
              <div className="text-3xl font-bold leading-tight sm:text-[38px]">{solarStatValue}</div>
              <div className="max-w-[92px] text-xs font-semibold leading-snug sm:text-sm">{solarStatLabel}</div>
            </div>
          </div>
        </div>

        <div className="order-2 w-full px-2.5 lg:w-1/2">
          <div className="lg:pl-[38px]">
            <h2 className="mb-4 text-3xl font-bold leading-tight lg:text-[38px] lg:leading-[58px]" style={{ color: tokens.primary }}>
              {resolvedHeading}
              {resolvedHighlightText ? (
                <>
                  <span className="hidden sm:inline"> </span>
                  <span className="block sm:inline">{resolvedHighlightText}</span>
                </>
              ) : null}
            </h2>
            {resolvedDescription ? (
              <p className="mb-6 text-sm font-medium leading-relaxed text-justify md:text-[15px]" style={{ color: tokens.bodyText }}>
                {resolvedDescription}
              </p>
            ) : null}
            {visibleFeatures.length > 0 ? (
              <ul className="mb-6 space-y-4">
                {visibleFeatures.slice(0, 4).map((feature) => (
                  <li key={feature.title} className="relative pl-[38px] text-sm font-semibold leading-relaxed md:text-[15px]" style={{ color: tokens.primary }}>
                    <span className="absolute left-0 top-0 flex h-[27px] w-[27px] items-center justify-center overflow-hidden">
                      {feature.mediaType === 'image' && sanitizeText(feature.image)
                        ? renderFeatureMedia(feature, 'h-[27px] w-[27px]')
                        : renderSolarBadgeIcon()}
                    </span>
                    {feature.title}
                  </li>
                ))}
              </ul>
            ) : null}
            {resolvedButtonText ? (
              <AboutButton
                context={context}
                href={resolvedButtonLink}
                text={resolvedButtonText}
                withArrow
                className="inline-flex items-center gap-2 overflow-hidden rounded-[10px] px-5 py-2.5 text-center text-base font-medium capitalize shadow-[0_0_40px_5px_rgba(0,0,0,0.05)] [&>svg]:h-6 [&>svg]:w-6 [&>svg]:-rotate-45"
                style={{ backgroundColor: tokens.secondary, color: '#ffffff' }}
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );

  const renderEmpty = () => (
    <section className="py-16">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: tokens.emptyStatBg }}>
          <ImageIcon size={30} style={{ color: tokens.primary }} />
        </div>
        <h3 className="font-medium mb-1" style={{ color: tokens.bodyText }}>Chưa có nội dung</h3>
        <p className="text-sm" style={{ color: tokens.mutedText }}>Nhập tiêu đề và mô tả để bắt đầu</p>
      </div>
    </section>
  );

  const hasContent = resolvedHeading || resolvedDescription || sanitizeText(image) || visibleFeatures.length > 0;

  return (
    <div data-mode={mode} data-brand-info={brandInfo}>
      {!hasContent
        ? renderEmpty()
        : (
          <>
            {style === 'classic' && renderClassic()}
            {style === 'bento' && renderBento()}
            {style === 'minimal' && renderMinimal()}
            {style === 'split' && renderSplit()}
            {style === 'timeline' && renderTimeline()}
            {style === 'showcase' && renderShowcase()}
            {style === 'spaCollage' && renderSpaCollage()}
            {style === 'solarFeature' && renderSolarFeature()}
          </>
        )}
    </div>
  );
}
