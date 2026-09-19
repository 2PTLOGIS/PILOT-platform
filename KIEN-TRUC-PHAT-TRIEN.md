# KIẾN TRÚC PHÁT TRIỂN PILOT

## Nguyên tắc

- Đây là một codebase duy nhất, không tạo lại dự án sau mỗi phiên bản.
- Mỗi lỗi được sửa trên nhánh/mã nguồn hiện tại; mỗi tính năng mới là một module.
- `schemaVersion` kiểm soát thay đổi cấu trúc dữ liệu và cho phép viết migration.
- UI không tự quyết định nghiệp vụ; mọi thay đổi đi qua Store/Service chung.
- Demo đang dùng Local Storage + Broadcast Channel. Khi nối Supabase, chỉ thay lớp lưu trữ/đồng bộ, không thay luồng nghiệp vụ hay giao diện.

## Các đối tượng lõi

| Đối tượng | Vai trò |
| --- | --- |
| Trip | Chuyến, xe, tài xế, container, ETA, trạng thái |
| Appointment | Slot yêu cầu, Slot được xác nhận, mã lịch hẹn |
| Exception | Trễ, HOLD, Gate failure, Yard overload |
| Recommendation | Phương án do PILOT đề xuất, chưa có hiệu lực |
| Approval | Quyết định của Dispatcher và Terminal |
| Audit Log | Ai làm gì, lúc nào và kết quả ra sao |

## Lộ trình mở rộng không làm lại

1. **Hiện tại — Interactive Demo:** 5 kịch bản, ba giao diện, dữ liệu đồng bộ trong một trình duyệt.
2. **Realtime Demo:** thay Local Storage bằng Supabase để điện thoại và máy tính khác nhau dùng chung dữ liệu.
3. **Simulation Engine:** tách bộ phát sự kiện tàu, bãi, Gate và xe thành service.
4. **Forecast/Optimization:** gọi API Python cho XGBoost/LightGBM và OR-Tools.
5. **Shadow Mode:** đọc dữ liệu thật đã ẩn danh nhưng chưa gửi thay đổi tới hệ thống cảng.
6. **Closed Pilot:** kết nối API sandbox của một terminal và nhóm xe giới hạn.

## Quy tắc sửa lỗi

1. Tái hiện lỗi bằng một kịch bản cụ thể.
2. Ghi lại bước gây lỗi và trạng thái mong đợi.
3. Sửa module liên quan, không sao chép cả dự án.
4. Chạy `npm run build` để kiểm tra.
5. Tăng số phiên bản trong `package.json` và ghi nội dung thay đổi.

## Cấu trúc quan trọng

- `src/data/scenarios.js`: định nghĩa kịch bản và thứ tự vai trò.
- `src/store/PilotStore.jsx`: trạng thái chung, hành động và migration dữ liệu.
- `src/pages/`: ba ứng dụng và Demo Studio.
- `src/components/ScenarioGuide.jsx`: hướng dẫn đúng bước trên từng giao diện.
- `src/components/AuditTrail.jsx`: nhật ký truy vết.
- `supabase-schema.sql`: nền tảng cho giai đoạn đồng bộ nhiều thiết bị.
