import { Link } from 'react-router-dom'

export default function BrandHeader({ title, subtitle, compact = false }) {
  return (
    <header className={`brand-header ${compact ? 'compact' : ''}`}>
      <Link className="brand" to="/"><img className="brand-logo" src="/pilot-logo.png" alt="PILOT" /></Link>
      <div className="brand-title"><strong>{title}</strong><small>{subtitle}</small></div>
      <Link className="home-link" to="/">Đổi giao diện</Link>
    </header>
  )
}
