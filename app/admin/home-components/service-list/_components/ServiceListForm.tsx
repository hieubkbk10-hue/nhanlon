'use client';

import React from 'react';
import { AdminImage as Image } from '@/app/admin/components/AdminImage';
import { Briefcase, Check, ChevronDown, GripVertical, Plus, RotateCcw, Search, Trash2, X } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, cn } from '../../../components/ui';
import { SettingsImageUploader } from '../../../components/SettingsImageUploader';
import type { DemoServiceItem, ServiceSelectionMode } from '../_types';
import { AiDemoServicesImport } from '../../product-list/_components/AiDemoProductsImport';

export const DEFAULT_DEMO_SERVICES: DemoServiceItem[] = [
  { id: 'ds-1', name: 'Thiết kế website chuyên nghiệp', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop', price: '5.000.000đ', description: 'Thiết kế web responsive, chuẩn SEO, giao diện hiện đại', tag: 'hot' },
  { id: 'ds-2', name: 'Chạy quảng cáo Google Ads', image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800&h=500&fit=crop', price: '3.000.000đ', description: 'Quản lý chiến dịch quảng cáo, tối ưu CPC hiệu quả', tag: 'new' },
  { id: 'ds-3', name: 'SEO tổng thể', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop', price: '8.000.000đ', description: 'Tối ưu on-page, off-page và technical SEO toàn diện', tag: '' },
  { id: 'ds-4', name: 'Quản trị mạng xã hội', image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&h=500&fit=crop', price: '4.000.000đ', description: 'Quản lý fanpage, sáng tạo nội dung và lên lịch đăng bài', tag: '' },
  { id: 'ds-5', name: 'Chụp ảnh sản phẩm', image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&h=500&fit=crop', price: '2.500.000đ', description: 'Chụp ảnh chuyên nghiệp, hậu kỳ tinh tế cho thương mại', tag: 'new' },
  { id: 'ds-6', name: 'Tư vấn chiến lược Marketing', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop', price: '12.000.000đ', description: 'Xây dựng kế hoạch marketing tổng thể cho doanh nghiệp', tag: 'hot' },
];

export interface ServiceListFormItem {
  _id: string;
  title: string;
  excerpt?: string;
  thumbnail?: string;
  views?: number;
}

export const ServiceListForm = ({
  selectionMode,
  onSelectionModeChange,
  itemCount,
  sortBy,
  onItemCountChange,
  onSortByChange,
  filteredServices,
  selectedServices,
  selectedServiceIds,
  onToggleService,
  serviceSearchTerm,
  onServiceSearchTermChange,
  demoServices,
  setDemoServices,
  defaultExpanded,
}: {
  selectionMode: ServiceSelectionMode;
  onSelectionModeChange: (mode: ServiceSelectionMode) => void;
  itemCount: number;
  sortBy: string;
  onItemCountChange: (count: number) => void;
  onSortByChange: (value: string) => void;
  filteredServices: ServiceListFormItem[];
  selectedServices: ServiceListFormItem[];
  selectedServiceIds: string[];
  onToggleService: (id: string) => void;
  serviceSearchTerm: string;
  onServiceSearchTermChange: (value: string) => void;
  demoServices: DemoServiceItem[];
  setDemoServices: React.Dispatch<React.SetStateAction<DemoServiceItem[]>>;
  defaultExpanded?: boolean;
}) => {
  const [expanded, setExpanded] = React.useState(defaultExpanded ?? true);

  return (
    <Card className="mb-6">
      <CardHeader>
        <div
          className="cursor-pointer flex items-center justify-between"
          onClick={() => setExpanded(!expanded)}
        >
          <CardTitle className="text-base flex items-center gap-2">
            <Briefcase size={20} />
            Nguồn dữ liệu
          </CardTitle>
          <ChevronDown
            size={16}
            className={cn(
              'transition-transform duration-200',
              expanded ? 'rotate-180' : '',
            )}
          />
        </div>
      </CardHeader>
      {expanded && (
      <CardContent className="space-y-4">
      {/* Selection Mode Toggle */}
      <div className="space-y-2">
        <Label>Chế độ chọn dịch vụ</Label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() =>{  onSelectionModeChange('auto'); }}
            className={cn(
              "flex-1 py-2.5 px-4 rounded-lg border text-sm font-medium transition-all",
              selectionMode === 'auto'
                ? "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
            )}
          >
            Tự động
          </button>
          <button
            type="button"
            onClick={() =>{  onSelectionModeChange('manual'); }}
            className={cn(
              "flex-1 py-2.5 px-4 rounded-lg border text-sm font-medium transition-all",
              selectionMode === 'manual'
                ? "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
            )}
          >
            Chọn thủ công
          </button>
          <button
            type="button"
            onClick={() =>{  onSelectionModeChange('demo'); }}
            className={cn(
              "flex-1 py-2.5 px-4 rounded-lg border text-sm font-medium transition-all",
              selectionMode === 'demo'
                ? "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
            )}
          >
            Demo
          </button>
        </div>
        <p className="text-xs text-slate-500">
          {selectionMode === 'auto' 
            ? 'Hiển thị dịch vụ tự động theo số lượng và sắp xếp' 
            : selectionMode === 'manual'
              ? 'Chọn từng dịch vụ cụ thể để hiển thị'
              : 'Nhập dữ liệu demo trực tiếp, không cần dịch vụ thật'}
        </p>
      </div>
      {/* Auto mode settings */}
      {selectionMode === 'auto' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Số lượng hiển thị</Label>
            <Input type="number" value={itemCount} onChange={(e) =>{  onItemCountChange(Number.parseInt(e.target.value) || 8); }} />
          </div>
          <div className="space-y-2">
            <Label>Sắp xếp theo</Label>
            <select className="w-full h-10 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm" value={sortBy} onChange={(e) =>{  onSortByChange(e.target.value); }}>
              <option value="newest">Mới nhất</option>
              <option value="popular">Xem nhiều nhất</option>
              <option value="random">Ngẫu nhiên</option>
            </select>
          </div>
        </div>
      )}

      {/* Manual mode - Service selector */}
      {selectionMode === 'manual' && (
        <div className="space-y-4">
          {/* Selected services list */}
          {selectedServices.length > 0 && (
            <div className="space-y-2">
              <Label>Dịch vụ đã chọn ({selectedServices.length})</Label>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {selectedServices.map((service, index) => (
                  <div 
                    key={service._id} 
                    className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg group"
                  >
                    <div className="text-slate-400 cursor-move">
                      <GripVertical size={16} />
                    </div>
                    <span className="w-6 h-6 flex items-center justify-center bg-blue-500 text-white text-xs rounded-full font-medium">
                      {index + 1}
                    </span>
                    {service.thumbnail ? (
                      <Image src={service.thumbnail} alt="" width={48} height={48} className="w-12 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center">
                        <Briefcase size={16} className="text-slate-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{service.title}</p>
                      <p className="text-xs text-slate-500">{service.views} lượt xem</p>
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-slate-400 hover:text-red-500"
                      onClick={() =>{  onToggleService(service._id); }}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search and add services */}
          <div className="space-y-2">
            <Label>Thêm dịch vụ</Label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input 
                placeholder="Tìm kiếm dịch vụ..." 
                className="pl-9"
                value={serviceSearchTerm}
                onChange={(e) =>{  onServiceSearchTermChange(e.target.value); }}
              />
            </div>
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg max-h-[250px] overflow-y-auto">
              {filteredServices.length === 0 ? (
                <div className="p-4 text-center text-sm text-slate-500">
                  Không tìm thấy dịch vụ
                </div>
              ) : (
                filteredServices.map(service => {
                  const isSelected = selectedServiceIds.includes(service._id);
                  return (
                    <div 
                      key={service._id}
                      onClick={() =>{  onToggleService(service._id); }}
                      className={cn(
                        "flex items-center gap-3 p-3 cursor-pointer border-b border-slate-100 dark:border-slate-800 last:border-0 transition-colors",
                        isSelected 
                          ? "bg-blue-50 dark:bg-blue-500/10" 
                          : "hover:bg-slate-50 dark:hover:bg-slate-800"
                      )}
                    >
                      <div className={cn(
                        "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                        isSelected 
                          ? "border-blue-500 bg-blue-500" 
                          : "border-slate-300 dark:border-slate-600"
                      )}>
                        {isSelected && <Check size={12} className="text-white" />}
                      </div>
                      {service.thumbnail ? (
                        <Image src={service.thumbnail} alt="" width={40} height={40} className="w-10 h-10 object-cover rounded" />
                      ) : (
                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded flex items-center justify-center">
                          <Briefcase size={14} className="text-slate-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{service.title}</p>
                        <p className="text-xs text-slate-500">{service.views} lượt xem</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Demo mode - Inline demo items */}
      {selectionMode === 'demo' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Dịch vụ demo ({demoServices.length})</Label>
            <div className="flex gap-1.5">
              <Button type="button" variant="outline" size="sm"
                onClick={() => setDemoServices(DEFAULT_DEMO_SERVICES.map((d, i) => ({ ...d, id: `demo-${Date.now() + i}` })))}>
                <RotateCcw size={14} className="mr-1" /> Mặc định
              </Button>
              <AiDemoServicesImport onApply={setDemoServices} />
              <Button type="button" variant="outline" size="sm"
                onClick={() => setDemoServices(prev => [...prev, { id: `demo-${Date.now()}`, name: '', image: '', price: '', description: '', tag: '' as const }])}>
                <Plus size={14} className="mr-1" /> Thêm
              </Button>
            </div>
          </div>
          {demoServices.map((item, index) => (
            <div
              key={item.id}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden"
            >
              <div className="flex items-center gap-2 px-3 py-2">
                <span className="w-5 h-5 flex items-center justify-center bg-blue-500 text-white text-[10px] rounded-full font-bold shrink-0">{index + 1}</span>
                {item.image ? (
                  <Image src={item.image} alt="" width={36} height={36} className="w-9 h-9 object-cover rounded shrink-0" />
                ) : (
                  <div className="w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center shrink-0">
                    <Briefcase size={12} className="text-slate-400" />
                  </div>
                )}
                <Input placeholder="Tên dịch vụ *" className="h-8 flex-1 text-xs min-w-0"
                  value={item.name}
                  onChange={(e) => setDemoServices(prev => prev.map(d => d.id === item.id ? { ...d, name: e.target.value } : d))} />
                <Input placeholder="Giá (VD: 5.000.000đ)" className="h-8 w-32 text-xs shrink-0"
                  value={item.price ?? ''}
                  onChange={(e) => setDemoServices(prev => prev.map(d => d.id === item.id ? { ...d, price: e.target.value } : d))} />
                <Button type="button" variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-slate-400 hover:text-red-500"
                  onClick={() => setDemoServices(prev => prev.length > 1 ? prev.filter(d => d.id !== item.id) : prev)}>
                  <Trash2 size={13} />
                </Button>
              </div>
              <div className="border-t border-slate-100 dark:border-slate-800 px-3 py-1.5">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <Input placeholder="Mô tả ngắn" className="h-7 text-xs"
                    value={item.description ?? ''}
                    onChange={(e) => setDemoServices(prev => prev.map(d => d.id === item.id ? { ...d, description: e.target.value } : d))} />
                  <SettingsImageUploader
                    label="Ảnh thumbnail"
                    value={item.image ?? ''}
                    onChange={(url) => setDemoServices(prev => prev.map(d => d.id === item.id ? { ...d, image: url ?? '' } : d))}
                    folder="home-components/service-list"
                    naming={{ entityName: item.name || 'demo-service', field: 'thumbnail', index: index + 1 }}
                    previewSize="sm"
                  />
                </div>
              </div>
            </div>
          ))}
          {demoServices.length === 0 && (
            <div className="text-center py-6 text-sm text-slate-500">
              Chưa có dịch vụ demo.{' '}
              <button type="button" className="text-blue-600 hover:underline"
                onClick={() => setDemoServices(DEFAULT_DEMO_SERVICES.map((d, i) => ({ ...d, id: `demo-${Date.now() + i}` })))}>
                Tạo mặc định
              </button>
            </div>
          )}
        </div>
      )}
      </CardContent>
      )}
    </Card>
  );
};

