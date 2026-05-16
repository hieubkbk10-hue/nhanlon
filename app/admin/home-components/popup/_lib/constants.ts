import type { PopupConfig, PopupCornerRadius, PopupFrequency, PopupStyle, PopupTrigger } from '../_types';

export const POPUP_STYLES: Array<{ id: PopupStyle; label: string }> = [
  { id: 'center-card', label: 'Premium Modal' },
  { id: 'split-visual', label: 'Visual Offer' },
  { id: 'bottom-sheet', label: 'Bottom Sheet' },
  { id: 'side-panel', label: 'Side Panel' },
  { id: 'minimal-alert', label: 'Smart Alert' },
  { id: 'full-screen', label: 'Campaign Hero' },
  { id: 'image-only', label: 'Image Only' },
];

export const DEFAULT_POPUP_CONFIG: PopupConfig = {
  style: 'center-card',
  eyebrow: 'Thông báo',
  heading: 'Tiêu đề popup',
  description: 'Nội dung ngắn gọn để người dùng hiểu và thực hiện hành động.',
  note: 'Bạn có thể dùng popup này cho xác nhận tuổi, khuyến mãi, thông báo hoặc thu lead.',
  icon: 'ShieldCheck',
  primaryButtonText: 'Đồng ý',
  primaryButtonLink: '',
  primaryButtonDisabled: false,
  secondaryButtonText: 'Để sau',
  secondaryButtonLink: '',
  secondaryButtonDisabled: false,
  imageUrl: '',
  trigger: 'immediate',
  delaySeconds: 2,
  frequency: 'oncePerSession',
  showIcon: true,
  cornerRadius: 'lg',
  colorIntensity: 50,
  showDoNotShowToday: false,
};

export const normalizePopupStyle = (value: unknown): PopupStyle => {
  if (value === 'center-card' || value === 'split-visual' || value === 'bottom-sheet' || value === 'side-panel' || value === 'minimal-alert' || value === 'full-screen' || value === 'image-only') {
    return value;
  }
  return DEFAULT_POPUP_CONFIG.style;
};

export const normalizePopupTrigger = (value: unknown): PopupTrigger => {
  if (value === 'delay') {
    return value;
  }
  return 'immediate';
};

export const normalizePopupFrequency = (value: unknown): PopupFrequency => {
  if (value === 'always' || value === 'oncePerPageView' || value === 'oncePerSession' || value === 'oncePerDevice') {
    return value;
  }
  return DEFAULT_POPUP_CONFIG.frequency;
};

const normalizeString = (value: unknown, fallback: string) => (
  typeof value === 'string' ? value : fallback
);

const normalizeBoolean = (value: unknown, fallback: boolean) => (
  typeof value === 'boolean' ? value : fallback
);

const normalizeCornerRadius = (value: unknown, legacySquareCorners: unknown): PopupCornerRadius => {
  if (value === 'none' || value === 'sm' || value === 'lg') {
    return value;
  }
  if (legacySquareCorners === true) {
    return 'none';
  }
  return DEFAULT_POPUP_CONFIG.cornerRadius;
};

const normalizeDelay = (value: unknown) => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return DEFAULT_POPUP_CONFIG.delaySeconds;
  }
  return Math.min(60, Math.max(0, Math.round(value)));
};

const normalizeColorIntensity = (value: unknown) => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return DEFAULT_POPUP_CONFIG.colorIntensity;
  }
  return Math.min(100, Math.max(0, Math.round(value)));
};

export const normalizePopupConfig = (config: unknown): PopupConfig => {
  const raw = (typeof config === 'object' && config !== null ? config : {}) as Record<string, unknown>;

  return {
    style: normalizePopupStyle(raw.style),
    eyebrow: normalizeString(raw.eyebrow, DEFAULT_POPUP_CONFIG.eyebrow),
    heading: normalizeString(raw.heading, DEFAULT_POPUP_CONFIG.heading),
    description: normalizeString(raw.description, DEFAULT_POPUP_CONFIG.description),
    note: normalizeString(raw.note, DEFAULT_POPUP_CONFIG.note),
    icon: normalizeString(raw.icon, DEFAULT_POPUP_CONFIG.icon),
    primaryButtonText: normalizeString(raw.primaryButtonText, DEFAULT_POPUP_CONFIG.primaryButtonText),
    primaryButtonLink: normalizeString(raw.primaryButtonLink, DEFAULT_POPUP_CONFIG.primaryButtonLink),
    primaryButtonDisabled: normalizeBoolean(raw.primaryButtonDisabled, DEFAULT_POPUP_CONFIG.primaryButtonDisabled),
    secondaryButtonText: normalizeString(raw.secondaryButtonText, DEFAULT_POPUP_CONFIG.secondaryButtonText),
    secondaryButtonLink: normalizeString(raw.secondaryButtonLink, DEFAULT_POPUP_CONFIG.secondaryButtonLink),
    secondaryButtonDisabled: normalizeBoolean(raw.secondaryButtonDisabled, DEFAULT_POPUP_CONFIG.secondaryButtonDisabled),
    imageUrl: normalizeString(raw.imageUrl, DEFAULT_POPUP_CONFIG.imageUrl),
    trigger: normalizePopupTrigger(raw.trigger),
    delaySeconds: normalizeDelay(raw.delaySeconds),
    frequency: normalizePopupFrequency(raw.frequency),
    showIcon: normalizeBoolean(raw.showIcon, DEFAULT_POPUP_CONFIG.showIcon),
    cornerRadius: normalizeCornerRadius(raw.cornerRadius, raw.squareCorners),
    colorIntensity: normalizeColorIntensity(raw.colorIntensity),
    showDoNotShowToday: normalizeBoolean(raw.showDoNotShowToday, DEFAULT_POPUP_CONFIG.showDoNotShowToday),
  };
};
