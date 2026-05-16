'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { Input, cn } from '../../../components/ui';

export interface IconOption {
  value: string;
  label: string;
  Icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
}

interface IconPopoverPickerProps {
  value: string;
  onChange: (value: string) => void;
  options: IconOption[];
  brandColor?: string;
  /** Compact mode: smaller trigger button */
  compact?: boolean;
}

/**
 * Shared Popover Grid Icon Picker.
 * Displays a trigger button showing the current icon, clicking opens
 * a floating popover with search + grid of icons.
 */
export function IconPopoverPicker({ value, onChange, options, brandColor = '#3b82f6', compact }: IconPopoverPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  useEffect(() => {
    if (open) setQuery('');
  }, [open]);

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return options;
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(keyword) || opt.value.toLowerCase().includes(keyword),
    );
  }, [options, query]);

  const selected = options.find((opt) => opt.value === value);
  const SelectedIcon = selected?.Icon;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center justify-between gap-2 rounded-md border border-input bg-background text-left text-sm transition-colors hover:bg-slate-50',
          compact ? 'h-8 px-2' : 'h-10 w-full px-3',
        )}
      >
        <span className="flex min-w-0 items-center gap-2">
          {SelectedIcon && <SelectedIcon size={compact ? 14 : 16} style={{ color: brandColor }} />}
          <span className="truncate text-xs">{selected?.label ?? value}</span>
        </span>
        <Search size={12} className="shrink-0 text-slate-400" />
      </button>

      {open && (
        <div
          className="absolute left-0 top-full z-50 mt-1 rounded-lg border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900 animate-in fade-in-0 zoom-in-95"
          style={{ width: '320px' }}
        >
          {/* Search */}
          <div className="border-b border-slate-200 p-2 dark:border-slate-700">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm icon..."
                className="h-8 pl-9 text-xs"
                autoFocus
              />
            </div>
          </div>

          {/* Grid */}
          <div className="grid max-h-60 grid-cols-5 gap-1 overflow-y-auto p-2">
            {filtered.map((opt) => {
              const isActive = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  className={cn(
                    'flex flex-col items-center gap-0.5 rounded-md border px-1 py-1.5 text-center transition-all hover:bg-blue-50 hover:scale-105',
                    isActive
                      ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/30'
                      : 'border-slate-100 dark:border-slate-700 hover:border-blue-200',
                  )}
                  title={opt.label}
                >
                  <span className="flex h-6 w-6 items-center justify-center">
                    <opt.Icon size={16} style={{ color: isActive ? brandColor : undefined }} className={isActive ? '' : 'text-slate-600 dark:text-slate-300'} />
                  </span>
                  <span className="w-full truncate text-[9px] leading-tight">{opt.label}</span>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="col-span-5 rounded-md border border-dashed border-slate-200 px-3 py-4 text-center text-xs text-slate-500">
                Không tìm thấy
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
