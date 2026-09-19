import { ArrowRight, CheckCircle2, LockKeyhole, PlayCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getScenario, roleMeta } from '../data/scenarios'
import { usePilot } from '../store/PilotStore'

export default function ScenarioGuide({ role }) {
  const { state, actions } = usePilot()
  const scenario = getScenario(state.scenario.id)
  const step = scenario.steps[state.scenario.step]
  const completed = state.scenario.status === 'COMPLETED'
  const isMyTurn = step?.role === role

  return (
    <section className={`scenario-guide ${completed ? 'completed' : isMyTurn ? 'my-turn' : ''}`}>
      <div className="scenario-guide-top">
        <span>KỊCH BẢN {scenario.number}</span>
        <Link to="/demo-studio">Đổi kịch bản</Link>
      </div>
      <h3>{scenario.title}</h3>
      <div className="scenario-progress">
        {scenario.steps.map((item, index) => <i key={`${item.role}-${index}`} className={index < state.scenario.step || completed ? 'done' : index === state.scenario.step ? 'active' : ''} />)}
      </div>
      {completed ? (
        <div className="scenario-message"><CheckCircle2 /><div><strong>Kịch bản đã hoàn tất</strong><small>Mọi quyết định đã được ghi vào Audit Log.</small></div></div>
      ) : isMyTurn ? (
        <>
          <p><PlayCircle /> Đến lượt <b>{roleMeta[role].label}</b>: {step.action}</p>
          <button onClick={() => actions.executeScenarioStep(role)}>{step.action}<ArrowRight /></button>
        </>
      ) : (
        <div className="scenario-message waiting"><LockKeyhole /><div><strong>Đang chờ {roleMeta[step.role].label}</strong><small>{step.action}</small></div></div>
      )}
    </section>
  )
}
