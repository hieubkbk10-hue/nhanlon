'use client';

import React, { use, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import type { Id } from '@/convex/_generated/dataModel';
import { api } from '@/convex/_generated/api';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { HeaderConfigSection } from '../../../_shared/components/HeaderConfigSection';
import { TypeColorOverrideCard } from '../../../_shared/components/TypeColorOverrideCard';
import { TypeFontOverrideCard } from '../../../_shared/components/TypeFontOverrideCard';
import { useTypeColorOverrideState } from '../../../_shared/hooks/useTypeColorOverride';
import { useTypeFontOverrideState } from '../../../_shared/hooks/useTypeFontOverride';
import { getSuggestedSecondary, resolveSecondaryByMode } from '../../../_shared/lib/typeColorOverride';
import { getHomeComponentPriceLabel, resolveSaleMode } from '../../../_shared/lib/productPrice';
import { ProductGridForm } from '../../_components/ProductGridForm';
import type { ProductGridProductItem, CategoryTabItem } from '../../_components/ProductGridForm';
import { ProductGridPreview } from '../../_components/ProductGridPreview';
import { DEFAULT_PRODUCT_GRID_CONFIG } from '../../_lib/constants';
import { HomeComponentStickyFooter } from '@/app/admin/home-components/_shared/components/HomeComponentStickyFooter';
import type { ProductGridStyle, ProductGridSelectionMode } from '../../_types';
import type { DemoProductItem, ProductListPreviewItem } from '../../../product-list/_types';

const COMPONENT_TYPE = 'ProductGrid';

export default function ProductGridEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { customState, effectiveColors, initialCustom, setCustomState, setInitialCustom, showCustomBlock } = useTypeColorOverrideState(COMPONENT_TYPE);
  const { customState: customFontState, effectiveFont, initialCustom: initialFontCustom, setCustomState: setCustomFontState, setInitialCustom: setInitialFontCustom, showCustomBlock: showFontCustomBlock } = useTypeFontOverrideState(COMPONENT_TYPE);
  const setTypeColorOverride = useMutation(api.homeComponentSystemConfig.setTypeColorOverride);
  const setTypeFontOverride = useMutation(api.homeComponentSystemConfig.setTypeFontOverride);
  const component = useQuery(api.homeComponents.getById, { id: id as Id<'homeComponents'> });
  const productsData = useQuery(api.products.listAll, { limit: 100 });
  const resolvedProductsData = useQuery(api.products.listPublicResolved, { limit: 100 });
  const saleModeSetting = useQuery(api.admin.modules.getModuleSetting, { moduleKey: 'products', settingKey: 'saleMode' });
  const updateMutation = useMutation(api.homeComponents.update);
  const saleMode = useMemo(() => resolveSaleMode(saleModeSetting?.value), [saleModeSetting?.value]);
  const categoriesData = useQuery(api.productCategories.listActive);

  const allCategories: CategoryTabItem[] | undefined = useMemo(() => {
    if (!categoriesData) return undefined;
    return categoriesData.map(c => ({ _id: c._id, name: c.name, image: c.image, active: c.active }));
  }, [categoriesData]);

  const resolvedProductMap = useMemo(() => new Map(
    (resolvedProductsData ?? []).map((product) => [product._id, product])
  ), [resolvedProductsData]);

  const [title, setTitle] = useState('');
  const [active, setActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [initialSnapshot, setInitialSnapshot] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  const [itemCount, setItemCount] = useState(DEFAULT_PRODUCT_GRID_CONFIG.itemCount);
  const [sortBy, setSortBy] = useState(DEFAULT_PRODUCT_GRID_CONFIG.sortBy);
  const [selectionMode, setSelectionMode] = useState<ProductGridSelectionMode>(DEFAULT_PRODUCT_GRID_CONFIG.selectionMode);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(DEFAULT_PRODUCT_GRID_CONFIG.selectedProductIds);
  const [demoProducts, setDemoProducts] = useState<DemoProductItem[]>([]);
  const [subTitle, setSubTitle] = useState(DEFAULT_PRODUCT_GRID_CONFIG.subTitle);
  const [sectionTitle, setSectionTitle] = useState(DEFAULT_PRODUCT_GRID_CONFIG.sectionTitle);
  const [style, setStyle] = useState<ProductGridStyle>(DEFAULT_PRODUCT_GRID_CONFIG.style);

  // Category tabs state
  const [categoryTabIds, setCategoryTabIds] = useState<string[]>([]);
  // Desktop columns
  const [desktopColumns, setDesktopColumns] = useState<3 | 4 | 5 | 6>(4);

  // Header config state
  const [hideHeader, setHideHeader] = useState(false);
  const [showTitleHeader, setShowTitleHeader] = useState(true);
  const [showSubtitle, setShowSubtitle] = useState(true);
  const [headerAlign, setHeaderAlign] = useState<'left' | 'center' | 'right'>('left');
  const [titleColorPrimary, setTitleColorPrimary] = useState(false);
  const [subtitleAboveTitle, setSubtitleAboveTitle] = useState(false);
  const [uppercaseText, setUppercaseText] = useState(false);
  const [showBadge, setShowBadge] = useState(true);
  const [headerExpanded, setHeaderExpanded] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState('');

  useEffect(() => {
    if (!component || isInitialized) {return;}
    if (component.type !== 'ProductGrid') {
      router.replace(`/admin/home-components/${id}/edit`);
      return;
    }

    setTitle(component.title);
    setActive(component.active);

    const config = component.config ?? {};
    const nextItemCount = config.itemCount ?? DEFAULT_PRODUCT_GRID_CONFIG.itemCount;
    const nextSortBy = config.sortBy ?? DEFAULT_PRODUCT_GRID_CONFIG.sortBy;
    const nextSelectionMode = config.selectionMode ?? DEFAULT_PRODUCT_GRID_CONFIG.selectionMode;
    const nextSelectedProductIds = config.selectedProductIds ?? [];
    const nextSubTitle = config.subTitle ?? DEFAULT_PRODUCT_GRID_CONFIG.subTitle;
    const nextSectionTitle = config.sectionTitle ?? DEFAULT_PRODUCT_GRID_CONFIG.sectionTitle;
    const nextStyle = (config.style as ProductGridStyle) ?? DEFAULT_PRODUCT_GRID_CONFIG.style;

    setItemCount(nextItemCount);
    setSortBy(nextSortBy);
    setSelectionMode(nextSelectionMode);
    setSelectedProductIds(nextSelectedProductIds);
    setDemoProducts(Array.isArray(config.demoProducts) ? (config.demoProducts as DemoProductItem[]) : []);
    setSubTitle(nextSubTitle);
    setSectionTitle(nextSectionTitle);
    setStyle(nextStyle);

    // Header config
    setHideHeader(config.hideHeader === true);
    setShowTitleHeader(config.showTitle !== false);
    setShowSubtitle(config.showSubtitle !== false);
    setHeaderAlign((config.headerAlign as 'left' | 'center' | 'right') ?? 'left');
    setTitleColorPrimary(config.titleColorPrimary === true);
    setSubtitleAboveTitle(config.subtitleAboveTitle === true);
    setUppercaseText(config.uppercaseText === true);
    setShowBadge(config.showBadge !== false);

    // Category tabs
    setCategoryTabIds(Array.isArray(config.categoryTabIds) ? (config.categoryTabIds as string[]) : []);
    setDesktopColumns((config.desktopColumns === 3 || config.desktopColumns === 5 || config.desktopColumns === 6) ? config.desktopColumns : 4);
    setInitialSnapshot(JSON.stringify({
      title: component.title,
      active: component.active,
      itemCount: nextItemCount,
      sortBy: nextSortBy,
      selectionMode: nextSelectionMode,
      selectedProductIds: nextSelectionMode === 'manual' ? nextSelectedProductIds : [],
      demoProducts: nextSelectionMode === 'demo' ? (Array.isArray(config.demoProducts) ? config.demoProducts : []) : [],
      style: nextStyle,
      subTitle: nextSubTitle,
      sectionTitle: nextSectionTitle,
      categoryTabIds: Array.isArray(config.categoryTabIds) ? config.categoryTabIds : [],
      hideHeader: config.hideHeader === true,
      showTitle: config.showTitle !== false,
      showSubtitle: config.showSubtitle !== false,
      headerAlign: (config.headerAlign as string) ?? 'left',
      titleColorPrimary: config.titleColorPrimary === true,
      subtitleAboveTitle: config.subtitleAboveTitle === true,
      uppercaseText: config.uppercaseText === true,
      showBadge: config.showBadge !== false,
      desktopColumns: (config.desktopColumns === 3 || config.desktopColumns === 5 || config.desktopColumns === 6) ? config.desktopColumns : 4,
    }));
    setHasChanges(false);
    setIsInitialized(true);
  }, [component, id, isInitialized, router]);

  const filteredProducts = useMemo<ProductGridProductItem[]>(() => {
    if (!productsData) {return [];}
    return productsData
      .filter(product => product.status === 'Active')
      .filter(product => !productSearchTerm || product.name.toLowerCase().includes(productSearchTerm.toLowerCase()))
      .map(product => ({
        _id: product._id,
        image: product.image,
        name: product.name,
        price: product.price,
      }));
  }, [productsData, productSearchTerm]);

  const selectedProducts = useMemo<ProductGridProductItem[]>(() => {
    if (!productsData || selectedProductIds.length === 0) {return [];}
    const productMap = new Map(productsData.map(product => [product._id, product]));
    return selectedProductIds
      .map(idValue => productMap.get(idValue as Id<'products'>))
      .filter((product): product is NonNullable<typeof product> => product !== undefined)
      .map(product => ({
        _id: product._id,
        image: product.image,
        name: product.name,
        price: product.price,
      }));
  }, [productsData, selectedProductIds]);

  const productPreviewItems: ProductListPreviewItem[] = useMemo(() => selectedProducts.map((p) => {
    const resolvedProduct = resolvedProductMap.get(p._id as Id<'products'>);
    const priceValue = resolvedProduct?.price ?? p.price ?? undefined;
    const salePriceValue = resolvedProduct?.salePrice ?? undefined;
    const priceDisplay = getHomeComponentPriceLabel({ saleMode, price: priceValue, salePrice: salePriceValue, isRangeFromVariant: resolvedProduct?.hasVariants ?? p.hasVariants });
    const hasBasePrice = priceValue != null || salePriceValue != null;
    return {
      description: p.name,
      id: p._id,
      image: p.image ?? undefined,
      name: p.name,
      price: !hasBasePrice && saleMode === 'cart' ? undefined : priceDisplay.label,
      originalPrice: priceDisplay.comparePrice
        ? getHomeComponentPriceLabel({ saleMode: 'cart', price: priceDisplay.comparePrice }).label
        : undefined,
    };
  }), [selectedProducts, saleMode]);

  const autoProductPreviewItems: ProductListPreviewItem[] = useMemo(() => {
    const source = resolvedProductsData ?? productsData;
    if (!source) {return [];} 
    return source
      .filter(product => product.status === 'Active')
      .slice(0, itemCount)
      .map(product => {
        const priceDisplay = getHomeComponentPriceLabel({ saleMode, price: product.price ?? undefined, salePrice: product.salePrice ?? undefined, isRangeFromVariant: product.hasVariants });
        const hasBasePrice = product.price != null || product.salePrice != null;
        return {
          description: product.name,
          id: product._id,
          image: product.image ?? undefined,
          name: product.name,
          price: !hasBasePrice && saleMode === 'cart' ? undefined : priceDisplay.label,
          originalPrice: priceDisplay.comparePrice
            ? getHomeComponentPriceLabel({ saleMode: 'cart', price: priceDisplay.comparePrice }).label
            : undefined,
        };
      });
  }, [productsData, resolvedProductsData, itemCount, saleMode]);

  const resolvedCustomSecondary = resolveSecondaryByMode(customState.mode, customState.primary, customState.secondary);

  useEffect(() => {
    if (!component || !initialSnapshot) {return;}
    const snapshot = JSON.stringify({
      title,
      active,
      itemCount,
      sortBy,
      selectionMode,
      selectedProductIds: selectionMode === 'manual' ? selectedProductIds : [],
      demoProducts: selectionMode === 'demo' ? demoProducts : [],
      style,
      subTitle,
      sectionTitle,
      categoryTabIds,
      hideHeader,
      showTitle: showTitleHeader,
      showSubtitle,
      headerAlign,
      titleColorPrimary,
      subtitleAboveTitle,
      uppercaseText,
      showBadge,
      desktopColumns,
    });
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
    setHasChanges(snapshot !== initialSnapshot || customChanged || customFontChanged);
  }, [
    title,
    active,
    itemCount,
    sortBy,
    selectionMode,
    selectedProductIds,
    style,
    subTitle,
    sectionTitle,
    categoryTabIds,
    component,
    initialSnapshot,
    customState,
    initialCustom,
    showCustomBlock,
    customFontState,
    initialFontCustom,
    showFontCustomBlock,
    resolvedCustomSecondary,
    demoProducts,
    hideHeader,
    showTitleHeader,
    showSubtitle,
    headerAlign,
    titleColorPrimary,
    subtitleAboveTitle,
    uppercaseText,
    showBadge,
    desktopColumns,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !hasChanges) {return;}

    setIsSubmitting(true);
    try {
      const savedSelectedProductIds = selectionMode === 'manual' ? selectedProductIds : [];
      await updateMutation({
        active,
        config: {
          itemCount,
          sectionTitle,
          selectedProductIds: savedSelectedProductIds,
          demoProducts: selectionMode === 'demo' ? demoProducts : undefined,
          selectionMode,
          sortBy,
          style,
          subTitle,
          // Header config fields
          hideHeader,
          showTitle: showTitleHeader,
          showSubtitle,
          subtitle: sectionTitle,
          headerAlign,
          titleColorPrimary,
          subtitleAboveTitle,
          uppercaseText,
          showBadge,
          badgeText: subTitle,
          // Category tabs
          showCategoryTabs: true,
          categoryTabIds,
          desktopColumns,
        },
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
      toast.success('Đã cập nhật Catalog sản phẩm');
      setInitialSnapshot(JSON.stringify({
        title,
        active,
        itemCount,
        sortBy,
        selectionMode,
        selectedProductIds: savedSelectedProductIds,
        demoProducts: selectionMode === 'demo' ? demoProducts : [],
        style,
        subTitle,
        sectionTitle,
        categoryTabIds,
        hideHeader,
        showTitle: showTitleHeader,
        showSubtitle,
        headerAlign,
        titleColorPrimary,
        subtitleAboveTitle,
        uppercaseText,
        showBadge,
        desktopColumns,
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
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Chỉnh sửa Catalog sản phẩm</h1>
        <Link href="/admin/home-components" className="text-sm text-blue-600 hover:underline">Quay lại danh sách</Link>
      </div>

      <form onSubmit={handleSubmit}>
        <HeaderConfigSection
          hideHeader={hideHeader}
          title={title}
          showTitle={showTitleHeader}
          subtitle={sectionTitle}
          showSubtitle={showSubtitle}
          headerAlign={headerAlign}
          titleColorPrimary={titleColorPrimary}
          subtitleAboveTitle={subtitleAboveTitle}
          uppercaseText={uppercaseText}
          showBadge={showBadge}
          badgeText={subTitle}
          onHideHeaderChange={setHideHeader}
          onTitleChange={setTitle}
          onShowTitleChange={setShowTitleHeader}
          onSubtitleChange={setSectionTitle}
          onShowSubtitleChange={setShowSubtitle}
          onHeaderAlignChange={setHeaderAlign}
          onTitleColorPrimaryChange={setTitleColorPrimary}
          onSubtitleAboveTitleChange={setSubtitleAboveTitle}
          onUppercaseTextChange={setUppercaseText}
          onShowBadgeChange={setShowBadge}
          onBadgeTextChange={setSubTitle}
          expanded={headerExpanded}
          onExpandedChange={setHeaderExpanded}
          titleLabel="Tiêu đề section"
          titlePlaceholder="VD: Sản phẩm nổi bật, Bán chạy nhất..."
        />

        <ProductGridForm
          itemCount={itemCount}
          setItemCount={setItemCount}
          sortBy={sortBy}
          setSortBy={setSortBy}
          selectionMode={selectionMode}
          setSelectionMode={setSelectionMode}
          selectedProductIds={selectedProductIds}
          setSelectedProductIds={setSelectedProductIds}
          productSearchTerm={productSearchTerm}
          setProductSearchTerm={setProductSearchTerm}
          selectedProducts={selectedProducts}
          filteredProducts={filteredProducts}
          isLoading={productsData === undefined}
          demoProducts={demoProducts}
          setDemoProducts={setDemoProducts}
          categoryTabIds={categoryTabIds}
          setCategoryTabIds={setCategoryTabIds}
          allCategories={allCategories}
          desktopColumns={desktopColumns}
          onDesktopColumnsChange={setDesktopColumns}
          defaultExpanded={false}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,420px] gap-6">
          <div></div>
          <div className="lg:sticky lg:top-6 lg:self-start space-y-4">
            {showCustomBlock && (
              <TypeColorOverrideCard
                title="Màu custom cho Catalog"
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
                title="Font custom cho Catalog"
                enabled={customFontState.enabled}
                fontKey={customFontState.fontKey}
                compact
                toggleLabel="Custom"
                fontLabel="Font"
                onEnabledChange={(next) => setCustomFontState((prev) => ({ ...prev, enabled: next }))}
                onFontChange={(next) => setCustomFontState((prev) => ({ ...prev, fontKey: next }))}
              />
            )}
            <ProductGridPreview
              brandColor={effectiveColors.primary}
              secondary={effectiveColors.secondary}
              itemCount={selectionMode === 'demo' ? demoProducts.length : (selectionMode === 'manual' ? selectedProductIds.length : itemCount)}
              selectedStyle={style}
              onStyleChange={setStyle}
              items={
                selectionMode === 'demo' && demoProducts.length > 0
                  ? demoProducts.map(d => ({ id: d.id, name: d.name, image: d.image, price: d.price, originalPrice: d.originalPrice, category: d.category, tag: d.tag || undefined }))
                  : selectionMode === 'manual' && productPreviewItems.length > 0
                    ? productPreviewItems
                    : (autoProductPreviewItems.length > 0 ? autoProductPreviewItems : undefined)
              }
              subTitle={subTitle}
              sectionTitle={title}
              subtitle={sectionTitle}
              fontStyle={fontStyle}
              fontClassName="font-active"
              categoryTabs={
                selectionMode === 'demo'
                  ? [...new Set(demoProducts.map(d => d.category).filter(Boolean))].slice(0, 5).map(name => ({ _id: name, name, active: true } as import('../../_components/ProductGridForm').CategoryTabItem))
                  : allCategories
                    ? (categoryTabIds.length > 0
                        ? categoryTabIds.map(cId => allCategories.find(c => c._id === cId)).filter(Boolean) as import('../../_components/ProductGridForm').CategoryTabItem[]
                        : allCategories.filter(c => c.active))
                    : undefined
              }
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
