'use client';

import React from 'react';
import { Bell, ChevronDown, Clock, Image as ImageIcon, MousePointerClick, Search, Type, icons } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Input, Label, cn } from '../../../components/ui';
import { SettingsImageUploader } from '../../../components/SettingsImageUploader';
import { AVAILABLE_SERVICE_ICONS } from '../../services/_lib/constants';
import { AiPopupImport } from './AiPopupImport';
import type { PopupConfig, PopupCornerRadius, PopupFrequency, PopupTrigger } from '../_types';

interface PopupFormProps {
  config: PopupConfig;
  onChange: (config: PopupConfig) => void;
  defaultExpanded?: boolean;
}

const updateConfig = <K extends keyof PopupConfig>(
  config: PopupConfig,
  onChange: (config: PopupConfig) => void,
  key: K,
  value: PopupConfig[K],
) => {
  onChange({ ...config, [key]: value });
};

const frequencyOptions: Array<{ value: PopupFrequency; label: string }> = [
  { value: 'always', label: 'Luôn hiện' },
  { value: 'oncePerPageView', label: 'Một lần / lượt mở trang' },
  { value: 'oncePerSession', label: 'Một lần / phiên tab' },
  { value: 'oncePerDevice', label: 'Một lần / thiết bị' },
];

const cornerRadiusOptions: Array<{ value: PopupCornerRadius; label: string }> = [
  { value: 'none', label: 'Bỏ bo góc' },
  { value: 'sm', label: 'Bo góc ít' },
  { value: 'lg', label: 'Bo góc nhiều' },
];

const IconFallback = icons.Bell;
const iconOptions = AVAILABLE_SERVICE_ICONS.map((icon) => ({ label: icon, value: icon }));
const getIconComponent = (iconName: string) => icons[iconName as keyof typeof icons] || IconFallback;

function SubSection({
  icon: Icon,
  title,
  defaultOpen = true,
  children,
}: {
  icon: React.ElementType;
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <div className="overflow-visible rounded-lg border border-slate-200 dark:border-slate-700">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center gap-2 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        <Icon size={15} className="shrink-0 text-slate-400" />
        <span className="flex-1 text-left">{title}</span>
        <ChevronDown size={15} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="space-y-3 bg-white p-3 dark:bg-slate-900">{children}</div>}
    </div>
  );
}

function IconCombobox({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!isOpen) {return;}
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const filtered = React.useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {return iconOptions;}
    return iconOptions.filter((option) => option.label.toLowerCase().includes(normalized));
  }, [query]);

  const selectedValue = iconOptions.find((option) => option.value === value)?.value ?? 'Bell';
  const SelectedIcon = getIconComponent(selectedValue);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-10 w-full items-center justify-between gap-2 rounded-md border border-slate-200 bg-white px-3 text-left text-sm dark:border-slate-700 dark:bg-slate-900"
      >
        <span className="flex min-w-0 items-center gap-2">
          <SelectedIcon size={16} />
          <span className="truncate">{selectedValue}</span>
        </span>
        <Search size={14} className="text-slate-400" />
      </button>
      {isOpen && (
        <div className="absolute left-0 top-full z-[9999] mt-2 w-[420px] max-w-[calc(100vw-3rem)] rounded-md border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 p-2 dark:border-slate-800">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm icon..." className="h-9 pl-9" />
            </div>
          </div>
          <div className="grid max-h-72 grid-cols-5 gap-1.5 overflow-y-auto p-2">
            {filtered.map((option) => {
              const IconComponent = getIconComponent(option.value);
              const selected = option.value === selectedValue;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setQuery('');
                  }}
                  className={cn(
                    'flex flex-col items-center gap-1 rounded-md border px-1 py-2 text-center text-xs transition-colors',
                    selected
                      ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300'
                      : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800',
                  )}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800">
                    <IconComponent size={15} />
                  </span>
                  <span className="w-full truncate leading-tight">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function PopupForm({ config, onChange, defaultExpanded = true }: PopupFormProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Bell size={18} />
            Cấu hình popup
          </CardTitle>
          <AiPopupImport onApply={(nextConfig) => onChange({ ...config, ...nextConfig })} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <SubSection icon={Type} title="Nội dung" defaultOpen={defaultExpanded}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Badge / Nhãn</Label>
              <Input value={config.eyebrow} onChange={(event) => updateConfig(config, onChange, 'eyebrow', event.target.value)} placeholder="VD: Thông báo" />
            </div>
            <div className="space-y-2">
              <Label>Tiêu đề chính</Label>
              <Input value={config.heading} onChange={(event) => updateConfig(config, onChange, 'heading', event.target.value)} placeholder="Nhập tiêu đề popup" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Phụ đề</Label>
              <textarea
                value={config.description}
                onChange={(event) => updateConfig(config, onChange, 'description', event.target.value)}
                placeholder="Mô tả ngắn gọn..."
                className="min-h-[82px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
            <div className="space-y-2">
              <Label>Ghi chú</Label>
              <textarea
                value={config.note}
                onChange={(event) => updateConfig(config, onChange, 'note', event.target.value)}
                placeholder="Nội dung phụ, điều kiện, cam kết..."
                className="min-h-[82px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700">
              <input type="checkbox" checked={config.showIcon} onChange={(event) => updateConfig(config, onChange, 'showIcon', event.target.checked)} />
              Hiện icon
            </label>
            {config.showIcon && (
              <div className="space-y-2">
                <Label>Icon</Label>
                <IconCombobox value={config.icon} onChange={(icon) => updateConfig(config, onChange, 'icon', icon)} />
              </div>
            )}
            <div className="space-y-2">
              <Label>Bo góc</Label>
              <select
                value={config.cornerRadius}
                onChange={(event) => updateConfig(config, onChange, 'cornerRadius', event.target.value as PopupCornerRadius)}
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                {cornerRadiusOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700">
              <input type="checkbox" checked={config.showDoNotShowToday} onChange={(event) => updateConfig(config, onChange, 'showDoNotShowToday', event.target.checked)} />
              Hiện nút không hiện lại hôm nay
            </label>
            <div className="rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700">
              <div className="mb-2 flex items-center justify-between gap-3">
                <Label className="text-sm">Độ đậm màu</Label>
                <span className="text-xs tabular-nums text-slate-500">{config.colorIntensity}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={config.colorIntensity}
                onChange={(event) => updateConfig(config, onChange, 'colorIntensity', Number(event.target.value))}
                className="h-1.5 w-full cursor-pointer accent-blue-500"
              />
            </div>
          </div>
        </SubSection>

        <SubSection icon={MousePointerClick} title="CTA" defaultOpen={defaultExpanded}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
              <div className="space-y-2">
                <Label>Nút phụ</Label>
                <Input value={config.secondaryButtonText} onChange={(event) => updateConfig(config, onChange, 'secondaryButtonText', event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Link nút phụ</Label>
                <Input value={config.secondaryButtonLink} onChange={(event) => updateConfig(config, onChange, 'secondaryButtonLink', event.target.value)} placeholder="Để trống để đóng popup" />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={config.secondaryButtonDisabled} onChange={(event) => updateConfig(config, onChange, 'secondaryButtonDisabled', event.target.checked)} />
                Vô hiệu hóa click nút phụ
              </label>
            </div>
            <div className="space-y-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
              <div className="space-y-2">
                <Label>Nút chính</Label>
                <Input value={config.primaryButtonText} onChange={(event) => updateConfig(config, onChange, 'primaryButtonText', event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Link nút chính</Label>
                <Input value={config.primaryButtonLink} onChange={(event) => updateConfig(config, onChange, 'primaryButtonLink', event.target.value)} placeholder="Để trống để đóng popup" />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={config.primaryButtonDisabled} onChange={(event) => updateConfig(config, onChange, 'primaryButtonDisabled', event.target.checked)} />
                Vô hiệu hóa click nút chính
              </label>
            </div>
          </div>
        </SubSection>

        <SubSection icon={ImageIcon} title="Ảnh" defaultOpen={defaultExpanded}>
          <SettingsImageUploader
            label="Ảnh popup"
            value={config.imageUrl}
            onChange={(url) => updateConfig(config, onChange, 'imageUrl', url ?? '')}
            folder="home-components/popup"
            naming={{ entityName: config.heading || 'popup', field: 'image', index: 1 }}
            previewSize="md"
          />
        </SubSection>

        <SubSection icon={Clock} title="Hiển thị" defaultOpen={defaultExpanded}>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Thời điểm</Label>
              <select
                value={config.trigger}
                onChange={(event) => updateConfig(config, onChange, 'trigger', event.target.value as PopupTrigger)}
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="immediate">Hiện ngay</option>
                <option value="delay">Hiện sau</option>
              </select>
            </div>
            <div className={config.trigger === 'delay' ? 'space-y-2' : 'space-y-2 opacity-50'}>
              <Label>Thời gian chờ</Label>
              <Input
                type="number"
                min={0}
                max={60}
                value={config.delaySeconds}
                onChange={(event) => updateConfig(config, onChange, 'delaySeconds', Number(event.target.value))}
                disabled={config.trigger !== 'delay'}
              />
            </div>
            <div className="space-y-2">
              <Label>Tần suất</Label>
              <select
                value={config.frequency}
                onChange={(event) => updateConfig(config, onChange, 'frequency', event.target.value as PopupFrequency)}
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                {frequencyOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </SubSection>
      </CardContent>
    </Card>
  );
}
