'use client';

import React from 'react';
import { ChevronDown, Film, FileText, MousePointerClick, Settings2 } from 'lucide-react';
import { Card, CardContent, Input, Label, cn } from '@/app/admin/components/ui';
import { ImageFieldWithUpload } from '@/app/admin/components/ImageFieldWithUpload';
import { VIDEO_STYLES_WITH_CTA, TEXT_FIELDS, DEFAULT_TEXTS } from '../_lib/constants';
import { getVideoInfo } from '../_lib/colors';
import type { VideoConfig, VideoStyle } from '../_types';
import { AiVideoImport } from './AiVideoImport';

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface VideoFormProps {
  config: VideoConfig;
  onChange: (next: VideoConfig) => void;
  selectedStyle: VideoStyle;
  /** create = mở hết, edit = đóng hết */
  defaultExpanded?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Collapsible sub-section                                            */
/* ------------------------------------------------------------------ */

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
    <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <Icon size={15} className="text-slate-400 shrink-0" />
        <span className="flex-1 text-left">{title}</span>
        <ChevronDown
          size={15}
          className={cn(
            'text-slate-400 transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>
      {open && (
        <div className="p-3 space-y-3 bg-white dark:bg-slate-900">
          {children}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main form                                                          */
/* ------------------------------------------------------------------ */

export function VideoForm({
  config,
  onChange,
  selectedStyle,
  defaultExpanded = true,
}: VideoFormProps) {
  const videoType = getVideoInfo(config.videoUrl || '').type;
  const showCTAConfig = VIDEO_STYLES_WITH_CTA.includes(selectedStyle);

  const textFields = TEXT_FIELDS[selectedStyle] || [];
  const defaultTexts = DEFAULT_TEXTS[selectedStyle] || {};
  const currentTexts = config.texts || {};

  const getTextValue = (key: string) => currentTexts[key] || defaultTexts[key] || '';

  const updateTextValue = (key: string, value: string) => {
    onChange({
      ...config,
      texts: { ...currentTexts, [key]: value },
    });
  };

  const patch = (partial: Partial<VideoConfig>) => onChange({ ...config, ...partial });

  return (
    <Card className="mb-6">
      <CardContent className="p-4 space-y-3">
        {/* ── AI Import ─ */}
        <div className="flex justify-end">
          <AiVideoImport onApply={(patch) => onChange({ ...config, ...patch })} />
        </div>
        {/* ── Video & Thumbnail ────────────────────── */}
        <SubSection icon={Film} title="Video & ảnh bìa" defaultOpen={defaultExpanded}>
          <div className="space-y-1.5">
            <Label>URL Video <span className="text-red-500">*</span></Label>
            <Input
              type="url"
              value={config.videoUrl || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => patch({ videoUrl: e.target.value })}
              placeholder="YouTube, Vimeo, Drive hoặc link trực tiếp"
              required
            />
            {config.videoUrl?.trim() ? (
              <p className="text-[11px] text-slate-400">
                Loại: <span className="font-medium capitalize">{videoType}</span>
              </p>
            ) : null}
          </div>

          <ImageFieldWithUpload
            label="Ảnh bìa"
            value={config.thumbnailUrl || ''}
            onChange={(thumbnailUrl) => patch({ thumbnailUrl })}
            folder="video-thumbnails"
            aspectRatio="video"
            quality={0.85}
            placeholder="Trống = tự lấy từ YouTube"
          />

          {/* Playback options — inline grid */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {([
              { key: 'autoplay' as const, label: 'Tự phát', checked: config.autoplay === true },
              { key: 'loop' as const, label: 'Lặp lại', checked: config.loop === true },
              { key: 'muted' as const, label: 'Tắt tiếng', checked: config.muted !== false },
            ] as const).map(({ key, label, checked }) => (
              <label key={key} className="flex items-center gap-1.5 cursor-pointer text-sm text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => patch({ [key]: e.target.checked })}
                  className="w-3.5 h-3.5 rounded"
                />
                {label}
              </label>
            ))}
          </div>
        </SubSection>

        {/* ── Nội dung ─────────────────────────────── */}
        <SubSection icon={FileText} title="Nội dung" defaultOpen={defaultExpanded}>
          {/* Heading + Description (legacy / fallback) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Tiêu đề</Label>
              <Input
                value={config.heading || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => patch({ heading: e.target.value })}
                placeholder="Tiêu đề video section"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Mô tả ngắn</Label>
              <Input
                value={config.description || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => patch({ description: e.target.value })}
                placeholder="Mô tả cho video..."
              />
            </div>
          </div>

          {/* Dynamic text fields per style — chỉ hiện nếu khác heading/description */}
          {textFields.filter((f) => f.key !== 'heading' && f.key !== 'description').length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {textFields
                .filter((f) => f.key !== 'heading' && f.key !== 'description')
                .map((field) => (
                  <div key={field.key} className="space-y-1.5">
                    <Label>{field.label}</Label>
                    <Input
                      value={getTextValue(field.key)}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateTextValue(field.key, e.target.value)}
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}
            </div>
          )}
        </SubSection>

        {/* ── CTA & Badge (chỉ styles hỗ trợ) ───── */}
        {showCTAConfig && (
          <SubSection icon={MousePointerClick} title="CTA & Badge" defaultOpen={defaultExpanded}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>Badge</Label>
                <Input
                  value={config.badge || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => patch({ badge: e.target.value })}
                  placeholder="VD: Video mới"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Nút CTA</Label>
                <Input
                  value={config.buttonText || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => patch({ buttonText: e.target.value })}
                  placeholder="VD: Xem ngay"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Link CTA</Label>
                <Input
                  value={config.buttonLink || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => patch({ buttonLink: e.target.value })}
                  placeholder="/lien-he hoặc https://..."
                />
              </div>
            </div>
          </SubSection>
        )}

        {/* ── Tùy chọn nâng cao ──────────────────── */}
        <SubSection icon={Settings2} title="Tùy chọn nâng cao" defaultOpen={false}>
          <p className="text-xs text-slate-400">
            Các text field theo style ({selectedStyle}) — dùng khi cần ghi đè nội dung mặc định.
          </p>
          {textFields.map((field) => (
            <div key={`adv-${field.key}`} className="space-y-1.5">
              <Label className="text-xs">{field.label} (override)</Label>
              {field.key === 'description' ? (
                <textarea
                  value={getTextValue(field.key)}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateTextValue(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full min-h-[64px] rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
                />
              ) : (
                <Input
                  value={getTextValue(field.key)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateTextValue(field.key, e.target.value)}
                  placeholder={field.placeholder}
                />
              )}
            </div>
          ))}
        </SubSection>
      </CardContent>
    </Card>
  );
}
