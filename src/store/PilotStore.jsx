import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { initialState } from '../data/demoData'
import { getScenario, roleMeta } from '../data/scenarios'
import { isSupabaseConfigured } from '../services/supabase'
import { loadSharedState, saveSharedState, subscribeToSharedState } from '../services/realtimeState'

const STORAGE_KEY = 'pilot-demo-state-v1'
const CHANNEL_KEY = 'pilot-demo-channel'
const CLIENT_KEY = 'pilot-demo-client-id'
const PilotContext = createContext(null)

function getClientId() {
  const saved = sessionStorage.getItem(CLIENT_KEY)
  if (saved) return saved
  const next = globalThis.crypto?.randomUUID?.() || `client-${Date.now()}-${Math.random()}`
  sessionStorage.setItem(CLIENT_KEY, next)
  return next
}

function isValidState(value) {
  return Boolean(value && value.schemaVersion === 3 && value.trip && value.scenario)
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (!saved) return initialState
    if (saved.schemaVersion !== 3) {
      const migrated = scenarioState('slot-request')
      return {
        ...migrated,
        preferredSlots: saved.preferredSlots || migrated.preferredSlots,
        tripHistory: saved.tripHistory || migrated.tripHistory,
      }
    }
    return {
      ...initialState,
      ...saved,
      trip: { ...initialState.trip, ...saved.trip },
      yard: { ...initialState.yard, ...saved.yard },
      recommendation: { ...initialState.recommendation, ...saved.recommendation },
      appointment: { ...initialState.appointment, ...saved.appointment },
      scenario: saved.scenario || initialState.scenario,
      exceptions: saved.exceptions || initialState.exceptions,
      auditLog: saved.auditLog || initialState.auditLog,
      notifications: saved.notifications || initialState.notifications,
      preferredSlots: saved.preferredSlots || initialState.preferredSlots,
      tripHistory: saved.tripHistory || initialState.tripHistory,
    }
  } catch {
    return initialState
  }
}

function cloneInitialState() {
  return JSON.parse(JSON.stringify(initialState))
}

function scenarioState(id) {
  const next = cloneInitialState()
  next.scenario = { id, step: 0, status: 'RUNNING' }
  if (id === 'slot-request') {
    next.trip = { ...next.trip, slot: 'Chưa có Slot', status: 'DRAFT', eta: '--:--' }
    next.appointment = { ...next.appointment, status: 'DRAFT', requestedSlot: '09:00 – 09:30' }
  }
  if (id === 'traffic-delay') {
    next.appointment = { ...next.appointment, status: 'ACCEPTED', requestedSlot: next.trip.slot }
  }
  if (id === 'container-hold') {
    next.trip = { ...next.trip, slot: '10:00 – 10:30', eta: '09:48', containerStatus: 'READY' }
    next.appointment = { ...next.appointment, status: 'ACCEPTED', requestedSlot: '10:00 – 10:30' }
  }
  if (id === 'gate-failure') {
    next.trip = { ...next.trip, slot: '15:00 – 15:30', eta: '15:12' }
    next.appointment = { ...next.appointment, status: 'ACCEPTED', requestedSlot: '15:00 – 15:30' }
  }
  if (id === 'yard-overload') {
    next.trip = { ...next.trip, slot: '16:00 – 16:30', eta: '16:12' }
    next.appointment = { ...next.appointment, status: 'ACCEPTED', requestedSlot: '16:00 – 16:30' }
  }
  return next
}

function addAudit(state, role, action, detail) {
  const now = new Date()
  return [{
    id: `${now.getTime()}-${state.auditLog.length}`,
    role,
    roleLabel: roleMeta[role].label,
    action,
    detail,
    time: now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  }, ...state.auditLog]
}

function addNotification(state, type, text) {
  return [{ id: `${Date.now()}-${state.notifications.length}`, type, text }, ...state.notifications]
}

function executeScenario(current, actor) {
  const scenario = getScenario(current.scenario.id)
  const stepIndex = current.scenario.step
  const step = scenario.steps[stepIndex]
  if (!step || step.role !== actor || current.scenario.status === 'COMPLETED') return current

  let next = { ...current }
  const id = scenario.id

  if (id === 'slot-request') {
    if (stepIndex === 0) next = { ...next, appointment: { ...next.appointment, status: 'PENDING_DISPATCHER' }, recommendation: { status: 'PENDING', reason: 'Tài xế đề nghị khung giờ 09:00 – 09:30.', proposedSlot: '09:00 – 09:30' }, notifications: addNotification(next, 'info', 'Yêu cầu Slot đã được gửi tới điều phối.') }
    if (stepIndex === 1) next = { ...next, appointment: { ...next.appointment, status: 'WAITING_TERMINAL' }, recommendation: { ...next.recommendation, status: 'WAITING_TERMINAL' }, notifications: addNotification(next, 'info', 'Điều phối đã kiểm tra và chuyển yêu cầu tới terminal.') }
    if (stepIndex === 2) next = { ...next, appointment: { ...next.appointment, status: 'ACCEPTED', confirmedAt: new Date().toISOString() }, trip: { ...next.trip, slot: next.appointment.requestedSlot, status: 'SLOT_CONFIRMED', eta: '08:48' }, recommendation: { ...next.recommendation, status: 'ACCEPTED' }, notifications: addNotification(next, 'success', `Terminal xác nhận Appointment ${next.appointment.id}: ${next.appointment.requestedSlot}.`) }
    if (stepIndex === 3) next = { ...next, appointment: { ...next.appointment, status: 'ACKNOWLEDGED' }, notifications: addNotification(next, 'success', 'Tài xế đã nhận lịch và sẵn sàng thực hiện chuyến.') }
  }

  if (id === 'traffic-delay') {
    if (stepIndex === 0) next = { ...next, trip: { ...next.trip, status: 'IN_TRANSIT', routeIndex: 1, distance: 10.6 }, notifications: addNotification(next, 'success', 'Chuyến đã bắt đầu. GPS đang gửi dữ liệu.') }
    if (stepIndex === 1) next = { ...next, trip: { ...next.trip, routeIndex: 3, distance: 6.8, eta: '14:46', risk: 'AT_RISK' }, recommendation: { status: 'PENDING', reason: 'ETA mới vượt cuối Slot 16 phút do ùn tắc QL5B.', proposedSlot: '15:00 – 15:30' }, exceptions: [{ id: 'EX-LATE-001', type: 'LATE_RISK', severity: 'HIGH', status: 'OPEN', text: 'ETA vượt Slot 16 phút' }], notifications: addNotification(next, 'danger', 'AI phát hiện nguy cơ trễ Slot và tạo khuyến nghị.') }
    if (stepIndex === 2) next = { ...next, recommendation: { ...next.recommendation, status: 'WAITING_TERMINAL' }, notifications: addNotification(next, 'info', 'Điều phối đã phê duyệt Change Request.') }
    if (stepIndex === 3) next = { ...next, trip: { ...next.trip, slot: next.recommendation.proposedSlot, risk: 'ON_TIME' }, recommendation: { ...next.recommendation, status: 'ACCEPTED' }, appointment: { ...next.appointment, requestedSlot: next.recommendation.proposedSlot, status: 'ACCEPTED' }, exceptions: next.exceptions.map((item) => ({ ...item, status: 'RESOLVED' })), notifications: addNotification(next, 'success', 'Terminal đã xác nhận Slot mới 15:00 – 15:30.') }
    if (stepIndex === 4) next = { ...next, appointment: { ...next.appointment, status: 'ACKNOWLEDGED' }, notifications: addNotification(next, 'success', 'Tài xế đã nhận Slot mới và tiếp tục di chuyển.') }
  }

  if (id === 'container-hold') {
    if (stepIndex === 0) next = { ...next, trip: { ...next.trip, containerStatus: 'HOLD', risk: 'CRITICAL' }, recommendation: { status: 'BLOCKED', reason: 'Hard Constraint: container đang HOLD, không được phép thực hiện.', proposedSlot: '' }, exceptions: [{ id: 'EX-HOLD-001', type: 'CONTAINER_HOLD', severity: 'CRITICAL', status: 'OPEN', text: 'Container chuyển trạng thái HOLD' }], notifications: addNotification(next, 'danger', 'Container HOLD: Rule Engine đã chặn chuyến.') }
    if (stepIndex === 1) next = { ...next, trip: { ...next.trip, status: 'PAUSED' }, notifications: addNotification(next, 'danger', 'Điều phối yêu cầu tạm dừng, không di chuyển tới cảng.') }
    if (stepIndex === 2) next = { ...next, notifications: addNotification(next, 'info', 'Tài xế xác nhận đã dừng tại vị trí an toàn.') }
    if (stepIndex === 3) next = { ...next, trip: { ...next.trip, containerStatus: 'READY', risk: 'AT_RISK' }, recommendation: { status: 'PENDING', reason: 'Container đã READY; cần cấp lại Slot do lịch cũ không còn khả thi.', proposedSlot: '11:00 – 11:30' }, exceptions: next.exceptions.map((item) => ({ ...item, status: 'RESOLVED' })), notifications: addNotification(next, 'success', 'Terminal đã gỡ HOLD. Có thể tái lập lịch.') }
    if (stepIndex === 4) next = { ...next, recommendation: { ...next.recommendation, status: 'WAITING_TERMINAL' }, notifications: addNotification(next, 'info', 'Điều phối gửi đề nghị Slot 11:00 – 11:30.') }
    if (stepIndex === 5) next = { ...next, trip: { ...next.trip, slot: '11:00 – 11:30', status: 'SLOT_CONFIRMED', risk: 'ON_TIME' }, appointment: { ...next.appointment, requestedSlot: '11:00 – 11:30', status: 'ACCEPTED' }, recommendation: { ...next.recommendation, status: 'ACCEPTED' }, notifications: addNotification(next, 'success', 'Slot thay thế đã được xác nhận; chuyến được mở lại.') }
  }

  if (id === 'gate-failure') {
    if (stepIndex === 0) next = { ...next, yard: { ...next.yard, gateIn: 96 }, trip: { ...next.trip, risk: 'AT_RISK' }, recommendation: { status: 'PENDING', reason: 'Gate-in 02 gặp sự cố; capacity còn 4 xe/15 phút.', proposedSlot: '16:00 – 16:30' }, exceptions: [{ id: 'EX-GATE-001', type: 'GATE_FAILURE', severity: 'HIGH', status: 'OPEN', text: 'Gate-in 02 tạm ngưng' }], notifications: addNotification(next, 'danger', 'Cảng thông báo Gate-in giảm năng lực.') }
    if (stepIndex === 1) next = { ...next, recommendation: { ...next.recommendation, status: 'WAITING_TERMINAL' }, notifications: addNotification(next, 'info', 'Điều phối đồng ý giãn chuyến sang 16:00.') }
    if (stepIndex === 2) next = { ...next, trip: { ...next.trip, slot: '16:00 – 16:30', risk: 'ON_TIME' }, appointment: { ...next.appointment, requestedSlot: '16:00 – 16:30', status: 'ACCEPTED' }, recommendation: { ...next.recommendation, status: 'ACCEPTED' }, exceptions: next.exceptions.map((item) => ({ ...item, status: 'MONITORING' })), notifications: addNotification(next, 'success', 'Terminal giữ capacity cho Slot 16:00 – 16:30.') }
    if (stepIndex === 3) next = { ...next, appointment: { ...next.appointment, status: 'ACKNOWLEDGED' }, notifications: addNotification(next, 'success', 'Tài xế đã nhận chỉ dẫn đến cổng lúc 16:00.') }
  }

  if (id === 'yard-overload') {
    if (stepIndex === 0) next = { ...next, yard: { ...next.yard, occupancy: 89, forecast: 96, gateIn: 91, blocks: next.yard.blocks.map((block, index) => index === 0 ? { ...block, occupancy: 94 } : block) }, trip: { ...next.trip, risk: 'AT_RISK' }, recommendation: { status: 'PENDING', reason: 'MV Ocean Star đến sớm; Block A dự báo đạt 96%.', proposedSlot: '17:00 – 17:30' }, exceptions: [{ id: 'EX-YARD-001', type: 'YARD_OVERLOAD', severity: 'CRITICAL', status: 'OPEN', text: 'Forecast Block A vượt ngưỡng' }], notifications: addNotification(next, 'danger', 'Forecast cảnh báo bãi có nguy cơ quá tải.') }
    if (stepIndex === 1) next = { ...next, recommendation: { ...next.recommendation, status: 'WAITING_TERMINAL' }, notifications: addNotification(next, 'info', 'Điều phối chấp thuận giãn Trip qua cao điểm bãi.') }
    if (stepIndex === 2) next = { ...next, trip: { ...next.trip, slot: '17:00 – 17:30', risk: 'ON_TIME' }, appointment: { ...next.appointment, requestedSlot: '17:00 – 17:30', status: 'ACCEPTED' }, recommendation: { ...next.recommendation, status: 'ACCEPTED' }, yard: { ...next.yard, gateIn: 78 }, exceptions: next.exceptions.map((item) => ({ ...item, status: 'MONITORING' })), notifications: addNotification(next, 'success', 'Terminal xác nhận Slot sau cao điểm 17:00 – 17:30.') }
    if (stepIndex === 3) next = { ...next, appointment: { ...next.appointment, status: 'ACKNOWLEDGED' }, notifications: addNotification(next, 'success', 'Tài xế xác nhận chờ tại điểm an toàn tới 17:00.') }
  }

  const nextStep = stepIndex + 1
  const completed = nextStep >= scenario.steps.length
  return {
    ...next,
    scenario: { ...next.scenario, step: nextStep, status: completed ? 'COMPLETED' : 'RUNNING' },
    auditLog: addAudit(next, actor, step.action, step.result),
  }
}

export function PilotProvider({ children }) {
  const [state, setState] = useState(loadState)
  const [sync, setSync] = useState(() => isSupabaseConfigured
    ? { mode: 'connecting', label: 'Đang kết nối dữ liệu' }
    : { mode: 'local', label: 'Chế độ cục bộ' })
  const channel = useRef(null)
  const clientId = useRef(getClientId())
  const stateRef = useRef(state)
  const remoteReady = useRef(false)

  useEffect(() => {
    stateRef.current = state
  }, [state])

  useEffect(() => {
    if ('BroadcastChannel' in window) {
      channel.current = new BroadcastChannel(CHANNEL_KEY)
      channel.current.onmessage = (event) => {
        if (!isValidState(event.data)) return
        localStorage.setItem(STORAGE_KEY, JSON.stringify(event.data))
        setState(event.data)
      }
    }
    const onStorage = (event) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return
      const next = JSON.parse(event.newValue)
      if (isValidState(next)) setState(next)
    }
    window.addEventListener('storage', onStorage)

    let stopRealtime = () => {}
    let cancelled = false

    async function startRealtime() {
      if (!isSupabaseConfigured) return

      try {
        const remote = await loadSharedState()
        if (cancelled) return

        if (isValidState(remote?.state)) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(remote.state))
          setState(remote.state)
        } else {
          await saveSharedState(stateRef.current, clientId.current)
        }

        remoteReady.current = true
        setSync({ mode: 'online', label: 'Đồng bộ trực tuyến' })

        stopRealtime = subscribeToSharedState({
          onState(row) {
            if (!row || row.updated_by === clientId.current || !isValidState(row.state)) return
            localStorage.setItem(STORAGE_KEY, JSON.stringify(row.state))
            setState(row.state)
            setSync({ mode: 'online', label: 'Đồng bộ trực tuyến' })
          },
          onStatus(status) {
            if (status === 'SUBSCRIBED') setSync({ mode: 'online', label: 'Đồng bộ trực tuyến' })
            if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
              setSync({ mode: 'error', label: 'Mất kết nối – đã lưu máy' })
            }
          },
        })
      } catch (error) {
        console.error('Không thể kết nối Supabase:', error)
        setSync({ mode: 'error', label: 'Mất kết nối – đã lưu máy' })
      }
    }

    startRealtime()

    return () => {
      cancelled = true
      stopRealtime()
      channel.current?.close()
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const commit = (updater) => {
    setState((current) => {
      const next = typeof updater === 'function' ? updater(current) : updater
      const stamped = { ...next, lastUpdated: new Date().toISOString() }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stamped))
      channel.current?.postMessage(stamped)

      if (remoteReady.current) {
        setSync({ mode: 'syncing', label: 'Đang đồng bộ' })
        saveSharedState(stamped, clientId.current)
          .then(() => setSync({ mode: 'online', label: 'Đồng bộ trực tuyến' }))
          .catch((error) => {
            console.error('Không thể lưu dữ liệu Supabase:', error)
            setSync({ mode: 'error', label: 'Mất kết nối – đã lưu máy' })
          })
      }

      return stamped
    })
  }

  const actions = useMemo(() => ({
    loadScenario(id) {
      commit({ ...scenarioState(id), lastUpdated: new Date().toISOString() })
    },
    executeScenarioStep(actor) {
      commit((current) => executeScenario(current, actor))
    },
    startTrip() {
      commit((current) => ({
        ...current,
        trip: { ...current.trip, status: 'IN_TRANSIT' },
        notifications: [{ id: Date.now(), type: 'success', text: 'Chuyến đã bắt đầu. GPS đang được theo dõi.' }, ...current.notifications],
      }))
    },
    advanceVehicle() {
      commit((current) => {
        const nextIndex = Math.min(current.trip.routeIndex + 1, 6)
        const atRisk = nextIndex >= 3 && current.recommendation.status === 'NONE'
        return {
          ...current,
          trip: {
            ...current.trip,
            status: nextIndex === 6 ? 'AT_GATE' : 'IN_TRANSIT',
            routeIndex: nextIndex,
            distance: Math.max(0.8, Number((12.5 - nextIndex * 1.9).toFixed(1))),
            eta: atRisk ? '14:46' : nextIndex === 6 ? '14:40' : current.trip.eta,
            risk: atRisk ? 'AT_RISK' : current.trip.risk,
            gpsFreshness: 'Vừa cập nhật',
          },
          recommendation: atRisk ? {
            status: 'PENDING',
            reason: 'ETA mới có nguy cơ vượt khung giờ đã xác nhận 16 phút.',
            proposedSlot: '15:00 – 15:30',
          } : current.recommendation,
          notifications: atRisk ? [{ id: Date.now(), type: 'danger', text: 'Cảnh báo: chuyến có nguy cơ trễ Slot.' }, ...current.notifications] : current.notifications,
        }
      })
    },
    reportIncident() {
      commit((current) => ({
        ...current,
        trip: { ...current.trip, risk: 'CRITICAL' },
        recommendation: { status: 'PENDING', reason: 'Tài xế báo sự cố trên hành trình.', proposedSlot: '15:00 – 15:30' },
        notifications: [{ id: Date.now(), type: 'danger', text: 'Đã gửi báo cáo sự cố tới điều phối.' }, ...current.notifications],
      }))
    },
    requestPreferredSlot(slot, terminal) {
      commit((current) => ({
        ...current,
        preferredSlots: [
          { id: Date.now(), slot, terminal, status: 'CONFIRMED' },
          ...current.preferredSlots,
        ],
        notifications: [
          { id: Date.now(), type: 'success', text: `Hệ thống đã ghi nhận khung giờ mong muốn ${slot} tại ${terminal}.` },
          ...current.notifications,
        ],
      }))
    },
    approveRecommendation() {
      commit((current) => ({
        ...current,
        recommendation: { ...current.recommendation, status: 'WAITING_TERMINAL' },
        notifications: [{ id: Date.now(), type: 'info', text: 'Điều phối đã gửi yêu cầu đổi Slot tới terminal.' }, ...current.notifications],
      }))
    },
    acceptNewSlot() {
      commit((current) => ({
        ...current,
        trip: { ...current.trip, slot: current.recommendation.proposedSlot, risk: 'ON_TIME' },
        recommendation: { ...current.recommendation, status: 'ACCEPTED' },
        notifications: [{ id: Date.now(), type: 'success', text: `Terminal đã xác nhận Slot mới ${current.recommendation.proposedSlot}.` }, ...current.notifications],
      }))
    },
    rejectRecommendation() {
      commit((current) => ({
        ...current,
        recommendation: { ...current.recommendation, status: 'REJECTED' },
        notifications: [{ id: Date.now(), type: 'danger', text: 'Yêu cầu đổi Slot đã bị từ chối.' }, ...current.notifications],
      }))
    },
    resetDemo() {
      commit({ ...scenarioState('slot-request'), lastUpdated: new Date().toISOString() })
    },
  }), [])

  return <PilotContext.Provider value={{ state, actions, sync }}>{children}</PilotContext.Provider>
}

export function usePilot() {
  const context = useContext(PilotContext)
  if (!context) throw new Error('usePilot phải được dùng bên trong PilotProvider')
  return context
}
