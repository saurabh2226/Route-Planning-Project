import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Download, Upload, FileJson, Clock, Network, Route as RouteIcon } from 'lucide-react'
import useStore from '../store/useStore'
import { useNavigate } from 'react-router-dom'

export default function SavedRoutes() {
    const { savedRoutes, deleteRoute, loadRoute, importRoutes } = useStore()
    const navigate = useNavigate()
    const fileInputRef = useRef(null)

    const handleExportAll = () => {
        const json = JSON.stringify(savedRoutes, null, 2)
        const blob = new Blob([json], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'pathfinder-routes.json'
        a.click()
        URL.revokeObjectURL(url)
    }

    const handleExportSingle = (route) => {
        const json = JSON.stringify(route, null, 2)
        const blob = new Blob([json], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `route-${route.name.replace(/\s+/g, '-')}.json`
        a.click()
        URL.revokeObjectURL(url)
    }

    const handleImport = (e) => {
        const file = e.target.files[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result)
                if (Array.isArray(data)) {
                    importRoutes([...savedRoutes, ...data])
                } else {
                    importRoutes([...savedRoutes, data])
                }
            } catch (err) {
                alert('Invalid JSON file!')
            }
        }
        reader.readAsText(file)
    }

    const handleLoad = (route) => {
        loadRoute(route)
        navigate('/visualizer')
    }

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 20px' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '4px', letterSpacing: '-0.5px' }}>
                            Saved Routes
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>
                            {savedRoutes.length} saved route{savedRoutes.length !== 1 ? 's' : ''}
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleExportAll}
                            className="btn-secondary"
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
                            disabled={savedRoutes.length === 0}
                        >
                            <Download size={14} /> Export All
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => fileInputRef.current?.click()}
                            className="btn-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
                        >
                            <Upload size={14} /> Import
                        </motion.button>
                        <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
                    </div>
                </div>
            </motion.div>

            {/* Empty State */}
            {savedRoutes.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass"
                    style={{ padding: '60px 20px', textAlign: 'center' }}
                >
                    <FileJson size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
                    <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>No saved routes yet</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '400px', margin: '0 auto 20px' }}>
                        Go to the Visualizer, create a graph, run an algorithm, and click "Save" to save your first route.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate('/visualizer')}
                        className="btn-primary"
                    >
                        Go to Visualizer
                    </motion.button>
                </motion.div>
            )}

            {/* Routes Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
                <AnimatePresence>
                    {savedRoutes.map((route, i) => (
                        <motion.div
                            key={route.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: i * 0.05 }}
                            className="glass-card"
                            style={{ padding: '20px', cursor: 'default' }}
                        >
                            {/* Header */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{
                                        width: 32, height: 32, borderRadius: '8px',
                                        background: 'var(--gradient-1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <RouteIcon size={16} color="white" />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '14px' }}>{route.name}</div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Clock size={10} /> {new Date(route.savedAt).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Details */}
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                                <span className="complexity-badge">{route.algorithm || 'dijkstra'}</span>
                                <span style={{
                                    fontSize: '12px', padding: '4px 10px', borderRadius: '8px',
                                    background: 'var(--bg-glass)', color: 'var(--text-secondary)',
                                }}>
                                    <Network size={10} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                                    {route.nodes?.length || 0} nodes
                                </span>
                                {route.result && (
                                    <span style={{
                                        fontSize: '12px', padding: '4px 10px', borderRadius: '8px',
                                        background: 'var(--success-glow)', color: 'var(--success)',
                                    }}>
                                        Dist: {route.result.distance?.toFixed(1) || 'N/A'}
                                    </span>
                                )}
                            </div>

                            {/* Path preview */}
                            {route.result?.pathLabels && (
                                <div style={{
                                    padding: '8px 12px', borderRadius: '8px', background: 'var(--bg-glass)',
                                    fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--text-secondary)',
                                    marginBottom: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                }}>
                                    {route.result.pathLabels.join(' → ')}
                                </div>
                            )}

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '6px' }}>
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => handleLoad(route)}
                                    className="btn-primary"
                                    style={{ flex: 1, fontSize: '12px', padding: '8px' }}
                                >
                                    Load & Visualize
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleExportSingle(route)}
                                    className="btn-icon"
                                    style={{ width: '34px', height: '34px' }}
                                >
                                    <Download size={14} />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => deleteRoute(route.id)}
                                    className="btn-icon"
                                    style={{ width: '34px', height: '34px', color: 'var(--danger)' }}
                                >
                                    <Trash2 size={14} />
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    )
}
