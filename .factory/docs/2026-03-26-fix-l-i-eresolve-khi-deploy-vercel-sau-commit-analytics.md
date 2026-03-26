## Audit Summary
- **Observation**: Commit mới nhất `b8f39388 feat(analytics): add Vercel Analytics` đã thêm `@vercel/analytics` vào `package.json` và thêm `<Analytics />` trong `app/layout.tsx` (đúng theo guide Next.js bạn gửi).
- **Observation**: `package.json` hiện có `@vercel/analytics:^2.0.1`, nhưng `package-lock.json` **không** có mục này trong dependencies root (đọc đầu file lock).
- **Observation**: Dự án đang có **2 lockfile**: `bun.lock` (có `@vercel/analytics`) và `package-lock.json` (chưa có), trong khi Vercel log chạy `npm install`.
- **Observation**: Log ERESOLVE có nhánh peer optional của `@vercel/analytics` kéo vào `@sveltejs/kit -> @sveltejs/vite-plugin-svelte -> vite@8`, xung đột với `vitest -> vite@7`.
- **Inference**: `npm install` trên Vercel đang resolve lại graph thay vì dùng lock đã ổn định, nên đụng xung đột optional peer ecosystem (Svelte/Vite) dù app là Next.
- **Decision**: Cách làm analytics của bạn là **đúng**, lỗi nằm ở **install strategy + lockfile nhất quán**, không phải ở `<Analytics />` integration.

## Root Cause Confidence
**High** — vì có bằng chứng trực tiếp: `package.json` và commit đã thêm analytics, `bun.lock` có package này nhưng `package-lock.json` không đồng bộ; đồng thời Vercel dùng `npm install` (theo log), khiến npm re-resolve và nổ ERESOLVE ở optional peers.

Giả thuyết thay thế đã cân nhắc:
1. **Import analytics sai package path** (`@vercel/analytics/next`) → không phù hợp vì lỗi dừng ở bước install trước build.
2. **Có dependency Svelte thật trong repo** → không thấy trong `package-lock.json`; lỗi xuất phát từ peer optional resolution của npm.

## Kế hoạch triển khai (không thực thi ở bước này)
1. Chuẩn hóa dependency manager theo hướng bạn chọn: **npm**.
2. Đồng bộ lockfile npm bằng cách regenerate `package-lock.json` từ `package.json` hiện tại để khóa graph nhất quán cho CI.
3. Đảm bảo Vercel dùng deterministic install:
   - Install Command: `npm ci` (khuyến nghị) hoặc giữ mặc định nếu Vercel tự nhận lockfile đúng.
   - Không dùng `npm install` trong build pipeline.
4. Commit lockfile đã đồng bộ (không thay đổi code analytics).
5. Redeploy và kiểm tra bước install pass.

## Verification Plan
- `bunx tsc --noEmit` (theo quy tắc repo vì có thay đổi code/dependency tracked trong commit fix).
- Xác nhận trên Vercel build log:
  1) Install dùng `npm ci`.
  2) Không còn `ERESOLVE`.
  3) Build Next hoàn tất.
- Sau deploy, vào site để đảm bảo analytics hoạt động (theo flow docs: truy cập vài page, chờ ~30s).

## Trả lời câu hỏi của bạn
- **“Hướng dẫn làm đúng chưa?”** → **Đúng** cho phần tích hợp Next.js.
- **“Xem commit gần nhất”** → Commit gần nhất là `b8f39388 feat(analytics): add Vercel Analytics`, sửa `app/layout.tsx`, `package.json`, `bun.lock`.

Nếu bạn duyệt spec này, tôi sẽ bắt đầu thực thi fix theo đúng plan (chuẩn hóa npm lock + install command) và chuẩn bị commit sửa lỗi deploy.