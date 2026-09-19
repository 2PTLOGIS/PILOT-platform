import { ArrowRight, CheckCircle2, Circle, RotateCcw, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import AuditTrail from '../components/AuditTrail'
import BrandHeader from '../components/BrandHeader'
import { getScenario, roleMeta, scenarioDefinitions } from '../data/scenarios'
import { usePilot } from '../store/PilotStore'

export default function DemoStudio() {
  const { state, actions } = usePilot()
  const active = getScenario(state.scenario.id)
  const currentStep = active.steps[state.scenario.step]
  const complete = state.scenario.status === 'COMPLETED'

  return (
    <main className="dashboard-page studio-page">
      <BrandHeader title="PILOT Demo Studio" subtitle="Trung tâm điều khiển 5 kịch bản nghiệp vụ" />
      <section className="dashboard-content">
        <div className="studio-intro"><div><small>DEMO CÓ DẪN CHUYỆN</small><h1>Chọn tình huống, rồi đóng vai từng bên</h1><p>Mỗi nút bấm thay đổi dữ liệu dùng chung của Driver, Dispatcher và Port Control Tower. Hệ thống chỉ mở hành động đúng vai trò, đúng thứ tự.</p></div><ShieldCheck /></div>
        <div className="scenario-catalog">
          {scenarioDefinitions.map((scenario) => (
            <button key={scenario.id} className={`scenario-card ${scenario.color} ${state.scenario.id === scenario.id ? 'selected' : ''}`} onClick={() => actions.loadScenario(scenario.id)}>
              <span>{scenario.number}</span><div><strong>{scenario.title}</strong><small>{scenario.short}</small></div>{state.scenario.id === scenario.id && <CheckCircle2 />}
            </button>
          ))}
        </div>
        <div className="studio-grid">
          <section className="runbook-card">
            <div className="runbook-heading"><div><small>KỊCH BẢN ĐANG CHẠY</small><h2>{active.number}. {active.title}</h2></div><button onClick={() => actions.loadScenario(active.id)}><RotateCcw /> Chạy lại</button></div>
            <div className="runbook-steps">
              {active.steps.map((step, index) => {
                const done = index < state.scenario.step || complete
                const now = index === state.scenario.step && !complete
                return <article className={done ? 'done' : now ? 'current' : ''} key={`${step.role}-${index}`}><div>{done ? <CheckCircle2 /> : <Circle />}</div><span>BƯỚC {index + 1}</span><section><strong>{roleMeta[step.role].label}: {step.action}</strong><small>{step.result}</small></section></article>
              })}
            </div>
            {!complete && <Link className="next-role-button" to={roleMeta[currentStep.role].path}>Mở giao diện {roleMeta[currentStep.role].label}<ArrowRight /></Link>}
            {complete && <div className="scenario-complete"><CheckCircle2 /> Kịch bản hoàn thành — có thể chọn tình huống tiếp theo.</div>}
          </section>
          <AuditTrail entries={state.auditLog} />
        </div>
      </section>
    </main>
  )
}
