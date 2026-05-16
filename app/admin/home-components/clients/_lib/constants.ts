import type {
  ClientEditorItem,
  ClientsConfig,
  ClientsHeaderAlign,
  ClientsStyle,
} from '../_types';

export const CLIENTS_STYLES: Array<{ id: ClientsStyle; label: string }> = [
  { id: 'layout01', label: 'Layout 01 — 1 lớn + 3 phụ' },
  { id: 'layout02', label: 'Layout 02 — Banner full-width' },
  { id: 'layout03', label: 'Layout 03 — 1 trên + 2 dưới' },
  { id: 'layout04', label: 'Layout 04 — 2 banner ngang' },
  { id: 'layout05', label: 'Layout 05 — 3 banner landscape' },
  { id: 'layout06', label: 'Layout 06 — 4 banner dọc' },
  { id: 'layout07', label: 'Layout 07 — Grid 2×2 ngang' },
];

export const CLIENTS_HEADER_ALIGN_OPTIONS: Array<{ value: ClientsHeaderAlign; label: string }> = [
  { value: 'left', label: 'Trái' },
  { value: 'center', label: 'Giữa' },
  { value: 'right', label: 'Phải' },
];

export const CLIENTS_IMAGE_GUIDES: Record<ClientsStyle, {
  summary: string;
  items: string[];
  note: string;
}> = {
  layout01: {
    summary: 'Mosaic 4 ảnh: 3 ảnh vuông + 1 ảnh ngang rộng.',
    items: [
      'Ảnh 1, 2, 3: 1200×1200px hoặc 1:1.',
      'Ảnh 4: 1600×600px hoặc 8:3.',
    ],
    note: 'Không dùng banner chữ dài cho ô vuông vì sẽ bị cắt hai bên.',
  },
  layout02: {
    summary: '1 banner full-width.',
    items: [
      'Ảnh 1: 1600×600px, 2400×900px hoặc đúng tỉ lệ 8:3.',
    ],
    note: 'Giữ chữ/CTA cách mép ảnh tối thiểu 8–10% để an toàn trên mobile.',
  },
  layout03: {
    summary: '1 banner ngang trên + 2 ảnh ngang dưới.',
    items: [
      'Ảnh 1: 1600×600px hoặc 8:3.',
      'Ảnh 2, 3: 1600×900px hoặc 16:9.',
    ],
    note: 'Không dùng cùng một ảnh cho cả ô trên và ô dưới nếu tỉ lệ gốc khác nhau.',
  },
  layout04: {
    summary: '2 banner ngang song song.',
    items: [
      'Ảnh 1, 2: 1600×600px, 2400×900px hoặc đúng tỉ lệ 8:3.',
    ],
    note: 'Đây là layout phù hợp nhất cho banner khuyến mãi ngang như ảnh TV/tủ lạnh.',
  },
  layout05: {
    summary: '3 ảnh landscape cùng hàng.',
    items: [
      'Ảnh 1, 2, 3: 1600×900px hoặc 16:9.',
    ],
    note: 'Phù hợp ảnh ít chữ, subject nằm giữa khung.',
  },
  layout06: {
    summary: '4 ảnh dọc/portrait.',
    items: [
      'Ảnh 1–4: 900×1200px, 1200×1600px hoặc 3:4.',
    ],
    note: 'Không dùng banner ngang cho layout này vì sẽ bị cắt mạnh.',
  },
  layout07: {
    summary: 'Grid 2 cột, 4 ảnh ngang.',
    items: [
      'Ảnh 1–4: 1600×600px hoặc 24:9.',
    ],
    note: 'Layout đơn giản, phù hợp khi cần trưng bày nhiều ảnh cùng lúc mà vẫn gọn gàng.',
  },
};

export const CLIENTS_DEMO_ITEMS_BY_STYLE: Record<ClientsStyle, ClientEditorItem[]> = {
  layout01: [
    { id: 'demo-layout01-1', inputMode: 'upload', link: '', url: '/demo/clients/square-kitchen-1.png' },
    { id: 'demo-layout01-2', inputMode: 'upload', link: '', url: '/demo/clients/square-kitchen-2.png' },
    { id: 'demo-layout01-3', inputMode: 'upload', link: '', url: '/demo/clients/square-kitchen-3.png' },
    { id: 'demo-layout01-4', inputMode: 'upload', link: '', url: '/demo/clients/wide-kitchen-1.png' },
  ],
  layout02: [
    { id: 'demo-layout02-1', inputMode: 'upload', link: '', url: '/demo/clients/wide-kitchen-1.png' },
  ],
  layout03: [
    { id: 'demo-layout03-1', inputMode: 'upload', link: '', url: '/demo/clients/wide-kitchen-2.png' },
    { id: 'demo-layout03-2', inputMode: 'upload', link: '', url: '/demo/clients/landscape-kitchen-1.png' },
    { id: 'demo-layout03-3', inputMode: 'upload', link: '', url: '/demo/clients/landscape-kitchen-2.png' },
  ],
  layout04: [
    { id: 'demo-layout04-1', inputMode: 'upload', link: '', url: '/demo/clients/wide-kitchen-1.png' },
    { id: 'demo-layout04-2', inputMode: 'upload', link: '', url: '/demo/clients/wide-kitchen-2.png' },
  ],
  layout05: [
    { id: 'demo-layout05-1', inputMode: 'upload', link: '', url: '/demo/clients/landscape-kitchen-1.png' },
    { id: 'demo-layout05-2', inputMode: 'upload', link: '', url: '/demo/clients/landscape-kitchen-2.png' },
    { id: 'demo-layout05-3', inputMode: 'upload', link: '', url: '/demo/clients/landscape-kitchen-3.png' },
  ],
  layout06: [
    { id: 'demo-layout06-1', inputMode: 'upload', link: '', url: '/demo/clients/portrait-kitchen-1.png' },
    { id: 'demo-layout06-2', inputMode: 'upload', link: '', url: '/demo/clients/portrait-kitchen-2.png' },
    { id: 'demo-layout06-3', inputMode: 'upload', link: '', url: '/demo/clients/portrait-kitchen-3.png' },
    { id: 'demo-layout06-4', inputMode: 'upload', link: '', url: '/demo/clients/portrait-kitchen-4.png' },
  ],
  layout07: [
    { id: 'demo-layout07-1', inputMode: 'upload', link: '', url: '/demo/clients/landscape-kitchen-1.png' },
    { id: 'demo-layout07-2', inputMode: 'upload', link: '', url: '/demo/clients/landscape-kitchen-2.png' },
    { id: 'demo-layout07-3', inputMode: 'upload', link: '', url: '/demo/clients/landscape-kitchen-3.png' },
    { id: 'demo-layout07-4', inputMode: 'upload', link: '', url: '/demo/clients/square-kitchen-1.png' },
  ],
};

export const DEFAULT_CLIENTS_CONFIG: ClientsConfig = {
  items: [
    {
      link: '',
      url: '',
    },
  ],
  style: 'layout02',
  // Shared header config
  hideHeader: false,
  showTitle: true,
  subtitle: '',
  showSubtitle: true,
  headerAlign: 'left',
  titleColorPrimary: false,
  subtitleAboveTitle: false,
  uppercaseText: false,
  showBadge: true,
  badgeText: '',
  noBorderRadius: false,
};
