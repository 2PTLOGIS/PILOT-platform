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

Phiên bản `1.2.0` hỗ trợ hai chế độ:

- Có cấu hình Supabase: ba giao diện đồng bộ Realtime giữa điện thoại và máy tính.
- Chưa có cấu hình hoặc mất mạng: ứng dụng tự lưu cục bộ bằng Local Storage và vẫn chạy được.

### Kết nối Supabase

1. Chạy toàn bộ file `supabase-schema.sql` trong SQL Editor của dự án Supabase.
2. Sao chép `.env.example` thành `.env.local`.
3. Điền Project URL và Publishable key vào `.env.local`.
4. Chạy lại `npm run dev`.

Không commit `.env.local`, Secret key hoặc `service_role` key vào repository. Publishable key chỉ được truy cập dữ liệu mà RLS cho phép.
