'use client';

import React, { use, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, Label, Input } from '../../../../components/ui';
import { TypeColorOverrideCard } from '../../../_shared/components/TypeColorOverrideCard';
import { TypeFontOverrideCard } from '../../../_shared/components/TypeFontOverrideCard';
import { HeaderConfigSection } from '../../../_shared/components/HeaderConfigSection';
import { extractSectionHeaderConfig } from '../../../_shared/hooks/useSectionHeaderState';
import { useTypeColorOverrideState } from '../../../_shared/hooks/useTypeColorOverride';
import { useTypeFontOverrideState } from '../../../_shared/hooks/useTypeFontOverride';
import { getSuggestedSecondary, resolveSecondaryByMode } from '../../../_shared/lib/typeColorOverride';
import { getHomeComponentPriceLabel, resolveSaleMode } from '../../../_shared/lib/productPrice';
import { ProductListForm } from '../../_components/ProductListForm';
import { ProductListPreview } from '../../_components/ProductListPreview';
import { DEFAULT_PRODUCT_LIST_CONFIG, DEFAULT_PRODUCT_LIST_TEXT, normalizeProductListStyle } from '../../_lib/constants';
import type { DemoProductItem, ProductListConfig, ProductListStyle, ProductSelectionMode } from '../../_types';
import { HomeComponentStickyFooter } from '@/app/admin/home-components/_shared/components/HomeComponentStickyFooter';

const COMPONENT_TYPE = 'ProductList';

export default function ProductListEditPage({ params }: { params: Promise<{ id: string }> }) {
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
  const [productListConfig, setProductListConfig] = useState<ProductListConfig>(DEFAULT_PRODUCT_LIST_CONFIG);
  const [productListStyle, setProductListStyle] = useState<ProductListStyle>('commerce');
  const [productSelectionMode, setProductSelectionMode] = useState<ProductSelectionMode>('auto');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [demoProducts, setDemoProducts] = useState<DemoProductItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialSnapshot, setInitialSnapshot] = useState<string | null>(null);

  // Header config state (shared pattern)
  const [hideHeader, setHideHeader] = useState(false);
  const [showTitleHeader, setShowTitleHeader] = useState(true);
  const [showSubtitle, setShowSubtitle] = useState(true);
  const [headerSubtitle, setHeaderSubtitle] = useState('');
  const [headerAlign, setHeaderAlign] = useState<'left' | 'center' | 'right'>('left');
  const [titleColorPrimary, setTitleColorPrimary] = useState(false);
  const [subtitleAboveTitle, setSubtitleAboveTitle] = useState(false);
  const [uppercaseText, setUppercaseText] = useState(false);
  const [showBadge, setShowBadge] = useState(true);
  const [badgeText, setBadgeText] = useState('');
  const [headerExpanded, setHeaderExpanded] = useState(false);

  const productsData = useQuery(api.products.listAll, { limit: 100 });
  const resolvedProductsData = useQuery(api.products.listPublicResolved, { limit: 100 });
  const saleModeSetting = useQuery(api.admin.modules.getModuleSetting, { moduleKey: 'products', settingKey: 'saleMode' });
  const saleMode = useMemo(() => resolveSaleMode(saleModeSetting?.value), [saleModeSetting?.value]);

  const resolvedProductMap = useMemo(() => new Map(
    (resolvedProductsData ?? []).map((product) => [product._id, product])
  ), [resolvedProductsData]);

  const filteredProducts = useMemo(() => {
    if (!productsData) {return [];}
    return productsData
      .filter(product => product.status === 'Active')
      .filter(product =>
        !productSearchTerm ||
        product.name.toLowerCase().includes(productSearchTerm.toLowerCase())
      );
  }, [productsData, productSearchTerm]);

  const selectedProducts = useMemo(() => {
    if (!productsData || selectedProductIds.length === 0) {return [];}
    const productMap = new Map(productsData.map(p => [p._id, p]));
    return selectedProductIds
      .map((productId) => productMap.get(productId as Id<'products'>))
      .filter((product): product is NonNullable<typeof product> => product !== undefined);
  }, [productsData, selectedProductIds]);

  useEffect(() => {
    if (component) {
      if (component.type !== 'ProductList') {
        router.replace(`/admin/home-components/${id}/edit`);
        return;
      }

      setTitle(component.title);
      setActive(component.active);

      const config = component.config ?? {};
      setProductListConfig({
        itemCount: config.itemCount ?? DEFAULT_PRODUCT_LIST_CONFIG.itemCount,
        sortBy: config.sortBy ?? DEFAULT_PRODUCT_LIST_CONFIG.sortBy,
      });
      setProductListStyle(normalizeProductListStyle(config.style));
      setProductSelectionMode((config.selectionMode as ProductSelectionMode) || 'auto');
      setSelectedProductIds((config.selectedProductIds as string[]) ?? []);
      setDemoProducts((config.demoProducts as DemoProductItem[]) ?? []);

      // Load header config
      const headerConfig = extractSectionHeaderConfig(config);
      setHideHeader(headerConfig.hideHeader ?? false);
      setShowTitleHeader(headerConfig.showTitle ?? true);
      setShowSubtitle(headerConfig.showSubtitle ?? true);
      // Map: subtitle → sectionTitle, badgeText → subTitle
      setHeaderSubtitle((config.sectionTitle as string) ?? headerConfig.subtitle ?? DEFAULT_PRODUCT_LIST_TEXT.sectionTitle);
      setHeaderAlign(headerConfig.headerAlign ?? 'left');
      setTitleColorPrimary(headerConfig.titleColorPrimary ?? false);
      setSubtitleAboveTitle(headerConfig.subtitleAboveTitle ?? false);
      setUppercaseText(headerConfig.uppercaseText ?? false);
      setShowBadge(headerConfig.showBadge ?? true);
      setBadgeText((config.subTitle as string) ?? headerConfig.badgeText ?? DEFAULT_PRODUCT_LIST_TEXT.subTitle);
    }
  }, [component, id, router]);

  const toSnapshot = (payload: Record<string, unknown>) => JSON.stringify(payload);

  useEffect(() => {
    if (!component) {return;}
    const config = component.config ?? {};
    const initialSelectionMode = ((config.selectionMode as ProductSelectionMode) || 'auto');
    const headerConfig = extractSectionHeaderConfig(config);

    setInitialSnapshot(toSnapshot({
      title: component.title,
      active: component.active,
      itemCount: (config.itemCount as number) ?? DEFAULT_PRODUCT_LIST_CONFIG.itemCount,
      sortBy: (config.sortBy as string) ?? DEFAULT_PRODUCT_LIST_CONFIG.sortBy,
      style: normalizeProductListStyle(config.style),
      selectionMode: initialSelectionMode,
      selectedProductIds: initialSelectionMode === 'manual' ? ((config.selectedProductIds as string[]) ?? []) : [],
      demoProducts: initialSelectionMode === 'demo' ? ((config.demoProducts as DemoProductItem[]) ?? []) : [],
      // Header fields
      hideHeader: headerConfig.hideHeader,
      showTitle: headerConfig.showTitle,
      showSubtitle: headerConfig.showSubtitle,
      subtitle: (config.sectionTitle as string) ?? headerConfig.subtitle ?? DEFAULT_PRODUCT_LIST_TEXT.sectionTitle,
      headerAlign: headerConfig.headerAlign,
      titleColorPrimary: headerConfig.titleColorPrimary,
      subtitleAboveTitle: headerConfig.subtitleAboveTitle,
      uppercaseText: headerConfig.uppercaseText,
      showBadge: headerConfig.showBadge,
      badgeText: (config.subTitle as string) ?? headerConfig.badgeText ?? DEFAULT_PRODUCT_LIST_TEXT.subTitle,
    }));
  }, [component]);

  const currentSnapshot = toSnapshot({
    title,
    active,
    itemCount: productListConfig.itemCount,
    sortBy: productListConfig.sortBy,
    style: productListStyle,
    selectionMode: productSelectionMode,
    selectedProductIds: productSelectionMode === 'manual' ? selectedProductIds : [],
    demoProducts: productSelectionMode === 'demo' ? demoProducts : [],
    // Header fields
    hideHeader,
    showTitle: showTitleHeader,
    showSubtitle,
    subtitle: headerSubtitle,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) {return;}

    setIsSubmitting(true);
    try {
      const nextConfig = {
        ...productListConfig,
        selectionMode: productSelectionMode,
        selectedProductIds: productSelectionMode === 'manual' ? selectedProductIds : [],
        demoProducts: productSelectionMode === 'demo' ? demoProducts : [],
        style: productListStyle,
        // Legacy fields for backward compat
        subTitle: badgeText,
        sectionTitle: headerSubtitle,
        // Header config fields
        hideHeader,
        showTitle: showTitleHeader,
        showSubtitle,
        subtitle: headerSubtitle,
        headerAlign,
        titleColorPrimary,
        subtitleAboveTitle,
        uppercaseText,
        showBadge,
        badgeText,
      };

      await updateMutation({
        active,
        config: nextConfig,
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

      setInitialSnapshot(toSnapshot({
        title,
        active,
        itemCount: nextConfig.itemCount,
        sortBy: nextConfig.sortBy,
        style: nextConfig.style,
        selectionMode: nextConfig.selectionMode,
        selectedProductIds: nextConfig.selectedProductIds,
        demoProducts: nextConfig.demoProducts ?? [],
        hideHeader,
        showTitle: showTitleHeader,
        showSubtitle,
        subtitle: headerSubtitle,
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
          secondary: resolvedCustomSecondary,
        });
      }
      if (showFontCustomBlock) {
        setInitialFontCustom({
          enabled: customFontState.enabled,
          fontKey: customFontState.fontKey,
        });
      }

      toast.success('Đã cập nhật danh sách sản phẩm');
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
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Chỉnh sửa Danh sách Sản phẩm</h1>
        <Link href="/admin/home-components" className="text-sm text-blue-600 hover:underline">Quay lại danh sách</Link>
      </div>


      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardContent className="pt-4 space-y-2">
            <Label>Tên hiển thị <span className="text-red-500">*</span></Label>
            <Input
              value={title}
              onChange={(event) => { setTitle(event.target.value); }}
              required
              placeholder="Nhập tiêu đề component..."
            />
          </CardContent>
        </Card>

        <HeaderConfigSection
          hideHeader={hideHeader}
          title={title}
          showTitle={showTitleHeader}
          subtitle={headerSubtitle}
          showSubtitle={showSubtitle}
          headerAlign={headerAlign}
          titleColorPrimary={titleColorPrimary}
          subtitleAboveTitle={subtitleAboveTitle}
          uppercaseText={uppercaseText}
          showBadge={showBadge}
          badgeText={badgeText}
          onHideHeaderChange={setHideHeader}
          onTitleChange={setTitle}
          onShowTitleChange={setShowTitleHeader}
          onSubtitleChange={setHeaderSubtitle}
          onShowSubtitleChange={setShowSubtitle}
          onHeaderAlignChange={setHeaderAlign}
          onTitleColorPrimaryChange={setTitleColorPrimary}
          onSubtitleAboveTitleChange={setSubtitleAboveTitle}
          onUppercaseTextChange={setUppercaseText}
          onShowBadgeChange={setShowBadge}
          onBadgeTextChange={setBadgeText}
          expanded={headerExpanded}
          onExpandedChange={setHeaderExpanded}
          titleLabel="Tiêu đề section"
          titlePlaceholder="VD: Sản phẩm nổi bật, Bán chạy nhất..."
        />

        <ProductListForm
          productSelectionMode={productSelectionMode}
          setProductSelectionMode={setProductSelectionMode}
          productListConfig={productListConfig}
          setProductListConfig={setProductListConfig}
          filteredProducts={filteredProducts}
          selectedProducts={selectedProducts}
          selectedProductIds={selectedProductIds}
          setSelectedProductIds={setSelectedProductIds}
          productSearchTerm={productSearchTerm}
          setProductSearchTerm={setProductSearchTerm}
          demoProducts={demoProducts}
          setDemoProducts={setDemoProducts}
          isLoading={productsData === undefined}
          defaultExpanded={false}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,420px] gap-6">
          <div></div>
          <div className="lg:sticky lg:top-6 lg:self-start space-y-4">
            {showCustomBlock && (
              <TypeColorOverrideCard
                title="Màu custom cho Danh sách sản phẩm"
                enabled={customState.enabled}
                mode={customState.mode}
                primary={customState.primary}
                secondary={resolvedCustomSecondary}
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
                title="Font custom cho Sản phẩm"
                enabled={customFontState.enabled}
                fontKey={customFontState.fontKey}
                compact
                toggleLabel="Custom"
                fontLabel="Font"
                onEnabledChange={(next) => setCustomFontState((prev) => ({ ...prev, enabled: next }))}
                onFontChange={(next) => setCustomFontState((prev) => ({ ...prev, fontKey: next }))}
              />
            )}
            <ProductListPreview
              brandColor={effectiveColors.primary}
              secondary={effectiveColors.secondary}
              itemCount={productSelectionMode === 'demo' ? demoProducts.length : (productSelectionMode === 'manual' ? selectedProductIds.length : productListConfig.itemCount)}
              componentType="ProductList"
              selectedStyle={productListStyle}
              onStyleChange={setProductListStyle}
              items={productSelectionMode === 'demo' && demoProducts.length > 0
                ? demoProducts.map((item) => ({
                  id: item.id,
                  name: item.name,
                  image: item.image,
                  price: item.price,
                  originalPrice: item.originalPrice,
                  category: item.category,
                  tag: (item.tag || undefined) as 'new' | 'hot' | 'sale' | undefined,
                }))
                : productSelectionMode === 'manual' && selectedProducts.length > 0
                  ? selectedProducts.map((product) => ({
                    description: product.description,
                    id: product._id,
                    image: product.image,
                    name: product.name,
                    ...(() => {
                      const resolvedProduct = resolvedProductMap.get(product._id as Id<'products'>) ?? product;
                      const priceDisplay = getHomeComponentPriceLabel({ saleMode, price: resolvedProduct.price, salePrice: resolvedProduct.salePrice, isRangeFromVariant: resolvedProduct.hasVariants });
                      const hasBasePrice = resolvedProduct.price != null || resolvedProduct.salePrice != null;
                      return {
                        price: !hasBasePrice && saleMode === 'cart' ? undefined : priceDisplay.label,
                        originalPrice: priceDisplay.comparePrice
                          ? getHomeComponentPriceLabel({ saleMode: 'cart', price: priceDisplay.comparePrice }).label
                          : undefined,
                      };
                    })(),
                  }))
                  : filteredProducts.slice(0, productListConfig.itemCount).map((product) => ({
                    description: product.description,
                    id: product._id,
                    image: product.image,
                    name: product.name,
                    ...(() => {
                      const resolvedProduct = resolvedProductMap.get(product._id as Id<'products'>) ?? product;
                      const priceDisplay = getHomeComponentPriceLabel({ saleMode, price: resolvedProduct.price, salePrice: resolvedProduct.salePrice, isRangeFromVariant: resolvedProduct.hasVariants });
                      const hasBasePrice = resolvedProduct.price != null || resolvedProduct.salePrice != null;
                      return {
                        price: !hasBasePrice && saleMode === 'cart' ? undefined : priceDisplay.label,
                        originalPrice: priceDisplay.comparePrice
                          ? getHomeComponentPriceLabel({ saleMode: 'cart', price: priceDisplay.comparePrice }).label
                          : undefined,
                      };
                    })(),
                  }))
              }
              subTitle={badgeText}
              sectionTitle={title}
              subtitle={headerSubtitle}
              fontStyle={fontStyle}
              fontClassName="font-active"
              hideHeader={hideHeader}
              showTitle={showTitleHeader}
              showSubtitle={showSubtitle}
              headerAlign={headerAlign}
              titleColorPrimary={titleColorPrimary}
              subtitleAboveTitle={subtitleAboveTitle}
              uppercaseText={uppercaseText}
              showBadge={showBadge}
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
