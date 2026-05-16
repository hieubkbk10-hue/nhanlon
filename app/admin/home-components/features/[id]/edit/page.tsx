'use client';

import React, { use, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { GripVertical, Loader2, Plus, Trash2, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, cn } from '../../../../components/ui';
import { ImageFieldWithUpload } from '../../../../components/ImageFieldWithUpload';
import { TypeColorOverrideCard } from '../../../_shared/components/TypeColorOverrideCard';
import { TypeFontOverrideCard } from '../../../_shared/components/TypeFontOverrideCard';
import { HeaderConfigSection } from '../../../_shared/components/HeaderConfigSection';
import { useTypeColorOverrideState } from '../../../_shared/hooks/useTypeColorOverride';
import { useTypeFontOverrideState } from '../../../_shared/hooks/useTypeFontOverride';
import { extractSectionHeaderConfig } from '../../../_shared/hooks/useSectionHeaderState';
import { getSuggestedSecondary, resolveSecondaryByMode } from '../../../_shared/lib/typeColorOverride';
import { FeaturesPreview } from '../../_components/FeaturesPreview';
import { HomeComponentStickyFooter } from '@/app/admin/home-components/_shared/components/HomeComponentStickyFooter';
import { IconPopoverPicker } from '../../../_shared/components/IconPopoverPicker';
import {
  createFeatureItem,
  FEATURE_ICON_PICKER_OPTIONS,
  normalizeFeatureItems,
} from '../../_lib/constants';
import type { FeatureItem, FeaturesConfig, FeaturesStyle } from '../../_types';
import { AiDemoFeaturesImport } from '../../../product-list/_components/AiDemoProductsImport';

const serializeState = (payload: {
  title: string;
  active: boolean;
  items: FeatureItem[];
  style: FeaturesStyle;
  showIcons: boolean;
  hideHeader: boolean;
  showTitle: boolean;
  subtitle: string;
  showSubtitle: boolean;
  headerAlign: 'left' | 'center' | 'right';
  titleColorPrimary: boolean;
  subtitleAboveTitle: boolean;
  uppercaseText: boolean;
  showBadge: boolean;
  badgeText: string;
}) => JSON.stringify(payload);

const COMPONENT_TYPE = 'Features';

export default function FeaturesEditPage({ params }: { params: Promise<{ id: string }> }) {
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
  const [featuresItems, setFeaturesItems] = useState<FeatureItem[]>([createFeatureItem()]);
  const [style, setStyle] = useState<FeaturesStyle>('iconGrid');
  const [showIcons, setShowIcons] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialState, setInitialState] = useState('');

  const [headerExpanded, setHeaderExpanded] = useState(false);
  const [componentExpanded, setComponentExpanded] = useState(false);
  const [featuresExpanded, setFeaturesExpanded] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const [subtitle, setSubtitle] = useState('');
  const [showSubtitle, setShowSubtitle] = useState(true);
  const [headerAlign, setHeaderAlign] = useState<'left' | 'center' | 'right'>('left');
  const [titleColorPrimary, setTitleColorPrimary] = useState(false);
  const [subtitleAboveTitle, setSubtitleAboveTitle] = useState(false);
  const [uppercaseText, setUppercaseText] = useState(false);
  const [showBadge, setShowBadge] = useState(true);
  const [badgeText, setBadgeText] = useState('');

  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);

  useEffect(() => {
    if (!component) {return;}

    if (component.type !== 'Features') {
      router.replace(`/admin/home-components/${id}/edit`);
      return;
    }

    const rawConfig = (component.config ?? {}) as Partial<FeaturesConfig>;
    const nextItems = normalizeFeatureItems(rawConfig.items);
    const nextStyle = rawConfig.style ?? 'iconGrid';
    const nextShowIcons = rawConfig.showIcons !== false;
    const headerConfig = extractSectionHeaderConfig(component.config);

    setTitle(component.title);
    setActive(component.active);
    setFeaturesItems(nextItems);
    setStyle(nextStyle);
    setShowIcons(nextShowIcons);

    setHideHeader(headerConfig.hideHeader ?? false);
    setShowTitle(headerConfig.showTitle ?? true);
    setSubtitle(headerConfig.subtitle ?? '');
    setShowSubtitle(headerConfig.showSubtitle ?? true);
    setHeaderAlign(headerConfig.headerAlign ?? 'left');
    setTitleColorPrimary(headerConfig.titleColorPrimary ?? false);
    setSubtitleAboveTitle(headerConfig.subtitleAboveTitle ?? false);
    setUppercaseText(headerConfig.uppercaseText ?? false);
    setShowBadge(headerConfig.showBadge ?? true);
    setBadgeText(headerConfig.badgeText ?? '');

    setInitialState(serializeState({
      title: component.title,
      active: component.active,
      items: nextItems,
      style: nextStyle,
      showIcons: nextShowIcons,
      hideHeader: headerConfig.hideHeader ?? false,
      showTitle: headerConfig.showTitle ?? true,
      subtitle: headerConfig.subtitle ?? '',
      showSubtitle: headerConfig.showSubtitle ?? true,
      headerAlign: headerConfig.headerAlign ?? 'left',
      titleColorPrimary: headerConfig.titleColorPrimary ?? false,
      subtitleAboveTitle: headerConfig.subtitleAboveTitle ?? false,
      uppercaseText: headerConfig.uppercaseText ?? false,
      showBadge: headerConfig.showBadge ?? true,
      badgeText: headerConfig.badgeText ?? '',
    }));
  }, [component, id, router]);

  const currentState = useMemo(() => serializeState({
    title,
    active,
    items: featuresItems,
    style,
    showIcons,
    hideHeader,
    showTitle,
    subtitle,
    showSubtitle,
    headerAlign,
    titleColorPrimary,
    subtitleAboveTitle,
    uppercaseText,
    showBadge,
    badgeText,
  }), [title, active, featuresItems, style, showIcons, hideHeader, showTitle, subtitle, showSubtitle, headerAlign, titleColorPrimary, subtitleAboveTitle, uppercaseText, showBadge, badgeText]);

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
  const hasChanges = initialState.length > 0 && (currentState !== initialState || customChanged || customFontChanged);

  const dragProps = (itemId: number) => ({
    draggable: true,
    onDragStart: () => {
      setDraggedId(itemId);
    },
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      if (draggedId !== itemId) {
        setDragOverId(itemId);
      }
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      if (!draggedId || draggedId === itemId) {return;}

      setFeaturesItems((prev) => {
        const next = [...prev];
        const fromIndex = next.findIndex((item) => item.id === draggedId);
        const toIndex = next.findIndex((item) => item.id === itemId);
        if (fromIndex < 0 || toIndex < 0) {return prev;}
        const [moved] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, moved);
        return next;
      });

      setDraggedId(null);
      setDragOverId(null);
    },
    onDragEnd: () => {
      setDraggedId(null);
      setDragOverId(null);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !hasChanges) {return;}

    setIsSubmitting(true);
    try {
      await updateMutation({
        id: id as Id<'homeComponents'>,
        title,
        active,
        config: {
          items: featuresItems,
          style,
          showIcons,
          hideHeader,
          showTitle,
          subtitle,
          showSubtitle,
          headerAlign,
          titleColorPrimary,
          subtitleAboveTitle,
          uppercaseText,
          showBadge,
          badgeText,
        },
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

      const nextInitialState = serializeState({
        title,
        active,
        items: featuresItems,
        style,
        showIcons,
        hideHeader,
        showTitle,
        subtitle,
        showSubtitle,
        headerAlign,
        titleColorPrimary,
        subtitleAboveTitle,
        uppercaseText,
        showBadge,
        badgeText,
      });
      setInitialState(nextInitialState);
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
      toast.success('Đã cập nhật Features');
    } catch (error) {
      toast.error('Lỗi khi cập nhật Features');
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
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Chỉnh sửa Features</h1>
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

        <Card className="mb-6">
          <CardHeader
            className="cursor-pointer select-none"
            onClick={() => { setComponentExpanded((prev) => !prev); }}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Thông tin component</CardTitle>
              <ChevronDown
                size={18}
                className={cn('transition-transform text-slate-400', componentExpanded && 'rotate-180')}
              />
            </div>
          </CardHeader>
          {componentExpanded && (
            <CardContent className="space-y-4">
            </CardContent>
          )}
        </Card>

        <Card className="mb-6">
          <CardHeader
            className="cursor-pointer select-none"
            onClick={(e) => {
              // Không toggle nếu click vào button Thêm
              if ((e.target as HTMLElement).closest('button')) {return;}
              setFeaturesExpanded((prev) => !prev);
            }}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Danh sách tính năng</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFeaturesItems((prev) => [...prev, createFeatureItem({ icon: 'Zap' })]);
                  }}
                >
                  <Plus size={14} />
                  Thêm
                </Button>
                <div onClick={(e) => e.stopPropagation()}>
                  <AiDemoFeaturesImport onApply={(items) => setFeaturesItems(items as FeatureItem[])} />
                </div>
                <ChevronDown
                  size={18}
                  className={cn('transition-transform text-slate-400', featuresExpanded && 'rotate-180')}
                />
              </div>
            </div>
          </CardHeader>
          {featuresExpanded && (
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
                <input
                  type="checkbox"
                  id="features-edit-show-icons"
                  checked={showIcons}
                  onChange={(event) => { setShowIcons(event.target.checked); }}
                  className="w-4 h-4 rounded border-slate-300"
                />
                <Label htmlFor="features-edit-show-icons" className="cursor-pointer">Hiển thị icon trong layout</Label>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {featuresItems.map((item, idx) => (
              <div
                key={item.id}
                {...dragProps(item.id)}
                className={cn(
                  'p-4 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-3 cursor-grab active:cursor-grabbing transition-all min-w-0',
                  draggedId === item.id && 'opacity-50',
                  dragOverId === item.id && 'ring-2 ring-blue-500',
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical size={16} className="text-slate-400" />
                    <Label>Tính năng {idx + 1}</Label>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-red-500 h-8 w-8"
                    onClick={() => {
                      if (featuresItems.length <= 1) {return;}
                      setFeaturesItems((prev) => prev.filter((feature) => feature.id !== item.id));
                    }}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {showIcons ? (
                    <IconPopoverPicker
                      value={item.icon}
                      onChange={(nextIcon) => {
                        setFeaturesItems((prev) => prev.map((feature) => feature.id === item.id ? { ...feature, icon: nextIcon } : feature));
                      }}
                      options={FEATURE_ICON_PICKER_OPTIONS}
                      brandColor={effectiveColors.primary}
                    />
                  ) : null}

                  <Input
                    placeholder="Tiêu đề"
                    value={item.title}
                    onChange={(e) => {
                      const nextTitle = e.target.value;
                      setFeaturesItems((prev) => prev.map((feature) => feature.id === item.id ? { ...feature, title: nextTitle } : feature));
                    }}
                  />
                </div>

                <Input
                  placeholder="Mô tả ngắn"
                  value={item.description}
                  onChange={(e) => {
                    const nextDescription = e.target.value;
                    setFeaturesItems((prev) => prev.map((feature) => feature.id === item.id ? { ...feature, description: nextDescription } : feature));
                  }}
                />

                {style === 'carousel6' && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 mt-2">
                    <ImageFieldWithUpload
                      label="Ảnh đại diện (Carousel 6)"
                      value={item.image ?? ''}
                      onChange={(url) => {
                        setFeaturesItems((prev) => prev.map((feature) => feature.id === item.id ? { ...feature, image: url } : feature));
                      }}
                      folder="home-components"
                      aspectRatio="video"
                    />
                  </div>
                )}
              </div>
            ))}
              </div>
            </CardContent>
          )}
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,420px] gap-6">
          <div />
          <div className="lg:sticky lg:top-6 lg:self-start space-y-4">
            {showCustomBlock && (
              <TypeColorOverrideCard
                title="Màu custom cho Features"
                enabled={customState.enabled}
                mode={customState.mode}
                primary={customState.primary}
                secondary={customState.secondary}
                onEnabledChange={(next) => setCustomState((prev) => ({ ...prev, enabled: next }))}
                onModeChange={(next) => setCustomState((prev) => {
                  if (next === 'single') {
                    return { ...prev, mode: next, secondary: prev.primary };
                  }
                  if (prev.mode === 'single') {
                    return { ...prev, mode: next, secondary: getSuggestedSecondary(prev.primary) };
                  }
                  return { ...prev, mode: next };
                })}
                onPrimaryChange={(value) => setCustomState((prev) => ({
                  ...prev,
                  primary: value,
                  secondary: prev.mode === 'single' ? value : prev.secondary,
                }))}
                onSecondaryChange={(value) => setCustomState((prev) => ({
                  ...prev,
                  secondary: prev.mode === 'single' ? prev.primary : value,
                }))}
              />
            )}
            {showFontCustomBlock && (
              <TypeFontOverrideCard
                title="Font custom cho Features"
                enabled={customFontState.enabled}
                fontKey={customFontState.fontKey}
                compact
                toggleLabel="Custom"
                fontLabel="Font"
                onEnabledChange={(next) => setCustomFontState((prev) => ({ ...prev, enabled: next }))}
                onFontChange={(next) => setCustomFontState((prev) => ({ ...prev, fontKey: next }))}
              />
            )}
            <FeaturesPreview
              items={featuresItems}
              sectionTitle={title}
              brandColor={effectiveColors.primary}
              secondary={effectiveColors.secondary}
              mode={effectiveColors.mode}
              selectedStyle={style}
              onStyleChange={setStyle}
              showIcons={showIcons}
              fontStyle={fontStyle}
              fontClassName="font-active"
              hideHeader={hideHeader}
              showTitle={showTitle}
              subtitle={subtitle}
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
