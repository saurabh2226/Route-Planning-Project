import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import useStore from '../store/useStore'

const algorithms = [
    { value: 'dijkstra', label: 'Dijkstra', complexity: 'O((V+E) log V)', desc: 'Optimal for weighted graphs' },
    { value: 'astar', label: 'A* Search', complexity: 'O((V+E) log V)', desc: 'Heuristic-guided, fastest in practice' },
    { value: 'bfs', label: 'BFS', complexity: 'O(V + E)', desc: 'Shortest path for unweighted graphs' },
    { value: 'dfs', label: 'DFS', complexity: 'O(V + E)', desc: 'Explores deep, not optimal' },
]

export default function AlgorithmSelector({ compact = false }) {
    const { algorithm, setAlgorithm } = useStore()

    if (compact) {
        return (
            <div style={{ position: 'relative' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px', display: 'block' }}>
                    Algorithm
                </label>
                <div style={{ position: 'relative' }}>
                    <select
                        value={algorithm}
                        onChange={(e) => setAlgorithm(e.target.value)}
                        className="input-field"
                        style={{ appearance: 'none', paddingRight: '36px', cursor: 'pointer' }}
                    >
                        {algorithms.map(a => (
                            <option key={a.value} value={a.value}>{a.label}</option>
                        ))}
                    </select>
                    <ChevronDown size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                </div>
                <span className="complexity-badge" style={{ marginTop: '6px', display: 'inline-block' }}>
                    {algorithms.find(a => a.value === algorithm)?.complexity}
                </span>
            </div>
        )
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {algorithms.map((a, i) => (
                <motion.button
                    key={a.value}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setAlgorithm(a.value)}
                    className="glass-card"
                    style={{
                        padding: '20px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        border: algorithm === a.value ? '2px solid var(--accent)' : '1px solid var(--border)',
                        background: algorithm === a.value ? 'var(--accent-glow)' : 'var(--bg-glass)',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)' }}>{a.label}</span>
                        <span className="complexity-badge">{a.complexity}</span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>{a.desc}</p>
                </motion.button>
            ))}
        </div>
    )
}
