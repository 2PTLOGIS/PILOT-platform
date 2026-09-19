export const routePoints = [
  [20.8521, 106.6884],
  [20.8473, 106.7042],
  [20.8422, 106.7214],
  [20.8381, 106.7396],
  [20.8342, 106.7568],
  [20.8312, 106.7734],
  [20.8285, 106.7888],
]

export const initialState = {
  schemaVersion: 3,
  scenario: { id: 'slot-request', step: 0, status: 'RUNNING' },
  trip: {
    id: 'TV250424-0012',
    container: 'TCNU1234567',
    containerType: '40HC',
    cargo: 'Hàng xuất',
    driver: 'Nguyễn Văn Nam',
    truck: '15H-246.88',
    terminal: 'Tân Vũ',
    slot: '14:00 – 14:30',
    date: '24/04/2026',
    status: 'SLOT_CONFIRMED',
    risk: 'ON_TIME',
    eta: '14:18',
    distance: 12.5,
    routeIndex: 0,
    gpsFreshness: 'Vừa cập nhật',
    containerStatus: 'READY',
  },
  yard: {
    occupancy: 72,
    forecast: 81,
    gateIn: 82,
    gateOut: 74,
    blocks: [
      { name: 'Block A', occupancy: 78 },
      { name: 'Block B', occupancy: 69 },
      { name: 'Block C', occupancy: 71 },
    ],
  },
  recommendation: {
    status: 'NONE',
    reason: '',
    proposedSlot: '',
  },
  appointment: {
    id: 'APT-DEMO-001',
    status: 'DRAFT',
    requestedSlot: '09:00 – 09:30',
    confirmedAt: null,
  },
  exceptions: [],
  auditLog: [],
  notifications: [
    { id: 1, type: 'success', text: 'Lịch 14:00 – 14:30 đã được xác nhận.' },
  ],
  preferredSlots: [
    { id: 1, slot: '14:00 – 14:30', terminal: 'Tân Vũ', status: 'CONFIRMED' },
  ],
  tripHistory: [
    { id: 'TV230424-0008', container: 'OOLU8891204', terminal: 'Chùa Vẽ', slot: '09:00 – 09:30', status: 'Hoàn thành' },
    { id: 'TV220424-0019', container: 'MSCU7045218', terminal: 'Đình Vũ', slot: '15:30 – 16:00', status: 'Hoàn thành' },
  ],
  lastUpdated: new Date().toISOString(),
}
