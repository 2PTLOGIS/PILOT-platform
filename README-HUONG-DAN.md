# PILOT DEMO STARTER

Đây là mã nguồn thống nhất của dự án PILOT, phiên bản 1.1. Bản này có Demo Studio và ba giao diện:

- `/demo-studio`: chọn và điều khiển 5 kịch bản có hướng dẫn
- `/driver`: ứng dụng tài xế dạng điện thoại
- `/dispatcher`: bảng điều phối doanh nghiệp vận tải
- `/control-tower`: trung tâm điều hành cảng

## 1. Công cụ cần cài

- Visual Studio Code
- Node.js bản LTS
- Google Chrome

## 2. Giải nén

Giải nén file ZIP vào thư mục dễ nhớ, ví dụ:

```text
C:\PILOT\pilot-demo-starter
```

Không chạy trực tiếp dự án bên trong file ZIP.

## 3. Mở dự án

Mở VS Code, chọn `File > Open Folder`, sau đó chọn thư mục `pilot-demo-starter`.

Cách nhanh dành cho Windows: sau khi đã cài Node.js, có thể nhấp đúp file `CAI-DAT-VA-CHAY.bat`. File này sẽ tự cài thư viện nếu cần và mở máy chủ demo.

## 4. Mở terminal

Chọn `Terminal > New Terminal`.

Nếu terminal là PowerShell và báo lỗi `npm.ps1 cannot be loaded`, chọn:

```text
Terminal > Select Default Profile > Command Prompt
```

Sau đó đóng terminal cũ và mở terminal mới.

## 5. Cài thư viện

Chạy:

```cmd
npm install
```

Đợi đến khi terminal chạy xong và xuất hiện lại con trỏ nhập lệnh.

## 6. Chạy dự án

Chạy:

```cmd
npm run dev
```

Mở đường dẫn terminal cung cấp, thường là:

```text
http://localhost:5173
```

## 7. Cách trình diễn khuyến nghị

Mở:

```text
http://localhost:5173/demo-studio
```

Chọn một trong 5 tình huống. Hệ thống sẽ hiển thị bước hiện tại, vai trò cần thao tác và nút mở đúng giao diện. Có thể xem kịch bản nói chi tiết trong file `KICH-BAN-TRINH-DIEN.md`.

## 8. Cách thử đồng bộ ba giao diện

Mở ba tab trình duyệt:

```text
http://localhost:5173/driver
http://localhost:5173/dispatcher
http://localhost:5173/control-tower
```

Thao tác trong Demo Studio sẽ hướng dẫn thứ tự. Tab còn lại tự cập nhật dữ liệu, KPI, Exception Queue và Audit Trail.

Bản này đồng bộ bằng Local Storage và Broadcast Channel nên chỉ đồng bộ giữa các tab trên cùng trình duyệt. Khi kết nối Supabase, dữ liệu mới đồng bộ giữa điện thoại và máy tính khác nhau.

## 9. Xem trên điện thoại trong cùng Wi-Fi

Trước tiên dừng server hiện tại bằng tổ hợp `Ctrl + C`. Sau đó chạy:

```cmd
npm run dev:phone
```

Terminal sẽ có dòng `Network`, ví dụ:

```text
http://192.168.1.10:5173
```

Điện thoại và máy tính phải dùng chung Wi-Fi. Mở địa chỉ `Network` trên Chrome điện thoại.

Nếu không truy cập được, cho phép Node.js qua Windows Firewall khi hệ thống hỏi.

## 10. Tạo bản chạy ổn định

Chạy:

```cmd
npm run build
```

Nếu thành công, thư mục `dist` sẽ được tạo. Đây là thư mục dùng để đưa demo lên mạng sau này.

## 11. Supabase Realtime

Phiên bản 1.2 hỗ trợ đồng bộ giữa nhiều thiết bị:

1. Mở Supabase SQL Editor và chạy toàn bộ file `supabase-schema.sql`.
2. Tạo `.env.local` từ `.env.example`.
3. Điền `VITE_SUPABASE_URL` và `VITE_SUPABASE_PUBLISHABLE_KEY`.
4. Khởi động lại ứng dụng.

Khi kết nối thành công, đầu trang hiển thị `Đồng bộ trực tuyến`. Nếu mất mạng, dữ liệu tiếp tục được lưu trên máy và đầu trang hiển thị `Mất kết nối – đã lưu máy`.

Không đưa mật khẩu Database, Secret key hoặc `service_role` key vào code trình duyệt hay GitHub.

## 12. Cách nâng cấp dự án

Không tạo dự án mới. Giữ nguyên thư mục này, sửa đúng file, rồi chạy lại `npm run build`. Cấu trúc phát triển và quy tắc sửa lỗi nằm trong `KIEN-TRUC-PHAT-TRIEN.md`.
