## Audit Summary
- Observation: `bunx oxlint --type-aware --type-check --fix` báo 1 warning duy nhất tại `app/(site)/products/[slug]/layout.tsx:59`.
- Observation: Biến `saleModeSetting` được lấy từ `Promise.all(...)` nhưng không được sử dụng ở phần metadata/layout.
- Observation: Đây là cảnh báo `eslint(no-unused-vars)` thuần tĩnh, chưa có evidence cho thấy cần giữ query này để phục vụ side effect nào khác.

## Root Cause Confidence
- High — nguyên nhân trực tiếp là destructuring thừa một phần tử không dùng.
- Expected vs actual:
  - Expected: không còn warning unused variable.
  - Actual: `saleModeSetting` bị khai báo nhưng không dùng.
- Scope ảnh hưởng: chỉ file `app/(site)/products/[slug]/layout.tsx`.
- Rủi ro nếu fix sai: gần như không có nếu chỉ bỏ query/biến thừa; behavior metadata không đổi.

## Proposal
1. Sửa tối thiểu trong `app/(site)/products/[slug]/layout.tsx`:
   - bỏ `saleModeSetting` khỏi destructuring.
   - bỏ luôn `client.query(api.admin.modules.getModuleSetting, { moduleKey: 'products', settingKey: 'saleMode' })` khỏi `Promise.all(...)` nếu thực sự không dùng ở đâu trong file.
2. Không đổi logic metadata, SEO hay rendering khác.
3. Sau khi sửa, verify lại bằng `bunx oxlint --type-aware --type-check --fix` hoặc ít nhất soát tĩnh để đảm bảo warning biến mất.

## Verification Plan
- Static verify:
  - File không còn biến `saleModeSetting`.
  - `Promise.all(...)` vẫn đúng thứ tự với các biến còn lại.
- Repro checklist:
  1. Chạy lại `bunx oxlint --type-aware --type-check --fix`.
  2. Xác nhận không còn warning `no-unused-vars` ở file này.