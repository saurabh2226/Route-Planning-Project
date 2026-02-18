import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Plus, Trash2, Shuffle, MapPin, Navigation, ChevronRight, ChevronLeft,
    Car, Bike, Footprints, Target, Waypoints
} from 'lucide-react'
import useStore from '../store/useStore'
import { generateRandomGraph } from '../services/algorithms'
import AlgorithmSelector from './AlgorithmSelector'

export default function Sidebar() {
    const {
        mode, nodes, edges, source, destination,
        addNode, addEdge, removeNode, removeEdge, setSource, setDestination,
        setGraph, clearGraph,
        mapSource, mapDestination, transport, setTransport, mapStops, removeMapStop,
    } = useStore()

    const [collapsed, setCollapsed] = useState(false)
    const [edgeFrom, setEdgeFrom] = useState('')
    const [edgeTo, setEdgeTo] = useState('')
    const [edgeWeight, setEdgeWeight] = useState('')

    const handleAddEdge = () => {
        if (edgeFrom && edgeTo) {
            addEdge(edgeFrom, edgeTo, parseFloat(edgeWeight) || 1)
            setEdgeFrom('')
            setEdgeTo('')
            setEdgeWeight('')
        }
    }

    const handleRandomGraph = () => {
        const { nodes: newNodes, edges: newEdges } = generateRandomGraph(8)
        setGraph(newNodes, newEdges)
    }

    return (
        <div style={{ position: 'relative', display: 'flex' }}>
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                    position: 'absolute', right: '-14px', top: '20px', zIndex: 10,
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'var(--accent)', color: 'white', border: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', boxShadow: '0 2px 8px var(--accent-glow)',
                }}
            >
                {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </motion.button>

            <AnimatePresence>
                {!collapsed && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 300, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="glass-strong"
                        style={{
                            height: 'calc(100vh - 120px)', overflowY: 'auto', overflowX: 'hidden',
                            padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px',
                        }}
                    >
                        {/* Algorithm */}
                        <AlgorithmSelector compact />

                        <div style={{ height: '1px', background: 'var(--border)' }} />

                        {mode === 'graph' || mode === 'compare' ? (
                            <>
                                {/* Graph Controls */}
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <h4 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                                            Graph Input
                                        </h4>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleRandomGraph}
                                            className="btn-secondary"
                                            style={{ fontSize: '11px', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                                        >
                                            <Shuffle size={12} /> Random
                                        </motion.button>
                                    </div>

                                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 8px' }}>
                                        Click on canvas to add nodes. Select source & destination below.
                                    </p>

                                    {/* Source / Destination */}
                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)' }}>Source</label>
                                            <select
                                                value={source || ''}
                                                onChange={(e) => setSource(e.target.value || null)}
                                                className="input-field"
                                                style={{ fontSize: '12px', marginTop: '4px' }}
                                            >
                                                <option value="">Select</option>
                                                {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
                                            </select>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)' }}>Destination</label>
                                            <select
                                                value={destination || ''}
                                                onChange={(e) => setDestination(e.target.value || null)}
                                                className="input-field"
                                                style={{ fontSize: '12px', marginTop: '4px' }}
                                            >
                                                <option value="">Select</option>
                                                {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ height: '1px', background: 'var(--border)' }} />

                                {/* Add Edge */}
                                <div>
                                    <h4 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 8px' }}>
                                        Add Edge
                                    </h4>
                                    <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                                        <select value={edgeFrom} onChange={(e) => setEdgeFrom(e.target.value)} className="input-field" style={{ fontSize: '12px' }}>
                                            <option value="">From</option>
                                            {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
                                        </select>
                                        <select value={edgeTo} onChange={(e) => setEdgeTo(e.target.value)} className="input-field" style={{ fontSize: '12px' }}>
                                            <option value="">To</option>
                                            {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
                                        </select>
                                    </div>
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                        <input
                                            type="number"
                                            placeholder="Weight"
                                            value={edgeWeight}
                                            onChange={(e) => setEdgeWeight(e.target.value)}
                                            className="input-field"
                                            style={{ fontSize: '12px' }}
                                        />
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleAddEdge}
                                            className="btn-primary"
                                            style={{ fontSize: '12px', padding: '8px 14px', whiteSpace: 'nowrap' }}
                                        >
                                            <Plus size={14} />
                                        </motion.button>
                                    </div>
                                </div>

                                <div style={{ height: '1px', background: 'var(--border)' }} />

                                {/* Node List */}
                                <div>
                                    <h4 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 8px' }}>
                                        Nodes ({nodes.length})
                                    </h4>
                                    <div style={{ maxHeight: '120px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        {nodes.map(n => (
                                            <div key={n.id} style={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                padding: '6px 10px', borderRadius: '8px', background: 'var(--bg-glass)', fontSize: '12px',
                                            }}>
                                                <span style={{ fontWeight: 600 }}>{n.label}</span>
                                                <div style={{ display: 'flex', gap: '4px' }}>
                                                    <button onClick={() => setSource(n.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: source === n.id ? '#f59e0b' : 'var(--text-muted)', fontSize: '10px' }}>
                                                        <MapPin size={12} />
                                                    </button>
                                                    <button onClick={() => setDestination(n.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: destination === n.id ? '#ef4444' : 'var(--text-muted)', fontSize: '10px' }}>
                                                        <Target size={12} />
                                                    </button>
                                                    <button onClick={() => removeNode(n.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}>
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Edge List */}
                                {edges.length > 0 && (
                                    <div>
                                        <h4 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 8px' }}>
                                            Edges ({edges.length})
                                        </h4>
                                        <div style={{ maxHeight: '100px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            {edges.map(e => {
                                                const fromNode = nodes.find(n => n.id === e.from)
                                                const toNode = nodes.find(n => n.id === e.to)
                                                return (
                                                    <div key={e.id} style={{
                                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                        padding: '5px 10px', borderRadius: '8px', background: 'var(--bg-glass)', fontSize: '12px',
                                                    }}>
                                                        <span>{fromNode?.label} → {toNode?.label} <span style={{ color: 'var(--accent)', fontFamily: 'JetBrains Mono' }}>({e.weight})</span></span>
                                                        <button onClick={() => removeEdge(e.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}>
                                                            <Trash2 size={12} />
                                                        </button>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Clear */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={clearGraph}
                                    className="btn-secondary"
                                    style={{ fontSize: '12px', width: '100%', marginTop: 'auto', color: 'var(--danger)' }}
                                >
                                    <Trash2 size={12} style={{ marginRight: '6px' }} /> Clear Graph
                                </motion.button>
                            </>
                        ) : (
                            <>
                                {/* Map Mode Controls */}
                                <div>
                                    <h4 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 10px' }}>
                                        Map Controls
                                    </h4>
                                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 12px' }}>
                                        Click on the map to set source and destination points.
                                    </p>

                                    {mapSource && (
                                        <div style={{ fontSize: '12px', padding: '8px', borderRadius: '8px', background: 'var(--accent-glow)', marginBottom: '8px' }}>
                                            <MapPin size={12} style={{ display: 'inline', marginRight: '4px', color: '#f59e0b' }} />
                                            Source: {mapSource.lat.toFixed(4)}, {mapSource.lng.toFixed(4)}
                                        </div>
                                    )}
                                    {mapDestination && (
                                        <div style={{ fontSize: '12px', padding: '8px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', marginBottom: '8px' }}>
                                            <Navigation size={12} style={{ display: 'inline', marginRight: '4px', color: '#ef4444' }} />
                                            Dest: {mapDestination.lat.toFixed(4)}, {mapDestination.lng.toFixed(4)}
                                        </div>
                                    )}

                                    {/* Stops */}
                                    {mapStops.length > 0 && (
                                        <div style={{ marginBottom: '8px' }}>
                                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Stops:</span>
                                            {mapStops.map((s, i) => (
                                                <div key={i} style={{ fontSize: '11px', padding: '4px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span><Waypoints size={10} /> {s.lat.toFixed(3)}, {s.lng.toFixed(3)}</span>
                                                    <button onClick={() => removeMapStop(i)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>
                                                        <Trash2 size={10} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div style={{ height: '1px', background: 'var(--border)' }} />

                                {/* Transport Mode */}
                                <div>
                                    <h4 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 8px' }}>
                                        Transport
                                    </h4>
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                        {[
                                            { value: 'car', icon: Car, label: 'Car' },
                                            { value: 'bike', icon: Bike, label: 'Bike' },
                                            { value: 'walking', icon: Footprints, label: 'Walk' },
                                        ].map(t => (
                                            <motion.button
                                                key={t.value}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setTransport(t.value)}
                                                style={{
                                                    flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid',
                                                    borderColor: transport === t.value ? 'var(--accent)' : 'var(--border)',
                                                    background: transport === t.value ? 'var(--accent-glow)' : 'var(--bg-glass)',
                                                    cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                                                    color: 'var(--text-primary)',
                                                }}
                                            >
                                                <t.icon size={18} />
                                                <span style={{ fontSize: '10px', fontWeight: 500 }}>{t.label}</span>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
