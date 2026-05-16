export type TeamAvatarType = 'upload' | 'url' | 'icon';

export interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  avatarType?: TeamAvatarType; // 'upload' | 'url' | 'icon'
  avatarIcon?: string; // lucide icon name when avatarType === 'icon'
  bio: string;
  facebook: string;
  linkedin: string;
  twitter: string;
  email: string;
}

export interface TeamEditorMember extends TeamMember {
  id: number;
}

export type TeamStyle = 'grid' | 'cards' | 'carousel' | 'bento' | 'timeline' | 'spotlight';

export type TeamBrandMode = 'single' | 'dual';

export interface TeamConfig {
  members: TeamMember[];
  style: TeamStyle;
  texts?: Record<string, string>;
  // Shared header config
  hideHeader?: boolean;
  showTitle?: boolean;
  showSubtitle?: boolean;
  subtitle?: string;
  headerAlign?: 'left' | 'center' | 'right';
  titleColorPrimary?: boolean;
  subtitleAboveTitle?: boolean;
  uppercaseText?: boolean;
  showBadge?: boolean;
  badgeText?: string;
}

export type TeamHeaderAlign = 'left' | 'center' | 'right';
