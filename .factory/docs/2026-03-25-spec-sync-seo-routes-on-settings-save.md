## Audit Summary
- Observation: hiện tại `site_url` được lưu tại `/admin/settings` qua `setMultiple`, nhưng không có bước invalidation sau khi save.
- Observation: để tránh stale, ta đã set `dynamic = 'force-dynamic'` cho `robots/sitemap`; cách này luôn đúng dữ liệu nhưng query mỗi request.
- Observation: codebase chưa có cơ chế `revalidatePath/revalidateTag` sẵn.
- Decision: theo lựa chọn của anh (Option A), chuyển sang mô hình **purge khi lưu settings** để đảm bảo đồng bộ chủ động, không phụ thuộc việc user/crawler ghé route nào.

## Root Cause Confidence
High — vì sau save settings không có signal nào báo Next refresh cache cho nhóm SEO routes; đồng bộ đang phụ thuộc chiến lược render của từng route thay vì event lưu settings.

## Implementation Plan
1. Tạo API nội bộ để trigger revalidation cho SEO routes.
   - File mới: `app/api/internal/seo/revalidate/route.ts`
   - `POST` với secret token (đọc từ env, ví dụ `SEO_REVALIDATE_SECRET`) để tránh gọi trái phép.
   - Trong handler: gọi `revalidatePath('/robots.txt')`, `revalidatePath('/sitemap.xml')`, `revalidatePath('/sitemap/static.xml')`, `revalidatePath('/sitemap/posts.xml')`, `revalidatePath('/sitemap/products.xml')`, `revalidatePath('/sitemap/services.xml')`, `revalidatePath('/sitemap/landings.xml')`.
   - Trả JSON `{ revalidated: true }`.

2. Gọi endpoint purge ngay sau khi lưu settings thành công.
   - Sửa `app/admin/settings/page.tsx` trong `handleSave`:
     - Sau `await setMultiple(...)` và trước `toast.success`, gọi `fetch('/api/internal/seo/revalidate', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-seo-revalidate-secret': ... }})`.
     - Nếu purge fail: không rollback save settings, chỉ log warning + toast nhẹ (“Đã lưu, đang chờ đồng bộ SEO”).

3. Chuyển robots/sitemap từ force-dynamic sang cache + revalidate theo event.
   - Cập nhật các file SEO routes đã đổi trước đó:
     - bỏ `dynamic = 'force-dynamic'`
     - giữ logic đọc `site_url` như hiện tại (helper chung).
   - Lý do: mục tiêu là “đồng bộ khi save” thay vì “query mỗi request”.

4. Giữ helper domain chung.
   - Duy trì `lib/seo/site-url.ts` để tránh lệch logic normalize/fallback giữa `llms`, `robots`, `sitemap`.

5. Không mở rộng scope.
   - Không sửa schema Convex, không đổi UI luồng khác ngoài save settings + SEO routes.

## Verification Plan
- Typecheck: `bunx tsc --noEmit`.
- Repro thủ công:
  1. Đổi `site_url` ở `/admin/settings` sang domain A, bấm lưu.
  2. Mở `/robots.txt` + `/sitemap.xml` + các sitemap con => tất cả dùng domain A.
  3. Đổi `site_url` sang domain B, bấm lưu.
  4. Mở lại các route => phải đồng bộ sang domain B ngay, không cần chờ crawler ghé trước.
- Negative test:
  - Gọi API revalidate thiếu/sai secret => bị 401/403.

Nếu anh duyệt spec này, em implement đầy đủ theo đúng phạm vi trên.