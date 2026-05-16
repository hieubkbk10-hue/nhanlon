'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { Loader2, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, Label, cn } from '../../../../components/ui';
import { HeaderConfigSection } from '../../../_shared/components/HeaderConfigSection';
import { TypeColorOverrideCard } from '../../../_shared/components/TypeColorOverrideCard';
import { TypeFontOverrideCard } from '../../../_shared/components/TypeFontOverrideCard';
import { useTypeColorOverrideState } from '../../../_shared/hooks/useTypeColorOverride';
import { useTypeFontOverrideState } from '../../../_shared/hooks/useTypeFontOverride';
import { extractSectionHeaderConfig, useSectionHeaderState } from '../../../_shared/hooks/useSectionHeaderState';
import { getSuggestedSecondary, resolveSecondaryByMode } from '../../../_shared/lib/typeColorOverride';
import { GalleryForm } from '../../../gallery/_components/GalleryForm';
import { TrustBadgesPreview } from '../../../gallery/_components/TrustBadgesPreview';
import { HomeComponentStickyFooter } from '@/app/admin/home-components/_shared/components/HomeComponentStickyFooter';
import { DEFAULT_GALLERY_ITEMS } from '../../../gallery/_lib/constants';
import { getGalleryPersistSafeColors, normalizeGalleryHarmony } from '../../../gallery/_lib/colors';
import { normalizeTrustBadgesStyle, type GalleryItem, type TrustBadgesStyle } from '../../../gallery/_types';

const COMPONENT_TYPE = 'TrustBadges';

const buildHeaderSnapshot = ({
  badgeText,
  headerAlign,
  hideHeader,
  showBadge,
  showSubtitle,
  showTitle,
  subtitle,
  subtitleAboveTitle,
  titleColorPrimary,
  uppercaseText,
}: {
  badgeText?: string;
  headerAlign?: 'left' | 'center' | 'right';
  hideHeader?: boolean;
  showBadge?: boolean;
  showSubtitle?: boolean;
  showTitle?: boolean;
  subtitle?: string;
  subtitleAboveTitle?: boolean;
  titleColorPrimary?: boolean;
  uppercaseText?: boolean;
}) => ({
  hideHeader: hideHeader ?? false,
  showTitle: showTitle ?? true,
  subtitle: subtitle ?? '',
  showSubtitle: showSubtitle ?? true,
  headerAlign: headerAlign ?? 'left',
  titleColorPrimary: titleColorPrimary ?? false,
  subtitleAboveTitle: subtitleAboveTitle ?? false,
  uppercaseText: uppercaseText ?? false,
  showBadge: showBadge ?? true,
  badgeText: badgeText ?? '',
});

export default function TrustBadgesEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { customState, effectiveColors, initialCustom, setCustomState, setInitialCustom, showCustomBlock } = useTypeColorOverrideState(COMPONENT_TYPE);
  const { customState: customFontState, effectiveFont, initialCustom: initialFontCustom, setCustomState: setCustomFontState, setInitialCustom: setInitialFontCustom, showCustomBlock: showFontCustomBlock } = useTypeFontOverrideState(COMPONENT_TYPE);
  const setTypeColorOverride = useMutation(api.homeComponentSystemConfig.setTypeColorOverride);
  const setTypeFontOverride = useMutation(api.homeComponentSystemConfig.setTypeFontOverride);
  const component = useQuery(api.homeComponents.getById, { id: id as Id<'homeComponents'> });
  const updateMutation = useMutation(api.homeComponents.update);

  const [title, setTitle] = useState('');
  const [active, setActive] = useState(true);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(DEFAULT_GALLERY_ITEMS);
  const [trustBadgesStyle, setTrustBadgesStyle] = useState<TrustBadgesStyle>('cards');
  const [desktopColumns, setDesktopColumns] = useState<3 | 4>(4);
  const [expandedSections, setExpandedSections] = useState({ header: false });
  const headerState = useSectionHeaderState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialSnapshot, setInitialSnapshot] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (!component) {return;}
    if (component.type !== 'TrustBadges') {
      router.replace(`/admin/home-components/${id}/edit`);
      return;
    }

    setTitle(component.title);
    setActive(component.active);

    const config = component.config ?? {};
    const items = (config.items as { url: string; link: string; name?: string }[] | undefined) ?? DEFAULT_GALLERY_ITEMS;
    const normalizedItems = items.map((item, idx) => ({ id: `item-${idx + 1}`, link: item.link || '', name: item.name ?? '', url: item.url }));
    setGalleryItems(normalizedItems);

    const nextStyle = normalizeTrustBadgesStyle(config.style);
    setTrustBadgesStyle(nextStyle);
    setDesktopColumns(config.desktopColumns === 3 ? 3 : 4);

    const headerConfig = extractSectionHeaderConfig(config);
    headerState.setHideHeader(headerConfig.hideHeader ?? false);
    headerState.setShowTitle(headerConfig.showTitle ?? true);
    headerState.setSubtitle(headerConfig.subtitle ?? '');
    headerState.setShowSubtitle(headerConfig.showSubtitle ?? true);
    headerState.setHeaderAlign(headerConfig.headerAlign ?? 'center');
    headerState.setTitleColorPrimary(headerConfig.titleColorPrimary ?? false);
    headerState.setSubtitleAboveTitle(headerConfig.subtitleAboveTitle ?? false);
    headerState.setUppercaseText(headerConfig.uppercaseText ?? false);
    headerState.setShowBadge(headerConfig.showBadge ?? true);
    headerState.setBadgeText(headerConfig.badgeText ?? '');

    setInitialSnapshot(JSON.stringify({
      title: component.title,
      active: component.active,
      items: normalizedItems,
      style: nextStyle,
      desktopColumns: config.desktopColumns === 3 ? 3 : 4,
      header: buildHeaderSnapshot(headerConfig),
      type: component.type,
    }));
  }, [component, id, router]);

  useEffect(() => {
    if (!component || !initialSnapshot) {return;}
    const snapshot = JSON.stringify({
      title,
      active,
      items: galleryItems,
      style: trustBadgesStyle,
      desktopColumns,
      header: buildHeaderSnapshot({
        badgeText: headerState.badgeText,
        headerAlign: headerState.headerAlign,
        hideHeader: headerState.hideHeader,
        showBadge: headerState.showBadge,
        showSubtitle: headerState.showSubtitle,
        showTitle: headerState.showTitle,
        subtitle: headerState.subtitle,
        subtitleAboveTitle: headerState.subtitleAboveTitle,
        titleColorPrimary: headerState.titleColorPrimary,
        uppercaseText: headerState.uppercaseText,
      }),
      type: component.type,
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
    setHasChanges(snapshot !== initialSnapshot || customChanged || customFontChanged);
  }, [title, active, galleryItems, trustBadgesStyle, desktopColumns, headerState.hideHeader, headerState.showTitle, headerState.subtitle, headerState.showSubtitle, headerState.headerAlign, headerState.titleColorPrimary, headerState.subtitleAboveTitle, headerState.uppercaseText, headerState.showBadge, headerState.badgeText, component, initialSnapshot, customState, initialCustom, showCustomBlock, customFontState, initialFontCustom, showFontCustomBlock]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) {return;}

    const harmony = normalizeGalleryHarmony((component?.config as { harmony?: string } | undefined)?.harmony);
    const { autoHeal } = getGalleryPersistSafeColors({
      primary: effectiveColors.primary,
      secondary: effectiveColors.secondary,
      mode: effectiveColors.mode,
      harmony,
    });

    if (autoHeal.didAutoHealHarmony || autoHeal.didAutoHealText) {
      const messages: string[] = [];
      if (autoHeal.didAutoHealHarmony) {
        messages.push('Hệ thống đã tự tối ưu màu phụ để đảm bảo hài hòa.');
      }
      if (autoHeal.didAutoHealText) {
        messages.push('Hệ thống đã tự điều chỉnh màu chữ để tăng độ đọc.');
      }
      if (autoHeal.isStillSimilar) {
        messages.push('Màu phụ vẫn khá gần màu chính, đã chọn phương án gần nhất.');
      }
      toast.info(messages.join(' '));
    }

    setIsSubmitting(true);
    try {
      await updateMutation({
        active,
        config: {
          items: galleryItems.map((item) => ({ link: item.link, name: item.name, url: item.url })),
          style: trustBadgesStyle,
          desktopColumns,
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
        },
        id: id as Id<'homeComponents'>,
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
      toast.success('Đã cập nhật component');
      setInitialSnapshot(JSON.stringify({
        title,
        active,
        items: galleryItems,
        style: trustBadgesStyle,
        desktopColumns,
        header: buildHeaderSnapshot({
          badgeText: headerState.badgeText,
          headerAlign: headerState.headerAlign,
          hideHeader: headerState.hideHeader,
          showBadge: headerState.showBadge,
          showSubtitle: headerState.showSubtitle,
          showTitle: headerState.showTitle,
          subtitle: headerState.subtitle,
          subtitleAboveTitle: headerState.subtitleAboveTitle,
          titleColorPrimary: headerState.titleColorPrimary,
          uppercaseText: headerState.uppercaseText,
        }),
        type: component?.type,
      }));
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
      setHasChanges(false);
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
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Chỉnh sửa Chứng nhận</h1>
        <Link href="/admin/home-components" className="text-sm text-blue-600 hover:underline">Quay lại danh sách</Link>
      </div>

      <form onSubmit={handleSubmit}>
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
          expanded={expandedSections.header}
          onExpandedChange={(value) => setExpandedSections({ header: value })}
          titleRequired={true}
          titleLabel="Tiêu đề hiển thị"
          titlePlaceholder="Nhập tiêu đề component..."
        />

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield size={20} />
              Cấu hình hiển thị
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Số cột desktop</Label>
              <div className="grid grid-cols-2 gap-2">
                {[3, 4].map((option) => {
                  const selected = desktopColumns === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setDesktopColumns(option as 3 | 4)}
                      className={cn(
                        'h-9 rounded-md border text-xs transition-colors',
                        selected
                          ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300'
                          : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300',
                      )}
                    >
                      {option} cột
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <GalleryForm
          galleryItems={galleryItems}
          setGalleryItems={setGalleryItems}
          componentType="TrustBadges"
          style="grid"
          onAiImport={setGalleryItems}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,420px] gap-6">
          <div></div>
          <div className="lg:sticky lg:top-6 lg:self-start space-y-4">
            {showCustomBlock && (
              <TypeColorOverrideCard
                title="Màu custom cho Chứng nhận"
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
                title="Font custom cho Chứng nhận"
                enabled={customFontState.enabled}
                fontKey={customFontState.fontKey}
                compact
                toggleLabel="Custom"
                fontLabel="Font"
                onEnabledChange={(next) => setCustomFontState((prev) => ({ ...prev, enabled: next }))}
                onFontChange={(next) => setCustomFontState((prev) => ({ ...prev, fontKey: next }))}
              />
            )}
            <TrustBadgesPreview
              items={galleryItems.map((item, idx) => ({ id: idx + 1, link: item.link, name: item.name, url: item.url }))}
              brandColor={effectiveColors.primary}
              secondary={effectiveColors.secondary}
              mode={effectiveColors.mode}
              selectedStyle={trustBadgesStyle}
              onStyleChange={setTrustBadgesStyle}
              desktopColumns={desktopColumns}
              config={{
                badgeText: headerState.badgeText,
                headerAlign: headerState.headerAlign,
                heading: title,
                hideHeader: headerState.hideHeader,
                showBadge: headerState.showBadge,
                showSubtitle: headerState.showSubtitle,
                showTitle: headerState.showTitle,
                subHeading: headerState.subtitle,
                subtitleAboveTitle: headerState.subtitleAboveTitle,
                titleColorPrimary: headerState.titleColorPrimary,
                uppercaseText: headerState.uppercaseText,
              }}
              fontStyle={fontStyle}
              fontClassName="font-active"
            />
          </div>
        </div>

        <HomeComponentStickyFooter
          isSubmitting={isSubmitting}
          hasChanges={hasChanges}
          onCancel={() =>{  router.push('/admin/home-components'); }}
          submitLabel="Lưu thay đổi"
        active={active}
        onActiveChange={setActive}
        />
      </form>
    </div>
  );
}
