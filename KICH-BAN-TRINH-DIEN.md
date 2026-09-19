# KỊCH BẢN TRÌNH DIỄN PILOT

## Cách mở đầu với ban giám khảo

“PILOT không thay thế TOS, ePort/TAS hay TMS. Đây là lớp điều phối dùng chung dữ liệu để dự báo rủi ro, kiểm tra luật nghiệp vụ, đề xuất phương án và yêu cầu đúng người phê duyệt. Trong demo, ba giao diện dùng chung một trạng thái và mọi thao tác đều được ghi Audit Trail.”

Mở `http://localhost:5173/demo-studio`, chọn một kịch bản và bấm **Mở giao diện...**. Sau mỗi thao tác, quay lại Demo Studio hoặc làm theo thông báo “Đang chờ...” để chuyển sang đúng vai trò tiếp theo.

## Kịch bản 1 — Đăng ký Slot mới

1. Driver gửi yêu cầu Slot 09:00–09:30.
2. Dispatcher kiểm tra Trip, xe và container rồi phê duyệt.
3. Port Control Tower xác nhận capacity và Appointment.
4. Driver xác nhận đã nhận lịch.

Điểm cần nói: tài xế chỉ tạo yêu cầu; Slot chỉ có hiệu lực sau hai lớp kiểm tra/phê duyệt.

## Kịch bản 2 — Tắc đường, nguy cơ trễ

1. Driver bắt đầu chuyến; GPS được kích hoạt.
2. Mô phỏng tắc đường làm ETA thành 14:46, trễ 16 phút.
3. PILOT tạo Exception và khuyến nghị Slot 15:00–15:30.
4. Dispatcher duyệt Change Request.
5. Terminal xác nhận Slot mới; Driver nhận lịch.

Điểm cần nói: AI không tự đổi lịch. Luồng là Predict → Validate → Recommend → Approve → Execute.

## Kịch bản 3 — Container HOLD

1. Terminal đánh dấu container HOLD.
2. Rule Engine chặn phương án dù Slot đang còn.
3. Dispatcher tạm dừng điều xe; Driver xác nhận dừng an toàn.
4. Terminal gỡ HOLD sau kiểm tra.
5. Dispatcher đề nghị Slot 11:00; Terminal xác nhận.

Điểm cần nói: Hard Constraint luôn đứng trước tối ưu và khuyến nghị AI.

## Kịch bản 4 — Gate giảm năng lực

1. Terminal kích hoạt sự cố Gate-in; capacity giảm còn 4 xe/15 phút.
2. Dispatcher duyệt giãn chuyến sang 16:00–16:30.
3. Terminal giữ capacity Slot mới.
4. Driver nhận chỉ dẫn mới.

Điểm cần nói: thay vì để xe tới xếp hàng, PILOT điều tiết dòng xe từ bên ngoài cảng.

## Kịch bản 5 — Tàu đến sớm, bãi quá tải

1. Terminal mô phỏng tàu đến sớm; forecast bãi tăng lên 96%.
2. PILOT tạo cảnh báo Yard Overload và khuyến nghị giãn Trip.
3. Dispatcher duyệt; Terminal xác nhận Slot 17:00–17:30.
4. Driver xác nhận chờ tại điểm an toàn.

Điểm cần nói: Booked Arrival có thể khác Predicted Actual Arrival; dự báo giúp can thiệp trước khi quá tải xảy ra.

## Khi giám khảo hỏi “đây có phải dữ liệu thật không?”

Trả lời rõ: “Bản thi hiện dùng Terminal Simulator và dữ liệu mô phỏng có tác động thật lên trạng thái hệ thống. Kiến trúc dữ liệu đã tách Trip, Appointment, Exception, Recommendation và Audit Log để sau này thay nguồn mô phỏng bằng API TOS/TAS/TMS/GPS mà không phải làm lại giao diện.”
