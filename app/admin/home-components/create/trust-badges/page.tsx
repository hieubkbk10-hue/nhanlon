'use client';

import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Label, cn } from '../../../components/ui';
import { ComponentFormWrapper, useComponentForm } from '../shared';
import { HeaderConfigSection } from '../../_shared/components/HeaderConfigSection';
import { useTypeColorOverrideState } from '../../_shared/hooks/useTypeColorOverride';
import { useTypeFontOverrideState } from '../../_shared/hooks/useTypeFontOverride';
import { useSectionHeaderState } from '../../_shared/hooks/useSectionHeaderState';
import { AiTrustBadgesImport } from '../../gallery/_components/AiTrustBadgesImport';
import { TrustBadgesPreview } from '../../gallery/_components/TrustBadgesPreview';
import type { TrustBadgesStyle } from '../../gallery/_types';
import type { ImageItem } from '../../../components/MultiImageUploader';
import { MultiImageUploader } from '../../../components/MultiImageUploader';

interface TrustBadgeItem extends ImageItem {
  id: string | number;
  url: string;
  link: string;
  name?: string;
}

export default function TrustBadgesCreatePage() {
  const COMPONENT_TYPE = 'TrustBadges';
  const { title, setTitle, active, setActive, handleSubmit, isSubmitting } = useComponentForm('Chứng nhận', COMPONENT_TYPE);
  const { customState, effectiveColors, showCustomBlock, setCustomState, systemColors } = useTypeColorOverrideState(COMPONENT_TYPE, { seedCustomFromSettingsWhenTypeEmpty: true });
  const { customState: customFontState, effectiveFont, showCustomBlock: showFontCustomBlock, setCustomState: setCustomFontState } = useTypeFontOverrideState(COMPONENT_TYPE, { seedCustomFromSettingsWhenTypeEmpty: true });
  const { primary, secondary, mode } = effectiveColors;
  const fontStyle = { '--font-active': `var(${effectiveFont.fontVariable})` } as React.CSSProperties;

  const [trustBadgeItems, setTrustBadgeItems] = useState<TrustBadgeItem[]>([
    { id: 'item-1', link: '', name: '', url: '' },
    { id: 'item-2', link: '', name: '', url: '' }
  ]);
  const [trustBadgesStyle, setTrustBadgesStyle] = useState<TrustBadgesStyle>('cards');
  const [desktopColumns, setDesktopColumns] = useState<3 | 4>(4);
  const [expandedSections, setExpandedSections] = useState({ header: false });
  const headerState = useSectionHeaderState({
    badgeText: 'Được tin chọn',
    headerAlign: 'center',
    showBadge: true,
    subtitle: 'Những cam kết và chứng nhận giúp khách hàng yên tâm mua sắm.',
    titleColorPrimary: true,
  });

  const onSubmit = (e: React.FormEvent) => {
    void handleSubmit(e, {
      items: trustBadgeItems.map((item) => ({ link: item.link, name: item.name, url: item.url })),
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
        <CardContent className="space-y-2">
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
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between gap-3">
            <span>Danh sách chứng nhận</span>
            <AiTrustBadgesImport onApply={(items) => setTrustBadgeItems(items as TrustBadgeItem[])} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MultiImageUploader<TrustBadgeItem>
            items={trustBadgeItems}
            onChange={setTrustBadgeItems}
            folder="trust-badges"
            imageKey="url"
            extraFields={[{ key: 'name', placeholder: 'Tên chứng nhận (VD: ISO 9001)', type: 'text' }]}
            minItems={1}
            maxItems={20}
            aspectRatio="square"
            columns={2}
            showReorder={true}
            addButtonText="Thêm chứng nhận"
            emptyText="Chưa có chứng nhận nào"
            layout="vertical"
          />
        </CardContent>
      </Card>

      <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-800/50 flex items-center justify-center flex-shrink-0">
            <Shield size={16} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100 mb-1">Kích thước ảnh chứng nhận tối ưu</p>
            <div className="text-xs text-emerald-700 dark:text-emerald-300">
              {trustBadgesStyle === 'grid' && (
                <div className="space-y-1">
                  <p><strong className="text-emerald-900 dark:text-emerald-100">Grid</strong></p>
                  <p>• Ảnh: <strong>300×300px</strong> (tỷ lệ 1:1, vuông)</p>
                  <p className="text-emerald-500 dark:text-emerald-400 italic">Layout: Grid vuông với zoom icon</p>
                </div>
              )}
              {trustBadgesStyle === 'cards' && (
                <div className="space-y-1">
                  <p><strong className="text-emerald-900 dark:text-emerald-100">Cards</strong></p>
                  <p>• Ảnh: <strong>400×320px</strong> (tỷ lệ 5:4)</p>
                  <p className="text-emerald-500 dark:text-emerald-400 italic">Layout: Feature cards lớn, hover zoom effect</p>
                </div>
              )}
              {trustBadgesStyle === 'stack' && (
                <div className="space-y-1">
                  <p><strong className="text-emerald-900 dark:text-emerald-100">Stack</strong></p>
                  <p>• Ảnh: <strong>240×160px</strong> (tỷ lệ 3:2)</p>
                  <p className="text-emerald-500 dark:text-emerald-400 italic">Layout: Trust proof strips kiểu SaaS, dễ scan</p>
                </div>
              )}
              {trustBadgesStyle === 'wall' && (
                <div className="space-y-1">
                  <p><strong className="text-emerald-900 dark:text-emerald-100">Wall</strong></p>
                  <p>• Ảnh: <strong>250×300px</strong> (tỷ lệ 5:6)</p>
                  <p className="text-emerald-500 dark:text-emerald-400 italic">Layout: Khung ảnh dọc kiểu treo tường</p>
                </div>
              )}
              {trustBadgesStyle === 'carousel' && (
                <div className="space-y-1">
                  <p><strong className="text-emerald-900 dark:text-emerald-100">Carousel</strong></p>
                  <p>• Ảnh: <strong>280×280px</strong> (tỷ lệ 1:1)</p>
                  <p className="text-emerald-500 dark:text-emerald-400 italic">Layout: Horizontal carousel với arrows</p>
                </div>
              )}
              {trustBadgesStyle === 'seal' && (
                <div className="space-y-1">
                  <p><strong className="text-emerald-900 dark:text-emerald-100">Seal</strong></p>
                  <p>• Ảnh: <strong>240×240px</strong> (tỷ lệ 1:1)</p>
                  <p className="text-emerald-500 dark:text-emerald-400 italic">Layout: Hub xác thực trung tâm + badge vệ tinh</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <TrustBadgesPreview
        items={trustBadgeItems.map((item, idx) => ({ id: idx + 1, link: item.link, name: item.name, url: item.url }))}
        brandColor={primary}
        secondary={secondary}
        mode={mode}
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
    </ComponentFormWrapper>
  );
}
