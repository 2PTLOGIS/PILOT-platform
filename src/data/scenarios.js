export const roleMeta = {
  DRIVER: { label: 'Tài xế', path: '/driver' },
  DISPATCHER: { label: 'Điều phối', path: '/dispatcher' },
  TERMINAL: { label: 'Cảng / Terminal', path: '/control-tower' },
}

export const scenarioDefinitions = [
  {
    id: 'slot-request',
    number: '01',
    title: 'Đăng ký Slot mới',
    short: 'Tài xế tạo yêu cầu, điều phối kiểm tra và cảng xác nhận.',
    color: 'blue',
    steps: [
      { role: 'DRIVER', action: 'Gửi yêu cầu Slot 09:00 – 09:30', result: 'Tạo Slot Request và chuyển sang điều phối.' },
      { role: 'DISPATCHER', action: 'Phê duyệt yêu cầu đặt Slot', result: 'Kiểm tra thông tin xe, container và gửi cảng.' },
      { role: 'TERMINAL', action: 'Xác nhận Appointment', result: 'Giữ capacity và cấp mã lịch hẹn.' },
      { role: 'DRIVER', action: 'Xác nhận đã nhận lịch', result: 'Hoàn tất quy trình đặt Slot.' },
    ],
  },
  {
    id: 'traffic-delay',
    number: '02',
    title: 'Tắc đường, nguy cơ trễ Slot',
    short: 'GPS làm ETA thay đổi; AI chỉ khuyến nghị, con người quyết định.',
    color: 'orange',
    steps: [
      { role: 'DRIVER', action: 'Bắt đầu chuyến và bật GPS', result: 'Trip chuyển sang IN_TRANSIT.' },
      { role: 'DRIVER', action: 'Mô phỏng tắc đường', result: 'ETA trễ 16 phút và sinh Exception.' },
      { role: 'DISPATCHER', action: 'Duyệt đề xuất đổi Slot', result: 'Gửi Change Request tới terminal.' },
      { role: 'TERMINAL', action: 'Chấp nhận Slot 15:00 – 15:30', result: 'Appointment mới có hiệu lực.' },
      { role: 'DRIVER', action: 'Xác nhận lịch mới', result: 'Tài xế tiếp tục hành trình.' },
    ],
  },
  {
    id: 'container-hold',
    number: '03',
    title: 'Container chuyển HOLD',
    short: 'Rule Engine chặn chuyến, tránh tài xế tới cảng khi chưa đủ điều kiện.',
    color: 'red',
    steps: [
      { role: 'TERMINAL', action: 'Đánh dấu container HOLD', result: 'Rule Engine khóa phương án đang chạy.' },
      { role: 'DISPATCHER', action: 'Tạm dừng điều xe', result: 'Gửi chỉ dẫn an toàn tới tài xế.' },
      { role: 'DRIVER', action: 'Xác nhận dừng chuyến', result: 'Trip chuyển trạng thái PAUSED.' },
      { role: 'TERMINAL', action: 'Gỡ HOLD sau kiểm tra', result: 'Container trở lại READY.' },
      { role: 'DISPATCHER', action: 'Đề nghị Slot thay thế 11:00', result: 'Gửi yêu cầu tái lập lịch.' },
      { role: 'TERMINAL', action: 'Xác nhận Slot thay thế', result: 'Trip được phép tiếp tục.' },
    ],
  },
  {
    id: 'gate-failure',
    number: '04',
    title: 'Gate giảm năng lực',
    short: 'Cảng báo sự cố Gate; luồng xe được giãn sang khung giờ an toàn.',
    color: 'purple',
    steps: [
      { role: 'TERMINAL', action: 'Kích hoạt sự cố Gate-in', result: 'Capacity giảm từ 10 xuống 4 xe/15 phút.' },
      { role: 'DISPATCHER', action: 'Duyệt phương án giãn Slot', result: 'Xe được đề nghị sang 16:00 – 16:30.' },
      { role: 'TERMINAL', action: 'Xác nhận capacity Slot mới', result: 'TAS ghi nhận lịch thay thế.' },
      { role: 'DRIVER', action: 'Xác nhận chỉ dẫn mới', result: 'Tài xế nhận thời gian đến cảng mới.' },
    ],
  },
  {
    id: 'yard-overload',
    number: '05',
    title: 'Tàu đến sớm, bãi quá tải',
    short: 'Forecast dự báo bãi vượt ngưỡng và chủ động giãn dòng xe bên ngoài.',
    color: 'teal',
    steps: [
      { role: 'TERMINAL', action: 'Mô phỏng tàu đến sớm', result: 'Forecast bãi tăng lên 96%.' },
      { role: 'DISPATCHER', action: 'Duyệt khuyến nghị giãn xe', result: 'Đề nghị chuyển Trip sang 17:00.' },
      { role: 'TERMINAL', action: 'Phê duyệt Slot sau cao điểm', result: 'Giảm áp lực Block A và Gate-in.' },
      { role: 'DRIVER', action: 'Xác nhận lịch điều chỉnh', result: 'Tài xế chờ tại điểm an toàn.' },
    ],
  },
]

export function getScenario(id) {
  return scenarioDefinitions.find((scenario) => scenario.id === id) || scenarioDefinitions[0]
}
