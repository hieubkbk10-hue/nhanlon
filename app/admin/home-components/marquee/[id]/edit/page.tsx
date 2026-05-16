'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { ArrowLeft, ArrowRight, CaseSensitive, Loader2, Pause, Play } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, Label, cn } from '../../../../components/ui';
import { TypeColorOverrideCard } from '../../../_shared/components/TypeColorOverrideCard';
import { TypeFontOverrideCard } from '../../../_shared/components/TypeFontOverrideCard';
import { HeaderConfigSection } from '../../../_shared/components/HeaderConfigSection';
import { extractSectionHeaderConfig } from '../../../_shared/hooks/useSectionHeaderState';
import { useTypeColorOverrideState } from '../../../_shared/hooks/useTypeColorOverride';
import { useTypeFontOverrideState } from '../../../_shared/hooks/useTypeFontOverride';
import { getSuggestedSecondary, resolveSecondaryByMode } from '../../../_shared/lib/typeColorOverride';
import { MarqueePreview } from '../../_components/MarqueePreview';
import { MarqueeForm } from '../../_components/MarqueeForm';
import { HomeComponentStickyFooter } from '@/app/admin/home-components/_shared/components/HomeComponentStickyFooter';
import { DEFAULT_MARQUEE_CONFIG, SCALE_OPTIONS, SPEED_OPTIONS } from '../../_lib/constants';
import type { MarqueeConfig, MarqueeItem, MarqueeStyle, MarqueeBrandMode, MarqueeDirection, MarqueeScale, MarqueeSpeed } from '../../_types';
import { normalizeMarqueeItem, normalizeMarqueeStyle, normalizeMarqueeDirection, normalizeMarqueeSpeed, normalizeMarqueeScale, toMarqueePersistItem } from '../../_types';

const COMPONENT_TYPE = 'Marquee';

export default function MarqueeEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { customState, effectiveColors, initialCustom, setCustomState, setInitialCustom, showCustomBlock } = useTypeColorOverrideState(COMPONENT_TYPE);
  const { customState: customFontState, effectiveFont, initialCustom: initialFontCustom, setCustomState: setCustomFontState, setInitialCustom: setInitialFontCustom, showCustomBlock: showFontCustomBlock } = useTypeFontOverrideState(COMPONENT_TYPE);
  const brandMode: MarqueeBrandMode = effectiveColors.mode === 'single' ? 'single' : 'dual';
  const setTypeFontOverride = useMutation(api.homeComponentSystemConfig.setTypeFontOverride);
  const setTypeColorOverride = useMutation(api.homeComponentSystemConfig.setTypeColorOverride);

  const component = useQuery(api.homeComponents.getById, { id: id as Id<'homeComponents'> });
  const updateMutation = useMutation(api.homeComponents.update);

  const [title, setTitle] = useState('');
  const [active, setActive] = useState(true);
  const [items, setItems] = useState<MarqueeItem[]>([]);
  const [style, setStyle] = useState<MarqueeStyle>('ribbon');
  const [direction, setDirection] = useState<MarqueeDirection>('left');
  const [speed, setSpeed] = useState<MarqueeSpeed>('normal');
  const [pauseOnHover, setPauseOnHover] = useState(true);
  const [scale, setScale] = useState<MarqueeScale>(1);
  const [uppercase, setUppercase] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialSnapshot, setInitialSnapshot] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  // Header state
  const [hideHeader, setHideHeader] = useState(true);
  const [showTitleHeader, setShowTitleHeader] = useState(true);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [subtitle, setSubtitle] = useState('');
  const [headerAlign, setHeaderAlign] = useState<'left' | 'center' | 'right'>('center');
  const [titleColorPrimary, setTitleColorPrimary] = useState(false);
  const [subtitleAboveTitle, setSubtitleAboveTitle] = useState(false);
  const [uppercaseText, setUppercaseText] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [badgeText, setBadgeText] = useState('');
  const [headerExpanded, setHeaderExpanded] = useState(false);

  useEffect(() => {
    if (!component) { return; }
    if (component.type !== 'Marquee') { router.replace(`/admin/home-components/${id}/edit`); return; }

    setTitle(component.title);
    setActive(component.active);

    const rawConfig = (component.config ?? {}) as Partial<MarqueeConfig>;
    const loadedItems = Array.isArray(rawConfig.items)
      ? rawConfig.items.map((item, idx) => normalizeMarqueeItem(item, idx))
      : DEFAULT_MARQUEE_CONFIG.items.map((item, idx) => normalizeMarqueeItem(item, idx));

    setItems(loadedItems);
    setStyle(normalizeMarqueeStyle(rawConfig.style));
    setDirection(normalizeMarqueeDirection(rawConfig.direction));
    setSpeed(normalizeMarqueeSpeed(rawConfig.speed));
    setPauseOnHover(rawConfig.pauseOnHover !== false);
    setScale(normalizeMarqueeScale(rawConfig.scale));
    setUppercase(rawConfig.uppercase === true);

    const headerConfig = extractSectionHeaderConfig(rawConfig);
    setHideHeader(headerConfig.hideHeader ?? true);
    setShowTitleHeader(headerConfig.showTitle ?? true);
    setShowSubtitle(headerConfig.showSubtitle ?? false);
    setSubtitle(headerConfig.subtitle ?? '');
    setHeaderAlign(headerConfig.headerAlign ?? 'center');
    setTitleColorPrimary(headerConfig.titleColorPrimary ?? false);
    setSubtitleAboveTitle(headerConfig.subtitleAboveTitle ?? false);
    setUppercaseText(headerConfig.uppercaseText ?? false);
    setShowBadge(headerConfig.showBadge ?? false);
    setBadgeText(headerConfig.badgeText ?? '');

    const snapshot = JSON.stringify({ active: component.active, items: loadedItems, style: rawConfig.style, direction: rawConfig.direction, speed: rawConfig.speed, pauseOnHover: rawConfig.pauseOnHover, scale: rawConfig.scale, uppercase: rawConfig.uppercase, title: component.title, hideHeader: headerConfig.hideHeader, showTitle: headerConfig.showTitle, showSubtitle: headerConfig.showSubtitle, subtitle: headerConfig.subtitle, headerAlign: headerConfig.headerAlign, titleColorPrimary: headerConfig.titleColorPrimary, subtitleAboveTitle: headerConfig.subtitleAboveTitle, uppercaseText: headerConfig.uppercaseText, showBadge: headerConfig.showBadge, badgeText: headerConfig.badgeText });
    setInitialSnapshot(snapshot);
    setHasChanges(false);
  }, [component, id, router]);

  useEffect(() => {
    if (!component || !initialSnapshot) { return; }
    const snapshot = JSON.stringify({ active, items, style, direction, speed, pauseOnHover, scale, uppercase, title, hideHeader, showTitle: showTitleHeader, showSubtitle, subtitle, headerAlign, titleColorPrimary, subtitleAboveTitle, uppercaseText, showBadge, badgeText });
    const resolvedCustomSecondary = resolveSecondaryByMode(customState.mode, customState.primary, customState.secondary);
    const customChanged = showCustomBlock ? customState.enabled !== initialCustom.enabled || customState.mode !== initialCustom.mode || customState.primary !== initialCustom.primary || resolvedCustomSecondary !== initialCustom.secondary : false;
    const customFontChanged = showFontCustomBlock ? customFontState.enabled !== initialFontCustom.enabled || customFontState.fontKey !== initialFontCustom.fontKey : false;
    setHasChanges(snapshot !== initialSnapshot || customChanged || customFontChanged);
  }, [title, active, items, style, direction, speed, pauseOnHover, scale, uppercase, component, initialSnapshot, customState, initialCustom, showCustomBlock, customFontState, initialFontCustom, showFontCustomBlock, hideHeader, showTitleHeader, showSubtitle, subtitle, headerAlign, titleColorPrimary, subtitleAboveTitle, uppercaseText, showBadge, badgeText]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting || !hasChanges) { return; }
    setIsSubmitting(true);
    try {
      await updateMutation({
        active, id: id as Id<'homeComponents'>, title,
        config: { items: items.map(toMarqueePersistItem), style, direction, speed, pauseOnHover, scale, uppercase, hideHeader, showTitle: showTitleHeader, showSubtitle, subtitle, headerAlign, titleColorPrimary, subtitleAboveTitle, uppercaseText, showBadge, badgeText },
      });
      if (showCustomBlock) {
        await setTypeColorOverride({ enabled: customState.enabled, mode: customState.mode, primary: customState.primary, secondary: resolveSecondaryByMode(customState.mode, customState.primary, customState.secondary), type: COMPONENT_TYPE });
      }
      if (showFontCustomBlock) {
        await setTypeFontOverride({ enabled: customFontState.enabled, fontKey: customFontState.fontKey, type: COMPONENT_TYPE });
      }
      toast.success('Đã cập nhật Marquee');
      const snapshot = JSON.stringify({ active, items, style, direction, speed, pauseOnHover, scale, uppercase, title, hideHeader, showTitle: showTitleHeader, showSubtitle, subtitle, headerAlign, titleColorPrimary, subtitleAboveTitle, uppercaseText, showBadge, badgeText });
      setInitialSnapshot(snapshot);
      if (showCustomBlock) { setInitialCustom({ enabled: customState.enabled, mode: customState.mode, primary: customState.primary, secondary: resolveSecondaryByMode(customState.mode, customState.primary, customState.secondary) }); }
      if (showFontCustomBlock) { setInitialFontCustom({ enabled: customFontState.enabled, fontKey: customFontState.fontKey }); }
      setHasChanges(false);
    } catch (error) { toast.error('Lỗi khi cập nhật'); console.error(error); } finally { setIsSubmitting(false); }
  };

  if (component === undefined) { return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>; }
  if (component === null) { return <div className="text-center py-8 text-slate-500">Không tìm thấy component</div>; }

  const fontStyleVar = { '--font-active': `var(${effectiveFont.fontVariable})` } as React.CSSProperties;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Chỉnh sửa Chạy chữ</h1>
        <Link href="/admin/home-components" className="text-sm text-blue-600 hover:underline">Quay lại danh sách</Link>
      </div>

      <form onSubmit={handleSubmit}>
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

        <MarqueeForm items={items} setItems={setItems} defaultExpanded={false} />

        <Card className="mb-6">
          <CardHeader className="pb-0"><CardTitle className="text-base">Cấu hình hiệu ứng</CardTitle></CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
              <div className="space-y-1.5">
                <Label className="text-xs">Tốc độ</Label>
                <select className="w-full h-8 rounded-md border border-slate-200 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-900" value={speed} onChange={(e) => setSpeed(e.target.value as MarqueeSpeed)}>
                  {SPEED_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Dừng khi hover</Label>
                <button type="button" onClick={() => setPauseOnHover(!pauseOnHover)}
                  className={cn('flex items-center gap-1.5 h-8 px-3 rounded-md border text-xs transition-all w-full',
                    pauseOnHover ? 'bg-green-50 border-green-300 text-green-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50')}>
                  {pauseOnHover ? <Pause size={12} /> : <Play size={12} />} {pauseOnHover ? 'Bật' : 'Tắt'}
                </button>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Kích thước</Label>
                <select className="w-full h-8 rounded-md border border-slate-200 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-900"
                  value={scale} onChange={(e) => setScale(Number(e.target.value) as MarqueeScale)}>
                  {SCALE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
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

        <div className="space-y-4">
          {showCustomBlock && (
            <TypeColorOverrideCard
              title="Màu custom cho Marquee" enabled={customState.enabled} mode={customState.mode}
              primary={customState.primary} secondary={customState.secondary}
              onEnabledChange={(next) => setCustomState((prev) => ({ ...prev, enabled: next }))}
              onModeChange={(next) => setCustomState((prev) => { if (next === 'single') { return { ...prev, mode: next, secondary: prev.primary }; } if (prev.mode === 'single') { return { ...prev, mode: next, secondary: getSuggestedSecondary(prev.primary) }; } return { ...prev, mode: next }; })}
              onPrimaryChange={(value) => setCustomState((prev) => ({ ...prev, primary: value, secondary: prev.mode === 'single' ? value : prev.secondary }))}
              onSecondaryChange={(value) => setCustomState((prev) => ({ ...prev, secondary: prev.mode === 'single' ? prev.primary : value }))}
            />
          )}
          {showFontCustomBlock && (
            <TypeFontOverrideCard title="Font custom cho Marquee" enabled={customFontState.enabled} fontKey={customFontState.fontKey}
              compact toggleLabel="Custom" fontLabel="Font"
              onEnabledChange={(next) => setCustomFontState((prev) => ({ ...prev, enabled: next }))}
              onFontChange={(next) => setCustomFontState((prev) => ({ ...prev, fontKey: next }))}
            />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,420px] gap-6">
          <div></div>
          <div className="lg:sticky lg:top-6 lg:self-start space-y-4">
            <MarqueePreview
              items={items} brandColor={effectiveColors.primary} secondary={effectiveColors.secondary}
              mode={brandMode} selectedStyle={style} onStyleChange={setStyle}
              direction={direction} speed={speed} pauseOnHover={pauseOnHover} scale={scale} uppercase={uppercase}
              fontStyle={fontStyleVar} fontClassName="font-active"
              title={title} subtitle={subtitle} hideHeader={hideHeader} showTitle={showTitleHeader}
              showSubtitle={showSubtitle} headerAlign={headerAlign} titleColorPrimary={titleColorPrimary}
              subtitleAboveTitle={subtitleAboveTitle} uppercaseText={uppercaseText} showBadge={showBadge} badgeText={badgeText}
            />
          </div>
        </div>

        <HomeComponentStickyFooter
          isSubmitting={isSubmitting} hasChanges={hasChanges}
          onCancel={() => { router.push('/admin/home-components'); }}
          submitLabel="Lưu thay đổi" active={active} onActiveChange={setActive}
        />
      </form>
    </div>
  );
}
