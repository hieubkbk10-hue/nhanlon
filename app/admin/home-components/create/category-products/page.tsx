'use client';

import React, { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ComponentFormWrapper, useComponentForm } from '../shared';
import { useTypeColorOverrideState } from '../../_shared/hooks/useTypeColorOverride';
import { useTypeFontOverrideState } from '../../_shared/hooks/useTypeFontOverride';
import { CategoryProductsForm } from '../../category-products/_components/CategoryProductsForm';
import { CategoryProductsPreview } from '../../category-products/_components/CategoryProductsPreview';
import { DEFAULT_DEMO_CATEGORY_PRODUCTS_SECTIONS } from '../../category-products/_lib/constants';
import type {
  CategoryProductsBrandMode,
  CategoryProductsSection,
  CategoryProductsSelectionMode,
  CategoryProductsStyle,
  DemoCategoryProductsSection,
} from '../../category-products/_types';

export default function CategoryProductsCreatePage() {
  const COMPONENT_TYPE = 'CategoryProducts';
  const { title, setTitle, active, setActive, handleSubmit, isSubmitting } = useComponentForm('Sản phẩm theo danh mục', COMPONENT_TYPE);
  const { customState, effectiveColors, showCustomBlock, setCustomState, systemColors } = useTypeColorOverrideState(COMPONENT_TYPE, { seedCustomFromSettingsWhenTypeEmpty: true });
  const { customState: customFontState, effectiveFont, showCustomBlock: showFontCustomBlock, setCustomState: setCustomFontState } = useTypeFontOverrideState(COMPONENT_TYPE, { seedCustomFromSettingsWhenTypeEmpty: true });
  const { primary, secondary, mode } = effectiveColors;
  const fontStyle = { '--font-active': `var(${effectiveFont.fontVariable})` } as React.CSSProperties;
  const brandMode: CategoryProductsBrandMode = mode === 'single' ? 'single' : 'dual';
  
  const categoriesData = useQuery(api.productCategories.listActive);
  const productsData = useQuery(api.products.listPublicResolved, { limit: 100 });
  
  const [sections, setSections] = useState<CategoryProductsSection[]>([]);
  const [selectionMode, setSelectionMode] = useState<CategoryProductsSelectionMode>('demo');
  const [demoSections, setDemoSections] = useState<DemoCategoryProductsSection[]>(DEFAULT_DEMO_CATEGORY_PRODUCTS_SECTIONS);
  const [style, setStyle] = useState<CategoryProductsStyle>('grid');
  const [showViewAll, setShowViewAll] = useState(true);
  const [columnsDesktop, setColumnsDesktop] = useState(4);
  const [columnsMobile, setColumnsMobile] = useState(2);

  const onSubmit = (e: React.FormEvent) => {
    void handleSubmit(e, {
      columnsDesktop,
      columnsMobile,
      demoSections: selectionMode === 'demo' ? demoSections : undefined,
      sections: sections.map(s => ({
        categoryId: s.categoryId, 
        itemCount: s.itemCount,
      })),
      selectionMode,
      showViewAll,
      style,
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
    >
      <CategoryProductsForm
        sections={sections}
        setSections={setSections}
        columnsDesktop={columnsDesktop}
        setColumnsDesktop={setColumnsDesktop}
        columnsMobile={columnsMobile}
        setColumnsMobile={setColumnsMobile}
        showViewAll={showViewAll}
        setShowViewAll={setShowViewAll}
        categoriesData={availableCategories}
        selectionMode={selectionMode}
        setSelectionMode={setSelectionMode}
        demoSections={demoSections}
        setDemoSections={setDemoSections}
      />

      <CategoryProductsPreview
        config={{
          columnsDesktop,
          columnsMobile,
          demoSections,
          sections,
          selectionMode,
          showViewAll,
          style,
        }}
        brandColor={primary}
        secondary={secondary}
        mode={brandMode}
        selectedStyle={style}
        onStyleChange={setStyle}
        categoriesData={availableCategories}
        productsData={productsData ?? []}
        fontStyle={fontStyle}
        fontClassName="font-active"
      />
    </ComponentFormWrapper>
  );
}
