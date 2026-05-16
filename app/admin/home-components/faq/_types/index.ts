export interface FaqItem {
  id: number | string;
  question: string;
  answer: string;
}

export type FaqStyle = 'accordion' | 'cards' | 'two-column' | 'minimal' | 'timeline' | 'tabbed' | 'wine-list';
export type FaqBrandMode = 'single' | 'dual';
export type FAQHeaderAlign = 'left' | 'center' | 'right';

export interface FaqConfig {
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  // Header fields
  hideHeader?: boolean;
  showTitle?: boolean;
  showSubtitle?: boolean;
  subtitle?: string;
  headerAlign?: FAQHeaderAlign;
  titleColorPrimary?: boolean;
  subtitleAboveTitle?: boolean;
  uppercaseText?: boolean;
  showBadge?: boolean;
  badgeText?: string;
}

export interface FaqStyleOption {
  id: FaqStyle;
  label: string;
}
