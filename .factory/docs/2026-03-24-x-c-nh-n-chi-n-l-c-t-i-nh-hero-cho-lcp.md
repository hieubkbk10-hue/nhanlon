Đúng rồi, ý chính là vậy:

## Audit Summary
- Mục tiêu là kéo **LCP** xuống bằng cách ưu tiên ảnh có khả năng là LCP.
- Với Hero slider, ảnh thấy đầu tiên (`slide[0]`) nên được tải ưu tiên (`priority/preload`).
- Các ảnh slide 2+ để tải sau (khi browser rảnh hơn / theo cơ chế lazy tự nhiên), tránh tranh băng thông lúc first paint.

## Root Cause Confidence
- **High**: Đây là chiến lược đúng cho case LCP cao do Hero image xuất hiện muộn.
- Tradeoff: chỉ nên ưu tiên **1 ảnh LCP chính**, không ưu tiên tất cả ảnh slider cùng lúc.

## Verification Plan
1. Đo lại PSI mobile sau khi áp dụng, kiểm tra LCP giảm rõ rệt.
2. Mở waterfall để xác nhận ảnh đầu được request sớm hơn ảnh còn lại.
3. Nếu LCP vẫn cao, tiếp tục kiểm tra TTFB và render-blocking CSS/JS.

Kết luận ngắn: **ưu tiên ảnh đầu để vào màn hình nhanh, ảnh sau tải nền dần** là hướng chuẩn.