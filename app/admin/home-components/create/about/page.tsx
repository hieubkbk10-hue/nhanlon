'use client';

import React from 'react';
import { ComponentFormWrapper, useComponentForm } from '../shared';
import { useTypeColorOverrideState } from '../../_shared/hooks/useTypeColorOverride';
import { useTypeFontOverrideState } from '../../_shared/hooks/useTypeFontOverride';
import { useSectionHeaderState } from '../../_shared/hooks/useSectionHeaderState';
import { HeaderConfigSection } from '../../_shared/components/HeaderConfigSection';
import { AboutForm } from '../../about/_components/AboutForm';
import { AboutPreview } from '../../about/_components/AboutPreview';
import {
  DEFAULT_ABOUT_EDITOR_STATE,
  toAboutPersistFeatures,
  toAboutPersistStats,
} from '../../about/_lib/constants';
import {
  getAboutValidationResult,
} from '../../about/_lib/colors';

export default function AboutCreatePage() {
  const COMPONENT_TYPE = 'About';
  const { title, setTitle, active, setActive, handleSubmit, isSubmitting } = useComponentForm('Về chúng tôi', COMPONENT_TYPE);
  const { customState, effectiveColors, showCustomBlock, setCustomState, systemColors } = useTypeColorOverrideState(COMPONENT_TYPE, { seedCustomFromSettingsWhenTypeEmpty: true });
  const { customState: customFontState, effectiveFont, showCustomBlock: showFontCustomBlock, setCustomState: setCustomFontState } = useTypeFontOverrideState(COMPONENT_TYPE, { seedCustomFromSettingsWhenTypeEmpty: true });
  const { primary, secondary, mode } = effectiveColors;
  const fontStyle = { '--font-active': `var(${effectiveFont.fontVariable})` } as React.CSSProperties;

  const headerState = useSectionHeaderState({
    hideHeader: false,
    showTitle: true,
    showSubtitle: true,
    subtitle: '',
    headerAlign: 'left',
    titleColorPrimary: false,
    subtitleAboveTitle: false,
    uppercaseText: false,
    showBadge: true,
    badgeText: '',
  });

  const [headerExpanded, setHeaderExpanded] = React.useState(true);

  const [state, setState] = React.useState(DEFAULT_ABOUT_EDITOR_STATE);

  const validation = React.useMemo(
    () => getAboutValidationResult({
      primary,
      secondary,
      mode,
      style: state.style,
    }),
    [primary, secondary, mode, state.style],
  );

  const onSubmit = (event: React.FormEvent) => {
    void handleSubmit(event, {
      subHeading: state.subHeading,
      heading: state.heading,
      highlightText: state.highlightText,
      description: state.description,
      phone: state.phone,
      image: state.image,
      images: state.images,
      imageCaption: state.imageCaption,
      buttonText: state.buttonText,
      buttonLink: state.buttonLink,
      features: toAboutPersistFeatures(state.features),
      stats: toAboutPersistStats(state.stats),
      style: state.style,
      hideHeader: headerState.hideHeader,
      showTitle: headerState.showTitle,
      subtitle: headerState.subtitle,
      showSubtitle: headerState.showSubtitle,
      headerAlign: headerState.headerAlign,
      titleColorPrimary: headerState.titleColorPrimary,
      subtitleAboveTitle: headerState.subtitleAboveTitle,
      uppercaseText: headerState.uppercaseText,
      showBadge: headerState.showBadge,
      badgeText: headerState.badgeText,
    });
  };

  return (
    <ComponentFormWrapper
      type={COMPONENT_TYPE}
      title={title}
      setTitle={setTitle}
      active={active}
      setActive={setActive}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      customState={customState}
      showCustomBlock={showCustomBlock}
      setCustomState={setCustomState}
      systemColors={systemColors}
      customFontState={customFontState}
      showFontCustomBlock={showFontCustomBlock}
      setCustomFontState={setCustomFontState}
      skipTitleInput={true}
    >
      <HeaderConfigSection
        hideHeader={headerState.hideHeader}
        title={title}
        showTitle={headerState.showTitle}
        subtitle={headerState.subtitle}
        showSubtitle={headerState.showSubtitle}
        headerAlign={headerState.headerAlign}
        titleColorPrimary={headerState.titleColorPrimary}
        subtitleAboveTitle={headerState.subtitleAboveTitle}
        uppercaseText={headerState.uppercaseText}
        showBadge={headerState.showBadge}
        badgeText={headerState.badgeText}
        onHideHeaderChange={headerState.setHideHeader}
        onTitleChange={setTitle}
        onShowTitleChange={headerState.setShowTitle}
        onSubtitleChange={headerState.setSubtitle}
        onShowSubtitleChange={headerState.setShowSubtitle}
        onHeaderAlignChange={headerState.setHeaderAlign}
        onTitleColorPrimaryChange={headerState.setTitleColorPrimary}
        onSubtitleAboveTitleChange={headerState.setSubtitleAboveTitle}
        onUppercaseTextChange={headerState.setUppercaseText}
        onShowBadgeChange={headerState.setShowBadge}
        onBadgeTextChange={headerState.setBadgeText}
        expanded={headerExpanded}
        onExpandedChange={setHeaderExpanded}
        titleRequired={true}
        titleLabel="Tiêu đề hiển thị"
        titlePlaceholder="Nhập tiêu đề component..."
      />

      <AboutForm state={state} previewStyle={state.style} onChange={setState} />

      <AboutPreview
        config={{
          subHeading: state.subHeading,
          heading: state.heading,
          highlightText: state.highlightText,
          description: state.description,
          phone: state.phone,
          image: state.image,
          images: state.images,
          imageCaption: state.imageCaption,
          buttonText: state.buttonText,
          buttonLink: state.buttonLink,
          features: toAboutPersistFeatures(state.features),
          stats: toAboutPersistStats(state.stats),
          style: state.style,
        }}
        brandColor={validation.tokens.primary}
        secondary={validation.tokens.secondary}
        mode={mode}
        selectedStyle={state.style}
        onStyleChange={(style) => {
          setState((prev) => ({ ...prev, style }));
        }}
        fontStyle={fontStyle}
        fontClassName="font-active"
        title={title}
        hideHeader={headerState.hideHeader}
        showTitle={headerState.showTitle}
        subtitle={headerState.subtitle}
        showSubtitle={headerState.showSubtitle}
        headerAlign={headerState.headerAlign}
        titleColorPrimary={headerState.titleColorPrimary}
        subtitleAboveTitle={headerState.subtitleAboveTitle}
        uppercaseText={headerState.uppercaseText}
        showBadge={headerState.showBadge}
        badgeText={headerState.badgeText}
      />
    </ComponentFormWrapper>
  );
}
