import { CircleMarker, MapContainer, Polyline, Popup, TileLayer } from 'react-leaflet'
import { routePoints } from '../data/demoData'

export default function MapPanel({ routeIndex = 0, compact = false }) {
  const vehiclePosition = routePoints[routeIndex] || routePoints[0]
  const terminalPosition = routePoints[routePoints.length - 1]

  return (
    <div className={`map-shell ${compact ? 'map-compact' : ''}`}>
      <MapContainer center={[20.838, 106.742]} zoom={13} scrollWheelZoom className="map">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline positions={routePoints} pathOptions={{ color: '#0b63ce', weight: 6 }} />
        <CircleMarker center={vehiclePosition} radius={11} pathOptions={{ color: '#ffffff', weight: 4, fillColor: '#0b63ce', fillOpacity: 1 }}>
          <Popup>Xe 15H-246.88</Popup>
        </CircleMarker>
        <CircleMarker center={terminalPosition} radius={10} pathOptions={{ color: '#ffffff', weight: 4, fillColor: '#e23b3b', fillOpacity: 1 }}>
          <Popup>Cảng Tân Vũ</Popup>
        </CircleMarker>
      </MapContainer>
      <div className="map-legend"><span className="dot blue" /> Xe 15H-246.88 <span className="dot red" /> Cảng Tân Vũ</div>
    </div>
  )
}
