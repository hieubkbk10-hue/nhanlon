## Audit Summary
- Observation: Trang site `app/(site)/products/[slug]/page.tsx` hiện lấy related products bằng `api.products.searchPublished({ categoryId, limit: 4 })` rồi lại `.slice(0, 4)`, nên luôn bị khóa cứng 4 item.
- Observation: Block hiển thị `RelatedProductsSection` chỉ render grid tĩnh, chưa có state cho mode `4 items / infinite / pagination`.
- Observation: Trang cấu hình `app/system/experiences/product-detail/page.tsx` hiện chưa có config nào cho related products; chỉ có preview và các toggle khác.
- Observation: Repo đã có pattern pagination/infinite scroll sẵn ở `app/(site)/products/page.tsx` và editor pattern ở `app/system/experiences/products-list/page.tsx`.
- User choice đã chốt: editor dùng `Dropdown 3 mode (4 items / infinite / pagination)`, nếu show all thì tải `8 sản phẩm/lần`.

## Root Cause Confidence
- High — nguyên nhân chính là thiết kế hiện tại hard-code limit 4 ở cả query input lẫn bước filter/render, đồng thời experience config không lưu mode hiển thị cho related products. Có pattern sẵn trong codebase để tái sử dụng nên hướng sửa khá rõ.
- Counter-hypothesis đã xét:
  - Không phải do thiếu dữ liệu category: query hiện vẫn lấy theo category nếu có.
  - Không phải do UI preview không đủ: preview có thể mở rộng sau khi config được thêm.
  - Gap còn lại: cần khi implement kiểm tra query Convex phù hợp hơn cho show-all có phân trang/cursor thay vì tái dùng `searchPublished(limit)`.

## Proposal
1. Mở rộng schema config cho `product_detail_ui` trong `app/system/experiences/product-detail/page.tsx`:
   - Thêm nhóm config related products, ví dụ:
     - `relatedProductsMode: 'fixed' | 'infiniteScroll' | 'pagination'`
     - `relatedProductsPerPage: number` (default 8)
     - giữ backward compatibility: nếu chưa có key thì fallback `fixed`.
2. Thêm control vào experience editor:
   - Trong card mới hoặc card hiện có, thêm `SelectRow` cho mode:
     - `4 sản phẩm`
     - `Tất cả + cuộn vô hạn`
     - `Tất cả + phân trang`
   - Thêm `SelectRow` cho số sản phẩm mỗi lần tải với default 8; chỉ hiện khi mode khác `fixed`.
   - Truyền props mới vào `ProductDetailPreview` để preview phản ánh đúng mode.
3. Chuẩn hóa đọc config ở site product detail:
   - Mở rộng `useProductDetailExperienceConfig()` trong `app/(site)/products/[slug]/page.tsx` để parse 2 key mới và fallback an toàn.
4. Nâng cấp data flow related products ở site:
   - Mode `fixed`: giữ hành vi hiện tại nhưng bỏ hard-code dư thừa, chỉ lấy đúng 4 item sau khi loại current product.
   - Mode `infiniteScroll` / `pagination`:
     - Ưu tiên tạo query Convex paginated theo category + status Active, loại current product ở frontend hoặc thêm param excludeId nếu cần rõ ràng hơn.
     - Dùng pattern tương tự `app/(site)/products/page.tsx`:
       - `usePaginatedQuery` cho infinite scroll
       - query offset/cursor cache cho pagination nếu cần số trang rõ ràng.
     - Số item mỗi lần tải = 8 theo lựa chọn của user.
5. Refactor `RelatedProductsSection`:
   - Nhận thêm props mode, page size, loading state, total count, page, onPageChange, loadMore, status.
   - `fixed`: grid 4 item như cũ.
   - `infiniteScroll`: grid + sentinel/loadMore + text trạng thái, bám pattern hiện có trong products list.
   - `pagination`: grid + pager số trang gọn, tái dùng sliding-window pattern đang có ở `app/(site)/products/page.tsx`.
   - Giữ link “Xem tất cả” theo category như hiện tại.
6. Nâng cấp preview `components/experiences/previews/ProductDetailPreview.tsx`:
   - Thêm props mới cho related mode/page size.
   - Preview không cần fetch thật; chỉ mô phỏng 4 card, 8 card hoặc pager/infinite hint để người dùng thấy behavior.
7. Backward compatibility và rủi ro:
   - Config cũ không có key mới vẫn chạy như hiện tại.
   - Không đổi behavior các layout khác ngoài block related.
   - Tránh fetch all rồi filter ở client; ưu tiên pagination tại Convex để đúng guideline DB bandwidth.

## File dự kiến chạm
- `app/system/experiences/product-detail/page.tsx`
- `components/experiences/previews/ProductDetailPreview.tsx`
- `app/(site)/products/[slug]/page.tsx`
- `convex/products.ts` (nhiều khả năng thêm query paginated cho related products hoặc tái dùng query có sẵn sau khi kiểm tra kỹ lúc implement)
- Có thể thêm helper nhỏ trong `lib/experiences/useSiteConfig.ts` nếu muốn chuẩn hóa type/config dùng lại.

## Verification Plan
- Static review:
  - kiểm tra type của config mới, fallback dữ liệu cũ, null-safety khi chưa có category/product.
  - kiểm tra không còn hard-code `.slice(0, 4)` cho mode show-all.
- Repro pass/fail sau khi sửa:
  1. Vào `/system/experiences/product-detail`, chọn `4 sản phẩm` → site `/products/[slug]` vẫn hiện 4 item.
  2. Chọn `Tất cả + cuộn vô hạn` + page size 8 → block related tải thêm từng đợt 8 item.
  3. Chọn `Tất cả + phân trang` + page size 8 → xuất hiện pager, đổi trang không lỗi.
  4. Config cũ chưa có key mới vẫn render bình thường.
- Theo guideline repo, tôi sẽ không chạy lint/test/build; chỉ tự review tĩnh và để tester verify runtime/integration.

Nếu anh duyệt spec này, tôi sẽ triển khai đúng scope trên.