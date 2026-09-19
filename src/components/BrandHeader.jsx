import { Link } from 'react-router-dom'
import { usePilot } from '../store/PilotStore'

export default function BrandHeader({ title, subtitle, compact = false }) {
  const { sync } = usePilot()

  return (
    <header className={`brand-header ${compact ? 'compact' : ''}`}>
      <Link className="brand" to="/"><img className="brand-logo" src="/pilot-logo.png" alt="PILOT" /></Link>
      <div className="brand-title"><strong>{title}</strong><small>{subtitle}</small></div>
      <div className="header-actions">
        <span className={`sync-badge ${sync.mode}`}><i />{sync.label}</span>
        <Link className="home-link" to="/">Đổi giao diện</Link>
      </div>
    </header>
  )
}
