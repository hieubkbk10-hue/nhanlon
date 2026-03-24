## Audit Summary
**Observation (evidence):**
- So sánh `git diff --no-index -w --ignore-cr-at-eol` giữa 2 repo cho thấy khác biệt lớn ở `app/components/convex/lib` (app: `99 files changed, 6853 insertions`...).
- Cụm **feature mới rõ ràng** từ core:
  1) **HomepageCategoryHero** (nhiều file mới hoàn toàn):
     - `app/admin/home-components/homepage-category-hero/**` (form/preview/create/edit/types/lib)
     - `components/site/HomepageCategoryHeroSection.tsx`
     - wiring ở `components/site/ComponentRenderer.tsx`, `lib/home-components/componentTypes.ts`, `app/admin/home-components/create/shared.tsx`
     - backend hỗ trợ auto-generate: `convex/productCategories.ts` có `listActiveWithStats`, `listActiveWithStatsForHero`
  2) **SEO verification config động**:
     - `app/system/seo/_components/SeoSiteVerificationPanel.tsx` + gắn vào `app/system/seo/page.tsx`
     - `app/layout.tsx` đổi từ hardcode verification -> `generateMetadata()` đọc setting SEO.
- Cụm phụ đáng giá (đều là feature/UX tăng cường, không phải bugfix bắt buộc):
  - `app/admin/context/SidebarContext.tsx` + `HomeComponentStickyFooter.tsx` (sticky footer bám trạng thái collapse sidebar)
  - `components/site/loading/HomePageLoading.tsx` + `app/(site)/_components/HomePageClient.tsx` (skeleton homepage tốt hơn)
  - `app/admin/contact-inbox/[id]/page.tsx` + nâng cấp list inbox + `convex/contactInbox.ts` (count/list ids/bulk delete/detail update).

**Inference:**
- Copy wholesale toàn bộ file lớn (đặc biệt `Header.tsx`, `ComponentRenderer.tsx`) rủi ro cao vì local đã customize nhiều.
- Nên áp dụng chiến lược **"an toàn mặc định, tùy file"**: file mới thì add nguyên bản; file lớn thì cherry-pick theo khối logic.

**Decision (theo lựa chọn của anh):**
- Làm **cả hai cụm** (HomepageCategoryHero + SEO verification) theo **phase**.
- Với Hero: target **full parity core**.
- Với merge strategy: **tùy file, an toàn mặc định**.
- Trình bày cả plan tổng + chi tiết file.

---

## Root Cause Confidence
**High** — Khác biệt feature đã có evidence trực tiếp từ danh sách file `A` mới trong core + đối chiếu nội dung từng file chính (read-only):
- Hero: toàn bộ cụm `homepage-category-hero` + runtime section + query backend tương ứng.
- SEO verification: panel + wiring SEO page + root layout metadata động.
Không có ambiguity lớn về "cái gì là feature mới".

---

## Plan tổng theo phase (ưu tiên rollback dễ)

### Phase 1 — SEO verification động (nhanh, ít phụ thuộc)
**Mục tiêu:** bỏ hardcode token trong `app/layout.tsx`, quản lý token ở `/system/seo`.

**Thay đổi chính:**
1. Add `app/system/seo/_components/SeoSiteVerificationPanel.tsx`.
2. Update `app/system/seo/page.tsx` để render panel trong tab Overview.
3. Update `app/layout.tsx`:
   - chuyển `metadata` tĩnh -> `generateMetadata()`
   - đọc token qua `getSEOSettings()`
   - map `google` + `msvalidate.01`.

**Kỳ vọng:**
- Feature SEO verification hoạt động mà không ảnh hưởng luồng khác.

---

### Phase 2 — HomepageCategoryHero full parity (core feature)
**Mục tiêu:** thêm loại home-component mới đầy đủ create/edit/preview/runtime + auto-generate từ data thực.

**Thay đổi chính (file-level):**

#### 2.1 Add cụm file mới (copy nguyên từ core)
- `app/admin/home-components/create/homepage-category-hero/page.tsx`
- `app/admin/home-components/homepage-category-hero/[id]/edit/page.tsx`
- `app/admin/home-components/homepage-category-hero/_components/HomepageCategoryHeroForm.tsx`
- `app/admin/home-components/homepage-category-hero/_components/HomepageCategoryHeroPreview.tsx`
- `app/admin/home-components/homepage-category-hero/_lib/auto-generate.ts`
- `app/admin/home-components/homepage-category-hero/_lib/colors.ts`
- `app/admin/home-components/homepage-category-hero/_lib/constants.ts`
- `app/admin/home-components/homepage-category-hero/_lib/icon-options.ts`
- `app/admin/home-components/homepage-category-hero/_lib/useHomepageCategoryHeroAutoGenerate.ts`
- `app/admin/home-components/homepage-category-hero/_types/index.ts`
- `components/site/HomepageCategoryHeroSection.tsx`

#### 2.2 Wiring bắt buộc
- `lib/home-components/componentTypes.ts`
  - thêm type `HomepageCategoryHero` vào registry.
- `app/admin/home-components/create/shared.tsx`
  - thêm icon map + expose type trong create form.
- `components/site/ComponentRenderer.tsx`
  - import + render case `HomepageCategoryHero` với color mode/secondary tokens.

#### 2.3 Backend data cho auto-generate
- `convex/productCategories.ts`
  - bổ sung `listActiveWithStats`
  - bổ sung `listActiveWithStatsForHero`
  - giữ nguyên API cũ.

**Kỳ vọng:**
- Có thể tạo/edit component mới trong admin.
- Preview và site render đúng theo config Hero danh mục.
- Auto-generate menu từ categories/products hoạt động.

---

### Phase 3 — Full parity phụ trợ theo lựa chọn “full parity core”
**Mục tiêu:** hoàn thiện UX parity đi kèm core mà không ảnh hưởng business cũ.

#### 3.1 Sticky footer theo trạng thái sidebar admin
- Add `app/admin/context/SidebarContext.tsx`
- Update `app/admin/layout.tsx` để bọc `SidebarProvider`
- Update `app/admin/components/Sidebar.tsx` dùng shared sidebar state
- Add `app/admin/home-components/_shared/components/HomeComponentStickyFooter.tsx`
- Update các page create/edit home-components dùng sticky footer (ưu tiên file đã khác biệt nhiều theo core).

#### 3.2 Homepage loading skeleton
- Add `components/site/loading/HomePageLoading.tsx`
- Update `app/(site)/_components/HomePageClient.tsx` sử dụng skeleton với delay/min-display.

#### 3.3 Contact inbox nâng cấp
- Add `app/admin/contact-inbox/[id]/page.tsx`
- Update `app/admin/contact-inbox/page.tsx` (table utilities, bulk actions, paging tốt hơn)
- Update `convex/contactInbox.ts` (countAdmin, listAdminIds, getById, updateInquiry, remove, bulkRemove).

**Kỳ vọng:**
- UX admin đồng bộ core cho các màn quan trọng.

---

## Kế hoạch chi tiết theo file (cherry-pick an toàn mặc định)

### Nhóm A — Add nguyên bản (rủi ro thấp)
- Toàn bộ file mới (`A`) liệt kê ở 3 phase trên.
- Lý do: không đè custom local, rollback đơn giản bằng xoá file mới.

### Nhóm B — Update chọn lọc (rủi ro trung bình)
1. `app/layout.tsx`: chỉ patch metadata section + import cần thiết, giữ nguyên font/providers local.
2. `components/site/ComponentRenderer.tsx`: chỉ thêm import/case `HomepageCategoryHero`; không copy full file.
3. `lib/home-components/componentTypes.ts`: chèn thêm type mới đúng position.
4. `app/admin/home-components/create/shared.tsx`: chèn icon/type mới; không đổi behavior khác.
5. `convex/productCategories.ts`: append query mới, tránh chạm sâu logic cũ ngoài phạm vi.
6. `app/admin/layout.tsx`, `app/admin/components/Sidebar.tsx`: patch tối thiểu để đưa shared sidebar state.
7. `app/(site)/_components/HomePageClient.tsx`: thay loading block bằng skeleton flow, giữ contract component hiện có.
8. `app/admin/contact-inbox/page.tsx`, `convex/contactInbox.ts`: merge theo từng function mới, tránh rewrite toàn bộ nếu không cần.

### Nhóm C — Không đụng (để tránh kéo bug/behavior drift)
- Không copy wholesale các refactor lớn không cần cho mục tiêu feature (đặc biệt phần unrelated trong Header/site pages ngoài scope).
- Không kéo docs/changelog/README.

---

## Risk & rollback
- Mỗi phase là 1 commit độc lập, rollback theo phase rất dễ.
- Nếu Hero runtime có issue: disable bằng cách không thêm type vào `componentTypes` hoặc tắt component active.
- SEO phase rollback cực nhanh: revert `app/layout.tsx` + remove panel import.

---

## Verification Plan
(Theo guideline repo: **không tự chạy lint/test/build**)

### Type/static checks (được phép theo guideline commit)
- Khi bắt đầu implementation code TS: chạy `bunx tsc --noEmit` trước commit.

### Repro checklist thủ công (để tester xác nhận)
1. **SEO verification**
   - Vào `/system/seo` tab Overview thấy panel token.
   - Lưu token Google/Bing, reload trang, kiểm tra metadata verification được inject.
2. **HomepageCategoryHero**
   - `/admin/home-components/create` thấy type mới.
   - Tạo component Hero danh mục, lưu thành công.
   - Edit component, auto-generate hoạt động, preview đổi theo style.
   - Trang chủ render component mới đúng.
3. **Parity phụ trợ**
   - Sidebar collapse/expand -> sticky footer căn đúng left offset.
   - Homepage loading hiển thị skeleton thay spinner cũ.
   - Contact inbox: mở detail, cập nhật status/content, bulk delete hoạt động.

### Pass/Fail
- Pass khi cả 3 cụm trên hoạt động end-to-end, không làm hỏng các route hiện có trong admin/site.
- Fail nếu có regression ở layout/site header/home-components rendering.

---

Nếu anh duyệt spec này, em sẽ triển khai tuần tự **Phase 1 -> Phase 2 -> Phase 3**, commit theo từng phase để dễ kiểm soát.