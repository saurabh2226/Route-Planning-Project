import { motion } from 'framer-motion'
import { MapPin, Timer, Network, CheckCircle2, Ruler, Cpu, TrendingUp } from 'lucide-react'
import useStore from '../store/useStore'

const MetricCard = ({ icon: Icon, label, value, color, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay }}
        style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '12px 14px', borderRadius: '12px',
            background: 'var(--bg-glass)',
            border: '1px solid var(--border)',
        }}
    >
        <div style={{
            width: 34, height: 34, borderRadius: '8px',
            background: color + '20',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
            <Icon size={16} color={color} />
        </div>
        <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {label}
            </div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono' }}>
                {value}
            </div>
        </div>
    </motion.div>
)

export default function MetricsPanel() {
    const { result } = useStore()

    if (!result) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass"
                style={{ padding: '20px', textAlign: 'center' }}
            >
                <Network size={32} style={{ margin: '0 auto 8px', color: 'var(--text-muted)' }} />
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
                    Run an algorithm to see metrics
                </p>
            </motion.div>
        )
    }

    const metrics = [
        { icon: Ruler, label: 'Total Distance', value: result.distance >= 0 ? result.distance.toFixed(1) : 'N/A', color: '#6366f1' },
        { icon: TrendingUp, label: 'Path Length', value: result.path.length > 0 ? `${result.path.length} nodes` : 'No path', color: '#10b981' },
        { icon: MapPin, label: 'Nodes Visited', value: result.visited.length, color: '#3b82f6' },
        { icon: Timer, label: 'Execution Time', value: `${result.executionTime} ms`, color: '#f59e0b' },
        { icon: Cpu, label: 'Time Complexity', value: result.complexity, color: '#8b5cf6' },
        { icon: CheckCircle2, label: 'Path Found', value: result.path.length > 0 ? 'Yes ✓' : 'No ✗', color: result.path.length > 0 ? '#10b981' : '#ef4444' },
    ]

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass"
            style={{ padding: '16px' }}
        >
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
                📊 Results — {result.algorithm}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '8px' }}>
                {metrics.map((m, i) => (
                    <MetricCard key={m.label} {...m} delay={i * 0.05} />
                ))}
            </div>
            {result.path.length > 0 && (
                <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '10px', background: 'var(--accent-glow)' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)' }}>Shortest Path: </span>
                    <span style={{ fontSize: '13px', fontFamily: 'JetBrains Mono', color: 'var(--text-primary)' }}>
                        {result.pathLabels?.join(' → ') || result.path.join(' → ')}
                    </span>
                </div>
            )}
        </motion.div>
    )
}
