'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, HelpCircle, Plus } from 'lucide-react';
import { cn } from '../../../components/ui';
import type { PreviewDevice } from '../../_shared/hooks/usePreviewDevice';
import type { FaqStyleTokens } from '../_lib/colors';
import type { FaqConfig, FaqItem, FaqStyle } from '../_types';

interface FaqSectionSharedProps {
  items: FaqItem[];
  title?: string;
  style: FaqStyle;
  config?: FaqConfig;
  tokens: FaqStyleTokens;
  context: 'preview' | 'site';
  maxVisible?: number;
  device?: PreviewDevice;
  suppressInternalHeader?: boolean;
}

const FAQ_FALLBACKS = {
  answer: 'Câu trả lời...',
  question: 'Câu hỏi',
  title: 'Câu hỏi thường gặp',
};

const getValue = (value?: string) => {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : undefined;
};

const getPreviewLimit = (device: PreviewDevice) => {
  if (device === 'mobile') {return 4;}
  if (device === 'tablet') {return 5;}
  return 6;
};

const getOuterShellClassName = (style: FaqStyle, context: 'preview' | 'site', device: PreviewDevice) => {
  const isPreview = context === 'preview';

  if (style === 'cards') {
    return isPreview
      ? (device === 'desktop' ? 'mx-auto max-w-[96%] px-2' : 'mx-auto max-w-[95%] px-1.5')
      : 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8';
  }

  if (style === 'two-column' || style === 'timeline') {
    return isPreview
      ? (device === 'mobile' ? 'mx-auto max-w-[95%] px-1.5' : 'mx-auto max-w-[96%] px-2')
      : 'mx-auto max-w-6xl px-4 sm:px-6 lg:px-8';
  }

  if (style === 'tabbed') {
    return isPreview
      ? (device === 'mobile' ? 'mx-auto max-w-full px-0' : 'mx-auto max-w-[98%] px-1')
      : 'mx-auto max-w-[1320px] px-2 sm:px-4 lg:px-6';
  }

  if (style === 'wine-list') {
    return isPreview
      ? 'mx-auto w-full max-w-[768px] px-0'
      : 'mx-auto w-full max-w-[768px] px-0';
  }

  return isPreview
    ? 'mx-auto max-w-[95%] px-1.5'
    : 'mx-auto max-w-6xl px-4 sm:px-6 lg:px-8';
};

const getGridLayoutClassName = (context: 'preview' | 'site', device: PreviewDevice) => {
  if (context === 'preview') {
    if (device === 'mobile') {return 'grid-cols-1 gap-4';}
    if (device === 'tablet') {return 'grid-cols-2 gap-5';}
    return 'grid-cols-3 gap-5';
  }

  return 'grid-cols-1 @2xl:grid-cols-2 @5xl:grid-cols-3 gap-5 @5xl:gap-8';
};

const getSplitLayoutClassName = (context: 'preview' | 'site', device: PreviewDevice) => {
  if (context === 'preview') {
    if (device === 'desktop') {return 'flex-row gap-10 py-8';}
    return 'flex-col gap-4 py-6';
  }

  return 'flex-col @4xl:flex-row gap-3 @3xl:gap-4 @5xl:gap-16 @6xl:gap-24 py-6 @4xl:py-8 @6xl:py-10';
};

const getSplitQuestionClassName = (context: 'preview' | 'site', device: PreviewDevice) => {
  if (context === 'preview' && device === 'desktop') {return 'w-[32%] shrink-0';}
  return 'w-full @4xl:w-[35%] @6xl:w-[30%] shrink-0';
};

const getSplitAnswerClassName = (context: 'preview' | 'site', device: PreviewDevice) => {
  if (context === 'preview' && device === 'desktop') {return 'w-[68%]';}
  return 'w-full @4xl:w-[65%] @6xl:w-[70%]';
};

const getShowcaseLayoutClassName = (context: 'preview' | 'site', device: PreviewDevice) => {
  if (context === 'preview') {
    if (device === 'desktop') {return 'flex-row gap-8';}
    return 'flex-col gap-6';
  }

  return 'flex-col @4xl:flex-row gap-6 @4xl:gap-10';
};

const getThemeVars = (tokens: FaqStyleTokens) => ({
  '--token-primary': tokens.heading,
  '--token-secondary': tokens.badgeBg,
  '--token-secondary-text': tokens.badgeText,
} as React.CSSProperties);

const SectionHeader = ({
  title,
  subtitle,
  align = 'left',
  className = '',
}: {
  title?: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}) => {
  if (!title && !subtitle) {return null;}
  return (
    <div className={`mb-6 @3xl:mb-10 flex flex-col gap-1.5 @3xl:gap-3 w-full ${align === 'center' ? 'text-center items-center' : 'text-left items-start'} ${className}`}>
      {subtitle ? <span className="text-[var(--token-primary)] font-bold tracking-widest uppercase text-[11px] @3xl:text-sm">{subtitle}</span> : null}
      {title ? <h2 className="text-2xl @3xl:text-[2rem] @5xl:text-[2.5rem] font-bold text-gray-900 text-balance leading-tight">{title}</h2> : null}
    </div>
  );
};

const getFaqQuestion = (item: FaqItem, idx: number) => getValue(item.question) ?? `${FAQ_FALLBACKS.question} ${idx + 1}`;
const getFaqAnswer = (item: FaqItem) => getValue(item.answer) ?? FAQ_FALLBACKS.answer;

export function FaqSectionShared({
  items,
  title,
  style,
  config,
  tokens,
  context,
  maxVisible,
  device = 'desktop',
  suppressInternalHeader = false,
}: FaqSectionSharedProps) {
  const isPreview = context === 'preview';
  const previewLimit = getPreviewLimit(device);
  const displayedItems = React.useMemo(
    () => {
      if (typeof maxVisible === 'number') {return items.slice(0, maxVisible);}
      if (isPreview) {return items.slice(0, previewLimit);}
      return items;
    },
    [isPreview, items, maxVisible, previewLimit],
  );
  const sectionTitle = getValue(title) ?? FAQ_FALLBACKS.title;
  const sectionSubtitle = getValue(config?.description);
  const showInternalHeader = !suppressInternalHeader;
  const themeStyle = getThemeVars(tokens);
  const outerShellClassName = getOuterShellClassName(style, context, device);
  const remainingCount = Math.max(0, items.length - displayedItems.length);
  const [openId, setOpenId] = useState<string | number | null>(style === 'wine-list' ? null : (displayedItems[0]?.id ?? null));
  const [activeIdx, setActiveIdx] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  React.useEffect(() => {
    setOpenId(style === 'wine-list' ? null : (displayedItems[0]?.id ?? null));
    setActiveIdx((current) => (current >= displayedItems.length ? 0 : current));
    setIsDropdownOpen(false);
  }, [displayedItems, style]);

  const activeItem = displayedItems[activeIdx] || displayedItems[0];

  if (items.length === 0) {
    return (
      <section className="px-4 py-8 md:py-10" style={{ backgroundColor: tokens.sectionBg, ...themeStyle }}>
        <div className={outerShellClassName}>
          <div className="mx-auto max-w-3xl rounded-[1.75rem] border px-6 py-10 text-center shadow-sm" style={{ backgroundColor: tokens.panelBg, borderColor: tokens.panelBorder }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: tokens.iconBg }}>
              <HelpCircle size={32} style={{ color: tokens.iconText }} />
            </div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: tokens.heading }}>
              {sectionTitle}
            </h3>
            <p style={{ color: tokens.body }}>Chưa có câu hỏi nào</p>
          </div>
        </div>
      </section>
    );
  }

  const renderRemainingBadge = () => {
    if (remainingCount <= 0) {return null;}

    return (
      <div className="flex items-center justify-center pt-4">
        <span
          className="inline-flex min-h-[32px] items-center rounded-full border px-3.5 py-1.5 text-xs font-semibold"
          style={{
            backgroundColor: tokens.badgeBg,
            borderColor: tokens.badgeBorder,
            color: tokens.badgeText,
          }}
        >
          +{remainingCount} câu hỏi khác
        </span>
      </div>
    );
  };

  if (style === 'accordion') {
    return (
      <section className="px-4 py-8 md:py-10" style={{ backgroundColor: tokens.sectionBg, ...themeStyle }}>
        <div className={outerShellClassName}>
          <div className="w-full rounded-[2rem] border border-gray-200/80 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col overflow-hidden @container">
            {showInternalHeader ? (
              <div className="px-5 py-6 @3xl:px-10 @3xl:py-8 border-b border-gray-100/80 flex flex-col items-center justify-center text-center gap-2 bg-gray-50/30">
                {sectionSubtitle ? <span className="text-[var(--token-primary)] font-bold tracking-widest uppercase text-[11px] @3xl:text-sm">{sectionSubtitle}</span> : null}
                <h3 className="text-xl @2xl:text-2xl @3xl:text-3xl font-bold text-gray-900 text-balance">{sectionTitle}</h3>
              </div>
            ) : null}
            <div className="flex flex-col gap-0 px-5 py-5 @3xl:px-10 @3xl:py-8">
              {displayedItems.map((item, idx) => {
                const isOpen = openId === item.id;
                return (
                  <div key={item.id} className={`flex flex-col ${idx !== 0 ? 'border-t border-gray-100' : ''}`}>
                    <button
                      type="button"
                      onClick={() => { setOpenId((prev) => prev === item.id ? null : item.id); }}
                      className="flex items-center justify-between w-full py-5 text-left gap-4 hover:bg-gray-50/50 transition-colors px-2 @3xl:px-4 rounded-lg -mx-2 @3xl:-mx-4 group"
                    >
                      <div className="flex items-center gap-3 @3xl:gap-4 flex-1">
                        <span className={`font-bold text-[15px] @3xl:text-lg break-words leading-tight transition-colors duration-300 ${isOpen ? 'text-[var(--token-primary)]' : 'text-gray-900'}`}>
                          {getFaqQuestion(item, idx)}
                        </span>
                      </div>
                      <ChevronDown className={`w-5 h-5 @3xl:w-6 @3xl:h-6 text-gray-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[var(--token-primary)]' : ''}`} />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="pb-6 pt-1 @3xl:pl-2 pr-2 @3xl:pr-4">
                            <p className="text-gray-600 text-[15px] @3xl:text-[1.05rem] leading-[1.65] break-words text-pretty">
                              {getFaqAnswer(item)}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
          {renderRemainingBadge()}
        </div>
      </section>
    );
  }

  if (style === 'cards') {
    return (
      <section className="px-4 py-8 md:py-10" style={{ backgroundColor: tokens.sectionBg, ...themeStyle }}>
        <div className={outerShellClassName}>
          <div className="w-full flex flex-col items-center px-4 @container">
            <div className="w-full max-w-7xl">
              {showInternalHeader ? <SectionHeader title={sectionTitle} subtitle={sectionSubtitle} align="center" className="mb-10 @5xl:mb-14" /> : null}
              <div className={cn('grid w-full', getGridLayoutClassName(context, device))}>
                {displayedItems.map((item, idx) => (
                  <div key={item.id} className="bg-white rounded-[1.5rem] p-6 @5xl:p-8 flex flex-col border border-gray-200 shadow-sm relative overflow-hidden h-full drop-shadow-sm">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-[var(--token-primary)] opacity-90" />
                    <h4 className="font-bold text-gray-900 text-[17px] @5xl:text-xl mb-3.5 pt-2 leading-snug">
                      {getFaqQuestion(item, idx)}
                    </h4>
                    <p className="text-gray-600 text-[15px] @5xl:text-[15.5px] leading-[1.65] text-pretty mt-auto">
                      {getFaqAnswer(item)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {renderRemainingBadge()}
        </div>
      </section>
    );
  }

  if (style === 'two-column') {
    return (
      <section className="px-4 py-8 md:py-10" style={{ backgroundColor: tokens.sectionBg, ...themeStyle }}>
        <div className={outerShellClassName}>
          <div className="w-full flex flex-col max-w-[1200px] mx-auto @container">
            <div className="px-2 w-full">
              {showInternalHeader ? <SectionHeader title={sectionTitle} subtitle={sectionSubtitle} align="center" /> : null}
            </div>

            <div className={cn('flex mt-4 px-2', getShowcaseLayoutClassName(context, device))}>
              <div className={cn('w-full shrink-0', context === 'preview' ? (device === 'desktop' ? 'hidden' : 'block') : '@4xl:hidden')}>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => { setIsDropdownOpen((prev) => !prev); }}
                    className="w-full bg-white border border-gray-200 rounded-xl p-4 sm:p-5 flex items-center justify-between gap-4 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--token-primary)]/50 focus:border-[var(--token-primary)]"
                  >
                    <span className="text-[15px] @2xl:text-base font-bold text-gray-900 leading-snug flex-1">
                      {getFaqQuestion(activeItem, activeIdx)}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-gray-500 shrink-0 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden flex flex-col max-h-[60vh] overflow-y-auto"
                      >
                        {displayedItems.map((item, idx) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setActiveIdx(idx);
                              setIsDropdownOpen(false);
                            }}
                            className={`text-left p-4 @2xl:p-5 border-b border-gray-100 last:border-b-0 transition-colors focus:outline-none ${idx === activeIdx ? 'bg-[var(--token-secondary)]' : 'hover:bg-gray-50'}`}
                          >
                            <span className={`text-[14.5px] @2xl:text-[15.5px] leading-snug ${idx === activeIdx ? 'font-bold text-[var(--token-primary)]' : 'font-medium text-gray-700'}`}>
                              {getFaqQuestion(item, idx)}
                            </span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className={cn('flex-col gap-2 shrink-0', context === 'preview' ? (device === 'desktop' ? 'flex w-[40%]' : 'hidden') : 'hidden @4xl:flex w-full @4xl:w-[40%]')}>
                {displayedItems.map((item, idx) => {
                  const isActive = idx === activeIdx;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => { setActiveIdx(idx); }}
                      className={`text-left p-4 rounded-2xl transition-all duration-300 border-2 focus:outline-none flex items-start gap-4 ${
                        isActive
                          ? 'border-[var(--token-primary)] bg-[var(--token-secondary)] scale-[1.02] shadow-sm'
                          : 'border-transparent bg-gray-50 hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      <span className={`font-bold leading-snug transition-colors ${isActive ? 'text-[var(--token-primary)] text-[16px]' : 'text-gray-700 text-[15px]'}`}>
                        {getFaqQuestion(item, idx)}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className={cn('w-full flex items-start', context === 'preview' ? (device === 'desktop' ? 'w-[60%]' : '') : '@4xl:w-[60%]')}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={String(activeItem.id)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-[2rem] p-6 @4xl:p-10 @5xl:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-gray-100/80 w-full relative overflow-hidden h-full flex flex-col justify-center"
                  >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--token-primary)] opacity-5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
                    <h3 className="text-2xl @4xl:text-3xl font-bold text-gray-900 mb-6 leading-tight">
                      {getFaqQuestion(activeItem, activeIdx)}
                    </h3>
                    <p className="text-gray-600 text-lg @4xl:text-[1.1rem] leading-[1.7] text-pretty">
                      {getFaqAnswer(activeItem)}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
          {renderRemainingBadge()}
        </div>
      </section>
    );
  }

  if (style === 'minimal') {
    return (
      <section className="px-4 py-8 md:py-10" style={{ backgroundColor: tokens.sectionBg, ...themeStyle }}>
        <div className={outerShellClassName}>
          <div className="w-full flex flex-col items-center @container">
            {showInternalHeader ? <SectionHeader title={sectionTitle} subtitle={sectionSubtitle} align="center" /> : null}
            <div className="w-full max-w-3xl flex flex-col gap-3">
              {displayedItems.map((item, idx) => {
                const isOpen = openId === item.id;
                return (
                  <div key={item.id} className={`bg-white rounded-2xl border transition-all duration-300 shadow-sm overflow-hidden ${isOpen ? 'border-[var(--token-primary)] ring-1 ring-[var(--token-primary)]/10' : 'border-gray-100 hover:border-gray-300'}`}>
                    <button
                      type="button"
                      onClick={() => { setOpenId((prev) => prev === item.id ? null : item.id); }}
                      className="flex items-center justify-between w-full p-5 @3xl:p-6 text-left gap-4 group focus:outline-none focus-visible:bg-gray-50"
                    >
                      <span className={`font-bold text-[16px] @3xl:text-lg transition-colors ${isOpen ? 'text-[var(--token-primary)]' : 'text-gray-900 group-hover:text-[var(--token-primary)]'}`}>
                        {getFaqQuestion(item, idx)}
                      </span>
                      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${isOpen ? 'bg-[var(--token-primary)] text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-[var(--token-secondary)] group-hover:text-[var(--token-primary)]'}`}>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 @3xl:px-6 pb-6 pt-1">
                            <p className="text-gray-600 text-[15px] @3xl:text-[1.05rem] leading-relaxed text-pretty">
                              {getFaqAnswer(item)}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
          {renderRemainingBadge()}
        </div>
      </section>
    );
  }

  if (style === 'timeline') {
    return (
      <section className="px-4 py-8 md:py-10" style={{ backgroundColor: tokens.sectionBg, ...themeStyle }}>
        <div className={outerShellClassName}>
          <div className="w-full flex flex-col items-center px-2 @3xl:px-4 @container">
            <div className="w-full max-w-6xl">
              {showInternalHeader ? <SectionHeader title={sectionTitle} subtitle={sectionSubtitle} align="left" className="mb-8 @5xl:mb-12" /> : null}
              <div className="flex flex-col border-t border-gray-200">
                {displayedItems.map((item, idx) => (
                  <div key={item.id} className={cn('flex border-b border-gray-200 items-start', getSplitLayoutClassName(context, device))}>
                    <div className={getSplitQuestionClassName(context, device)}>
                      <h4 className="text-[17px] @3xl:text-lg @5xl:text-[1.2rem] font-bold text-gray-900 leading-snug text-pretty pt-1">
                        {getFaqQuestion(item, idx)}
                      </h4>
                    </div>
                    <div className={getSplitAnswerClassName(context, device)}>
                      <p className="text-gray-600 text-[15px] @5xl:text-[1.05rem] leading-[1.75] text-pretty">
                        {getFaqAnswer(item)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {renderRemainingBadge()}
        </div>
      </section>
    );
  }

  if (style === 'wine-list') {
    return (
      <section className="px-0 py-0" style={{ backgroundColor: '#ffffff', ...themeStyle }}>
        <div className={outerShellClassName}>
          {showInternalHeader ? (
            <header className="mb-6 text-center">
              <div className="flex items-center gap-3 text-[#9b2c3b]">
                <span aria-hidden="true" className="h-px flex-1 bg-[#d8c7b4]" />
                <p className="shrink-0 text-sm font-bold uppercase leading-5 tracking-[0.18em] text-[#9b2c3b]">
                  {sectionSubtitle || sectionTitle}
                </p>
                <span aria-hidden="true" className="h-px flex-1 bg-[#d8c7b4]" />
              </div>
            </header>
          ) : null}

          <div>
            {displayedItems.map((item, idx) => {
              const isOpen = openId === item.id;
              const panelId = `faq-panel-${idx}`;

              return (
                <article
                  key={item.id}
                  className={cn(
                    'overflow-hidden rounded-md border border-[#efe7dd] bg-[#faf8f4]',
                    idx !== 0 && 'mt-3'
                  )}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => { setOpenId((prev) => prev === item.id ? null : item.id); }}
                    className="flex w-full cursor-pointer items-start gap-3 bg-transparent px-5 py-4 text-left"
                  >
                    <ChevronDown
                      aria-hidden="true"
                      className={cn(
                        'mt-0.5 h-6 w-6 shrink-0 text-[#7b7b7b] transition-transform',
                        isOpen && 'rotate-180'
                      )}
                    />
                    <span className="text-lg font-medium leading-8 text-[#2c2c2c]">
                      {getFaqQuestion(item, idx)}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pl-[56px]">
                          <p className="text-[15px] leading-[1.7] text-[#5f5f5f]">
                            {getFaqAnswer(item)}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </article>
              );
            })}
          </div>
          {renderRemainingBadge()}
        </div>
      </section>
    );
  }

  return (
    <section className="px-2 py-8 md:px-4 md:py-10" style={{ backgroundColor: tokens.sectionBg, ...themeStyle }}>
      <div className={outerShellClassName}>
        <div className="w-full flex flex-col items-center px-1 md:px-3 @container">
          <div className="w-full max-w-[1280px] bg-white rounded-[1.25rem] p-3 @3xl:rounded-[1.5rem] @3xl:p-6 @4xl:rounded-[2.5rem] @4xl:p-10 @5xl:p-14 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] border border-gray-100">
            {showInternalHeader ? (
              <div className="text-center mb-10 @4xl:mb-16">
                {sectionSubtitle ? (
                  <span className="text-[var(--token-primary)] font-bold tracking-widest uppercase text-xs @4xl:text-sm mb-4 block">
                    {sectionSubtitle}
                  </span>
                ) : null}
                <h2 className="text-3xl @4xl:text-4xl @5xl:text-5xl font-bold tracking-tight text-gray-900 text-balance leading-tight">
                  {sectionTitle}
                </h2>
              </div>
            ) : null}

            <div className="flex flex-col gap-4">
              {displayedItems.map((item, idx) => {
                const isOpen = openId === item.id;
                return (
                  <div
                    key={item.id}
                    className={`transition-all duration-300 rounded-[1.25rem] overflow-hidden ${
                      isOpen ? 'bg-gray-50 border border-gray-100' : 'bg-transparent border border-transparent hover:bg-gray-50/50'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => { setOpenId((prev) => prev === item.id ? null : item.id); }}
                      className="flex items-center justify-between w-full p-5 @4xl:p-6 text-left gap-6 focus:outline-none group"
                    >
                      <span className={`font-bold text-[16px] @4xl:text-xl transition-colors leading-snug ${isOpen ? 'text-[var(--token-primary)]' : 'text-gray-900 group-hover:text-[var(--token-primary)]'}`}>
                        {getFaqQuestion(item, idx)}
                      </span>
                      <div className={`shrink-0 w-8 h-8 @4xl:w-10 @4xl:h-10 rounded-full flex items-center justify-center transition-all duration-300 border ${
                        isOpen
                          ? 'border-[var(--token-primary)] bg-[var(--token-primary)] text-white rotate-45'
                          : 'border-gray-200 text-gray-400 group-hover:border-[var(--token-primary)]/50 group-hover:text-[var(--token-primary)]'
                      }`}>
                        <Plus className="w-4 h-4 @4xl:w-5 @4xl:h-5" />
                      </div>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 @4xl:px-6 pb-6 pt-0">
                            <p className="text-gray-600 text-[15px] @4xl:text-[1.05rem] leading-[1.75] text-pretty">
                              {getFaqAnswer(item)}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {renderRemainingBadge()}
      </div>
    </section>
  );
}
