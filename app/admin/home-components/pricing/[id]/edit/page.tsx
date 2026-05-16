'use client';

import React, { use, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { AlertTriangle, ChevronDown, Eye, GripVertical, Loader2, Package, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, cn } from '../../../../components/ui';
import { TypeColorOverrideCard } from '../../../_shared/components/TypeColorOverrideCard';
import { TypeFontOverrideCard } from '../../../_shared/components/TypeFontOverrideCard';
import { HeaderConfigSection } from '../../../_shared/components/HeaderConfigSection';
import { extractSectionHeaderConfig } from '../../../_shared/hooks/useSectionHeaderState';
import { useTypeColorOverrideState } from '../../../_shared/hooks/useTypeColorOverride';
import { useTypeFontOverrideState } from '../../../_shared/hooks/useTypeFontOverride';
import { getSuggestedSecondary, resolveSecondaryByMode } from '../../../_shared/lib/typeColorOverride';
import { PricingPreview } from '../../_components/PricingPreview';

import { HomeComponentStickyFooter } from '@/app/admin/home-components/_shared/components/HomeComponentStickyFooter';
import {
  DEFAULT_PRICING_CONFIG,
  DEFAULT_PRICING_TEXTS,
  normalizePricingConfig,
} from '../../_lib/constants';
import { getPricingValidationResult } from '../../_lib/colors';
import type {
  PricingConfig,
  PricingEditorPlan,
  PricingHeaderAlign,
  PricingStyle,
} from '../../_types';
import { AiDemoPricingImport } from '../../../product-list/_components/AiDemoProductsImport';

const sanitizeFeatures = (value: string) => (
  value
    .split(',')
    .map((feature) => feature.trim())
    .filter((feature) => feature.length > 0)
);

type PricingMetaConfig = Pick<
  PricingConfig,
  'subtitle' | 'showBillingToggle' | 'monthlyLabel' | 'yearlyLabel' | 'yearlySavingText' | 'gridCols'
>;

const toEditorPlan = (plan: PricingConfig['plans'][number], index: number): PricingEditorPlan => ({
  id: typeof plan.id === 'number' ? plan.id : index + 1,
  name: plan.name,
  price: plan.price,
  yearlyPrice: plan.yearlyPrice ?? '',
  period: plan.period,
  features: Array.isArray(plan.features) ? plan.features : [],
  isPopular: Boolean(plan.isPopular),
  buttonText: plan.buttonText,
  buttonLink: plan.buttonLink,
});

const normalizeMetaConfig = (config: PricingConfig): PricingMetaConfig => ({
  subtitle: config.subtitle ?? DEFAULT_PRICING_CONFIG.subtitle,
  showBillingToggle: config.showBillingToggle !== false,
  monthlyLabel: config.monthlyLabel ?? DEFAULT_PRICING_CONFIG.monthlyLabel,
  yearlyLabel: config.yearlyLabel ?? DEFAULT_PRICING_CONFIG.yearlyLabel,
  yearlySavingText: config.yearlySavingText ?? DEFAULT_PRICING_CONFIG.yearlySavingText,
  gridCols: config.gridCols === 4 ? 4 : 3,
});

const toSnapshot = (payload: {
  title: string;
  active: boolean;
  style: PricingStyle;
  pricingSubtitle: string;
  showBillingToggle: boolean;
  monthlyLabel: string;
  yearlyLabel: string;
  yearlySavingText: string;
  gridCols: 3 | 4;
  texts: Record<string, string>;
  plans: Array<{
    name: string;
    price: string;
    yearlyPrice: string;
    period: string;
    features: string[];
    isPopular: boolean;
    buttonText: string;
    buttonLink: string;
  }>;
  // Header config
  hideHeader: boolean;
  showTitle: boolean;
  headerSubtitle: string;
  showSubtitle: boolean;
  headerAlign: PricingHeaderAlign;
  titleColorPrimary: boolean;
  subtitleAboveTitle: boolean;
  uppercaseText: boolean;
  showBadge: boolean;
  badgeText: string;
}) => JSON.stringify(payload);

const COMPONENT_TYPE = 'Pricing';

export default function PricingEditPage({ params }: { params: Promise<{ id: string }> }) {
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
  const [pricingStyle, setPricingStyle] = useState<PricingStyle>('cards');
  const [pricingPlans, setPricingPlans] = useState<PricingEditorPlan[]>([]);
  const [pricingConfig, setPricingConfig] = useState<PricingMetaConfig>({
    gridCols: DEFAULT_PRICING_CONFIG.gridCols ?? 3,
    monthlyLabel: DEFAULT_PRICING_CONFIG.monthlyLabel,
    showBillingToggle: DEFAULT_PRICING_CONFIG.showBillingToggle,
    subtitle: DEFAULT_PRICING_CONFIG.subtitle,
    yearlyLabel: DEFAULT_PRICING_CONFIG.yearlyLabel,
    yearlySavingText: DEFAULT_PRICING_CONFIG.yearlySavingText,
  });
  const [texts, setTexts] = useState<Record<string, string>>(DEFAULT_PRICING_TEXTS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialSnapshot, setInitialSnapshot] = useState<string | null>(null);

  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);
  
  // Header config state
  const [expandedSections, setExpandedSections] = useState({ header: false, pricing: false, plans: false });
  const [hideHeader, setHideHeader] = useState(false);
  const [showTitle, setShowTitle] = useState(DEFAULT_PRICING_CONFIG.showTitle ?? true);
  const [subtitle, setSubtitle] = useState('');
  const [showSubtitle, setShowSubtitle] = useState(DEFAULT_PRICING_CONFIG.showSubtitle ?? true);
  const [headerAlign, setHeaderAlign] = useState<PricingHeaderAlign>(DEFAULT_PRICING_CONFIG.headerAlign ?? 'left');
  const [titleColorPrimary, setTitleColorPrimary] = useState(false);
  const [subtitleAboveTitle, setSubtitleAboveTitle] = useState(false);
  const [uppercaseText, setUppercaseText] = useState(false);
  const [showBadge, setShowBadge] = useState(true);
  const [badgeText, setBadgeText] = useState('');

  useEffect(() => {
    if (!component) {return;}

    if (component.type !== 'Pricing') {
      router.replace(`/admin/home-components/${id}/edit`);
      return;
    }

    const normalizedConfig = normalizePricingConfig(component.config ?? {});

    setTitle(component.title);
    setActive(component.active);
    setPricingStyle(normalizedConfig.style);
    setPricingPlans(normalizedConfig.plans.map((plan, index) => toEditorPlan(plan, index)));
    setPricingConfig(normalizeMetaConfig(normalizedConfig));
    setTexts(normalizedConfig.texts ?? DEFAULT_PRICING_TEXTS);
    
    // Load header config
    const headerConfig = extractSectionHeaderConfig(component.config ?? {});
    setHideHeader(headerConfig.hideHeader ?? false);
    setShowTitle(headerConfig.showTitle ?? true);
    setSubtitle(headerConfig.subtitle ?? '');
    setShowSubtitle(headerConfig.showSubtitle ?? true);
    setHeaderAlign((headerConfig.headerAlign ?? 'left') as PricingHeaderAlign);
    setTitleColorPrimary(headerConfig.titleColorPrimary ?? false);
    setSubtitleAboveTitle(headerConfig.subtitleAboveTitle ?? false);
    setUppercaseText(headerConfig.uppercaseText ?? false);
    setShowBadge(headerConfig.showBadge ?? true);
    setBadgeText(headerConfig.badgeText ?? '');
  }, [component, id, router]);

  useEffect(() => {
    if (!component) {return;}

    const normalizedConfig = normalizePricingConfig(component.config ?? {});
    const headerConfig = extractSectionHeaderConfig(component.config ?? {});
    
    const snapshot = toSnapshot({
      title: component.title,
      active: component.active,
      style: normalizedConfig.style,
      pricingSubtitle: String(normalizedConfig.subtitle ?? DEFAULT_PRICING_CONFIG.subtitle),
      showBillingToggle: normalizedConfig.showBillingToggle !== false,
      monthlyLabel: String(normalizedConfig.monthlyLabel ?? DEFAULT_PRICING_CONFIG.monthlyLabel),
      yearlyLabel: String(normalizedConfig.yearlyLabel ?? DEFAULT_PRICING_CONFIG.yearlyLabel),
      yearlySavingText: String(normalizedConfig.yearlySavingText ?? DEFAULT_PRICING_CONFIG.yearlySavingText),
      gridCols: normalizedConfig.gridCols === 4 ? 4 : 3,
      texts: normalizedConfig.texts ?? DEFAULT_PRICING_TEXTS,
      plans: normalizedConfig.plans.map((plan) => ({
        name: plan.name,
        price: plan.price,
        yearlyPrice: String(plan.yearlyPrice ?? ''),
        period: plan.period,
        features: Array.isArray(plan.features) ? plan.features : [],
        isPopular: Boolean(plan.isPopular),
        buttonText: plan.buttonText,
        buttonLink: plan.buttonLink,
      })),
      // Header config
      hideHeader: headerConfig.hideHeader ?? false,
      showTitle: headerConfig.showTitle ?? true,
      headerSubtitle: headerConfig.subtitle ?? '',
      showSubtitle: headerConfig.showSubtitle ?? true,
      headerAlign: (headerConfig.headerAlign ?? 'left') as PricingHeaderAlign,
      titleColorPrimary: headerConfig.titleColorPrimary ?? false,
      subtitleAboveTitle: headerConfig.subtitleAboveTitle ?? false,
      uppercaseText: headerConfig.uppercaseText ?? false,
      showBadge: headerConfig.showBadge ?? true,
      badgeText: headerConfig.badgeText ?? '',
    });

    setInitialSnapshot(snapshot);
  }, [component]);

  const currentSnapshot = toSnapshot({
    title,
    active,
    style: pricingStyle,
    pricingSubtitle: String(pricingConfig.subtitle ?? ''),
    showBillingToggle: pricingConfig.showBillingToggle !== false,
    monthlyLabel: String(pricingConfig.monthlyLabel ?? ''),
    yearlyLabel: String(pricingConfig.yearlyLabel ?? ''),
    yearlySavingText: String(pricingConfig.yearlySavingText ?? ''),
    gridCols: pricingConfig.gridCols === 4 ? 4 : 3,
    texts,
    plans: pricingPlans.map((plan) => ({
      name: plan.name,
      price: plan.price,
      yearlyPrice: String(plan.yearlyPrice ?? ''),
      period: plan.period,
      features: Array.isArray(plan.features) ? plan.features : [],
      isPopular: Boolean(plan.isPopular),
      buttonText: plan.buttonText,
      buttonLink: plan.buttonLink,
    })),
    // Header config
    hideHeader,
    showTitle,
    headerSubtitle: subtitle,
    showSubtitle,
    headerAlign,
    titleColorPrimary,
    subtitleAboveTitle,
    uppercaseText,
    showBadge,
    badgeText,
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
  const hasChanges = initialSnapshot !== null && (currentSnapshot !== initialSnapshot || customChanged || customFontChanged);

  const validation = useMemo(() => getPricingValidationResult({
    primary: effectiveColors.primary,
    secondary: effectiveColors.secondary,
    mode: effectiveColors.mode,
  }), [effectiveColors]);

  const warningMessages = useMemo(() => {
    const messages: string[] = [];

    if (effectiveColors.mode === 'dual' && validation.harmonyStatus.isTooSimilar) {
      messages.push(`Màu phụ đang khá gần màu chính (deltaE = ${validation.harmonyStatus.deltaE}). Nên tăng độ tách biệt.`);
    }

    return messages;
  }, [effectiveColors.mode, validation]);

  const dragProps = (planId: number) => ({
    draggable: true,
    onDragEnd: () => { setDraggedId(null); setDragOverId(null); },
    onDragOver: (event: React.DragEvent) => {
      event.preventDefault();
      if (draggedId !== planId) {
        setDragOverId(planId);
      }
    },
    onDragStart: () => { setDraggedId(planId); },
    onDrop: (event: React.DragEvent) => {
      event.preventDefault();
      if (!draggedId || draggedId === planId) {return;}

      const nextPlans = [...pricingPlans];
      const draggedIndex = nextPlans.findIndex((plan) => plan.id === draggedId);
      const dropIndex = nextPlans.findIndex((plan) => plan.id === planId);

      if (draggedIndex < 0 || dropIndex < 0) {
        setDraggedId(null);
        setDragOverId(null);
        return;
      }

      const [moved] = nextPlans.splice(draggedIndex, 1);
      nextPlans.splice(dropIndex, 0, moved);
      setPricingPlans(nextPlans);
      setDraggedId(null);
      setDragOverId(null);
    },
  });

  const addPlan = () => {
    if (pricingPlans.length >= 4) {return;}
    setPricingPlans((prev) => ([
      ...prev,
      {
        id: Date.now(),
        name: '',
        price: '',
        yearlyPrice: '',
        period: '/tháng',
        features: [],
        isPopular: false,
        buttonText: 'Chọn gói',
        buttonLink: '',
      },
    ]));
  };

  const updatePlan = (planId: number, updates: Partial<PricingEditorPlan>) => {
    setPricingPlans((prev) => prev.map((plan) => (plan.id === planId ? { ...plan, ...updates } : plan)));
  };

  const removePlan = (planId: number) => {
    if (pricingPlans.length <= 1) {
      return;
    }

    setPricingPlans((prev) => prev.filter((plan) => plan.id !== planId));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) {return;}

    setIsSubmitting(true);
    try {
      const payload: PricingConfig = {
        plans: pricingPlans.map((plan) => ({
          name: plan.name,
          price: plan.price,
          yearlyPrice: plan.yearlyPrice,
          period: plan.period,
          features: plan.features,
          isPopular: plan.isPopular,
          buttonText: plan.buttonText,
          buttonLink: plan.buttonLink,
        })),
        style: pricingStyle,
        texts,
        ...pricingConfig,
        // Header config
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
      };

      await updateMutation({
        active,
        config: payload,
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

      setInitialSnapshot(toSnapshot({
        title,
        active,
        style: payload.style,
        pricingSubtitle: String(payload.subtitle ?? ''),
        showBillingToggle: payload.showBillingToggle !== false,
        monthlyLabel: String(payload.monthlyLabel ?? ''),
        yearlyLabel: String(payload.yearlyLabel ?? ''),
        yearlySavingText: String(payload.yearlySavingText ?? ''),
        gridCols: payload.gridCols === 4 ? 4 : 3,
        texts: payload.texts ?? DEFAULT_PRICING_TEXTS,
        plans: payload.plans.map((plan) => ({
          name: plan.name,
          price: plan.price,
          yearlyPrice: String(plan.yearlyPrice ?? ''),
          period: plan.period,
          features: Array.isArray(plan.features) ? plan.features : [],
          isPopular: Boolean(plan.isPopular),
          buttonText: plan.buttonText,
          buttonLink: plan.buttonLink,
        })),
        // Header config
        hideHeader,
        showTitle,
        headerSubtitle: subtitle,
        showSubtitle,
        headerAlign,
        titleColorPrimary,
        subtitleAboveTitle,
        uppercaseText,
        showBadge,
        badgeText,
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
      toast.success('Đã cập nhật Pricing');
    } catch (error) {
      toast.error('Lỗi khi cập nhật');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (component === undefined) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (component === null) {
    return <div className="py-8 text-center text-slate-500">Không tìm thấy component</div>;
  }

  const fontStyle = { '--font-active': `var(${effectiveFont.fontVariable})` } as React.CSSProperties;

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Chỉnh sửa Pricing</h1>
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
          expanded={expandedSections.header}
          onExpandedChange={(value) => setExpandedSections((prev) => ({ ...prev, header: value }))}
          titleRequired={true}
          titleLabel="Tiêu đề hiển thị"
          titlePlaceholder="Nhập tiêu đề component..."
        />



        <Card className="mb-6">
          <CardHeader
            className="cursor-pointer"
            onClick={() => setExpandedSections((prev) => ({ ...prev, pricing: !prev.pricing }))}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Cấu hình bảng giá</CardTitle>
              <ChevronDown
                size={16}
                className={cn('transition-transform duration-200', expandedSections.pricing ? 'rotate-180' : '')}
              />
            </div>
          </CardHeader>
          {expandedSections.pricing && (
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={pricingConfig.showBillingToggle}
                  onChange={(event) => { setPricingConfig({ ...pricingConfig, showBillingToggle: event.target.checked }); }}
                  className="h-4 w-4 rounded"
                />
                <span>Hiển thị toggle Tháng/Năm</span>
              </label>
            </div>

            <div className="space-y-2">
              <Label>Số cột desktop</Label>
              <div className="grid grid-cols-2 gap-2">
                {[3, 4].map((option) => {
                  const selected = pricingConfig.gridCols === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setPricingConfig((prev) => ({ ...prev, gridCols: option as 3 | 4 }))}
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

            {pricingConfig.showBillingToggle && (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div>
                  <Label className="text-xs">Label tháng</Label>
                  <Input
                    placeholder="Hàng tháng"
                    value={pricingConfig.monthlyLabel ?? ''}
                    onChange={(event) => { setPricingConfig({ ...pricingConfig, monthlyLabel: event.target.value }); }}
                  />
                </div>
                <div>
                  <Label className="text-xs">Label năm</Label>
                  <Input
                    placeholder="Hàng năm"
                    value={pricingConfig.yearlyLabel ?? ''}
                    onChange={(event) => { setPricingConfig({ ...pricingConfig, yearlyLabel: event.target.value }); }}
                  />
                </div>
                <div>
                  <Label className="text-xs">Badge tiết kiệm</Label>
                  <Input
                    placeholder="Tiết kiệm 17%"
                    value={pricingConfig.yearlySavingText ?? ''}
                    onChange={(event) => { setPricingConfig({ ...pricingConfig, yearlySavingText: event.target.value }); }}
                  />
                </div>
              </div>
            )}
          </CardContent>
          )}
        </Card>



        <Card className="mb-6">
          <CardHeader
            className="cursor-pointer flex flex-row items-center justify-between"
            onClick={() => setExpandedSections((prev) => ({ ...prev, plans: !prev.plans }))}
          >
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">Các gói dịch vụ ({pricingPlans.length})</CardTitle>
              <ChevronDown
                size={16}
                className={cn('transition-transform duration-200', expandedSections.plans ? 'rotate-180' : '')}
              />
            </div>
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <AiDemoPricingImport onApply={(items) => setPricingPlans(items as PricingEditorPlan[])} />
              <Button type="button" variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); addPlan(); }} className="gap-2" disabled={pricingPlans.length >= 4}>
                <Plus size={14} /> Thêm gói {pricingPlans.length >= 4 && '(tối đa 4)'}
              </Button>
            </div>
          </CardHeader>
          {expandedSections.plans && (
          <CardContent className="space-y-4">
            {pricingPlans.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                  <Package size={32} className="text-slate-400" />
                </div>
                <h3 className="mb-1 font-medium text-slate-900 dark:text-slate-100">Chưa có gói nào</h3>
                <p className="mb-4 text-sm text-slate-500">Thêm gói đầu tiên để bắt đầu</p>
                <Button type="button" variant="outline" size="sm" onClick={addPlan} className="gap-2" disabled={pricingPlans.length >= 4}>
                  <Plus size={14} /> Thêm gói
                </Button>
              </div>
            ) : (
              pricingPlans.map((plan, index) => (
                <div
                  key={plan.id}
                  {...dragProps(plan.id)}
                  className={cn(
                    'space-y-3 rounded-lg bg-slate-50 p-4 transition-all dark:bg-slate-800',
                    draggedId === plan.id && 'scale-95 opacity-50',
                    dragOverId === plan.id && 'ring-2 ring-blue-500',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical size={16} className="cursor-grab text-slate-400" />
                      <Label>Gói {index + 1}</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="flex cursor-pointer items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={plan.isPopular}
                          onChange={(event) => { updatePlan(plan.id, { isPopular: event.target.checked }); }}
                          className="h-4 w-4 rounded"
                        />
                        Nổi bật
                      </label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500"
                        onClick={() => { removePlan(plan.id); }}
                        disabled={pricingPlans.length <= 1}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <Input
                      placeholder="Tên gói"
                      value={plan.name}
                      onChange={(event) => { updatePlan(plan.id, { name: event.target.value }); }}
                    />
                    <Input
                      placeholder="Giá tháng (VD: 299.000)"
                      value={plan.price}
                      onChange={(event) => { updatePlan(plan.id, { price: event.target.value }); }}
                    />
                  </div>

                  {pricingConfig.showBillingToggle && (
                    <Input
                      placeholder="Giá năm (VD: 2.990.000)"
                      value={plan.yearlyPrice}
                      onChange={(event) => { updatePlan(plan.id, { yearlyPrice: event.target.value }); }}
                    />
                  )}

                  <Input
                    placeholder="Tính năng (phân cách bởi dấu phẩy)"
                    value={(plan.features || []).join(', ')}
                    onChange={(event) => { updatePlan(plan.id, { features: sanitizeFeatures(event.target.value) }); }}
                  />

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <Input
                      placeholder="Text nút bấm"
                      value={plan.buttonText}
                      onChange={(event) => { updatePlan(plan.id, { buttonText: event.target.value }); }}
                    />
                    <Input
                      placeholder="Liên kết"
                      value={plan.buttonLink}
                      onChange={(event) => { updatePlan(plan.id, { buttonLink: event.target.value }); }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
          )}
        </Card>

        {warningMessages.length > 0 && (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            <div className="space-y-2">
              {warningMessages.map((message) => (
                <div key={message} className="flex items-start gap-2">
                  {message.includes('deltaE') ? <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" /> : <Eye size={14} className="mt-0.5 flex-shrink-0" />}
                  <p>{message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {showCustomBlock && (
            <TypeColorOverrideCard
              title="Màu custom cho Pricing"
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
              title="Font custom cho Pricing"
              enabled={customFontState.enabled}
              fontKey={customFontState.fontKey}
              compact
              toggleLabel="Custom"
              fontLabel="Font"
              onEnabledChange={(next) => setCustomFontState((prev) => ({ ...prev, enabled: next }))}
              onFontChange={(next) => setCustomFontState((prev) => ({ ...prev, fontKey: next }))}
            />
          )}
          <PricingPreview
            title={title}
            plans={pricingPlans}
            brandColor={effectiveColors.primary}
            secondary={effectiveColors.secondary}
            mode={effectiveColors.mode}
            selectedStyle={pricingStyle}
            onStyleChange={setPricingStyle}
            config={{ ...pricingConfig, texts }}
            fontStyle={fontStyle}
            fontClassName="font-active"
            headerConfig={{
              subtitle,
              hideHeader,
              showTitle,
              showSubtitle,
              headerAlign,
              titleColorPrimary,
              subtitleAboveTitle,
              uppercaseText,
              showBadge,
              badgeText,
            }}
            gridCols={pricingConfig.gridCols}
          />
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
