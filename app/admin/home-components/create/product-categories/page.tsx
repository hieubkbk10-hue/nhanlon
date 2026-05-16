'use client';

import React, { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ComponentFormWrapper, useComponentForm } from '../shared';
import { ProductCategoriesForm } from '../../product-categories/_components/ProductCategoriesForm';
import { ProductCategoriesPreview } from '../../product-categories/_components/ProductCategoriesPreview';
import type { DemoProductCategoryItem, ProductCategoriesAlign, ProductCategoriesBrandMode, ProductCategoriesSelectionMode, ProductCategoriesStyle } from '../../product-categories/_types';
import { HeaderConfigSection } from '../../_shared/components/HeaderConfigSection';
import { useProductCategoriesAutoGenerate } from '../../product-categories/_lib/useProductCategoriesAutoGenerate';
import { useTypeColorOverrideState } from '../../_shared/hooks/useTypeColorOverride';
import { useTypeFontOverrideState } from '../../_shared/hooks/useTypeFontOverride';
import { sanitizeDemoCategories } from '../../product-categories/_lib/imageSrc';

interface CategoryItem {
  id: number;
  categoryId: string;
  customImage?: string;
  imageMode?: 'product-image' | 'default' | 'icon' | 'upload' | 'url';
}

export default function ProductCategoriesCreatePage() {
  const COMPONENT_TYPE = 'ProductCategories';
  const { title, setTitle, active, setActive, handleSubmit, isSubmitting } = useComponentForm('Danh mục sản phẩm', COMPONENT_TYPE);
  const { customState, effectiveColors, showCustomBlock, setCustomState, systemColors } = useTypeColorOverrideState(COMPONENT_TYPE, { seedCustomFromSettingsWhenTypeEmpty: true });
  const { customState: customFontState, effectiveFont, showCustomBlock: showFontCustomBlock, setCustomState: setCustomFontState } = useTypeFontOverrideState(COMPONENT_TYPE, { seedCustomFromSettingsWhenTypeEmpty: true });
  const { primary, secondary, mode } = effectiveColors;
  const brandMode: ProductCategoriesBrandMode = mode === 'single' ? 'single' : 'dual';
  const fontStyle = { '--font-active': `var(${effectiveFont.fontVariable})` } as React.CSSProperties;

  const categoriesData = useQuery(api.productCategories.listActive);
  const {
    isAutoGenerateLoading,
    isAutoGenerateReady,
    generateFromRealData,
  } = useProductCategoriesAutoGenerate();
  
  const [selectedCategories, setSelectedCategories] = useState<CategoryItem[]>([]);
  const [style, setStyle] = useState<ProductCategoriesStyle>('grid');
  const [showProductCount, setShowProductCount] = useState(true);
  const [expandedSections, setExpandedSections] = useState({ header: true });
  const [hideHeader, setHideHeader] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const [subtitle, setSubtitle] = useState('');
  const [showSubtitle, setShowSubtitle] = useState(true);
  const [headerAlign, setHeaderAlign] = useState<ProductCategoriesAlign>('center');
  const [titleColorPrimary, setTitleColorPrimary] = useState(false);
  const [subtitleAboveTitle, setSubtitleAboveTitle] = useState(false);
  const [uppercaseText, setUppercaseText] = useState(false);
  const [showBadge, setShowBadge] = useState(true);
  const [badgeText, setBadgeText] = useState('');
  const [selectionMode, setSelectionMode] = useState<ProductCategoriesSelectionMode>('real');
  const [demoCategories, setDemoCategories] = useState<DemoProductCategoryItem[]>([]);

  const handleAutoGenerate = () => {
    const result = generateFromRealData();
    if (result.status === 'success') {
      setSelectedCategories(result.items);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    void handleSubmit(e, {
      selectionMode,
      categories: selectionMode === 'real' ? selectedCategories.map(c => ({ 
        categoryId: c.categoryId, 
        customImage: c.customImage,
        imageMode: c.imageMode ?? 'default',
      })) : [],
      demoCategories: selectionMode === 'demo' ? sanitizeDemoCategories(demoCategories) : [],
      showProductCount,
      style,
      hideHeader,
      showTitle,
      subtitle: subtitle.trim(),
      showSubtitle,
      headerAlign,
      titleColorPrimary,
      subtitleAboveTitle,
      uppercaseText,
      showBadge,
      badgeText: badgeText.trim(),
      subheading: subtitle.trim(),
      align: headerAlign,
    });
  };

  const availableCategories = categoriesData ?? [];

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

      <ProductCategoriesForm
        productCategoriesItems={selectedCategories}
        setProductCategoriesItems={setSelectedCategories}
        productCategoriesShowCount={showProductCount}
        setProductCategoriesShowCount={setShowProductCount}
        onAutoGenerate={handleAutoGenerate}
        autoGenerateReady={isAutoGenerateReady}
        autoGenerateLoading={isAutoGenerateLoading}
        productCategoriesData={availableCategories}
        brandColor={primary}
        selectionMode={selectionMode}
        onSelectionModeChange={setSelectionMode}
        demoCategories={demoCategories}
        setDemoCategories={setDemoCategories}
      />

      <ProductCategoriesPreview 
        config={{
          categories: selectedCategories,
          showProductCount,
          style,
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
          subheading: subtitle,
          align: headerAlign,
        }}
        title={title}
        brandColor={primary}
        secondary={secondary}
        mode={brandMode}
        selectedStyle={style}
        onStyleChange={setStyle}
        categoriesData={availableCategories}
        fontStyle={fontStyle}
        fontClassName="font-active"
        selectionMode={selectionMode}
        demoCategories={demoCategories}
      />
    </ComponentFormWrapper>
  );
}
