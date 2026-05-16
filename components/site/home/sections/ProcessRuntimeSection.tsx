'use client';

import React from 'react';
import { SectionHeader } from '@/app/admin/home-components/_shared/components/SectionHeader';
import { extractSectionHeaderConfig } from '@/app/admin/home-components/_shared/hooks/useSectionHeaderState';
import { ProcessSectionShared } from '@/app/admin/home-components/process/_components/ProcessSectionShared';
import { normalizeProcessRenderSteps } from '@/app/admin/home-components/process/_lib/normalize';
import type { ProcessBrandMode, ProcessStyle } from '@/app/admin/home-components/process/_types';
import type { HomeComponentSectionProps } from '../types';

export function ProcessRuntimeSection({ config, brandColor, secondary, mode, title }: HomeComponentSectionProps) {
  const rawSteps = Array.isArray(config.steps) ? config.steps : [];
  const steps = normalizeProcessRenderSteps(rawSteps);

  const style: ProcessStyle = (
    config.style === 'horizontal'
    || config.style === 'stepper'
    || config.style === 'cards'
    || config.style === 'accordion'
    || config.style === 'minimal'
    || config.style === 'grid'
    || config.style === 'alternating'
  )
    ? config.style as ProcessStyle
    : 'horizontal';

  const headerConfig = extractSectionHeaderConfig(config);

  const rawDesktopCols = config.desktopColumns;
  const desktopColumns: 3 | 4 = rawDesktopCols === 3 ? 3 : 4;

  return (
    <section className="py-8 px-3">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          title={title}
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

        <ProcessSectionShared
          steps={steps}
          sectionTitle={title || ''}
          style={style}
          brandColor={brandColor}
          secondary={secondary}
          mode={mode as ProcessBrandMode}
          context="site"
          hideHeader={true}
          showTitle={headerConfig.showTitle}
          showSubtitle={headerConfig.showSubtitle}
          subtitle={headerConfig.subtitle}
          headerAlign={headerConfig.headerAlign}
          titleColorPrimary={headerConfig.titleColorPrimary}
          subtitleAboveTitle={headerConfig.subtitleAboveTitle}
          uppercaseText={headerConfig.uppercaseText}
          showBadge={headerConfig.showBadge}
          badgeText={headerConfig.badgeText}
          desktopColumns={desktopColumns}
        />
      </div>
    </section>
  );
}
