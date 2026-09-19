export default function StatusPill({ value }) {
  const labels = {
    SLOT_CONFIRMED: 'Đã xác nhận',
    IN_TRANSIT: 'Đang di chuyển',
    AT_GATE: 'Đã đến cổng',
    ON_TIME: 'Đúng kế hoạch',
    AT_RISK: 'Có nguy cơ trễ',
    CRITICAL: 'Nghiêm trọng',
    NONE: 'Chưa có',
    PENDING: 'Chờ điều phối',
    WAITING_TERMINAL: 'Chờ terminal',
    ACCEPTED: 'Đã chấp nhận',
    REJECTED: 'Đã từ chối',
    BLOCKED: 'Bị chặn bởi Rule',
    OPEN: 'Đang mở',
    RESOLVED: 'Đã xử lý',
    MONITORING: 'Đang theo dõi',
    DRAFT: 'Bản nháp',
    PAUSED: 'Tạm dừng',
  }
  const tone = ['AT_RISK', 'PENDING', 'WAITING_TERMINAL', 'OPEN', 'MONITORING', 'DRAFT'].includes(value) ? 'warning' : ['CRITICAL', 'REJECTED', 'BLOCKED', 'PAUSED'].includes(value) ? 'danger' : 'success'
  return <span className={`status-pill ${tone}`}>{labels[value] || value}</span>
}
