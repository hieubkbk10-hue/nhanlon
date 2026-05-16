'use client';

import React, { useMemo, useState } from 'react';
import { Check, Copy, FileText, WandSparkles, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
  cn,
} from './ui';

export type AiEntityImportKind = 'product' | 'service' | 'post';

export type AiEntityImportPayload = {
  name?: string;
  title?: string;
  slug?: string;
  sku?: string;
  description?: string;
  content?: string;
  excerpt?: string;
  markdownRender?: string;
  htmlRender?: string;
  metaTitle?: string;
  metaDescription?: string;
  image?: string;
  thumbnail?: string;
  price?: number;
  salePrice?: number;
  stock?: number;
  duration?: string;
  authorName?: string;
};

type ParseResult = {
  item: AiEntityImportPayload | null;
  errors: string[];
};

const ENTITY_COPY: Record<AiEntityImportKind, {
  rootKey: string;
  title: string;
  description: string;
  sample: string;
}> = {
  product: {
    rootKey: 'product',
    title: 'Nhập sản phẩm bằng AI',
    description: 'Copy prompt, nhờ AI tạo JSON sản phẩm, dán kết quả để preview rồi áp dụng vào form.',
    sample: `{
  "product": {
    "name": "Giá kệ góc liên hoàn inox 304",
    "slug": "gia-ke-goc-lien-hoan-inox-304",
    "sku": "GK-INX-304",
    "description": "Giá kệ góc inox 304 tối ưu không gian bếp, chịu lực tốt, dễ vệ sinh.",
    "htmlRender": "<h2>Giá kệ góc liên hoàn inox 304</h2><p>Thiết kế chắc chắn, vận hành êm và phù hợp tủ bếp hiện đại.</p>",
    "metaTitle": "Giá kệ góc liên hoàn inox 304",
    "metaDescription": "Giá kệ góc inox 304 bền đẹp, tối ưu góc tủ và phù hợp nội thất bếp cao cấp.",
    "image": "https://example.com/product.jpg",
    "price": 3500000,
    "salePrice": 4200000,
    "stock": 10
  }
}`,
  },
  service: {
    rootKey: 'service',
    title: 'Nhập dịch vụ bằng AI',
    description: 'Copy prompt, nhờ AI tạo JSON dịch vụ, dán kết quả để preview rồi áp dụng vào form.',
    sample: `{
  "service": {
    "title": "Tư vấn thiết kế tủ bếp",
    "slug": "tu-van-thiet-ke-tu-bep",
    "excerpt": "Tư vấn giải pháp tủ bếp tối ưu theo không gian thực tế.",
    "htmlRender": "<h2>Tư vấn thiết kế tủ bếp</h2><p>Đội ngũ chuyên môn khảo sát, tư vấn vật liệu và bố trí công năng.</p>",
    "metaTitle": "Tư vấn thiết kế tủ bếp chuyên nghiệp",
    "metaDescription": "Dịch vụ tư vấn thiết kế tủ bếp tối ưu công năng, thẩm mỹ và ngân sách.",
    "thumbnail": "https://example.com/service.jpg",
    "price": 500000,
    "duration": "60 phút"
  }
}`,
  },
  post: {
    rootKey: 'post',
    title: 'Nhập bài viết bằng AI',
    description: 'Copy prompt, nhờ AI tạo JSON bài viết, dán kết quả để preview rồi áp dụng vào form.',
    sample: `{
  "post": {
    "title": "Cách chọn phụ kiện tủ bếp bền đẹp",
    "slug": "cach-chon-phu-kien-tu-bep-ben-dep",
    "excerpt": "Gợi ý tiêu chí chọn phụ kiện tủ bếp theo chất liệu, tải trọng và thói quen sử dụng.",
    "htmlRender": "<h2>Vì sao phụ kiện tủ bếp quan trọng?</h2><p>Phụ kiện tốt giúp tối ưu lưu trữ, tăng độ bền và cải thiện trải nghiệm sử dụng.</p>",
    "metaTitle": "Cách chọn phụ kiện tủ bếp bền đẹp",
    "metaDescription": "Hướng dẫn chọn phụ kiện tủ bếp theo chất liệu, tải trọng và nhu cầu sử dụng thực tế.",
    "thumbnail": "https://example.com/post.jpg",
    "authorName": "Biên tập viên"
  }
}`,
  },
};

const FIELD_SPECS: Record<AiEntityImportKind, Record<string, string>> = {
  product: {
    name: '"name": "string bắt buộc, tên sản phẩm tự nhiên, có keyword chính và thuộc tính quan trọng"',
    slug: '"slug": "string optional, lowercase-kebab-case không dấu"',
    sku: '"sku": "string optional, mã ngắn dễ quản trị"',
    description: '"description": "string, 120-240 ký tự, chốt rõ sản phẩm là gì + lợi ích chính"',
    content: '"content": "string optional, plain text nếu không dùng htmlRender/markdownRender"',
    markdownRender: '"markdownRender": "string optional, markdown sạch nếu module bật markdown"',
    htmlRender: '"htmlRender": "string optional, HTML semantic sạch: h2,h3,p,ul,li,strong,table; không inline style"',
    metaTitle: '"metaTitle": "string <= 60 ký tự, có keyword chính, không nhồi từ khóa"',
    metaDescription: '"metaDescription": "string <= 160 ký tự, nêu lợi ích + lý do click"',
    image: '"image": "URL http/https hoặc path bắt đầu /, optional, không dùng base64"',
    price: '"price": "number optional, giá bán thực tế"',
    salePrice: '"salePrice": "number optional, giá so sánh nếu có, phải lớn hơn price"',
    stock: '"stock": "number optional, tồn kho"',
  },
  service: {
    title: '"title": "string bắt buộc, tên dịch vụ rõ ngành + lợi ích"',
    slug: '"slug": "string optional, lowercase-kebab-case không dấu"',
    excerpt: '"excerpt": "string, 120-220 ký tự, nói rõ dịch vụ giúp ai và giải quyết vấn đề gì"',
    content: '"content": "string optional, plain text nếu không dùng htmlRender/markdownRender"',
    markdownRender: '"markdownRender": "string optional, markdown sạch nếu module bật markdown"',
    htmlRender: '"htmlRender": "string optional, HTML semantic sạch: h2,h3,p,ul,li,strong; không inline style"',
    metaTitle: '"metaTitle": "string <= 60 ký tự, có keyword dịch vụ"',
    metaDescription: '"metaDescription": "string <= 160 ký tự, có lợi ích + đối tượng phù hợp"',
    thumbnail: '"thumbnail": "URL http/https hoặc path bắt đầu /, optional, không dùng base64"',
    price: '"price": "number optional, giá tham khảo nếu phù hợp"',
    duration: '"duration": "string optional, ví dụ 60 phút / 2-3 ngày / Theo dự án"',
  },
  post: {
    title: '"title": "string bắt buộc, cụ thể, có góc nhìn rõ, không chung chung"',
    slug: '"slug": "string optional, lowercase-kebab-case không dấu"',
    excerpt: '"excerpt": "string, 130-220 ký tự, tóm tắt insight chính và lý do nên đọc"',
    content: '"content": "string optional, plain text nếu không dùng htmlRender/markdownRender"',
    markdownRender: '"markdownRender": "string optional, markdown sạch nếu module bật markdown"',
    htmlRender: '"htmlRender": "string optional, HTML semantic sạch: h2,h3,p,ul,li,strong,blockquote,table; không inline style"',
    metaTitle: '"metaTitle": "string <= 60 ký tự, có keyword và lợi ích đọc"',
    metaDescription: '"metaDescription": "string <= 160 ký tự, mô tả cụ thể, không mơ hồ"',
    thumbnail: '"thumbnail": "URL http/https hoặc path bắt đầu /, optional, không dùng base64"',
    authorName: '"authorName": "string optional"',
  },
};

const CORE_FIELDS: Record<AiEntityImportKind, string[]> = {
  product: ['name', 'slug', 'price'],
  service: ['title', 'slug', 'content'],
  post: ['title', 'slug', 'content'],
};

const OPTIONAL_FIELD_MAP: Record<AiEntityImportKind, Record<string, string[]>> = {
  product: {
    description: ['description', 'content'],
    htmlRender: ['htmlRender'],
    markdownRender: ['markdownRender'],
    metaTitle: ['metaTitle'],
    metaDescription: ['metaDescription'],
    image: ['image'],
    images: ['image'],
    sku: ['sku'],
    salePrice: ['salePrice'],
    stock: ['stock'],
  },
  service: {
    content: ['content'],
    excerpt: ['excerpt'],
    htmlRender: ['htmlRender'],
    markdownRender: ['markdownRender'],
    metaTitle: ['metaTitle'],
    metaDescription: ['metaDescription'],
    thumbnail: ['thumbnail'],
    price: ['price'],
    duration: ['duration'],
  },
  post: {
    content: ['content'],
    excerpt: ['excerpt'],
    htmlRender: ['htmlRender'],
    markdownRender: ['markdownRender'],
    metaTitle: ['metaTitle'],
    metaDescription: ['metaDescription'],
    thumbnail: ['thumbnail'],
    author_name: ['authorName'],
    authorName: ['authorName'],
  },
};

const STYLE_GUIDE = `Nguyên tắc chất lượng bắt buộc:
- Nội dung phải dùng được ngay trên website thật, không phải demo.
- Viết tiếng Việt tự nhiên, cụ thể, có thông tin ra quyết định; tránh câu chung chung kiểu "chất lượng cao, giá tốt".
- Không "AI styling": không emoji, không icon trang trí, không lạm dụng dấu !!!, không dùng giọng thổi phồng như "số 1", "tốt nhất" nếu không có bằng chứng.
- Học pattern tốt từ Shopify/Amazon/Shopee/Lazada/web affiliate: benefit-first, thông số rõ, đoạn ngắn, dễ scan mobile, có use case, objection handling, CTA mềm.
- Không bịa chứng nhận, bảo hành, xuất xứ, khuyến mãi, cam kết 100% nếu input không cung cấp.
- SEO human-first: keyword xuất hiện tự nhiên ở tiêu đề/mở đầu/meta; semantic coverage tốt, không keyword stuffing.
- Format sạch: nếu dùng htmlRender thì chỉ dùng thẻ semantic đơn giản, không className, không style inline, không script, không iframe.`;

const KIND_GUIDE: Record<AiEntityImportKind, string> = {
  product: `Riêng sản phẩm:
- Viết theo intent mua hàng: sản phẩm là gì, dành cho ai, giải quyết nhu cầu gì, điểm khác biệt, chất liệu/thông số/cách dùng.
- Hợp cả web ecommerce, marketplace như Shopee/Lazada và web affiliate: rõ lợi ích, rõ thông số, không phóng đại.
- htmlRender nên có cấu trúc: H2 giới thiệu, H3 điểm nổi bật, H3 thông số/ứng dụng, H3 gợi ý sử dụng hoặc lưu ý.`,
  service: `Riêng dịch vụ:
- Viết theo intent thuê dịch vụ: vấn đề khách đang gặp, cách dịch vụ xử lý, quy trình/đầu ra, ai phù hợp, kỳ vọng thực tế.
- Giữ giọng chuyên nghiệp, tin cậy, rõ phạm vi; không cam kết kết quả quá mức.
- htmlRender nên có cấu trúc: H2 tổng quan, H3 lợi ích, H3 quy trình, H3 phù hợp với ai, H3 thông tin triển khai.`,
  post: `Riêng bài viết:
- Bài phải có góc nhìn cụ thể, insight rõ, không viết kiểu "tổng quan chung chung".
- Ưu tiên nội dung có chiều sâu: ví dụ, tiêu chí chọn, lỗi thường gặp, checklist, so sánh, tình huống áp dụng.
- htmlRender nên có cấu trúc: H2 mở vấn đề, H2 các luận điểm chính, H3 ví dụ/checklist, H2 kết luận hành động.`,
};

const buildSchema = (kind: AiEntityImportKind, enabledFields?: string[]) => {
  const enabled = new Set(enabledFields ?? []);
  const allowAllOptional = enabledFields === undefined;
  const fieldNames = new Set(CORE_FIELDS[kind]);

  Object.entries(OPTIONAL_FIELD_MAP[kind]).forEach(([moduleField, schemaFields]) => {
    if (allowAllOptional || enabled.has(moduleField)) {
      schemaFields.forEach((field) => fieldNames.add(field));
    }
  });

  const lines = Array.from(fieldNames)
    .filter((field) => FIELD_SPECS[kind][field])
    .map((field) => `    ${FIELD_SPECS[kind][field]}`);

  return `{
  "${ENTITY_COPY[kind].rootKey}": {
${lines.join(',\n')}
  }
}`;
};

const buildPrompt = (kind: AiEntityImportKind, enabledFields?: string[]) => {
  const enabledLine = enabledFields
    ? enabledFields.length > 0
      ? `Field module đang bật trong /system/modules: ${enabledFields.join(', ')}. Chỉ sinh các field tương ứng trong schema bên dưới.`
      : 'Hiện không có field optional nào đang bật trong /system/modules. Chỉ sinh các field bắt buộc/core trong schema bên dưới.'
    : 'Nếu không rõ field module đang bật, vẫn bám đúng schema bên dưới và không tự thêm field ngoài schema.';

  return `Bạn là senior Vietnamese SEO & conversion copywriter cho website thương mại/dịch vụ/blog.

Nhiệm vụ: tạo nội dung ${kind === 'product' ? 'SẢN PHẨM' : kind === 'service' ? 'DỊCH VỤ' : 'BÀI VIẾT'} bằng tiếng Việt, có thể dùng ngay sau khi dán vào admin.

${enabledLine}

Output rule:
- Chỉ trả về JSON hợp lệ.
- Không dùng markdown fence.
- Không giải thích ngoài JSON.
- Không tạo field ngoài schema.
- Nếu thiếu dữ liệu đầu vào, tự suy luận hợp lý nhưng không bịa claim nhạy cảm/chứng nhận.

${STYLE_GUIDE}

${KIND_GUIDE[kind]}

Schema bắt buộc:
${buildSchema(kind, enabledFields)}`;
};

const cleanJsonInput = (raw: string) => {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fenced?.[1]?.trim() ?? trimmed;
};

const trimText = (value: unknown, maxLength: number) => {
  if (typeof value !== 'string' && typeof value !== 'number') { return ''; }
  return String(value).trim().slice(0, maxLength);
};

const parseNumber = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) { return value; }
  if (typeof value !== 'string') { return undefined; }
  const normalized = value.replaceAll(/[^\d]/g, '');
  if (!normalized) { return undefined; }
  const parsed = Number.parseInt(normalized, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const isValidImageUrl = (value: string) => {
  if (!value) { return true; }
  if (value.startsWith('/')) { return true; }
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const parseAiEntity = (raw: string, kind: AiEntityImportKind): ParseResult => {
  const config = ENTITY_COPY[kind];
  let parsed: unknown;

  try {
    parsed = JSON.parse(cleanJsonInput(raw));
  } catch {
    return { errors: ['JSON chưa hợp lệ. Hãy dán object đúng schema.'], item: null };
  }

  const source = typeof parsed === 'object' && parsed !== null && config.rootKey in parsed
    ? (parsed as Record<string, unknown>)[config.rootKey]
    : parsed;

  if (typeof source !== 'object' || source === null || Array.isArray(source)) {
    return { errors: [`Root JSON phải là { "${config.rootKey}": { ... } } hoặc object.`], item: null };
  }

  const record = source as Record<string, unknown>;
  const title = trimText(record.title ?? record.name, 140);
  const errors: string[] = [];
  if (!title) {
    errors.push(kind === 'product' ? 'Thiếu name sản phẩm.' : 'Thiếu title.');
  }

  const image = trimText(record.image ?? record.thumbnail, 500);
  if (!isValidImageUrl(image)) {
    errors.push('Ảnh phải là URL http/https hoặc path bắt đầu bằng /.');
  }

  const item: AiEntityImportPayload = {
    authorName: trimText(record.authorName, 120),
    content: trimText(record.content, 20_000),
    description: trimText(record.description, 2_000),
    duration: trimText(record.duration, 80),
    excerpt: trimText(record.excerpt, 300),
    htmlRender: trimText(record.htmlRender, 40_000),
    image,
    markdownRender: trimText(record.markdownRender, 40_000),
    metaDescription: trimText(record.metaDescription, 160),
    metaTitle: trimText(record.metaTitle, 60),
    name: kind === 'product' ? title : undefined,
    price: parseNumber(record.price),
    salePrice: parseNumber(record.salePrice),
    sku: trimText(record.sku, 80),
    slug: trimText(record.slug, 160),
    stock: parseNumber(record.stock),
    thumbnail: image,
    title: kind !== 'product' ? title : undefined,
  };

  return { errors, item: errors.length > 0 ? null : item };
};

export function AiEntityImportDialog({
  buttonClassName,
  enabledFields,
  kind,
  onApply,
}: {
  buttonClassName?: string;
  enabledFields?: Iterable<string>;
  kind: AiEntityImportKind;
  onApply: (item: AiEntityImportPayload) => void;
}) {
  const [open, setOpen] = useState(false);
  const [rawInput, setRawInput] = useState('');
  const [lastCopied, setLastCopied] = useState<'prompt' | 'sample' | null>(null);
  const copy = ENTITY_COPY[kind];
  const enabledFieldList = useMemo(() => enabledFields ? Array.from(enabledFields).sort() : undefined, [enabledFields]);
  const prompt = useMemo(() => buildPrompt(kind, enabledFieldList), [enabledFieldList, kind]);
  const result = useMemo(() => parseAiEntity(rawInput, kind), [kind, rawInput]);
  const canApply = rawInput.trim().length > 0 && Boolean(result.item) && result.errors.length === 0;

  const copyText = async (value: string, type: 'prompt' | 'sample') => {
    await navigator.clipboard.writeText(value);
    setLastCopied(type);
    toast.success(type === 'prompt' ? 'Đã copy prompt' : 'Đã copy JSON mẫu');
    window.setTimeout(() => setLastCopied(null), 1500);
  };

  const applyItem = () => {
    if (!canApply || !result.item) { return; }
    onApply(result.item);
    toast.success('Đã áp dụng nội dung AI vào form');
    setOpen(false);
    setRawInput('');
  };

  return (
    <>
      <Button type="button" variant="outline" size="sm" className={cn('gap-2 border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100', buttonClassName)} onClick={() => setOpen(true)}>
        <WandSparkles size={15} /> Nhập AI
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[94vw] max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{copy.title}</DialogTitle>
            <DialogDescription>{copy.description}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-3">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <Label className="flex items-center gap-1.5">
                    <FileText size={14} /> Prompt chuẩn
                  </Label>
                  <Button type="button" variant="outline" size="sm" className="h-7 gap-1 text-xs" onClick={() => void copyText(prompt, 'prompt')}>
                    {lastCopied === 'prompt' ? <Check size={12} /> : <Copy size={12} />}
                    Copy
                  </Button>
                </div>
                <pre className="max-h-56 overflow-auto whitespace-pre-wrap rounded-md bg-white p-2 text-[11px] leading-5 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                  {prompt}
                </pre>
              </div>

              <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <Label>JSON mẫu</Label>
                  <Button type="button" variant="outline" size="sm" className="h-7 gap-1 text-xs" onClick={() => void copyText(copy.sample, 'sample')}>
                    {lastCopied === 'sample' ? <Check size={12} /> : <Copy size={12} />}
                    Copy
                  </Button>
                </div>
                <pre className="max-h-40 overflow-auto whitespace-pre-wrap rounded-md bg-slate-50 p-2 text-[11px] leading-5 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {copy.sample}
                </pre>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Dán kết quả AI</Label>
                <textarea
                  className="min-h-64 w-full rounded-md border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-slate-800 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  placeholder={copy.sample}
                  value={rawInput}
                  onChange={(event) => setRawInput(event.target.value)}
                />
              </div>

              {rawInput.trim().length > 0 && (
                <div className={cn(
                  'rounded-lg border p-3 text-sm',
                  result.errors.length > 0
                    ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-300'
                    : 'border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-950/20 dark:text-green-300'
                )}>
                  {result.errors.length > 0 ? (
                    <ul className="space-y-1">
                      {result.errors.map((error) => (
                        <li key={error} className="flex gap-1.5">
                          <X size={14} className="mt-0.5 shrink-0" />
                          <span>{error}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <Check size={14} />
                      JSON hợp lệ, sẵn sàng áp dụng.
                    </div>
                  )}
                </div>
              )}

              {result.item && (
                <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Preview</div>
                  <div className="mt-2 space-y-1 text-sm">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{result.item.name || result.item.title}</div>
                    {(result.item.excerpt || result.item.description || result.item.metaDescription) && (
                      <div className="line-clamp-3 text-slate-500">{result.item.excerpt || result.item.description || result.item.metaDescription}</div>
                    )}
                    {(result.item.image || result.item.thumbnail) && (
                      <div className="truncate text-xs text-slate-400">{result.item.image || result.item.thumbnail}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Đóng
            </Button>
            <Button type="button" variant="accent" disabled={!canApply} onClick={applyItem}>
              Áp dụng vào form
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
