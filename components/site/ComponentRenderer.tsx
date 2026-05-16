'use client';

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { PublicImage as Image } from '@/components/shared/PublicImage';
import dynamic from 'next/dynamic';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useBrandColors } from './hooks';
import { useSnapshotDemoContext } from '@/components/modules/homepage/SnapshotDemoProvider';
import { cn } from '@/app/admin/components/ui';
import { resolveTypeOverrideColors } from '@/app/admin/home-components/_shared/lib/typeColorOverride';
import { resolveTypeOverrideFont } from '@/app/admin/home-components/_shared/lib/typeFontOverride';
import { getHomeComponentPriceLabel, resolveSaleMode } from '@/app/admin/home-components/_shared/lib/productPrice';
import { getProductImageAspectRatioCssValue, resolveProductImageAspectRatio } from '@/lib/products/image-aspect-ratio';
import { buildDetailPath, normalizeRouteMode } from '@/lib/ia/route-mode';
import {
  getBentoColors,
  getFadeColors,
  getFullscreenColors,
  getParallaxColors,
  getSliderColors,
  getSplitColors,
} from '@/app/admin/home-components/hero/_lib/colors';
import {
  getCardsColors,
  getCounterColors,
  getGradientColors,
  getHorizontalColors,
  getIconsColors,
  getMinimalColors,
} from '@/app/admin/home-components/stats/_lib/colors';
import { getCategoryProductsColors } from '@/app/admin/home-components/category-products/_lib/colors';
import { getProductCategoriesColors } from '@/app/admin/home-components/product-categories/_lib/colors';
import { getCTAColors } from '@/app/admin/home-components/cta/_lib/colors';
import { CTASectionShared } from '@/app/admin/home-components/cta/_components/CTASectionShared';
import { BenefitsSectionShared } from '@/app/admin/home-components/benefits/_components/BenefitsSectionShared';
import { getBenefitsSectionColors, normalizeBenefitsHarmony, normalizeBenefitsStyle } from '@/app/admin/home-components/benefits/_lib/colors';
import { FaqSectionShared } from '@/app/admin/home-components/faq/_components/FaqSectionShared';
import { getFaqColors } from '@/app/admin/home-components/faq/_lib/colors';
import { getTestimonialsSectionColors } from '@/app/admin/home-components/testimonials/_lib/colors';
import { TestimonialsSectionShared } from '@/app/admin/home-components/testimonials/_components/TestimonialsSectionShared';
import { normalizeTestimonialsDesktopColumns, normalizeTestimonialsStyle } from '@/app/admin/home-components/testimonials/_types';
import { getMarqueeSectionColors } from '@/app/admin/home-components/marquee/_lib/colors';
import { MarqueeSectionShared } from '@/app/admin/home-components/marquee/_components/MarqueeSectionShared';
import { normalizeMarqueeStyle, normalizeMarqueeDirection, normalizeMarqueeSpeed, normalizeMarqueeScale, normalizeMarqueeItem } from '@/app/admin/home-components/marquee/_types';
import type { MarqueeBrandMode } from '@/app/admin/home-components/marquee/_types';
import { getGalleryColorTokens, normalizeGalleryHarmony, type GalleryColorTokens } from '@/app/admin/home-components/gallery/_lib/colors';
import { normalizeTrustBadgesStyle } from '@/app/admin/home-components/gallery/_types';
import { getFooterLayoutColors, type FooterLayoutColors } from '@/app/admin/home-components/footer/_lib/colors';
import { getFooterLogoBackgroundClassName, getFooterLogoBackgroundStyle, getFooterLogoSize } from '@/app/admin/home-components/footer/_lib/constants';
import type { ProcessBrandMode } from '@/app/admin/home-components/process/_types';
import { normalizeProcessRenderSteps, normalizeProcessStyle } from '@/app/admin/home-components/process/_lib/normalize';
import { ProcessSectionShared } from '@/app/admin/home-components/process/_components/ProcessSectionShared';
import { FeaturesSectionShared } from '@/app/admin/home-components/features/_components/FeaturesSectionShared';
import { ClientsSectionShared, normalizeClientItems, normalizeClientsStyleSafe } from '@/app/admin/home-components/clients/_components/ClientsSectionShared';
import { getClientsColorTokens } from '@/app/admin/home-components/clients/_lib/colors';
import { getGalleryMarqueeBaseItems } from '@/app/admin/home-components/gallery/_lib/constants';
import { ServicesSectionCore } from './ServicesSectionCore';
import type { ServiceItem, ServiceItemMediaAlign, ServiceItemMediaPlacement, ServicesStyle } from '@/app/admin/home-components/services/_types';
import { getServicesDesktopColumns, getServicesMediaAlign, getServicesMediaPlacement } from '@/app/admin/home-components/services/_lib/items';
import { getServicesColors } from '@/app/admin/home-components/services/_lib/colors';
import { SectionHeader } from '@/app/admin/home-components/_shared/components/SectionHeader';
import { extractSectionHeaderConfig } from '@/app/admin/home-components/_shared/hooks/useSectionHeaderState';
import type { BenefitsStyle as BenefitsSharedStyle } from '@/app/admin/home-components/benefits/_types';
import { PartnersMarqueeShared } from '@/app/admin/home-components/partners/_components/PartnersMarqueeShared';
import { PartnersBadgeShared } from '@/app/admin/home-components/partners/_components/PartnersBadgeShared';
import { PartnersCarouselShared } from '@/app/admin/home-components/partners/_components/PartnersCarouselShared';
import { PartnersCleanShared } from '@/app/admin/home-components/partners/_components/PartnersCleanShared';
import { PartnersDividerShared } from '@/app/admin/home-components/partners/_components/PartnersDividerShared';
import { PartnersGridShared } from '@/app/admin/home-components/partners/_components/PartnersGridShared';
import { PartnersLogoCloudShared } from '@/app/admin/home-components/partners/_components/PartnersLogoCloudShared';
import { normalizePartnersAlign, normalizePartnersDisplayMode, normalizePartnersStyle } from '@/app/admin/home-components/partners/_types';
import type { FooterBrandMode, FooterLogoBackgroundStyle, FooterStyle } from '@/app/admin/home-components/footer/_types';
import type { ClientsBrandMode, ClientsHeaderAlign } from '@/app/admin/home-components/clients/_types';
import type { CTAStyle } from '@/app/admin/home-components/cta/_types';
import type { BenefitItem, BenefitsBrandMode, BenefitsConfig } from '@/app/admin/home-components/benefits/_types';
import type { FaqConfig, FaqItem, FaqStyle } from '@/app/admin/home-components/faq/_types';
import * as LucideIcons from 'lucide-react';
const BlogSection = dynamic(
  () => import('./BlogSection').then((mod) => ({ default: mod.BlogSection })),
  { ssr: false, loading: () => null }
);
const ProductListSection = dynamic(
  () => import('./ProductListSection').then((mod) => ({ default: mod.ProductListSection })),
  { ssr: false, loading: () => null }
);
const ProductGridSection = dynamic(
  () => import('./ProductGridSection').then((mod) => ({ default: mod.ProductGridSection })),
  { ssr: false, loading: () => null }
);
const ServiceListSection = dynamic(
  () => import('./ServiceListSection').then((mod) => ({ default: mod.ServiceListSection })),
  { ssr: false, loading: () => null }
);
import { HomepageCategoryHeroSection } from './HomepageCategoryHeroSection';
import { getHomepageCategoryHeroColors } from '@/app/admin/home-components/homepage-category-hero/_lib/colors';
import { PricingSection as PricingSectionRuntime } from './PricingSection';
import { CareerSection as CareerSectionRuntime } from './CareerSection';
import { VoucherPromotionsSection as VoucherPromotionsSectionRuntime } from './VoucherPromotionsSection';
import { PopupSection as PopupSectionRuntime } from './PopupSection';
import { AboutSection } from './AboutSection';
import { TeamSection as TeamSectionRuntime } from './TeamSection';
import { VideoSectionShared } from '@/app/admin/home-components/video/_components/VideoSectionShared';
import { getVideoColorTokens } from '@/app/admin/home-components/video/_lib/colors';
import {
  normalizeVideoConfig,
  normalizeVideoStyle,
} from '@/app/admin/home-components/video/_lib/constants';
import type { VideoBrandMode } from '@/app/admin/home-components/video/_types';
import { ContactSection as ContactSectionRuntime } from './ContactSection';
import { CaseStudySection } from './CaseStudySection';
import { SpeedDialSection } from './SpeedDialSection';
import { CountdownSectionWrapper } from './CountdownSectionWrapper';
import type { HomepageCategoryHeroConfig } from '@/app/admin/home-components/homepage-category-hero/_types';
import { ProductImageFrameOverlay, useProductFrameConfig } from '@/components/shared/ProductImageFrameBox';
import {
  ArrowUpRight,
  ArrowRight,
  ChevronLeft, ChevronRight, Globe,
  Image as ImageIcon, LayoutTemplate, Maximize2, Package, Plus, Shield,
  X, ZoomIn
} from 'lucide-react';

type SiteImageProps = Omit<React.ComponentProps<typeof Image>, 'width' | 'height' | 'src'> & {
  src?: React.ComponentProps<typeof Image>['src'];
  width?: number | string;
  height?: number | string;
  sizes?: string;
};

const SiteImage = ({ src, alt = '', width = 1200, height = 800, sizes = '100vw', mode = 'primary', ...rest }: SiteImageProps) => {
  if (!src) {return null;}
  const normalizedWidth = typeof width === 'string' ? Number.parseInt(width, 10) || 1200 : width;
  const normalizedHeight = typeof height === 'string' ? Number.parseInt(height, 10) || 800 : height;
  const fetchPriority = rest.priority ? 'high' : rest.fetchPriority;

  return (
    <Image
      src={src}
      {...rest}
      fetchPriority={fetchPriority}
      alt={alt}
      width={normalizedWidth}
      height={normalizedHeight}
      sizes={sizes}
      mode={mode}
    />
  );
};

const useSafeId = (prefix: string) => {
  const id = React.useId();
  return `${prefix}-${id.replaceAll(':', '')}`;
};

const DEFAULT_COUNTDOWN_END_DATE = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

interface HomeComponent {
  _id: string;
  type: string;
  title: string;
  active: boolean;
  order: number;
  config: Record<string, unknown>;
}

interface ComponentRendererProps {
  component: HomeComponent;
}

export function ComponentRenderer({ component }: ComponentRendererProps) {
  const systemColors = useBrandColors();
  const isSnapshotMode = Boolean(useSnapshotDemoContext());
  const systemConfig = useQuery(api.homeComponentSystemConfig.getConfig, isSnapshotMode ? 'skip' : undefined);
  const { type, title, config } = component;
  const resolvedColors = resolveTypeOverrideColors({
    type,
    systemColors,
    overrides: systemConfig?.typeColorOverrides ?? null,
  });
  const resolvedFont = resolveTypeOverrideFont({
    type,
    overrides: systemConfig?.typeFontOverrides ?? null,
    globalOverride: systemConfig?.globalFontOverride ?? null,
  });
  const fontStyle = { '--font-active': `var(${resolvedFont.fontVariable})` } as React.CSSProperties;
  const wrapWithFont = (node: React.ReactNode) => (
    <div className="font-active" style={fontStyle}>{node}</div>
  );

  // Render component dựa vào type
  switch (type) {
    case 'Hero': {
      return wrapWithFont(
        <HeroSection config={config} brandColor={resolvedColors.primary} secondary={resolvedColors.secondary} mode={resolvedColors.mode} />
      );
    }
    case 'HomepageCategoryHero': {
      const heroTokens = getHomepageCategoryHeroColors(
        resolvedColors.primary,
        resolvedColors.secondary,
        resolvedColors.mode,
      );
      return wrapWithFont(
        <HomepageCategoryHeroSection
          config={config as unknown as HomepageCategoryHeroConfig}
          brandColor={resolvedColors.primary}
          secondary={resolvedColors.secondary}
          mode={resolvedColors.mode}
          tokens={heroTokens}
        />
      );
    }
    case 'Stats': {
      return wrapWithFont(
        <StatsSection 
          config={config} 
          brandColor={resolvedColors.primary} 
          secondary={resolvedColors.secondary} 
          mode={resolvedColors.mode} 
          title={title} 
        />
      );
    }
    case 'About': {
      return wrapWithFont(
        <AboutSection config={config} brandColor={resolvedColors.primary} secondary={resolvedColors.secondary} mode={resolvedColors.mode} title={title} />
      );
    }
    case 'Services': {
      return wrapWithFont(
        <ServicesSection config={config} brandColor={resolvedColors.primary} secondary={resolvedColors.secondary} mode={resolvedColors.mode} title={title} />
      );
    }
    case 'Benefits': {
      return wrapWithFont(
        <BenefitsSection config={config} brandColor={resolvedColors.primary} secondary={resolvedColors.secondary} mode={resolvedColors.mode} title={title} />
      );
    }
    case 'FAQ': {
      return wrapWithFont(
        <FAQSection config={config} brandColor={resolvedColors.primary} secondary={resolvedColors.secondary} mode={resolvedColors.mode} title={title} />
      );
    }
    case 'CTA': {
      return wrapWithFont(
        <CTASection config={config} brandColor={resolvedColors.primary} secondary={resolvedColors.secondary} mode={resolvedColors.mode} />
      );
    }
    case 'Testimonials': {
      return wrapWithFont(
        <TestimonialsSection config={config} brandColor={resolvedColors.primary} secondary={resolvedColors.secondary} mode={resolvedColors.mode} title={title} />
      );
    }
    case 'Contact': {
      return wrapWithFont(
        <ContactSectionRuntime config={config} brandColor={resolvedColors.primary} secondary={resolvedColors.secondary} mode={resolvedColors.mode} title={title} />
      );
    }
    case 'Gallery':
    case 'Partners': {
      return wrapWithFont(
        <GallerySection config={config} brandColor={resolvedColors.primary} secondary={resolvedColors.secondary} mode={resolvedColors.mode} title={title} type={type} />
      );
    }
    case 'TrustBadges': {
      return wrapWithFont(
        <TrustBadgesSection config={config} brandColor={resolvedColors.primary} secondary={resolvedColors.secondary} mode={resolvedColors.mode} title={title} />
      );
    }
    case 'Pricing': {
      return wrapWithFont(
        <PricingSectionRuntime config={config} brandColor={resolvedColors.primary} secondary={resolvedColors.secondary} mode={resolvedColors.mode} title={title} />
      );
    }
    case 'ProductList': {
      return wrapWithFont(
        <ProductListSection config={config} brandColor={resolvedColors.primary} secondary={resolvedColors.secondary} mode={resolvedColors.mode} title={title} />
      );
    }
    case 'ProductGrid': {
      const gridStyle = (config.style as string) || '';
      if (gridStyle === 'tabbed' || gridStyle === 'storefront') {
        return wrapWithFont(
          <ProductGridSection config={config} brandColor={resolvedColors.primary} secondary={resolvedColors.secondary} title={title} />
        );
      }
      return wrapWithFont(
        <ProductListSection config={config} brandColor={resolvedColors.primary} secondary={resolvedColors.secondary} mode={resolvedColors.mode} title={title} />
      );
    }
    case 'ServiceList': {
      return wrapWithFont(
        <ServiceListSection config={config} brandColor={resolvedColors.primary} secondary={resolvedColors.secondary} mode={resolvedColors.mode} title={title} />
      );
    }
    case 'Blog': {
      return wrapWithFont(
        <BlogSection config={config} brandColor={resolvedColors.primary} secondary={resolvedColors.secondary} mode={resolvedColors.mode} title={title} />
      );
    }
    case 'Career': {
      return wrapWithFont(
        <CareerSectionRuntime config={config} brandColor={resolvedColors.primary} secondary={resolvedColors.secondary} mode={resolvedColors.mode} title={title} />
      );
    }
    case 'CaseStudy': {
      return wrapWithFont(
        <CaseStudySection config={config} brandColor={resolvedColors.primary} secondary={resolvedColors.secondary} mode={resolvedColors.mode} title={title} />
      );
    }
    case 'SpeedDial': {
      return wrapWithFont(
        <SpeedDialSection config={config} brandColor={resolvedColors.primary} secondary={resolvedColors.secondary} mode={resolvedColors.mode} title={title} />
      );
    }
    case 'ProductCategories': {
      return wrapWithFont(
        <ProductCategoriesSection config={config} brandColor={resolvedColors.primary} secondary={resolvedColors.secondary} mode={resolvedColors.mode} title={title} />
      );
    }
    case 'CategoryProducts': {
      return wrapWithFont(
        <CategoryProductsSection
          config={config}
          brandColor={resolvedColors.primary}
          secondary={resolvedColors.secondary}
          mode={resolvedColors.mode}
          title={title}
        />
      );
    }
    case 'Team': {
      return wrapWithFont(
        <TeamSectionRuntime config={config} brandColor={resolvedColors.primary} secondary={resolvedColors.secondary} mode={resolvedColors.mode} title={title} />
      );
    }
    case 'Features': {
      return wrapWithFont(
        <FeaturesSection config={config} brandColor={resolvedColors.primary} secondary={resolvedColors.secondary} mode={resolvedColors.mode} title={title} />
      );
    }
    case 'Process': {
      return wrapWithFont(
        <ProcessSection config={config} brandColor={resolvedColors.primary} secondary={resolvedColors.secondary} mode={resolvedColors.mode} title={title} />
      );
    }
    case 'Clients': {
      return wrapWithFont(
        <ClientsSection config={config} brandColor={resolvedColors.primary} secondary={resolvedColors.secondary} mode={resolvedColors.mode} title={title} />
      );
    }
    case 'Video': {
      return wrapWithFont(
        <VideoSection config={config} brandColor={resolvedColors.primary} secondary={resolvedColors.secondary} mode={resolvedColors.mode} title={title} />
      );
    }
    case 'Countdown': {
      return wrapWithFont(
        <CountdownSectionWrapper config={config} brandColor={resolvedColors.primary} secondary={resolvedColors.secondary} title={title} />
      );
    }
    case 'VoucherPromotions': {
      return wrapWithFont(
        <VoucherPromotionsSectionRuntime config={config} brandColor={resolvedColors.primary} secondary={resolvedColors.secondary} mode={resolvedColors.mode} title={title} />
      );
    }
    case 'Popup': {
      return wrapWithFont(
        <PopupSectionRuntime config={config} brandColor={resolvedColors.primary} title={title} />
      );
    }
    case 'Marquee': {
      return wrapWithFont(
        <MarqueeSection config={config} brandColor={resolvedColors.primary} secondary={resolvedColors.secondary} mode={resolvedColors.mode} title={title} />
      );
    }
    case 'Footer': {
      return wrapWithFont(
        <FooterSection config={config} brandColor={resolvedColors.primary} secondary={resolvedColors.secondary} mode={resolvedColors.mode} />
      );
    }
    default: {
      return wrapWithFont(<PlaceholderSection type={type} title={title} />);
    }
  }
}

// ============ HERO SECTION ============
// Best Practice: Blurred Background Fill - fills letterbox gaps with blurred version of same image
// Supports 6 styles: slider, fade, bento, fullscreen, split, parallax
type HeroStyle = 'slider' | 'fade' | 'bento' | 'triple' | 'triple2' | 'fullscreen' | 'split' | 'parallax';

interface HeroContent {
  badge?: string;
  heading?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  countdownText?: string;
  showFullscreenContent?: boolean;
}

function HeroSection({
  config,
  brandColor,
  secondary,
  mode,
}: {
  config: Record<string, unknown>;
  brandColor: string;
  secondary: string;
  mode: 'single' | 'dual';
}) {
  const slides = (config.slides as { image: string; link: string }[]) || [];
  const style = (config.style as HeroStyle) || 'slider';
  const content = (config.content as HeroContent) || {};
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const touchStartX = React.useRef<number | null>(null);
  const primaryHref = content.primaryButtonLink || slides[currentSlide]?.link || '#';
  const secondaryHref = content.secondaryButtonLink || '#';
  const sliderColors = getSliderColors(brandColor, secondary, mode);
  const fadeColors = getFadeColors(brandColor, secondary, mode);
  const bentoColors = getBentoColors(brandColor, secondary, mode);
  const fullscreenColors = getFullscreenColors(brandColor, secondary, mode);
  const splitColors = getSplitColors(brandColor, secondary, mode);
  const parallaxColors = getParallaxColors(brandColor, secondary, mode);

  React.useEffect(() => {
    if (slides.length <= 1 || style === 'bento' || style === 'triple' || style === 'triple2') {return;}
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () =>{  clearInterval(timer); };
  }, [slides.length, style]);

  if (slides.length === 0) {
    return (
      <section className="relative h-[500px] bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Chào mừng đến với chúng tôi</h1>
          <p className="text-slate-300">Khám phá sản phẩm và dịch vụ tuyệt vời</p>
        </div>
      </section>
    );
  }

  // Helper: Render slide với blurred background
  const renderSlideWithBlur = (slide: { image: string; link: string }, options?: { priority?: boolean }) => (
    <a href={slide.link || '#'} className="block w-full h-full relative">
      <div className="absolute inset-0 scale-110" style={{ backgroundImage: `url(${slide.image})`, backgroundPosition: 'center', backgroundSize: 'cover', filter: 'blur(30px)' }} />
      <div className="absolute inset-0 bg-black/20" />
      <SiteImage src={slide.image} alt="" className="relative w-full h-full object-contain z-10" priority={options?.priority} sizes="100vw" />
    </a>
  );

  const renderPlaceholder = (backgroundColor: string, iconColor: string, size = 32) => (
    <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor }}>
      <ImageIcon size={size} style={{ color: iconColor }} />
    </div>
  );

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const startX = touchStartX.current;
    const endX = event.changedTouches[0]?.clientX;
    touchStartX.current = null;

    if (slides.length <= 1 || startX == null || endX == null) {
      return;
    }

    const deltaX = endX - startX;
    if (Math.abs(deltaX) < 40) {
      return;
    }

    if (deltaX < 0) {
      setCurrentSlide(prev => (prev + 1) % slides.length);
      return;
    }

    setCurrentSlide(prev => prev === 0 ? slides.length - 1 : prev - 1);
  };

  // Style 1: Slider
  if (style === 'slider') {
    return (
      <section className="relative w-full bg-slate-900 overflow-hidden">
        <div
          className="relative w-full aspect-[16/9] md:aspect-[21/9] max-h-[400px] md:max-h-[550px]"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-700 hover:ring-2 hover:ring-offset-2 hover:ring-offset-slate-900 ${idx === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              style={{ '--tw-ring-color': sliderColors.hoverRingColor } as React.CSSProperties}
            >
              {slide.image ? renderSlideWithBlur(slide, { priority: idx === 0 }) : renderPlaceholder(sliderColors.placeholderBg, sliderColors.placeholderIconColor)}
            </div>
          ))}
          {slides.length > 1 && (
            <>
              <button onClick={() =>{  setCurrentSlide(prev => prev === 0 ? slides.length - 1 : prev - 1); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full shadow-lg hidden md:flex items-center justify-center transition-all z-20 border-2" style={{ backgroundColor: sliderColors.navButtonBg, borderColor: sliderColors.navButtonBorderColor, boxShadow: `0 0 0 2px ${sliderColors.navButtonOuterRing}` }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: sliderColors.navButtonIconColor }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button onClick={() =>{  setCurrentSlide(prev => (prev + 1) % slides.length); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full shadow-lg hidden md:flex items-center justify-center transition-all z-20 border-2" style={{ backgroundColor: sliderColors.navButtonBgHover, borderColor: sliderColors.navButtonBorderColor, boxShadow: `0 0 0 2px ${sliderColors.navButtonOuterRing}` }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: sliderColors.navButtonIconColor }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {slides.map((_, idx) => (
                  <button key={idx} onClick={() =>{  setCurrentSlide(idx); }} className={`w-3 h-3 rounded-full transition-all ${idx === currentSlide ? 'w-8' : ''}`} style={{ backgroundColor: idx === currentSlide ? sliderColors.dotActive : sliderColors.dotInactive }} />
                ))}
              </div>
              <div className="absolute bottom-2 left-0 right-0 h-0.5 z-20" style={{ backgroundColor: sliderColors.progressBarInactive }}>
                <div
                  className="h-full transition-all duration-700"
                  style={{
                    backgroundColor: sliderColors.progressBarActive,
                    width: `${((currentSlide + 1) / slides.length) * 100}%`,
                  }}
                />
              </div>
            </>
          )}
        </div>
      </section>
    );
  }

  // Style 2: Fade with Thumbnails
  if (style === 'fade') {
    return (
      <section className="relative w-full bg-slate-900 overflow-hidden">
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] max-h-[450px] md:max-h-[600px]">
          {slides.map((slide, idx) => (
            <div key={idx} className={`absolute inset-0 transition-opacity duration-700 ${idx === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              {slide.image ? renderSlideWithBlur(slide, { priority: idx === 0 }) : renderPlaceholder(fadeColors.placeholderBg, fadeColors.placeholderIconColor)}
            </div>
          ))}
          {slides.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-center gap-2 bg-gradient-to-t from-black/60 to-transparent z-20">
              {slides.map((slide, idx) => (
                <button key={idx} onClick={() =>{  setCurrentSlide(idx); }} className={`rounded overflow-hidden transition-all border-2 w-16 h-10 md:w-20 md:h-12 ${idx === currentSlide ? 'scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`} style={idx === currentSlide ? { borderColor: fadeColors.thumbnailBorderActive } : { borderColor: fadeColors.thumbnailBorderInactive }}>
                  {slide.image ? <SiteImage src={slide.image} alt="" className="w-full h-full object-cover" /> : renderPlaceholder(fadeColors.placeholderBg, fadeColors.placeholderIconColor, 18)}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  // Style 3: Bento Grid
  if (style === 'bento') {
    const bentoSlides = slides.slice(0, 4);
    const bentoPlaceholders = ['#f1f5f9', '#e2e8f0', '#f1f5f9', '#e2e8f0'];
    return (
      <section className="relative w-full bg-slate-900 overflow-hidden p-2 md:p-4">
        <div className="max-h-[400px] md:max-h-[550px]">
          {/* Mobile: 2x2 grid */}
          <div className="grid grid-cols-2 gap-2 md:hidden" style={{ height: '320px' }}>
            {bentoSlides.slice(0, 4).map((slide, idx) => (
              <a key={idx} href={slide.link || '#'} className="relative rounded-xl overflow-hidden">
                {slide.image ? (
                  <div className="w-full h-full relative">
                    <div className="absolute inset-0 scale-110" style={{ backgroundImage: `url(${slide.image})`, backgroundPosition: 'center', backgroundSize: 'cover', filter: 'blur(20px)' }} />
                    <div className="absolute inset-0 bg-black/20" />
                    <SiteImage src={slide.image} alt="" className="relative w-full h-full object-contain z-10" priority={idx === 0} sizes="50vw" />
                  </div>
                ) : (
                  renderPlaceholder(bentoPlaceholders[idx] ?? bentoColors.gridTint1, bentoColors.placeholderIcon, 20)
                )}
              </a>
            ))}
          </div>
          {/* Desktop: Bento layout */}
          <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-3" style={{ height: '500px' }}>
            <a href={bentoSlides[0]?.link || '#'} className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden ring-2 ring-offset-1 ring-offset-slate-900" style={{ '--tw-ring-color': bentoColors.mainImageRing } as React.CSSProperties}>
              {bentoSlides[0]?.image ? (
                <div className="w-full h-full relative">
                  <div className="absolute inset-0 scale-110" style={{ backgroundImage: `url(${bentoSlides[0].image})`, backgroundPosition: 'center', backgroundSize: 'cover', filter: 'blur(25px)' }} />
                  <div className="absolute inset-0 bg-black/20" />
                  <SiteImage src={bentoSlides[0].image} alt="" className="relative w-full h-full object-contain z-10" priority sizes="50vw" />
                </div>
              ) : renderPlaceholder(bentoPlaceholders[0], bentoColors.placeholderIcon, 24)}
            </a>
            <a href={bentoSlides[1]?.link || '#'} className="col-span-2 relative rounded-2xl overflow-hidden">
              {bentoSlides[1]?.image ? (
                <div className="w-full h-full relative">
                  <div className="absolute inset-0 scale-110" style={{ backgroundImage: `url(${bentoSlides[1].image})`, backgroundPosition: 'center', backgroundSize: 'cover', filter: 'blur(20px)' }} />
                  <div className="absolute inset-0 bg-black/20" />
                  <SiteImage src={bentoSlides[1].image} alt="" className="relative w-full h-full object-contain z-10" sizes="25vw" />
                </div>
              ) : renderPlaceholder(bentoPlaceholders[1], bentoColors.placeholderIcon, 22)}
            </a>
            <a href={bentoSlides[2]?.link || '#'} className="relative rounded-2xl overflow-hidden">
              {bentoSlides[2]?.image ? (
                <div className="w-full h-full relative">
                  <div className="absolute inset-0 scale-110" style={{ backgroundImage: `url(${bentoSlides[2].image})`, backgroundPosition: 'center', backgroundSize: 'cover', filter: 'blur(15px)' }} />
                  <div className="absolute inset-0 bg-black/20" />
                  <SiteImage src={bentoSlides[2].image} alt="" className="relative w-full h-full object-contain z-10" sizes="25vw" />
                </div>
              ) : renderPlaceholder(bentoPlaceholders[2], bentoColors.placeholderIcon, 20)}
            </a>
            <a href={bentoSlides[3]?.link || '#'} className="relative rounded-2xl overflow-hidden">
              {bentoSlides[3]?.image ? (
                <div className="w-full h-full relative">
                  <div className="absolute inset-0 scale-110" style={{ backgroundImage: `url(${bentoSlides[3].image})`, backgroundPosition: 'center', backgroundSize: 'cover', filter: 'blur(15px)' }} />
                  <div className="absolute inset-0 bg-black/20" />
                  <SiteImage src={bentoSlides[3].image} alt="" className="relative w-full h-full object-contain z-10" sizes="25vw" />
                </div>
              ) : renderPlaceholder(bentoPlaceholders[3], bentoColors.placeholderIcon, 20)}
            </a>
          </div>
        </div>
      </section>
    );
  }

  // Style: Triple - 3 ảnh 16:9 ngang bằng nhau
  if (style === 'triple') {
    const tripleSlides = slides.slice(0, 3);
    const triplePlaceholders = ['#f1f5f9', '#e2e8f0', '#f1f5f9'];
    return (
      <section className="relative w-full bg-slate-900 overflow-hidden p-2 md:p-4">
        <div className="max-h-[400px] md:max-h-[550px]">
          <div className="flex flex-col gap-2 md:hidden" style={{ height: '420px' }}>
            {tripleSlides.slice(0, 3).map((slide, idx) => (
              <a key={idx} href={slide.link || '#'} className="relative rounded-xl overflow-hidden flex-1">
                {slide.image ? (
                  <div className="w-full h-full relative">
                    <div className="absolute inset-0 scale-110" style={{ backgroundImage: `url(${slide.image})`, backgroundPosition: 'center', backgroundSize: 'cover', filter: 'blur(20px)' }} />
                    <div className="absolute inset-0 bg-black/20" />
                    <SiteImage src={slide.image} alt="" className="relative w-full h-full object-contain z-10" priority={idx === 0} sizes="100vw" />
                  </div>
                ) : (
                  renderPlaceholder(triplePlaceholders[idx] ?? bentoColors.gridTint1, bentoColors.placeholderIcon, 20)
                )}
              </a>
            ))}
          </div>
          <div className="hidden md:grid grid-cols-3 gap-3" style={{ height: '500px' }}>
            {tripleSlides.map((slide, idx) => (
              <a key={idx} href={slide.link || '#'} className={`relative rounded-2xl overflow-hidden ${idx === 0 ? 'ring-2 ring-offset-1 ring-offset-slate-900' : ''}`} style={idx === 0 ? { '--tw-ring-color': bentoColors.mainImageRing } as React.CSSProperties : undefined}>
                {slide.image ? (
                  <div className="w-full h-full relative">
                    <div className="absolute inset-0 scale-110" style={{ backgroundImage: `url(${slide.image})`, backgroundPosition: 'center', backgroundSize: 'cover', filter: `blur(${25 - idx * 5}px)` }} />
                    <div className="absolute inset-0 bg-black/20" />
                    <SiteImage src={slide.image} alt="" className="relative w-full h-full object-contain z-10" priority={idx === 0} sizes="33vw" />
                  </div>
                ) : renderPlaceholder(triplePlaceholders[idx] ?? bentoColors.gridTint1, bentoColors.placeholderIcon, idx === 0 ? 24 : 20)}
              </a>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Style: Triple 2 - Ảnh chính 2/3, 2 ảnh phụ xếp dọc 1/3
  if (style === 'triple2') {
    const tripleSlides = slides.slice(0, 3);
    const triplePlaceholders = ['#f1f5f9', '#e2e8f0', '#f1f5f9'];
    return (
      <section className="relative w-full bg-slate-900 overflow-hidden p-2 md:p-4">
        <div className="max-h-[400px] md:max-h-[550px]">
          <div className="flex flex-col gap-2 md:hidden" style={{ height: '420px' }}>
            {tripleSlides.slice(0, 3).map((slide, idx) => (
              <a key={idx} href={slide.link || '#'} className="relative rounded-xl overflow-hidden flex-1">
                {slide.image ? (
                  <div className="w-full h-full relative">
                    <div className="absolute inset-0 scale-110" style={{ backgroundImage: `url(${slide.image})`, backgroundPosition: 'center', backgroundSize: 'cover', filter: 'blur(20px)' }} />
                    <div className="absolute inset-0 bg-black/20" />
                    <SiteImage src={slide.image} alt="" className="relative w-full h-full object-contain z-10" priority={idx === 0} sizes="100vw" />
                  </div>
                ) : (
                  renderPlaceholder(triplePlaceholders[idx] ?? bentoColors.gridTint1, bentoColors.placeholderIcon, 20)
                )}
              </a>
            ))}
          </div>
          <div className="hidden md:grid grid-cols-3 grid-rows-2 gap-3" style={{ height: '500px' }}>
            <a href={tripleSlides[0]?.link || '#'} className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden ring-2 ring-offset-1 ring-offset-slate-900" style={{ '--tw-ring-color': bentoColors.mainImageRing } as React.CSSProperties}>
              {tripleSlides[0]?.image ? (
                <div className="w-full h-full relative">
                  <div className="absolute inset-0 scale-110" style={{ backgroundImage: `url(${tripleSlides[0].image})`, backgroundPosition: 'center', backgroundSize: 'cover', filter: 'blur(25px)' }} />
                  <div className="absolute inset-0 bg-black/20" />
                  <SiteImage src={tripleSlides[0].image} alt="" className="relative w-full h-full object-contain z-10" priority sizes="66vw" />
                </div>
              ) : renderPlaceholder(triplePlaceholders[0], bentoColors.placeholderIcon, 24)}
            </a>
            {tripleSlides.slice(1, 3).map((slide, idx) => (
              <a key={idx} href={slide.link || '#'} className="relative rounded-2xl overflow-hidden">
                {slide.image ? (
                  <div className="w-full h-full relative">
                    <div className="absolute inset-0 scale-110" style={{ backgroundImage: `url(${slide.image})`, backgroundPosition: 'center', backgroundSize: 'cover', filter: `blur(${20 - idx * 5}px)` }} />
                    <div className="absolute inset-0 bg-black/20" />
                    <SiteImage src={slide.image} alt="" className="relative w-full h-full object-contain z-10" sizes="33vw" />
                  </div>
                ) : renderPlaceholder(triplePlaceholders[idx + 1] ?? bentoColors.gridTint1, bentoColors.placeholderIcon, 20)}
              </a>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const renderHeroSlideContain = (
    slide: { image?: string },
    options?: { overlay?: React.ReactNode; blur?: number; fit?: 'contain' | 'cover'; priority?: boolean }
  ) => (
    <div className="w-full h-full relative">
      <div
        className="absolute inset-0 scale-110"
        style={{
          backgroundImage: `url(${slide.image})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          filter: `blur(${options?.blur ?? 25}px)`,
        }}
      />
      <SiteImage
        src={slide.image ?? ''}
        alt=""
        className={cn(
          'relative w-full h-full z-10',
          options?.fit === 'cover' ? 'object-cover' : 'object-contain'
        )}
        priority={options?.priority}
        sizes="100vw"
      />
      {options?.overlay}
    </div>
  );

  // Style 4: Fullscreen - Hero toàn màn hình với CTA overlay
  if (style === 'fullscreen') {
    const showFullscreenContent = content.showFullscreenContent !== false;
    return (
      <section className="relative w-full bg-slate-900 overflow-hidden">
        <div className="relative w-full h-[400px] md:h-[550px] lg:h-[650px]">
          {slides.map((slide, idx) => (
            <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              {slide.image ? (
                renderHeroSlideContain(slide, {
                  fit: 'cover',
                  priority: idx === 0,
                  overlay: showFullscreenContent ? (
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-20" />
                  ) : null,
                })
              ) : renderPlaceholder(fullscreenColors.placeholderBg, fullscreenColors.placeholderIcon)}
            </div>
          ))}
          {/* CTA Overlay Content */}
          {showFullscreenContent && (
            <div className="absolute inset-0 z-30 flex flex-col justify-center px-4 md:px-8 lg:px-16">
              <div className="max-w-xl space-y-4 md:space-y-6">
                {content.badge && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: fullscreenColors.badgeBg, color: fullscreenColors.badgeText }}>
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: fullscreenColors.badgeDotPulse }} />
                    {content.badge}
                  </div>
                )}
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  {content.heading ?? 'Tiêu đề chính'}
                </h1>
                {content.description && (
                  <p className="text-white/80 text-sm md:text-lg">
                    {content.description}
                  </p>
                )}
                <div className="flex flex-col sm:flex-row gap-3">
                  {content.primaryButtonText && (
                    <a href={primaryHref} className="px-6 py-3 font-medium rounded-lg text-center" style={{ backgroundColor: fullscreenColors.primaryCTA, color: fullscreenColors.primaryCTAText }}>
                      {content.primaryButtonText}
                    </a>
                  )}
                  {content.secondaryButtonText && (
                    <a href={secondaryHref} className="px-6 py-3 font-medium rounded-lg border border-white/30 text-white hover:bg-white/10 transition-colors text-center">
                      {content.secondaryButtonText}
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* Navigation dots */}
          {slides.length > 1 && (
            <div className="absolute bottom-6 right-6 flex gap-2 z-40">
              {slides.map((_, idx) => (
                <button key={idx} onClick={() =>{  setCurrentSlide(idx); }} className={`w-3 h-3 rounded-full transition-all ${idx === currentSlide ? 'w-8' : ''}`} style={{ backgroundColor: idx === currentSlide ? fullscreenColors.dotActive : fullscreenColors.dotInactive }} />
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  // Style 5: Split - Layout chia đôi (Content + Image)
  if (style === 'split') {
    return (
      <section className="relative w-full bg-white overflow-hidden">
        <div className="flex flex-col md:flex-row md:h-[450px] lg:h-[550px]">
          {/* Content Side */}
          <div className="w-full md:w-1/2 flex flex-col justify-center bg-slate-50 p-6 md:p-10 lg:p-16 order-2 md:order-1">
            <div className="max-w-md space-y-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide" style={{ backgroundColor: splitColors.badgeBg, color: splitColors.badgeText }}>
                {content.badge ?? `Banner ${currentSlide + 1}/${slides.length}`}
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
                {content.heading ?? 'Tiêu đề nổi bật'}
              </h2>
              {content.description && (
                <p className="text-slate-600 text-base md:text-lg">
                  {content.description}
                </p>
              )}
              {content.primaryButtonText && (
                <div className="pt-2">
                  <a href={primaryHref} className="inline-block px-6 py-3 font-medium rounded-lg" style={{ backgroundColor: splitColors.primaryCTA, color: splitColors.primaryCTAText }}>
                    {content.primaryButtonText}
                  </a>
                </div>
              )}
            </div>
            {/* Slide indicators */}
            {slides.length > 1 && (
              <div className="flex gap-2 mt-8">
                {slides.map((_, idx) => (
                  <button key={idx} onClick={() =>{  setCurrentSlide(idx); }} className={`h-1.5 rounded-full transition-all ${idx === currentSlide ? 'w-10' : 'w-6'}`} style={{ backgroundColor: idx === currentSlide ? splitColors.progressDotActive : splitColors.progressDotInactive }} />
                ))}
              </div>
            )}
          </div>
          {/* Image Side */}
          <div className="w-full md:w-1/2 h-[280px] md:h-full relative overflow-hidden order-1 md:order-2">
            {slides.map((slide, idx) => (
              <div key={idx} className={`absolute inset-0 transition-all duration-700 ${idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'}`}>
                {slide.image ? (
                  <SiteImage src={slide.image} alt="" className="w-full h-full object-cover" priority={idx === 0} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-200">
                    <LayoutTemplate size={48} className="text-slate-400" />
                  </div>
                )}
              </div>
            ))}
            {/* Navigation arrows */}
            {slides.length > 1 && (
              <>
                <button onClick={() =>{  setCurrentSlide(prev => prev === 0 ? slides.length - 1 : prev - 1); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full shadow-lg flex items-center justify-center z-10" style={{ backgroundColor: splitColors.navButtonBg, boxShadow: `0 0 0 2px ${splitColors.navButtonOuterRing}` }}>
                  <svg className="w-5 h-5" style={{ color: splitColors.navButtonIcon }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button onClick={() =>{  setCurrentSlide(prev => (prev + 1) % slides.length); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full shadow-lg flex items-center justify-center z-10" style={{ backgroundColor: splitColors.navButtonBg, boxShadow: `0 0 0 2px ${splitColors.navButtonOuterRing}` }}>
                  <svg className="w-5 h-5" style={{ color: splitColors.navButtonIcon }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Style 6: Parallax - Hiệu ứng layer với floating card
  if (style === 'parallax') {
    return (
      <section className="relative w-full bg-slate-900 overflow-hidden">
        <div className="relative w-full h-[350px] md:h-[450px] lg:h-[550px]">
          {slides.map((slide, idx) => (
            <div key={idx} className={`absolute inset-0 transition-opacity duration-700 ${idx === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              {slide.image ? (
                renderHeroSlideContain(slide, {
                  priority: idx === 0,
                  overlay: (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 z-20" />
                  ),
                })
              ) : renderPlaceholder(parallaxColors.placeholderBg, parallaxColors.placeholderIcon)}
            </div>
          ))}
          {/* Floating content card */}
          <div className="absolute z-10 inset-x-4 md:inset-x-8 bottom-4 md:bottom-8 flex items-end">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-4 md:p-6 max-w-lg">
              {content.badge && (
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: parallaxColors.cardBadgeDot }} />
                  <span className="text-xs font-semibold uppercase tracking-wide px-2.5 py-0.5 rounded-full" style={{ backgroundColor: parallaxColors.cardBadgeBg, color: parallaxColors.cardBadgeText }}>{content.badge}</span>
                </div>
              )}
              <h3 className="text-lg md:text-xl font-bold text-slate-900">
                {content.heading ?? 'Tiêu đề nổi bật'}
              </h3>
              {content.description && (
                <p className="text-slate-600 text-sm mt-1">
                  {content.description}
                </p>
              )}
              <div className="flex items-center gap-3 mt-4">
                {content.primaryButtonText && (
                  <a href={primaryHref} className="px-5 py-2 font-medium rounded-lg text-sm" style={{ backgroundColor: parallaxColors.primaryCTA, color: parallaxColors.primaryCTAText }}>
                    {content.primaryButtonText}
                  </a>
                )}
                {content.countdownText && (
                  <span className="text-slate-500 text-sm">{content.countdownText}</span>
                )}
              </div>
            </div>
          </div>
          {/* Top navigation bar */}
          {slides.length > 1 && (
            <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
              <button onClick={() =>{  setCurrentSlide(prev => prev === 0 ? slides.length - 1 : prev - 1); }} className="w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors" style={{ backgroundColor: parallaxColors.navButtonBg, boxShadow: `0 0 0 2px ${parallaxColors.navButtonOuterRing}` }}>
                <svg className="w-4 h-4" style={{ color: parallaxColors.navButtonIcon }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <span className="text-white/80 text-xs font-medium px-2">{currentSlide + 1} / {slides.length}</span>
              <button onClick={() =>{  setCurrentSlide(prev => (prev + 1) % slides.length); }} className="w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors" style={{ backgroundColor: parallaxColors.navButtonBg, boxShadow: `0 0 0 2px ${parallaxColors.navButtonOuterRing}` }}>
                <svg className="w-4 h-4" style={{ color: parallaxColors.navButtonIcon }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          )}
        </div>
      </section>
    );
  }

  return null;
}

// ============ STATS SECTION ============
// Professional Stats UI/UX - 6 Variants
type StatsStyle = 'horizontal' | 'cards' | 'icons' | 'gradient' | 'minimal' | 'counter';

interface StatsItemWithIcon {
  value: string;
  label: string;
  iconType?: 'lucide' | 'url' | 'upload';
  iconName?: string;
  iconUrl?: string;
}

const resolveStatsIconComponent = (iconName?: string) => {
  if (!iconName) {return null;}
  const iconMap = LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>>;
  return iconMap[iconName] ?? null;
};

function StatsSection({ config, brandColor, secondary, mode, title: _title }: { config: Record<string, unknown>; brandColor: string;
  secondary: string; mode: 'single' | 'dual'; title: string }) {
  void _title;
  const items = (config.items as StatsItemWithIcon[]) || [];
  const style = (config.style as StatsStyle) || 'horizontal';
  const mediaPlacement = (config.mediaPlacement as 'top' | 'left') || 'top';
  const mediaAlign = (config.mediaAlign as 'left' | 'center' | 'right') || 'center';

  // Debug log
  console.log('StatsSection config:', { mediaPlacement, mediaAlign, style, configKeys: Object.keys(config) });

  // Helper for left placement
  const getItemContainerClass = (placement?: 'top' | 'left', align?: 'left' | 'center' | 'right') => {
    if (placement === 'left') {
      return 'flex items-center gap-3 text-left';
    }
    const alignClass = align === 'left' ? 'items-start text-left' : align === 'right' ? 'items-end text-right' : 'items-center text-center';
    return `flex flex-col ${alignClass}`;
  };

  // Style 1: Thanh ngang - Full width bar với dividers
  if (style === 'horizontal') {
    const colors = getHorizontalColors(brandColor, secondary, mode);
    return (
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div 
            className="w-full rounded-lg shadow-sm overflow-hidden border"
            style={{ backgroundColor: 'white', borderColor: colors.border }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between divide-y md:divide-y-0 md:divide-x divide-slate-200">
              {items.map((item, idx) => {
                const IconCmp = item.iconType === 'lucide' && item.iconName ? resolveStatsIconComponent(item.iconName) : null;
                const iconElement = item.iconType === 'lucide' && IconCmp ? (
                  <IconCmp size={32} style={{ color: brandColor }} />
                ) : item.iconType === 'upload' && item.iconUrl ? (
                  <img src={item.iconUrl} alt="" className="w-8 h-8 md:w-11 md:h-11 object-contain" />
                ) : item.iconType === 'url' && item.iconUrl ? (
                  <img src={item.iconUrl} alt="" className="w-8 h-8 object-contain" />
                ) : null;

                return (
                <div 
                  key={idx} 
                  className={`flex-1 w-full py-6 px-4 justify-center cursor-default ${getItemContainerClass(mediaPlacement, mediaAlign)}`}
                >
                  {iconElement && (
                    <div className={mediaPlacement === 'left' ? 'mb-0 flex shrink-0 items-center justify-center self-center' : 'mb-2'}>
                      {iconElement}
                    </div>
                  )}
                  <div className={mediaPlacement === 'left' ? 'flex-1' : ''}>
                    <span className="text-3xl md:text-4xl font-bold tracking-tight tabular-nums leading-none mb-1" style={{ color: brandColor }}>
                      {item.value}
                    </span>
                    <h3 className="text-xs font-medium uppercase tracking-wider text-slate-600">
                      {item.label}
                    </h3>
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Style 2: Cards - Grid cards với hover effects và accent line
  if (style === 'cards') {
    const colors = getCardsColors(brandColor, secondary, mode);
    return (
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map((item, idx) => {
              const IconCmp = item.iconType === 'lucide' && item.iconName ? resolveStatsIconComponent(item.iconName) : null;
              const iconElement = item.iconType === 'lucide' && IconCmp ? (
                <IconCmp size={28} style={{ color: brandColor }} />
              ) : item.iconType === 'upload' && item.iconUrl ? (
                <img src={item.iconUrl} alt="" className="w-12 h-12 md:w-16 md:h-16 object-cover" />
              ) : item.iconType === 'url' && item.iconUrl ? (
                <img src={item.iconUrl} alt="" className="w-7 h-7 object-contain" />
              ) : null;

              return (
              <div 
                key={idx}
                className={`bg-white border rounded-xl p-5 shadow-sm ${getItemContainerClass(mediaPlacement, mediaAlign)}`}
                style={{ borderColor: colors.border }}
              >
                {iconElement && (
                  <div className={mediaPlacement === 'left' ? 'mb-0 flex shrink-0 items-center justify-center self-center' : 'mb-2'}>
                    {iconElement}
                  </div>
                )}
                <div className={mediaPlacement === 'left' ? 'flex-1' : ''}>
                  <span 
                    className="text-3xl font-bold mb-1 tracking-tight tabular-nums"
                    style={{ color: brandColor }}
                  >
                    {item.value}
                  </span>
                  <h3 className="text-sm font-semibold text-slate-700">
                    {item.label}
                  </h3>
                  {mediaPlacement !== 'left' && (
                    <div 
                      className="w-8 h-0.5 rounded-full mt-3"
                      style={{ backgroundColor: colors.accent }}
                    />
                  )}
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // Style 3: Icon Grid - Circle containers với shadow và hover scale
  if (style === 'icons') {
    const colors = getIconsColors(brandColor, secondary, mode);
    return (
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {items.map((item, idx) => {
              const IconCmp = item.iconType === 'lucide' && item.iconName ? resolveStatsIconComponent(item.iconName) : null;
              const hasIcon = item.iconType === 'lucide' || item.iconType === 'url' || item.iconType === 'upload';
              
              const circleElement = (
                <div
                  className={`relative w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center border shadow-sm shrink-0 ${mediaPlacement === 'left' ? 'mb-0' : 'mb-3'}`}
                  style={{
                    backgroundColor: colors.circleBg,
                    borderColor: colors.ring,
                  }}
                >
                  {item.iconType === 'lucide' && IconCmp ? (
                    <IconCmp size={40} style={{ color: colors.textOnCircle }} />
                  ) : item.iconType === 'upload' && item.iconUrl ? (
                    <img src={item.iconUrl} alt="" className="w-11 h-11 md:w-14 md:h-14 object-contain" />
                  ) : item.iconType === 'url' && item.iconUrl ? (
                    <img src={item.iconUrl} alt="" className="w-10 h-10 object-contain" />
                  ) : (
                    <span className="text-2xl md:text-3xl font-bold tracking-tight z-10 tabular-nums" style={{ color: colors.textOnCircle }}>
                      {item.value}
                    </span>
                  )}
                </div>
              );

              return (
              <div key={idx} className={getItemContainerClass(mediaPlacement, mediaAlign)}>
                {circleElement}
                <div className={mediaPlacement === 'left' ? 'flex-1' : ''}>
                  <h3 className="text-base font-semibold text-slate-800" style={{ color: colors.label }}>
                    {item.label}
                  </h3>
                  {hasIcon && (
                    <span className="text-xl font-bold tabular-nums mt-1" style={{ color: brandColor }}>
                      {item.value}
                    </span>
                  )}
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // Style 4: Gradient - Glass morphism với gradient background
  if (style === 'gradient') {
    const colors = getGradientColors(brandColor, secondary, mode);
    return (
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div 
            className="rounded-2xl overflow-hidden border"
            style={{ 
              background: colors.background,
              borderColor: colors.border
            }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4">
              {items.map((item, idx) => {
                const IconCmp = item.iconType === 'lucide' && item.iconName ? resolveStatsIconComponent(item.iconName) : null;
                const iconElement = item.iconType === 'lucide' && IconCmp ? (
                  <IconCmp size={36} style={{ color: colors.text }} />
                ) : item.iconType === 'upload' && item.iconUrl ? (
                  <img src={item.iconUrl} alt="" className="w-10 h-10 md:w-12 md:h-12 object-cover" />
                ) : item.iconType === 'url' && item.iconUrl ? (
                  <img src={item.iconUrl} alt="" className="w-9 h-9 object-contain" />
                ) : null;

                return (
                <div 
                  key={idx}
                  className={`relative justify-center p-6 md:p-8 ${getItemContainerClass(mediaPlacement, mediaAlign)} ${
                    idx !== items.length - 1 ? 'md:border-r md:border-white/10' : ''
                  }`}
                >
                  {iconElement && (
                    <div className={mediaPlacement === 'left' ? 'mb-0 flex shrink-0 items-center justify-center self-center' : 'mb-2'}>
                      {iconElement}
                    </div>
                  )}
                  <div className={mediaPlacement === 'left' ? 'flex-1' : ''}>
                    <span className="text-4xl md:text-5xl font-extrabold tracking-tight tabular-nums leading-none mb-2" style={{ color: colors.text }}>
                      {item.value}
                    </span>
                    <h3 className="text-sm font-medium opacity-90 relative z-10" style={{ color: colors.label }}>
                      {item.label}
                    </h3>
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Style 5: Minimal - Clean, simple với typography focus
  if (style === 'minimal') {
    const colors = getMinimalColors(brandColor, secondary, mode);
    return (
      <section className="py-12 md:py-16 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {items.map((item, idx) => {
              const IconCmp = item.iconType === 'lucide' && item.iconName ? resolveStatsIconComponent(item.iconName) : null;
              const iconElement = item.iconType === 'lucide' && IconCmp ? (
                <IconCmp size={32} style={{ color: colors.value }} />
              ) : item.iconType === 'upload' && item.iconUrl ? (
                <img src={item.iconUrl} alt="" className="w-9 h-9 md:w-12 md:h-12 object-cover" />
              ) : item.iconType === 'url' && item.iconUrl ? (
                <img src={item.iconUrl} alt="" className="w-8 h-8 object-contain" />
              ) : null;

              return (
              <div key={idx} className={getItemContainerClass(mediaPlacement, mediaAlign)}>
                {iconElement && (
                  <div className={mediaPlacement === 'left' ? 'mb-0 flex shrink-0 items-center justify-center self-center' : 'mb-2'}>
                    {iconElement}
                  </div>
                )}
                <div className={mediaPlacement === 'left' ? 'flex-1' : ''}>
                  {mediaPlacement !== 'left' && (
                    <div 
                      className="w-12 h-1 rounded-full mb-4"
                      style={{ backgroundColor: colors.accent }}
                    />
                  )}
                  <span className="text-4xl md:text-5xl font-bold tracking-tight tabular-nums leading-none" style={{ color: colors.value }}>
                    {item.value}
                  </span>
                  <h3 className="text-base font-medium text-slate-500 mt-2">
                    {item.label}
                  </h3>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // Style 6: Counter - Big numbers với animated feel & progress indicator
  const colors = getCounterColors(brandColor, secondary, mode);
  return (
    <section className="py-12 md:py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {items.map((item, idx) => {
            const IconCmp = item.iconType === 'lucide' && item.iconName ? resolveStatsIconComponent(item.iconName) : null;
            const iconElement = item.iconType === 'lucide' && IconCmp ? (
              <IconCmp size={36} style={{ color: colors.value }} />
            ) : item.iconType === 'upload' && item.iconUrl ? (
              <img src={item.iconUrl} alt="" className="w-9 h-9 md:w-12 md:h-12 object-cover" />
            ) : item.iconType === 'url' && item.iconUrl ? (
              <img src={item.iconUrl} alt="" className="w-9 h-9 object-contain" />
            ) : null;

            return (
            <div 
              key={idx}
              className="relative bg-white rounded-2xl border overflow-hidden shadow-sm"
              style={{ borderColor: colors.border }}
            >
              <div className="h-1 w-full bg-slate-100">
                <div 
                  className="h-full transition-all duration-500"
                  style={{ 
                    backgroundColor: colors.progress,
                    width: `${Math.min(100, (idx + 1) * 25)}%`
                  }}
                />
              </div>
              
              <div className={`justify-center p-6 ${getItemContainerClass(mediaPlacement, mediaAlign)}`}>
                {iconElement && (
                  <div className={mediaPlacement === 'left' ? 'mb-0 flex shrink-0 items-center justify-center self-center' : 'mb-2'}>
                    {iconElement}
                  </div>
                )}
                <div className={mediaPlacement === 'left' ? 'flex-1' : ''}>
                  <span 
                    className="text-5xl md:text-6xl font-black tracking-tighter tabular-nums leading-none"
                    style={{ color: colors.value }}
                  >
                    {item.value}
                  </span>
                  <h3 className="text-sm font-semibold text-slate-600 mt-2">
                    {item.label}
                  </h3>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============ SERVICES SECTION ============
function ServicesSection({
  config,
  brandColor,
  secondary,
  mode,
  title,
}: {
  config: Record<string, unknown>;
  brandColor: string;
  secondary: string;
  mode: 'single' | 'dual';
  title: string;
}) {
  const items = (config.items as ServiceItem[]) || [];
  const style = (config.style as ServicesStyle) || 'elegantGrid';
  const desktopColumns = getServicesDesktopColumns(config.desktopColumns);
  const mediaPlacement = getServicesMediaPlacement(config.mediaPlacement);
  const mediaAlign = getServicesMediaAlign(config.mediaAlign);
  const colors = getServicesColors(brandColor, secondary, mode);

  // Extract header config
  const headerConfig = extractSectionHeaderConfig(config);

  return (
    <section className="py-8 px-3">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          title={title}
          subtitle={headerConfig.subtitle}
          badgeText={headerConfig.badgeText}
          hideHeader={headerConfig.hideHeader}
          showTitle={headerConfig.showTitle}
          showSubtitle={headerConfig.showSubtitle}
          showBadge={headerConfig.showBadge}
          headerAlign={headerConfig.headerAlign}
          titleColorPrimary={headerConfig.titleColorPrimary}
          subtitleAboveTitle={headerConfig.subtitleAboveTitle}
          uppercaseText={headerConfig.uppercaseText}
          brandColor={brandColor}
        />
        <ServicesSectionCore
          items={items}
          style={style}
          headerAlign={'left' as ServiceItemMediaAlign}
          desktopColumns={desktopColumns}
          mediaPlacement={mediaPlacement as ServiceItemMediaPlacement}
          mediaAlign={mediaAlign as ServiceItemMediaAlign}
          subtitle={''}
          showTitle={false}
          showSubtitle={false}
          title={''}
          colors={colors}
          isPreview={false}
        />
      </div>
    </section>
  );
}

// ============ BENEFITS SECTION ============
function BenefitsSection({
  config,
  brandColor,
  secondary,
  mode,
  title,
}: {
  config: Record<string, unknown>;
  brandColor: string;
  secondary: string;
  mode: 'single' | 'dual';
  title: string;
}) {
  const benefitsConfig = config as {
    items?: Array<{ icon?: string; title?: string; description?: string }>;
    style?: BenefitsSharedStyle;
    subHeading?: string;
    heading?: string;
    headerAlign?: 'left' | 'center' | 'right';
    gridColumnsDesktop?: 3 | 4;
    gridColumnsMobile?: 1 | 2;
    buttonText?: string;
    buttonLink?: string;
    visualImage?: string;
    highlightIndex?: number;
    showItemNumbers?: boolean;
    showDecorativeVisuals?: boolean;
    harmony?: unknown;
    hideHeader?: boolean;
    showTitle?: boolean;
    showSubtitle?: boolean;
    showBadge?: boolean;
    titleColorPrimary?: boolean;
    subtitleAboveTitle?: boolean;
    uppercaseText?: boolean;
    subtitle?: string;
    badgeText?: string;
  };

  const items: BenefitItem[] = (benefitsConfig.items ?? []).map((item, idx) => ({
    description: item.description ?? '',
    icon: item.icon ?? 'Check',
    id: `benefits-site-${idx}`,
    title: item.title ?? '',
  }));

  const style: BenefitsSharedStyle = normalizeBenefitsStyle(benefitsConfig.style);

  const harmony = normalizeBenefitsHarmony(benefitsConfig.harmony);

  const tokens = getBenefitsSectionColors({
    harmony,
    mode,
    primary: brandColor,
    secondary,
  });

  const _hasSharedHeaderConfig = (
    typeof benefitsConfig.hideHeader === 'boolean'
    || typeof benefitsConfig.showTitle === 'boolean'
    || typeof benefitsConfig.showSubtitle === 'boolean'
    || typeof benefitsConfig.showBadge === 'boolean'
    || typeof benefitsConfig.titleColorPrimary === 'boolean'
    || typeof benefitsConfig.subtitleAboveTitle === 'boolean'
    || typeof benefitsConfig.uppercaseText === 'boolean'
    || typeof benefitsConfig.subtitle === 'string'
    || typeof benefitsConfig.badgeText === 'string'
  );

  const headerConfig = extractSectionHeaderConfig(config);

  const sectionConfig: Pick<BenefitsConfig, 'subHeading' | 'heading' | 'buttonText' | 'buttonLink' | 'headerAlign' | 'gridColumnsDesktop' | 'gridColumnsMobile' | 'visualImage' | 'highlightIndex' | 'showItemNumbers' | 'showDecorativeVisuals'> = {
    buttonLink: benefitsConfig.buttonLink,
    buttonText: benefitsConfig.buttonText,
    gridColumnsDesktop: benefitsConfig.gridColumnsDesktop,
    gridColumnsMobile: benefitsConfig.gridColumnsMobile,
    heading: benefitsConfig.heading,
    headerAlign: benefitsConfig.headerAlign,
    highlightIndex: benefitsConfig.highlightIndex,
    showDecorativeVisuals: benefitsConfig.showDecorativeVisuals,
    showItemNumbers: benefitsConfig.showItemNumbers,
    subHeading: benefitsConfig.subHeading,
    visualImage: benefitsConfig.visualImage,
  };

  return (
    <section className="py-8 px-3">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title={title}
          subtitle={headerConfig.subtitle}
          badgeText={headerConfig.badgeText}
          hideHeader={headerConfig.hideHeader}
          showTitle={headerConfig.showTitle}
          showSubtitle={headerConfig.showSubtitle}
          showBadge={headerConfig.showBadge}
          headerAlign={headerConfig.headerAlign}
          titleColorPrimary={headerConfig.titleColorPrimary}
          subtitleAboveTitle={headerConfig.subtitleAboveTitle}
          uppercaseText={headerConfig.uppercaseText}
          brandColor={brandColor}
        />

        <BenefitsSectionShared
          context="site"
          style={style}
          title={title}
          config={sectionConfig}
          items={items}
          tokens={tokens}
          mode={mode as BenefitsBrandMode}
          skipHeader={true}
        />
      </div>
    </section>
  );
}

// ============ FAQ SECTION ============
function FAQSection({
  config,
  brandColor,
  secondary,
  mode,
  title,
}: {
  config: Record<string, unknown>;
  brandColor: string;
  secondary: string;
  mode: 'single' | 'dual';
  title: string;
}) {
  const faqConfig = config as {
    items?: Array<{ question?: string; answer?: string }>;
    style?: FaqStyle;
    description?: string;
    buttonText?: string;
    buttonLink?: string;
  };

  const items: FaqItem[] = (faqConfig.items ?? []).map((item, idx) => ({
    id: idx,
    question: item.question ?? '',
    answer: item.answer ?? '',
  }));

  const style: FaqStyle = faqConfig.style ?? 'accordion';
  const _sectionConfig: FaqConfig = {
    description: faqConfig.description,
    buttonText: faqConfig.buttonText,
    buttonLink: faqConfig.buttonLink,
  };

  const tokens = getFaqColors({
    primary: brandColor,
    secondary,
    mode,
    style,
  });

  // Extract header config
  const headerConfig = extractSectionHeaderConfig(config);
  const hasSharedHeader = !headerConfig.hideHeader && (
    (headerConfig.showTitle && title.trim().length > 0)
    || (headerConfig.showSubtitle && (headerConfig.subtitle?.trim().length ?? 0) > 0)
    || (headerConfig.showBadge && (headerConfig.badgeText?.trim().length ?? 0) > 0)
  );

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <section className="py-8 px-3">
        <div className="mx-auto max-w-7xl space-y-6">
          <SectionHeader
            title={title}
            subtitle={headerConfig.subtitle}
            badgeText={headerConfig.badgeText}
            hideHeader={headerConfig.hideHeader}
            showTitle={headerConfig.showTitle}
            showSubtitle={headerConfig.showSubtitle}
            showBadge={headerConfig.showBadge}
            headerAlign={headerConfig.headerAlign}
            titleColorPrimary={headerConfig.titleColorPrimary}
            subtitleAboveTitle={headerConfig.subtitleAboveTitle}
            uppercaseText={headerConfig.uppercaseText}
            brandColor={brandColor}
          />
          <FaqSectionShared
            items={items}
            title={title}
            style={style}
            config={{
              buttonLink: faqConfig.buttonLink,
              buttonText: faqConfig.buttonText,
              description: faqConfig.description,
            }}
            tokens={tokens}
            context="site"
            suppressInternalHeader={hasSharedHeader}
          />
        </div>
      </section>
    </>
  );
}

// ============ CTA SECTION ============
function CTASection({
  config,
  brandColor,
  secondary,
  mode,
}: {
  config: Record<string, unknown>;
  brandColor: string;
  secondary: string;
  mode: 'single' | 'dual';
}) {
  const ctaConfig = config as {
    title?: string;
    description?: string;
    buttonText?: string;
    buttonLink?: string;
    secondaryButtonText?: string;
    secondaryButtonLink?: string;
    badge?: string;
    style?: CTAStyle;
  };

  const style = ctaConfig.style ?? 'banner';

  const tokens = getCTAColors({
    primary: brandColor,
    secondary,
    mode,
    style,
  });

  return (
    <CTASectionShared
      config={{
        title: ctaConfig.title ?? '',
        description: ctaConfig.description ?? '',
        buttonText: ctaConfig.buttonText ?? '',
        buttonLink: ctaConfig.buttonLink ?? '',
        secondaryButtonText: ctaConfig.secondaryButtonText ?? '',
        secondaryButtonLink: ctaConfig.secondaryButtonLink ?? '',
        badge: ctaConfig.badge ?? '',
      }}
      style={style}
      tokens={tokens}
      context="site"
    />
  );
}

function TestimonialsSection({ config, brandColor, secondary, mode, title }: { config: Record<string, unknown>; brandColor: string;
  secondary: string; mode: 'single' | 'dual'; title: string }) {
  const items = Array.isArray(config.items) ? config.items : [];
  const style = normalizeTestimonialsStyle(config.style);
  const desktopColumns = normalizeTestimonialsDesktopColumns(config.desktopColumns);
  const isFullBleedTestimonials = style === 'split-carousel' || style === 'overlap-carousel';
  const colors = getTestimonialsSectionColors({
    primary: brandColor,
    secondary,
    mode,
  });

  // Extract header config
  const headerConfig = extractSectionHeaderConfig(config);

  return (
    <section className={isFullBleedTestimonials ? 'py-0' : 'px-3 py-8'}>
      <div className={isFullBleedTestimonials ? 'w-full' : 'mx-auto max-w-7xl space-y-6'}>
        {!isFullBleedTestimonials && (
          <SectionHeader
            title={title}
            subtitle={headerConfig.subtitle}
            badgeText={headerConfig.badgeText}
            hideHeader={headerConfig.hideHeader}
            showTitle={headerConfig.showTitle}
            showSubtitle={headerConfig.showSubtitle}
            showBadge={headerConfig.showBadge}
            headerAlign={headerConfig.headerAlign}
            titleColorPrimary={headerConfig.titleColorPrimary}
            subtitleAboveTitle={headerConfig.subtitleAboveTitle}
            uppercaseText={headerConfig.uppercaseText}
            brandColor={brandColor}
          />
        )}
        <TestimonialsSectionShared
          items={items}
          style={style}
          title={title}
          subtitle={headerConfig.subtitle}
          tokens={colors}
          mode={mode}
          context="site"
          hideHeader={!isFullBleedTestimonials || headerConfig.hideHeader}
          showTitle={headerConfig.showTitle}
          showSubtitle={headerConfig.showSubtitle}
          showBadge={headerConfig.showBadge}
          headerAlign={headerConfig.headerAlign}
          titleColorPrimary={headerConfig.titleColorPrimary}
          subtitleAboveTitle={headerConfig.subtitleAboveTitle}
          uppercaseText={headerConfig.uppercaseText}
          badgeText={headerConfig.badgeText}
          desktopColumns={desktopColumns}
          splitBackgroundImage={typeof config.splitBackgroundImage === 'string' ? config.splitBackgroundImage : undefined}
          splitBackgroundOverlayOpacity={typeof config.splitBackgroundOverlayOpacity === 'number' ? config.splitBackgroundOverlayOpacity : undefined}
        />
      </div>
    </section>
  );
}

// ============ GALLERY/PARTNERS SECTION ============
// Gallery: 6 Professional Styles (Spotlight, Explore, Stories, Grid, Marquee, Masonry)
// Partners: 6 Professional Styles (Grid, Marquee, Mono, Badge, Carousel, Featured)
type GalleryStyle = 'spotlight' | 'explore' | 'stories' | 'grid' | 'marquee' | 'masonry' | 'mono' | 'badge' | 'carousel' | 'featured' | 'clean' | 'divider';

// Auto Scroll Slider Component for Marquee/Mono styles
const _AutoScrollSlider = ({ children, speed = 0.5, isPaused }: { children: React.ReactNode; speed?: number; isPaused?: boolean }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = React.useState(false);
  const paused = isPaused ?? isHovered;

  React.useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) {return;}

    let animationId: number;
    let position = scroller.scrollLeft;

    const step = () => {
      if (!paused && scroller) {
        position += speed;
        if (position >= scroller.scrollWidth / 3) {
          position = 0;
        }
        scroller.scrollLeft = position;
      } else if (scroller) {
        position = scroller.scrollLeft;
      }
      animationId = requestAnimationFrame(step);
    };

    animationId = requestAnimationFrame(step);
    return () =>{  cancelAnimationFrame(animationId); };
  }, [paused, speed]);

  return (
    <div 
      ref={scrollRef}
      className="flex overflow-x-auto cursor-grab active:cursor-grabbing touch-pan-x"
      style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
      onMouseEnter={() =>{  setIsHovered(true); }}
      onMouseLeave={() =>{  setIsHovered(false); }}
      onTouchStart={() =>{  setIsHovered(true); }}
      onTouchEnd={() =>{  setIsHovered(false); }}
    >
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
      <div className="flex shrink-0 gap-16 items-center px-4">{children}</div>
      <div className="flex shrink-0 gap-16 items-center px-4">{children}</div>
      <div className="flex shrink-0 gap-16 items-center px-4">{children}</div>
    </div>
  );
};

// Lightbox Component for Gallery
const GalleryLightbox = ({
  photo,
  onClose,
  photos,
  currentIndex,
  onNavigate,
  colors,
}: {
  photo: { url: string } | null;
  onClose: () => void;
  photos?: { url: string }[];
  currentIndex?: number;
  onNavigate?: (direction: 'prev' | 'next') => void;
  colors: GalleryColorTokens;
}) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {onClose();}
      if (e.key === 'ArrowLeft' && onNavigate) {onNavigate('prev');}
      if (e.key === 'ArrowRight' && onNavigate) {onNavigate('next');}
    };
    if (photo) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [photo, onClose, onNavigate]);

  if (!photo || !photo.url) {return null;}

  const hasMultiple = photos && photos.length > 1 && onNavigate;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-slate-950" onClick={onClose} />
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full border transition-colors z-[70]"
        style={{
          backgroundColor: colors.lightboxControlBg,
          borderColor: colors.lightboxControlBorder,
          color: colors.lightboxControlIcon,
        }}
        aria-label="Đóng"
      >
        <X size={24} />
      </button>
      {hasMultiple && (
        <>
          <button 
            onClick={(e) => { e.stopPropagation(); onNavigate('prev'); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border flex items-center justify-center transition-colors z-[70]"
            style={{
              backgroundColor: colors.lightboxControlBg,
              borderColor: colors.lightboxControlBorder,
              color: colors.lightboxControlIcon,
            }}
            aria-label="Ảnh trước"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onNavigate('next'); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border flex items-center justify-center transition-colors z-[70]"
            style={{
              backgroundColor: colors.lightboxControlBg,
              borderColor: colors.lightboxControlBorder,
              color: colors.lightboxControlIcon,
            }}
            aria-label="Ảnh sau"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}
      {hasMultiple && typeof currentIndex === 'number' && (
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm z-[70] px-3 py-1 rounded-full border"
          style={{
            backgroundColor: colors.lightboxCounterBg,
            color: colors.lightboxCounterText,
            borderColor: colors.lightboxControlBorder,
          }}
        >
          {currentIndex + 1} / {photos.length}
        </div>
      )}
      <div className="relative z-[70] max-w-5xl w-full max-h-[90vh] p-4 flex flex-col items-center justify-center" onClick={e =>{  e.stopPropagation(); }}>
        <SiteImage 
          src={photo.url} 
          alt="Lightbox" 
          className="max-h-[90vh] max-w-full object-contain shadow-sm animate-in zoom-in-95 duration-300" 
        />
      </div>
    </div>
  );
};

// ============ TRUST BADGES / CERTIFICATIONS SECTION ============
// 6 Styles: grid, cards, stack, wall, carousel, seal

interface TrustBadgeItem { url: string; link?: string; name?: string }

// Modal Lightbox for viewing certificates
const CertificateModal = ({ 
  item, 
  isOpen, 
  onClose 
}: { 
  item: TrustBadgeItem | null; 
  isOpen: boolean; 
  onClose: () => void;
}) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {onClose();}
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !item || !item.url) {return null;}

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 md:top-8 md:right-8 p-2 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all focus:outline-none z-50"
        aria-label="Close modal"
      >
        <X size={32} />
      </button>
      <div 
        className="relative max-w-5xl w-full max-h-[90vh] p-4 flex flex-col items-center justify-center"
        onClick={(e) =>{  e.stopPropagation(); }}
      >
        <div className="relative w-auto h-auto flex flex-col items-center">
          <SiteImage 
            src={item.url} 
            alt={item.name ?? ''} 
            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl bg-white p-2 md:p-4 animate-in zoom-in-95 duration-300" 
          />
          {item.name && (
            <p className="mt-4 text-white/90 text-lg md:text-xl font-medium tracking-wide text-center">
              {item.name}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

function TrustBadgesSection({
  config,
  brandColor,
  secondary,
  mode,
  title,
}: {
  config: Record<string, unknown>;
  brandColor: string;
  secondary: string;
  mode: 'single' | 'dual';
  title: string;
}) {
  const items = (config.items as TrustBadgeItem[]) || [];
  const style = normalizeTrustBadgesStyle(config.style);
  const carouselId = useSafeId('trustbadges-carousel');
  const [selectedCert, setSelectedCert] = React.useState<TrustBadgeItem | null>(null);
  const colors = getGalleryColorTokens({ primary: brandColor, secondary, mode });
  const headerConfig = extractSectionHeaderConfig(config);
  const desktopColumns = config.desktopColumns === 3 ? 3 : 4;
  const responsiveGridClassName = desktopColumns === 3
    ? 'grid-cols-1 md:grid-cols-3 lg:grid-cols-3'
    : 'grid-cols-2 md:grid-cols-2 lg:grid-cols-4';
  const responsiveCardGridClassName = desktopColumns === 3
    ? 'grid-cols-1 md:grid-cols-3 lg:grid-cols-3'
    : 'grid-cols-2 md:grid-cols-2 lg:grid-cols-4';

  const sharedHeader = (
    <SectionHeader
      title={title}
      subtitle={headerConfig.subtitle}
      badgeText={headerConfig.badgeText}
      hideHeader={headerConfig.hideHeader}
      showTitle={headerConfig.showTitle}
      showSubtitle={headerConfig.showSubtitle}
      showBadge={headerConfig.showBadge}
      headerAlign={headerConfig.headerAlign}
      titleColorPrimary={headerConfig.titleColorPrimary}
      subtitleAboveTitle={headerConfig.subtitleAboveTitle}
      uppercaseText={headerConfig.uppercaseText}
      brandColor={brandColor}
    />
  );


  // Style 1: Square Grid
  if (style === 'grid') {
    return (
      <section className="py-8 px-3 bg-white">
        <div className="mx-auto max-w-7xl">
          {sharedHeader}
          <div className={cn("grid gap-3 md:gap-4", responsiveGridClassName)}>
            {items.map((item, idx) => (
              <div
                key={idx}
                onClick={() => { setSelectedCert(item); }}
                className="group relative aspect-[4/3] rounded-2xl flex items-center justify-center p-4 md:p-5 cursor-zoom-in transition-all duration-300 hover:-translate-y-0.5"
                style={{ border: `1px solid ${colors.neutralBorder}`, backgroundColor: colors.neutralSurface, boxShadow: '0 16px 40px rgba(15, 23, 42, 0.06)' }}
              >
                {item.url ? (
                  <SiteImage src={item.url} className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105" alt={item.name ?? ''} />
                ) : (
                  <Shield size={34} className="text-slate-300" />
                )}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.badgeBg }}>
                    <Maximize2 size={14} style={{ color: colors.badgeText }} />
                  </div>
                </div>
                {item.name && (
                  <div className="absolute bottom-2 left-2 right-2 text-center">
                    <span className="block truncate rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold text-slate-600 shadow-sm">{item.name}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <CertificateModal item={selectedCert} isOpen={Boolean(selectedCert)} onClose={() =>{  setSelectedCert(null); }} />
      </section>
    );
  }

  // Style 2: Feature Cards
  if (style === 'cards') {
    return (
      <section className="py-8 px-3 bg-slate-50">
        <div className="mx-auto max-w-7xl">
          {sharedHeader}
          <div className={cn("grid gap-4 md:gap-5", responsiveCardGridClassName)}>
            {items.map((item, idx) => (
              <div
                key={idx}
                onClick={() => { setSelectedCert(item); }}
                className="group relative flex flex-col rounded-3xl overflow-hidden cursor-zoom-in h-full transition-all duration-300 hover:-translate-y-1"
                style={{ border: `1px solid ${colors.neutralBorder}`, backgroundColor: colors.neutralSurface, boxShadow: '0 18px 45px rgba(15, 23, 42, 0.08)' }}
              >
                <div className="aspect-[4/3] flex items-center justify-center p-6 md:p-7 relative overflow-hidden" style={{ backgroundColor: colors.neutralBackground }}>
                  {item.url ? (
                    <SiteImage src={item.url} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 z-10" alt={item.name ?? ''} />
                  ) : (
                    <Shield size={38} className="text-slate-300" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <span className="px-4 py-2 rounded-full font-medium flex items-center gap-2 text-sm" style={{ color: colors.subheading, backgroundColor: colors.neutralSurface, border: `1px solid ${colors.sectionAccentBar}` }}>
                      <ZoomIn size={16} /> Xem chi tiết
                    </span>
                  </div>
                </div>
                <div className="py-4 px-5 border-t flex items-center justify-between transition-colors" style={{ borderColor: colors.neutralBorder, backgroundColor: colors.neutralSurface }}>
                  <span className="font-semibold truncate text-sm" style={{ color: colors.subheading }}>
                    {item.name ?? 'Chứng nhận'}
                  </span>
                  <ArrowUpRight size={16} className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: colors.subheading }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <CertificateModal item={selectedCert} isOpen={Boolean(selectedCert)} onClose={() => { setSelectedCert(null); }} />
      </section>
    );
  }

  // Style 3: Stack
  if (style === 'stack') {
    const stackItems = items.slice(0, 3);
    const stackRemaining = items.length - stackItems.length;
    return (
      <section className="overflow-hidden bg-slate-50 py-12 px-3 md:py-14">
        <div className="mx-auto max-w-7xl">
          {sharedHeader}
          <div className="grid items-start gap-4 md:grid-cols-[0.92fr_1.5fr] md:gap-6">
            <div className="rounded-2xl border bg-white p-5 shadow-sm md:p-6" style={{ borderColor: colors.neutralBorder, boxShadow: '0 18px 45px rgba(15, 23, 42, 0.06)' }}>
              <div className="mb-6">
                <p className="text-base font-bold" style={{ color: colors.heading }}>Bộ tín hiệu tin cậy</p>
                <p className="mt-2 text-xs leading-5" style={{ color: colors.mutedText }}>Hiển thị rõ cam kết trước khi khách ra quyết định.</p>
              </div>
              <div className="space-y-3">
                {stackItems.map((item, index) => {
                  const active = index === 0;
                  return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => { setSelectedCert(item); }}
                    className="flex min-h-14 w-full items-center gap-4 rounded-lg border bg-white px-4 py-3 text-left transition-all duration-300"
                    style={{
                      borderColor: active ? colors.sectionAccentBar : colors.neutralBorder,
                      boxShadow: active ? `0 12px 28px ${colors.sectionAccentBar}18` : '0 8px 20px rgba(15, 23, 42, 0.04)',
                    }}
                  >
                    <span className="w-5 shrink-0 text-sm font-semibold" style={{ color: active ? colors.sectionAccentBar : colors.subheading }}>{index + 1}</span>
                    <span className="min-w-0 flex-1 truncate text-sm font-extrabold uppercase tracking-tight" style={{ color: colors.heading }}>{item.name ?? `Chứng nhận ${index + 1}`}</span>
                    <ArrowUpRight size={17} style={{ color: active ? colors.sectionAccentBar : colors.mutedText }} />
                  </button>
                  );
                })}
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {stackItems.map((item, idx) => (
                <button key={idx} type="button" onClick={() => { setSelectedCert(item); }} className="group overflow-hidden rounded-xl border bg-white p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-1" style={{ borderColor: colors.neutralBorder, boxShadow: '0 18px 45px rgba(15, 23, 42, 0.07)' }}>
                  <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg" style={{ backgroundColor: colors.neutralBackground }}>
                    {item.url ? (
                      <SiteImage src={item.url} className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]" alt={item.name ?? ''} />
                    ) : (
                      <Shield size={40} style={{ color: colors.subheading }} />
                    )}
                  </div>
                  <p className="mt-5 truncate text-sm font-extrabold uppercase tracking-tight" style={{ color: colors.heading }}>{item.name ?? 'Chứng nhận'}</p>
                  <div className="mx-auto mt-3 h-0.5 w-8 rounded-full" style={{ backgroundColor: colors.sectionAccentBar }} />
                </button>
              ))}
            </div>
            {stackRemaining > 0 && (
              <div className="flex items-center justify-center rounded-2xl border border-dashed p-4 text-sm font-semibold md:col-span-2" style={{ borderColor: colors.accentBorder, color: colors.subheading }}>+{stackRemaining} chứng nhận khác</div>
            )}
          </div>
        </div>
        <CertificateModal item={selectedCert} isOpen={Boolean(selectedCert)} onClose={() => { setSelectedCert(null); }} />
      </section>
    );
  }

  // Style 4: Framed Wall
  if (style === 'wall') {
    return (
      <section className="py-8 px-3" style={{ backgroundColor: colors.neutralBackground }}>
        <div className="mx-auto max-w-7xl">
          {sharedHeader}
          <div className={cn("grid gap-4 md:gap-5", responsiveGridClassName)}>
            {items.map((item, idx) => (
              <div
                key={idx}
                onClick={() => { setSelectedCert(item); }}
                className="group relative p-2 md:p-3 rounded-2xl flex min-h-[170px] md:min-h-[210px] flex-col cursor-zoom-in transition-all duration-300 hover:-translate-y-0.5"
                style={{ border: `1px solid ${colors.neutralBorder}`, backgroundColor: colors.neutralSurface, boxShadow: '0 16px 40px rgba(15, 23, 42, 0.06)' }}
              >
                <div className="mb-3 h-1.5 w-10 rounded-full" style={{ backgroundColor: colors.sectionAccentBar }} />
                <div className="flex-1 flex items-center justify-center rounded-xl p-3 relative overflow-hidden" style={{ backgroundColor: colors.neutralBackground, border: `1px solid ${colors.neutralBorder}` }}>
                  {item.url ? (
                    <SiteImage src={item.url} className="w-full h-full object-contain" alt={item.name ?? ''} />
                  ) : (
                    <Shield size={28} className="text-slate-300" />
                  )}
                </div>
                <div className="h-7 md:h-8 flex items-center justify-center mt-1">
                  <span className="text-[10px] md:text-xs font-semibold text-center truncate px-1" style={{ color: colors.subheading }}>
                    {item.name ? (item.name.length > 18 ? item.name.slice(0, 16) + '...' : item.name) : 'Certificate'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <CertificateModal item={selectedCert} isOpen={Boolean(selectedCert)} onClose={() => { setSelectedCert(null); }} />
      </section>
    );
  }

  // Style 5: Carousel
  if (style === 'carousel') {
    const cardWidth = desktopColumns === 3 ? 220 : 180;
    const gap = 16;
    const showArrowsDesktop = items.length > 5;

    return (
      <section className="py-8 px-3 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            {sharedHeader}
            {showArrowsDesktop && (
              <div className="hidden md:flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const container = document.querySelector(`#${carouselId}`);
                    if (container) {container.scrollBy({ behavior: 'smooth', left: -(cardWidth + gap) });}
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                  style={{ border: `1px solid ${colors.sectionAccentBar}`, backgroundColor: colors.neutralSurface }}
                >
                  <ChevronLeft size={20} style={{ color: colors.heading }} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const container = document.querySelector(`#${carouselId}`);
                    if (container) {container.scrollBy({ behavior: 'smooth', left: cardWidth + gap });}
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors"
                  style={{ backgroundColor: colors.heading }}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>

          <div className="relative overflow-hidden rounded-xl">
            <div
              id={carouselId}
              className="flex overflow-x-auto snap-x snap-mandatory gap-4 py-4 px-2 cursor-grab active:cursor-grabbing select-none"
              style={{ WebkitOverflowScrolling: 'touch', msOverflowStyle: 'none', scrollbarWidth: 'none' }}
              onMouseDown={(e) => {
                const el = e.currentTarget;
                el.dataset.isDown = 'true';
                el.dataset.startX = String(e.pageX - el.offsetLeft);
                el.dataset.scrollLeft = String(el.scrollLeft);
                el.style.scrollBehavior = 'auto';
              }}
              onMouseLeave={(e) => { e.currentTarget.dataset.isDown = 'false'; e.currentTarget.style.scrollBehavior = 'smooth'; }}
              onMouseUp={(e) => { e.currentTarget.dataset.isDown = 'false'; e.currentTarget.style.scrollBehavior = 'smooth'; }}
              onMouseMove={(e) => {
                const el = e.currentTarget;
                if (el.dataset.isDown !== 'true') {return;}
                e.preventDefault();
                const x = e.pageX - el.offsetLeft;
                const walk = (x - Number(el.dataset.startX)) * 1.5;
                el.scrollLeft = Number(el.dataset.scrollLeft) - walk;
              }}
            >
              {items.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() =>{  setSelectedCert(item); }}
                className={cn("snap-start flex-shrink-0 w-[140px] group cursor-zoom-in", desktopColumns === 3 ? 'md:w-[220px]' : 'md:w-[180px]')}
                  draggable={false}
                >
                  <div
                    className="aspect-[4/3] rounded-2xl flex items-center justify-center p-4 md:p-5 transition-all duration-300"
                    style={{ backgroundColor: colors.neutralBackground, border: `1px solid ${colors.neutralBorder}` }}
                  >
                    {item.url ? (
                      <SiteImage src={item.url} className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105" alt={item.name ?? ''} draggable={false} />
                    ) : (
                      <Shield size={32} className="text-slate-300" />
                    )}
                  </div>
                  {item.name && (
                    <p className="text-center text-xs font-medium text-slate-500 mt-2 truncate px-1">{item.name}</p>
                  )}
                </div>
              ))}
              <div className="flex-shrink-0 w-4" />
            </div>
          </div>

          <style>{`#${carouselId}::-webkit-scrollbar { display: none; }`}</style>
        </div>
        <CertificateModal item={selectedCert} isOpen={Boolean(selectedCert)} onClose={() =>{  setSelectedCert(null); }} />
      </section>
    );
  }

  // Style 6: Seal
  const sealItems = items.slice(0, 3);
  const sealRemaining = items.length - sealItems.length;
  return (
    <section className="relative overflow-hidden bg-slate-50 py-12 px-3 md:py-16">
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-white/70 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-white/70 blur-2xl" />
      <div className="mx-auto max-w-7xl">
        {sharedHeader}
        <div className="relative grid items-center gap-6 md:grid-cols-[0.9fr_1.15fr] md:gap-10">
          <div className="relative mx-auto flex aspect-square w-full max-w-[380px] items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-dashed opacity-60" style={{ borderColor: colors.neutralBorder }} />
            <div className="absolute inset-8 rounded-full border border-dashed opacity-80" style={{ borderColor: colors.neutralBorder }} />
            <div className="absolute inset-20 rounded-full border" style={{ borderColor: colors.sectionAccentBar }} />
            <span className="absolute left-5 top-1/2 h-2 w-2 rounded-full" style={{ backgroundColor: colors.sectionAccentBar }} />
            <span className="absolute right-8 top-1/4 h-2 w-2 rounded-full" style={{ backgroundColor: colors.sectionAccentBar }} />
            <span className="absolute bottom-16 right-14 h-2 w-2 rounded-full" style={{ backgroundColor: colors.sectionAccentBar }} />
            <div className="relative z-10 flex h-44 w-44 flex-col items-center justify-center rounded-full border bg-white text-center shadow-xl" style={{ borderColor: colors.sectionAccentBar }}>
              <Shield size={34} style={{ color: colors.heading }} />
              <span className="mt-4 text-xs font-bold uppercase tracking-[0.32em]" style={{ color: colors.mutedText }}>Verified</span>
              <div className="mt-3 h-0.5 w-8 rounded-full" style={{ backgroundColor: colors.sectionAccentBar }} />
              <span className="mt-3 text-5xl font-black leading-none" style={{ color: colors.heading }}>{sealItems.length}</span>
            </div>
            {sealItems.map((item, idx) => {
              const positions = [
                'left-1/2 top-0 -translate-x-1/2',
                'right-0 top-[36%]',
                'bottom-2 left-[62%] -translate-x-1/2',
              ];
              return (
                <button key={idx} type="button" onClick={() => { setSelectedCert(item); }} className={cn("absolute z-20 flex h-20 w-20 items-center justify-center rounded-2xl border bg-white p-2 shadow-lg", positions[idx])} style={{ borderColor: colors.neutralBorder }}>
                  {item.url ? (
                    <SiteImage src={item.url} className="h-full w-full object-contain" alt={item.name ?? ''} />
                  ) : (
                    <Shield size={28} style={{ color: colors.subheading }} />
                  )}
                </button>
              );
            })}
          </div>
          <div className="grid gap-4">
            {sealItems.map((item, idx) => (
              <button key={idx} type="button" onClick={() =>{  setSelectedCert(item); }} className="group flex min-h-24 items-center gap-4 rounded-2xl border bg-white p-4 text-left shadow-sm transition-all duration-300 hover:-translate-x-1" style={{ borderColor: colors.neutralBorder, boxShadow: '0 18px 45px rgba(15, 23, 42, 0.06)' }}>
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg" style={{ backgroundColor: colors.neutralBackground }}>
                {item.url ? (
                  <SiteImage src={item.url} className="h-full w-full object-contain" alt={item.name ?? ''} />
                ) : (
                  <Shield size={26} style={{ color: colors.subheading }} />
                )}
                </div>
                <div className="h-12 w-px shrink-0" style={{ backgroundColor: colors.neutralBorder }} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-extrabold uppercase tracking-tight" style={{ color: colors.heading }}>{item.name ?? 'Chứng nhận'}</p>
                  <p className="text-xs" style={{ color: colors.mutedText }}>Tín hiệu #{idx + 1} trong bộ chứng nhận</p>
                </div>
                <ArrowUpRight size={18} style={{ color: colors.heading }} />
              </button>
            ))}
            {sealRemaining > 0 && (
              <div className="rounded-2xl border border-dashed p-3 text-center text-sm font-semibold" style={{ borderColor: colors.accentBorder, color: colors.subheading }}>
                +{sealRemaining} chứng nhận khác
              </div>
            )}
          </div>
        </div>
      </div>
      <CertificateModal item={selectedCert} isOpen={Boolean(selectedCert)} onClose={() =>{  setSelectedCert(null); }} />
    </section>
  );
}

function GallerySection({ config, brandColor, secondary, mode, title, type }: { config: Record<string, unknown>; brandColor: string;
  secondary: string; mode: 'single' | 'dual'; title: string; type: string }) {
  const items = (config.items as { url: string; link?: string; name?: string }[]) || [];
  const style = type === 'Partners'
    ? normalizePartnersStyle(config.style)
    : ((config.style as GalleryStyle) || 'spotlight');
  const partnersSubheading = type === 'Partners' && typeof (config.subtitle ?? config.subheading) === 'string' ? ((config.subtitle ?? config.subheading) as string) : undefined;
  const partnersAlign = type === 'Partners' ? normalizePartnersAlign(config.align) : 'center';
  const partnersDisplayMode = type === 'Partners' ? normalizePartnersDisplayMode(config.displayMode) : 'withName';
  const harmony = normalizeGalleryHarmony((config.harmony as string | undefined));
  const [selectedPhoto, setSelectedPhoto] = React.useState<{ id: string; url: string; link?: string; name?: string } | null>(null);
  const [device, setDevice] = React.useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [isMarqueeInteractionPaused, setIsMarqueeInteractionPaused] = React.useState(false);
  const [marqueeRepeatCount, setMarqueeRepeatCount] = React.useState(2);
  const [marqueeBaseTrackWidth, setMarqueeBaseTrackWidth] = React.useState(0);
  const marqueeScrollRef = React.useRef<HTMLDivElement>(null);
  const marqueeBaseTrackRef = React.useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);
  const colors = getGalleryColorTokens({ primary: brandColor, secondary, mode, harmony });
  const layoutAccent = colors.sectionAccentBarByStyle[style as keyof typeof colors.sectionAccentBarByStyle] ?? colors.sectionAccentBar;
  const normalizedItems = items.map((item, idx) => ({ ...item, id: item.url ? `${item.url}-${idx}` : `gallery-${idx}` }));
  const marqueeBaseItems = React.useMemo(() => getGalleryMarqueeBaseItems(normalizedItems), [normalizedItems]);
  const lightboxItems = style === 'marquee' ? marqueeBaseItems : normalizedItems;

  React.useEffect(() => {
    if (style !== 'marquee') {return;}
    const scroller = marqueeScrollRef.current;
    const baseTrack = marqueeBaseTrackRef.current;
    if (!scroller || !baseTrack) {return;}

    const updateMetrics = () => {
      const nextBaseWidth = baseTrack.scrollWidth;
      const viewportWidth = scroller.clientWidth;
      if (nextBaseWidth <= 0 || viewportWidth <= 0) {return;}
      const nextRepeatCount = Math.max(2, Math.ceil(viewportWidth / nextBaseWidth) + 1);
      setMarqueeRepeatCount(nextRepeatCount);
      setMarqueeBaseTrackWidth(nextBaseWidth);
    };

    updateMetrics();
    const cleanupHandlers: Array<() => void> = [];

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(updateMetrics);
      observer.observe(scroller);
      observer.observe(baseTrack);
      cleanupHandlers.push(() =>{  observer.disconnect(); });
    }

    window.addEventListener('resize', updateMetrics);
    cleanupHandlers.push(() =>{  window.removeEventListener('resize', updateMetrics); });

    return () => {
      cleanupHandlers.forEach((cleanup) =>{  cleanup(); });
    };
  }, [style, marqueeBaseItems]);

  React.useEffect(() => {
    if (style !== 'marquee') {return;}
    const scroller = marqueeScrollRef.current;
    if (!scroller) {return;}

    let animationId = 0;
    let position = scroller.scrollLeft;

    const step = () => {
      const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;
      const resetPoint = Math.min(marqueeBaseTrackWidth, maxScrollLeft);

      if (!isMarqueeInteractionPaused && !prefersReducedMotion && resetPoint > 1 && maxScrollLeft > 1) {
        position += Math.max(0.5, marqueeBaseItems.length * 0.02);
        if (position >= resetPoint) {
          position -= resetPoint;
        }
        scroller.scrollLeft = position;
      } else {
        position = scroller.scrollLeft;
      }

      animationId = requestAnimationFrame(step);
    };

    animationId = requestAnimationFrame(step);
    return () =>{  cancelAnimationFrame(animationId); };
  }, [style, isMarqueeInteractionPaused, prefersReducedMotion, marqueeBaseTrackWidth, marqueeBaseItems.length]);

  React.useEffect(() => {
    const updateDevice = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDevice('mobile');
        return;
      }
      if (width < 1024) {
        setDevice('tablet');
        return;
      }
      setDevice('desktop');
    };
    updateDevice();
    window.addEventListener('resize', updateDevice);
    return () => window.removeEventListener('resize', updateDevice);
  }, []);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    updateMotion();
    mediaQuery.addEventListener('change', updateMotion);
    return () => {
      mediaQuery.removeEventListener('change', updateMotion);
    };
  }, []);

  const handleLightboxNavigate = (direction: 'prev' | 'next') => {
    if (!selectedPhoto || lightboxItems.length === 0) {return;}
    const currentIdx = lightboxItems.findIndex(item => item.id === selectedPhoto.id);
    if (currentIdx === -1) {return;}
    const nextIdx = direction === 'prev'
      ? (currentIdx - 1 + lightboxItems.length) % lightboxItems.length
      : (currentIdx + 1) % lightboxItems.length;
    setSelectedPhoto(lightboxItems[nextIdx]);
  };

  const currentPhotoIndex = selectedPhoto
    ? lightboxItems.findIndex(item => item.id === selectedPhoto.id)
    : -1;

  // ============ GALLERY STYLES (Spotlight, Explore, Stories) - Only for type === 'Gallery' ============

  const renderGalleryEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: colors.placeholderBg }}>
        <ImageIcon size={32} style={{ color: colors.placeholderIcon }} />
      </div>
      <h3 className="font-medium text-slate-900 mb-1">Chưa có hình ảnh nào</h3>
      <p className="text-sm text-slate-500">Thêm ảnh đầu tiên để bắt đầu</p>
    </div>
  );

  const renderSpotlightStyle = () => {
    if (normalizedItems.length === 0) {return renderGalleryEmptyState();}
    const featured = normalizedItems[0];
    const sub = normalizedItems.slice(1, 4);

    return (
      <div
        className="grid gap-1 border grid-cols-1 md:grid-cols-3"
        style={{ backgroundColor: colors.neutralBackground, borderColor: colors.neutralBorder }}
      >
        <div
          className="relative group cursor-pointer overflow-hidden border aspect-[4/3] md:col-span-2 md:aspect-auto md:row-span-1 md:min-h-[300px]"
          style={{ backgroundColor: colors.neutralSurface, borderColor: colors.neutralBorder }}
          onClick={() =>{  setSelectedPhoto(featured); }}
        >
          {featured.url ? (
            <SiteImage src={featured.url} alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: colors.placeholderBg }}><ImageIcon size={48} style={{ color: colors.placeholderIcon }} /></div>
          )}
          <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: layoutAccent }} />
          <div className="absolute inset-0 border-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ borderColor: layoutAccent }} />
        </div>
        <div className="grid gap-1 grid-cols-3 md:grid-cols-1">
          {sub.map((photo) => (
            <div
              key={photo.id}
              className="aspect-square relative group cursor-pointer overflow-hidden border"
              style={{ backgroundColor: colors.neutralSurface, borderColor: colors.neutralBorder }}
              onClick={() =>{  setSelectedPhoto(photo); }}
            >
              {photo.url ? (
                <SiteImage src={photo.url} alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: colors.placeholderBg }}><ImageIcon size={24} style={{ color: colors.placeholderIcon }} /></div>
              )}
              <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: layoutAccent }} />
              <div className="absolute inset-0 border-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ borderColor: layoutAccent }} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderExploreStyle = () => {
    if (normalizedItems.length === 0) {return renderGalleryEmptyState();}

    return (
      <div className="grid gap-0.5 border grid-cols-3 md:grid-cols-4 lg:grid-cols-5" style={{ backgroundColor: colors.neutralBackground, borderColor: colors.neutralBorder }}>
        {normalizedItems.map((photo) => (
          <div
            key={photo.id}
            className="aspect-square relative group cursor-pointer overflow-hidden border"
            style={{ backgroundColor: colors.neutralSurface, borderColor: colors.neutralBorder }}
            onClick={() =>{  setSelectedPhoto(photo); }}
          >
            {photo.url ? (
              <SiteImage
                src={photo.url}
                alt=""
                className="w-full h-full object-cover transition-opacity duration-300 hover:opacity-90"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: colors.placeholderBg }}><ImageIcon size={24} style={{ color: colors.placeholderIcon }} /></div>
            )}
            <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: layoutAccent }} />
            <div className="absolute inset-0 border-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ borderColor: layoutAccent }} />
          </div>
        ))}
      </div>
    );
  };

  const renderStoriesStyle = () => {
    if (normalizedItems.length === 0) {return renderGalleryEmptyState();}

    return (
      <div
        className="grid gap-4 grid-cols-3 auto-rows-[110px] sm:auto-rows-[250px] md:grid-cols-3 md:auto-rows-[300px] rounded-lg border p-2"
        style={{ backgroundColor: colors.neutralBackground, borderColor: colors.neutralBorder }}
      >
        {normalizedItems.map((photo, i) => {
          const isLarge = i % 4 === 0 || i % 4 === 3;
          const colSpan = isLarge ? 'col-span-2 md:col-span-2' : 'col-span-1 md:col-span-1';

          return (
            <div
              key={photo.id}
              className={`${colSpan} relative group cursor-pointer overflow-hidden rounded-sm border`}
              style={{ backgroundColor: colors.neutralSurface, borderColor: colors.neutralBorder }}
              onClick={() =>{  setSelectedPhoto(photo); }}
            >
              {photo.url ? (
                <SiteImage
                  src={photo.url}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: colors.placeholderBg }}>
                  <ImageIcon size={32} style={{ color: colors.placeholderIcon }} />
                </div>
              )}
              <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: layoutAccent }} />
              <div className="absolute inset-0 border-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ borderColor: layoutAccent }} />
            </div>
          );
        })}
      </div>
    );
  };

  const renderGalleryGridStyle = () => {
    if (normalizedItems.length === 0) {return renderGalleryEmptyState();}

    const maxVisible = device === 'mobile' ? 6 : (device === 'tablet' ? 9 : 12);
    const visibleItems = normalizedItems.slice(0, maxVisible);
    const remainingCount = normalizedItems.length - maxVisible;

    if (normalizedItems.length <= 2) {
      return (
        <div className="py-8 px-4">
          <div className={cn('mx-auto flex items-center justify-center gap-4', normalizedItems.length === 1 ? 'max-w-sm' : 'max-w-xl')}>
            {normalizedItems.map((photo) => (
              <div
                key={photo.id}
                className="flex-1 aspect-square rounded-xl overflow-hidden cursor-pointer group border relative"
                style={{ backgroundColor: colors.neutralSurface, borderColor: colors.neutralBorder }}
                onClick={() =>{  setSelectedPhoto(photo); }}
              >
                {photo.url ? (
                  <SiteImage src={photo.url} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: colors.placeholderBg }}><ImageIcon size={40} style={{ color: colors.placeholderIcon }} /></div>
                )}
                <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: layoutAccent }} />
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="py-8 px-4">
        <div className={cn(
          'grid gap-2 rounded-lg border p-2',
          device === 'mobile' ? 'grid-cols-2' : (device === 'tablet' ? 'grid-cols-3' : 'grid-cols-4'),
        )} style={{ backgroundColor: colors.neutralBackground, borderColor: colors.neutralBorder }}>
          {visibleItems.map((photo) => (
            <div
              key={photo.id}
              className="aspect-square rounded-lg overflow-hidden cursor-pointer group relative border"
              style={{ backgroundColor: colors.neutralSurface, borderColor: colors.neutralBorder }}
              onClick={() =>{  setSelectedPhoto(photo); }}
            >
              {photo.url ? (
                <SiteImage src={photo.url} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: colors.placeholderBg }}><ImageIcon size={28} style={{ color: colors.placeholderIcon }} /></div>
              )}
              <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: layoutAccent }} />
              <div className="absolute inset-0 border-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ borderColor: layoutAccent }} />
            </div>
          ))}
          {remainingCount > 0 && (
            <div
              className="aspect-square rounded-lg overflow-hidden flex flex-col items-center justify-center cursor-pointer border"
              style={{ backgroundColor: colors.badgeBg, borderColor: colors.neutralBorder }}
            >
              <Plus size={28} style={{ color: colors.iconColor }} className="mb-1" />
              <span className="text-lg font-bold" style={{ color: colors.badgeText }}>+{remainingCount}</span>
              <span className="text-xs" style={{ color: colors.mutedText }}>ảnh khác</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderGalleryMarqueeStyle = () => {
    if (normalizedItems.length === 0) {return renderGalleryEmptyState();}
    if (marqueeBaseItems.length === 0) {return renderGalleryEmptyState();}

    return (
      <div className="py-8">
        <div className="w-full max-w-7xl mx-auto relative overflow-hidden rounded-2xl border p-4 md:p-6" style={{ backgroundColor: colors.neutralBackground, borderColor: colors.neutralBorder }}>
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-20 z-10"
            style={{ background: `linear-gradient(to right, ${colors.neutralBackground} 0%, transparent 100%)` }}
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-20 z-10"
            style={{ background: `linear-gradient(to left, ${colors.neutralBackground} 0%, transparent 100%)` }}
          />
          <div
            ref={marqueeScrollRef}
            className="flex overflow-x-auto select-none w-full cursor-grab active:cursor-grabbing touch-pan-x"
            style={{ WebkitOverflowScrolling: 'touch', msOverflowStyle: 'none', scrollbarWidth: 'none' }}
            onMouseEnter={() => { setIsMarqueeInteractionPaused(true); }}
            onMouseLeave={(e) => {
              setIsMarqueeInteractionPaused(false);
              e.currentTarget.dataset.isDown = 'false';
              e.currentTarget.style.scrollBehavior = 'smooth';
            }}
            onFocusCapture={() => { setIsMarqueeInteractionPaused(true); }}
            onBlurCapture={() => { setIsMarqueeInteractionPaused(false); }}
            onTouchStart={() => { setIsMarqueeInteractionPaused(true); }}
            onTouchEnd={() => { setIsMarqueeInteractionPaused(false); }}
            onTouchCancel={() => { setIsMarqueeInteractionPaused(false); }}
            onMouseDown={(e) => {
              const el = e.currentTarget;
              el.dataset.isDown = 'true';
              el.dataset.startX = String(e.pageX - el.offsetLeft);
              el.dataset.scrollLeft = String(el.scrollLeft);
              el.style.scrollBehavior = 'auto';
            }}
            onMouseUp={(e) => {
              e.currentTarget.dataset.isDown = 'false';
              e.currentTarget.style.scrollBehavior = 'smooth';
            }}
            onMouseMove={(e) => {
              const el = e.currentTarget;
              if (el.dataset.isDown !== 'true') {return;}
              e.preventDefault();
              const x = e.pageX - el.offsetLeft;
              const walk = (x - Number(el.dataset.startX ?? '0')) * 1.2;
              el.scrollLeft = Number(el.dataset.scrollLeft ?? '0') - walk;
            }}
          >
            {Array.from({ length: marqueeRepeatCount }).map((_, loopIdx) => (
              <div
                key={`gallery-marquee-track-${loopIdx}`}
                ref={loopIdx === 0 ? marqueeBaseTrackRef : undefined}
                className="flex shrink-0 items-center gap-6 md:gap-8 px-1 py-1"
              >
                {marqueeBaseItems.map((photo, idx) => (
                  <button
                    type="button"
                    key={`gallery-marquee-${loopIdx}-${photo.id}-${idx}`}
                    className="shrink-0 h-40 md:h-56 lg:h-64 aspect-[4/3] rounded-xl overflow-hidden group relative border text-left appearance-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    style={{
                      backgroundColor: colors.neutralSurface,
                      borderColor: colors.neutralBorder,
                      boxShadow: '0 8px 24px rgba(15,23,42,0.08)',
                      '--tw-ring-color': layoutAccent,
                    } as React.CSSProperties}
                    onClick={() => { setSelectedPhoto(photo); }}
                    aria-label={`Mở ảnh ${idx + 1}`}
                  >
                    {photo.url ? (
                      <SiteImage src={photo.url} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: colors.placeholderBg }}>
                        <ImageIcon size={32} style={{ color: colors.placeholderIcon }} />
                      </div>
                    )}
                    <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: layoutAccent }} />
                    <div className="absolute inset-0 border-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ borderColor: layoutAccent }} />
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderGalleryMasonryStyle = () => {
    if (normalizedItems.length === 0) {return renderGalleryEmptyState();}

    const maxVisible = device === 'mobile' ? 6 : 10;
    const visibleItems = normalizedItems.slice(0, maxVisible);
    const remainingCount = normalizedItems.length - maxVisible;

    if (normalizedItems.length <= 2) {
      return (
        <div className="py-8 px-4">
          <div className={cn('mx-auto flex items-center justify-center gap-4', normalizedItems.length === 1 ? 'max-w-md' : 'max-w-2xl')}>
            {normalizedItems.map((photo, idx) => (
              <div
                key={photo.id}
                className={cn('flex-1 rounded-xl overflow-hidden cursor-pointer group border relative', idx % 2 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]')}
                style={{ backgroundColor: colors.neutralSurface, borderColor: colors.neutralBorder }}
                onClick={() =>{  setSelectedPhoto(photo); }}
              >
                {photo.url ? (
                  <SiteImage src={photo.url} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: colors.placeholderBg }}><ImageIcon size={40} style={{ color: colors.placeholderIcon }} /></div>
                )}
                <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: layoutAccent }} />
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="py-8 px-4">
        <div className={cn(
          'gap-3 rounded-lg border p-2',
          device === 'mobile' ? 'columns-2' : (device === 'tablet' ? 'columns-3' : 'columns-4')
        )} style={{ backgroundColor: colors.neutralBackground, borderColor: colors.neutralBorder }}>
          {visibleItems.map((photo, idx) => {
            const heights = ['h-48', 'h-64', 'h-56', 'h-72', 'h-52', 'h-60'];
            const heightClass = heights[idx % heights.length];

            return (
              <div
                key={photo.id}
                className={cn('mb-3 break-inside-avoid rounded-xl overflow-hidden cursor-pointer group relative border', heightClass)}
                style={{ backgroundColor: colors.neutralSurface, borderColor: colors.neutralBorder }}
                onClick={() =>{  setSelectedPhoto(photo); }}
              >
                {photo.url ? (
                  <SiteImage src={photo.url} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: colors.placeholderBg }}><ImageIcon size={28} style={{ color: colors.placeholderIcon }} /></div>
                )}
                <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: layoutAccent }} />
                <div className="absolute inset-0 border-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ borderColor: layoutAccent }} />
              </div>
            );
          })}
        </div>
        {remainingCount > 0 && (
          <div className="flex items-center justify-center mt-4">
            <span className="text-sm font-medium px-4 py-2 rounded-full border" style={{ backgroundColor: colors.badgeBg, color: colors.badgeText, borderColor: colors.neutralBorder }}>
              +{remainingCount} ảnh khác
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderGalleryContent = () => {
    const headerConfig = extractSectionHeaderConfig(config);
    const galleryFullWidth = (config.fullWidthDesktop as boolean) ?? false;
    
    return (
      <section className="w-full" style={{ backgroundColor: colors.neutralSurface }}>
        <div className={cn(
          'mx-auto px-3 py-8',
          galleryFullWidth ? 'max-w-none' : 'max-w-7xl',
        )}>
          <SectionHeader
            title={title}
            subtitle={headerConfig.subtitle}
            badgeText={headerConfig.badgeText}
            hideHeader={headerConfig.hideHeader}
            showTitle={headerConfig.showTitle}
            showSubtitle={headerConfig.showSubtitle}
            showBadge={headerConfig.showBadge}
            headerAlign={headerConfig.headerAlign}
            titleColorPrimary={headerConfig.titleColorPrimary}
            subtitleAboveTitle={headerConfig.subtitleAboveTitle}
            uppercaseText={headerConfig.uppercaseText}
            brandColor={brandColor}
            className="mb-3"
          />
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 ease-out">
            {style === 'spotlight' && renderSpotlightStyle()}
            {style === 'explore' && renderExploreStyle()}
            {style === 'stories' && renderStoriesStyle()}
            {style === 'grid' && renderGalleryGridStyle()}
            {style === 'marquee' && renderGalleryMarqueeStyle()}
            {style === 'masonry' && renderGalleryMasonryStyle()}
          </div>
        </div>
        <GalleryLightbox
          photo={selectedPhoto}
          onClose={() =>{  setSelectedPhoto(null); }}
          photos={lightboxItems}
          currentIndex={currentPhotoIndex}
          onNavigate={handleLightboxNavigate}
          colors={colors}
        />
      </section>
    );
  };

  if (type === 'Gallery') {
    return renderGalleryContent();
  }

  // ============ PARTNERS STYLES (Grid, Marquee, Mono, Badge) ============

  // Extract header config for Partners
  const partnersHeaderConfig = extractSectionHeaderConfig(config);

  const renderPartnersWithHeader = (content: React.ReactNode) => {
    return (
      <section className="w-full bg-white py-8 px-3">
        <div className="mx-auto w-full max-w-7xl">
          {!partnersHeaderConfig.hideHeader && (
            <SectionHeader
              title={title}
              subtitle={partnersHeaderConfig.subtitle}
              badgeText={partnersHeaderConfig.badgeText}
              hideHeader={partnersHeaderConfig.hideHeader}
              showTitle={partnersHeaderConfig.showTitle}
              showSubtitle={partnersHeaderConfig.showSubtitle}
              showBadge={partnersHeaderConfig.showBadge}
              headerAlign={partnersHeaderConfig.headerAlign}
              titleColorPrimary={partnersHeaderConfig.titleColorPrimary}
              subtitleAboveTitle={partnersHeaderConfig.subtitleAboveTitle}
              uppercaseText={partnersHeaderConfig.uppercaseText}
              brandColor={brandColor}
            />
          )}
          {content}
        </div>
      </section>
    );
  };

  // Style: Classic Grid - Hover effect, responsive grid
  if (style === 'grid') {
    return renderPartnersWithHeader(
      <PartnersGridShared
        items={items}
        title={title}
        subheading={partnersSubheading}
        align={partnersAlign}
        displayMode={partnersDisplayMode}
        brandColor={brandColor}
        secondary={secondary}
        mode={mode}
        maxVisible={20}
        renderImage={(item, className) => (
          <SiteImage src={item.url} alt={item.name ?? ''} className={className} mode="logo" />
        )}
        skipHeader={true}
      />
    );
  }

  // Style: Marquee - 2-column layout (header left, logo grid right)
  if (style === 'marquee') {
    return (
      <PartnersMarqueeShared
        items={items}
        brandColor={brandColor}
        secondary={secondary}
        mode={mode}
        title={title}
        subheading={partnersSubheading}
        align={partnersAlign}
        displayMode={partnersDisplayMode}
        speed={1.15}
        renderImage={(item, className) => (
          <SiteImage src={item.url} alt={item.name ?? ''} className={className} mode="logo" />
        )}
        skipHeader={false}
      />
    );
  }

  if (style === 'clean') {
    return renderPartnersWithHeader(
      <PartnersCleanShared
        items={items}
        brandColor={brandColor}
        secondary={secondary}
        mode={mode}
        title={title}
        subheading={partnersSubheading}
        align={partnersAlign}
        displayMode={partnersDisplayMode}
        renderImage={(item, className) => (
          <SiteImage src={item.url} alt={item.name ?? ''} className={className} mode="logo" />
        )}
        skipHeader={true}
      />
    );
  }

  // Style: Carousel - Horizontal scrollable với navigation và drag scroll
  if (style === 'carousel') {
    const normalizedItems = items.map((item, idx) => ({ ...item, id: idx }));

    return renderPartnersWithHeader(
      <PartnersCarouselShared
        items={normalizedItems}
        brandColor={brandColor}
        secondary={secondary}
        mode={mode}
        title={title}
        subheading={partnersSubheading}
        align={partnersAlign}
        displayMode={partnersDisplayMode}
        openInNewTab={false}
        renderImage={(item, className) => (
          <SiteImage src={item.url} alt={item.name ?? ''} className={className} mode="logo" />
        )}
        skipHeader={true}
      />
    );
  }

  if (style === 'logoCloud') {
    const normalizedItems = items.map((item, idx) => ({ ...item, id: idx }));

    return renderPartnersWithHeader(
      <PartnersLogoCloudShared
        items={normalizedItems}
        brandColor={brandColor}
        openInNewTab={false}
        renderImage={(item, className) => (
          <SiteImage src={item.url} alt={item.name ?? 'Hình ảnh'} className={className} width={180} height={80} mode="logo" />
        )}
      />
    );
  }

  if (style === 'divider') {
    return renderPartnersWithHeader(
      <PartnersDividerShared
        items={items}
        brandColor={brandColor}
        secondary={secondary}
        mode={mode}
        title={title}
        subheading={partnersSubheading}
        align={partnersAlign}
        displayMode={partnersDisplayMode}
        renderImage={(item, className) => (
          <SiteImage src={item.url} alt={item.name ?? ''} className={className} mode="logo" />
        )}
        skipHeader={true}
      />
    );
  }

  // Style: Badge - Compact badges with name (default fallback)
  return renderPartnersWithHeader(
    <PartnersBadgeShared
      items={items}
      brandColor={brandColor}
      secondary={secondary}
      mode={mode}
      title={title}
      subheading={partnersSubheading}
      align={partnersAlign}
      displayMode={partnersDisplayMode}
      maxVisible={6}
      variant="site"
      renderImage={(item, className) => (
        <SiteImage src={item.url} alt={item.name ?? ''} className={className} mode="logo" />
      )}
      skipHeader={true}
    />
  );
}

// ============ PRODUCT CATEGORIES SECTION ============
// Best Practices: Clear navigation, visual appeal, mobile optimization, hover effects
// 8 styles: grid, carousel, cards, marquee, circular, icon-grid, mosaic, compact-grid
import { ProductCategoriesSectionShared } from '@/app/admin/home-components/product-categories/_components/ProductCategoriesSectionShared';
import type { ProductCategoriesAlign, ProductCategoriesResolvedItem, ProductCategoriesStyle } from '@/app/admin/home-components/product-categories/_types';

function ProductCategoriesSection({ config, brandColor, secondary, mode, title }: { config: Record<string, unknown>; brandColor: string;
  secondary: string; mode: 'single' | 'dual'; title: string }) {
  const categoriesConfig = (config.categories as { categoryId: string; customImage?: string; imageMode?: string }[]) || [];
  const style = (config.style as ProductCategoriesStyle) || 'grid';
  const showProductCount = (config.showProductCount as boolean) ?? true;
  const subtitle = typeof config.subtitle === 'string'
    ? config.subtitle
    : typeof config.subheading === 'string'
      ? config.subheading
      : '';
  const headerAlign = (config.headerAlign as ProductCategoriesAlign) ?? (config.align as ProductCategoriesAlign) ?? 'center';
  const colors = React.useMemo(() => getProductCategoriesColors(brandColor, secondary, mode), [brandColor, secondary, mode]);
  const [device, setDevice] = React.useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  
  const categoriesData = useQuery(api.productCategories.listActive);
  const productsData = useQuery(api.products.listPublicResolved, {});
  
  const categoryMap = React.useMemo(() => {
    const map: Record<string, { name: string; slug: string; image?: string; description?: string }> = {};
    if (categoriesData) {
      for (const cat of categoriesData) {
        map[cat._id] = cat;
      }
    }
    return map;
  }, [categoriesData]);
  
  const productCountMap = React.useMemo(() => {
    const map: Record<string, number> = {};
    if (productsData) {
      for (const p of productsData) {
        map[p.categoryId] = (map[p.categoryId] || 0) + 1;
      }
    }
    return map;
  }, [productsData]);
  const productImageMap = React.useMemo(() => {
    const map: Record<string, string | undefined> = {};
    if (productsData) {
      for (const product of productsData) {
        map[product._id] = product.image;
      }
    }
    return map;
  }, [productsData]);

  React.useEffect(() => {
    const updateDevice = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDevice('mobile');
        return;
      }
      if (width < 1024) {
        setDevice('tablet');
        return;
      }
      setDevice('desktop');
    };

    updateDevice();
    window.addEventListener('resize', updateDevice);
    return () => window.removeEventListener('resize', updateDevice);
  }, []);
  
  const resolvedCategories = categoriesConfig
    .filter((item, index, arr) => arr.findIndex(i => i.categoryId === item.categoryId) === index)
    .map(item => {
      const cat = categoryMap[item.categoryId];
      if (!cat) {return null;}
      
      const imageMode = item.imageMode ?? 'default';
      let displayImage = cat.image;
      let displayIcon: string | undefined;
      
      if (imageMode === 'icon' && item.customImage?.startsWith('icon:')) {
        displayIcon = item.customImage.replace('icon:', '');
        displayImage = undefined;
      } else if (imageMode === 'product-image' && item.customImage?.startsWith('product:')) {
        const productId = item.customImage.replace('product:', '');
        displayImage = productImageMap[productId] ?? cat.image;
      } else if (imageMode === 'upload' || imageMode === 'url') {
        displayImage = item.customImage ?? cat.image;
      }
      
      return {
        ...cat,
        id: item.categoryId,
        itemId: item.categoryId,
        displayImage,
        displayIcon,
        productCount: productCountMap[item.categoryId] || 0,
      };
    })
    .filter(Boolean) as ProductCategoriesResolvedItem[];

  // Demo mode: use embedded demo data instead of real categories
  const selectionMode = (config.selectionMode as string) || 'real';
  const demoCategories = Array.isArray(config.demoCategories) ? config.demoCategories as { id: string; name: string; image?: string; productCount?: number }[] : [];
  
  const finalItems: ProductCategoriesResolvedItem[] = selectionMode === 'demo' && demoCategories.length > 0
    ? demoCategories.map((item, idx) => ({
        id: item.id,
        itemId: idx,
        name: item.name || `Danh mục ${idx + 1}`,
        displayImage: item.image,
        productCount: item.productCount ?? 0,
      }))
    : resolvedCategories;

  if (finalItems.length === 0) {return null;}

  return (
    <ProductCategoriesSectionShared
      title={title}
      subtitle={subtitle}
      subheading={subtitle}
      headerAlign={headerAlign}
      align={headerAlign}
      hideHeader={config.hideHeader as boolean | undefined}
      showTitle={config.showTitle as boolean | undefined}
      showSubtitle={config.showSubtitle as boolean | undefined}
      titleColorPrimary={config.titleColorPrimary as boolean | undefined}
      subtitleAboveTitle={config.subtitleAboveTitle as boolean | undefined}
      uppercaseText={config.uppercaseText as boolean | undefined}
      showBadge={config.showBadge as boolean | undefined}
      badgeText={config.badgeText as string | undefined}
      brandColor={brandColor}
      style={style}
      items={finalItems}
      colors={colors}
      context="site"
      device={device}
      mode={mode}
      showProductCount={showProductCount}
      viewAllHref="/products"
      getItemHref={(item) => item.slug ? `/products?category=${item.slug}` : '/products'}
      renderImage={(item, className) => (
        item.displayImage
          ? <SiteImage src={item.displayImage} alt={item.name} className={className} />
          : <div className={cn('flex h-full w-full items-center justify-center bg-slate-100', className)}><Package size={28} className="text-slate-300" /></div>
      )}
    />
  );
}

// ============ CATEGORY PRODUCTS SECTION ============
// Sản phẩm theo danh mục - Mỗi section là 1 danh mục với các sản phẩm thuộc danh mục đó
type CategoryProductsStyle = 'grid' | 'carousel' | 'cards' | 'bento' | 'magazine' | 'showcase' | 'wine-grid';
type RuntimeDemoCategoryProductsSection = {
  id: string;
  categoryName: string;
  categoryImage?: string;
  products: {
    id: string;
    name: string;
    image?: string;
    price?: number;
    salePrice?: number;
  }[];
};

function CategoryProductsSection({
  config,
  brandColor,
  secondary,
  mode,
  title: _title,
}: {
  config: Record<string, unknown>;
  brandColor: string;
  secondary: string;
  mode: 'single' | 'dual';
  title: string;
}) {
  const sections = (config.sections as { categoryId: string; itemCount: number }[]) || [];
  const selectionMode = (config.selectionMode as 'real' | 'demo' | undefined) ?? 'real';
  const demoSections = (config.demoSections as RuntimeDemoCategoryProductsSection[] | undefined) ?? [];
  const style = (config.style as CategoryProductsStyle) || 'grid';
  const showViewAll = (config.showViewAll as boolean) ?? true;
  const columnsDesktop = (config.columnsDesktop as number) || 4;
  const columnsMobile = (config.columnsMobile as number) || 2;
  const sectionTitle = _title || 'Sản phẩm';
  const colors = React.useMemo(
    () => getCategoryProductsColors(brandColor, secondary, mode),
    [brandColor, secondary, mode]
  );

  // Query categories and products
  const categoriesData = useQuery(api.productCategories.listActive);
  const productsData = useQuery(api.products.listPublicResolved, { limit: 100 });
  const saleModeSetting = useQuery(api.admin.modules.getModuleSetting, { moduleKey: 'products', settingKey: 'saleMode' });
  const imageAspectRatioSetting = useQuery(api.admin.modules.getModuleSetting, { moduleKey: 'products', settingKey: 'defaultImageAspectRatio' });
  const routeModeSetting = useQuery(api.settings.getValue, { key: 'ia_route_mode', defaultValue: 'unified' });
  const routeMode = React.useMemo(() => normalizeRouteMode(routeModeSetting), [routeModeSetting]);
  const saleMode = React.useMemo(() => resolveSaleMode(saleModeSetting?.value), [saleModeSetting?.value]);
  const imageAspectRatio = React.useMemo(
    () => resolveProductImageAspectRatio(imageAspectRatioSetting?.value),
    [imageAspectRatioSetting?.value]
  );
  const imageAspectRatioStyle = React.useMemo(
    () => ({ aspectRatio: getProductImageAspectRatioCssValue(imageAspectRatio) }),
    [imageAspectRatio]
  );
  const { frame } = useProductFrameConfig();

  const resolvedSections = React.useMemo(() => {
    if (selectionMode === 'demo') {
      return demoSections
        .filter(section => section.categoryName?.trim() || section.products.length > 0)
        .map((section, index) => ({
          category: {
            _id: section.id,
            image: section.categoryImage,
            name: section.categoryName || `Danh mục demo ${index + 1}`,
            slug: undefined,
          },
          categoryId: section.id,
          itemCount: section.products.length,
          products: section.products.map(product => ({
            _id: product.id,
            categoryId: section.id,
            hasVariants: false,
            image: product.image,
            name: product.name || 'Tên sản phẩm',
            price: product.price,
            salePrice: product.salePrice,
          })),
        }));
    }

    return sections
      .map(section => {
        const category = categoriesData?.find(c => c._id === section.categoryId);
        if (!category) {return null;}

        const products = (productsData ?? [])
          .filter(p => p.categoryId === section.categoryId)
          .slice(0, section.itemCount);

        return {
          ...section,
          category,
          products,
        };
      })
      .filter(Boolean) as {
        categoryId: string;
        itemCount: number;
        category: { _id: string; name: string; slug?: string; image?: string };
        products: { _id: string; name: string; image?: string; price?: number; salePrice?: number; slug?: string; hasVariants?: boolean }[];
      }[];
  }, [categoriesData, demoSections, productsData, sections, selectionMode]);

  const getGridCols = () => {
    switch (columnsDesktop) {
      case 3: { return 'md:grid-cols-3';
      }
      case 5: { return 'md:grid-cols-5';
      }
      default: { return 'md:grid-cols-4';
      }
    }
  };

  const getMobileGridCols = () => columnsMobile === 1 ? 'grid-cols-1' : 'grid-cols-2';

  const getPriceDisplay = (price?: number, salePrice?: number, isRangeFromVariant?: boolean) =>
    getHomeComponentPriceLabel({ saleMode, price, salePrice, isRangeFromVariant });
  const formatComparePrice = (price?: number) =>
    price ? getHomeComponentPriceLabel({ saleMode: 'cart', price }).label : '';
  const getProductDiscount = (product: { price?: number; salePrice?: number; hasVariants?: boolean }) => {
    const priceDisplay = getPriceDisplay(product.price, product.salePrice, product.hasVariants);
    const currentPrice = product.salePrice ?? product.price;
    if (!priceDisplay.comparePrice || !currentPrice || priceDisplay.comparePrice <= currentPrice) {return null;}
    return Math.round((1 - currentPrice / priceDisplay.comparePrice) * 100);
  };

  const resolveProductHref = React.useCallback((params: {
    product: { slug?: string; _id: string };
    categorySlug?: string;
  }) => buildDetailPath({
    categorySlug: params.categorySlug,
    mode: routeMode,
    moduleKey: 'products',
    recordSlug: params.product.slug ?? params.product._id,
  }), [routeMode]);

  const categorySlugMap = React.useMemo(() => {
    if (!categoriesData) {return new Map<string, string>();}
    return new Map(categoriesData.map((category) => [category._id, category.slug]));
  }, [categoriesData]);

  const resolveProductHrefByCategory = React.useCallback((params: {
    product: { slug?: string; _id: string };
    categoryId: string;
  }) => resolveProductHref({
    categorySlug: categorySlugMap.get(params.categoryId),
    product: params.product,
  }), [categorySlugMap, resolveProductHref]);

  // Product Card Component with Equal Height (line-clamp + min-height)
  const ProductCard = ({ product, categoryId }: { product: { _id: string; name: string; image?: string; price?: number; salePrice?: number; slug?: string; hasVariants?: boolean }; categoryId: string }) => (
    <a href={resolveProductHrefByCategory({ categoryId, product })} aria-label={`${sectionTitle}: ${product.name}`} className="group cursor-pointer flex flex-col h-full">
      <div className="rounded-lg overflow-hidden mb-2" style={{ ...imageAspectRatioStyle, backgroundColor: colors.imageBackground }}>
        {product.image ? (
          <SiteImage 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={24} style={{ color: colors.emptyStateIcon }} />
          </div>
        )}
        <ProductImageFrameOverlay frame={frame} />
      </div>
      <h4 className="font-medium text-sm line-clamp-2 min-h-[2.5rem]" style={{ color: colors.bodyText }}>{product.name || 'Tên sản phẩm'}</h4>
      <div className="flex flex-col mt-auto">
        {(() => {
          const priceDisplay = getPriceDisplay(product.price, product.salePrice, product.hasVariants);
          if (priceDisplay.comparePrice) {
            return (
              <>
                <span className="font-bold text-sm" style={{ color: colors.priceText }}>
                  {priceDisplay.label}
                </span>
                <span className="text-xs line-through" style={{ color: colors.mutedText }}>{formatComparePrice(priceDisplay.comparePrice)}</span>
              </>
            );
          }
          return (
            <span className="font-bold text-sm" style={{ color: colors.priceText }}>
              {priceDisplay.label}
            </span>
          );
        })()}
      </div>
    </a>
  );

  // Empty State Component with brandColor
  const EmptyProductsState = ({ message }: { message: string }) => (
    <div 
      className="text-center py-8 rounded-xl flex flex-col items-center justify-center"
      style={{ backgroundColor: colors.emptyStateBackground }}
    >
      <div 
        className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
        style={{ backgroundColor: colors.emptyStateIconBackground }}
      >
        <Package size={24} style={{ color: colors.emptyStateIcon }} />
      </div>
      <p className="text-sm" style={{ color: colors.emptyStateText }}>{message}</p>
    </div>
  );

  if (resolvedSections.length === 0) {
    return null;
  }

  // Style 1: Grid
  if (style === 'grid') {
    return (
      <div className="py-8 md:py-12 space-y-10 md:space-y-16">
        {resolvedSections.map((section, idx) => (
          <section key={idx} className="px-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold" style={{ color: colors.heading }}>{section.category.name}</h2>
                {showViewAll && (
                  <a 
                    href={`/products?category=${section.category.slug ?? section.category._id}`}
                    className="text-sm font-medium flex items-center gap-1 hover:underline px-3 py-1.5 rounded-lg border transition-colors"
                    style={{ borderColor: colors.buttonBorder, color: colors.buttonText }}
                  >
                    Xem danh mục
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                )}
              </div>
              
              {section.products.length > 0 ? (
                <div className={`grid gap-4 ${getMobileGridCols()} ${getGridCols()}`}>
                  {section.products.map((product) => (
                    <ProductCard key={product._id} product={product} categoryId={section.category._id} />
                  ))}
                </div>
              ) : (
                <EmptyProductsState message="Chưa có sản phẩm trong danh mục này" />
              )}
            </div>
          </section>
        ))}
      </div>
    );
  }

  // Style 2: Carousel
  if (style === 'carousel') {
    const CarouselSection = ({ section }: { section: typeof resolvedSections[number] }) => {
      const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        dragFree: true,
        containScroll: 'trimSnaps',
      });
      const [canScrollPrev, setCanScrollPrev] = React.useState(false);
      const [canScrollNext, setCanScrollNext] = React.useState(false);

      React.useEffect(() => {
        if (!emblaApi) { return; }

        const update = () => {
          setCanScrollPrev(emblaApi.canScrollPrev());
          setCanScrollNext(emblaApi.canScrollNext());
        };

        update();
        emblaApi.on('select', update);
        emblaApi.on('reInit', update);

        return () => {
          emblaApi.off('select', update);
          emblaApi.off('reInit', update);
        };
      }, [emblaApi]);

      return (
        <section>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between px-4 mb-4">
              <h2 className="text-xl md:text-2xl font-bold" style={{ color: colors.heading }}>{section.category.name}</h2>
              <div className="flex items-center gap-2">
                {showViewAll && (
                  <a
                    href={`/products?category=${section.category.slug ?? section.category._id}`}
                    className="text-sm font-medium flex items-center gap-1 underline"
                    style={{ color: colors.buttonText }}
                  >
                    Xem danh mục <ArrowRight size={16} />
                  </a>
                )}
                {(canScrollPrev || canScrollNext) && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label="Trước"
                      disabled={!canScrollPrev}
                      onClick={() => emblaApi?.scrollPrev()}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full transition-all"
                      style={canScrollPrev
                        ? { backgroundColor: `${colors.sectionAccent}18`, color: colors.sectionAccent }
                        : { opacity: 0.3, color: colors.mutedText ?? '#94a3b8' }}
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      type="button"
                      aria-label="Tiếp"
                      disabled={!canScrollNext}
                      onClick={() => emblaApi?.scrollNext()}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full transition-all"
                      style={canScrollNext
                        ? { backgroundColor: `${colors.sectionAccent}18`, color: colors.sectionAccent }
                        : { opacity: 0.3, color: colors.mutedText ?? '#94a3b8' }}
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {section.products.length > 0 ? (
              <div className="overflow-hidden px-4" ref={emblaRef}>
                <div className="flex gap-4 backface-hidden touch-pan-y">
                  {section.products.map((product) => (
                    <a
                      key={product._id}
                      href={resolveProductHrefByCategory({ categoryId: section.category._id, product })}
                      className="flex-none w-36 md:w-48 group cursor-grab active:cursor-grabbing select-none"
                      draggable={false}
                    >
                      <div className="rounded-lg overflow-hidden mb-2" style={{ ...imageAspectRatioStyle, backgroundColor: colors.imageBackground }}>
                        {product.image ? (
                          <SiteImage
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            draggable={false}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={24} style={{ color: colors.emptyStateIcon }} />
                          </div>
                        )}
                        <ProductImageFrameOverlay frame={frame} />
                      </div>
                      <h4 className="font-medium text-sm line-clamp-2 mb-1" style={{ color: colors.bodyText }}>{product.name}</h4>
                      <span className="font-bold text-base" style={{ color: colors.buttonText }}>
                        {getPriceDisplay(product.price, product.salePrice, product.hasVariants).label}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mx-4">
                <EmptyProductsState message="Chưa có sản phẩm" />
              </div>
            )}
          </div>
        </section>
      );
    };

    return (
      <div className="py-4 space-y-8 md:space-y-12">
        {resolvedSections.map((section, idx) => (
          <CarouselSection key={idx} section={section} />
        ))}
      </div>
    );
  }

  // Style 3: Cards - Modern cards with category header
  if (style === 'cards') {
    return (
      <div className="py-8 md:py-12 space-y-10 md:space-y-16">
        {resolvedSections.map((section, idx) => (
          <section key={idx} className="px-4">
            <div className="max-w-7xl mx-auto">
              <div 
                className="rounded-xl overflow-hidden"
                style={{ border: `1px solid ${colors.cardBorder}` }}
              >
                {/* Category Header */}
                <div 
                  className="px-4 py-3 flex items-center justify-between"
                  style={{ backgroundColor: colors.neutralBackground }}
                >
                  <div className="flex items-center gap-3">
                    {section.category.image && (
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-white">
                        <SiteImage 
                          src={section.category.image} 
                          alt={section.category.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    )}
                    <h2 className="text-lg font-bold" style={{ color: colors.heading }}>{section.category.name}</h2>
                  </div>
                  {showViewAll && (
                    <a 
                      href={`/products?category=${section.category.slug ?? section.category._id}`}
                      className="text-sm font-medium flex items-center gap-1 hover:underline px-3 py-1.5 rounded-lg transition-colors"
                      style={{ backgroundColor: colors.buttonBackground, border: `1px solid ${colors.buttonBorder}`, color: colors.buttonText }}
                    >
                      Xem danh mục
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  )}
                </div>
                
                {/* Products Grid */}
                <div className="p-4" style={{ backgroundColor: colors.cardBackground }}>
                  {section.products.length > 0 ? (
                    <div className={`grid gap-4 ${getMobileGridCols()} ${getGridCols()}`}>
                      {section.products.map((product) => (
                        <ProductCard key={product._id} product={product} categoryId={section.category._id} />
                      ))}
                    </div>
                  ) : (
                    <EmptyProductsState message="Chưa có sản phẩm" />
                  )}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    );
  }

  // Style 4: Bento - Featured product với bento grid
  if (style === 'bento') {
    return (
      <div className="py-8 md:py-12 space-y-10 md:space-y-16">
        {resolvedSections.map((section, idx) => {
          const featured = section.products[0];
          const others = section.products.slice(1, 5);
          
          return (
            <section key={idx} className="px-4">
              <div className="max-w-7xl mx-auto">
                {/* Header với accent line */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-1 h-8 rounded-full"
                      style={{ backgroundColor: colors.sectionAccent }}
                    />
                    <h2 className="text-xl md:text-2xl font-bold" style={{ color: colors.heading }}>{section.category.name}</h2>
                  </div>
                  {showViewAll && (
                    <a 
                      href={`/products?category=${section.category.slug ?? section.category._id}`}
                      className="text-sm font-medium flex items-center gap-1.5 px-4 py-2 rounded-full transition-all hover:shadow-md"
                      style={{ backgroundColor: colors.buttonBackground, border: `1px solid ${colors.buttonBorder}`, color: colors.buttonText }}
                    >
                      Xem danh mục
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  )}
                </div>
                
                {section.products.length === 0 ? (
                  <EmptyProductsState message="Chưa có sản phẩm" />
                ) : (
                  <>
                    {/* Mobile: 2 columns grid */}
                    <div className="grid grid-cols-2 gap-3 md:hidden">
                      {section.products.slice(0, 4).map((product) => (
                        <ProductCard key={product._id} product={product} categoryId={section.category._id} />
                      ))}
                    </div>
                    
                    {/* Desktop: Bento grid */}
                    <div className="hidden md:grid grid-cols-4 gap-4 auto-rows-[180px]">
                      {/* Featured - 2x2 */}
                      {featured && (
                        <a 
                          href={resolveProductHrefByCategory({ categoryId: section.category._id, product: featured })}
                          className="col-span-2 row-span-2 group cursor-pointer relative rounded-2xl overflow-hidden"
                          style={{ ...imageAspectRatioStyle, backgroundColor: colors.imageBackground }}
                        >
                          {featured.image ? (
                            <SiteImage 
                              src={featured.image} 
                              alt={featured.name} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={48} style={{ color: colors.emptyStateIcon }} />
                            </div>
                          )}
                          <ProductImageFrameOverlay frame={frame} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                            <span
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mb-2"
                              style={{ backgroundColor: colors.featuredBadgeBackground, color: colors.featuredBadgeText }}
                            >
                              Nổi bật
                            </span>
                            <h3 className="font-bold text-lg line-clamp-2 mb-1">{featured.name}</h3>
                            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
                              {(() => {
                                const priceDisplay = getPriceDisplay(featured?.price, featured?.salePrice, featured?.hasVariants);
                                if (priceDisplay.comparePrice) {
                                  return (
                                    <>
                                      <span className="font-bold text-lg">{priceDisplay.label}</span>
                                      <span className="text-xs text-white/60 line-through">{formatComparePrice(priceDisplay.comparePrice)}</span>
                                    </>
                                  );
                                }
                                return <span className="font-bold text-lg">{priceDisplay.label}</span>;
                              })()}
                            </div>
                          </div>
                        </a>
                      )}
                      
                      {/* Other products */}
                      {others.map((product) => (
                        <a 
                          key={product._id}
                          href={resolveProductHrefByCategory({ categoryId: section.category._id, product })}
                          className="group cursor-pointer relative rounded-xl overflow-hidden"
                          style={{ ...imageAspectRatioStyle, backgroundColor: colors.imageBackground }}
                        >
                          {product.image ? (
                            <SiteImage 
                              src={product.image} 
                              alt={product.name} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={24} style={{ color: colors.emptyStateIcon }} />
                            </div>
                          )}
                          <ProductImageFrameOverlay frame={frame} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform">
                            <h4 className="font-medium text-sm line-clamp-1">{product.name}</h4>
                            <span className="font-bold text-sm">{getPriceDisplay(product.price, product.salePrice, product.hasVariants).label}</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </section>
          );
        })}
      </div>
    );
  }

  // Style 5: Magazine - Editorial Grid với Featured Item + Grid nhỏ
  if (style === 'magazine') {
    return (
      <div className="py-8 md:py-12 space-y-12 md:space-y-16">
        {resolvedSections.map((section, sectionIdx) => {
          const featured = section.products[0];
          const gridItems = section.products.slice(1, 5);
          
          return (
            <section key={sectionIdx} className="px-4">
              <div className="max-w-7xl mx-auto">
                {/* Editorial Header */}
                <div className="flex items-end justify-between mb-6 pb-4 border-b-2" style={{ borderColor: colors.neutralBorder }}>
                  <div>
                    <span 
                      className="text-xs font-bold uppercase tracking-widest"
                      style={{ color: colors.pillText }}
                    >
                      Bộ sưu tập
                    </span>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mt-1" style={{ color: colors.heading }}>{section.category.name}</h2>
                  </div>
                  {showViewAll && (
                    <a 
                      href={`/products?category=${section.category.slug ?? section.category._id}`}
                      className="font-semibold flex items-center gap-2 transition-all hover:gap-3"
                      style={{ color: colors.buttonText }}
                    >
                      Xem tất cả
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  )}
                </div>
                
                {section.products.length === 0 ? (
                  <EmptyProductsState message="Chưa có sản phẩm" />
                ) : (
                  <>
                    {/* Mobile: 2-col grid */}
                    <div className="grid grid-cols-2 gap-3 md:hidden">
                      {section.products.slice(0, 4).map((product) => (
                        <ProductCard key={product._id} product={product} categoryId={section.category._id} />
                      ))}
                    </div>
                    
                    {/* Desktop: Featured (50%) + Grid 2x2 (50%) */}
                    <div className="hidden md:grid grid-cols-2 gap-6">
                      {/* Featured Item - Large */}
                      {featured && (
                        <a 
                          href={resolveProductHrefByCategory({ categoryId: section.category._id, product: featured })}
                          className="group cursor-pointer relative rounded-2xl overflow-hidden"
                          style={{ ...imageAspectRatioStyle, backgroundColor: colors.imageBackground }}
                        >
                          {featured.image ? (
                            <SiteImage 
                              src={featured.image} 
                              alt={featured.name} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={48} style={{ color: colors.emptyStateIcon }} />
                            </div>
                          )}
                          <ProductImageFrameOverlay frame={frame} />
                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                          {/* Content */}
                          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                            <span
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3"
                              style={{ backgroundColor: colors.featuredBadgeBackground, color: colors.featuredBadgeText }}
                            >
                              Nổi bật
                            </span>
                            <h3 className="font-bold text-xl md:text-2xl line-clamp-2 mb-2">{featured.name}</h3>
                            <div className="flex items-baseline gap-3">
                              {(() => {
                                const priceDisplay = getPriceDisplay(featured?.price, featured?.salePrice, featured?.hasVariants);
                                if (priceDisplay.comparePrice) {
                                  return (
                                    <>
                                      <span className="font-bold text-2xl">{priceDisplay.label}</span>
                                      <span className="text-sm text-white/60 line-through">{formatComparePrice(priceDisplay.comparePrice)}</span>
                                    </>
                                  );
                                }
                                return <span className="font-bold text-2xl">{priceDisplay.label}</span>;
                              })()}
                            </div>
                          </div>
                        </a>
                      )}
                      
                      {/* Grid 2x2 */}
                      <div className="grid grid-cols-2 gap-4">
                        {gridItems.map((product) => (
                          <a 
                            key={product._id}
                            href={resolveProductHrefByCategory({ categoryId: section.category._id, product })}
                            className="group cursor-pointer"
                          >
                            <div 
                              className="rounded-xl overflow-hidden mb-3 relative"
                              style={{ ...imageAspectRatioStyle, backgroundColor: colors.imageBackground }}
                            >
                              {product.image ? (
                                <SiteImage 
                                  src={product.image} 
                                  alt={product.name} 
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                <Package size={24} style={{ color: colors.emptyStateIcon }} />
                                </div>
                              )}
                              <ProductImageFrameOverlay frame={frame} />
                              {/* Quick view overlay */}
                              <div 
                                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              style={{ backgroundColor: colors.neutralSurface }}
                              >
                                <span 
                                className="px-4 py-2 rounded-full text-sm font-medium"
                                style={{ backgroundColor: colors.buttonBackground, border: `1px solid ${colors.buttonBorder}`, color: colors.buttonText }}
                                >
                                  Xem nhanh
                                </span>
                              </div>
                            </div>
                          <h4 className="font-medium text-sm line-clamp-2 min-h-[2.5rem]" style={{ color: colors.bodyText }}>{product.name}</h4>
                            <div className="flex items-baseline gap-2 mt-1">
                              {(() => {
                                const priceDisplay = getPriceDisplay(product.price, product.salePrice, product.hasVariants);
                                if (priceDisplay.comparePrice) {
                                  return (
                                    <>
                                    <span className="font-bold text-sm" style={{ color: colors.priceText }}>
                                        {priceDisplay.label}
                                      </span>
                                    <span className="text-xs line-through" style={{ color: colors.mutedText }}>{formatComparePrice(priceDisplay.comparePrice)}</span>
                                    </>
                                  );
                                }
                                return (
                                <span className="font-bold text-sm" style={{ color: colors.priceText }}>
                                    {priceDisplay.label}
                                  </span>
                                );
                              })()}
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </section>
          );
        })}
      </div>
    );
  }

  if (style === 'wine-grid') {
    return (
      <div className="w-full bg-white px-2 py-4">
        <div className="mx-auto flex w-full max-w-[1152px] flex-col gap-6">
          {resolvedSections.map((section, idx) => (
            <section
              key={idx}
              className="rounded-[24px] border border-[#f1f1f1] bg-white/[0.95]"
            >
              <div className="flex items-end justify-between px-4 py-5 md:px-6 md:py-6">
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-bold uppercase leading-8 tracking-[0.18em] text-[#1c1c1c] md:text-2xl">
                    {section.category.name}
                  </h3>
                </div>
                {showViewAll && (
                  <a
                    href={`/products?category=${section.category.slug ?? section.category._id}`}
                    aria-label="Xem thêm - Xem tất cả sản phẩm"
                    className="group ml-4 flex h-10 shrink-0 items-center justify-center rounded-full border border-[#ECAA4D] bg-white px-5 py-2 text-xs font-semibold uppercase leading-4 tracking-[0.28em] text-[#1c1c1c] transition-colors hover:bg-[#ECAA4D] hover:text-white"
                  >
                    <span className="flex items-center gap-1.5 whitespace-nowrap">
                      Xem thêm
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </a>
                )}
              </div>

              <div className="px-4 pb-5 md:px-6 md:pb-6">
                {section.products.length === 0 ? (
                  <EmptyProductsState message="Chưa có sản phẩm trong danh mục này" />
                ) : (
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {section.products.map((product) => {
                      const priceDisplay = getPriceDisplay(product.price, product.salePrice, product.hasVariants);
                      const discount = getProductDiscount(product);

                      return (
                        <article
                          key={product._id}
                          className="flex h-full flex-col overflow-hidden rounded-lg border border-[#f5f5f4] bg-white shadow-sm transition-all duration-300"
                        >
                          <a
                            href={resolveProductHrefByCategory({ categoryId: section.category._id, product })}
                            className="block"
                          >
                            <div className="relative aspect-square overflow-hidden border-b border-[#fafaf9] bg-white">
                              {discount !== null && (
                                <span className="absolute left-0 top-3 z-10 rounded-r-lg bg-[#9e1e2d] px-2.5 py-0.5 text-xs font-bold leading-4 text-white shadow-sm">
                                  -{discount}%
                                </span>
                              )}
                              <div className="relative h-full w-full">
                                {product.image ? (
                                  <SiteImage
                                    src={product.image}
                                    alt={product.name}
                                    className="absolute inset-0 h-full w-full object-contain p-1 transition-opacity duration-300"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center">
                                    <Package size={28} className="text-stone-300" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </a>

                          <div className="flex flex-1 flex-col p-3">
                            <a href={resolveProductHrefByCategory({ categoryId: section.category._id, product })}>
                              <h3 className="mb-2 line-clamp-2 font-bold leading-6 text-[#9b2c3b] transition-colors">
                                {product.name || 'Tên sản phẩm'}
                              </h3>
                            </a>
                            <div className="mb-2 flex flex-col gap-1" />
                            <div className="mt-auto flex items-end justify-between gap-2 border-t border-[#f5f5f4] pt-2">
                              <div className="flex flex-col">
                                {priceDisplay.comparePrice && (
                                  <span className="text-xs font-medium leading-4 text-stone-400 line-through">
                                    {formatComparePrice(priceDisplay.comparePrice)}
                                  </span>
                                )}
                                <span className="text-lg font-bold leading-7 text-[#9b2c3b]">
                                  {priceDisplay.label}
                                </span>
                              </div>
                              <a
                                href={resolveProductHrefByCategory({ categoryId: section.category._id, product })}
                                className="shrink-0 rounded bg-[#9b2c3b] px-3 py-1.5 text-xs font-medium leading-4 text-white transition-colors"
                              >
                                Xem
                              </a>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    );
  }

  // Style 6: Showcase - Gradient overlay với hover effects lung linh
  return (
    <div className="py-8 md:py-12 space-y-10 md:space-y-16">
      {resolvedSections.map((section, idx) => (
        <section key={idx}>
          <div className="max-w-7xl mx-auto px-4">
            {/* Header với underline effect */}
            <div className="flex items-end justify-between mb-8">
              <div>
                <span 
                  className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: colors.pillText }}
                >
                  Bộ sưu tập
                </span>
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mt-1" style={{ color: colors.heading }}>{section.category.name}</h2>
                <div 
                  className="h-1 w-16 rounded-full mt-2"
                      style={{ backgroundColor: colors.sectionAccent }}
                />
              </div>
              {showViewAll && (
                <a 
                  href={`/products?category=${section.category.slug ?? section.category._id}`}
                  className="group flex items-center gap-2 text-sm font-medium transition-colors"
                      style={{ color: colors.buttonText }}
                >
                  Xem tất cả 
                  <span 
                    className="w-8 h-8 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform"
                        style={{ backgroundColor: colors.buttonBackground, border: `1px solid ${colors.buttonBorder}` }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </a>
              )}
            </div>
            
            {section.products.length === 0 ? (
              <EmptyProductsState message="Chưa có sản phẩm" />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {section.products.map((product) => (
                  <a 
                    key={product._id}
                    href={resolveProductHrefByCategory({ categoryId: section.category._id, product })}
                    className="group cursor-pointer block"
                  >
                    {/* Image Container với effects */}
                    <div className="relative rounded-2xl overflow-hidden mb-3" style={imageAspectRatioStyle}>
                      {/* Background gradient on hover */}
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                        style={{ background: `linear-gradient(135deg, ${colors.neutralBorder} 0%, transparent 50%, ${colors.neutralBackground} 100%)` }}
                      />
                      
                      {product.image ? (
                        <SiteImage 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: colors.imageBackground }}>
                          <Package size={32} style={{ color: colors.emptyStateIcon }} />
                        </div>
                      )}
                      <ProductImageFrameOverlay frame={frame} />
                      
                      {/* Gradient overlay bottom */}
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />
                      
                      {/* Quick action button */}
                      <div className="absolute bottom-3 left-3 right-3 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-30">
                        <span 
                          className="block w-full py-2.5 rounded-xl text-sm font-medium text-center backdrop-blur-sm"
                          style={{ backgroundColor: colors.buttonBackground, border: `1px solid ${colors.buttonBorder}`, color: colors.buttonText }}
                        >
                          Xem chi tiết
                        </span>
                      </div>
                      
                      {/* Badge for sale */}
                      {(() => {
                        const priceDisplay = getPriceDisplay(product.price, product.salePrice, product.hasVariants);
                        if (!priceDisplay.comparePrice) {return null;}
                        return (
                          <div className="absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-bold text-white bg-red-500 z-30">
                            -{Math.round((1 - (product.price ?? 0) / priceDisplay.comparePrice) * 100)}%
                          </div>
                        );
                      })()}
                    </div>
                    
                    {/* Product info */}
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm line-clamp-2 group-hover:opacity-80 transition-opacity" style={{ color: colors.bodyText }}>{product.name}</h4>
                      <div className="flex flex-col">
                        {(() => {
                          const priceDisplay = getPriceDisplay(product.price, product.salePrice, product.hasVariants);
                          if (priceDisplay.comparePrice) {
                            return (
                              <>
                                <span className="font-bold text-sm" style={{ color: colors.priceText }}>
                                  {priceDisplay.label}
                                </span>
                                <span className="text-xs line-through" style={{ color: colors.mutedText }}>{formatComparePrice(priceDisplay.comparePrice)}</span>
                              </>
                            );
                          }
                          return (
                            <span className="font-bold text-sm" style={{ color: colors.priceText }}>
                              {priceDisplay.label}
                            </span>
                          );
                        })()}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}

// ============ FEATURES SECTION ============
// Shared renderer parity with admin preview (6 styles)
function FeaturesSection({ config, brandColor, secondary, mode, title }: { config: Record<string, unknown>; brandColor: string;
  secondary: string; mode: 'single' | 'dual'; title: string }) {
  const rawItems = config.items as unknown;
  const items = Array.isArray(rawItems)
    ? rawItems
      .map((item, index) => {
        if (!item || typeof item !== 'object') {return null;}
        const source = item as Record<string, unknown>;
        const rawId = source.id;
        const normalizedId = typeof rawId === 'number'
          ? rawId
          : (typeof rawId === 'string' ? Number.parseInt(rawId, 10) : Number.NaN);

        return {
          id: Number.isFinite(normalizedId) ? normalizedId : index + 1,
          icon: typeof source.icon === 'string' && source.icon.trim().length > 0 ? source.icon : 'Zap',
          title: typeof source.title === 'string' ? source.title : '',
          description: typeof source.description === 'string' ? source.description : '',
          ...(typeof source.image === 'string' ? { image: source.image } : {}),
        };
      })
      .filter((item): item is { id: number; icon: string; title: string; description: string; image?: string } => item !== null)
    : [];

  const style = (() => {
    const value = config.style;
    if (value === 'iconGrid' || value === 'alternating' || value === 'compact' || value === 'cards' || value === 'carousel' || value === 'timeline' || value === 'carousel6') {
      return value;
    }
    return 'iconGrid';
  })();
  const showIcons = config.showIcons !== false;

  return (
    <FeaturesSectionShared
      context="site"
      items={items}
      style={style}
      showIcons={showIcons}
      title={title}
      brandColor={brandColor}
      secondary={secondary}
      mode={mode}
    />
  );
}

// ============ PROCESS SECTION ============
// 7 Professional Styles: Horizontal, Stepper, Cards, Accordion, Minimal, Grid, Alternating
function ProcessSection({ config, brandColor, secondary, mode, title }: { config: Record<string, unknown>; brandColor: string;
  secondary: string; mode: ProcessBrandMode; title: string }) {
  const steps = normalizeProcessRenderSteps(config.steps);
  if (steps.length === 0) {return null;}

  const style = normalizeProcessStyle(config.style);

  return (
    <ProcessSectionShared
      steps={steps}
      sectionTitle={title}
      style={style}
      brandColor={brandColor}
      secondary={secondary}
      mode={mode}
      context="site"
    />
  );
}

// ============ CLIENTS SECTION ============
function ClientsSection({
  config,
  brandColor,
  secondary,
  mode,
  title,
}: {
  config: Record<string, unknown>;
  brandColor: string;
  secondary: string;
  mode: ClientsBrandMode;
  title: string;
}) {
  const items = normalizeClientItems(config.items);
  if (items.length === 0) {return null;}

  const style = normalizeClientsStyleSafe(config.style);
  const tokens = getClientsColorTokens({
    primary: brandColor,
    secondary,
    mode,
  });

  return (
    <ClientsSectionShared
      context="site"
      title={title}
      style={style}
      items={items}
      tokens={tokens}
      device="desktop"
      hideHeader={config.hideHeader as boolean | undefined}
      showTitle={config.showTitle as boolean | undefined}
      subtitle={config.subtitle as string | undefined}
      showSubtitle={config.showSubtitle as boolean | undefined}
      headerAlign={config.headerAlign as ClientsHeaderAlign | undefined}
      titleColorPrimary={config.titleColorPrimary as boolean | undefined}
      subtitleAboveTitle={config.subtitleAboveTitle as boolean | undefined}
      uppercaseText={config.uppercaseText as boolean | undefined}
      showBadge={config.showBadge as boolean | undefined}
      badgeText={config.badgeText as string | undefined}
      noBorderRadius={config.noBorderRadius === true}
      brandColor={brandColor}
    />
  );
}

// ============ VIDEO SECTION ============
// 6 Styles: centered, split, fullwidth, cinema, minimal, parallax

function VideoSection({ config, brandColor, secondary, mode, title }: { config: Record<string, unknown>; brandColor: string;
  secondary: string; mode: VideoBrandMode; title: string }) {
  const normalizedConfig = normalizeVideoConfig(config);
  const style = normalizeVideoStyle(normalizedConfig.style);

  const tokens = React.useMemo(() => getVideoColorTokens({
    primary: brandColor,
    secondary,
    mode,
    style,
  }), [brandColor, secondary, mode, style]);

  return (
    <VideoSectionShared
      context="site"
      config={{ ...normalizedConfig, style }}
      style={style}
      tokens={tokens}
      title={title}
      device="desktop"
    />
  );
}

// ============ COUNTDOWN / PROMOTION SECTION ============
// 6 Styles: banner, floating, minimal, split, sticky, popup
// Best Practices: Expired state, accessibility (aria-live)
type CountdownStyle = 'banner' | 'floating' | 'minimal' | 'split' | 'sticky' | 'popup';

// Countdown Timer Hook with expired state
const useCountdownTimer = (endDate: string) => {
  const [timeLeft, setTimeLeft] = React.useState({ days: 0, hours: 0, isExpired: false, minutes: 0, seconds: 0 });

  React.useEffect(() => {
    const calculateTime = () => {
      const end = new Date(endDate).getTime();
      const now = Date.now();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, isExpired: true, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        isExpired: false,
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () =>{  clearInterval(timer); };
  }, [endDate]);

  return timeLeft;
};

function _CountdownSection({ config, brandColor, secondary, title }: { config: Record<string, unknown>; brandColor: string;
  secondary: string; title: string }) {
  const heading = (config.heading as string) || title;
  const subHeading = (config.subHeading as string) || '';
  const description = (config.description as string) || '';
  const endDate = (config.endDate as string) || DEFAULT_COUNTDOWN_END_DATE;
  const buttonText = (config.buttonText as string) || '';
  const buttonLink = (config.buttonLink as string) || '#';
  const backgroundImage = (config.backgroundImage as string) || '';
  const discountText = (config.discountText as string) || '';
  const showDays = config.showDays !== false;
  const showHours = config.showHours !== false;
  const showMinutes = config.showMinutes !== false;
  const showSeconds = config.showSeconds !== false;
  const style = (config.style as CountdownStyle) || 'banner';

  const timeLeft = useCountdownTimer(endDate);
  
  // Popup dismiss state - show once per session, dismiss on X/background/skip click
  const [isPopupDismissed, setIsPopupDismissed] = React.useState(() => {
    if (typeof window === 'undefined') {return false;}
    return sessionStorage.getItem('countdown-popup-dismissed') === 'true';
  });
  
  const dismissPopup = () => {
    setIsPopupDismissed(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('countdown-popup-dismissed', 'true');
    }
  };

  // Time Unit Component
  const TimeUnit = ({ value, label, variant = 'default' }: { value: number; label: string; variant?: 'default' | 'light' | 'outlined' }) => {
    if (variant === 'light') {
      return (
        <div className="flex flex-col items-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[50px] md:min-w-[60px]">
            <span className="text-2xl md:text-3xl font-bold text-white tabular-nums">{String(value).padStart(2, '0')}</span>
          </div>
          <span className="text-xs text-white/80 mt-1 uppercase tracking-wider">{label}</span>
        </div>
      );
    }
    if (variant === 'outlined') {
      return (
        <div className="flex flex-col items-center">
          <div className="border-2 rounded-lg px-3 py-2 min-w-[50px] md:min-w-[60px]" style={{ borderColor: secondary }}>
            <span className="text-2xl md:text-3xl font-bold tabular-nums" style={{ color: secondary }}>{String(value).padStart(2, '0')}</span>
          </div>
          <span className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{label}</span>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center">
        <div className="rounded-lg px-3 py-2 min-w-[50px] md:min-w-[60px] text-white" style={{ backgroundColor: brandColor }}>
          <span className="text-2xl md:text-3xl font-bold tabular-nums">{String(value).padStart(2, '0')}</span>
        </div>
        <span className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{label}</span>
      </div>
    );
  };

  // Timer Display
  const renderTimerDisplay = (variant: 'default' | 'light' | 'outlined' = 'default') => (
    <div className="flex items-center gap-2 md:gap-3">
      {showDays && (
        <>
          <TimeUnit value={timeLeft.days} label="Ngày" variant={variant} />
          <span className={`text-xl font-bold ${variant === 'light' ? 'text-white/60' : 'text-slate-300'}`}>:</span>
        </>
      )}
      {showHours && (
        <>
          <TimeUnit value={timeLeft.hours} label="Giờ" variant={variant} />
          <span className={`text-xl font-bold ${variant === 'light' ? 'text-white/60' : 'text-slate-300'}`}>:</span>
        </>
      )}
      {showMinutes && (
        <>
          <TimeUnit value={timeLeft.minutes} label="Phút" variant={variant} />
          {showSeconds && <span className={`text-xl font-bold ${variant === 'light' ? 'text-white/60' : 'text-slate-300'}`}>:</span>}
        </>
      )}
      {showSeconds && <TimeUnit value={timeLeft.seconds} label="Giây" variant={variant} />}
    </div>
  );

  // Style 1: Banner
  if (style === 'banner') {
    return (
      <section 
        className="relative w-full py-10 md:py-16 px-4 overflow-hidden"
        style={{ 
          background: backgroundImage 
            ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${backgroundImage}) center/cover`
            : `linear-gradient(135deg,  0%, cc 100%)`
        }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: 'white' }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: 'white' }} />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          {discountText && (
            <div className="inline-block mb-4">
              <span className="bg-yellow-400 text-yellow-900 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider animate-pulse">{discountText}</span>
            </div>
          )}
          {subHeading && <p className="text-white/80 text-sm md:text-base uppercase tracking-wider mb-2">{subHeading}</p>}
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">{heading}</h2>
          {description && <p className="text-white/90 mb-6 max-w-2xl mx-auto">{description}</p>}
          <div className="flex justify-center mb-6">{renderTimerDisplay('light')}</div>
          {buttonText && (
            <a href={buttonLink} className="inline-flex items-center gap-2 px-8 py-3 bg-white rounded-lg font-semibold transition-transform hover:scale-105" style={{ color: secondary }}>
              {buttonText}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          )}
        </div>
      </section>
    );
  }

  // Style 2: Floating
  if (style === 'floating') {
    return (
      <section className="py-8 md:py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div 
            className="relative rounded-2xl overflow-hidden shadow-2xl"
            style={{ 
              background: backgroundImage 
                ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${backgroundImage}) center/cover`
                : `linear-gradient(135deg, ee 0%,  100%)`
            }}
          >
            {discountText && (
              <div className="absolute -right-12 top-6 rotate-45 bg-yellow-400 text-yellow-900 px-12 py-1 text-sm font-bold shadow-lg">{discountText}</div>
            )}
            <div className="p-6 md:p-10 text-center">
              {subHeading && (
                <div className="inline-block mb-3 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                  <span className="text-xs md:text-sm text-white font-medium uppercase tracking-wider">{subHeading}</span>
                </div>
              )}
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3">{heading}</h2>
              {description && <p className="text-white/80 mb-6 text-sm md:text-base">{description}</p>}
              <div className="flex justify-center mb-6">{renderTimerDisplay('light')}</div>
              {buttonText && (
                <a href={buttonLink} className="inline-flex items-center gap-2 px-6 py-2.5 bg-white rounded-full font-semibold text-sm transition-all hover:shadow-lg hover:scale-105" style={{ color: secondary }}>
                  {buttonText}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Style 3: Minimal
  if (style === 'minimal') {
    return (
      <section className="py-10 md:py-14 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 text-center md:text-left">
                {discountText && (
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3" style={{ backgroundColor: `${secondary}15`, color: secondary }}>{discountText}</span>
                )}
                {subHeading && <p className="text-sm text-slate-500 mb-1">{subHeading}</p>}
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">{heading}</h2>
                {description && <p className="text-slate-500 text-sm mb-4">{description}</p>}
                {buttonText && (
                  <a href={buttonLink} className="hidden md:inline-flex items-center gap-2 px-5 py-2 rounded-lg font-medium text-sm text-white transition-colors hover:opacity-90" style={{ backgroundColor: brandColor }}>
                    {buttonText}
                  </a>
                )}
              </div>
              <div className="flex flex-col items-center">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-3">Kết thúc sau</p>
                {renderTimerDisplay('outlined')}
                {buttonText && (
                  <a href={buttonLink} className="md:hidden inline-flex items-center gap-2 px-5 py-2 rounded-lg font-medium text-sm text-white mt-4 transition-colors hover:opacity-90" style={{ backgroundColor: brandColor }}>
                    {buttonText}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Expired State Component
  const renderExpiredState = (variant: 'default' | 'light' = 'default') => (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${variant === 'light' ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'}`}>
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>Khuyến mãi đã kết thúc</span>
    </div>
  );

  // Style 4: Split
  if (style === 'split') {
    return (
      <section className="py-8 md:py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl overflow-hidden shadow-lg grid grid-cols-1 md:grid-cols-2">
            <div 
              className="relative flex items-center justify-center min-h-[200px] md:min-h-[300px]"
              style={{ 
                background: backgroundImage 
                  ? `url(${backgroundImage}) center/cover`
                  : `linear-gradient(135deg, dd 0%,  100%)`
              }}
            >
              {!backgroundImage && (
                <div className="text-center text-white p-6">
                  {discountText && <div className="text-5xl md:text-7xl font-black mb-2">{discountText}</div>}
                  <div className="text-lg md:text-xl font-medium opacity-90">GIẢM GIÁ</div>
                </div>
              )}
              {backgroundImage && discountText && (
                <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-lg font-bold text-xl">{discountText}</div>
              )}
            </div>
            <div className="bg-white p-6 md:p-8 flex flex-col justify-center">
              {subHeading && <p className="text-sm uppercase tracking-wider mb-2" style={{ color: secondary }}>{subHeading}</p>}
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">{heading}</h2>
              {description && <p className="text-slate-500 text-sm mb-5">{description}</p>}
              <div className="mb-5">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Còn lại</p>
                {timeLeft.isExpired ? renderExpiredState() : renderTimerDisplay('default')}
              </div>
              {buttonText && !timeLeft.isExpired && (
                <a href={buttonLink} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90 w-full md:w-auto" style={{ backgroundColor: brandColor }}>
                  {buttonText}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Style 5: Sticky - Compact top bar
  if (style === 'sticky') {
    return (
      <section 
        className="w-full py-3 px-4"
        style={{ backgroundColor: brandColor }}
        role="banner"
        aria-label="Khuyến mãi có thời hạn"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left">
              {discountText && (
                <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold uppercase">{discountText}</span>
              )}
              <span className="text-white font-semibold text-sm md:text-base">{heading}</span>
            </div>
            <div className="flex items-center gap-2">
              {timeLeft.isExpired ? (
                <span className="text-white/80 text-sm">Đã kết thúc</span>
              ) : (
                <div className="flex items-center gap-1.5 text-white font-mono" role="timer" aria-live="polite">
                  {showDays && (
                    <>
                      <span className="bg-white/20 px-2 py-1 rounded text-sm font-bold">{String(timeLeft.days).padStart(2, '0')}</span>
                      <span className="text-white/60">:</span>
                    </>
                  )}
                  {showHours && (
                    <>
                      <span className="bg-white/20 px-2 py-1 rounded text-sm font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
                      <span className="text-white/60">:</span>
                    </>
                  )}
                  {showMinutes && (
                    <>
                      <span className="bg-white/20 px-2 py-1 rounded text-sm font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
                      {showSeconds && <span className="text-white/60">:</span>}
                    </>
                  )}
                  {showSeconds && (
                    <span className="bg-white/20 px-2 py-1 rounded text-sm font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  )}
                </div>
              )}
            </div>
            {buttonText && !timeLeft.isExpired && (
              <a href={buttonLink} className="bg-white px-4 py-1.5 rounded-full text-sm font-semibold transition-transform hover:scale-105 whitespace-nowrap" style={{ color: secondary }}>
                {buttonText}
              </a>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Style 6: Popup - Full screen modal overlay (default fallback)
  // Only show once per session, can dismiss by clicking X, background, or "Để sau"
  if (style === 'popup' && isPopupDismissed) {
    return null; // Don't render if already dismissed this session
  }
  
  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[9999]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="countdown-popup-title"
      onClick={dismissPopup} // Click background to dismiss
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl overflow-hidden relative w-full max-w-md animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) =>{  e.stopPropagation(); }} // Prevent dismiss when clicking popup content
      >
        {/* Close button */}
        <button 
          type="button" 
          onClick={dismissPopup}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-700 z-10 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Image/Visual header */}
        <div 
          className="h-36 md:h-44 flex items-center justify-center"
          style={{ 
            background: backgroundImage 
              ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${backgroundImage}) center/cover`
              : `linear-gradient(135deg, ee 0%,  100%)`
          }}
        >
          {discountText && (
            <div className="text-center text-white">
              <div className="text-5xl md:text-6xl font-black">{discountText}</div>
              <div className="text-sm font-medium opacity-80 mt-1">{subHeading || 'GIẢM GIÁ'}</div>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-5 md:p-6 text-center">
          <h3 id="countdown-popup-title" className="text-xl md:text-2xl font-bold text-slate-900 mb-2">{heading}</h3>
          {description && <p className="text-slate-500 text-sm mb-4 line-clamp-2">{description}</p>}
          <div className="mb-4">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Còn lại</p>
            {timeLeft.isExpired ? renderExpiredState() : renderTimerDisplay('default')}
          </div>
          {buttonText && !timeLeft.isExpired && (
            <a href={buttonLink} className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90" style={{ backgroundColor: brandColor }}>
              {buttonText}
            </a>
          )}
          {/* Skip link */}
          <button type="button" onClick={dismissPopup} className="text-slate-400 text-xs mt-3 hover:text-slate-600 transition-colors">
            Để sau
          </button>
        </div>
      </div>
    </div>
  );
}

// ============ FOOTER SECTION ============
// 6 Styles: classic, modern, corporate, minimal, centered, stacked
// Synced with previews.tsx FooterPreview
interface FooterColumn { id?: number | string; title: string; links: { label: string; url: string }[] }
interface SocialLinkItem { id?: number | string; platform: string; url: string; icon: string }

const SOCIAL_ORIGINAL_COLORS: Record<string, { bg: string; icon: string }> = {
  facebook: { bg: '#1877f2', icon: '#ffffff' },
  instagram: { bg: '#e1306c', icon: '#ffffff' },
  youtube: { bg: '#ff0000', icon: '#ffffff' },
  tiktok: { bg: '#000000', icon: '#ffffff' },
  zalo: { bg: '#0084ff', icon: '#ffffff' },
  twitter: { bg: '#1da1f2', icon: '#ffffff' },
  x: { bg: '#000000', icon: '#ffffff' },
  pinterest: { bg: '#E60023', icon: '#ffffff' },
  linkedin: { bg: '#0a66c2', icon: '#ffffff' },
  github: { bg: '#0f172a', icon: '#ffffff' },
};

function FooterSection({
  config,
  brandColor,
  secondary,
  mode,
}: {
  config: Record<string, unknown>;
  brandColor: string;
  secondary: string;
  mode: FooterBrandMode;
}) {
  const style = (config.style as FooterStyle) || 'classic';
  const logo = (config.logo as string) || '';
  const description = (config.description as string) || 'Đối tác tin cậy của bạn trong mọi giải pháp công nghệ.';
  const columns = (config.columns as FooterColumn[]) || [];
  const socialLinks = (config.socialLinks as SocialLinkItem[]) || [];
  const copyright = (config.copyright as string) || '';
  const snapshotSite = config._snapshotSite as { site_name?: string } | undefined;
  const siteName = snapshotSite?.site_name || 'VietAdmin';
  const logoName = typeof config.logoName === 'string' ? config.logoName.trim() : '';
  const logoAlt = logoName || siteName || 'Logo';
  const logoInitial = (logoName || siteName || 'V').charAt(0);
  const currentYear = new Date().getFullYear();
  const showSocialLinks = config.showSocialLinks !== false;
  const showBctLogo = config.showBctLogo === true;
  const bctLogoType = (config.bctLogoType as 'thong-bao' | 'dang-ky') ?? 'thong-bao';
  const bctLogoLink = typeof config.bctLogoLink === 'string' ? config.bctLogoLink.trim() : '';
  const bctLogoSrc = bctLogoType === 'dang-ky'
    ? '/images/bct/logo-da-dang-ky-bct.webp'
    : '/images/bct/logo-da-thong-bao-bct.png';
  const colors: FooterLayoutColors = getFooterLayoutColors(style, brandColor, secondary, mode);
  const logoSizeLevel = typeof config.logoSizeLevel === 'number' ? config.logoSizeLevel : 1;
  const resolveLogoSize = (baseSize: number) => getFooterLogoSize(baseSize, logoSizeLevel);
  const logoBackgroundStyle = typeof config.logoBackgroundStyle === 'string' ? config.logoBackgroundStyle as FooterLogoBackgroundStyle : 'none';
  const useOriginalSocialIconColors = config.useOriginalSocialIconColors !== false;
  const resolveSocialStyles = (platform: string, fallbackBg: string, fallbackText: string) => {
    if (!useOriginalSocialIconColors) {
      return { bg: fallbackBg, color: fallbackText, border: '' };
    }
    const original = SOCIAL_ORIGINAL_COLORS[platform];
    if (!original) {
      return { bg: fallbackBg, color: fallbackText, border: '' };
    }
    const isIconDark = original.bg.toLowerCase() <= '#333333';
    const isFooterDark = colors.bg.toLowerCase() <= '#444444';
    const border = (isIconDark && isFooterDark) ? '1.5px solid rgba(255,255,255,0.25)' : '';
    return { bg: original.bg, color: original.icon, border };
  };

  const renderBctLogo = (className = 'h-10') => {
    if (!showBctLogo) {return null;}
    const image = (
      <SiteImage src={bctLogoSrc} alt="Bộ Công Thương" className={`${className} w-auto object-contain`} mode="decorative" />
    );
    if (!bctLogoLink) {return image;}
    return (
      <a href={bctLogoLink} target="_blank" rel="noopener noreferrer">
        {image}
      </a>
    );
  };
  const renderLogoMark = (baseSize: number, imageClassName = 'object-contain', fallbackColor = colors.textOnPrimary) => {
    const size = resolveLogoSize(baseSize);
    const content = logo
      ? <SiteImage src={logo} alt={logoAlt} className={imageClassName} style={{ width: size, height: 'auto' }} mode="logo" />
      : <div className="rounded-lg flex items-center justify-center text-xs font-bold" style={{ backgroundColor: colors.primary, color: fallbackColor, width: size, height: size }}>{logoInitial}</div>;

    if (logoBackgroundStyle === 'none') {
      return content;
    }

    return (
      <span
        className={getFooterLogoBackgroundClassName(logoBackgroundStyle)}
        style={getFooterLogoBackgroundStyle(logoBackgroundStyle, colors.primary)}
      >
        {content}
      </span>
    );
  };

  // Social icons
  const PinterestIcon = ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
    </svg>
  );
  const renderSocialIcon = (platform: string, size: number = 18) => {
    switch (platform) {
      case 'facebook': {
        return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
      }
      case 'instagram': {
        return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>;
      }
      case 'youtube': {
        return <LucideIcons.Youtube size={size} />;
      }
      case 'tiktok': {
        return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>;
      }
      case 'zalo': {
        return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12.49 10.2722v-.4496h1.3467v6.3218h-.7704a.576.576 0 01-.5763-.5729l-.0006.0005a3.273 3.273 0 01-1.9372.6321c-1.8138 0-3.2844-1.4697-3.2844-3.2823 0-1.8125 1.4706-3.2822 3.2844-3.2822a3.273 3.273 0 011.9372.6321l.0006.0005zM6.9188 7.7896v.205c0 .3823-.051.6944-.2995 1.0605l-.03.0343c-.0542.0615-.1815.206-.2421.2843L2.024 14.8h4.8948v.7682a.5764.5764 0 01-.5767.5761H0v-.3622c0-.4436.1102-.6414.2495-.8476L4.8582 9.23H.1922V7.7896h6.7266zm8.5513 8.3548a.4805.4805 0 01-.4803-.4798v-7.875h1.4416v8.3548H15.47zM20.6934 9.6C22.52 9.6 24 11.0807 24 12.9044c0 1.8252-1.4801 3.306-3.3066 3.306-1.8264 0-3.3066-1.4808-3.3066-3.306 0-1.8237 1.4802-3.3044 3.3066-3.3044zm-10.1412 5.253c1.0675 0 1.9324-.8645 1.9324-1.9312 0-1.065-.865-1.9295-1.9324-1.9295s-1.9324.8644-1.9324 1.9295c0 1.0667.865 1.9312 1.9324 1.9312zm10.1412-.0033c1.0737 0 1.945-.8707 1.945-1.9453 0-1.073-.8713-1.9436-1.945-1.9436-1.0753 0-1.945.8706-1.945 1.9436 0 1.0746.8697 1.9453 1.945 1.9453z"/></svg>;
      }
      case 'x': {
        return <X size={size} />;
      }
      case 'pinterest': {
        return <PinterestIcon size={size} />;
      }
      default: {
        return <Globe size={size} />;
      }
    }
  };

  const getSocials = () => socialLinks.length > 0 ? socialLinks : [
    { icon: 'facebook', platform: 'facebook', url: '#' },
    { icon: 'instagram', platform: 'instagram', url: '#' },
    { icon: 'youtube', platform: 'youtube', url: '#' }
  ];

  const getColumns = () => columns.length > 0 ? columns : [
    { links: [{ label: 'Giới thiệu', url: '/about' }, { label: 'Tuyển dụng', url: '/careers' }], title: 'Về chúng tôi' },
    { links: [{ label: 'FAQ', url: '/faq' }, { label: 'Liên hệ', url: '/contact' }], title: 'Hỗ trợ' }
  ];

  // Style 1: Classic — 4-Column Grid (Lofi Gym style)
  if (style === 'classic') {
    return (
      <footer className="w-full" style={{ backgroundColor: colors.classicBg }}>
        <div className="max-w-7xl mx-auto px-3 md:px-4 py-8 md:py-12">
          <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-12">
            <div className="md:col-span-4 space-y-3">
              {renderLogoMark(28)}
              {logoName && <span className="text-sm font-bold tracking-tight block" style={{ color: colors.heading }}>{logoName}</span>}
              <p className="text-xs leading-relaxed opacity-80" style={{ color: colors.textMuted }}>{description}</p>
            </div>
            <div className="md:col-span-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {getColumns().slice(0, 4).map((col, colIdx) => (
                <div key={col.id || `col-${colIdx}`}>
                  <h3 className="font-bold text-[10px] uppercase tracking-wider mb-3 pb-1" style={{ color: colors.heading, borderBottom: `2px solid ${colors.borderSoft}` }}>{col.title}</h3>
                  <ul className="space-y-1.5">
                    {col.links.map((link, lIdx) => (
                      <li key={lIdx}><span className="text-xs" style={{ color: colors.link }}>{link.label}</span></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="md:col-span-2 space-y-3">
              <h3 className="font-bold text-[10px] uppercase tracking-wider pb-1" style={{ color: colors.heading, borderBottom: `2px solid ${colors.borderSoft}` }}>Kết nối</h3>
              {showSocialLinks && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {getSocials().map((s, idx) => {
                    const st = resolveSocialStyles(s.platform, colors.socialBg, colors.socialText);
                    return <span key={idx} className="h-8 w-8 flex items-center justify-center rounded-full" style={{ backgroundColor: st.bg, color: st.color, ...(st.border ? { border: st.border } : {}) }}>{renderSocialIcon(s.platform, 16)}</span>;
                  })}
                </div>
              )}
              {renderBctLogo('h-12')}
            </div>
          </div>
        </div>
        {config.showCopyright !== false && (
          <div style={{ borderTop: `1px solid ${colors.borderSoft}` }}>
            <div className="max-w-7xl mx-auto px-3 md:px-4 py-3 flex items-center justify-center">
              <p className="text-[10px] opacity-70" style={{ color: colors.textSubtle }}>{copyright || `© ${currentYear} ${siteName}. All rights reserved.`}</p>
            </div>
          </div>
        )}
      </footer>
    );
  }

  // Style 2: Modern — Info-Rich (Sudes Nest inspired)
  if (style === 'modern') {
    const pc = colors.accent.replace('#', '%23');
    const seigaihaUrl = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='28'%3E%3Cpath d='M56 26v2h-7.75c2.3-1.3 4.94-2 7.75-2zm-26 2a14 14 0 0 0-7.75-2h-4.5A14 14 0 0 0 10 28H0v-2c4.26 0 8.17 1.38 11.36 3.7A13.98 13.98 0 0 1 22 26c3.87 0 7.44 1.56 10 4.1a13.98 13.98 0 0 1 10.64-3.7A15.99 15.99 0 0 1 56 26zM56 20v2c-4.26 0-8.17 1.38-11.36 3.7A13.98 13.98 0 0 0 34 22c-3.87 0-7.44 1.56-10 4.1A13.98 13.98 0 0 0 13.36 22.4 15.99 15.99 0 0 0 0 20v2c4.26 0 8.17-1.38 11.36-3.7A13.98 13.98 0 0 1 22 14c3.87 0 7.44 1.56 10 4.1A13.98 13.98 0 0 1 42.64 14.4 15.99 15.99 0 0 1 56 14v2c-4.26 0-8.17 1.38-11.36 3.7A13.98 13.98 0 0 0 34 16c-3.87 0-7.44 1.56-10 4.1A13.98 13.98 0 0 0 13.36 16.4 15.99 15.99 0 0 0 0 14v2a14 14 0 0 1 11.36 3.7A13.98 13.98 0 0 0 22 8c3.87 0 7.44 1.56 10 4.1A13.98 13.98 0 0 0 42.64 8.4 15.99 15.99 0 0 0 56 8v2c-4.26 0-8.17 1.38-11.36 3.7A13.98 13.98 0 0 1 34 10c-3.87 0-7.44 1.56-10 4.1A13.98 13.98 0 0 1 13.36 10.4 15.99 15.99 0 0 1 0 8V6c4.26 0 8.17 1.38 11.36 3.7A13.98 13.98 0 0 0 22 2c3.87 0 7.44 1.56 10 4.1A13.98 13.98 0 0 0 42.64 2.4 15.99 15.99 0 0 0 56 2V0H0v2a14 14 0 0 1 11.36 3.7A13.98 13.98 0 0 0 22-4c3.87 0 7.44 1.56 10 4.1A13.98 13.98 0 0 0 42.64-3.6 15.99 15.99 0 0 0 56-4' fill='none' stroke='${pc}' stroke-opacity='0.12' stroke-width='0.5'/%3E%3C/svg%3E")`;
    return (
      <footer className="w-full relative" style={{ backgroundColor: colors.bg }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: seigaihaUrl, backgroundSize: '56px 28px' }} />
        <div className="max-w-7xl mx-auto px-3 md:px-4 py-8 md:py-12 relative">
          <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-12">
            <div className="md:col-span-4 space-y-3">
              <div className="flex items-center gap-2">
                {renderLogoMark(28)}
                {logoName && <span className="text-sm font-bold tracking-tight" style={{ color: colors.heading }}>{logoName}</span>}
              </div>
              <p className="text-xs leading-relaxed" style={{ color: colors.textMuted }}>{description}</p>
              {showSocialLinks && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {getSocials().map((s, idx) => {
                    const st = resolveSocialStyles(s.platform, colors.socialBg, colors.socialText);
                    return <span key={idx} className="h-8 w-8 flex items-center justify-center rounded-full" style={{ backgroundColor: st.bg, color: st.color, ...(st.border ? { border: st.border } : {}) }}>{renderSocialIcon(s.platform, 16)}</span>;
                  })}
                </div>
              )}
              {renderBctLogo('h-12')}
            </div>
            <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {getColumns().slice(0, 4).map((col, colIdx) => (
                <div key={col.id || `col-${colIdx}`}>
                  <h3 className="font-bold text-[10px] uppercase tracking-wider mb-2 pb-1 flex items-center gap-1" style={{ color: colors.heading, borderBottom: `1.5px solid ${colors.accent}` }}>
                    <span style={{ color: colors.accent, fontSize: '8px' }}>◆</span> {col.title}
                  </h3>
                  <ul className="space-y-1.5">
                    {col.links.map((link, lIdx) => (
                      <li key={lIdx}><span className="text-xs" style={{ color: colors.link }}>{link.label}</span></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
        {config.showCopyright !== false && (
          <div className="w-full relative" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
            <div className="max-w-7xl mx-auto px-3 md:px-4 py-3 flex items-center justify-center">
              <p className="text-[10px]" style={{ color: colors.textSubtle }}>{copyright || `© ${currentYear} ${siteName}. All rights reserved.`}</p>
            </div>
          </div>
        )}
      </footer>
    );
  }

  // Style 3: Corporate — Split Horizontal Zones
  if (style === 'corporate') {
    return (
      <footer className="w-full py-8 md:py-12" style={{ backgroundColor: colors.bg, borderTop: `1px solid ${colors.border}` }}>
        <div className="max-w-7xl mx-auto px-3 md:px-4">
          <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-12 pb-6" style={{ borderBottom: `1px solid ${colors.border}` }}>
            <div className="md:col-span-5 space-y-2">
              <div className="flex items-center gap-2">
                {renderLogoMark(20)}
                {logoName && <span className="text-sm font-bold" style={{ color: colors.heading }}>{logoName}</span>}
              </div>
              <p className="text-xs leading-relaxed" style={{ color: colors.textMuted }}>{description}</p>
            </div>
            <div className="md:col-span-4">{renderBctLogo('h-10')}</div>
            <div className="md:col-span-3">
              {showSocialLinks && (
                <>
                  <h3 className="font-bold text-[10px] uppercase tracking-wider mb-2" style={{ color: colors.heading }}>Theo dõi</h3>
                  <div className="flex flex-wrap gap-2">
                    {getSocials().map((s, idx) => {
                      const st = resolveSocialStyles(s.platform, colors.socialBg, colors.socialText);
                      return <span key={idx} className="h-8 w-8 flex items-center justify-center rounded-lg" style={{ backgroundColor: st.bg, color: st.color, ...(st.border ? { border: st.border } : {}) }}>{renderSocialIcon(s.platform, 16)}</span>;
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {getColumns().slice(0, 4).map((col, colIdx) => (
              <div key={col.id || `col-${colIdx}`}>
                <h4 className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: colors.heading }}>{col.title}</h4>
                <ul className="space-y-1">
                  {col.links.map((link, lIdx) => (
                    <li key={lIdx}><span className="text-xs" style={{ color: colors.link }}>{link.label}</span></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {config.showCopyright !== false && (
            <div className="pt-3 flex items-center justify-center" style={{ borderTop: `1px solid ${colors.borderSoft}` }}>
              <p className="text-[10px]" style={{ color: colors.textSubtle }}>{copyright || `© ${currentYear} ${siteName}. All rights reserved.`}</p>
            </div>
          )}
        </div>
      </footer>
    );
  }

  // Style 4: Minimal — Compact Bar (Sudes Craft inspired)
  if (style === 'minimal') {
    const stripeColor = `${colors.accent}10`;
    const stripeBg = `repeating-linear-gradient(45deg, transparent, transparent 10px, ${stripeColor} 10px, ${stripeColor} 11px)`;
    return (
      <footer className="w-full relative" style={{ backgroundColor: colors.bg }}>
        <div className="absolute inset-0 pointer-events-none opacity-40" style={{ backgroundImage: stripeBg }} />
        <div className="max-w-7xl mx-auto px-3 md:px-4 py-8 md:py-12 relative">
          <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-12">
            <div className="md:col-span-4 space-y-3">
              <div className="flex items-center gap-2">
                {renderLogoMark(28)}
                {logoName && <span className="text-sm font-bold tracking-tight" style={{ color: colors.heading }}>{logoName}</span>}
              </div>
              <p className="text-xs leading-relaxed" style={{ color: colors.textMuted }}>{description}</p>
              {showSocialLinks && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {getSocials().map((s, idx) => {
                    const st = resolveSocialStyles(s.platform, colors.socialBg, colors.socialText);
                    return <span key={idx} className="h-7 w-7 flex items-center justify-center rounded-full" style={{ backgroundColor: st.bg, color: st.color, ...(st.border ? { border: st.border } : {}) }}>{renderSocialIcon(s.platform, 14)}</span>;
                  })}
                </div>
              )}
              {renderBctLogo('h-10')}
            </div>
            <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {getColumns().slice(0, 4).map((col, colIdx) => (
                <div key={col.id || `col-${colIdx}`}>
                  <h3 className="font-bold text-[10px] uppercase tracking-wider mb-2" style={{ color: colors.heading }}>{col.title}</h3>
                  <ul className="space-y-1.5">
                    {col.links.map((link, lIdx) => (
                      <li key={lIdx}><span className="text-xs" style={{ color: colors.link }}>{link.label}</span></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
        {config.showCopyright !== false && (
          <div className="w-full relative" style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}>
            <div className="max-w-7xl mx-auto px-3 md:px-4 py-3 flex items-center justify-center">
              <p className="text-[10px]" style={{ color: colors.textSubtle }}>{copyright || `© ${currentYear} ${siteName}. All rights reserved.`}</p>
            </div>
          </div>
        )}
      </footer>
    );
  }

  // Style 5: Centered — Magazine 4-Column (Bean Cargo inspired)
  if (style === 'centered') {
    return (
      <footer className="w-full" style={{ backgroundColor: colors.magazineBg }}>
        <div className="max-w-7xl mx-auto px-3 md:px-4 py-8 md:py-12">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-5">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {renderLogoMark(28)}
                {logoName && <span className="text-sm font-bold tracking-tight" style={{ color: colors.magazineHeading }}>{logoName}</span>}
              </div>
              <p className="text-xs leading-relaxed" style={{ color: colors.magazineTextMuted }}>{description}</p>
              {showSocialLinks && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {getSocials().map((s, idx) => {
                    const st = resolveSocialStyles(s.platform, colors.socialBg, colors.socialText);
                    return <span key={idx} className="h-7 w-7 flex items-center justify-center rounded-full" style={{ backgroundColor: st.bg, color: st.color, ...(st.border ? { border: st.border } : {}) }}>{renderSocialIcon(s.platform, 14)}</span>;
                  })}
                </div>
              )}
              {renderBctLogo('h-10')}
            </div>
            {getColumns().slice(0, 4).map((col, colIdx) => (
              <div key={col.id || `col-${colIdx}`}>
                <h3 className="font-bold text-[10px] tracking-wide mb-2" style={{ color: colors.magazineHeading }}>{col.title}</h3>
                <ul className="space-y-1.5">
                  {col.links.map((link, lIdx) => (
                    <li key={lIdx}><span className="text-xs" style={{ color: colors.magazineLink }}>{link.label}</span></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        {config.showCopyright !== false && (
          <div className="w-full" style={{ backgroundColor: colors.primary }}>
            <div className="max-w-7xl mx-auto px-3 md:px-4 py-3 flex items-center justify-center">
              <p className="text-[10px] font-medium" style={{ color: colors.textOnPrimary }}>{copyright || `© ${currentYear} ${siteName}. All rights reserved.`}</p>
            </div>
          </div>
        )}
      </footer>
    );
  }

  // Style 6: Stacked — Wave Decorative (Euro Moto parallax wave, default)
  return (
    <footer className="w-full relative overflow-x-clip" style={{ backgroundColor: 'transparent' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes rendererWaveMove {
          0% { transform: translate3d(-90px, 0, 0); }
          100% { transform: translate3d(85px, 0, 0); }
        }
        .renderer-wave-parallax > use {
          animation: rendererWaveMove 25s cubic-bezier(.55,.5,.45,.5) infinite;
        }
        .renderer-wave-parallax > use:nth-child(1) { animation-delay: -2s; animation-duration: 7s; opacity: 0.7; }
        .renderer-wave-parallax > use:nth-child(2) { animation-delay: -3s; animation-duration: 10s; opacity: 0.5; }
        .renderer-wave-parallax > use:nth-child(3) { animation-delay: -4s; animation-duration: 13s; opacity: 0.3; }
        .renderer-wave-parallax > use:nth-child(4) { animation-delay: -5s; animation-duration: 20s; opacity: 1; }
      `}} />
      <div className="w-full relative" style={{ marginBottom: '-1px' }}>
        <svg className="w-full block h-12 sm:h-16 md:h-20" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto" fill={colors.stackedTopBorder}>
          <defs><path id="renderer-gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" /></defs>
          <g className="renderer-wave-parallax">
            <use xlinkHref="#renderer-gentle-wave" x="48" y="0" />
            <use xlinkHref="#renderer-gentle-wave" x="48" y="3" />
            <use xlinkHref="#renderer-gentle-wave" x="48" y="5" />
            <use xlinkHref="#renderer-gentle-wave" x="48" y="7" />
          </g>
        </svg>
      </div>
      <div className="relative" style={{ backgroundColor: colors.stackedTopBorder }}>
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='600' height='600' viewBox='0 0 600 600' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23fff' stroke-width='1'%3E%3Cellipse cx='300' cy='300' rx='280' ry='200'/%3E%3Cellipse cx='300' cy='300' rx='220' ry='160'/%3E%3Cellipse cx='300' cy='300' rx='160' ry='120'/%3E%3Cellipse cx='300' cy='300' rx='100' ry='80'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '300px 300px',
        }} />
        <div className="max-w-8xl mx-auto px-3 md:px-4 py-8 md:py-10 relative z-10">
          <div className="grid gap-4 md:gap-5 grid-cols-1 md:grid-cols-12">
            <div className="md:col-span-3 space-y-2.5">
              {renderLogoMark(24, 'object-contain brightness-110', colors.stackedTextOnBg)}
              {logoName && <span className="text-sm font-bold tracking-tight block" style={{ color: colors.stackedTextOnBg }}>{logoName}</span>}
              <p className="text-xs leading-relaxed opacity-85 max-w-xs" style={{ color: colors.stackedTextOnBg }}>{description}</p>
            </div>
            <div className="md:col-span-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              {getColumns().slice(0, 4).map((col, colIdx) => (
                <div key={col.id || `col-${colIdx}`}>
                  <h3 className="font-bold text-[10px] uppercase tracking-wider mb-2 pb-1" style={{ color: colors.stackedTextOnBg, borderBottom: '1px solid rgba(255,255,255,0.22)' }}>{col.title}</h3>
                  <ul className="space-y-1">
                    {col.links.map((link, lIdx) => (
                      <li key={lIdx}><span className="text-xs opacity-75" style={{ color: colors.stackedTextOnBg }}>{link.label}</span></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="md:col-span-3 space-y-2.5">
              {showSocialLinks && (
                <>
                  <h3 className="font-bold text-[10px] uppercase tracking-wider pb-1" style={{ color: colors.stackedTextOnBg, borderBottom: '1px solid rgba(255,255,255,0.22)' }}>Liên kết</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {getSocials().map((s, idx) => {
                      const st = resolveSocialStyles(s.platform, colors.stackedSocialBg, colors.stackedSocialText);
                      return <span key={idx} className="h-8 w-8 flex items-center justify-center rounded-lg" style={{ backgroundColor: st.bg, color: st.color, ...(st.border ? { border: st.border } : {}) }}>{renderSocialIcon(s.platform, 16)}</span>;
                    })}
                  </div>
                </>
              )}
              {renderBctLogo('h-10')}
            </div>
          </div>
        </div>
        {config.showCopyright !== false && (
          <div className="relative z-10" style={{ borderTop: '0.8px solid rgba(255,255,255,0.3)' }}>
            <div className="max-w-8xl mx-auto px-3 md:px-4 py-2.5 flex items-center justify-center">
              <p className="text-[10px] text-center opacity-70" style={{ color: colors.stackedTextOnBg }}>{copyright || `© ${currentYear} ${siteName}. All rights reserved.`}</p>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}

// ============ MARQUEE SECTION ============
function MarqueeSection({ config, brandColor, secondary, mode, title }: { config: Record<string, unknown>; brandColor: string; secondary: string; mode: 'single' | 'dual'; title: string }) {
  const marqueeMode: MarqueeBrandMode = mode === 'single' ? 'single' : 'dual';
  const tokens = getMarqueeSectionColors({ primary: brandColor, secondary, mode: marqueeMode });
  const rawItems = Array.isArray(config.items) ? config.items : [];
  const items = rawItems.map((item, idx) => normalizeMarqueeItem(item, idx));
  const style = normalizeMarqueeStyle(config.style);
  const direction = normalizeMarqueeDirection(config.direction);
  const speed = normalizeMarqueeSpeed(config.speed);
  const pauseOnHover = config.pauseOnHover !== false;
  const scale = normalizeMarqueeScale(config.scale);
  const uppercase = config.uppercase === true;
  const headerConfig = extractSectionHeaderConfig(config);

  return (
    <MarqueeSectionShared
      items={items}
      style={style}
      direction={direction}
      speed={speed}
      pauseOnHover={pauseOnHover}
      scale={scale}
      uppercase={uppercase}
      tokens={tokens}
      mode={marqueeMode}
      title={title}
      context="site"
      hideHeader={headerConfig.hideHeader}
      showTitle={headerConfig.showTitle}
      showSubtitle={headerConfig.showSubtitle}
      subtitle={headerConfig.subtitle}
      headerAlign={headerConfig.headerAlign}
      titleColorPrimary={headerConfig.titleColorPrimary}
      subtitleAboveTitle={headerConfig.subtitleAboveTitle}
      uppercaseText={headerConfig.uppercaseText}
      showBadge={headerConfig.showBadge}
      badgeText={headerConfig.badgeText}
    />
  );
}

// ============ PLACEHOLDER SECTION ============
function PlaceholderSection({ type, title }: { type: string; title: string }) {
  return (
    <section className="py-16 px-4 bg-slate-100">
      <div className="max-w-4xl mx-auto text-center">
        <LayoutTemplate size={48} className="mx-auto mb-4 text-slate-400" />
        <h3 className="text-xl font-semibold text-slate-600 mb-2">{title}</h3>
        <p className="text-slate-500">Component type “{type}” chưa được implement</p>
      </div>
    </section>
  );
}
