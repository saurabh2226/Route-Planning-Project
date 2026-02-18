import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Play, GitCompareArrows, Map, Network, Zap, BarChart3, Bookmark } from 'lucide-react'
import useStore from '../store/useStore'
import AlgorithmSelector from '../components/AlgorithmSelector'

const features = [
    { icon: Network, title: 'Interactive Graphs', desc: 'Click to add nodes, drag to reposition, build any graph structure' },
    { icon: Zap, title: 'Live Visualization', desc: 'Watch algorithms explore the graph step by step with animations' },
    { icon: BarChart3, title: 'Compare Algorithms', desc: 'Run multiple algorithms and compare performance metrics' },
    { icon: Map, title: 'Map Navigation', desc: 'Plan routes on real maps with Leaflet.js integration' },
    { icon: Bookmark, title: 'Save & Export', desc: 'Save routes, export as JSON, and reload anytime' },
    { icon: Sparkles, title: 'Premium UI', desc: 'Glassmorphism design with dark mode and smooth animations' },
]

export default function Dashboard() {
    const navigate = useNavigate()
    const { algorithm, mode, setMode } = useStore()

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                style={{ textAlign: 'center', marginBottom: '50px' }}
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    style={{
                        width: 80, height: 80, borderRadius: '24px', margin: '0 auto 20px',
                        background: 'var(--gradient-1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 10px 40px var(--accent-glow)',
                    }}
                >
                    <Network size={40} color="white" />
                </motion.div>

                <h1 style={{
                    fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900,
                    lineHeight: 1.1, marginBottom: '16px', letterSpacing: '-1.5px',
                }}>
                    Route Planning
                    <br />
                    <span style={{
                        background: 'var(--gradient-2)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>
                        Pathfinding Visualizer
                    </span>
                </h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    style={{
                        fontSize: '18px', color: 'var(--text-secondary)',
                        maxWidth: '600px', margin: '0 auto 30px', lineHeight: 1.6,
                    }}
                >
                    Explore and visualize pathfinding algorithms in real-time.
                    Build graphs, watch Dijkstra, A*, BFS & DFS find the shortest path,
                    and compare their performance.
                </motion.p>
            </motion.div>

            {/* Mode Selector */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                style={{ marginBottom: '30px' }}
            >
                <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', textAlign: 'center' }}>
                    Choose Mode
                </h3>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {[
                        { value: 'graph', label: 'Manual Graph', icon: Network, desc: 'Build & visualize custom graphs' },
                        { value: 'map', label: 'Map Based', icon: Map, desc: 'Route planning on real maps' },
                        { value: 'compare', label: 'Compare', icon: GitCompareArrows, desc: 'Compare algorithm performance' },
                    ].map((m, i) => (
                        <motion.button
                            key={m.value}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 + i * 0.1 }}
                            whileHover={{ scale: 1.03, y: -4 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setMode(m.value)}
                            className="glass-card"
                            style={{
                                padding: '24px 32px', cursor: 'pointer', textAlign: 'center',
                                border: mode === m.value ? '2px solid var(--accent)' : '1px solid var(--border)',
                                background: mode === m.value ? 'var(--accent-glow)' : 'var(--bg-glass)',
                                minWidth: '200px',
                            }}
                        >
                            <m.icon
                                size={28}
                                style={{
                                    margin: '0 auto 10px',
                                    color: mode === m.value ? 'var(--accent)' : 'var(--text-secondary)',
                                }}
                            />
                            <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)', marginBottom: '4px' }}>
                                {m.label}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{m.desc}</div>
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            {/* Algorithm Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                style={{ marginBottom: '30px' }}
            >
                <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', textAlign: 'center' }}>
                    Select Algorithm
                </h3>
                <AlgorithmSelector />
            </motion.div>

            {/* Start Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                style={{ textAlign: 'center', marginBottom: '60px' }}
            >
                <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 12px 40px var(--accent-glow)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(mode === 'compare' ? '/compare' : '/visualizer')}
                    style={{
                        background: 'var(--gradient-1)',
                        color: 'white', border: 'none',
                        padding: '16px 48px', borderRadius: '16px',
                        fontSize: '18px', fontWeight: 700,
                        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px',
                        boxShadow: '0 8px 30px var(--accent-glow)',
                    }}
                >
                    <Play size={22} />
                    Start Visualization
                </motion.button>
            </motion.div>

            {/* Feature Cards */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
            >
                <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', textAlign: 'center' }}>
                    Features
                </h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '16px',
                }}>
                    {features.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.1 + i * 0.08 }}
                            className="glass-card"
                            style={{ padding: '24px', cursor: 'default' }}
                        >
                            <f.icon size={24} style={{ color: 'var(--accent)', marginBottom: '10px' }} />
                            <h4 style={{ fontWeight: 700, fontSize: '15px', marginBottom: '6px', color: 'var(--text-primary)' }}>
                                {f.title}
                            </h4>
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                                {f.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    )
}
