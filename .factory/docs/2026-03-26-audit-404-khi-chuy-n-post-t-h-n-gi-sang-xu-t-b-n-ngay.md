## Audit Summary
- Observation: Lỗi tái hiện theo luồng user xác nhận: edit bài đang hẹn giờ, chuyển sang `Xuất bản ngay`, lưu xong vào detail `/posts/[slug]` vẫn 404.
- Observation: Route detail đang chặn mọi bài có `post.publishedAt > Date.now()` tại `app/(site)/posts/[slug]/layout.tsx`, nên 404 nghĩa là `publishedAt` tương lai vẫn chưa được clear/đổi về hiện tại.
- Observation: Ở form edit, khi bật `Xuất bản ngay`, code đang gọi `updatePost({ publishedAt: undefined, status: 'Published' })` trong `app/admin/posts/[id]/edit/page.tsx`.
- Observation: Ở backend, `convex/model/posts.ts` chỉ set lại `publishedAt` nếu `hasPublishedAt === true`; còn nếu key không hiện diện và post đã là `Published` thì giữ nguyên `publishedAt` cũ.
- Observation: Với Convex optional arg, `publishedAt: undefined` nhiều khả năng không đi qua validator như một key hiện diện, nên `hasPublishedAt` thành `false`.

## Root Cause Confidence
- High — root cause chính là contract giữa frontend và backend chưa đủ rõ cho case “Published scheduled -> Published immediate”.
- Expected vs actual:
  - Expected: bật `Xuất bản ngay` phải đổi `publishedAt` từ tương lai về `Date.now()` hoặc clear lịch cũ.
  - Actual: backend giữ nguyên `publishedAt` tương lai, nên route public tiếp tục coi bài là chưa tới giờ.
- Scope ảnh hưởng: edit post đã hẹn giờ trong admin posts; create mới không phải đường lỗi chính theo repro hiện có.
- Repro stability: ổn định khi bài đang `Published` + có `publishedAt` tương lai, rồi lưu với toggle `Xuất bản ngay`.
- Counter-hypothesis đã xem xét:
  1. Không phải lỗi route detail riêng lẻ, vì route chỉ phản ánh đúng dữ liệu `publishedAt` hiện còn ở tương lai.
  2. Không phải lỗi query `getBySlug`, vì slug vẫn tìm ra post; 404 đến từ guard visibility.
- Rủi ro nếu fix sai: có thể làm hỏng luồng scheduled hiện có, hoặc vô tình publish ngay các bài vẫn muốn giữ lịch.
- Pass/fail:
  - Pass: edit bài scheduled -> bật `Xuất bản ngay` -> save -> detail không còn 404.
  - Pass: edit bài scheduled nhưng vẫn giữ hẹn giờ -> detail vẫn 404 trước giờ.

## Proposal
1. Chuẩn hóa contract backend cho thao tác “publish ngay” trên bài đã scheduled.
2. Hướng fix đề xuất tối thiểu:
   - `convex/posts.ts` và `convex/model/posts.ts`
   - thêm một cờ explicit, ví dụ `publishImmediately: v.optional(v.boolean())` hoặc tên tương đương.
3. Logic backend mới:
   - nếu `status !== 'Published'` -> clear `publishedAt` như hiện tại.
   - nếu `status === 'Published'` và `publishImmediately === true` -> force `publishedAt = Date.now()`.
   - nếu `status === 'Published'` và có `publishedAt` number -> dùng lịch đó.
   - nếu `status === 'Published'` nhưng không có explicit signal -> giữ behavior hiện tại.
4. Frontend edit/create:
   - khi toggle `Xuất bản ngay` bật -> gửi explicit signal `publishImmediately: true`.
   - khi toggle tắt -> gửi `publishImmediately: false` + `publishedAt` đã chọn.
5. Giữ nguyên guard public hiện tại vì nó đang đúng; chỉ cần sửa dữ liệu đầu vào để không bị kẹt lịch cũ.

## Verification Plan
- Static verify:
  - Soát type ở create/edit page và Convex mutation args.
  - Soát 3 case: scheduled -> immediate, immediate -> scheduled, scheduled giữ nguyên.
- Repro checklist:
  1. Mở bài đang scheduled.
  2. Bật `Xuất bản ngay`.
  3. Lưu thành công.
  4. Mở `/posts/[slug]` không còn 404.
  5. Tắt lại toggle, chọn giờ tương lai, lưu.
  6. Mở detail lại phải 404 trước giờ hẹn.

Nếu bạn duyệt, tôi sẽ sửa theo hướng explicit signal này để tránh lệ thuộc vào `undefined` bị Convex bỏ key.