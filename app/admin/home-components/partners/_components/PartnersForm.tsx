import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Label } from '../../../components/ui';
import { MultiImageUploader } from '../../../components/MultiImageUploader';
import type { PartnerItem, PartnersDisplayMode } from '../_types';

export const PartnersForm = ({
  items,
  setItems,
  displayMode,
  setDisplayMode,
}: {
  items: PartnerItem[];
  setItems: (items: PartnerItem[]) => void;
  displayMode: PartnersDisplayMode;
  setDisplayMode: (value: PartnersDisplayMode) => void;
}) => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle className="text-base">Logo đối tác</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label>Chế độ hiển thị logo</Label>
        <select
          className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          value={displayMode}
          onChange={(event) => { setDisplayMode(event.target.value as PartnersDisplayMode); }}
        >
          <option value="withName">Hiện tên logo</option>
          <option value="logoOnly">Chỉ logo</option>
        </select>
      </div>
      <MultiImageUploader<PartnerItem>
        items={items}
        onChange={setItems}
        folder="partners"
        imageKey="url"
        extraFields={[
          { key: 'name', placeholder: 'Tên đối tác / thương hiệu', type: 'text' },
          { key: 'link', placeholder: 'Link website đối tác', type: 'url' }
        ]}
        minItems={1}
        maxItems={60}
        aspectRatio="video"
        columns={4}
        showReorder={true}
        addButtonText="Thêm logo"
        layout="vertical"
      />
    </CardContent>
  </Card>
);
