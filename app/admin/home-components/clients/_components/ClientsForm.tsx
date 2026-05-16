'use client';

import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui';
import { MultiImageUploader } from '@/app/admin/components/MultiImageUploader';
import { CLIENTS_IMAGE_GUIDES } from '../_lib/constants';
import type { ClientEditorItem, ClientsStyle } from '../_types';

interface ClientsFormProps {
  action?: React.ReactNode;
  items: ClientEditorItem[];
  noBorderRadius?: boolean;
  setNoBorderRadius?: (value: boolean) => void;
  selectedStyle?: ClientsStyle;
  setItems: (items: ClientEditorItem[]) => void;
  maxItems?: number;
}

export const ClientsForm = ({
  action,
  items,
  noBorderRadius,
  setNoBorderRadius,
  selectedStyle = 'layout02',
  setItems,
  maxItems = 4,
}: ClientsFormProps) => {
  const imageGuide = CLIENTS_IMAGE_GUIDES[selectedStyle];

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Ảnh banner ({items.length}/{maxItems})</CardTitle>
        </CardHeader>
        <CardContent>
          <MultiImageUploader<ClientEditorItem>
            items={items}
            onChange={setItems}
            folder="brand-banners"
            imageKey="url"
            extraFields={[
              { key: 'link', placeholder: 'Link khi click ảnh (tùy chọn)', type: 'url' },
            ]}
            minItems={1}
            maxItems={maxItems}
            aspectRatio="banner"
            columns={2}
            showReorder={true}
            addButtonText="Thêm ảnh banner"
            emptyText="Chưa có ảnh banner nào"
            layout="vertical"
          />
          {action ? (
            <div className="mt-4 flex justify-start">
              {action}
            </div>
          ) : null}
          {setNoBorderRadius ? (
            <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
              <label className="inline-flex cursor-pointer select-none items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={Boolean(noBorderRadius)}
                  onChange={(event) => setNoBorderRadius(event.target.checked)}
                  className="h-3.5 w-3.5 rounded border-slate-300"
                />
                Bỏ bo góc ảnh banner
              </label>
            </div>
          ) : null}
        </CardContent>
      </Card>
      <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-800/50">
            <ImageIcon size={16} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <p className="mb-1 text-sm font-semibold text-blue-900 dark:text-blue-100">Gợi ý ảnh</p>
            <div className="space-y-1 text-xs text-blue-700 dark:text-blue-300">
              <p>• Số lượng phù hợp: <strong>1 đến {maxItems} ảnh</strong></p>
              <p>• Layout đang chọn: <strong>{imageGuide.summary}</strong></p>
              {imageGuide.items.map((item) => (
                <p key={item}>• {item}</p>
              ))}
              <p>• Lưu ý: {imageGuide.note}</p>
              <p>• Nếu để trống link, ảnh sẽ chỉ hiển thị và không điều hướng</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

