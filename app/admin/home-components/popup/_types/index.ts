export type PopupStyle = 'center-card' | 'split-visual' | 'bottom-sheet' | 'side-panel' | 'minimal-alert' | 'full-screen' | 'image-only';

export type PopupTrigger = 'immediate' | 'delay';

export type PopupFrequency = 'always' | 'oncePerPageView' | 'oncePerSession' | 'oncePerDevice';

export type PopupCornerRadius = 'none' | 'sm' | 'lg';

export interface PopupConfig {
  style: PopupStyle;
  eyebrow: string;
  heading: string;
  description: string;
  note: string;
  icon: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  primaryButtonDisabled: boolean;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  secondaryButtonDisabled: boolean;
  imageUrl: string;
  trigger: PopupTrigger;
  delaySeconds: number;
  frequency: PopupFrequency;
  showIcon: boolean;
  cornerRadius: PopupCornerRadius;
  colorIntensity: number;
  showDoNotShowToday: boolean;
}
