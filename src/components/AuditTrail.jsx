import { History } from 'lucide-react'

export default function AuditTrail({ entries = [], compact = false }) {
  return (
    <section className={`audit-panel ${compact ? 'compact' : ''}`}>
      <div className="audit-title"><History /><div><strong>Audit Trail</strong><small>Không xóa lịch sử quyết định</small></div></div>
      <div className="audit-list">
        {entries.length === 0 && <p>Chưa có thao tác trong kịch bản.</p>}
        {entries.slice(0, compact ? 4 : 20).map((entry) => (
          <article key={entry.id}>
            <span className={`audit-role ${entry.role.toLowerCase()}`}>{entry.roleLabel}</span>
            <div><strong>{entry.action}</strong><small>{entry.detail}</small></div>
            <time>{entry.time}</time>
          </article>
        ))}
      </div>
    </section>
  )
}
