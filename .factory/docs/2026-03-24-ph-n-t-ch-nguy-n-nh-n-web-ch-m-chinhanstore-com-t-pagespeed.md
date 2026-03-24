## Audit Summary

### Observation (evidence từ 2 ảnh PSI)
- Mobile: **Performance 73**, Accessibility 81, Best Practices 96, SEO 100.
- Desktop: **Performance 80**.
- Mobile metrics: **FCP ~1.2s (ổn)**, **TBT ~70ms (ổn)**, **CLS ~0 (ổn)**, nhưng **LCP ~15.6s (rất chậm)**, Speed Index ~3.6s.
- Desktop metrics: **LCP ~3.2s** (vẫn cao hơn ngưỡng tốt 2.5s).
- Filmstrip cho thấy nội dung chính/ảnh hero xuất hiện muộn → thời gian chờ phần tử lớn nhất quá lâu.

### Root-cause inference
- Nguyên nhân chính không phải CPU/JS main-thread (vì TBT thấp), mà là **đường tải và hiển thị phần tử LCP (khả năng cao ảnh/banner hero)** bị trễ.
- Các khả năng trực tiếp gây trễ LCP:
  1) Ảnh LCP quá nặng/chưa tối ưu định dạng-kích thước.
  2) Ảnh LCP bị tải muộn (priority/preload chưa đúng, có thể lazy sai chỗ).
  3) Tài nguyên chặn render (CSS/JS/third-party) làm lùi thời điểm paint phần tử LCP.
  4) TTFB/backend cache có thể góp phần (cần số liệu mạng để chốt).

### Trả lời nhanh theo Audit Protocol (5/8, gồm #1 #3 #6 #8)
1. Triệu chứng: web “chậm thấy rõ”, đặc biệt mobile; expected LCP <2.5s, actual ~15.6s.
2. Phạm vi: user mobile bị ảnh hưởng nặng nhất; desktop cũng bị nhưng nhẹ hơn.
3. Tái hiện: có khả năng tái hiện cao vì 2 lần đo cùng xu hướng LCP cao.
6. Giả thuyết thay thế: không chỉ ảnh nặng; còn khả năng do preload sai, render-blocking, hoặc TTFB.
8. Pass/fail sau sửa: Mobile LCP <=2.5s (mục tiêu tốt), Perf >=90; Desktop LCP <=2.5s.

## Root Cause Confidence
- **High (80%)**: Nút thắt chính là **LCP pipeline** (ảnh/nội dung lớn đầu trang tải hoặc paint quá muộn), vì TBT/CLS/FCP đều không phải điểm nghẽn chính.
- **Medium (60%)**: Có đóng góp từ render-blocking resources hoặc server response; cần waterfall/trace để định lượng.

## Verification Plan
1. Đo lại PSI Mobile + Desktop sau mỗi nhóm fix (không gộp nhiều fix một lần để dễ quy trách nhiệm).
2. Theo dõi riêng LCP element và breakdown: TTFB, load delay, load time, render delay.
3. So sánh trước/sau cho các chỉ số: LCP, Speed Index, request bytes, critical request chain.
4. Xác nhận trên thiết bị thật mạng 4G (thêm cảm nhận người dùng) và theo dõi CrUX nếu có.

## Proposal triển khai (nếu bạn duyệt)
1. **P1 – Sửa LCP element**: tối ưu ảnh hero (WebP/AVIF, đúng kích thước), ưu tiên tải (`priority`), preload đúng 1 ảnh LCP, bỏ lazy cho ảnh LCP.
2. **P1 – Giảm render-blocking**: tách/hoãn JS không critical, tối ưu CSS critical-above-the-fold.
3. **P2 – Giảm payload đầu trang**: giới hạn script bên thứ ba, trì hoãn widget/chat/analytics không thiết yếu.
4. **P2 – Server/cache**: kiểm tra TTFB, cache headers/CDN, tối ưu route đầu trang.

Nếu bạn đồng ý, mình sẽ đi theo thứ tự P1 -> P2 để giảm LCP trước (đòn bẩy lớn nhất).