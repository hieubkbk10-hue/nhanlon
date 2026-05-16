'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { ComponentFormWrapper, useComponentForm } from '../shared';
import { useTypeColorOverrideState } from '../../_shared/hooks/useTypeColorOverride';
import { useTypeFontOverrideState } from '../../_shared/hooks/useTypeFontOverride';
import { HeaderConfigSection } from '../../_shared/components/HeaderConfigSection';
import { TeamForm } from '../../team/_components/TeamForm';
import { TeamPreview } from '../../team/_components/TeamPreview';
import {
  DEFAULT_TEAM_CONFIG,
  normalizeTeamStyle,
  toTeamEditorMembers,
  toTeamPersistMembers,
} from '../../team/_lib/constants';
import { getTeamValidationResult } from '../../team/_lib/colors';
import type {
  TeamBrandMode,
  TeamConfig,
  TeamEditorMember,
  TeamStyle,
  TeamHeaderAlign,
} from '../../team/_types';

const createDefaultMembers = (): TeamEditorMember[] => {
  const defaults = toTeamEditorMembers(DEFAULT_TEAM_CONFIG.members);

  if (defaults.length >= 2) {
    return [
      {
        ...defaults[0],
        name: 'Nguyễn Văn A',
        role: 'CEO & Founder',
      },
      {
        ...defaults[1],
        name: 'Trần Thị B',
        role: 'CTO',
      },
    ];
  }

  return [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      role: 'CEO & Founder',
      avatar: '',
      bio: '',
      facebook: '',
      linkedin: '',
      twitter: '',
      email: '',
    },
    {
      id: 2,
      name: 'Trần Thị B',
      role: 'CTO',
      avatar: '',
      bio: '',
      facebook: '',
      linkedin: '',
      twitter: '',
      email: '',
    },
  ];
};

export default function TeamCreatePage() {
  const COMPONENT_TYPE = 'Team';
  const { title, setTitle, active, setActive, handleSubmit, isSubmitting } = useComponentForm('Đội ngũ của chúng tôi', COMPONENT_TYPE);
  const { customState, effectiveColors, showCustomBlock, setCustomState, systemColors } = useTypeColorOverrideState(COMPONENT_TYPE, { seedCustomFromSettingsWhenTypeEmpty: true });
  const { customState: customFontState, effectiveFont, showCustomBlock: showFontCustomBlock, setCustomState: setCustomFontState } = useTypeFontOverrideState(COMPONENT_TYPE, { seedCustomFromSettingsWhenTypeEmpty: true });
  const { primary, secondary, mode } = effectiveColors;
  const fontStyle = { '--font-active': `var(${effectiveFont.fontVariable})` } as React.CSSProperties;

  const [members, setMembers] = React.useState<TeamEditorMember[]>(createDefaultMembers);
  const [style, setStyle] = React.useState<TeamStyle>(normalizeTeamStyle(DEFAULT_TEAM_CONFIG.style));
  const [texts] = React.useState<Record<string, string>>(DEFAULT_TEAM_CONFIG.texts || {});

  // Header config state
  const [expandedSections, setExpandedSections] = React.useState({ header: true });
  const [hideHeader, setHideHeader] = React.useState(DEFAULT_TEAM_CONFIG.hideHeader ?? false);
  const [showTitle, setShowTitle] = React.useState(DEFAULT_TEAM_CONFIG.showTitle ?? true);
  const [subtitle, setSubtitle] = React.useState(DEFAULT_TEAM_CONFIG.subtitle ?? '');
  const [showSubtitle, setShowSubtitle] = React.useState(DEFAULT_TEAM_CONFIG.showSubtitle ?? true);
  const [headerAlign, setHeaderAlign] = React.useState<TeamHeaderAlign>(DEFAULT_TEAM_CONFIG.headerAlign ?? 'left');
  const [titleColorPrimary, setTitleColorPrimary] = React.useState(DEFAULT_TEAM_CONFIG.titleColorPrimary ?? false);
  const [subtitleAboveTitle, setSubtitleAboveTitle] = React.useState(DEFAULT_TEAM_CONFIG.subtitleAboveTitle ?? false);
  const [uppercaseText, setUppercaseText] = React.useState(DEFAULT_TEAM_CONFIG.uppercaseText ?? false);
  const [showBadge, setShowBadge] = React.useState(DEFAULT_TEAM_CONFIG.showBadge ?? true);
  const [badgeText, setBadgeText] = React.useState(DEFAULT_TEAM_CONFIG.badgeText ?? '');

  const brandMode: TeamBrandMode = mode === 'single' ? 'single' : 'dual';

  const validation = React.useMemo(() => getTeamValidationResult({
    primary,
    secondary,
    mode: brandMode,
  }), [primary, secondary, brandMode]);

  const warningMessages = React.useMemo(() => {
    if (brandMode !== 'dual') {
      return [] as string[];
    }

    const messages: string[] = [];

    if (validation.harmonyStatus.isTooSimilar) {
      messages.push(`Màu phụ đang gần màu chính (deltaE = ${validation.harmonyStatus.deltaE}). Nên chọn màu khác biệt hơn.`);
    }

    return messages;
  }, [brandMode, validation]);

  const onSubmit = (event: React.FormEvent) => {
    const configWithHeader: TeamConfig = {
      members: toTeamPersistMembers(members),
      style,
      texts,
      hideHeader,
      showTitle,
      subtitle,
      showSubtitle,
      headerAlign,
      titleColorPrimary,
      subtitleAboveTitle,
      uppercaseText,
      showBadge,
      badgeText,
    };
    void handleSubmit(event, configWithHeader);
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
        hideHeader={hideHeader}
        title={title}
        showTitle={showTitle}
        subtitle={subtitle}
        showSubtitle={showSubtitle}
        headerAlign={headerAlign}
        titleColorPrimary={titleColorPrimary}
        subtitleAboveTitle={subtitleAboveTitle}
        uppercaseText={uppercaseText}
        showBadge={showBadge}
        badgeText={badgeText}
        onHideHeaderChange={setHideHeader}
        onTitleChange={setTitle}
        onShowTitleChange={setShowTitle}
        onSubtitleChange={setSubtitle}
        onShowSubtitleChange={setShowSubtitle}
        onHeaderAlignChange={setHeaderAlign}
        onTitleColorPrimaryChange={setTitleColorPrimary}
        onSubtitleAboveTitleChange={setSubtitleAboveTitle}
        onUppercaseTextChange={setUppercaseText}
        onShowBadgeChange={setShowBadge}
        onBadgeTextChange={setBadgeText}
        expanded={expandedSections.header}
        onExpandedChange={(value) => setExpandedSections({ header: value })}
        titleRequired={true}
        titleLabel="Tiêu đề hiển thị"
        titlePlaceholder="Nhập tiêu đề component..."
      />

      <TeamForm
        members={members}
        onChange={setMembers}
        secondary={validation.resolvedSecondary}
        defaultExpanded={true}
      />

      {warningMessages.length > 0 && (
        <div className="mb-6 space-y-2">
          {warningMessages.map((message, idx) => (
            <div
              key={`team-create-warning-${idx}`}
              className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700"
            >
              <AlertTriangle size={14} className="mt-0.5 shrink-0" />
              <p>{message}</p>
            </div>
          ))}
        </div>
      )}

      <TeamPreview
        members={members}
        brandColor={primary}
        secondary={secondary}
        mode={brandMode}
        title={title}
        selectedStyle={style}
        onStyleChange={setStyle}
        texts={texts}
        fontStyle={fontStyle}
        fontClassName="font-active"
        hideHeader={hideHeader}
        showTitle={showTitle}
        showSubtitle={showSubtitle}
        subtitle={subtitle}
        headerAlign={headerAlign}
        titleColorPrimary={titleColorPrimary}
        subtitleAboveTitle={subtitleAboveTitle}
        uppercaseText={uppercaseText}
        showBadge={showBadge}
        badgeText={badgeText}
      />
    </ComponentFormWrapper>
  );
}
