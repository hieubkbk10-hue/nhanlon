'use client';

import React from 'react';
import { SectionHeader } from '@/app/admin/home-components/_shared/components/SectionHeader';
import { extractSectionHeaderConfig } from '@/app/admin/home-components/_shared/hooks/useSectionHeaderState';
import { VideoSectionShared } from '@/app/admin/home-components/video/_components/VideoSectionShared';
import { getVideoColorTokens } from '@/app/admin/home-components/video/_lib/colors';
import type { VideoBrandMode, VideoConfig, VideoStyle } from '@/app/admin/home-components/video/_types';
import type { HomeComponentSectionProps } from '../types';

export function VideoRuntimeSection({ config, brandColor, secondary, mode, title }: HomeComponentSectionProps) {
  const videoConfig = config as unknown as Partial<VideoConfig>;

  const style: VideoStyle = (
    videoConfig.style === 'centered'
    || videoConfig.style === 'split'
    || videoConfig.style === 'fullwidth'
    || videoConfig.style === 'cinema'
    || videoConfig.style === 'minimal'
    || videoConfig.style === 'parallax'
  )
    ? videoConfig.style
    : 'centered';

  const tokens = getVideoColorTokens({
    primary: brandColor,
    secondary,
    mode: mode as VideoBrandMode,
    style,
  });

  const headerConfig = extractSectionHeaderConfig(config);

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

        <VideoSectionShared
          context="site"
          style={style}
          title={title}
          config={{
            videoUrl: videoConfig.videoUrl || '',
            thumbnailUrl: videoConfig.thumbnailUrl,
            heading: videoConfig.heading,
            description: videoConfig.description,
            badge: videoConfig.badge,
            buttonText: videoConfig.buttonText,
            buttonLink: videoConfig.buttonLink,
            autoplay: videoConfig.autoplay,
            loop: videoConfig.loop,
            muted: videoConfig.muted,
            style,
          }}
          tokens={tokens}
        />
      </div>
    </section>
  );
}
