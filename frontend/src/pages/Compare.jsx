import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Play, Trophy, Shuffle, AlertCircle } from 'lucide-react'
import useStore from '../store/useStore'
import AlgorithmSelector from '../components/AlgorithmSelector'
import { runAlgorithm, generateRandomGraph } from '../services/algorithms'

const ALGO_COLORS = {
    'Dijkstra': '#6366f1',
    'A*': '#10b981',
    'BFS': '#f59e0b',
    'DFS': '#ef4444',
}

export default function Compare() {
    const { nodes, edges, source, destination, setGraph, setSource, setDestination } = useStore()
    const [results, setResults] = useState([])
    const [running, setRunning] = useState(false)

    const handleRandomGraph = () => {
        const { nodes: n, edges: e } = generateRandomGraph(10)
        setGraph(n, e)
        setSource(n[0].id)
        setDestination(n[n.length - 1].id)
        setResults([])
    }

    const handleRunComparison = useCallback(() => {
        if (!source || !destination) {
            alert('Please generate a graph first or set source/destination!')
            return
        }

        setRunning(true)
        setTimeout(() => {
            const algorithms = ['dijkstra', 'astar', 'bfs', 'dfs']
            const compResults = algorithms.map(algo => {
                const result = runAlgorithm(algo, nodes, edges, source, destination)
                result.pathLabels = result.path.map(id => nodes.find(n => n.id === id)?.label || id)
                return result
            })
            setResults(compResults)
            setRunning(false)
        }, 500)
    }, [nodes, edges, source, destination])

    const winner = results.length > 0
        ? results.reduce((best, r) => (r.distance > 0 && r.distance <= best.distance && r.executionTime <= best.executionTime) ? r : best, results.filter(r => r.distance > 0)[0] || results[0])
        : null

    const timeData = results.map(r => ({ name: r.algorithm, time: r.executionTime, distance: r.distance >= 0 ? r.distance : 0, visited: r.visited.length }))

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 20px' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '6px', letterSpacing: '-0.5px' }}>
                    Algorithm Comparison
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '24px' }}>
                    Run all pathfinding algorithms on the same graph and compare their performance.
                </p>
            </motion.div>

            {/* Controls */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass"
                style={{ padding: '20px', marginBottom: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}
            >
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleRandomGraph}
                    className="btn-secondary"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                    <Shuffle size={16} /> Generate Random Graph
                </motion.button>

                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    {nodes.length > 0 ? `${nodes.length} nodes, ${edges.length} edges` : 'No graph loaded'}
                </div>

                {nodes.length > 0 && (
                    <>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Src:</label>
                            <select value={source || ''} onChange={e => setSource(e.target.value)} className="input-field" style={{ width: '80px', fontSize: '12px' }}>
                                {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
                            </select>
                            <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Dst:</label>
                            <select value={destination || ''} onChange={e => setDestination(e.target.value)} className="input-field" style={{ width: '80px', fontSize: '12px' }}>
                                {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
                            </select>
                        </div>
                    </>
                )}

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRunComparison}
                    disabled={running || nodes.length === 0}
                    className="btn-primary"
                    style={{
                        marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px',
                        opacity: running || nodes.length === 0 ? 0.5 : 1,
                    }}
                >
                    <Play size={16} /> {running ? 'Running...' : 'Run Comparison'}
                </motion.button>
            </motion.div>

            {/* No graph message */}
            {nodes.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass"
                    style={{ padding: '40px', textAlign: 'center' }}
                >
                    <AlertCircle size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
                    <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
                        Click "Generate Random Graph" to create a graph and compare algorithms!
                    </p>
                </motion.div>
            )}

            {/* Results */}
            {results.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Winner banner */}
                    {winner && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{
                                padding: '20px', borderRadius: '16px',
                                background: 'var(--gradient-3)', color: 'white',
                                display: 'flex', alignItems: 'center', gap: '14px',
                            }}
                        >
                            <Trophy size={32} />
                            <div>
                                <div style={{ fontSize: '12px', opacity: 0.8, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }}>Winner</div>
                                <div style={{ fontSize: '22px', fontWeight: 800 }}>{winner.algorithm}</div>
                                <div style={{ fontSize: '13px', opacity: 0.9 }}>
                                    Distance: {winner.distance.toFixed(1)} • Time: {winner.executionTime}ms • Visited: {winner.visited.length} nodes
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Charts */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                        {/* Execution Time Chart */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass" style={{ padding: '20px' }}>
                            <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px' }}>⏱️ Execution Time (ms)</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={timeData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                    <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                                    <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                                    <Tooltip contentStyle={{ background: 'var(--bg-glass-strong)', border: '1px solid var(--border)', borderRadius: '10px', backdropFilter: 'blur(10px)' }} />
                                    <Bar dataKey="time" radius={[6, 6, 0, 0]}>
                                        {timeData.map((entry, i) => <Cell key={i} fill={ALGO_COLORS[entry.name] || '#6366f1'} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </motion.div>

                        {/* Path Distance Chart */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass" style={{ padding: '20px' }}>
                            <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px' }}>📏 Path Distance</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={timeData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                    <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                                    <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                                    <Tooltip contentStyle={{ background: 'var(--bg-glass-strong)', border: '1px solid var(--border)', borderRadius: '10px' }} />
                                    <Bar dataKey="distance" radius={[6, 6, 0, 0]}>
                                        {timeData.map((entry, i) => <Cell key={i} fill={ALGO_COLORS[entry.name] || '#6366f1'} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </motion.div>

                        {/* Nodes Visited Chart */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass" style={{ padding: '20px' }}>
                            <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px' }}>🔍 Nodes Visited</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={timeData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                    <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                                    <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                                    <Tooltip contentStyle={{ background: 'var(--bg-glass-strong)', border: '1px solid var(--border)', borderRadius: '10px' }} />
                                    <Bar dataKey="visited" radius={[6, 6, 0, 0]}>
                                        {timeData.map((entry, i) => <Cell key={i} fill={ALGO_COLORS[entry.name] || '#6366f1'} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </motion.div>
                    </div>

                    {/* Detailed comparison table */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass" style={{ padding: '20px', overflowX: 'auto' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px' }}>📊 Detailed Comparison</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>Algorithm</th>
                                    <th style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 600 }}>Distance</th>
                                    <th style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 600 }}>Path Length</th>
                                    <th style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 600 }}>Visited</th>
                                    <th style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 600 }}>Time (ms)</th>
                                    <th style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 600 }}>Complexity</th>
                                    <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>Path</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map(r => (
                                    <tr key={r.algorithm} style={{
                                        borderBottom: '1px solid var(--border)',
                                        background: r === winner ? 'var(--accent-glow)' : 'transparent',
                                    }}>
                                        <td style={{ padding: '10px 12px', fontWeight: 700, color: ALGO_COLORS[r.algorithm] }}>
                                            {r === winner && '🏆 '}{r.algorithm}
                                        </td>
                                        <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'JetBrains Mono' }}>{r.distance >= 0 ? r.distance.toFixed(1) : 'N/A'}</td>
                                        <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'JetBrains Mono' }}>{r.path.length}</td>
                                        <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'JetBrains Mono' }}>{r.visited.length}</td>
                                        <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'JetBrains Mono' }}>{r.executionTime}</td>
                                        <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                                            <span className="complexity-badge">{r.complexity}</span>
                                        </td>
                                        <td style={{ padding: '10px 12px', fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--text-secondary)' }}>
                                            {r.pathLabels?.join(' → ') || 'No path'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
