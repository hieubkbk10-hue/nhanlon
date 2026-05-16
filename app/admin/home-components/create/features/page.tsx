'use client';

import React, { useState } from 'react';
import { GripVertical, Plus, Trash2, ChevronDown } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, cn } from '../../../components/ui';
import { ImageFieldWithUpload } from '../../../components/ImageFieldWithUpload';
import { ComponentFormWrapper, useComponentForm } from '../shared';
import { useTypeColorOverrideState } from '../../_shared/hooks/useTypeColorOverride';
import { useTypeFontOverrideState } from '../../_shared/hooks/useTypeFontOverride';
import { useSectionHeaderState } from '../../_shared/hooks/useSectionHeaderState';
import { HeaderConfigSection } from '../../_shared/components/HeaderConfigSection';
import { FeaturesPreview } from '../../features/_components/FeaturesPreview';
import { IconPopoverPicker } from '../../_shared/components/IconPopoverPicker';
import {
  createFeatureItem,
  FEATURE_ICON_PICKER_OPTIONS,
} from '../../features/_lib/constants';
import type { FeatureItem, FeaturesStyle } from '../../features/_types';
import { AiDemoFeaturesImport } from '../../product-list/_components/AiDemoProductsImport';

const defaultItems: FeatureItem[] = [
  createFeatureItem({ description: 'Hiệu suất tối ưu với thời gian phản hồi dưới 100ms.', icon: 'Zap', id: 1, title: 'Tốc độ nhanh' }),
  createFeatureItem({ description: 'Mã hóa end-to-end, bảo vệ dữ liệu người dùng.', icon: 'Shield', id: 2, title: 'Bảo mật cao' }),
  createFeatureItem({ description: 'Tích hợp trí tuệ nhân tạo, tự động hóa quy trình.', icon: 'Cpu', id: 3, title: 'AI thông minh' }),
  createFeatureItem({ description: 'Hoạt động trên mọi thiết bị: Web, iOS, Android.', icon: 'Globe', id: 4, title: 'Đa nền tảng' }),
  createFeatureItem({ description: 'Cài đặt nhanh chóng, hướng dẫn chi tiết.', icon: 'Rocket', id: 5, title: 'Dễ triển khai' }),
  createFeatureItem({ description: 'Dashboard trực quan, theo dõi KPIs real-time.', icon: 'Target', id: 6, title: 'Phân tích sâu' }),
];

export default function FeaturesCreatePage() {
  const COMPONENT_TYPE = 'Features';
  const { title, setTitle, active, setActive, handleSubmit, isSubmitting } = useComponentForm('Tính năng nổi bật', COMPONENT_TYPE);
  const { customState, effectiveColors, showCustomBlock, setCustomState, systemColors } = useTypeColorOverrideState(COMPONENT_TYPE, { seedCustomFromSettingsWhenTypeEmpty: true });
  const { customState: customFontState, effectiveFont, showCustomBlock: showFontCustomBlock, setCustomState: setCustomFontState } = useTypeFontOverrideState(COMPONENT_TYPE, { seedCustomFromSettingsWhenTypeEmpty: true });
  const { primary, secondary, mode } = effectiveColors;
  const fontStyle = { '--font-active': `var(${effectiveFont.fontVariable})` } as React.CSSProperties;

  const headerState = useSectionHeaderState({
    hideHeader: false,
    showTitle: true,
    showSubtitle: true,
    subtitle: '',
    headerAlign: 'left',
    titleColorPrimary: false,
    subtitleAboveTitle: false,
    uppercaseText: false,
    showBadge: true,
    badgeText: '',
  });

  const [headerExpanded, setHeaderExpanded] = useState(true);
  const [featuresExpanded, setFeaturesExpanded] = useState(true);

  const [featuresItems, setFeaturesItems] = useState<FeatureItem[]>(defaultItems);
  const [style, setStyle] = useState<FeaturesStyle>('iconGrid');
  const [showIcons, setShowIcons] = useState(true);

  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);

  const dragProps = (id: number) => ({
    draggable: true,
    onDragStart: () => { setDraggedId(id); },
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      if (draggedId !== id) {
        setDragOverId(id);
      }
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      if (!draggedId || draggedId === id) {return;}

      setFeaturesItems((prev) => {
        const next = [...prev];
        const fromIndex = next.findIndex((item) => item.id === draggedId);
        const toIndex = next.findIndex((item) => item.id === id);
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

  const onSubmit = (e: React.FormEvent) => {
    void handleSubmit(e, {
      items: featuresItems,
      style,
      showIcons,
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
    });
  };

  return (
    <ComponentFormWrapper
      type={COMPONENT_TYPE}
      title={title}
      setTitle={setTitle}
      active={active}
      setActive={setActive}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      customState={customState}
      showCustomBlock={showCustomBlock}
      setCustomState={setCustomState}
      systemColors={systemColors}
      customFontState={customFontState}
      showFontCustomBlock={showFontCustomBlock}
      setCustomFontState={setCustomFontState}
      skipTitleInput={true}
    >
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
        expanded={headerExpanded}
        onExpandedChange={setHeaderExpanded}
        titleRequired={true}
        titleLabel="Tiêu đề hiển thị"
        titlePlaceholder="Nhập tiêu đề component..."
      />

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
                id="features-show-icons"
                checked={showIcons}
                onChange={(event) => { setShowIcons(event.target.checked); }}
                className="w-4 h-4 rounded border-slate-300"
              />
              <Label htmlFor="features-show-icons" className="cursor-pointer">Hiển thị icon trong layout</Label>
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
                    brandColor={primary}
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

      <FeaturesPreview
        items={featuresItems}
        sectionTitle={title}
        brandColor={primary}
        secondary={secondary}
        mode={mode}
        selectedStyle={style}
        onStyleChange={setStyle}
        showIcons={showIcons}
        fontStyle={fontStyle}
        fontClassName="font-active"
        hideHeader={headerState.hideHeader}
        showTitle={headerState.showTitle}
        subtitle={headerState.subtitle}
        showSubtitle={headerState.showSubtitle}
        headerAlign={headerState.headerAlign}
        titleColorPrimary={headerState.titleColorPrimary}
        subtitleAboveTitle={headerState.subtitleAboveTitle}
        uppercaseText={headerState.uppercaseText}
        showBadge={headerState.showBadge}
        badgeText={headerState.badgeText}
      />
    </ComponentFormWrapper>
  );
}
