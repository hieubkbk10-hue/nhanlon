export interface ProcessStep {
  icon: string;
  title: string;
  description: string;
}

export type ProcessStyle = 'horizontal' | 'stepper' | 'cards' | 'accordion' | 'minimal' | 'grid' | 'alternating';

export type ProcessBrandMode = 'single' | 'dual';

export interface ProcessConfig {
  steps: ProcessStep[];
  style: ProcessStyle;
  desktopColumns?: 3 | 4;
}
