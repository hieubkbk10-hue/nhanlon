export type PricingStyle = 'cards' | 'horizontal' | 'minimal' | 'comparison' | 'featured' | 'compact';

export type PricingBrandMode = 'single' | 'dual';
export type PricingHarmony = 'analogous' | 'complementary' | 'triadic';


export interface PricingPlan {
  id?: string | number;
  name: string;
  price: string;
  yearlyPrice?: string;
  period: string;
  features: string[];
  isPopular: boolean;
  buttonText: string;
  buttonLink: string;
}

export interface PricingEditorPlan extends Omit<PricingPlan, 'id'> {
  id: number;
}

export type PricingHeaderAlign = 'left' | 'center' | 'right';

export interface PricingConfig {
  plans: PricingPlan[];
  style: PricingStyle;
  monthlyLabel?: string;
  yearlyLabel?: string;
  yearlySavingText?: string;
  showBillingToggle?: boolean;
  subtitle?: string;
  texts?: Record<string, string>;
  harmony?: PricingHarmony;
  // Shared header config
  hideHeader?: boolean;
  showTitle?: boolean;
  showSubtitle?: boolean;
  headerAlign?: PricingHeaderAlign;
  titleColorPrimary?: boolean;
  subtitleAboveTitle?: boolean;
  uppercaseText?: boolean;
  showBadge?: boolean;
  badgeText?: string;
  gridCols?: 3 | 4;
}
