'use client';

import React, { useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '../../../components/ui';
import { ComponentFormWrapper, useComponentForm } from '../shared';
import { useTypeColorOverrideState } from '../../_shared/hooks/useTypeColorOverride';
import { useTypeFontOverrideState } from '../../_shared/hooks/useTypeFontOverride';
import { CareerPreview } from '../../career/_components/CareerPreview';
import {
  createCareerJob,
  DEFAULT_CAREER_TEXTS,
} from '../../career/_lib/constants';
import { getCareerValidationResult } from '../../career/_lib/colors';
import { normalizeCareerJobs } from '../../career/_lib/normalize';
import type {
  CareerStyle,
  CareerTexts,
  JobPosition,
} from '../../career/_types';
import { AiDemoCareerImport } from '../../product-list/_components/AiDemoProductsImport';

const DEFAULT_CREATE_JOBS: JobPosition[] = [
  createCareerJob({
    id: 'career-job-1',
    title: 'Frontend Developer',
    department: 'Engineering',
    location: 'Hà Nội',
    type: 'Full-time',
    salary: '15-25 triệu',
    description: '',
  }),
  createCareerJob({
    id: 'career-job-2',
    title: 'UI/UX Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
    salary: '12-20 triệu',
    description: '',
  }),
];

export default function CareerCreatePage() {
  const COMPONENT_TYPE = 'Career';
  const { title, setTitle, active, setActive, handleSubmit, isSubmitting } = useComponentForm('Tuyển dụng', COMPONENT_TYPE);
  const { customState, effectiveColors, showCustomBlock, setCustomState, systemColors } = useTypeColorOverrideState(COMPONENT_TYPE, { seedCustomFromSettingsWhenTypeEmpty: true });
  const { customState: customFontState, effectiveFont, showCustomBlock: showFontCustomBlock, setCustomState: setCustomFontState } = useTypeFontOverrideState(COMPONENT_TYPE, { seedCustomFromSettingsWhenTypeEmpty: true });
  const { primary, secondary, mode } = effectiveColors;
  const fontStyle = { '--font-active': `var(${effectiveFont.fontVariable})` } as React.CSSProperties;

  const [careerStyle, setCareerStyle] = useState<CareerStyle>('cards');
  const [jobPositions, setJobPositions] = useState<JobPosition[]>(DEFAULT_CREATE_JOBS);
  const [texts, setTexts] = useState<CareerTexts>(DEFAULT_CAREER_TEXTS);

  const normalizedJobs = useMemo(() => normalizeCareerJobs(jobPositions), [jobPositions]);

  useMemo(() => getCareerValidationResult({
    primary,
    secondary,
    mode,
  }), [primary, secondary, mode]);

  const onSubmit = (event: React.FormEvent) => {
    void handleSubmit(event, {
      jobs: normalizedJobs,
      style: careerStyle,
      texts,
    });
  };

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
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Vị trí tuyển dụng</CardTitle>
          <div className="flex items-center gap-2">
            <AiDemoCareerImport onApply={(items) => setJobPositions(items as JobPosition[])} />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setJobPositions((prev) => [
                  ...prev,
                  createCareerJob({
                    id: `career-job-${Date.now()}-${prev.length}`,
                    type: 'Full-time',
                  }),
                ]);
              }}
              className="gap-2"
            >
              <Plus size={14} /> Thêm vị trí
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {jobPositions.map((job, idx) => (
            <div
              key={normalizedJobs[idx]?.key ?? `${job.id ?? 'career-job'}-${idx}`}
              className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-3"
            >
              <div className="flex items-center justify-between">
                <Label>Vị trí {idx + 1}</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-red-500 h-8 w-8"
                  onClick={() => {
                    setJobPositions((prev) => {
                      if (prev.length <= 1) {return prev;}
                      return prev.filter((_, i) => i !== idx);
                    });
                  }}
                  disabled={jobPositions.length <= 1}
                >
                  <Trash2 size={14} />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Vị trí tuyển dụng"
                  value={job.title}
                  onChange={(e) => {
                    setJobPositions((prev) => prev.map((j, i) => (i === idx ? { ...j, title: e.target.value } : j)));
                  }}
                />
                <Input
                  placeholder="Phòng ban"
                  value={job.department}
                  onChange={(e) => {
                    setJobPositions((prev) => prev.map((j, i) => (i === idx ? { ...j, department: e.target.value } : j)));
                  }}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Input
                  placeholder="Địa điểm"
                  value={job.location}
                  onChange={(e) => {
                    setJobPositions((prev) => prev.map((j, i) => (i === idx ? { ...j, location: e.target.value } : j)));
                  }}
                />
                <select
                  className="h-10 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
                  value={job.type}
                  onChange={(e) => {
                    setJobPositions((prev) => prev.map((j, i) => (i === idx ? { ...j, type: e.target.value } : j)));
                  }}
                >
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                </select>
                <Input
                  placeholder="Mức lương"
                  value={job.salary}
                  onChange={(e) => {
                    setJobPositions((prev) => prev.map((j, i) => (i === idx ? { ...j, salary: e.target.value } : j)));
                  }}
                />
              </div>

              <Input
                placeholder="Mô tả ngắn (tuỳ chọn)"
                value={job.description}
                onChange={(e) => {
                  setJobPositions((prev) => prev.map((j, i) => (i === idx ? { ...j, description: e.target.value } : j)));
                }}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Tùy chỉnh văn bản</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="subtitle">Phụ đề (subtitle)</Label>
            <Input
              id="subtitle"
              placeholder={DEFAULT_CAREER_TEXTS.subtitle}
              value={texts.subtitle || ''}
              onChange={(e) => { setTexts((prev) => ({ ...prev, subtitle: e.target.value })); }}
            />
          </div>
          <div>
            <Label htmlFor="ctaButton">Nút hành động (CTA)</Label>
            <Input
              id="ctaButton"
              placeholder={DEFAULT_CAREER_TEXTS.ctaButton}
              value={texts.ctaButton || ''}
              onChange={(e) => { setTexts((prev) => ({ ...prev, ctaButton: e.target.value })); }}
            />
          </div>
          <div>
            <Label htmlFor="emptyTitle">Tiêu đề trống</Label>
            <Input
              id="emptyTitle"
              placeholder={DEFAULT_CAREER_TEXTS.emptyTitle}
              value={texts.emptyTitle || ''}
              onChange={(e) => { setTexts((prev) => ({ ...prev, emptyTitle: e.target.value })); }}
            />
          </div>
          <div>
            <Label htmlFor="emptyDescription">Mô tả trống</Label>
            <Input
              id="emptyDescription"
              placeholder={DEFAULT_CAREER_TEXTS.emptyDescription}
              value={texts.emptyDescription || ''}
              onChange={(e) => { setTexts((prev) => ({ ...prev, emptyDescription: e.target.value })); }}
            />
          </div>
          <div>
            <Label htmlFor="remainingLabel">Nhãn còn lại</Label>
            <Input
              id="remainingLabel"
              placeholder={DEFAULT_CAREER_TEXTS.remainingLabel}
              value={texts.remainingLabel || ''}
              onChange={(e) => { setTexts((prev) => ({ ...prev, remainingLabel: e.target.value })); }}
            />
          </div>
        </CardContent>
      </Card>

      <CareerPreview
        jobs={normalizedJobs}
        brandColor={primary}
        secondary={secondary}
        mode={mode}
        selectedStyle={careerStyle}
        onStyleChange={setCareerStyle}
        title={title}
        texts={texts}
        fontStyle={fontStyle}
        fontClassName="font-active"
      />
    </ComponentFormWrapper>
  );
}
