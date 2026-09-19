import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import DriverApp from './pages/DriverApp'
import Dispatcher from './pages/Dispatcher'
import ControlTower from './pages/ControlTower'
import DemoStudio from './pages/DemoStudio'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/driver" element={<DriverApp />} />
      <Route path="/dispatcher" element={<Dispatcher />} />
      <Route path="/control-tower" element={<ControlTower />} />
      <Route path="/demo-studio" element={<DemoStudio />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
