# PILOT Platform

PILOT là bản demo hệ thống điều phối vận tải container end-to-end cho Cảng Hải Phòng. Một mã nguồn dùng chung tạo ra ba giao diện theo vai trò, giúp dữ liệu và hành động liên kết thành một quy trình hoàn chỉnh:

- **Ứng dụng tài xế:** xem chuyến, Slot, ETA, bản đồ và nhận cảnh báo.
- **Bảng điều phối:** theo dõi đội xe, xử lý ngoại lệ và phê duyệt khuyến nghị.
- **Trung tâm điều hành cảng:** theo dõi bãi, Gate, lượng xe dự kiến và xác nhận thay đổi Slot.
- **Demo Studio:** điều khiển 5 tình huống trình diễn có hướng dẫn cho ban giám khảo.

## Chạy nhanh

Yêu cầu: Node.js LTS và trình duyệt Chrome/Edge.

```bash
npm install
npm run dev
```

Mở địa chỉ do Vite hiển thị, thường là `http://localhost:5173/demo-studio`.

## Các màn hình

| Đường dẫn | Vai trò |
|---|---|
| `/demo-studio` | Điều khiển kịch bản trình diễn |
| `/driver` | Tài xế |
| `/dispatcher` | Điều phối doanh nghiệp vận tải |
| `/control-tower` | Điều hành cảng/terminal |

## Chạy trên điện thoại trong cùng Wi-Fi

```bash
npm run dev:phone
```

Mở địa chỉ `Network` mà terminal hiển thị trên điện thoại. Máy tính và điện thoại phải cùng mạng Wi-Fi.

## Kiểm tra trước khi cập nhật

```bash
npm run build
```

## Tài liệu dự án

- [Hướng dẫn cài đặt và chạy](README-HUONG-DAN.md)
- [Kịch bản trình diễn](KICH-BAN-TRINH-DIEN.md)
- [Kiến trúc và lộ trình phát triển](KIEN-TRUC-PHAT-TRIEN.md)

## Trạng thái hiện tại

Phiên bản `1.1.0` là Proof of Concept. Ba giao diện đang đồng bộ theo thời gian thực giữa các tab trên cùng trình duyệt bằng Local Storage và Broadcast Channel. Cấu trúc Supabase đã được chuẩn bị để nâng cấp sang đồng bộ giữa nhiều thiết bị.

Không commit khóa API hoặc `service_role` key vào repository. Chỉ sử dụng `.env.example` làm mẫu cấu hình.
