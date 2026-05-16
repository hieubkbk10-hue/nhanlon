'use client';

import React from 'react';
import { SectionHeader } from '@/app/admin/home-components/_shared/components/SectionHeader';
import { extractSectionHeaderConfig } from '@/app/admin/home-components/_shared/hooks/useSectionHeaderState';
import { FeaturesSectionShared } from '@/app/admin/home-components/features/_components/FeaturesSectionShared';
import type { FeatureItem, FeaturesStyle } from '@/app/admin/home-components/features/_types';
import type { HomeComponentSectionProps } from '../types';

export function FeaturesRuntimeSection({ config, brandColor, secondary, mode, title }: HomeComponentSectionProps) {
  const items = Array.isArray(config.items) ? (config.items as FeatureItem[]) : [];
  const style = (config.style as FeaturesStyle) ?? 'iconGrid';
  const showIcons = config.showIcons !== false;
  const headerConfig = extractSectionHeaderConfig(config);
  const isFullwidthCarousel = style === 'carousel6';

  return (
    <section className={isFullwidthCarousel ? 'py-0 w-full overflow-hidden' : 'py-8 px-3'}>
      <div className={isFullwidthCarousel ? 'w-full' : 'mx-auto max-w-7xl'}>
        <div className={isFullwidthCarousel ? 'mx-auto max-w-7xl px-3 pt-8' : undefined}>
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
        </div>
        <FeaturesSectionShared
          items={items}
          style={style}
          showIcons={showIcons}
          title={title}
          brandColor={brandColor}
          secondary={secondary}
          mode={mode}
          context="site"
          skipHeader={true}
        />
      </div>
    </section>
  );
}
