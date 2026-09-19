import { AlertTriangle, Box, CalendarCheck, Check, Container, Gauge, Ship, Truck, X } from 'lucide-react'
import BrandHeader from '../components/BrandHeader'
import StatusPill from '../components/StatusPill'
import { usePilot } from '../store/PilotStore'
import ScenarioGuide from '../components/ScenarioGuide'
import AuditTrail from '../components/AuditTrail'

export default function ControlTower() {
  const { state, actions } = usePilot()
  const { yard, trip, recommendation, exceptions, auditLog } = state
  return (
    <main className="dashboard-page control-page">
      <BrandHeader title="Port Control Tower" subtitle="Trung tâm điều hành Cảng Hải Phòng" />
      <section className="dashboard-content">
        <ScenarioGuide role="TERMINAL" />
        <div className="kpi-row control-kpis"><article><Container /><div><small>Yard Occupancy</small><strong>{yard.occupancy}%</strong></div></article><article><Gauge /><div><small>Dự báo +3 giờ</small><strong>{yard.forecast}%</strong></div></article><article><Truck /><div><small>Xe dự kiến đến</small><strong>96</strong></div></article><article><Box /><div><small>Gate Utilization</small><strong>{yard.gateIn}%</strong></div></article></div>
        <div className="control-grid">
          <section className="panel yard-panel"><div className="panel-title"><div><small>SƠ ĐỒ BÃI</small><h2>Mức lấp đầy theo block</h2></div></div><div className="yard-blocks">{yard.blocks.map((block) => <article key={block.name}><div className="block-grid">{Array.from({ length: 24 }, (_, index) => <span key={index} className={index < Math.round(block.occupancy / 4.2) ? (block.occupancy > 75 ? 'hot' : 'filled') : ''} />)}</div><div><strong>{block.name}</strong><b>{block.occupancy}%</b></div></article>)}</div></section>
          <section className="panel forecast-panel"><div className="panel-title"><div><small>DỰ BÁO BÃI</small><h2>Yard Occupancy 24 giờ</h2></div></div><div className="chart"><div className="chart-line"><span style={{ height: '45%' }} /><span style={{ height: '52%' }} /><span style={{ height: '60%' }} /><span style={{ height: '67%' }} /><span style={{ height: '74%' }} /><span className="forecast" style={{ height: '81%' }} /><span className="forecast" style={{ height: '76%' }} /><span className="forecast" style={{ height: '70%' }} /></div><div className="chart-labels"><span>08h</span><span>12h</span><span>16h</span><span>20h</span><span>00h</span></div></div><div className="gate-bars"><div><span>Gate-in</span><div><i style={{ width: `${yard.gateIn}%` }} /></div><b>{yard.gateIn}%</b></div><div><span>Gate-out</span><div><i style={{ width: `${yard.gateOut}%` }} /></div><b>{yard.gateOut}%</b></div></div></section>
          <aside className="panel terminal-panel"><div className="panel-title"><div><small>YÊU CẦU THAY ĐỔI</small><h2>Kiểm soát Appointment</h2></div></div>
            {recommendation.status === 'WAITING_TERMINAL' ? <div className="terminal-request"><CalendarCheck /><h3>{trip.container}</h3><p>Điều phối đề nghị chuyển Slot từ <b>{trip.slot}</b> sang <strong>{recommendation.proposedSlot}</strong>.</p><div className="rule-checks"><span><Check /> Container hợp lệ</span><span><Check /> Gate còn capacity</span><span><Check /> Bãi trong ngưỡng</span></div>{state.scenario.status !== 'RUNNING' && <div className="decision-buttons"><button onClick={actions.acceptNewSlot}><Check /> Chấp nhận</button><button className="reject" onClick={actions.rejectRecommendation}><X /> Từ chối</button></div>}</div> : <div className="empty-state"><Ship /><p>Chưa có yêu cầu đổi Slot chờ xác nhận.</p>{recommendation.status !== 'NONE' && <StatusPill value={recommendation.status} />}</div>}
          </aside>
          <section className="panel alerts-panel"><div className="panel-title"><div><small>CẢNH BÁO VẬN HÀNH</small><h2>Trạng thái hiện tại</h2></div></div><ul>{exceptions.map((item) => <li className={item.severity === 'CRITICAL' ? 'danger' : 'warning'} key={item.id}><AlertTriangle /> {item.text} <time>{item.status}</time></li>)}<li className="danger"><AlertTriangle /> Yard Block A trên 75% <time>14:02</time></li><li className="warning"><Truck /> Gate-in có xu hướng tăng <time>13:58</time></li><li><Ship /> Tàu MV Ocean Star đúng lịch <time>13:45</time></li></ul></section>
        </div>
        <AuditTrail entries={auditLog} compact />
      </section>
    </main>
  )
}
