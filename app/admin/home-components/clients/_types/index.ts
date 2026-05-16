export interface ClientItem {
  url: string;
  link: string;
}

export interface ClientEditorItem extends ClientItem {
  id: string;
  inputMode: 'upload' | 'url';
  [key: string]: unknown;
}

export type ClientsStyle = 'layout01' | 'layout02' | 'layout03' | 'layout04' | 'layout05' | 'layout06' | 'layout07';
export type ClientsBrandMode = 'single' | 'dual';
export type ClientsHarmony = 'analogous' | 'complementary' | 'triadic';
export type ClientsHeaderAlign = 'left' | 'center' | 'right';

export interface ClientsConfig {
  items: ClientItem[];
  style: ClientsStyle;
  harmony?: ClientsHarmony;
  // Shared header config
  hideHeader?: boolean;
  showTitle?: boolean;
  subtitle?: string;
  showSubtitle?: boolean;
  headerAlign?: ClientsHeaderAlign;
  titleColorPrimary?: boolean;
  subtitleAboveTitle?: boolean;
  uppercaseText?: boolean;
  showBadge?: boolean;
  badgeText?: string;
  noBorderRadius?: boolean;
}
