'use client';

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CaseSensitive, Pause, Play } from 'lucide-react';
import { ComponentFormWrapper, useComponentForm } from '../shared';
import { useTypeColorOverrideState } from '../../_shared/hooks/useTypeColorOverride';
import { useTypeFontOverrideState } from '../../_shared/hooks/useTypeFontOverride';
import { HeaderConfigSection } from '../../_shared/components/HeaderConfigSection';
import { useSectionHeaderState } from '../../_shared/hooks/useSectionHeaderState';
import { MarqueePreview } from '../../marquee/_components/MarqueePreview';
import { MarqueeForm } from '../../marquee/_components/MarqueeForm';
import { Card, CardContent, CardHeader, CardTitle, Label, cn } from '../../../components/ui';
import { SCALE_OPTIONS, SPEED_OPTIONS } from '../../marquee/_lib/constants';
import {
  createMarqueeItem, toMarqueePersistItem,
  type MarqueeBrandMode, type MarqueeDirection, type MarqueeItem,
  type MarqueeScale, type MarqueeSpeed, type MarqueeStyle,
} from '../../marquee/_types';

export default function MarqueeCreatePage() {
  const COMPONENT_TYPE = 'Marquee';
  const { title, setTitle, active, setActive, handleSubmit, isSubmitting } = useComponentForm('Chạy chữ / Marquee', COMPONENT_TYPE);
  const { customState, effectiveColors, showCustomBlock, setCustomState, systemColors } = useTypeColorOverrideState(COMPONENT_TYPE, { seedCustomFromSettingsWhenTypeEmpty: true });
  const { customState: customFontState, effectiveFont, showCustomBlock: showFontCustomBlock, setCustomState: setCustomFontState } = useTypeFontOverrideState(COMPONENT_TYPE, { seedCustomFromSettingsWhenTypeEmpty: true });
  const { primary, secondary, mode } = effectiveColors;
  const brandMode: MarqueeBrandMode = mode === 'single' ? 'single' : 'dual';
  const fontStyle = { '--font-active': `var(${effectiveFont.fontVariable})` } as React.CSSProperties;

  const {
    hideHeader, setHideHeader, showTitle: showTitleHeader, setShowTitle: setShowTitleHeader,
    showSubtitle, setShowSubtitle, subtitle, setSubtitle, headerAlign, setHeaderAlign,
    titleColorPrimary, setTitleColorPrimary, subtitleAboveTitle, setSubtitleAboveTitle,
    uppercaseText, setUppercaseText, showBadge, setShowBadge, badgeText, setBadgeText,
  } = useSectionHeaderState({ hideHeader: true, showBadge: false });
  const [headerExpanded, setHeaderExpanded] = useState(false);

  const [items, setItems] = useState<MarqueeItem[]>([
    { ...createMarqueeItem(1), text: 'Chào mừng đến với cửa hàng', separator: '✦', textStyle: 'normal' },
    { ...createMarqueeItem(2), text: 'Miễn phí vận chuyển đơn từ 500K', separator: '★', textStyle: 'normal' },
    { ...createMarqueeItem(3), text: 'Giảm 20% cho khách hàng mới', separator: '♦', textStyle: 'bold' },
  ]);
  const [style, setStyle] = useState<MarqueeStyle>('ribbon');
  const [direction, setDirection] = useState<MarqueeDirection>('left');
  const [speed, setSpeed] = useState<MarqueeSpeed>('normal');
  const [pauseOnHover, setPauseOnHover] = useState(true);
  const [scale, setScale] = useState<MarqueeScale>(2);
  const [uppercase, setUppercase] = useState(false);

  const onSubmit = (event: React.FormEvent) => {
    void handleSubmit(event, {
      items: items.map(toMarqueePersistItem), style, direction, speed, pauseOnHover, scale, uppercase,
      hideHeader, showTitle: showTitleHeader, showSubtitle, subtitle, headerAlign,
      titleColorPrimary, subtitleAboveTitle, uppercaseText, showBadge, badgeText,
    });
  };

  return (
    <ComponentFormWrapper
      type={COMPONENT_TYPE} title={title} setTitle={setTitle} active={active} setActive={setActive}
      onSubmit={onSubmit} isSubmitting={isSubmitting} customState={customState} showCustomBlock={showCustomBlock}
      setCustomState={setCustomState} systemColors={systemColors} customFontState={customFontState}
      showFontCustomBlock={showFontCustomBlock} setCustomFontState={setCustomFontState} skipTitleInput={true}
    >
      <HeaderConfigSection
        hideHeader={hideHeader} title={title} showTitle={showTitleHeader} subtitle={subtitle}
        showSubtitle={showSubtitle} headerAlign={headerAlign} titleColorPrimary={titleColorPrimary}
        subtitleAboveTitle={subtitleAboveTitle} uppercaseText={uppercaseText} showBadge={showBadge} badgeText={badgeText}
        onHideHeaderChange={setHideHeader} onTitleChange={setTitle} onShowTitleChange={setShowTitleHeader}
        onSubtitleChange={setSubtitle} onShowSubtitleChange={setShowSubtitle} onHeaderAlignChange={setHeaderAlign}
        onTitleColorPrimaryChange={setTitleColorPrimary} onSubtitleAboveTitleChange={setSubtitleAboveTitle}
        onUppercaseTextChange={setUppercaseText} onShowBadgeChange={setShowBadge} onBadgeTextChange={setBadgeText}
        expanded={headerExpanded} onExpandedChange={setHeaderExpanded}
      />

      <MarqueeForm items={items} setItems={setItems} defaultExpanded={true} />

      <Card className="mb-6">
        <CardHeader className="pb-0"><CardTitle className="text-base">Cấu hình hiệu ứng</CardTitle></CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/* Direction */}
            <div className="space-y-1.5">
              <Label className="text-xs">Hướng chạy</Label>
              <div className="flex gap-1">
                {(['left', 'right'] as const).map((d) => (
                  <button key={d} type="button" onClick={() => setDirection(d)}
                    className={cn('flex-1 flex items-center justify-center gap-1 h-8 rounded-md border text-xs transition-all',
                      direction === d ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50')}>
                    {d === 'left' ? <><ArrowLeft size={12} /> Trái</> : <>Phải <ArrowRight size={12} /></>}
                  </button>
                ))}
              </div>
            </div>
            {/* Speed */}
            <div className="space-y-1.5">
              <Label className="text-xs">Tốc độ</Label>
              <select className="w-full h-8 rounded-md border border-slate-200 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-900"
                value={speed} onChange={(e) => setSpeed(e.target.value as MarqueeSpeed)}>
                {SPEED_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            {/* Pause on hover */}
            <div className="space-y-1.5">
              <Label className="text-xs">Dừng khi hover</Label>
              <button type="button" onClick={() => setPauseOnHover(!pauseOnHover)}
                className={cn('flex items-center gap-1.5 h-8 px-3 rounded-md border text-xs transition-all w-full',
                  pauseOnHover ? 'bg-green-50 border-green-300 text-green-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50')}>
                {pauseOnHover ? <Pause size={12} /> : <Play size={12} />} {pauseOnHover ? 'Bật' : 'Tắt'}
              </button>
            </div>
            {/* Scale */}
            <div className="space-y-1.5">
              <Label className="text-xs">Kích thước</Label>
              <select className="w-full h-8 rounded-md border border-slate-200 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-900"
                value={scale} onChange={(e) => setScale(Number(e.target.value) as MarqueeScale)}>
                {SCALE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            {/* Uppercase */}
            <div className="space-y-1.5">
              <Label className="text-xs">Chữ in hoa</Label>
              <button type="button" onClick={() => setUppercase(!uppercase)}
                className={cn('flex items-center gap-1.5 h-8 px-3 rounded-md border text-xs transition-all w-full',
                  uppercase ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50')}>
                <CaseSensitive size={14} /> {uppercase ? 'Bật' : 'Tắt'}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <MarqueePreview
        items={items} brandColor={primary} secondary={secondary} mode={brandMode} selectedStyle={style}
        onStyleChange={setStyle} direction={direction} speed={speed} pauseOnHover={pauseOnHover} scale={scale} uppercase={uppercase}
        fontStyle={fontStyle} fontClassName="font-active"
        title={title} subtitle={subtitle} hideHeader={hideHeader} showTitle={showTitleHeader}
        showSubtitle={showSubtitle} headerAlign={headerAlign} titleColorPrimary={titleColorPrimary}
        subtitleAboveTitle={subtitleAboveTitle} uppercaseText={uppercaseText} showBadge={showBadge} badgeText={badgeText}
      />
    </ComponentFormWrapper>
  );
}
