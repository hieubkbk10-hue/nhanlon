'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { AlertCircle, Loader2, ChevronDown } from 'lucide-react';
import { ToggleSwitch } from '@/components/modules/shared';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, Label, cn } from '../../../../components/ui';
import { TypeColorOverrideCard } from '../../../_shared/components/TypeColorOverrideCard';
import { TypeFontOverrideCard } from '../../../_shared/components/TypeFontOverrideCard';
import { useTypeColorOverrideState } from '../../../_shared/hooks/useTypeColorOverride';
import { useTypeFontOverrideState } from '../../../_shared/hooks/useTypeFontOverride';
import { getSuggestedSecondary, resolveSecondaryByMode } from '../../../_shared/lib/typeColorOverride';
import { StatsForm, type StatsFormItem } from '../../_components/StatsForm';
import { StatsPreview } from '../../_components/StatsPreview';
import { InputWithClear } from '../../_components/InputWithClear';
import { HomeComponentStickyFooter } from '@/app/admin/home-components/_shared/components/HomeComponentStickyFooter';
import { DEFAULT_STATS_ITEMS, DEFAULT_STATS_CONFIG } from '../../_lib/constants';
import type { StatsBrandMode, StatsItem, StatsStyle, StatsHeaderAlign, StatsMediaPlacement, StatsMediaAlign } from '../../_types';

const COMPONENT_TYPE = 'Stats';

export default function StatsEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { customState, effectiveColors, initialCustom, setCustomState, setInitialCustom, showCustomBlock } = useTypeColorOverrideState(COMPONENT_TYPE);
  const { customState: customFontState, effectiveFont, initialCustom: initialFontCustom, setCustomState: setCustomFontState, setInitialCustom: setInitialFontCustom, showCustomBlock: showFontCustomBlock } = useTypeFontOverrideState(COMPONENT_TYPE);
  const setTypeColorOverride = useMutation(api.homeComponentSystemConfig.setTypeColorOverride);
  const setTypeFontOverride = useMutation(api.homeComponentSystemConfig.setTypeFontOverride);
  const component = useQuery(api.homeComponents.getById, { id: id as Id<'homeComponents'> });
  const updateMutation = useMutation(api.homeComponents.update);

  const [hideHeader, setHideHeader] = useState(false);
  const [title, setTitle] = useState('');
  const [showTitle, setShowTitle] = useState(DEFAULT_STATS_CONFIG.showTitle !== false);
  const [subtitle, setSubtitle] = useState('');
  const [showSubtitle, setShowSubtitle] = useState(DEFAULT_STATS_CONFIG.showSubtitle !== false);
  const [headerAlign, setHeaderAlign] = useState<StatsHeaderAlign>(DEFAULT_STATS_CONFIG.headerAlign ?? 'left');
  const [desktopColumns, setDesktopColumns] = useState<3 | 4>(DEFAULT_STATS_CONFIG.desktopColumns ?? 4);
  const [mediaPlacement, setMediaPlacement] = useState<StatsMediaPlacement>(DEFAULT_STATS_CONFIG.mediaPlacement ?? 'top');
  const [mediaAlign, setMediaAlign] = useState<StatsMediaAlign>(DEFAULT_STATS_CONFIG.mediaAlign ?? 'center');
  const [backgroundImage, setBackgroundImage] = useState(DEFAULT_STATS_CONFIG.backgroundImage ?? '');
  const [fullWidth, setFullWidth] = useState(DEFAULT_STATS_CONFIG.fullWidth ?? false);
  const [titleColorPrimary, setTitleColorPrimary] = useState(false);
  const [subtitleAboveTitle, setSubtitleAboveTitle] = useState(false);
  const [uppercaseText, setUppercaseText] = useState(false);
  const [showBadge, setShowBadge] = useState(true);
  const [badgeText, setBadgeText] = useState('');
  const [enableAnimation, setEnableAnimation] = useState(false);
  const [active, setActive] = useState(true);
  const [statsItems, setStatsItems] = useState<StatsFormItem[]>([]);
  const [statsStyle, setStatsStyle] = useState<StatsStyle>('horizontal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    header: false,
    config: false,
  });
  const [initialData, setInitialData] = useState<{
    hideHeader: boolean;
    title: string;
    showTitle: boolean;
    subtitle: string;
    showSubtitle: boolean;
    headerAlign: StatsHeaderAlign;
    desktopColumns: 3 | 4;
    mediaPlacement: StatsMediaPlacement;
    mediaAlign: StatsMediaAlign;
    backgroundImage: string;
    fullWidth: boolean;
    titleColorPrimary: boolean;
    subtitleAboveTitle: boolean;
    uppercaseText: boolean;
    showBadge: boolean;
    badgeText: string;
    enableAnimation: boolean;
    active: boolean;
    items: StatsFormItem[];
    style: StatsStyle;
  } | null>(null);
  const resolvedCustomSecondary = resolveSecondaryByMode(customState.mode, customState.primary, customState.secondary);
  const resolvedInitialSecondary = resolveSecondaryByMode(initialCustom.mode, initialCustom.primary, initialCustom.secondary);

  useEffect(() => {
    if (component) {
      if (component.type !== 'Stats') {
        router.replace(`/admin/home-components/${id}/edit`);
        return;
      }

      setTitle(component.title);
      setActive(component.active);

      const config = component.config ?? {};
      const items = (config.items as StatsItem[] | undefined) ?? DEFAULT_STATS_ITEMS;
      const mappedItems = items.map((item, idx) => ({ 
        id: `stat-${idx}`, 
        label: item.label, 
        value: item.value,
        description: item.description,
        iconType: item.iconType,
        iconName: item.iconName,
        iconUrl: item.iconUrl,
      }));
      const style = (config.style as StatsStyle) || 'horizontal';
      const resolvedShowTitle = typeof config.showTitle === 'boolean' ? config.showTitle : DEFAULT_STATS_CONFIG.showTitle !== false;
      const resolvedShowSubtitle = typeof config.showSubtitle === 'boolean' ? config.showSubtitle : DEFAULT_STATS_CONFIG.showSubtitle !== false;
      const resolvedSubtitle = typeof config.subtitle === 'string' ? config.subtitle : DEFAULT_STATS_CONFIG.subtitle ?? '';
      const resolvedHeaderAlign = (config.headerAlign as StatsHeaderAlign) || DEFAULT_STATS_CONFIG.headerAlign || 'left';
      const resolvedDesktopColumns = (config.desktopColumns as 3 | 4) || DEFAULT_STATS_CONFIG.desktopColumns || 4;
      const resolvedMediaPlacement = (config.mediaPlacement as StatsMediaPlacement) || DEFAULT_STATS_CONFIG.mediaPlacement || 'top';
      const resolvedMediaAlign = (config.mediaAlign as StatsMediaAlign) || DEFAULT_STATS_CONFIG.mediaAlign || 'center';
      const resolvedBackgroundImage = typeof config.backgroundImage === 'string' ? config.backgroundImage : DEFAULT_STATS_CONFIG.backgroundImage ?? '';
      const resolvedFullWidth = typeof config.fullWidth === 'boolean' ? config.fullWidth : DEFAULT_STATS_CONFIG.fullWidth ?? false;
      const resolvedTitleColorPrimary = typeof config.titleColorPrimary === 'boolean' ? config.titleColorPrimary : false;
      const resolvedSubtitleAboveTitle = typeof config.subtitleAboveTitle === 'boolean' ? config.subtitleAboveTitle : false;
      const resolvedUppercaseText = typeof config.uppercaseText === 'boolean' ? config.uppercaseText : false;
      const resolvedShowBadge = typeof config.showBadge === 'boolean' ? config.showBadge : true;
      const resolvedBadgeText = typeof config.badgeText === 'string' ? config.badgeText : '';
      const resolvedEnableAnimation = typeof config.enableAnimation === 'boolean' ? config.enableAnimation : false;
      const resolvedHideHeader = typeof config.hideHeader === 'boolean' ? config.hideHeader : false;

      setStatsItems(mappedItems);
      setStatsStyle(style);
      setShowTitle(resolvedShowTitle);
      setSubtitle(resolvedSubtitle);
      setShowSubtitle(resolvedShowSubtitle);
      setHeaderAlign(resolvedHeaderAlign);
      setDesktopColumns(resolvedDesktopColumns);
      setMediaPlacement(resolvedMediaPlacement);
      setMediaAlign(resolvedMediaAlign);
      setBackgroundImage(resolvedBackgroundImage);
      setFullWidth(resolvedFullWidth);
      setTitleColorPrimary(resolvedTitleColorPrimary);
      setSubtitleAboveTitle(resolvedSubtitleAboveTitle);
      setUppercaseText(resolvedUppercaseText);
      setShowBadge(resolvedShowBadge);
      setBadgeText(resolvedBadgeText);
      setEnableAnimation(resolvedEnableAnimation);
      setHideHeader(resolvedHideHeader);
      setInitialData({
        hideHeader: resolvedHideHeader,
        title: component.title,
        showTitle: resolvedShowTitle,
        subtitle: resolvedSubtitle,
        showSubtitle: resolvedShowSubtitle,
        headerAlign: resolvedHeaderAlign,
        desktopColumns: resolvedDesktopColumns,
        mediaPlacement: resolvedMediaPlacement,
        mediaAlign: resolvedMediaAlign,
        backgroundImage: resolvedBackgroundImage,
        fullWidth: resolvedFullWidth,
        titleColorPrimary: resolvedTitleColorPrimary,
        subtitleAboveTitle: resolvedSubtitleAboveTitle,
        uppercaseText: resolvedUppercaseText,
        showBadge: resolvedShowBadge,
        badgeText: resolvedBadgeText,
        enableAnimation: resolvedEnableAnimation,
        active: component.active,
        items: mappedItems,
        style,
      });
      setHasChanges(false);
    }
  }, [component, id, router]);

  useEffect(() => {
    if (!initialData) {return;}

    const currentItems = JSON.stringify(statsItems);
    const initialItems = JSON.stringify(initialData.items);
    const customChanged = showCustomBlock
      ? customState.enabled !== initialCustom.enabled
        || customState.mode !== initialCustom.mode
        || customState.primary !== initialCustom.primary
        || resolvedCustomSecondary !== resolvedInitialSecondary
      : false;
    const customFontChanged = showFontCustomBlock
      ? customFontState.enabled !== initialFontCustom.enabled
        || customFontState.fontKey !== initialFontCustom.fontKey
      : false;

    const changed = hideHeader !== initialData.hideHeader
      || title !== initialData.title
      || showTitle !== initialData.showTitle
      || subtitle !== initialData.subtitle
      || showSubtitle !== initialData.showSubtitle
      || headerAlign !== initialData.headerAlign
      || desktopColumns !== initialData.desktopColumns
      || mediaPlacement !== initialData.mediaPlacement
      || mediaAlign !== initialData.mediaAlign
      || backgroundImage !== initialData.backgroundImage
      || fullWidth !== initialData.fullWidth
      || titleColorPrimary !== initialData.titleColorPrimary
      || subtitleAboveTitle !== initialData.subtitleAboveTitle
      || uppercaseText !== initialData.uppercaseText
      || showBadge !== initialData.showBadge
      || badgeText !== initialData.badgeText
      || enableAnimation !== initialData.enableAnimation
      || active !== initialData.active
      || statsStyle !== initialData.style
      || currentItems !== initialItems
      || customChanged
      || customFontChanged;

    setHasChanges(changed);
  }, [hideHeader, title, showTitle, subtitle, showSubtitle, headerAlign, desktopColumns, mediaPlacement, mediaAlign, backgroundImage, fullWidth, titleColorPrimary, subtitleAboveTitle, uppercaseText, showBadge, badgeText, enableAnimation, active, statsItems, statsStyle, initialData, customState, initialCustom, showCustomBlock, customFontState, initialFontCustom, showFontCustomBlock, resolvedCustomSecondary, resolvedInitialSecondary]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) {return;}

    setIsSubmitting(true);
    try {
      await updateMutation({
        active,
        config: {
          items: statsItems.map((item) => ({ 
            label: item.label, 
            value: item.value,
            description: item.description,
            iconType: item.iconType,
            iconName: item.iconName,
            iconUrl: item.iconUrl,
          })),
          style: statsStyle,
          hideHeader,
          showTitle,
          subtitle,
          showSubtitle,
          headerAlign,
          desktopColumns,
          mediaPlacement,
          mediaAlign,
          backgroundImage,
          fullWidth,
          titleColorPrimary,
          subtitleAboveTitle,
          uppercaseText,
          showBadge,
          badgeText,
          enableAnimation,
        },
        id: id as Id<'homeComponents'>,
        title,
      });
      if (showCustomBlock) {
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
      toast.success('Đã cập nhật Thống kê');
      setInitialData({
        hideHeader,
        title,
        showTitle,
        subtitle,
        showSubtitle,
        headerAlign,
        desktopColumns,
        mediaPlacement,
        mediaAlign,
        backgroundImage,
        fullWidth,
        titleColorPrimary,
        subtitleAboveTitle,
        uppercaseText,
        showBadge,
        badgeText,
        enableAnimation,
        active,
        items: statsItems,
        style: statsStyle,
      });
      if (showCustomBlock) {
        setInitialCustom({
          enabled: customState.enabled,
          mode: customState.mode,
          primary: customState.primary,
          secondary: resolvedCustomSecondary,
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
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Chỉnh sửa Thống kê</h1>
        <Link href="/admin/home-components" className="text-sm text-blue-600 hover:underline">Quay lại danh sách</Link>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <div className="space-y-3">
              <div 
                className="cursor-pointer flex items-center justify-between"
                onClick={() => setExpandedSections(prev => ({ ...prev, header: !prev.header }))}
              >
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertCircle size={20} />
                  Tiêu đề & Mô tả
                </CardTitle>
                <ChevronDown 
                  size={16} 
                  className={cn(
                    "transition-transform duration-200",
                    expandedSections.header ? "rotate-180" : ""
                  )}
                />
              </div>

              <div 
                className="flex items-center justify-between gap-3 rounded-lg border-2 border-orange-200 bg-orange-50 px-3 py-2 dark:border-orange-800 dark:bg-orange-950/30"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-0.5">
                  <Label className="text-sm font-semibold text-orange-900 dark:text-orange-100">Ẩn toàn bộ header</Label>
                  <p className="text-xs text-orange-700 dark:text-orange-300">Bật để ẩn title, subtitle và badge</p>
                </div>
                <ToggleSwitch 
                  enabled={hideHeader} 
                  onChange={() => {
                    const newValue = !hideHeader;
                    setHideHeader(newValue);
                    if (newValue) {
                      // Đóng dropdown khi bật hideHeader
                      setExpandedSections(prev => ({ ...prev, header: false }));
                    }
                  }} 
                />
              </div>
            </div>
          </CardHeader>
          {expandedSections.header && (
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tiêu đề hiển thị <span className="text-red-500">*</span></Label>
                <InputWithClear
                  value={title}
                  onChange={setTitle}
                  required
                  placeholder="Nhập tiêu đề component..."
                />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Hiển thị title</Label>
                    <p className="text-xs text-slate-500">Tắt để ẩn tiêu đề ngoài preview/site</p>
                  </div>
                  <ToggleSwitch enabled={showTitle} onChange={() => setShowTitle((current) => !current)} />
                </div>

                <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Hiển thị subtitle</Label>
                    <p className="text-xs text-slate-500">Tắt để ẩn dòng mô tả phụ</p>
                  </div>
                  <ToggleSwitch enabled={showSubtitle} onChange={() => setShowSubtitle((current) => !current)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Subtitle</Label>
                <InputWithClear
                  value={subtitle}
                  onChange={setSubtitle}
                  placeholder="Nhập subtitle hiển thị..."
                />
              </div>

              <div className="space-y-2">
                <Label>Badge text</Label>
                <InputWithClear
                  value={badgeText}
                  onChange={setBadgeText}
                  placeholder="Nhập text cho badge (ví dụ: DỊCH VỤ CỦA CHÚNG TÔI)"
                />
              </div>

              <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700">
                <div className="space-y-0.5">
                  <Label className="text-sm">Hiển thị badge</Label>
                  <p className="text-xs text-slate-500">Bật để hiển thị badge ở trên title/subtitle</p>
                </div>
                <ToggleSwitch enabled={showBadge} onChange={() => setShowBadge((current) => !current)} />
              </div>

              <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700">
                <div className="space-y-0.5">
                  <Label className="text-sm">Title màu chính</Label>
                  <p className="text-xs text-slate-500">Bật để title hiển thị màu brand</p>
                </div>
                <ToggleSwitch enabled={titleColorPrimary} onChange={() => setTitleColorPrimary((current) => !current)} />
              </div>

              <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700">
                <div className="space-y-0.5">
                  <Label className="text-sm">Subtitle ở trên title</Label>
                  <p className="text-xs text-slate-500">Bật để hiển thị subtitle trước title</p>
                </div>
                <ToggleSwitch enabled={subtitleAboveTitle} onChange={() => setSubtitleAboveTitle((current) => !current)} />
              </div>

              <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700">
                <div className="space-y-0.5">
                  <Label className="text-sm">Viết in hoa</Label>
                  <p className="text-xs text-slate-500">Bật để title và subtitle viết in hoa</p>
                </div>
                <ToggleSwitch enabled={uppercaseText} onChange={() => setUppercaseText((current) => !current)} />
              </div>

              <div className="space-y-2">
                <Label>Căn tiêu đề / subtitle</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'left', label: 'Trái' },
                    { value: 'center', label: 'Giữa' },
                    { value: 'right', label: 'Phải' },
                  ].map((option) => {
                    const selected = headerAlign === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setHeaderAlign(option.value as StatsHeaderAlign)}
                        className={cn(
                          'h-9 rounded-md border text-xs transition-colors',
                          selected
                            ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300'
                            : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300',
                        )}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        <Card className="mb-6">
          <CardHeader 
            className="cursor-pointer"
            onClick={() => setExpandedSections(prev => ({ ...prev, config: !prev.config }))}
          >
            <CardTitle className="text-base flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle size={20} />
                Cấu hình hiển thị
              </div>
              <ChevronDown 
                size={16} 
                className={cn(
                  "transition-transform duration-200",
                  expandedSections.config ? "rotate-180" : ""
                )}
              />
            </CardTitle>
          </CardHeader>
          {expandedSections.config && (
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

              <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700">
                <div className="space-y-0.5">
                  <Label className="text-sm">Full width desktop</Label>
                  <p className="text-xs text-slate-500">Bật để mở rộng toàn màn hình</p>
                </div>
                <ToggleSwitch enabled={fullWidth} onChange={() => setFullWidth((current) => !current)} />
              </div>

              <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700">
                <div className="space-y-0.5">
                  <Label className="text-sm">Animation số liệu</Label>
                  <p className="text-xs text-slate-500">Bật để số liệu tăng từ 0 khi scroll vào</p>
                </div>
                <ToggleSwitch enabled={enableAnimation} onChange={() => setEnableAnimation((current) => !current)} />
              </div>
</CardContent>
          )}
        </Card>

        <StatsForm 
          items={statsItems} 
          onChange={setStatsItems}
          mediaPlacement={mediaPlacement}
          mediaAlign={mediaAlign}
          backgroundImage={backgroundImage}
          onMediaPlacementChange={setMediaPlacement}
          onMediaAlignChange={setMediaAlign}
          onBackgroundImageChange={setBackgroundImage}
          defaultExpanded={false}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,420px] gap-6">
          <div></div>
          <div className="lg:sticky lg:top-6 lg:self-start space-y-4">
            {showCustomBlock && (
              <TypeColorOverrideCard
                title="Màu custom cho Thống kê"
                enabled={customState.enabled}
                mode={customState.mode}
                primary={customState.primary}
                secondary={customState.secondary}
                onEnabledChange={(next) => setCustomState((prev) => ({ ...prev, enabled: next }))}
                onModeChange={(next) => {
                  if (next === 'single') {
                    setCustomState((prev) => ({ ...prev, mode: 'single', secondary: prev.primary }));
                    return;
                  }
                  setCustomState((prev) => ({
                    ...prev,
                    mode: 'dual',
                    secondary: prev.mode === 'single' ? getSuggestedSecondary(prev.primary) : prev.secondary,
                  }));
                }}
                onPrimaryChange={(value) => {
                  setCustomState((prev) => ({
                    ...prev,
                    primary: value,
                    secondary: prev.mode === 'single' ? value : prev.secondary,
                  }));
                }}
                onSecondaryChange={(value) => setCustomState((prev) => ({ ...prev, secondary: value }))}
              />
            )}
            {showFontCustomBlock && (
              <TypeFontOverrideCard
                title="Font custom cho Thống kê"
                enabled={customFontState.enabled}
                fontKey={customFontState.fontKey}
                compact
                toggleLabel="Custom"
                fontLabel="Font"
                onEnabledChange={(next) => setCustomFontState((prev) => ({ ...prev, enabled: next }))}
                onFontChange={(next) => setCustomFontState((prev) => ({ ...prev, fontKey: next }))}
              />
            )}
            <StatsPreview
              items={statsItems}
              brandColor={effectiveColors.primary}
              secondary={effectiveColors.secondary}
              mode={effectiveColors.mode as StatsBrandMode}
              selectedStyle={statsStyle}
              onStyleChange={setStatsStyle}
              fontStyle={fontStyle}
              fontClassName="font-active"
              title={title}
              showTitle={showTitle}
              showSubtitle={showSubtitle}
              subtitle={subtitle}
              headerAlign={headerAlign}
              desktopColumns={desktopColumns}
              mediaPlacement={mediaPlacement}
              mediaAlign={mediaAlign}
              backgroundImage={backgroundImage}
              fullWidth={fullWidth}
              hideHeader={hideHeader}
              titleColorPrimary={titleColorPrimary}
              subtitleAboveTitle={subtitleAboveTitle}
              uppercaseText={uppercaseText}
              showBadge={showBadge}
              badgeText={badgeText}
              enableAnimation={enableAnimation}
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
