## Audit Summary
- Observation: Module posts đã có feature `enableScheduling` và field runtime `publish_date` trong `lib/modules/configs/posts.config.ts`, nhưng form admin create/edit không đọc field này để render UI hẹn giờ.
- Observation: `app/admin/posts/create/page.tsx` và `app/admin/posts/[id]/edit/page.tsx` hiện chỉ có `status`, không có state/input cho ngày giờ publish.
- Observation: Backend posts đã có `publishedAt` trong schema/query model, nhưng `convex/model/posts.ts` đang tự set `publishedAt = Date.now()` khi tạo/chuyển sang `Published`, nên không hỗ trợ lịch tương lai.
- Observation: Các query public (`listPublished`, `searchPublished`, `listPublishedWithOffset`, `countPublished`, sitemap/feed và trang detail theo slug) đang coi mọi record `status = "Published"` là public ngay, không chặn record có `publishedAt` ở tương lai.

## Root Cause Confidence
- High — nguyên nhân chính là mismatch giữa config module và implementation thực tế:
  1. UI admin chưa bind feature `enableScheduling` vào form posts.
  2. Mutation/model chưa nhận `publishedAt` do người dùng chọn.
  3. Public queries chưa lọc `publishedAt <= now` nên nếu chỉ thêm UI thì bài hẹn giờ vẫn lộ sớm.
- Counter-hypothesis đã loại trừ: không phải do thiếu schema/index, vì `publishedAt` và index `by_status_publishedAt` đã tồn tại trong `convex/schema.ts`.

## Proposal
1. `app/admin/posts/create/page.tsx`
   - Đọc `enableScheduling` từ `settingsData` và `publish_date` từ `enabledFields`.
   - Thêm state `publishAtLocal`.
   - Trong card “Xuất bản”, khi hẹn giờ bật và `status === 'Published'`, render input `datetime-local` + text mô tả:
     - trống => xuất bản ngay
     - có thời gian tương lai => hẹn giờ publish
   - Khi submit, convert local datetime sang timestamp `publishedAt` và gửi vào mutation create.

2. `app/admin/posts/[id]/edit/page.tsx`
   - Thêm cùng state/UI như create.
   - Prefill từ `postData.publishedAt` sang `datetime-local`.
   - Giữ logic edit: nếu `status !== 'Published'` thì không hiện input hẹn giờ.
   - Khi save, gửi `publishedAt` theo lựa chọn mới.

3. `convex/posts.ts`
   - Mở rộng validator cho `create`/`update` nhận `publishedAt: v.optional(v.number())`.
   - Không đổi schema vì field đã có sẵn.

4. `convex/model/posts.ts`
   - `create(...)`:
     - nếu `status === 'Published'` và có `publishedAt` hợp lệ => dùng giá trị đó.
     - nếu `status === 'Published'` và không có `publishedAt` => `Date.now()`.
     - nếu không published => `publishedAt: undefined`.
   - `update(...)`:
     - nếu đổi sang `Published`:
       - có `publishedAt` => dùng giá trị user chọn
       - không có `publishedAt` => `Date.now()`
     - nếu đang `Published` và user sửa lịch => update `publishedAt`
     - nếu đổi sang `Draft/Archived` => clear `publishedAt`
   - Mục tiêu: bài scheduled vẫn mang status Published nhưng chỉ public khi tới giờ.

5. Public visibility guard trong `convex/posts.ts`
   - Thêm helper filter `publishedAt <= Date.now()` cho mọi query public liên quan posts:
     - `listPublished`
     - `listMostViewed`
     - `searchPublished`
     - `countPublished`
     - `listPublishedPaginated`
     - `listPublishedWithOffset`
     - `searchPublishedPaginated`
   - Với query paginated/index-based, sẽ lấy dư một chút rồi filter in-memory trước khi trả kết quả để tránh lộ bài scheduled.
   - `getBySlug` giữ nguyên cho admin/internal; nếu route site detail đang dùng query này trực tiếp, bổ sung chặn ở page/layout site để trả notFound khi `status !== 'Published'` hoặc `publishedAt > now`.

6. Site/detail/sitemap/feed
   - Rà các entry public đang gọi posts published queries hoặc đọc slug trực tiếp:
     - `app/(site)/posts/page.tsx`
     - `app/(site)/posts/layout.tsx`
     - `app/(site)/posts/[slug]/page.tsx`
     - `app/(site)/posts/[slug]/layout.tsx`
     - `app/sitemap.ts`
     - `app/sitemap/posts.xml/route.ts`
     - `app/feed.xml/route.ts`
   - Đảm bảo bài chưa tới lịch không hiện ở list, detail, sitemap, feed.

7. UX rule sẽ triển khai
   - Chỉ hiện control hẹn giờ khi module posts bật scheduling.
   - Chỉ hiện control khi người dùng chọn `Đã xuất bản`.
   - Nếu thời gian đã qua hoặc bỏ trống => publish ngay.
   - Nếu thời gian ở tương lai => bài bị ẩn khỏi site cho tới đúng giờ.

8. Commit
   - Sau khi user duyệt spec và code xong: tự review tĩnh + chạy `bunx tsc --noEmit` theo rule repo + commit local, không push.

## Verification Plan
- Static verify:
  - Soát type cho create/edit pages và Convex validators/model.
  - Soát edge cases: đổi Published -> Draft, Draft -> Published, Published ngay -> Scheduled, Scheduled -> publish ngay.
- Typecheck sau khi code: `bunx tsc --noEmit`.
- Repro checklist cho tester:
  1. Bật `Hẹn giờ` ở `/system/modules/posts`.
  2. Vào create/edit post, chọn `Đã xuất bản` thấy input ngày giờ.
  3. Chọn giờ tương lai, lưu thành công.
  4. Trước giờ hẹn: bài không hiện ở `/posts`, detail slug, sitemap, feed.
  5. Sau giờ hẹn: bài xuất hiện bình thường.
  6. Xóa lịch hoặc chọn giờ quá khứ: bài public ngay.

Nếu bạn đồng ý spec này, tôi sẽ triển khai đúng phạm vi trên.