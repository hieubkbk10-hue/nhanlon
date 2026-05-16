'use client';

export type StatsStyle = 'horizontal' | 'cards' | 'icons' | 'gradient' | 'minimal' | 'counter' | 'solar-hero';
export type StatsBrandMode = 'single' | 'dual';
export type StatsIconType = 'lucide' | 'url' | 'upload' | 'none';
export type StatsHeaderAlign = 'left' | 'center' | 'right';
export type StatsMediaPlacement = 'top' | 'left';
export type StatsMediaAlign = 'left' | 'center' | 'right';

export interface StatsItem {
  value: string;
  label: string;
  description?: string;
  iconType?: StatsIconType;
  iconName?: string;
  iconUrl?: string;
}

export interface StatsContent {
  items: StatsItem[];
  style: StatsStyle;
  showTitle?: boolean;
  showSubtitle?: boolean;
  subtitle?: string;
  headerAlign?: StatsHeaderAlign;
  desktopColumns?: 3 | 4;
  mediaPlacement?: StatsMediaPlacement;
  mediaAlign?: StatsMediaAlign;
  backgroundImage?: string;
  fullWidth?: boolean;
}

export const STATS_ICON_CHOICES = [
  'TrendingUp',
  'Users',
  'Award',
  'Target',
  'Zap',
  'Heart',
  'Star',
  'CheckCircle',
  'ThumbsUp',
  'Rocket',
  'Globe',
  'Shield',
  'Clock',
  'DollarSign',
  'Package',
  'Briefcase',
  'Activity',
  'AlertCircle',
  'Anchor',
  'Archive',
  'ArrowUp',
  'ArrowDown',
  'ArrowRight',
  'BarChart',
  'Battery',
  'Bell',
  'Book',
  'Bookmark',
  'Box',
  'Calendar',
  'Camera',
  'Cast',
  'Check',
  'ChevronRight',
  'Circle',
  'Clipboard',
  'Cloud',
  'Code',
  'Coffee',
  'Compass',
  'Copy',
  'CreditCard',
  'Database',
  'Download',
  'Droplet',
  'Edit',
  'Eye',
  'Facebook',
  'File',
  'Filter',
  'Flag',
  'Folder',
  'Gift',
  'GitBranch',
  'Grid',
  'Hash',
  'Headphones',
  'Home',
  'Image',
  'Inbox',
  'Info',
  'Instagram',
  'Key',
  'Layers',
  'Layout',
  'Link',
  'Linkedin',
  'List',
  'Loader',
  'Lock',
  'Mail',
  'Map',
  'MapPin',
  'Maximize',
  'Menu',
  'MessageCircle',
  'Mic',
  'Monitor',
  'Moon',
  'Music',
  'Navigation',
  'Paperclip',
  'Phone',
  'PieChart',
  'Play',
  'Plus',
  'Printer',
  'Radio',
  'RefreshCw',
  'Repeat',
  'Save',
  'Search',
  'Send',
  'Server',
  'Settings',
  'Share',
  'ShoppingCart',
  'Smartphone',
  'Sparkles',
  'Sun',
  'Tag',
  'Terminal',
  'Trash',
  'TrendingDown',
  'Truck',
  'Twitter',
  'Umbrella',
  'Upload',
  'User',
  'Video',
  'Wifi',
  'Youtube',
] as const;
