# I. Primer

## 1. TL;DR kiểu Feynman
- **Mục tiêu**: Nâng cấp toàn bộ mã nguồn của dự án này lên phiên bản mới nhất từ kho mã nguồn chung (Core Viet Admin), sau đó đồng bộ cấu trúc dữ liệu cũ (Convex DB) mà không làm mất dữ liệu hiện tại.
- **Cách làm**:
  1. Dùng Git Squash Merge để lấy toàn bộ code mới từ Core, giải quyết xung đột bằng cách ưu tiên chọn code của Core (`checkout --theirs .`).
  2. Kiểm tra lỗi cú pháp (type check) và định dạng code (lint) cho đến khi sạch sẽ, sau đó commit code mới.
  3. Kiểm tra biến môi trường DB, quét cấu trúc dữ liệu hiện tại để tìm các trường còn thiếu hoặc lỗi thời so với bản thiết kế (schema) mới.
  4. Chạy các hàm sửa lỗi/đồng bộ dữ liệu tự động có sẵn để cập nhật dữ liệu.
- **Kết quả mong đợi**: Mã nguồn mới chạy tốt trên cơ sở dữ liệu cũ, không còn xung đột hay thiếu trường dữ liệu, không có lỗi runtime trên trang quản trị cũng như trang khách hàng.

## 2. Elaboration & Self-Explanation
Chúng ta đang làm việc với một hệ thống được thiết kế theo mô hình "Core Viet Admin". Dự án hiện tại của khách hàng sử dụng mã nguồn cũ hơn nhưng có cơ sở dữ liệu (Convex DB) riêng đang lưu trữ thông tin thực tế. Core Viet Admin đã được cải tiến và sửa nhiều lỗi.
Mục tiêu là mang các cải tiến và bản sửa lỗi này về dự án hiện tại. 
Để làm việc này một cách an toàn và nhanh chóng:
- Ta không gộp (merge) thủ công từng file vì việc này mất thời gian và dễ tạo ra lỗi cấu trúc. Thay vào đó, ta gộp toàn bộ dự án Core đè lên mã nguồn hiện tại bằng cơ chế Squash Merge và `checkout --theirs .` để nhận 100% thay đổi của Core.
- Sau khi đồng bộ mã nguồn, cơ sở dữ liệu Convex của khách hàng có thể có những bảng hoặc trường dữ liệu chưa khớp với schema mới trong Core. Ta sẽ chạy công cụ quét dữ liệu (`scanDataContracts` hoặc hàm kiểm tra hợp đồng dữ liệu tương đương) để chỉ ra các trường bị thiếu (`missing`), được đề xuất (`recommended`), hoặc lỗi thời (`deprecated`).
- Cuối cùng, ta sử dụng các mutation/action đồng bộ dữ liệu đã được viết sẵn trong codebase để điền giá trị mặc định (backfill) cho các trường còn thiếu mà không được tự ý sửa code hay viết thêm kịch bản migration mới.

## 3. Concrete Examples & Analogies
- **Ví dụ cụ thể**: Trong schema mới của Core, bảng `products` có thêm trường `variantMinPrice` và `variantMaxPrice` để tối ưu hóa bộ lọc giá. Cơ sở dữ liệu cũ của khách hàng chưa có các trường này trên các sản phẩm hiện có, dẫn đến việc trang danh sách sản phẩm bị lỗi hiển thị hoặc lọc không đúng. Chúng ta sẽ quét và phát hiện ra sự thiếu sót này (`variantMinPrice: missing`), sau đó kích hoạt mutation đồng bộ giá có sẵn để tự động tính toán và điền giá trị thích hợp cho các sản phẩm hiện tại.
- **Analogy (Ví dụ đời thường)**: Giống như bạn đang nâng cấp hệ điều hành cho điện thoại. Bạn tải bản cập nhật mới nhất (Core Update) cài đè lên máy của mình. Sau khi cài xong, các ứng dụng cũ (Dữ liệu cũ) cần được sắp xếp lại vị trí hoặc điền thêm thông tin tài khoản (Backfill) để tương thích hoàn toàn với giao diện và tính năng mới của hệ điều hành.

# II. Audit Summary (Tóm tắt kiểm tra)
- **Trạng thái Git**: Nhánh hiện tại là `master`, thư mục làm việc sạch sẽ (working tree clean).
- **Cấu hình môi trường**: File `.env.local` đã cấu hình `CONVEX_DEPLOYMENT=dev:aware-hare-895` trỏ tới cơ sở dữ liệu Convex đang hoạt động.
- **Nhánh ở Core**: Remote tạm thời `core-update` trỏ tới `E:\NextJS\study\admin-ui-aistudio\system-vietadmin-nextjs` đã được fetch thành công, nhánh chính là `core-update/master`.

# III. Root Cause & Counter-Hypothesis (Nguyên nhân gốc & Giả thuyết đối chứng)
- **Vấn đề**: Mã nguồn dự án cũ cần tích hợp các tính năng và bản sửa lỗi mới nhất của Core nhưng phải giữ nguyên dữ liệu hiện có.
- **Giải pháp**: Đồng bộ code trước thông qua Squash Merge, giải quyết xung đột bằng cách ưu tiên lấy từ Core, sau đó thực hiện data backfill thông qua database client tools có sẵn.
- **Độ tin cậy giải pháp (Confidence)**: High (Quy trình chuẩn hóa của Viet Admin Core đã được thử nghiệm và hoạt động ổn định trên nhiều dự án tương tự).

# IV. Proposal (Đề xuất)
- **Bước 1**: Thực hiện Squash Merge nhánh `core-update/master` vào nhánh hiện tại.
- **Bước 2**: Sử dụng `git checkout --theirs .` để nhận toàn bộ code mới từ Core.
- **Bước 3**: Chạy `bunx tsc --noEmit` và `bunx oxlint --type-aware --type-check --fix` để đảm bảo code không còn lỗi type hay lint trước khi commit.
- **Bước 4**: Thực hiện commit thay đổi với thông điệp `"chore: sync and upgrade to latest Viet Admin core"`.
- **Bước 5**: Xóa remote tạm, chạy `bun install` để cập nhật dependencies, và khởi động dev server để kiểm tra lỗi runtime.
- **Bước 6**: Quét dữ liệu thực tế bằng cách gọi chức năng kiểm tra hợp đồng dữ liệu có sẵn (`dataManager:scanDataContracts` hoặc API tương tự).
- **Bước 7**: Chạy các mutation/action đồng bộ dữ liệu tương ứng để khắc phục lỗi không tương thích.

# V. Files Impacted (Tệp bị ảnh hưởng)
- **Sửa/Thêm/Xóa**: Toàn bộ dự án sẽ được đồng bộ theo Core (các thay đổi mã nguồn bao gồm components, routes, schema Convex, API functions sẽ được cập nhật trực tiếp từ Core Viet Admin).
- Do đây là quá trình nâng cấp hệ thống lớn (Squash Merge), danh sách file thay đổi sẽ bao gồm hầu hết các file trong dự án. Tuy nhiên, file cấu hình `.env.local` sẽ được giữ lại để đảm bảo kết nối đúng cơ sở dữ liệu hiện tại.

# VI. Execution Preview (Xem trước thực thi)
1. **Gộp nhánh**:
   - `git merge --squash core-update/master --allow-unrelated-histories`
   - `git checkout --theirs .`
   - `git add .`
2. **Kiểm tra và sửa lỗi trước commit**:
   - Chạy kiểm tra type check bằng TypeScript.
   - Chạy Oxlint để sửa tự động các lỗi cú pháp.
3. **Commit & Cài đặt**:
   - Commit thay đổi.
   - Dọn dẹp remote và chạy `bun install`.
4. **Data Migration**:
   - Khởi động Convex Dev Server/Dashboard để quét hợp đồng dữ liệu và chạy backfill.

# VII. Verification Plan (Kế hoạch kiểm chứng)
- **Kiểm tra biên dịch**: Chạy `bunx tsc --noEmit` đạt kết quả 0 lỗi.
- **Kiểm tra định dạng**: Chạy `bunx oxlint` đạt exit 0.
- **Kiểm tra dữ liệu**: Chạy quét hợp đồng dữ liệu hiển thị 0 issues/0 warnings.
- **Kiểm tra hiển thị**: Truy cập giao diện admin và trang site để đảm bảo các surface: Products, Home Components, Settings, và Snapshots render bình thường.

# VIII. Todo
- [ ] Thực hiện Squash Merge mã nguồn từ Core.
- [ ] Checkout toàn bộ code mới (`--theirs .`) và add vào git.
- [ ] Chạy type check (`tsc`) và sửa lỗi nếu có.
- [ ] Chạy linter (`oxlint --fix`) cho đến khi hoàn toàn sạch sẽ.
- [ ] Commit chốt và xóa remote tạm.
- [ ] Cập nhật dependencies với `bun install`.
- [ ] Khởi chạy ứng dụng cục bộ để đảm bảo không lỗi runtime.
- [ ] Kiểm tra deployment Convex hiện tại qua `.env.local`.
- [ ] Tìm kiếm và chạy chức năng kiểm tra hợp đồng dữ liệu (`scanDataContracts`).
- [ ] Thực hiện backfill dữ liệu thiếu thông qua các mutation có sẵn.
- [ ] Quét lại dữ liệu để đảm bảo 0 issues/warnings và verify các surface chính.

# IX. Acceptance Criteria (Tiêu chí chấp nhận)
- Ứng dụng biên dịch thành công không có lỗi type check TypeScript.
- Giao diện Admin khởi động bình thường.
- Cấu trúc dữ liệu khớp hoàn toàn với schema mới (0 lỗi/cảnh báo về Data Contract).

# X. Risk / Rollback (Rủi ro / Hoàn tác)
- **Rủi ro**: Lỗi runtime do không tương thích hoặc mất cấu hình cục bộ.
- **Hoàn tác**: Sử dụng `git reset --hard HEAD` (hoặc commit ID trước khi merge) để khôi phục trạng thái làm việc ban đầu. Dữ liệu Convex có thể được khôi phục hoặc điều chỉnh thủ công nếu phát sinh lỗi trong quá trình backfill dữ liệu thực tế.

# XI. Out of Scope (Ngoài phạm vi)
- Không viết thêm chức năng mới, không thay đổi giao diện ngoài các thay đổi có sẵn trong Core.
- Không sửa đổi schema database Convex thủ công nếu không được định nghĩa sẵn trong Core.
- Không tạo kịch bản migration mới ngoài các function sẵn có.
