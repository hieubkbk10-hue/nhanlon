'use client';

import React, { useMemo, useState } from 'react';
import { Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Label, cn } from '../../../components/ui';
import { ComponentFormWrapper, useComponentForm } from '../shared';
import { useTypeColorOverrideState } from '../../_shared/hooks/useTypeColorOverride';
import { useTypeFontOverrideState } from '../../_shared/hooks/useTypeFontOverride';
import { HeaderConfigSection } from '../../_shared/components/HeaderConfigSection';
import { ServicesForm } from '../../services/_components/ServicesForm';
import { ServicesPreview } from '../../services/_components/ServicesPreview';
import { getServicesValidationResult } from '../../services/_lib/colors';
import { DEFAULT_SERVICES_CONFIG } from '../../services/_lib/constants';
import { getServicesHeaderAlign, toServicesPersistItems } from '../../services/_lib/items';
import type { ServiceEditorItem, ServiceItemMediaAlign, ServicesStyle } from '../../services/_types';

const DEFAULT_EDITOR_ITEMS: ServiceEditorItem[] = [
  { id: 1, mediaType: 'icon', icon: 'Truck', image: '', title: 'Miễn phí vẫn chuyển', description: 'Cho tất cả đơn hàng trong nội thành Hồ Chí Minh' },
  { id: 2, mediaType: 'icon', icon: 'RefreshCcw', image: '', title: 'Miễn phí đổi - trả', description: 'Đối với sản phẩm lỗi sản xuất hoặc vận chuyển' },
  { id: 3, mediaType: 'icon', icon: 'Headphones', image: '', title: 'Hỗ trợ nhanh chóng', description: 'Gọi Hotline: 19006750 để được hỗ trợ ngay lập tức' },
  { id: 4, mediaType: 'icon', icon: 'Gift', image: '', title: 'Ưu đãi thành viên', description: 'Đăng ký thành viên để được nhận được nhiều khuyến mãi' },
];

export default function ServicesCreatePage() {
  const COMPONENT_TYPE = 'Services';
  const { title, setTitle, active, setActive, handleSubmit, isSubmitting } = useComponentForm('Dịch vụ chi tiết', COMPONENT_TYPE);
  const { customState, effectiveColors, showCustomBlock, setCustomState, systemColors } = useTypeColorOverrideState(COMPONENT_TYPE, { seedCustomFromSettingsWhenTypeEmpty: true });
  const { customState: customFontState, effectiveFont, showCustomBlock: showFontCustomBlock, setCustomState: setCustomFontState } = useTypeFontOverrideState(COMPONENT_TYPE, { seedCustomFromSettingsWhenTypeEmpty: true });
  const { primary, secondary, mode } = effectiveColors;
  const fontStyle = { '--font-active': `var(${effectiveFont.fontVariable})` } as React.CSSProperties;

  const [servicesItems, setServicesItems] = useState<ServiceEditorItem[]>(DEFAULT_EDITOR_ITEMS);
  const [style, setStyle] = useState<ServicesStyle>('builderPolicy');
  const [desktopColumns, setDesktopColumns] = useState<3 | 4>(4);
  const [mediaPlacement, setMediaPlacement] = useState<'top' | 'left'>(DEFAULT_SERVICES_CONFIG.mediaPlacement ?? 'top');
  const [mediaAlign, setMediaAlign] = useState<'left' | 'center' | 'right'>(DEFAULT_SERVICES_CONFIG.mediaAlign ?? 'center');

  // Header config state
  const [expandedSections, setExpandedSections] = useState({ header: false });
  const [hideHeader, setHideHeader] = useState(DEFAULT_SERVICES_CONFIG.hideHeader ?? false);
  const [showTitle, setShowTitle] = useState(DEFAULT_SERVICES_CONFIG.showTitle !== false);
  const [subtitle, setSubtitle] = useState(DEFAULT_SERVICES_CONFIG.subtitle ?? '');
  const [showSubtitle, setShowSubtitle] = useState(DEFAULT_SERVICES_CONFIG.showSubtitle !== false);
  const [headerAlign, setHeaderAlign] = useState<ServiceItemMediaAlign>(getServicesHeaderAlign(DEFAULT_SERVICES_CONFIG.headerAlign));
  const [titleColorPrimary, setTitleColorPrimary] = useState(DEFAULT_SERVICES_CONFIG.titleColorPrimary ?? false);
  const [subtitleAboveTitle, setSubtitleAboveTitle] = useState(DEFAULT_SERVICES_CONFIG.subtitleAboveTitle ?? false);
  const [uppercaseText, setUppercaseText] = useState(DEFAULT_SERVICES_CONFIG.uppercaseText ?? false);
  const [showBadge, setShowBadge] = useState(DEFAULT_SERVICES_CONFIG.showBadge ?? true);
  const [badgeText, setBadgeText] = useState(DEFAULT_SERVICES_CONFIG.badgeText ?? '');

  const validation = useMemo(() => getServicesValidationResult({ primary, secondary, mode }), [primary, secondary, mode]);

  const onSubmit = (event: React.FormEvent) => {
    void handleSubmit(event, {
      items: toServicesPersistItems(servicesItems),
      showTitle,
      subtitle,
      showSubtitle,
      headerAlign,
      desktopColumns,
      mediaPlacement,
      mediaAlign,
      style,
      hideHeader,
      titleColorPrimary,
      subtitleAboveTitle,
      uppercaseText,
      showBadge,
      badgeText,
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
        expanded={expandedSections.header}
        onExpandedChange={(value) => setExpandedSections({ header: value })}
        titleRequired={true}
        titleLabel="Tiêu đề hiển thị"
        titlePlaceholder="Nhập tiêu đề component..."
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Briefcase size={20} />
            Services
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

      <ServicesForm
        items={servicesItems}
        onChange={setServicesItems}
        mediaPlacement={mediaPlacement}
        mediaAlign={mediaAlign}
        onMediaPlacementChange={setMediaPlacement}
        onMediaAlignChange={setMediaAlign}
        brandColor={validation.colors.primary}
        defaultExpanded={true}
        onAiImport={setServicesItems}
      />

      <ServicesPreview
        items={toServicesPersistItems(servicesItems)}
        brandColor={validation.colors.primary}
        secondary={validation.colors.secondary}
        mode={mode}
        mediaPlacement={mediaPlacement}
        mediaAlign={mediaAlign}
        headerAlign={headerAlign}
        desktopColumns={desktopColumns}
        subtitle={subtitle}
        showTitle={showTitle}
        showSubtitle={showSubtitle}
        showBadge={showBadge}
        badgeText={badgeText}
        hideHeader={hideHeader}
        titleColorPrimary={titleColorPrimary}
        subtitleAboveTitle={subtitleAboveTitle}
        uppercaseText={uppercaseText}
        selectedStyle={style}
        onStyleChange={setStyle}
        title={title}
        fontStyle={fontStyle}
        fontClassName="font-active"
      />
    </ComponentFormWrapper>
  );
}
