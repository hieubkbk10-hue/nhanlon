'use client';

import React from 'react';
import { SectionHeader } from '@/app/admin/home-components/_shared/components/SectionHeader';
import { extractSectionHeaderConfig } from '@/app/admin/home-components/_shared/hooks/useSectionHeaderState';
import { FaqSectionShared } from '@/app/admin/home-components/faq/_components/FaqSectionShared';
import { getFaqColors } from '@/app/admin/home-components/faq/_lib/colors';
import type { FaqConfig, FaqItem, FaqStyle } from '@/app/admin/home-components/faq/_types';
import type { HomeComponentSectionProps } from '../types';

export function FaqRuntimeSection({ config, brandColor, secondary, mode, title }: HomeComponentSectionProps) {
  const faqConfig = config as FaqConfig & { items?: Array<{ question?: string; answer?: string }>; style?: FaqStyle };
  const items: FaqItem[] = (faqConfig.items ?? []).map((item, idx) => ({
    answer: item.answer ?? '',
    id: idx,
    question: item.question ?? '',
  }));
  const style: FaqStyle = faqConfig.style ?? 'accordion';
  const tokens = getFaqColors({ primary: brandColor, secondary, mode, style });
  const headerConfig = extractSectionHeaderConfig(config);
  const hasSharedHeader = !headerConfig.hideHeader && (
    (headerConfig.showTitle && title.trim().length > 0)
    || (headerConfig.showSubtitle && (headerConfig.subtitle?.trim().length ?? 0) > 0)
    || (headerConfig.showBadge && (headerConfig.badgeText?.trim().length ?? 0) > 0)
  );
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <section className="py-8 px-3">
        <div className="mx-auto max-w-7xl space-y-6">
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
          <FaqSectionShared
            items={items}
            title={title}
            style={style}
            config={{
              buttonLink: faqConfig.buttonLink,
              buttonText: faqConfig.buttonText,
              description: faqConfig.description,
            }}
            tokens={tokens}
            context="site"
            suppressInternalHeader={hasSharedHeader}
          />
        </div>
      </section>
    </>
  );
}
