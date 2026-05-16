"use client";

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/app/admin/components/ui';
import { TypeColorOverrideCard } from '../../../_shared/components/TypeColorOverrideCard';
import { TypeFontOverrideCard } from '../../../_shared/components/TypeFontOverrideCard';
import { HeaderConfigSection } from '../../../_shared/components/HeaderConfigSection';
import { useTypeColorOverrideState } from '../../../_shared/hooks/useTypeColorOverride';
import { useTypeFontOverrideState } from '../../../_shared/hooks/useTypeFontOverride';
import { extractSectionHeaderConfig } from '../../../_shared/hooks/useSectionHeaderState';
import { getSuggestedSecondary, resolveSecondaryByMode } from '../../../_shared/lib/typeColorOverride';
import { PartnersForm } from '../../_components/PartnersForm';
import { PartnersPreview } from '../../_components/PartnersPreview';
import { HomeComponentStickyFooter } from '@/app/admin/home-components/_shared/components/HomeComponentStickyFooter';
import { DEFAULT_PARTNERS_DISPLAY_MODE, normalizePartnersDisplayMode, normalizePartnersStyle, type PartnerItem, type PartnersDisplayMode, type PartnersStyle } from '../../_types';
import { AiDemoPartnersImport } from '../../../product-list/_components/AiDemoProductsImport';

const COMPONENT_TYPE = 'Partners';

export default function PartnersEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { customState, effectiveColors, initialCustom, setCustomState, setInitialCustom, showCustomBlock } = useTypeColorOverrideState(COMPONENT_TYPE);
  const { customState: customFontState, effectiveFont, initialCustom: initialFontCustom, setCustomState: setCustomFontState, setInitialCustom: setInitialFontCustom, showCustomBlock: showFontCustomBlock } = useTypeFontOverrideState(COMPONENT_TYPE);
  const setTypeColorOverride = useMutation(api.homeComponentSystemConfig.setTypeColorOverride);
  const setTypeFontOverride = useMutation(api.homeComponentSystemConfig.setTypeFontOverride);
  const component = useQuery(api.homeComponents.getById, { id: id as Id<"homeComponents"> });
  const updateMutation = useMutation(api.homeComponents.update);

  const [title, setTitle] = useState('');
  const [active, setActive] = useState(true);
  const [partnersItems, setPartnersItems] = useState<PartnerItem[]>([]);
  const [partnersStyle, setPartnersStyle] = useState<PartnersStyle>('grid');
  const [displayMode, setDisplayMode] = useState<PartnersDisplayMode>(DEFAULT_PARTNERS_DISPLAY_MODE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialSnapshot, setInitialSnapshot] = useState<string | null>(null);

  const DEMO_PARTNERS_ITEMS: PartnerItem[] = [
    { id: 'demo-1', link: '', name: 'Apex Digital', url: '/demo/partners/partner-1.png' },
    { id: 'demo-2', link: '', name: 'NexaCore', url: '/demo/partners/partner-2.png' },
    { id: 'demo-3', link: '', name: 'InfiniLoop', url: '/demo/partners/partner-3.png' },
    { id: 'demo-4', link: '', name: 'Summit Labs', url: '/demo/partners/partner-4.png' },
    { id: 'demo-5', link: '', name: 'GreenLeaf', url: '/demo/partners/partner-5.png' },
    { id: 'demo-6', link: '', name: 'Globex Corp', url: '/demo/partners/partner-6.png' },
  ];

  const handleUseDemoImages = () => {
    setPartnersItems(DEMO_PARTNERS_ITEMS);
  };

  // Header state
  const [hideHeader, setHideHeader] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const [showSubtitle, setShowSubtitle] = useState(true);
  const [subtitle, setSubtitle] = useState('');
  const [headerAlign, setHeaderAlign] = useState<'left' | 'center' | 'right'>('center');
  const [titleColorPrimary, setTitleColorPrimary] = useState(false);
  const [subtitleAboveTitle, setSubtitleAboveTitle] = useState(false);
  const [uppercaseText, setUppercaseText] = useState(false);
  const [showBadge, setShowBadge] = useState(true);
  const [badgeText, setBadgeText] = useState('Đối tác');
  const [headerExpanded, setHeaderExpanded] = useState(false);

  const normalizeItemsForCompare = (items: PartnerItem[]) => items.map(item => ({
    link: item.link?.trim() ?? '',
    name: item.name?.trim() ?? '',
    url: item.url?.trim() ?? '',
  }));

  useEffect(() => {
    if (component) {
      if (component.type !== 'Partners') {
        router.replace(`/admin/home-components/${id}/edit`);
        return;
      }

      setTitle(component.title);
      setActive(component.active);

      const config = component.config ?? {};
      const nextItems = config.items?.map((item: { url: string; link: string; name?: string }, i: number) => ({
        id: `item-${i}`,
        link: item.link || '',
        name: item.name ?? '',
        url: item.url,
      })) ?? [{ id: 'item-1', link: '', name: '', url: '' }];
      const nextStyle = normalizePartnersStyle(config.style);
      const nextDisplayMode = normalizePartnersDisplayMode(config.displayMode);

      // Load header config
      const headerConfig = extractSectionHeaderConfig(config);
      setHideHeader(headerConfig.hideHeader ?? false);
      setShowTitle(headerConfig.showTitle ?? true);
      setShowSubtitle(headerConfig.showSubtitle ?? true);
      setSubtitle(headerConfig.subtitle ?? '');
      setHeaderAlign(headerConfig.headerAlign ?? 'center');
      setTitleColorPrimary(headerConfig.titleColorPrimary ?? false);
      setSubtitleAboveTitle(headerConfig.subtitleAboveTitle ?? false);
      setUppercaseText(headerConfig.uppercaseText ?? false);
      setShowBadge(headerConfig.showBadge ?? true);
      setBadgeText(headerConfig.badgeText ?? 'Đối tác');

      setPartnersItems(nextItems);
      setPartnersStyle(nextStyle);
      setDisplayMode(nextDisplayMode);
      setInitialSnapshot(JSON.stringify({
        displayMode: nextDisplayMode,
        title: component.title.trim(),
        active: component.active,
        style: nextStyle,
        items: normalizeItemsForCompare(nextItems),
        // Header fields
        hideHeader: headerConfig.hideHeader,
        showTitle: headerConfig.showTitle,
        showSubtitle: headerConfig.showSubtitle,
        subtitle: headerConfig.subtitle,
        headerAlign: headerConfig.headerAlign,
        titleColorPrimary: headerConfig.titleColorPrimary,
        subtitleAboveTitle: headerConfig.subtitleAboveTitle,
        uppercaseText: headerConfig.uppercaseText,
        showBadge: headerConfig.showBadge,
        badgeText: headerConfig.badgeText,
      }));
    }
  }, [component, id, router]);

  const currentSnapshot = JSON.stringify({
    displayMode,
    title: title.trim(),
    active,
    style: partnersStyle,
    items: normalizeItemsForCompare(partnersItems),
    // Header fields
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
  });
  const resolvedCustomSecondary = resolveSecondaryByMode(customState.mode, customState.primary, customState.secondary);
  const customChanged = showCustomBlock
    ? customState.enabled !== initialCustom.enabled
      || customState.mode !== initialCustom.mode
      || customState.primary !== initialCustom.primary
      || resolvedCustomSecondary !== initialCustom.secondary
    : false;
  const customFontChanged = showFontCustomBlock
    ? customFontState.enabled !== initialFontCustom.enabled
      || customFontState.fontKey !== initialFontCustom.fontKey
    : false;
  const hasChanges = initialSnapshot !== null && (initialSnapshot !== currentSnapshot || customChanged || customFontChanged);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !hasChanges) {return;}

    setIsSubmitting(true);
    try {
      await updateMutation({
        active,
        config: {
          displayMode,
          items: partnersItems.map(item => ({ link: item.link, name: item.name, url: item.url })),
          style: partnersStyle,
          // Header fields
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
        },
        id: id as Id<"homeComponents">,
        title,
      });
      if (showCustomBlock) {
        const resolvedCustomSecondary = resolveSecondaryByMode(customState.mode, customState.primary, customState.secondary);
        await setTypeColorOverride({
          enabled: customState.enabled,
          mode: customState.mode,
          primary: customState.primary,
          secondary: resolvedCustomSecondary,
          type: COMPONENT_TYPE,
        });
      }
      if (showFontCustomBlock) {
        await setTypeFontOverride({
          enabled: customFontState.enabled,
          fontKey: customFontState.fontKey,
          type: COMPONENT_TYPE,
        });
      }
      setInitialSnapshot(currentSnapshot);
      if (showCustomBlock) {
        setInitialCustom({
          enabled: customState.enabled,
          mode: customState.mode,
          primary: customState.primary,
          secondary: resolveSecondaryByMode(customState.mode, customState.primary, customState.secondary),
        });
      }
      if (showFontCustomBlock) {
        setInitialFontCustom({
          enabled: customFontState.enabled,
          fontKey: customFontState.fontKey,
        });
      }
      toast.success('Đã cập nhật Partners');
    } catch (error) {
      toast.error('Lỗi khi cập nhật');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (component === undefined) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (component === null) {
    return <div className="text-center py-8 text-slate-500">Không tìm thấy component</div>;
  }

  const fontStyle = { '--font-active': `var(${effectiveFont.fontVariable})` } as React.CSSProperties;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Chỉnh sửa Partners</h1>
        <Link href="/admin/home-components" className="text-sm text-blue-600 hover:underline">Quay lại danh sách</Link>
      </div>

      <form onSubmit={handleSubmit}>
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
          expanded={headerExpanded}
          onExpandedChange={setHeaderExpanded}
          titleRequired={true}
          titleLabel="Tiêu đề hiển thị"
          titlePlaceholder="Nhập tiêu đề component..."
        />

        <PartnersForm
          items={partnersItems}
          setItems={setPartnersItems}
          displayMode={displayMode}
          setDisplayMode={setDisplayMode}
        />

        <div className="mb-6 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleUseDemoImages}>
            Dùng ảnh demo
          </Button>
          <AiDemoPartnersImport buttonClassName="h-10" onApply={setPartnersItems} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,420px] gap-6">
          <div></div>
          <div className="lg:sticky lg:top-6 lg:self-start space-y-4">
            {showCustomBlock && (
              <TypeColorOverrideCard
                title="Màu custom cho Partners"
                enabled={customState.enabled}
                mode={customState.mode}
                primary={customState.primary}
                secondary={customState.secondary}
                onEnabledChange={(next) => setCustomState((prev) => ({ ...prev, enabled: next }))}
                onModeChange={(next) => setCustomState((prev) => {
                  if (next === prev.mode) {
                    return prev;
                  }
                  if (next === 'single') {
                    return { ...prev, mode: 'single', secondary: prev.primary };
                  }
                  const nextSecondary = prev.mode === 'single'
                    ? getSuggestedSecondary(prev.primary)
                    : prev.secondary;
                  return { ...prev, mode: 'dual', secondary: nextSecondary };
                })}
                onPrimaryChange={(value) => setCustomState((prev) => ({
                  ...prev,
                  primary: value,
                  secondary: prev.mode === 'single' ? value : prev.secondary,
                }))}
                onSecondaryChange={(value) => setCustomState((prev) => ({ ...prev, secondary: value }))}
              />
            )}
            {showFontCustomBlock && (
              <TypeFontOverrideCard
                title="Font custom cho Partners"
                enabled={customFontState.enabled}
                fontKey={customFontState.fontKey}
                compact
                toggleLabel="Custom"
                fontLabel="Font"
                onEnabledChange={(next) => setCustomFontState((prev) => ({ ...prev, enabled: next }))}
                onFontChange={(next) => setCustomFontState((prev) => ({ ...prev, fontKey: next }))}
              />
            )}
            <PartnersPreview
              items={partnersItems.map((item, idx) => ({ id: idx + 1, link: item.link, name: item.name, url: item.url }))}
              brandColor={effectiveColors.primary}
              secondary={effectiveColors.secondary}
              mode={effectiveColors.mode}
              selectedStyle={partnersStyle}
              onStyleChange={setPartnersStyle}
              title={title}
              subheading={subtitle}
              align={headerAlign}
              displayMode={displayMode}
              onDisplayModeChange={setDisplayMode}
              fontStyle={fontStyle}
              fontClassName="font-active"
              hideHeader={hideHeader}
              showTitle={showTitle}
              showSubtitle={showSubtitle}
              headerAlign={headerAlign}
              titleColorPrimary={titleColorPrimary}
              subtitleAboveTitle={subtitleAboveTitle}
              uppercaseText={uppercaseText}
              showBadge={showBadge}
              badgeText={badgeText}
            />
          </div>
        </div>

        <HomeComponentStickyFooter
          isSubmitting={isSubmitting}
          hasChanges={hasChanges}
          onCancel={() => { router.push('/admin/home-components'); }}
          submitLabel="Lưu thay đổi"
          active={active}
          onActiveChange={setActive}
        />
      </form>
    </div>
  );
}
