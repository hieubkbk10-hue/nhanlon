export interface FeatureItem {
  id: number;
  icon: string;
  title: string;
  description: string;
  image?: string;
}

export type FeaturesStyle = 'iconGrid' | 'alternating' | 'compact' | 'cards' | 'carousel' | 'timeline' | 'carousel6';
export type FeaturesBrandMode = 'single' | 'dual';
export type FeaturesHarmony = 'analogous' | 'complementary' | 'triadic';
export type FeaturesHeaderAlign = 'left' | 'center' | 'right';

export interface FeaturesConfig {
  items: FeatureItem[];
  style: FeaturesStyle;
  showIcons?: boolean;
  harmony?: FeaturesHarmony;
  hideHeader?: boolean;
  showTitle?: boolean;
  subtitle?: string;
  showSubtitle?: boolean;
  headerAlign?: FeaturesHeaderAlign;
  titleColorPrimary?: boolean;
  subtitleAboveTitle?: boolean;
  uppercaseText?: boolean;
  showBadge?: boolean;
  badgeText?: string;
}
