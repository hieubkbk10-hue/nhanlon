'use client';

import React from 'react';
import { PopupSectionShared } from '@/app/admin/home-components/popup/_components/PopupSectionShared';
import { normalizePopupConfig } from '@/app/admin/home-components/popup/_lib/constants';

interface PopupSectionProps {
  config: Record<string, unknown>;
  brandColor: string;
  title: string;
}

export function PopupSection({ config, brandColor, title }: PopupSectionProps) {
  const normalizedConfig = React.useMemo(() => normalizePopupConfig(config), [config]);

  return (
    <PopupSectionShared
      config={normalizedConfig}
      brandColor={brandColor}
      sectionTitle={title}
      context="site"
    />
  );
}
