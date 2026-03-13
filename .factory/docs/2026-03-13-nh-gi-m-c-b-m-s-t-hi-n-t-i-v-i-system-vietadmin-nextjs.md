## Audit Summary
- Observation: `system-nhan/master` hiện đã nằm trên `core/master` mới nhất. Log hiện tại cho thấy `92763858 chore: sync master with core and keep customers/seo deltas` đứng ngay trên `a59805f9 fix: scale footer social and BCT sizes further`.
- Observation: Diff còn lại giữa `core/master...master` chỉ còn 12 file.
- Observation: Trong 12 file đó, có 3 file docs dưới `.factory/docs`, 1 file lock (`bun.lock`), và một số file custom thuộc customers/seo/layout:
  - `app/admin/customers/[id]/edit/page.tsx`
  - `app/admin/customers/create/page.tsx`
  - `app/admin/customers/page.tsx`
  - `app/layout.tsx`
  - `app/opengraph-image.tsx`
  - `app/twitter-image.tsx`
  - `convex/customers.ts`
  - `convex/seed.ts`
  - `lib/seo/metadata.ts`
- Observation: `app/admin/customers/page.tsx` hiện vẫn là trang customers đầy đủ kiểu admin chuẩn (search/filter/sort/pagination/bulk actions), tức không có dấu hiệu “mất module customers”.
- Observation: `app/layout.tsx` và `lib/seo/metadata.ts` cho thấy còn delta riêng ở metadata/SEO/font/provider. Đặc biệt `lib/seo/metadata.ts` đang có dấu hiệu duplicate `resolveBaseUrl`, đây là drift kỹ thuật chứ không phải thiếu tính năng từ SAAS.

## Root Cause Confidence
- Medium-High — Về mặt nền tính năng SAAS: khá sát, vì toàn bộ 12 commit mới từ SAAS đã nằm dưới HEAD hiện tại của `system-nhan`.
- Medium — Chưa thể kết luận “giống hoàn toàn” hoặc “đủ 100%” chỉ từ history, vì vẫn còn delta code ở customers/seo/layout và ít nhất 1 dấu hiệu drift kỹ thuật trong `lib/seo/metadata.ts`.
- Counter-hypothesis: có thể một số delta còn lại chỉ là branding/SEO riêng và không ảnh hưởng feature parity. Nhưng hiện chưa có evidence file-level đầy đủ cho tất cả 9 file code còn khác để khẳng định 100%.

## Kết luận ngắn gọn
- Có: dự án hiện tại đã bám rất sát `system-vietadmin-nextjs` về nền code và lịch sử commit.
- Chưa thể nói “giống hệt và đủ tính năng 100%” vì vẫn còn một lớp delta riêng ở customers/seo/layout/docs/lockfile.
- Nói cách khác: feature base của SAAS đã vào rồi, nhưng repo vẫn chưa clean parity hoàn toàn.

## Proposal
### Option A (Recommend) — Audit và làm sạch delta còn lại để đạt parity gần như hoàn toàn
Confidence 90% — Phù hợp nhất nếu mục tiêu của bạn là “system-nhan gần như clone SAAS, chỉ giữ custom thật sự cần thiết”.
1. So diff từng file code còn lệch với `core/master`.
2. Phân loại mỗi file thành 1 trong 3 nhóm:
   - giữ vì custom business bắt buộc
   - bỏ để theo SAAS hoàn toàn
   - sửa lại vì drift kỹ thuật/lỗi merge
3. Ưu tiên xử lý ngay các file có nguy cơ drift kỹ thuật:
   - `lib/seo/metadata.ts`
   - `app/layout.tsx`
   - `bun.lock`
4. Sau đó review nhóm customers (`app/admin/customers/*`, `convex/customers.ts`, `convex/seed.ts`) để quyết định giữ custom hay trả hẳn về SAAS.
5. Cuối cùng, diff lại để xác nhận chỉ còn đúng custom mong muốn.

### Option B — Chấp nhận trạng thái hiện tại là “đủ sát để tiếp tục phát triển”
Confidence 65% — Phù hợp nếu bạn chỉ cần nền tính năng SAAS đã vào đủ nhiều và sẽ dọn phần lệch sau.
- Upside: không tốn thêm thời gian ngay.
- Tradeoff: drift nhỏ hiện tại có thể gây lệch behavior/SEO/customers về sau, đặc biệt do `lib/seo/metadata.ts` có dấu hiệu chưa sạch.

## File-level focus nếu triển khai tiếp
1. `lib/seo/metadata.ts`
   - Audit duplicate function và chuẩn hóa theo version SAAS hoặc custom version hợp lệ.
2. `bun.lock`
   - Xác nhận lockfile nên theo SAAS hoàn toàn hay theo state dependency thực tế của `system-nhan`.
3. `app/layout.tsx`, `app/opengraph-image.tsx`, `app/twitter-image.tsx`
   - Kiểm tra đây là branding/SEO custom hay drift ngoài ý muốn.
4. Nhóm customers + seed
   - So với SAAS để xác nhận có thiếu feature nào thật không hay chỉ là delta riêng.

## Verification Plan
- Git verify:
  - `git diff --name-status core/master...master` chỉ còn các file custom có chủ đích.
- Code verify tĩnh:
  - đọc từng diff file còn lại để bảo đảm không có duplicate/merge drift.
- Pass:
  - chỉ còn delta riêng có chủ đích, không còn drift kỹ thuật.
- Fail:
  - còn file lệch nhưng không giải thích được lý do business/custom, hoặc có dấu hiệu merge chưa sạch như duplicate logic trong SEO metadata.

Nếu bạn muốn, bước tiếp theo mình sẽ lập kế hoạch cụ thể để audit từng file delta còn lại và kéo `system-nhan` về sát SAAS hơn nữa.