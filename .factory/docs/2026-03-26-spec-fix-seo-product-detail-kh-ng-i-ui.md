## Audit Summary
### Observation
- Trang product detail của bạn hiện truy cập được, robots/canonical/sitemap cơ bản đều có.
- Vấn đề là khả năng index chưa tốt, không phải lỗi render UI hay lỗi route.
- Bạn đã chốt thêm ràng buộc rất rõ: **không đổi UI, không hardcode, chỉ sửa thẻ và SEO**.

### Inference
- Có thể xử lý đúng mục tiêu bằng cách chỉ chạm vào metadata/schema/sitemap signal ở server layer.
- Không cần sửa layout hiển thị, không cần đổi text trên giao diện, không cần thêm block UI mới.

### Decision
- Scope implementation sẽ bị khóa ở mức:
  - chỉ sửa thẻ SEO/server metadata,
  - không đổi DOM/UI nhìn thấy bởi người dùng,
  - không hardcode riêng cho sản phẩm Shiseido hay bất kỳ sản phẩm nào,
  - áp dụng rule động theo dữ liệu product hiện có.

---

## Root Cause Confidence
**High**
1. Triệu chứng: search theo tên sản phẩm chưa ra, dù URL truy cập bình thường.  
2. Phạm vi: product detail SEO/indexability.  
3. Repro: ổn định với query site đã thử.  
4. Giả thuyết bị loại trừ: robots/noindex/canonical lỗi cơ bản.  
5. Tiêu chí pass: URL có thể được index tốt hơn mà không làm thay đổi UI.

---

## Plan fix
### 1) Chuẩn hóa title/meta description động cho product detail
**File:** `app/(site)/products/[slug]/layout.tsx`
- Chỉ sửa logic generate metadata.
- Không hardcode tên sản phẩm nào.
- Rule dự kiến:
  - `title`: ưu tiên `metaTitle`, fallback `product.name`, loại bỏ pattern nối giá vào title.
  - `description`: ưu tiên `metaDescription`, fallback mô tả rút gọn từ dữ liệu product.
- Không động vào phần render UI trong `page.tsx`.

### 2) Giữ canonical sạch và ổn định
**File:** `app/(site)/products/[slug]/layout.tsx`
- Đảm bảo canonical luôn là URL detail chuẩn theo slug.
- Không thay đổi route, không đổi slug, không đổi navigation UI.

### 3) Bổ sung robots metadata chi tiết hơn
**File:** `app/(site)/products/[slug]/layout.tsx`
- Giữ `index, follow`.
- Thêm các directive snippet/image preview ở metadata layer nếu chưa có.
- Chỉ tác động SEO tags, không tác động giao diện.

### 4) Chuẩn hóa Product JSON-LD
**File:** `app/(site)/products/[slug]/layout.tsx`
- Rà lại schema để dữ liệu SEO đồng nhất với product hiện có:
  - `name`, `description`, `image`, `sku`, `brand`, `offers`, `availability`, `url`.
- Dữ liệu lấy động từ product/site settings hiện có, không hardcode.

### 5) Cải thiện sitemap freshness signal
**File:** `app/sitemap.ts`
- Chỉ tinh chỉnh `lastModified` của product entries nếu có field phù hợp hơn.
- Không thay đổi UI hay hành vi trang.

---

## Những gì mình cam kết KHÔNG làm
- Không sửa UI hiển thị ngoài màn hình.
- Không đổi layout, spacing, text, button, breadcrumb, ảnh, mô tả render cho user.
- Không hardcode theo một sản phẩm cụ thể.
- Không thêm block ẩn/hiện làm thay đổi DOM nhìn thấy nếu không thực sự cần thiết.
- Không mở rộng sang admin form hay module khác trong bước này.

---

## Verification Plan
- Chỉ verify tĩnh + fetch metadata sau sửa.
- Kiểm tra:
  1. `<title>` mới đúng rule động, không còn nối giá.
  2. `meta description`, `canonical`, `robots` đúng.
  3. JSON-LD Product vẫn hợp lệ và dùng dữ liệu động.
  4. Sitemap vẫn chứa URL product với timestamp hợp lý.
- Không chạy lint/test/build theo guideline repo.

Nếu bạn duyệt spec này, mình sẽ triển khai đúng ràng buộc: **không đổi UI, không hardcode, chỉ sửa thẻ và SEO**.