import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet'
import { motion } from 'framer-motion'
import useStore from '../store/useStore'
import 'leaflet/dist/leaflet.css'

// Fix default marker icons in Leaflet + bundlers
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
})

const sourceIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png',
    shadowUrl: markerShadow,
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
})

const destIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: markerShadow,
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
})

function MapClickHandler({ clickMode, onSourceSet, onDestSet, onStopAdd }) {
    useMapEvents({
        click(e) {
            const pos = { lat: e.latlng.lat, lng: e.latlng.lng }
            if (clickMode === 'source') onSourceSet(pos)
            else if (clickMode === 'destination') onDestSet(pos)
            else if (clickMode === 'stop') onStopAdd(pos)
        },
    })
    return null
}

export default function MapView() {
    const {
        mapSource, mapDestination, mapStops, transport,
        setMapSource, setMapDestination, addMapStop,
    } = useStore()

    const [clickMode, setClickMode] = useState('source')
    const [routePath, setRoutePath] = useState([])

    // Build route visualization
    useEffect(() => {
        if (mapSource && mapDestination) {
            const points = [
                [mapSource.lat, mapSource.lng],
                ...mapStops.map(s => [s.lat, s.lng]),
                [mapDestination.lat, mapDestination.lng],
            ]
            setRoutePath(points)
        } else {
            setRoutePath([])
        }
    }, [mapSource, mapDestination, mapStops])

    const defaultCenter = [28.6139, 77.209] // New Delhi
    const center = mapSource ? [mapSource.lat, mapSource.lng] : defaultCenter

    return (
        <div style={{
            flex: 1, borderRadius: '16px', overflow: 'hidden',
            border: '1px solid var(--border)', position: 'relative', minHeight: '400px',
        }}>
            {/* Click mode selector */}
            <div style={{
                position: 'absolute', top: '12px', left: '50%', transform: 'translateX(-50%)',
                zIndex: 1000, display: 'flex', gap: '4px',
                padding: '4px', borderRadius: '12px',
                background: 'var(--bg-glass-strong)', backdropFilter: 'blur(20px)',
                border: '1px solid var(--border)',
            }}>
                {['source', 'destination', 'stop'].map(mode => (
                    <motion.button
                        key={mode}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setClickMode(mode)}
                        style={{
                            padding: '6px 14px', borderRadius: '8px', border: 'none',
                            fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                            background: clickMode === mode ? 'var(--accent)' : 'transparent',
                            color: clickMode === mode ? 'white' : 'var(--text-secondary)',
                            transition: 'all 0.2s',
                        }}
                    >
                        {mode === 'source' ? '📍 Source' : mode === 'destination' ? '🏁 Dest' : '📌 Stop'}
                    </motion.button>
                ))}
            </div>

            <MapContainer center={center} zoom={13} style={{ width: '100%', height: '100%', minHeight: '400px' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapClickHandler
                    clickMode={clickMode}
                    onSourceSet={setMapSource}
                    onDestSet={setMapDestination}
                    onStopAdd={addMapStop}
                />

                {mapSource && (
                    <Marker position={[mapSource.lat, mapSource.lng]} icon={sourceIcon}>
                        <Popup>Source</Popup>
                    </Marker>
                )}

                {mapDestination && (
                    <Marker position={[mapDestination.lat, mapDestination.lng]} icon={destIcon}>
                        <Popup>Destination</Popup>
                    </Marker>
                )}

                {mapStops.map((s, i) => (
                    <Marker key={i} position={[s.lat, s.lng]}>
                        <Popup>Stop {i + 1}</Popup>
                    </Marker>
                ))}

                {routePath.length > 1 && (
                    <Polyline
                        positions={routePath}
                        pathOptions={{
                            color: transport === 'car' ? '#6366f1' : transport === 'bike' ? '#10b981' : '#f59e0b',
                            weight: 4,
                            dashArray: '10, 8',
                            opacity: 0.8,
                        }}
                    />
                )}
            </MapContainer>

            {/* Transport indicator */}
            <div style={{
                position: 'absolute', bottom: '12px', left: '12px', zIndex: 1000,
                padding: '6px 12px', borderRadius: '8px',
                background: 'var(--bg-glass-strong)', backdropFilter: 'blur(20px)',
                border: '1px solid var(--border)',
                fontSize: '12px', color: 'var(--text-secondary)',
            }}>
                🚗 {transport.charAt(0).toUpperCase() + transport.slice(1)} mode
            </div>
        </div>
    )
}
