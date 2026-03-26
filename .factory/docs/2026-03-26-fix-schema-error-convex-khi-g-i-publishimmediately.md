## Audit Summary
- Observation: Lỗi runtime xác nhận từ log: `Object contains extra field publishImmediately that is not in the validator` khi chạy `posts:update`.
- Observation: `publishImmediately` là control flag của mutation args, **không nằm trong schema table `posts`** (validator document không có field này).
- Observation: Trong `convex/model/posts.ts`, `update()` đang tạo `patchData` bằng `const { id, ...updates } = args; const patchData = { ...updates };` nên `publishImmediately` bị đưa vào `ctx.db.patch(...)`.
- Observation: `posts.ts` mutation validator đã chấp nhận `publishImmediately`, nên request qua được API layer nhưng fail ở DB patch layer.
- Counter-hypothesis đã loại trừ:
  1. Không phải lỗi route `/posts/[slug]`.
  2. Không phải lỗi frontend payload format; payload đúng mục tiêu nhưng model đang patch dư key.

## Root Cause Confidence
- High — nguyên nhân trực tiếp là `publishImmediately` bị patch vào document `posts` dù schema không cho phép.
- Expected vs actual:
  - Expected: `publishImmediately` chỉ dùng để tính `publishedAt`, không được lưu vào DB.
  - Actual: `publishImmediately` đi vào `patchData` và bị Convex từ chối.
- Scope ảnh hưởng: mutation `posts.update` (và có thể mọi luồng edit post gửi cờ này).
- Rủi ro nếu fix sai: có thể lại mất hành vi “Xuất bản ngay” hoặc vô tình giữ lịch cũ.
- Pass/fail:
  - Pass: update post không còn throw schema error.
  - Pass: bật “Xuất bản ngay” vẫn force `publishedAt = Date.now()`.

## Proposal
1. Sửa tối thiểu ở `convex/model/posts.ts` trong `update()`:
   - Tách `publishImmediately` khỏi dữ liệu patch:
     - từ `const { id, ...updates } = args`
     - thành `const { id, publishImmediately, ...updates } = args`
   - Dùng biến `publishImmediately` cho logic tính `patchData.publishedAt`.
   - Không để `publishImmediately` xuất hiện trong `patchData` gửi vào `ctx.db.patch`.
2. Giữ nguyên validator mutation ở `convex/posts.ts` (vẫn nhận `publishImmediately`) vì đây là input control hợp lệ.
3. Không đổi schema table `posts`, không thêm field mới vào document.

## Verification Plan
- Static verify:
  - Soát `patchData` không còn chứa `publishImmediately`.
  - Soát nhánh logic:
    - `publishImmediately === true` => `publishedAt = Date.now()`.
    - có `publishedAt` number => dùng giờ hẹn.
- Repro checklist:
  1. Edit bài đang scheduled.
  2. Bật `Xuất bản ngay`, lưu.
  3. Không còn lỗi `[CONVEX M(posts:update)] extra field publishImmediately`.
  4. Mở `/posts/[slug]` không còn 404 do lịch cũ.
  5. Tắt toggle, chọn giờ tương lai, lưu lại vẫn hoạt động đúng.