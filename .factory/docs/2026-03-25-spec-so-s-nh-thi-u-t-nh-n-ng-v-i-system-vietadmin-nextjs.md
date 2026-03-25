## Audit Summary
- **Observation**: Bạn yêu cầu dùng `git diff` để tìm tính năng còn thiếu của repo hiện tại (`E:\NextJS\persional_project\system-nhan`) so với repo chuẩn (`E:\NextJS\study\admin-ui-aistudio\system-vietadmin-nextjs`).
- **Evidence đã có**: Mình đã xác nhận cấu trúc 2 repo tương đồng (`app`, `components`, `convex`, `lib`) và chạy thử `git diff --no-index --name-status` theo từng thư mục; kết quả cho thấy nhiều file `M/D` ở `app/admin/*`, `convex/*`, `lib/*`, `components/seo/*`.
- **Expected vs Actual (#1)**:
  - Expected: có danh sách tính năng thiếu rõ ràng để bổ sung.
  - Actual: mới có mức chênh lệch file thô, chưa map sang “tính năng” theo module.
- **Khả năng tái hiện (#3)**: Có, ổn định; chỉ cần 2 path repo cố định và `git diff --no-index`.
- **Giả thuyết thay thế (#6)**: Chênh lệch file không phải lúc nào cũng là thiếu tính năng (có thể refactor/đổi naming/generated code).
- **Tiêu chí pass/fail (#8)**:
  - Pass: trả ra **(a)** checklist tính năng thiếu theo module + **(b)** file map ưu tiên cao, bám repo chuẩn `system-vietadmin-nextjs`.
  - Fail: chỉ liệt kê diff file mà không kết luận actionable cho việc bổ sung tính năng.

## Root Cause Confidence
- **High**: Nguyên nhân chưa có “danh sách tính năng thiếu” là vì hiện chỉ có diff mức file, chưa làm bước quy chiếu file→module→feature và chưa loại nhiễu (generated/build/docs).

## Proposal (kế hoạch thực thi sau khi bạn duyệt)
1. Chạy diff read-only có lọc nhiễu giữa 2 repo theo các vùng chính: `app`, `components`, `convex`, `lib`, `types`, `scripts`, `next.config.ts`, `package.json`.
2. Loại trừ vùng không phản ánh feature: `.git`, `.next`, `node_modules`, `*.tsbuildinfo`, file generated Convex (`convex/_generated/**`) và docs nội bộ.
3. Với mỗi file chênh lệch, đọc nội dung cần thiết để phân loại thành nhóm tính năng:
   - Admin CRUD/workflow
   - Experience/Home component
   - Media/Image pipeline
   - Convex schema/query/mutation
   - SEO/render/runtime config
4. Tạo **Checklist tính năng thiếu** (ưu tiên P0/P1/P2) theo module, mỗi mục có evidence file-path cụ thể.
5. Tạo **File map triển khai**: file cần thêm/sửa trong repo hiện tại để bắt kịp repo chuẩn.
6. Trả kết quả cho bạn thành 2 phần đúng format bạn chọn: checklist + file map.

## Verification Plan
- Verification ở mức tĩnh/read-only:
  1. Đối chiếu chéo từng feature trong checklist với ít nhất 1 evidence từ repo chuẩn và 1 evidence thiếu ở repo hiện tại.
  2. Đảm bảo không đánh dấu “thiếu” cho các chênh lệch chỉ do generated/build.
  3. Soát lại coverage theo 4 vùng trọng tâm: `app/components/convex/lib` để tránh sót module lớn.