'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { HelpCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, Input, Label } from '../../../../components/ui';
import { TypeColorOverrideCard } from '../../../_shared/components/TypeColorOverrideCard';
import { TypeFontOverrideCard } from '../../../_shared/components/TypeFontOverrideCard';
import { HeaderConfigSection } from '../../../_shared/components/HeaderConfigSection';
import { useTypeColorOverrideState } from '../../../_shared/hooks/useTypeColorOverride';
import { useTypeFontOverrideState } from '../../../_shared/hooks/useTypeFontOverride';
import { getSuggestedSecondary, resolveSecondaryByMode } from '../../../_shared/lib/typeColorOverride';
import { FaqForm } from '../../_components/FaqForm';
import { FaqPreview } from '../../_components/FaqPreview';
import { HomeComponentStickyFooter } from '@/app/admin/home-components/_shared/components/HomeComponentStickyFooter';
import { DEFAULT_FAQ_CONFIG, DEFAULT_FAQ_ITEMS, FAQ_STYLES } from '../../_lib/constants';
import type { FaqConfig, FaqItem, FaqStyle } from '../../_types';

const COMPONENT_TYPE = 'FAQ';

const FALLBACK_FAQ_ITEMS: FaqItem[] = DEFAULT_FAQ_ITEMS.map((item, idx) => ({
  ...item,
  id: `faq-${idx}`,
}));

const toFaqStyle = (value: unknown): FaqStyle => {
  if (typeof value !== 'string') {return 'accordion';}
  const matchedStyle = FAQ_STYLES.find((style) => style.id === value);
  return matchedStyle?.id ?? 'accordion';
};

const toFaqItems = (value: unknown): FaqItem[] => {
  if (!Array.isArray(value)) {return FALLBACK_FAQ_ITEMS;}

  const mapped = value.map((item, idx) => {
    if (!item || typeof item !== 'object') {
      return {
        id: `faq-${idx}`,
        question: '',
        answer: '',
      };
    }

    const data = item as { question?: unknown; answer?: unknown };

    return {
      id: `faq-${idx}`,
      question: typeof data.question === 'string' ? data.question : '',
      answer: typeof data.answer === 'string' ? data.answer : '',
    };
  });

  return mapped.length > 0 ? mapped : FALLBACK_FAQ_ITEMS;
};

const toFaqConfig = (value: Record<string, unknown> | null | undefined): FaqConfig => {
  const config = value ?? {};
  return {
    description: typeof config.description === 'string' ? config.description : DEFAULT_FAQ_CONFIG.description,
    buttonText: typeof config.buttonText === 'string' ? config.buttonText : DEFAULT_FAQ_CONFIG.buttonText,
    buttonLink: typeof config.buttonLink === 'string' ? config.buttonLink : DEFAULT_FAQ_CONFIG.buttonLink,
    // Header fields
    hideHeader: typeof config.hideHeader === 'boolean' ? config.hideHeader : DEFAULT_FAQ_CONFIG.hideHeader,
    showTitle: typeof config.showTitle === 'boolean' ? config.showTitle : DEFAULT_FAQ_CONFIG.showTitle,
    showSubtitle: typeof config.showSubtitle === 'boolean' ? config.showSubtitle : DEFAULT_FAQ_CONFIG.showSubtitle,
    subtitle: typeof config.subtitle === 'string' ? config.subtitle : DEFAULT_FAQ_CONFIG.subtitle,
    headerAlign: (config.headerAlign === 'left' || config.headerAlign === 'center' || config.headerAlign === 'right')
      ? config.headerAlign
      : DEFAULT_FAQ_CONFIG.headerAlign,
    titleColorPrimary: typeof config.titleColorPrimary === 'boolean' ? config.titleColorPrimary : DEFAULT_FAQ_CONFIG.titleColorPrimary,
    subtitleAboveTitle: typeof config.subtitleAboveTitle === 'boolean' ? config.subtitleAboveTitle : DEFAULT_FAQ_CONFIG.subtitleAboveTitle,
    uppercaseText: typeof config.uppercaseText === 'boolean' ? config.uppercaseText : DEFAULT_FAQ_CONFIG.uppercaseText,
    showBadge: typeof config.showBadge === 'boolean' ? config.showBadge : DEFAULT_FAQ_CONFIG.showBadge,
    badgeText: typeof config.badgeText === 'string' ? config.badgeText : DEFAULT_FAQ_CONFIG.badgeText,
  };
};

export default function FaqEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { customState, effectiveColors, initialCustom, setCustomState, setInitialCustom, showCustomBlock } = useTypeColorOverrideState(COMPONENT_TYPE);
  const { customState: customFontState, effectiveFont, initialCustom: initialFontCustom, setCustomState: setCustomFontState, setInitialCustom: setInitialFontCustom, showCustomBlock: showFontCustomBlock } = useTypeFontOverrideState(COMPONENT_TYPE);
  const brandMode = effectiveColors.mode === 'single' ? 'single' : 'dual';
  const setTypeColorOverride = useMutation(api.homeComponentSystemConfig.setTypeColorOverride);
  const setTypeFontOverride = useMutation(api.homeComponentSystemConfig.setTypeFontOverride);

  const component = useQuery(api.homeComponents.getById, { id: id as Id<'homeComponents'> });
  const updateMutation = useMutation(api.homeComponents.update);

  const [title, setTitle] = useState('');
  const [active, setActive] = useState(true);
  const [faqItems, setFaqItems] = useState<FaqItem[]>(FALLBACK_FAQ_ITEMS);
  const [faqStyle, setFaqStyle] = useState<FaqStyle>('accordion');
  const [faqConfig, setFaqConfig] = useState<FaqConfig>(DEFAULT_FAQ_CONFIG);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [headerExpanded, setHeaderExpanded] = useState(false);
  const [faqExpanded, setFaqExpanded] = useState(false);
  
  // Header state
  const [hideHeader, setHideHeader] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const [showSubtitle, setShowSubtitle] = useState(true);
  const [subtitle, setSubtitle] = useState('');
  const [headerAlign, setHeaderAlign] = useState<'left' | 'center' | 'right'>('left');
  const [titleColorPrimary, setTitleColorPrimary] = useState(false);
  const [subtitleAboveTitle, setSubtitleAboveTitle] = useState(false);
  const [uppercaseText, setUppercaseText] = useState(false);
  const [showBadge, setShowBadge] = useState(true);
  const [badgeText, setBadgeText] = useState('');
  
  const [initialData, setInitialData] = useState<{
    title: string;
    active: boolean;
    faqItems: FaqItem[];
    faqStyle: FaqStyle;
    faqConfig: FaqConfig;
  } | null>(null);

  useEffect(() => {
    if (!component) {return;}

    if (component.type !== 'FAQ') {
      router.replace(`/admin/home-components/${id}/edit`);
      return;
    }

    setTitle(component.title);
    setActive(component.active);

    const config = component.config ?? {};
    const nextFaqItems = toFaqItems(config.items);
    const nextFaqStyle = toFaqStyle(config.style);
    const nextFaqConfig = toFaqConfig(config);

    setFaqItems(nextFaqItems);
    setFaqStyle(nextFaqStyle);
    setFaqConfig(nextFaqConfig);
    
    // Load header config
    setHideHeader(nextFaqConfig.hideHeader ?? false);
    setShowTitle(nextFaqConfig.showTitle ?? true);
    setShowSubtitle(nextFaqConfig.showSubtitle ?? true);
    setSubtitle(nextFaqConfig.subtitle ?? '');
    setHeaderAlign(nextFaqConfig.headerAlign ?? 'left');
    setTitleColorPrimary(nextFaqConfig.titleColorPrimary ?? false);
    setSubtitleAboveTitle(nextFaqConfig.subtitleAboveTitle ?? false);
    setUppercaseText(nextFaqConfig.uppercaseText ?? false);
    setShowBadge(nextFaqConfig.showBadge ?? true);
    setBadgeText(nextFaqConfig.badgeText ?? '');
    
    setInitialData({
      title: component.title,
      active: component.active,
      faqItems: nextFaqItems,
      faqStyle: nextFaqStyle,
      faqConfig: nextFaqConfig,
    });
    setHasChanges(false);
  }, [component, id, router]);

  useEffect(() => {
    if (!initialData) {return;}

    const resolvedCustomSecondary = resolveSecondaryByMode(customState.mode, customState.primary, customState.secondary);
    const resolvedInitialSecondary = resolveSecondaryByMode(initialCustom.mode, initialCustom.primary, initialCustom.secondary);
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
    const headerChanged = hideHeader !== initialData.faqConfig.hideHeader
      || showTitle !== initialData.faqConfig.showTitle
      || showSubtitle !== initialData.faqConfig.showSubtitle
      || subtitle !== initialData.faqConfig.subtitle
      || headerAlign !== initialData.faqConfig.headerAlign
      || titleColorPrimary !== initialData.faqConfig.titleColorPrimary
      || subtitleAboveTitle !== initialData.faqConfig.subtitleAboveTitle
      || uppercaseText !== initialData.faqConfig.uppercaseText
      || showBadge !== initialData.faqConfig.showBadge
      || badgeText !== initialData.faqConfig.badgeText;
    const changed = title !== initialData.title
      || active !== initialData.active
      || faqStyle !== initialData.faqStyle
      || JSON.stringify(faqItems) !== JSON.stringify(initialData.faqItems)
      || JSON.stringify(faqConfig) !== JSON.stringify(initialData.faqConfig)
      || customChanged
      || customFontChanged
      || headerChanged;

    setHasChanges(changed);
  }, [title, active, faqItems, faqStyle, faqConfig, initialData, customState, initialCustom, showCustomBlock, hideHeader, showTitle, showSubtitle, subtitle, headerAlign, titleColorPrimary, subtitleAboveTitle, uppercaseText, showBadge, badgeText]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) {return;}

    setIsSubmitting(true);
    try {
      const nextConfig: FaqConfig = {
        buttonLink: faqConfig.buttonLink,
        buttonText: faqConfig.buttonText,
        description: faqConfig.description,
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
      };

      await updateMutation({
        active,
        config: {
          buttonLink: nextConfig.buttonLink,
          buttonText: nextConfig.buttonText,
          description: nextConfig.description,
          items: faqItems.map((item) => ({ answer: item.answer, question: item.question })),
          style: faqStyle,
          // Header fields
          hideHeader: nextConfig.hideHeader,
          showTitle: nextConfig.showTitle,
          showSubtitle: nextConfig.showSubtitle,
          subtitle: nextConfig.subtitle,
          headerAlign: nextConfig.headerAlign,
          titleColorPrimary: nextConfig.titleColorPrimary,
          subtitleAboveTitle: nextConfig.subtitleAboveTitle,
          uppercaseText: nextConfig.uppercaseText,
          showBadge: nextConfig.showBadge,
          badgeText: nextConfig.badgeText,
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
      toast.success('Đã cập nhật FAQ');
      setFaqConfig(nextConfig);
      setInitialData({
        title,
        active,
        faqItems,
        faqStyle,
        faqConfig: nextConfig,
      });
      if (showCustomBlock) {
        const resolvedCustomSecondary = resolveSecondaryByMode(customState.mode, customState.primary, customState.secondary);
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
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Chỉnh sửa FAQ</h1>
        <Link href="/admin/home-components" className="text-sm text-blue-600 hover:underline">Quay lại danh sách</Link>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <HelpCircle size={20} />
              FAQ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tiêu đề hiển thị <span className="text-red-500">*</span></Label>
              <Input
                value={title}
                onChange={(e) => { setTitle(e.target.value); }}
                required
                placeholder="Nhập tiêu đề component..."
              />
            </div>
</CardContent>
        </Card>

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
        />

        <FaqForm
          faqItems={faqItems}
          setFaqItems={setFaqItems}
          faqStyle={faqStyle}
          brandColor={effectiveColors.primary}
          faqConfig={faqConfig}
          setFaqConfig={setFaqConfig}
          expanded={faqExpanded}
          onExpandedChange={setFaqExpanded}
        />

        <div className="space-y-4">
          {showCustomBlock && (
            <TypeColorOverrideCard
              title="Màu custom cho FAQ"
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
              title="Font custom cho FAQ"
              enabled={customFontState.enabled}
              fontKey={customFontState.fontKey}
              compact
              toggleLabel="Custom"
              fontLabel="Font"
              onEnabledChange={(next) => setCustomFontState((prev) => ({ ...prev, enabled: next }))}
              onFontChange={(next) => setCustomFontState((prev) => ({ ...prev, fontKey: next }))}
            />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,420px] gap-6">
          <div></div>
          <div className="lg:sticky lg:top-6 lg:self-start space-y-4">
            <FaqPreview
              items={faqItems}
              brandColor={effectiveColors.primary}
              secondary={effectiveColors.secondary}
              mode={brandMode}
              selectedStyle={faqStyle}
              onStyleChange={setFaqStyle}
              config={faqConfig}
              title={title}
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
