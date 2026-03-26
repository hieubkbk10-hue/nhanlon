## Audit Summary
- Observation: Bạn báo “đã lưu thành công nhưng form không ẩn ngay”, và trước đó detail `/posts/[slug]` có lúc vẫn 404 tạm thời sau khi chuyển từ hẹn giờ sang xuất bản ngay.
- Observation: Hiện logic đang so sánh trực tiếp `publishedAt > Date.now()` ở 3 điểm quan trọng:
  1) `app/(site)/posts/[slug]/layout.tsx` (quyết định 404),
  2) `app/(site)/posts/[slug]/page.tsx` (isVisiblePost),
  3) `app/admin/posts/[id]/edit/page.tsx` (suy ra `isScheduled` để ẩn/hiện form giờ).
- Inference: Khi `publishImmediately` set `publishedAt = Date.now()` từ backend, nếu có lệch clock nhỏ giữa môi trường (Convex/server/browser), timestamp có thể bị coi là “vẫn ở tương lai” trong vài giây → gây cảm giác không mượt: form có thể bật lại mode hẹn giờ hoặc trang detail tạm 404.
- Counter-hypothesis đã loại trừ ở mức cao:
  - Không còn lỗi schema `publishImmediately` (đã fix).
  - Không phải lỗi validator args mutation.

## Root Cause Confidence
- Medium-High — triệu chứng khớp mạnh với race/time-skew khi so sánh thời gian tuyệt đối không có tolerance.
- Expected vs actual:
  - Expected: vừa chuyển “Xuất bản ngay” và lưu thì UI/detail phản ánh ngay là đã xuất bản.
  - Actual: có thể phải mở lại/lặp thao tác vì hệ thống tạm coi là chưa tới giờ.

## Proposal (fix tối thiểu, an toàn rollback)
1. Chuẩn hóa helper kiểm tra “đang hẹn giờ” có tolerance nhỏ (ví dụ 30 giây):
   - `isScheduledTs = publishedAt > Date.now() + SKEW_TOLERANCE_MS`.
2. Áp dụng helper đồng bộ ở 3 nơi:
   - `app/(site)/posts/[slug]/layout.tsx`: điều kiện `notFound()`.
   - `app/(site)/posts/[slug]/page.tsx`: `isVisiblePost`.
   - `app/admin/posts/[id]/edit/page.tsx`: xác định `isScheduled` khi hydrate form.
3. Giữ nguyên contract `publishImmediately` hiện tại (không mở rộng schema/table, không đổi API behavior khác).
4. Tối ưu UX sau lưu ở edit:
   - Sau `updatePost` thành công, nếu vừa lưu `publishImmediately=true`, giữ state local ở mode “xuất bản ngay” ổn định (không để nháy về hẹn giờ trong lúc query refresh).

## Verification Plan
- Static verify:
  - Không còn so sánh trực tiếp `publishedAt > Date.now()` ở 3 điểm nêu trên.
  - Không phát sinh field mới trong schema `posts`.
- Repro checklist:
  1. Mở bài đang scheduled trong admin edit.
  2. Bật “Xuất bản ngay” và lưu.
  3. Ngay sau toast thành công: form giờ phải ẩn ổn định.
  4. Mở ngay `/posts/[slug]`: không 404.
  5. Chuyển lại hẹn giờ tương lai và lưu: vẫn ẩn trên site đúng như trước.

Nếu bạn duyệt, tôi sẽ implement đúng patch nhỏ theo hướng tolerance + đồng bộ check để loại triệt để cảm giác “không mượt” khi chuyển từ hẹn giờ sang xuất bản ngay.