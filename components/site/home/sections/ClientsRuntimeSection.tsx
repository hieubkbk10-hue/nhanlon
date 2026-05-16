'use client';

import React from 'react';
import { SectionHeader } from '@/app/admin/home-components/_shared/components/SectionHeader';
import { extractSectionHeaderConfig } from '@/app/admin/home-components/_shared/hooks/useSectionHeaderState';
import { ClientsSectionShared, normalizeClientsStyleSafe } from '@/app/admin/home-components/clients/_components/ClientsSectionShared';
import { getClientsColorTokens } from '@/app/admin/home-components/clients/_lib/colors';
import { normalizeClientItems } from '@/app/admin/home-components/clients/_lib/items';
import type { ClientsConfig } from '@/app/admin/home-components/clients/_types';
import type { HomeComponentSectionProps } from '../types';

export function ClientsRuntimeSection({ config, brandColor, secondary, mode, title }: HomeComponentSectionProps) {
  const clientsConfig = config as Partial<ClientsConfig>;
  const items = normalizeClientItems(clientsConfig.items);
  if (items.length === 0) {return null;}

  const style = normalizeClientsStyleSafe(clientsConfig.style);
  const tokens = getClientsColorTokens({ primary: brandColor, secondary, mode });
  const headerConfig = extractSectionHeaderConfig(config);

  return (
    <section className="py-8 px-3" style={{ backgroundColor: tokens.neutralBackground }}>
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
        <ClientsSectionShared
          context="site"
          title={title}
          style={style}
          items={items}
          tokens={tokens}
          skipHeader={true}
          noBorderRadius={clientsConfig.noBorderRadius === true}
          brandColor={brandColor}
        />
      </div>
    </section>
  );
}
