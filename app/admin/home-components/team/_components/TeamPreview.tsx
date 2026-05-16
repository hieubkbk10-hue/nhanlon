'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { BrowserFrame } from '../../_shared/components/BrowserFrame';
import { ColorInfoPanel } from '../../_shared/components/ColorInfoPanel';
import { PreviewWrapper } from '../../_shared/components/PreviewWrapper';
import { deviceWidths, usePreviewDevice } from '../../_shared/hooks/usePreviewDevice';
import {
  TEAM_STYLES,
  normalizeTeamStyle,
} from '../_lib/constants';
import { getTeamValidationResult } from '../_lib/colors';
import { TeamSectionShared } from './TeamSectionShared';
import type {
  TeamBrandMode,
  TeamEditorMember,
  TeamStyle,
} from '../_types';

interface TeamPreviewProps {
  members: TeamEditorMember[];
  brandColor: string;
  secondary: string;
  title?: string;
  mode?: TeamBrandMode;
  selectedStyle?: TeamStyle;
  onStyleChange?: (style: TeamStyle) => void;
  texts?: Record<string, string>;
  fontStyle?: React.CSSProperties;
  fontClassName?: string;
  // Header props
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

export const TeamPreview = ({
  members,
  brandColor,
  secondary,
  title = 'Đội ngũ',
  mode = 'dual',
  selectedStyle = 'grid',
  onStyleChange,
  texts = {},
  fontStyle,
  fontClassName,
  hideHeader,
  showTitle,
  showSubtitle,
  subtitle,
  headerAlign,
  titleColorPrimary,
  subtitleAboveTitle,
  uppercaseText,
  showBadge,
  badgeText,
}: TeamPreviewProps) => {
  const { device, setDevice } = usePreviewDevice();
  const style = normalizeTeamStyle(selectedStyle);

  const validation = React.useMemo(() => getTeamValidationResult({
    primary: brandColor,
    secondary,
    mode,
  }), [brandColor, secondary, mode]);

  const warningMessages = React.useMemo(() => {
    if (mode !== 'dual') {
      return [] as string[];
    }

    const messages: string[] = [];

    if (validation.harmonyStatus.isTooSimilar) {
      messages.push(`Màu phụ đang gần màu chính (deltaE = ${validation.harmonyStatus.deltaE}). Nên chọn màu khác biệt hơn.`);
    }

    return messages;
  }, [mode, validation]);

  const modeLabel = mode === 'single' ? '1 màu (single)' : '2 màu (dual)';

  return (
    <div className="space-y-3">
      <PreviewWrapper
        title="Preview Team"
        device={device}
        setDevice={setDevice}
        previewStyle={style}
        setPreviewStyle={(next) => { onStyleChange?.(normalizeTeamStyle(next)); }}
        styles={TEAM_STYLES}
        info={`${members.length} thành viên • ${modeLabel}`}
        deviceWidthClass={deviceWidths[device]}
        fontStyle={fontStyle}
        fontClassName={fontClassName}
      >
        <BrowserFrame url="yoursite.com/team">
          <TeamSectionShared
            context="preview"
            members={members}
            mode={mode}
            style={style}
            title={title}
            tokens={validation.tokens}
            device={device}
            carouselId={`team-preview-carousel-${device}`}
            texts={texts}
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
        </BrowserFrame>
      </PreviewWrapper>

      {mode === 'dual' ? (
        <ColorInfoPanel
          brandColor={validation.tokens.primary}
          secondary={validation.resolvedSecondary}
          description="Màu phụ áp dụng cho role, icon social, accent line và điều hướng carousel của Team."
        />
      ) : null}

      {warningMessages.length > 0 ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          <div className="flex items-start gap-2">
            <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              {warningMessages.map((message) => (
                <p key={message}>{message}</p>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
