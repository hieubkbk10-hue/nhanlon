## Audit Summary
- **Observation**: Bạn yêu cầu lập kế hoạch để repo `E:\NextJS\persional_project\system-nhan` đạt **full parity** với repo chuẩn `E:\NextJS\study\admin-ui-aistudio\system-vietadmin-nextjs`, và muốn kế hoạch **rất chi tiết theo từng file/module**, bám sát structure code chuẩn.
- **Evidence (từ diff trước đó)**:
  - Chênh lệch lớn ở `app/admin/posts/create/page.tsx`, `convex/posts.ts`, `lib/posts/generator/*` (thiếu Auto Post Generator).
  - Chênh lệch ở `lib/image/uploadPipeline.ts`, thiếu `lib/image/uploadNaming.ts`, khác biệt loạt uploader admin + schema/storage cleanup Convex.
  - Chênh lệch SEO tại `components/seo/LandingHeroImage.tsx`.
  - Chênh lệch an toàn ảnh tại `app/(site)/products/[slug]/page.tsx`.
- **Expected vs Actual (#1)**:
  - Expected: roadmap triển khai đầy đủ, có thứ tự, file cụ thể, tiêu chí hoàn thành rõ.
  - Actual: hiện mới có danh sách chênh lệch và nhóm tính năng, chưa có execution plan chi tiết theo phase.
- **Khả năng tái hiện (#3)**: Có, ổn định bằng `git diff --no-index` giữa 2 path repo cố định.
- **Giả thuyết thay thế (#6)**: Một phần diff có thể do refactor/coding style, không phải thiếu tính năng; cần map theo behavior khi triển khai.
- **Tiêu chí pass/fail (#8)**:
  - Pass: parity các cụm tính năng chính, cấu trúc file gần repo chuẩn, không vỡ luồng admin/site/convex typing.
  - Fail: chỉ copy rời rạc file mà không đảm bảo dependency xuyên module (UI ↔ Convex ↔ lib).

## Root Cause Confidence
- **High**: Gốc thiếu parity nằm ở 4 cụm lớn đang lệch dependency chain:  
  1) Auto Post Generator (UI + backend + config),  
  2) Image storage lifecycle (naming + storageId + cleanup),  
  3) SEO LCP hero image priority,  
  4) Product image safety/guard logic ở site.

## Proposal (Full-parity execution plan, very detailed)

### Phase 0 — Baseline parity map & freeze scope (read-only)
**Mục tiêu**: Khóa phạm vi theo repo chuẩn, tránh thiếu file phụ thuộc.

1. Xác nhận lại diff cho các vùng: `app`, `components`, `convex`, `lib`, `next.config.ts`, `package.json`.
2. Lập bảng mapping `source file (chuẩn)` → `target file (hiện tại)` với trạng thái: `missing / modified / same`.
3. Đánh dấu generated/noise để loại khỏi implementation (`convex/_generated`, `.next`, `node_modules`, docs).

**Deliverable**: “Parity file manifest” làm checklist thi công.

---

### Phase 1 — Auto Post Generator parity (P0)
**Mục tiêu**: Đồng bộ đầy đủ luồng sinh bài tự động như repo chuẩn.

#### 1.1 Tạo nhóm file generator còn thiếu trong `lib/posts/generator`
Tạo mới và bám sát structure repo chuẩn:
- `lib/posts/generator/types.ts`
- `lib/posts/generator/macro-templates.ts`
- `lib/posts/generator/slot-families.ts`
- `lib/posts/generator/phrase-banks.ts`
- `lib/posts/generator/media-plan.ts`
- `lib/posts/generator/link-plan.ts`
- `lib/posts/generator/variant-synthesizer.ts`
- `lib/posts/generator/thumbnail.ts`
- `lib/posts/generator/disclaimer.ts`
- `lib/posts/generator/assembler.ts`

**Việc làm chi tiết**:
- Copy logic type contract trước (`types.ts`) để unblock compile các file còn lại.
- Thêm template + field spec trước (`macro-templates.ts`) vì UI/admin dùng trực tiếp.
- Thêm assembler cuối cùng sau khi đủ helper files.

#### 1.2 Bổ sung setting module Posts
- File: `lib/modules/configs/posts.config.ts`
- Thêm setting `enableAutoPostGenerator` (group `generator`) + `settingGroups` tương ứng.

#### 1.3 Đồng bộ hook config behavior-linked
- File: `lib/modules/hooks/useModuleConfig.ts`
- Thêm rule: bật `enableAutoPostGenerator` => auto bật `enableHtmlRender` và field linked tương ứng (như repo chuẩn).

#### 1.4 Đồng bộ Convex API cho generator
- File: `convex/posts.ts`
- Thêm imports generator libs.
- Thêm validator request generator.
- Thêm helper lấy settings/saleMode/data products.
- Thêm queries:
  - `generateFromProductsPreview`
  - `regenerateFromDraftSeed`
- Thêm mutation:
  - `createFromGeneratedPayload`

#### 1.5 Đồng bộ UI tạo bài viết admin
- File: `app/admin/posts/create/page.tsx`
- Thêm toàn bộ block generator:
  - chọn mục tiêu template
  - nhập params theo template (keyword/budget/compare/category/selected products)
  - preview generated article
  - regenerate
  - apply vào form (title, slug, htmlRender, excerpt, meta, thumbnail)
  - gallery modal behavior (nếu repo chuẩn có)
- Đồng bộ tích hợp với `LexicalEditor` reset/apply flow theo repo chuẩn.

#### 1.6 Đồng bộ trang edit posts (nếu lệch)
- File: `app/admin/posts/[id]/edit/page.tsx`
- Kiểm tra parity logic generator/apply tương tự create (theo diff thực tế tại thời điểm triển khai).

**Tiêu chí hoàn thành Phase 1**:
- Có thể bật setting generator và thấy UI generator hoạt động đầy đủ ở create post.
- Query preview/regenerate trả payload hợp lệ.
- Apply payload điền đúng các trường post.

---

### Phase 2 — Image storage lifecycle parity (P0)
**Mục tiêu**: Đồng bộ naming + tracking storageId + cleanup storage không còn tham chiếu.

#### 2.1 Bổ sung file naming còn thiếu
- Tạo mới: `lib/image/uploadNaming.ts`
- Export đầy đủ: `MIME_EXTENSION_MAP`, `ImageNamingContext`, `slugify`, `getExtensionFromMime`, `resolveNamingContext`, `buildImageFilename`.

#### 2.2 Đồng bộ upload pipeline
- File: `lib/image/uploadPipeline.ts`
- Thêm hỗ trợ options `naming`.
- Dùng `buildImageFilename` khi có naming; fallback legacy khi không có.

#### 2.3 Đồng bộ các uploader admin
Cập nhật các file sau để truyền/nhận `storageId`, `naming`, `deleteMode` theo chuẩn:
- `app/admin/components/ImageUploader.tsx`
- `app/admin/components/ImageUpload.tsx`
- `app/admin/components/ImageFieldWithUpload.tsx`
- `app/admin/components/MultiImageUploader.tsx`
- `app/admin/components/SettingsImageUploader.tsx`
- `app/admin/components/CategoryImageSelector.tsx`
- (nếu có dùng) `app/admin/components/LexicalEditor.tsx` và `nodes/ImageNode.tsx` phần image upload contract.

#### 2.4 Đồng bộ media page
- File: `app/admin/media/page.tsx`
- Dùng `resolveNamingContext(...)` trước `prepareImageForUpload(...)` để chuẩn hóa tên ảnh upload hàng loạt.

#### 2.5 Mở rộng schema Convex để track storage
- File: `convex/schema.ts`
- Bổ sung trường:
  - products: `imageStorageId`, `imageStorageIds`
  - posts/services: `thumbnailStorageId`

#### 2.6 Đồng bộ model/types Convex
- File: `convex/model/posts.ts`
- File: `convex/model/services.ts`
- Cập nhật input/update validators tương ứng `thumbnailStorageId`.

#### 2.7 Đồng bộ cleanup mutation ở storage
- File: `convex/storage.ts`
- Thêm `cleanupStorageIfUnreferenced` quét references products/posts/services và xóa storage nếu unreferenced.

#### 2.8 Gắn cleanup vào update flows
- File: `convex/products.ts`
- File: `convex/posts.ts`
- File: `convex/services.ts` (nếu repo chuẩn có)
- Logic: khi đổi/xóa storageId cũ => gọi `api.storage.cleanupStorageIfUnreferenced`.

**Tiêu chí hoàn thành Phase 2**:
- Upload ảnh lưu được URL + storageId.
- Khi thay ảnh, storage cũ được cleanup đúng điều kiện reference.
- Naming ảnh đúng chuẩn entity-field-index khi có context.

---

### Phase 3 — Site behavior parity (P1)
**Mục tiêu**: Đồng bộ ổn định hiển thị ảnh product detail.

#### 3.1 Product detail image safety
- File: `app/(site)/products/[slug]/page.tsx`
- Bổ sung/đồng bộ:
  - `isValidImageSrc`
  - `buildProductImages` (dedup, normalize)
  - guard selected index (`safeSelectedImage*`)
  - `BlurredProductImage` nhận src nullable + guard render.

**Tiêu chí hoàn thành Phase 3**:
- Không out-of-range khi thiếu/đổi số lượng ảnh.
- Không render lỗi khi ảnh null/empty.

---

### Phase 4 — SEO parity (P1)
**Mục tiêu**: Đồng bộ tối ưu LCP hero image.

#### 4.1 Landing hero priority
- File: `components/seo/LandingHeroImage.tsx`
- Thêm `priority={isHero}` và `fetchPriority={isHero ? 'high' : undefined}` như repo chuẩn.

**Tiêu chí hoàn thành Phase 4**:
- Hero image được đánh dấu ưu tiên tải ở viewport đầu.

---

### Phase 5 — Residual parity sweep (P2)
**Mục tiêu**: Quét các file lệch còn lại để đạt full parity gần nhất.

1. Re-run diff filtered theo từng folder lớn.
2. Resolve các file còn M/D nhưng ảnh hưởng behavior thực tế.
3. Ưu tiên xử lý các file admin create/edit còn lệch:
   - `app/admin/products/create/page.tsx`
   - `app/admin/products/[id]/edit/page.tsx`
   - `app/admin/services/create/page.tsx`
   - `app/admin/services/[id]/edit/page.tsx`
   - `app/admin/home-components/...` (clients/team/category hero) nếu behavior lệch.

**Tiêu chí hoàn thành Phase 5**:
- Diff còn lại chủ yếu là comment/style nhỏ hoặc file intentionally diverged đã được ghi chú.

---

### Phase 6 — Parity verification gate
**Mục tiêu**: Đảm bảo parity có kiểm soát trước khi chốt.

1. Re-run `git diff --no-index --name-status` cho toàn bộ vùng scope.
2. Đối chiếu từng cụm tính năng với checklist pass/fail.
3. Review tĩnh: typing contract, null-safety, backward compatibility dữ liệu cũ.
4. Chốt danh sách file đã parity + file intentionally different (nếu có).

## Rủi ro chính và kiểm soát
- **R1**: Copy code generator nhưng lệch type contract hiện tại → xử lý bằng thứ tự import/types trước.
- **R2**: Cleanup storage xóa nhầm ảnh còn tham chiếu → giữ guard `scan_limit`, check cross-tables trước delete.
- **R3**: UI generator lớn dễ conflict với local customizations → áp dụng theo block, commit nhỏ theo phase.
- **R4**: Schema changes ảnh hưởng dữ liệu cũ → dùng optional fields + fallback logic.

## Verification Plan
- Verification tĩnh theo phase (không mở rộng scope ngoài parity):
  1. Sau mỗi phase, re-diff đúng nhóm file vừa làm để xác nhận parity thực sự.
  2. Kiểm tra compile contract (types/args/returns) giữa `app` ↔ `convex` ↔ `lib`.
  3. Soát null/undefined cho ảnh, storageId, generator payload.
  4. Cuối cùng chạy parity sweep tổng và xuất bảng `Done / Remaining / Intentional diff`.

## Thứ tự thực thi đề xuất
1) Phase 1 (Auto Generator) → 2) Phase 2 (Image lifecycle) → 3) Phase 3 (Product detail safety) → 4) Phase 4 (SEO) → 5) Phase 5 & 6 (sweep + gate).