'use client';

import React from 'react';
import {
  normalizeTeamConfig,
  normalizeTeamStyle,
} from '@/app/admin/home-components/team/_lib/constants';
import { getTeamColorTokens } from '@/app/admin/home-components/team/_lib/colors';
import { TeamSectionShared } from '@/app/admin/home-components/team/_components/TeamSectionShared';
import { SectionHeader } from '@/app/admin/home-components/_shared/components/SectionHeader';
import { extractSectionHeaderConfig } from '@/app/admin/home-components/_shared/hooks/useSectionHeaderState';
import type {
  TeamBrandMode,
  TeamStyle,
} from '@/app/admin/home-components/team/_types';

interface TeamSectionProps {
  config: Record<string, unknown>;
  brandColor: string;
  secondary: string;
  mode: TeamBrandMode;
  title: string;
}

export function TeamSection({
  config,
  brandColor,
  secondary,
  mode,
  title,
}: TeamSectionProps) {
  const normalizedConfig = normalizeTeamConfig(config);
  const style = normalizeTeamStyle((normalizedConfig.style as TeamStyle | undefined) ?? 'grid');

  const tokens = React.useMemo(() => getTeamColorTokens({
    primary: brandColor,
    secondary,
    mode,
  }), [brandColor, secondary, mode]);

  const sectionTitle = (title || '').trim().length > 0
    ? title
    : 'Đội ngũ của chúng tôi';

  const safeMembers = Array.isArray(normalizedConfig.members)
    ? normalizedConfig.members
    : normalizeTeamConfig({}).members;

  // Extract header config via shared util (backward compat: fallback to texts.subtitle)
  const legacySubtitle = typeof normalizedConfig.texts?.subtitle === 'string'
    ? normalizedConfig.texts.subtitle
    : '';

  const rawHeaderConfig = extractSectionHeaderConfig(config);
  const headerConfig = {
    ...rawHeaderConfig,
    subtitle: rawHeaderConfig.subtitle || legacySubtitle,
  };

  return (
    <section className="py-8 px-3">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          title={sectionTitle}
          subtitle={headerConfig.subtitle}
          badgeText={headerConfig.badgeText}
          hideHeader={headerConfig.hideHeader}
          showTitle={headerConfig.showTitle}
          showSubtitle={headerConfig.showSubtitle}
          showBadge={headerConfig.showBadge}
          headerAlign={headerConfig.headerAlign}
          titleColorPrimary={headerConfig.titleColorPrimary}
          subtitleAboveTitle={headerConfig.subtitleAboveTitle}
          uppercaseText={headerConfig.uppercaseText}
          brandColor={brandColor}
        />
        <TeamSectionShared
          context="site"
          members={safeMembers}
          style={style}
          title={sectionTitle}
          tokens={tokens}
          mode={mode}
          carouselId="team-site-carousel"
          skipHeader={true}
        />
      </div>
    </section>
  );
}
