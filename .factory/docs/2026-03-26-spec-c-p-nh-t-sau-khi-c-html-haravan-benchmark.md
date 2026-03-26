## Audit Summary
### Observation
Từ HTML Haravan bạn gửi, có vài điểm SEO đáng học được, nhưng cần tách cái nào là **tín hiệu SEO thật** và cái nào chỉ là **hạ tầng/marketing script**:

**Những điểm có giá trị SEO thật:**
1. `<title>` ngắn, rõ intent, không nhồi thêm giá hay thông tin động thừa.  
2. `canonical` sạch, trỏ đúng URL chuẩn.  
3. `hreflang` có khai báo rõ.  
4. `meta description` viết tự nhiên, đúng search intent, không quá dài.  
5. `og:title`, `og:description`, `og:image`, `og:url` đồng bộ tốt.  
6. Có `BlogPosting` JSON-LD khá đầy đủ: `headline`, `image`, `datePublished`, `dateModified`, `author`, `publisher`, `description`.  
7. Nội dung bài có tín hiệu editorial tốt: H1 rõ, ngày đăng/cập nhật, ảnh có alt, internal links dày, breadcrumb semantic.

**Những điểm KHÔNG nên bắt chước cho case của bạn:**
1. Rất nhiều script tracking/marketing/analytics không giúp index trực tiếp.  
2. DNS prefetch/preload dày đặc không phải đòn chính để một trang mới được index.  
3. Họ mạnh vì authority domain + cụm content + internal links + freshness, không phải chỉ vì nhiều thẻ hơn.

### Inference
- Cái đáng học từ Haravan không phải “thêm thật nhiều script/meta lạ”, mà là:
  - title/description sạch,
  - canonical ổn định,
  - structured data đúng loại trang,
  - content freshness signal,
  - internal linking và ngữ nghĩa nội dung rõ.
- Với product detail của bạn, phần đã fix trước đó mới chạm vào metadata/schema/sitemap cơ bản; nếu muốn tăng tín hiệu hơn nữa thì nên bổ sung thêm vài SEO tag/signal động nhưng vẫn giữ nguyên ràng buộc **không đổi UI, không hardcode**.

### Decision
Mình đề xuất cập nhật spec theo hướng:
- vẫn không đụng UI,
- vẫn không hardcode theo từng sản phẩm,
- nhưng mở rộng nhẹ phần SEO tags/server-side signals học từ Haravan.

---

## Root Cause Confidence
**High**
1. Triệu chứng vẫn là indexability yếu, không phải lỗi hiển thị UI.  
2. Haravan cho thấy chênh lệch nằm ở “content quality + semantic SEO completeness”, không nằm ở JS nặng.  
3. Những gì có thể học đều nằm trong scope server metadata và structured data.  
4. Tiêu chí pass vẫn là tăng tín hiệu index mà không làm đổi giao diện người dùng.

---

## Proposal cập nhật spec
### 1) Giữ fix cũ về title/description/canonical/robots
**File chính:** `app/(site)/products/[slug]/layout.tsx`
- Không đổi gì về UI.
- Tiếp tục giữ rule title gọn, bỏ append giá, canonical sạch.

### 2) Bổ sung freshness metadata cho product detail nếu dữ liệu có sẵn
**File:** `app/(site)/products/[slug]/layout.tsx`
- Nếu product có timestamp phù hợp (`updatedAt` hoặc tương đương), thêm signal kiểu article/product freshness vào metadata/schema nơi hợp lý.
- Mục tiêu: học từ `dateModified` của Haravan, nhưng chỉ dùng nếu dữ liệu nội bộ có thật.
- Không hardcode ngày.

### 3) Làm giàu Product JSON-LD hơn theo hướng semantic completeness
**File:** `app/(site)/products/[slug]/layout.tsx`
- Giữ `Product` schema, nhưng rà để đảm bảo các field có giá trị nhất quán và đầy đủ nhất có thể từ dữ liệu hiện có.
- Nếu có dữ liệu phù hợp, cân nhắc thêm trường hữu ích như image list nhất quán hơn.
- Không thêm field fake hoặc suy diễn không có evidence.

### 4) Rà Open Graph/Twitter parity
**File:** `lib/seo/metadata.ts` hoặc `app/(site)/products/[slug]/layout.tsx`
- Đảm bảo `og:title`, `og:description`, `og:image`, `og:url` và twitter card bám đúng title/description/canonical mới.
- Đây là điểm Haravan làm khá đồng bộ.

### 5) Xem xét bổ sung alternates/hreflang chỉ khi site thật sự có ngôn ngữ
**File:** metadata builder liên quan
- Nếu site của bạn hiện chỉ có 1 ngôn ngữ thì không thêm giả.
- Nếu đã có locale/site_language mapping đúng, có thể xuất alternates chuẩn hơn.
- Không thêm hreflang giả chỉ để “giống Haravan”.

### 6) Tăng signal từ sitemap bằng modified timestamp chính xác hơn
**File:** `app/sitemap.ts`
- Tiếp tục ưu tiên thời gian cập nhật thật nếu schema dữ liệu support.
- Không tạo timestamp giả để ép crawl.

---

## Những gì học từ Haravan nhưng sẽ KHÔNG làm
- Không thêm tracking scripts, pixel, AppsFlyer, Clarity, GTM vì không giúp index trực tiếp.
- Không thêm DNS prefetch/preload hàng loạt ngoài scope hiện tại.
- Không đổi cấu trúc content UI sang kiểu article page.
- Không thêm hidden content hay hardcode alt/meta cho riêng 1 sản phẩm.

---

## Verification Plan
- Chỉ verify tĩnh + fetch/view-source sau khi triển khai.
- Kiểm tra các điểm sau:
  1. title/description/canonical/robots vẫn đúng và không đổi UI.
  2. OG/Twitter tags đồng bộ.
  3. Product JSON-LD nhất quán, không có field fake.
  4. Nếu có freshness signal mới, nó lấy từ dữ liệu thật chứ không hardcode.
  5. Sitemap phản ánh timestamp product hợp lý.

Nếu bạn duyệt spec cập nhật này, mình sẽ triển khai đúng phạm vi: **chỉ SEO/server tags, không đổi UI, không hardcode**.