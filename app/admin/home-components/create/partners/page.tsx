'use client';

import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { Button } from '../../../components/ui';
import { ComponentFormWrapper, useComponentForm } from '../shared';
import { useTypeColorOverrideState } from '../../_shared/hooks/useTypeColorOverride';
import { useTypeFontOverrideState } from '../../_shared/hooks/useTypeFontOverride';
import { useSectionHeaderState } from '../../_shared/hooks/useSectionHeaderState';
import { HeaderConfigSection } from '../../_shared/components/HeaderConfigSection';
import { PartnersPreview } from '../../partners/_components/PartnersPreview';
import { DEFAULT_PARTNERS_CONFIG, DEFAULT_PARTNERS_DISPLAY_MODE, type PartnersDisplayMode, type PartnersStyle } from '../../partners/_types';
import type { ImageItem } from '../../../components/MultiImageUploader';
import { PartnersForm } from '../../partners/_components/PartnersForm';
import { AiDemoPartnersImport } from '../../product-list/_components/AiDemoProductsImport';

interface PartnerItem extends ImageItem { id: string | number; url: string; link: string; name?: string; }

export default function PartnersCreatePage() {
  const COMPONENT_TYPE = 'Partners';
  const { title, setTitle, active, setActive, handleSubmit, isSubmitting } = useComponentForm('Đối tác / Logos', COMPONENT_TYPE);
  const { customState, effectiveColors, showCustomBlock, setCustomState, systemColors } = useTypeColorOverrideState(COMPONENT_TYPE, { seedCustomFromSettingsWhenTypeEmpty: true });
  const { customState: customFontState, effectiveFont, showCustomBlock: showFontCustomBlock, setCustomState: setCustomFontState } = useTypeFontOverrideState(COMPONENT_TYPE, { seedCustomFromSettingsWhenTypeEmpty: true });
  const { primary, secondary, mode } = effectiveColors;
  const fontStyle = { '--font-active': `var(${effectiveFont.fontVariable})` } as React.CSSProperties;

  const headerState = useSectionHeaderState(DEFAULT_PARTNERS_CONFIG);
  const [headerExpanded, setHeaderExpanded] = useState(true);

  const [partnersItems, setPartnersItems] = useState<PartnerItem[]>([
    { id: 'item-1', link: '', name: '', url: '' },
    { id: 'item-2', link: '', name: '', url: '' }
  ]);
  const [partnersStyle, setPartnersStyle] = useState<PartnersStyle>('grid');
  const [displayMode, setDisplayMode] = useState<PartnersDisplayMode>(DEFAULT_PARTNERS_DISPLAY_MODE);

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

  const onSubmit = (e: React.FormEvent) => {
    void handleSubmit(e, {
      displayMode,
      items: partnersItems.map((item) => ({ link: item.link, name: item.name, url: item.url })),
      style: partnersStyle,
      // Header fields
      hideHeader: headerState.hideHeader,
      showTitle: headerState.showTitle,
      showSubtitle: headerState.showSubtitle,
      subtitle: headerState.subtitle,
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

      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-800/50 flex items-center justify-center flex-shrink-0">
            <ImageIcon size={16} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">Kích thước logo tối ưu</p>
            <div className="text-xs text-blue-700 dark:text-blue-300">
              {partnersStyle === 'grid' && (
                <div className="space-y-1">
                  <p><strong className="text-blue-900 dark:text-blue-100">Grid</strong></p>
                  <p>• Logo: <strong>120×120px</strong> hoặc SVG vuông • PNG nền trong suốt</p>
                  <p className="text-blue-500 dark:text-blue-400 italic">Layout: card grid gọn, hover đổi nền theo secondary token.</p>
                </div>
              )}
              {partnersStyle === 'marquee' && (
                <div className="space-y-1">
                  <p><strong className="text-blue-900 dark:text-blue-100">Marquee</strong></p>
                  <p>• Logo: <strong>160×60px</strong> (tỷ lệ ngang) • PNG/SVG nền trong suốt</p>
                  <p className="text-blue-500 dark:text-blue-400 italic">Layout: auto scroll dạng chip có tên đối tác, hover để dừng.</p>
                </div>
              )}
              {partnersStyle === 'badge' && (
                <div className="space-y-1">
                  <p><strong className="text-blue-900 dark:text-blue-100">Badge</strong></p>
                  <p>• Logo: <strong>80×80px</strong> hoặc SVG nhỏ gọn; ưu tiên mark/icon rõ ở kích thước nhỏ</p>
                  <p className="text-blue-500 dark:text-blue-400 italic">Layout: badge pill bo tròn với logo + tên.</p>
                </div>
              )}
              {partnersStyle === 'carousel' && (
                <div className="space-y-1">
                  <p><strong className="text-blue-900 dark:text-blue-100">Carousel</strong></p>
                  <p>• Logo: <strong>160×60px</strong> hoặc SVG ngang; card rộng nên wordmark hiển thị đẹp hơn</p>
                  <p className="text-blue-500 dark:text-blue-400 italic">Layout: swipe-track ngang theo source mới, card có icon block + label.</p>
                </div>
              )}
              {partnersStyle === 'logoCloud' && (
                <div className="space-y-1">
                  <p><strong className="text-blue-900 dark:text-blue-100">Logo Cloud</strong></p>
                  <p>• Logo: <strong>180×80px</strong> hoặc SVG ngang • PNG nền trong suốt</p>
                  <p className="text-blue-500 dark:text-blue-400 italic">Layout: carousel logo tối giản, 3/4/5 logo theo breakpoint, hover viền màu thương hiệu.</p>
                </div>
              )}
              {partnersStyle === 'clean' && (
                <div className="space-y-1">
                  <p><strong className="text-blue-900 dark:text-blue-100">Clean</strong></p>
                  <p>• Logo: <strong>160×60px</strong> hoặc SVG ngang • cần tên thương hiệu rõ</p>
                  <p className="text-blue-500 dark:text-blue-400 italic">Layout: tối giản, inline logo + tên, ưu tiên brand recognition.</p>
                </div>
              )}
              {partnersStyle === 'divider' && (
                <div className="space-y-1">
                  <p><strong className="text-blue-900 dark:text-blue-100">Divider</strong></p>
                  <p>• Logo: <strong>120×120px</strong> hoặc SVG • PNG nền trong suốt</p>
                  <p className="text-blue-500 dark:text-blue-400 italic">Layout: grid có đường chia ô rõ ràng, phù hợp nhiều logo.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <PartnersPreview
        items={partnersItems.map((item, idx) => ({ id: idx + 1, link: item.link, name: item.name, url: item.url }))}
        brandColor={primary}
        secondary={secondary}
        mode={mode}
        selectedStyle={partnersStyle}
        onStyleChange={setPartnersStyle}
        title={title}
        subheading={headerState.subtitle}
        align={headerState.headerAlign}
        displayMode={displayMode}
        onDisplayModeChange={setDisplayMode}
        fontStyle={fontStyle}
        fontClassName="font-active"
        hideHeader={headerState.hideHeader}
        showTitle={headerState.showTitle}
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
