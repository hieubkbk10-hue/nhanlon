import type {
  BenefitsConfig,
  BenefitsEditorState,
  BenefitsHarmony,
  BenefitsHeaderAlign,
  BenefitsStyleOption,
} from '../_types';

export const DEFAULT_BENEFITS_HARMONY: BenefitsHarmony = 'analogous';

export const BENEFITS_STYLES: BenefitsStyleOption[] = [
  { id: '1', label: 'Layout 1' },
  { id: '2', label: 'Layout 2' },
  { id: '3', label: 'Layout 3' },
  { id: '4', label: 'Layout 4' },
  { id: '5', label: 'Layout 5' },
  { id: '6', label: 'Layout 6' },
];

export const BENEFITS_HARMONY_OPTIONS: Array<{ value: BenefitsHarmony; label: string }> = [
  { value: 'analogous', label: 'Analogous (+30°)' },
  { value: 'complementary', label: 'Complementary (180°)' },
  { value: 'triadic', label: 'Triadic (120°)' },
];

export const BENEFITS_HEADER_ALIGN_OPTIONS: Array<{ value: BenefitsHeaderAlign; label: string }> = [
  { value: 'left', label: 'Trái' },
  { value: 'center', label: 'Giữa' },
  { value: 'right', label: 'Phải' },
];

export const BENEFITS_GRID_COLUMNS_DESKTOP: Array<{ value: 3 | 4; label: string }> = [
  { value: 3, label: '3 cột' },
  { value: 4, label: '4 cột' },
];

export const DEFAULT_BENEFITS_CONFIG: BenefitsConfig = {
  buttonLink: '',
  buttonText: '',
  gridColumnsDesktop: 4,
  gridColumnsMobile: 2,
  headerAlign: 'left',
  highlightIndex: 2,
  harmony: DEFAULT_BENEFITS_HARMONY,
  heading: 'Giá trị cốt lõi',
  items: [
    {
      description: '',
      icon: 'Star',
      title: '',
    },
  ],
  showDecorativeVisuals: true,
  showItemNumbers: true,
  style: '1',
  subHeading: 'Vì sao chọn chúng tôi?',
  visualImage: '',
  // Shared header config
  hideHeader: false,
  showTitle: true,
  showSubtitle: true,
  subtitle: '',
  titleColorPrimary: false,
  subtitleAboveTitle: false,
  uppercaseText: false,
  showBadge: true,
  badgeText: '',
};

export const DEFAULT_BENEFITS_EDITOR_STATE: BenefitsEditorState = {
  buttonLink: DEFAULT_BENEFITS_CONFIG.buttonLink ?? '',
  buttonText: DEFAULT_BENEFITS_CONFIG.buttonText ?? '',
  gridColumnsDesktop: DEFAULT_BENEFITS_CONFIG.gridColumnsDesktop ?? 4,
  gridColumnsMobile: DEFAULT_BENEFITS_CONFIG.gridColumnsMobile ?? 2,
  headerAlign: DEFAULT_BENEFITS_CONFIG.headerAlign ?? 'left',
  highlightIndex: DEFAULT_BENEFITS_CONFIG.highlightIndex ?? 2,
  harmony: DEFAULT_BENEFITS_HARMONY,
  heading: DEFAULT_BENEFITS_CONFIG.heading ?? '',
  items: [
    {
      description: '',
      icon: 'Star',
      id: 'benefit-default-1',
      title: '',
    },
  ],
  showDecorativeVisuals: DEFAULT_BENEFITS_CONFIG.showDecorativeVisuals ?? true,
  showItemNumbers: DEFAULT_BENEFITS_CONFIG.showItemNumbers ?? true,
  style: DEFAULT_BENEFITS_CONFIG.style,
  subHeading: DEFAULT_BENEFITS_CONFIG.subHeading ?? '',
  visualImage: DEFAULT_BENEFITS_CONFIG.visualImage ?? '',
  // Shared header config
  hideHeader: DEFAULT_BENEFITS_CONFIG.hideHeader ?? false,
  showTitle: DEFAULT_BENEFITS_CONFIG.showTitle ?? true,
  showSubtitle: DEFAULT_BENEFITS_CONFIG.showSubtitle ?? true,
  subtitle: DEFAULT_BENEFITS_CONFIG.subtitle ?? '',
  titleColorPrimary: DEFAULT_BENEFITS_CONFIG.titleColorPrimary ?? false,
  subtitleAboveTitle: DEFAULT_BENEFITS_CONFIG.subtitleAboveTitle ?? false,
  uppercaseText: DEFAULT_BENEFITS_CONFIG.uppercaseText ?? false,
  showBadge: DEFAULT_BENEFITS_CONFIG.showBadge ?? true,
  badgeText: DEFAULT_BENEFITS_CONFIG.badgeText ?? '',
};
