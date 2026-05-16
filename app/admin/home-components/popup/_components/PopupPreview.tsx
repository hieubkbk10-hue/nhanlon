'use client';

import React from 'react';
import { usePreviewDevice } from '../../_shared/hooks/usePreviewDevice';
import { PopupSectionShared } from './PopupSectionShared';
import type { PopupConfig, PopupStyle } from '../_types';

interface PopupPreviewProps {
  config: PopupConfig;
  brandColor: string;
  title: string;
  selectedStyle: PopupStyle;
  onStyleChange: (style: PopupStyle) => void;
}

export function PopupPreview({ config, brandColor, title, selectedStyle, onStyleChange }: PopupPreviewProps) {
  const { device, setDevice } = usePreviewDevice();

  return (
    <PopupSectionShared
      config={{ ...config, style: selectedStyle }}
      brandColor={brandColor}
      sectionTitle={title}
      context="preview"
      includePreviewWrapper
      previewDevice={device}
      setPreviewDevice={setDevice}
      previewStyle={selectedStyle}
      onPreviewStyleChange={onStyleChange}
    />
  );
}
