import { AlertTriangle, Check, Clock3, Navigation, RotateCcw, Truck, X } from 'lucide-react'
import BrandHeader from '../components/BrandHeader'
import MapPanel from '../components/MapPanel'
import StatusPill from '../components/StatusPill'
import ScenarioGuide from '../components/ScenarioGuide'
import AuditTrail from '../components/AuditTrail'
import { usePilot } from '../store/PilotStore'

export default function Dispatcher() {
  const { state, actions } = usePilot()
  const { trip, recommendation, exceptions, auditLog } = state
  return (
    <main className="dashboard-page">
      <BrandHeader title="Bảng điều phối doanh nghiệp vận tải" subtitle="Theo dõi đội xe và xử lý ngoại lệ" />
      <section className="dashboard-content">
        <ScenarioGuide role="DISPATCHER" />
        <div className="kpi-row">
          <article><Truck /><div><small>Tổng chuyến</small><strong>120</strong></div></article>
          <article><Clock3 /><div><small>Đúng giờ</small><strong>86%</strong></div></article>
          <article className="danger-kpi"><AlertTriangle /><div><small>Có nguy cơ</small><strong>{trip.risk === 'ON_TIME' ? 13 : 14}</strong></div></article>
          <article><Navigation /><div><small>Chờ phê duyệt</small><strong>{recommendation.status === 'PENDING' ? 1 : 0}</strong></div></article>
        </div>
        <div className="dispatcher-grid">
          <section className="panel map-panel"><div className="panel-title"><div><small>BẢN ĐỒ ĐỘI XE</small><h2>Hải Phòng</h2></div><span className="live-dot">● Trực tiếp</span></div><MapPanel routeIndex={trip.routeIndex} /></section>
          <section className="panel trip-panel"><div className="panel-title"><div><small>DANH SÁCH CHUYẾN</small><h2>Chuyến đang theo dõi</h2></div></div>
            <div className="trip-table"><div className="trip-table-head"><span>Chuyến</span><span>Slot</span><span>ETA</span><span>Rủi ro</span></div><div className="trip-table-row"><span><b>{trip.id}</b><small>{trip.container}</small></span><span>{trip.slot}</span><span><b>{trip.eta}</b></span><span><StatusPill value={trip.risk} /></span></div></div>
          </section>
          <aside className="panel recommendation-panel"><div className="panel-title"><div><small>KHUYẾN NGHỊ</small><h2>Phương án xử lý</h2></div><StatusPill value={recommendation.status} /></div>
            {recommendation.status === 'NONE' ? <div className="empty-state"><Check /><p>Chưa có ngoại lệ cần xử lý.</p></div> : <div className="recommendation-body"><AlertTriangle /><h3>Đề xuất đổi Slot</h3><p>{recommendation.reason}</p><div className="slot-change"><span>{trip.slot}</span><b>→</b><strong>{recommendation.proposedSlot}</strong></div>
              {recommendation.status === 'PENDING' && state.scenario.status !== 'RUNNING' && <div className="decision-buttons"><button onClick={actions.approveRecommendation}><Check /> Phê duyệt</button><button className="reject" onClick={actions.rejectRecommendation}><X /> Từ chối</button></div>}
              {recommendation.status === 'WAITING_TERMINAL' && <p className="waiting-text">Đã gửi yêu cầu. Đang chờ terminal xác nhận.</p>}
              {recommendation.status === 'ACCEPTED' && <p className="accepted-text">Terminal đã xác nhận lịch mới.</p>}
            </div>}
          </aside>
        </div>
        <div className="operations-grid">
          <section className="panel exception-panel"><div className="panel-title"><div><small>EXCEPTION QUEUE</small><h2>Ngoại lệ cần theo dõi</h2></div><b>{exceptions.filter((item) => item.status === 'OPEN').length} mở</b></div>{exceptions.length ? <div className="exception-list">{exceptions.map((item) => <article key={item.id}><AlertTriangle /><div><strong>{item.type}</strong><small>{item.text}</small></div><StatusPill value={item.status} /></article>)}</div> : <div className="empty-inline">Không có ngoại lệ đang mở.</div>}</section>
          <AuditTrail entries={auditLog} compact />
        </div>
        <button className="subtle-button" onClick={actions.resetDemo}><RotateCcw /> Đặt lại kịch bản</button>
      </section>
    </main>
  )
}
