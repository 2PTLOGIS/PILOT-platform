import { Building2, Clapperboard, RotateCcw, Route, Smartphone, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { usePilot } from '../store/PilotStore'

const apps = [
  { to: '/demo-studio', icon: Clapperboard, label: 'Bắt đầu tại đây', title: 'Demo Studio', description: 'Chọn 1 trong 5 tình huống và xem hướng dẫn đúng vai trò, đúng thứ tự.' },
  { to: '/driver', icon: Smartphone, label: 'Tài xế', title: 'PILOT Driver', description: 'Giao diện điện thoại có chuyến, bản đồ, ETA và cảnh báo.' },
  { to: '/dispatcher', icon: Truck, label: 'Doanh nghiệp vận tải', title: 'Dispatcher Dashboard', description: 'Theo dõi đội xe, ngoại lệ và phê duyệt khuyến nghị.' },
  { to: '/control-tower', icon: Building2, label: 'Cảng / Terminal', title: 'Port Control Tower', description: 'Giám sát bãi, Gate và xác nhận yêu cầu đổi Slot.' },
]

export default function Home() {
  const { actions } = usePilot()
  return (
    <main className="landing">
      <section className="landing-hero">
        <div className="hero-kicker"><Route size={18} /> CẢNG HẢI PHÒNG</div>
        <img className="landing-logo" src="/pilot-logo.png" alt="PILOT" />
        <h1>Điều phối <span>End-to-End</span></h1>
        <p>Một nguồn dữ liệu dùng chung cho tài xế, doanh nghiệp vận tải và terminal. Demo Studio dẫn dắt 5 tình huống vận hành có phê duyệt và Audit Trail.</p>
      </section>
      <section className="app-grid">
        {apps.map(({ to, icon: Icon, label, title, description }, index) => (
          <Link className="app-card" to={to} key={to}>
            <div className="card-top"><span className="card-number">0{index + 1}</span><Icon size={30} /></div>
            <small>{label}</small><h2>{title}</h2><p>{description}</p><span className="card-link">Mở giao diện →</span>
          </Link>
        ))}
      </section>
      <button className="reset-button" onClick={actions.resetDemo}><RotateCcw size={17} /> Đặt lại dữ liệu demo</button>
      <p className="demo-note">Mẹo trình diễn: mở Driver, Dispatcher và Control Tower ở ba tab trình duyệt khác nhau.</p>
    </main>
  )
}
