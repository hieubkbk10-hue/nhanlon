## Audit Summary

Observation:
- Nền SEO hiện tại đã có nhiều phần tốt: metadata builder tập trung (`lib/seo/metadata.ts`), schema engine (`lib/seo/schema-policy.ts`), `robots.ts`, `sitemap.ts`, route `llms.txt`, và inject JSON-LD ở site layout (`app/(site)/layout.tsx`).
- So với bộ chuẩn trong `C:\Users\VTOS\Downloads\website-seo\website-seo`, hệ thống còn thiếu hoặc chưa phủ hết các điểm sau:
  1. **Thiếu web manifest + apple touch icon/icon conventions**: chưa thấy `app/**/manifest.*`, `app/**/icon.*`, `app/**/apple-icon.*`; hiện mới có `icons.icon` qua `/api/favicon` trong `app/(site)/layout.tsx`.
  2. **Twitter metadata chưa đủ sâu**: `lib/seo/metadata.ts` mới set `card/title/description/images`, chưa có `site` và `creator` dù settings đã có `social_twitter`.
  3. **Open Graph image metadata chưa đầy đủ**: chưa set width/height/alt cho ảnh OG/Twitter; checklist chuẩn yêu cầu rõ hơn.
  4. **Coverage schema/breadcrumb chưa đồng đều toàn site**: slug pages features/use-cases/solutions/... có Article + Breadcrumb + FAQ, nhưng cần rà và chuẩn hóa cho các hub/list/detail còn lại để khớp checklist “breadcrumb trên mọi non-homepage page” và page-type schema.
  5. **Metadata gốc còn mỏng**: `app/layout.tsx` hiện chủ yếu set `metadataBase` + verification, chưa làm lớp fallback đầy đủ cho author/robots/canonical/social nếu một route quên khai báo.
  6. **Favicon support còn tối thiểu**: có favicon động, nhưng chưa có hệ icon đa kích thước / apple-touch-icon / manifest theo chuẩn kỹ thuật.
- Các mục runtime như CWV/page speed không kết luận trong spec này theo yêu cầu của bạn.

Inference:
- Root issue không phải “thiếu hệ SEO nền”, mà là **thiếu lớp hardening và chuẩn hóa edge cases/social/device metadata** để đạt mức “full checklist”.
- Một phần checklist nội bộ hiện đang thiên về admin readiness (`lib/seo/checklist.ts`) hơn là output HTML/metadata chuẩn ngoài mặt site.

Decision:
- Đề xuất audit/fix theo scope **Full theo checklist chuẩn nhưng chỉ ở code-level**, không đụng runtime benchmark.

## Root Cause Confidence

**High** — vì evidence trong code khá rõ:
- Có `robots.ts`, `sitemap.ts`, `llms.txt/route.ts`, JSON-LD builders, nên core đã tồn tại.
- Không tìm thấy manifest/apple icon/icon convention files.
- `lib/seo/metadata.ts` xác nhận thiếu `twitter.site`, `twitter.creator`, OG image width/height/alt.
- Coverage schema hiện tập trung mạnh ở một số slug layout, chưa chứng minh được coverage đồng đều cho mọi non-homepage route.

Counter-hypothesis đã xét:
- Có thể một số route riêng đã bù metadata đầy đủ. Tuy nhiên bằng chứng grep hiện chưa cho thấy pattern chung đủ mạnh, nên vẫn nên chuẩn hóa ở layer dùng chung để tránh sót route.

## Proposal

Nếu bạn duyệt, mình sẽ triển khai theo thứ tự này:

1. **Audit coverage metadata theo route public**
   - Rà các route trong `app/(site)/**` để map: home, list, detail, utility pages.
   - Ghi rõ route nào đã có canonical/OG/Twitter/schema/breadcrumb, route nào thiếu.

2. **Chuẩn hóa metadata builder dùng chung**
   - Sửa `lib/seo/metadata.ts` để bổ sung:
     - `twitter.site`, `twitter.creator` từ social settings khi có.
     - metadata ảnh xã hội chi tiết hơn nếu dữ liệu có sẵn.
     - fallback author/robots hợp lý ở layer dùng chung.
   - Giữ thay đổi nhỏ, không đổi API route hiện tại nếu không cần.

3. **Bổ sung icon/manifest layer theo chuẩn Next App Router**
   - Thêm `app/manifest.ts`.
   - Thêm icon/apple icon convention phù hợp với favicon động hiện có, ưu tiên tái sử dụng nguồn `site_favicon` thay vì tạo asset cứng mới nếu có thể.
   - Đảm bảo không phá flow favicon hiện tại `/api/favicon`.

4. **Chuẩn hóa schema/breadcrumb coverage**
   - Rà các layout/page public để bảo đảm:
     - homepage có WebSite + Organization/LocalBusiness.
     - list/detail pages có breadcrumb khi phù hợp.
     - product/service/post/detail pages có page-type schema đúng loại.
   - Chỉ bù ở các route thật sự thiếu, tránh duplicate schema không cần thiết.

5. **Static self-review trước bàn giao**
   - Không chạy lint/test/build theo guideline repo.
   - Chỉ review tĩnh: typing, null-safety, backward compatibility với settings rỗng.

6. **Commit local sau khi xong**
   - Theo guideline repo: hoàn thành thay đổi code sẽ commit, không push.

## Verification Plan

Chỉ audit code, không đo runtime:
- Verify file-level:
  - `app/manifest.ts` và icon metadata convention đã tồn tại.
  - `lib/seo/metadata.ts` có đủ Twitter/OG fields mục tiêu.
  - Các route public chính có metadata/schema/breadcrumb coverage đúng loại.
- Verify logic-level:
  - Không làm hỏng fallback khi `site_url`, `site_favicon`, `social_twitter` rỗng.
  - Không tạo canonical cho route noindex.
  - Không duplicate schema site-level ngoài chủ đích.
- Pass criteria:
  - Đóng được các gap code-level chính so với bộ chuẩn: manifest/icon, Twitter metadata sâu hơn, social image metadata rõ hơn, breadcrumb/schema coverage đồng đều hơn.
  - Không mở rộng scope sang Core Web Vitals/runtime.

Nếu bạn xác nhận spec này, mình sẽ bắt đầu đọc route coverage chi tiết rồi sửa code theo đúng thứ tự trên.