import { useState } from 'react'
import {
  AlertTriangle, Bell, Box, CalendarClock, CheckCircle2, ChevronRight,
  ClipboardList, History, ListChecks, MapPin, MessageSquare, Navigation,
  Play, ShipWheel, Truck,
} from 'lucide-react'
import BrandHeader from '../components/BrandHeader'
import MapPanel from '../components/MapPanel'
import StatusPill from '../components/StatusPill'
import ScenarioGuide from '../components/ScenarioGuide'
import { usePilot } from '../store/PilotStore'

const slotOptions = ['07:00 – 07:30', '08:30 – 09:00', '10:00 – 10:30', '13:30 – 14:00', '15:00 – 15:30', '16:30 – 17:00']
const terminalOptions = ['Tân Vũ', 'Chùa Vẽ', 'Đình Vũ', 'Lạch Huyện', 'VIP Green Port']

export default function DriverApp() {
  const { state, actions } = usePilot()
  const { trip, recommendation, notifications, preferredSlots, tripHistory } = state
  const [activeView, setActiveView] = useState('today')
  const [preferredSlot, setPreferredSlot] = useState(slotOptions[4])
  const [preferredTerminal, setPreferredTerminal] = useState(terminalOptions[0])
  const [showConfirmation, setShowConfirmation] = useState(false)
  const started = trip.status === 'IN_TRANSIT' || trip.status === 'AT_GATE'
  const guided = state.scenario.status === 'RUNNING'

  const submitPreferredSlot = (event) => {
    event.preventDefault()
    actions.requestPreferredSlot(preferredSlot, preferredTerminal)
    setShowConfirmation(true)
    window.setTimeout(() => setShowConfirmation(false), 3500)
  }

  const switchView = (view) => {
    setActiveView(view)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const TodayView = () => (
    <>
      {!started ? (
        <>
          <section className="trip-card">
            <div className="section-heading"><div><small>CHUYẾN HÔM NAY</small><h1>{trip.container}</h1></div><StatusPill value={trip.status} /></div>
            <div className="info-row"><Box /><div><small>Hàng hóa</small><strong>{trip.containerType} · {trip.cargo}</strong></div></div>
            <div className="info-row"><MapPin /><div><small>Cảng / Terminal</small><strong>{trip.terminal}</strong></div></div>
            <div className="info-row"><CalendarClock /><div><small>Khung giờ đã xác nhận</small><strong>{trip.slot}</strong><span>{trip.date}</span></div></div>
            <div className="info-row"><Truck /><div><small>Đầu kéo</small><strong>{trip.truck}</strong></div></div>
          </section>
          <button className="primary-button" disabled={guided || trip.status === 'DRAFT'} onClick={actions.startTrip}><Play fill="currentColor" /> {trip.status === 'DRAFT' ? 'Chưa thể bắt đầu – cần Slot' : 'Bắt đầu chuyến'}</button>
          <button className="secondary-button" onClick={() => switchView('schedule')}><CalendarClock /> Đăng ký khung giờ mong muốn</button>
        </>
      ) : (
        <>
          <section className="mobile-map"><MapPanel routeIndex={trip.routeIndex} compact /></section>
          <section className={`plan-banner ${trip.risk === 'ON_TIME' ? 'green' : 'red'}`}>
            {trip.risk === 'ON_TIME' ? <CheckCircle2 /> : <AlertTriangle />}
            <div><strong>{trip.risk === 'ON_TIME' ? 'Đúng kế hoạch' : 'Có nguy cơ trễ giờ'}</strong><small>{trip.risk === 'ON_TIME' ? 'Bạn đang di chuyển theo lịch trình.' : 'PILOT đang kiểm tra phương án phù hợp.'}</small></div>
          </section>
          <section className="metric-grid"><div><small>ETA dự kiến</small><strong>{trip.eta}</strong></div><div><small>Quãng đường còn lại</small><strong>{trip.distance} km</strong></div></section>
          <section className="timeline-card"><div><span className="timeline-dot active" /><div><strong>Vị trí hiện tại</strong><small>{trip.gpsFreshness}</small></div></div><div><span className="timeline-dot" /><div><strong>Đến cổng cảng Tân Vũ</strong><small>Dự kiến {trip.eta}</small></div></div></section>
          {recommendation.status === 'ACCEPTED' && <section className="new-slot"><CheckCircle2 /><div><strong>Lịch mới đã được xác nhận</strong><small>{trip.slot} · {trip.date}</small></div></section>}
          <div className="driver-actions"><button className="primary-button" disabled={guided} onClick={actions.advanceVehicle}><Navigation /> Mô phỏng xe di chuyển</button><button className="outline-danger" disabled={guided} onClick={actions.reportIncident}><AlertTriangle /> Báo sự cố</button></div>
        </>
      )}
      <button className="notification-preview" onClick={() => switchView('notifications')}><Bell /><div><strong>Thông báo mới nhất</strong><p>{notifications[0]?.text}</p></div><ChevronRight /></button>
    </>
  )

  const ScheduleView = () => (
    <>
      <section className="mode-heading"><CalendarClock /><div><small>LỊCH VÀ SLOT</small><h1>Đăng ký khung giờ</h1><p>Chọn thời gian mong muốn. Đây là đề xuất và chỉ có hiệu lực sau khi hệ thống xác nhận.</p></div></section>
      {showConfirmation && <section className="success-feedback"><CheckCircle2 /><div><strong>Đã xác nhận yêu cầu</strong><small>Khung giờ của bạn đã được ghi nhận thành công.</small></div></section>}
      <form className="slot-form" onSubmit={submitPreferredSlot}>
        <label>Chọn cảng / terminal<select value={preferredTerminal} onChange={(event) => setPreferredTerminal(event.target.value)}>{terminalOptions.map((terminal) => <option key={terminal}>{terminal}</option>)}</select></label>
        <label>Khung giờ mong muốn<select value={preferredSlot} onChange={(event) => setPreferredSlot(event.target.value)}>{slotOptions.map((slot) => <option key={slot}>{slot}</option>)}</select></label>
        <button className="primary-button" disabled={guided} type="submit"><CheckCircle2 /> {guided ? 'Hoàn thành kịch bản trước' : 'Xác nhận khung giờ'}</button>
      </form>
      <section className="mode-section"><div className="mode-section-title"><ListChecks /><div><strong>Lịch đã đăng ký</strong><small>{preferredSlots.length} khung giờ</small></div></div><div className="schedule-list">{preferredSlots.map((item) => <article key={item.id}><div><strong>{item.slot}</strong><small>{item.terminal}</small></div><span>Đã xác nhận</span></article>)}</div></section>
    </>
  )

  const HistoryView = () => (
    <>
      <section className="mode-heading"><History /><div><small>LỊCH SỬ</small><h1>Các chuyến đã hoàn thành</h1><p>Tra cứu container, terminal và khung giờ của những chuyến trước.</p></div></section>
      <section className="history-list">{tripHistory.map((item) => <article key={item.id}><div className="history-icon"><Truck /></div><div><small>{item.id}</small><strong>{item.container}</strong><span>{item.terminal} · {item.slot}</span></div><CheckCircle2 /></article>)}</section>
    </>
  )

  const NotificationView = () => (
    <>
      <section className="mode-heading"><MessageSquare /><div><small>TRUNG TÂM THÔNG BÁO</small><h1>Thông báo của bạn</h1><p>Cảnh báo ETA, xác nhận lịch và cập nhật từ điều phối được lưu tại đây.</p></div></section>
      <section className="notification-list">{notifications.map((item, index) => <article className={item.type} key={item.id}><div className="notification-symbol">{item.type === 'danger' ? <AlertTriangle /> : <CheckCircle2 />}</div><div><strong>{index === 0 ? 'Mới nhất' : 'Cập nhật hệ thống'}</strong><p>{item.text}</p><small>{index === 0 ? 'Vừa xong' : `${index * 8} phút trước`}</small></div></article>)}</section>
    </>
  )

  return (
    <main className="driver-page">
      <div className="phone-frame">
        <div className="phone-status"><span>9:41</span><span>● ● ●</span></div>
        <BrandHeader compact title="Xin chào, Nguyễn Văn Nam" subtitle="Tài xế PILOT" />
        <section className="driver-content">
          <div className="driver-tabs">
            <button className={activeView === 'today' ? 'active' : ''} onClick={() => switchView('today')}>Chuyến hôm nay</button>
            <button className={activeView === 'history' ? 'active' : ''} onClick={() => switchView('history')}>Lịch sử</button>
            <button className={activeView === 'notifications' ? 'active' : ''} onClick={() => switchView('notifications')}>Thông báo <b>{notifications.length}</b></button>
          </div>
          <ScenarioGuide role="DRIVER" />
          {activeView === 'today' && <TodayView />}
          {activeView === 'schedule' && <ScheduleView />}
          {activeView === 'history' && <HistoryView />}
          {activeView === 'notifications' && <NotificationView />}
        </section>
        <nav className="mobile-nav">
          <button className={activeView === 'today' ? 'active' : ''} onClick={() => switchView('today')}><ShipWheel />Trang chủ</button>
          <button className={activeView === 'schedule' ? 'active' : ''} onClick={() => switchView('schedule')}><ClipboardList />Lịch & Slot</button>
          <button className={activeView === 'notifications' ? 'active' : ''} onClick={() => switchView('notifications')}><Bell />Tin nhắn</button>
        </nav>
      </div>
    </main>
  )
}
