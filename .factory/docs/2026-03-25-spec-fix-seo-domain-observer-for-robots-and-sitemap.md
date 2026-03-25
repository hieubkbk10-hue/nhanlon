## Audit Summary
- Observation: `llms.txt` đang đọc domain mới từ settings qua `getSiteSettings()` và build lại text mỗi request, nên user thấy đúng domain mới (`app/llms.txt/route.ts`).
- Observation: `/robots.txt` và `/sitemap.xml` đang đọc `site_url` trực tiếp từ Convex, nhưng đều nằm trong metadata routes của Next (`app/robots.ts`, `app/sitemap.ts`). Các sitemap con cũng là `GET` route riêng dưới `app/sitemap/*/route.ts` và đều dùng `resolveBaseUrl()`.
- Observation: Không có `dynamic = 'force-dynamic'`, `revalidate = 0`, hay cơ chế invalidation nào trên các route SEO này. Trong codebase chỉ có vài API route khác được đánh dấu dynamic, còn nhóm SEO thì không.
- Observation: Admin settings lưu `site_url` qua `api.settings.setMultiple` trong `app/admin/settings/page.tsx`, nên dữ liệu nguồn đã được cập nhật; bằng chứng gián tiếp là `llms.txt` đã phản ánh domain mới.
- Inference: Vấn đề không nằm ở form `/admin/settings` hay mutation Convex, mà nằm ở lớp render/cache của Next cho `robots/sitemap` và các sitemap XML segment.
- Decision: Sửa theo hướng buộc toàn bộ route SEO phụ thuộc `site_url` chạy dynamic, đồng thời gom logic resolve domain để tránh lệch hành vi giữa `llms`, `robots`, `sitemap`, và các sitemap con.

## Root Cause Confidence
High — vì có evidence nhất quán:
1. Triệu chứng: `llms.txt` ra domain mới, còn `robots.txt` và `sitemap.xml` vẫn giữ domain cũ.
2. Phạm vi ảnh hưởng: chỉ nhóm route SEO public sinh absolute URL (`/robots.txt`, `/sitemap.xml`, `/sitemap/*.xml`).
3. Tái hiện ổn định: chỉ cần đổi `site_url` trong `/admin/settings` từ domain demo sang domain thật.
4. Giả thuyết thay thế đã loại trừ phần lớn: nếu settings không lưu được thì `llms.txt` cũng phải sai; nhưng thực tế `llms.txt` đúng.
5. Tiêu chí pass/fail rõ: sau sửa, đổi `site_url` rồi reload các endpoint SEO phải thấy domain mới ngay, không còn `chinhanstore.vercel.app`.
6. Root cause hợp lý nhất: các route SEO hiện không khai báo dynamic/invalidation nên bị cache/prerender theo domain cũ; Convex HTTP query không tự tạo invalidation cho Next metadata routes.

## Proposal
1. Tạo một helper dùng chung để resolve canonical site URL từ settings, normalize trailing slash, và reject giá trị rỗng / `https://example.com`.
   - Dự kiến dùng lại cho `app/robots.ts`, `app/sitemap.ts`, `lib/seo/sitemap-xml.ts`, và nếu hợp lý thì `app/llms.txt/route.ts` để đồng bộ hành vi.
2. Đánh dấu dynamic rõ ràng cho các endpoint SEO phụ thuộc `site_url`:
   - `app/robots.ts`
   - `app/sitemap.ts`
   - `app/sitemap/static.xml/route.ts`
   - `app/sitemap/posts.xml/route.ts`
   - `app/sitemap/products.xml/route.ts`
   - `app/sitemap/services.xml/route.ts`
   - `app/sitemap/landings.xml/route.ts`
3. Giữ thay đổi nhỏ, không đụng UI `/admin/settings`, không đổi schema Convex, không mở rộng scope sang metadata/layout khác.
4. Sau khi sửa code, chạy đúng quy định repo: chỉ `bunx tsc --noEmit` vì có thay đổi TS, không chạy lint/test/build.
5. Commit local sau khi verify tĩnh xong, theo rule của repo.

## Counter-Hypothesis
- Hypothesis A: `site_url` lưu sai key hoặc save mutation không chạy.
  - Bị phản biện bởi `llms.txt` đang ra domain mới từ cùng nguồn settings.
- Hypothesis B: chỉ `app/sitemap.ts` bị cache, còn sitemap con không bị.
  - Chưa đủ evidence để loại trừ, nên spec sẽ sửa đồng bộ cả sitemap index + các sitemap XML con để tránh lệch hành vi.
- Hypothesis C: base URL fallback từ env đang override settings.
  - Ít khả năng hơn vì code đang ưu tiên `site_url` trước env ở cả `robots.ts`, `sitemap.ts`, `resolveBaseUrl()`, `llms.txt/route.ts`.

## Post-Audit / Expected Outcome
- `/robots.txt` phản ánh domain mới ngay sau khi đổi ở `/admin/settings`.
- `/sitemap.xml` và mọi `/sitemap/*.xml` không còn giữ absolute URL của domain demo.
- Logic lấy domain thống nhất, dễ rollback, ít rủi ro.

## Verification Plan
- Static review:
  - Soát các file đã sửa để bảo đảm tất cả route SEO phụ thuộc domain đều có cùng chiến lược dynamic.
  - Soát null-safety/fallback cho `site_url`.
- Type check:
  - Chạy `bunx tsc --noEmit`.
- Repro checklist cho tester:
  1. Đổi `site_url` trong `/admin/settings` sang domain A, lưu.
  2. Mở `/llms.txt`, `/robots.txt`, `/sitemap.xml`, `/sitemap/static.xml` để xác nhận tất cả cùng ra domain A.
  3. Đổi tiếp sang domain B, lưu.
  4. Reload lại các endpoint trên; pass nếu tất cả phản ánh domain B ngay và không còn domain A/demo.

Nếu bạn duyệt spec này, tôi sẽ tiến hành sửa code theo đúng phạm vi trên.