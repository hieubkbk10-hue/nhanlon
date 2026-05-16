'use client';

import React, { useMemo, useState } from 'react';
import type { ProductListPreviewItem, ProductListStyle } from '../../product-list/_types';
import { ProductListPreview } from '../../product-list/_components/ProductListPreview';
import type { ProductGridStyle } from '../_types';
import { PRODUCT_GRID_STYLES } from '../_lib/constants';
import type { CategoryTabItem } from './ProductGridForm';

export const ProductGridPreview = ({
  brandColor,
  secondary,
  itemCount,
  selectedStyle,
  onStyleChange,
  items,
  subTitle,
  sectionTitle,
  subtitle,
  fontStyle,
  fontClassName,
  categoryTabs,
  // Header config pass-through
  hideHeader,
  showTitle,
  showSubtitle,
  headerAlign,
  titleColorPrimary,
  subtitleAboveTitle,
  uppercaseText,
  showBadge,
}: {
  brandColor: string;
  secondary: string;
  itemCount: number;
  selectedStyle?: ProductGridStyle;
  onStyleChange?: (style: ProductGridStyle) => void;
  items?: ProductListPreviewItem[];
  subTitle?: string;
  sectionTitle?: string;
  subtitle?: string;
  fontStyle?: React.CSSProperties;
  fontClassName?: string;
  categoryTabs?: CategoryTabItem[];
  // Header config
  hideHeader?: boolean;
  showTitle?: boolean;
  showSubtitle?: boolean;
  headerAlign?: 'left' | 'center' | 'right';
  titleColorPrimary?: boolean;
  subtitleAboveTitle?: boolean;
  uppercaseText?: boolean;
  showBadge?: boolean;
}) => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const hasTabs = categoryTabs && categoryTabs.length > 0;
  const isMinimalStyle = (selectedStyle ?? 'commerce') === 'minimal';

  // Filter items by active tab (match by category name or _id)
  const filteredItems = useMemo(() => {
    if (!items || !activeTab) return items;
    return items.filter(item => item.category === activeTab);
  }, [items, activeTab]);

  // Pill tabs — for non-minimal layouts
  const pillTabsSlot = hasTabs ? (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide mb-6 md:mb-8 -mx-1 px-1">
      <button
        type="button"
        onClick={() => setActiveTab(null)}
        className="shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all whitespace-nowrap"
        style={
          activeTab === null
            ? { backgroundColor: brandColor, color: '#fff', borderColor: brandColor }
            : { backgroundColor: 'transparent', color: brandColor, borderColor: `${brandColor}40` }
        }
      >
        Tất cả
      </button>
      {categoryTabs.map(tab => (
        <button
          key={tab._id}
          type="button"
          onClick={() => setActiveTab(tab._id === activeTab ? null : tab._id)}
          className="shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all whitespace-nowrap"
          style={
            activeTab === tab._id
              ? { backgroundColor: brandColor, color: '#fff', borderColor: brandColor }
              : { backgroundColor: 'transparent', color: brandColor, borderColor: `${brandColor}40` }
          }
        >
          {tab.name}
        </button>
      ))}
    </div>
  ) : undefined;

  // Text+underline tabs — for minimal/E-commerce (inline with header right)
  const minimalTabsSlot = hasTabs ? (
    <div className="flex gap-5 overflow-x-auto pb-1 scrollbar-hide shrink-0">
      {categoryTabs.map(tab => (
        <button
          key={tab._id}
          type="button"
          onClick={() => setActiveTab(tab._id === activeTab ? null : tab._id)}
          className="shrink-0 pb-1.5 text-sm font-semibold uppercase tracking-wide transition-all whitespace-nowrap border-b-2"
          style={
            activeTab === tab._id
              ? { color: brandColor, borderColor: brandColor }
              : { color: '#64748b', borderColor: 'transparent' }
          }
        >
          {tab.name}
        </button>
      ))}
    </div>
  ) : undefined;

  return (
    <ProductListPreview
      brandColor={brandColor}
      secondary={secondary}
      itemCount={itemCount}
      componentType="ProductGrid"
      selectedStyle={(selectedStyle ?? 'commerce') as ProductListStyle}
      onStyleChange={(s) => {
        onStyleChange?.(s as ProductGridStyle);
      }}
      styles={PRODUCT_GRID_STYLES as { id: string; label: string }[]}
      items={filteredItems}
      subTitle={subTitle}
      sectionTitle={sectionTitle}
      subtitle={subtitle}
      fontStyle={fontStyle}
      fontClassName={fontClassName}
      hideHeader={hideHeader}
      showTitle={showTitle}
      showSubtitle={showSubtitle}
      headerAlign={headerAlign}
      titleColorPrimary={titleColorPrimary}
      subtitleAboveTitle={subtitleAboveTitle}
      uppercaseText={uppercaseText}
      showBadge={showBadge}
      categoryTabsSlot={isMinimalStyle ? undefined : pillTabsSlot}
      headerRightSlot={isMinimalStyle ? minimalTabsSlot : undefined}
    />
  );
};
