## Audit Summary
- Observation: Sau bản trước, form posts đang dùng `datetime-local` + helper text “Để trống để xuất bản ngay.”, tức vẫn hiển thị input giờ khi `status = Published`.
- Observation: Yêu cầu mới là UX phải rõ hơn: có toggle `Xuất bản ngay`; khi toggle bật thì ẩn form chọn giờ, khi toggle tắt thì hiện form chọn giờ xuất bản.
- Observation: User đã chốt 2 decision ảnh hưởng behavior UX:
  1. Toggle bật = xuất bản ngay, ẩn ô giờ.
  2. Trạng thái mặc định ở create/edit = Xuất bản ngay.

## Root Cause Confidence
- High — vấn đề hiện tại là sai UX contract chứ không phải sai backend.
- Backend `publishedAt` và logic ẩn bài trước giờ đã có thể tái sử dụng; chủ yếu cần đổi state/UI create/edit để tránh pattern “để trống input = publish ngay”, vì pattern này không khớp mong muốn thao tác của user.

## Proposal
1. `app/admin/posts/create/page.tsx`
   - Thay UX hiện tại bằng boolean state `publishImmediately` mặc định `true`.
   - Trong card “Xuất bản”:
     - chỉ khi `status === 'Published'` và scheduling bật mới hiện toggle `Xuất bản ngay`.
     - nếu `publishImmediately = true` => ẩn `datetime-local`.
     - nếu `publishImmediately = false` => hiện input chọn giờ xuất bản.
   - Submit logic:
     - `publishImmediately = true` => gửi `publishedAt: undefined` để backend tự publish ngay.
     - `publishImmediately = false` => convert input thành timestamp và gửi `publishedAt`.

2. `app/admin/posts/[id]/edit/page.tsx`
   - Thêm cùng UX/state `publishImmediately`.
   - Prefill từ dữ liệu bài viết:
     - nếu bài có `publishedAt` ở tương lai => mặc định `publishImmediately = false`, hiện ô giờ với giá trị hiện tại.
     - nếu không có lịch tương lai => `publishImmediately = true`.
   - Nếu user bật lại `Xuất bản ngay`, ẩn ô giờ và save sẽ bỏ lịch cũ.

3. State rules
   - Create mặc định `publishImmediately = true` đúng theo user chọn.
   - Edit mặc định ưu tiên dữ liệu thực tế của bài:
     - bài scheduled => hiện chế độ hẹn giờ để không che mất lịch đang tồn tại.
     - bài publish ngay / bài cũ không có lịch => mặc định xuất bản ngay.
   - Khi `status !== 'Published'`, không hiện toggle và không hiện ô giờ.

4. Scope không đổi
   - Không cần đổi backend/filter public nếu chỉ sửa UX, vì logic `publishedAt` đã có.
   - Không mở rộng thêm behavior khác ngoài toggle + default state.

## Verification Plan
- Static verify:
  - Soát state `publishImmediately` không làm sai `hasChanges` ở edit page.
  - Soát trường hợp đổi qua lại giữa Scheduled ↔ Publish ngay.
- Repro checklist:
  1. Bật scheduling trong module posts.
  2. Vào create: chọn `Đã xuất bản` thấy toggle `Xuất bản ngay` bật sẵn, không thấy ô giờ.
  3. Tắt toggle: ô chọn giờ hiện ra.
  4. Edit bài scheduled: vào form thấy toggle tắt và ô giờ hiện đúng lịch cũ.
  5. Bật lại toggle trong edit rồi lưu: bài trở về publish ngay.

Nếu bạn duyệt spec này, tôi sẽ sửa đúng phần UX như trên.