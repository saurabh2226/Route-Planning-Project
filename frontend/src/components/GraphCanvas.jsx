import { useRef, useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import useStore from '../store/useStore'

export default function GraphCanvas() {
    const svgRef = useRef(null)
    const {
        nodes, edges, source, destination,
        addNode, updateNodePosition,
        visitedNodes, pathEdges, result, steps, currentStep,
    } = useStore()

    const [dragging, setDragging] = useState(null)
    const [svgSize, setSvgSize] = useState({ width: 800, height: 500 })

    // Resize observer
    useEffect(() => {
        const el = svgRef.current?.parentElement
        if (!el) return
        const obs = new ResizeObserver(entries => {
            for (const entry of entries) {
                setSvgSize({ width: entry.contentRect.width, height: entry.contentRect.height })
            }
        })
        obs.observe(el)
        return () => obs.disconnect()
    }, [])

    // Click to add node
    const handleSvgClick = useCallback((e) => {
        if (dragging) return
        const svg = svgRef.current
        const rect = svg.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        addNode(x, y)
    }, [addNode, dragging])

    // Drag handlers
    const handleMouseDown = useCallback((e, nodeId) => {
        e.stopPropagation()
        setDragging(nodeId)
    }, [])

    const handleMouseMove = useCallback((e) => {
        if (!dragging) return
        const svg = svgRef.current
        const rect = svg.getBoundingClientRect()
        const x = Math.max(20, Math.min(svgSize.width - 20, e.clientX - rect.left))
        const y = Math.max(20, Math.min(svgSize.height - 20, e.clientY - rect.top))
        updateNodePosition(dragging, x, y)
    }, [dragging, updateNodePosition, svgSize])

    const handleMouseUp = useCallback(() => {
        setDragging(null)
    }, [])

    // Determine node/edge states for visualization
    const visitedSet = new Set(visitedNodes)
    const pathNodeSet = new Set(result?.path || [])

    const getEdgeClass = (edge) => {
        if (result?.path) {
            const path = result.path
            for (let i = 0; i < path.length - 1; i++) {
                if ((edge.from === path[i] && edge.to === path[i + 1]) ||
                    (edge.to === path[i] && edge.from === path[i + 1])) {
                    return 'edge-path'
                }
            }
        }
        // Check if edge was explored in visited steps
        if (currentStep >= 0 && steps.length > 0) {
            for (let i = 0; i <= Math.min(currentStep, steps.length - 1); i++) {
                const s = steps[i]
                if ((s.from === edge.from && s.to === edge.to) ||
                    (s.from === edge.to && s.to === edge.from)) {
                    return 'edge-visited'
                }
            }
        }
        return 'edge-default'
    }

    const getNodeClass = (node) => {
        if (node.id === source) return 'node-source'
        if (node.id === destination) return 'node-destination'
        if (pathNodeSet.has(node.id)) return 'node-path'
        if (visitedSet.has(node.id)) return 'node-visited'
        return 'node-default'
    }

    const getNodeById = (id) => nodes.find(n => n.id === id)

    return (
        <div
            style={{
                flex: 1, borderRadius: '16px', overflow: 'hidden',
                background: 'var(--bg-glass)', border: '1px solid var(--border)',
                backdropFilter: 'blur(20px)', position: 'relative', minHeight: '400px',
            }}
        >
            {/* Grid pattern background */}
            <svg
                ref={svgRef}
                width="100%"
                height="100%"
                onClick={handleSvgClick}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{ cursor: dragging ? 'grabbing' : 'crosshair', display: 'block' }}
            >
                {/* Grid pattern */}
                <defs>
                    <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="var(--border)" strokeWidth="0.5" opacity="0.4" />
                    </pattern>
                    {/* Arrow marker */}
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="var(--text-muted)" />
                    </marker>
                    {/* Glow filter */}
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Edges */}
                {edges.map(edge => {
                    const fromNode = getNodeById(edge.from)
                    const toNode = getNodeById(edge.to)
                    if (!fromNode || !toNode) return null
                    const edgeClass = getEdgeClass(edge)
                    const midX = (fromNode.x + toNode.x) / 2
                    const midY = (fromNode.y + toNode.y) / 2

                    return (
                        <g key={edge.id}>
                            <line
                                x1={fromNode.x} y1={fromNode.y}
                                x2={toNode.x} y2={toNode.y}
                                className={edgeClass}
                                strokeDasharray={edgeClass === 'edge-path' ? '8,4' : 'none'}
                            />
                            {/* Weight label */}
                            <rect
                                x={midX - 12} y={midY - 10}
                                width={24} height={20} rx={6}
                                fill="var(--bg-glass-strong)"
                                stroke="var(--border)"
                                strokeWidth="1"
                            />
                            <text
                                x={midX} y={midY + 4}
                                textAnchor="middle"
                                fill="var(--accent)"
                                fontSize="11"
                                fontWeight="700"
                                fontFamily="JetBrains Mono"
                            >
                                {edge.weight}
                            </text>
                        </g>
                    )
                })}

                {/* Nodes */}
                {nodes.map(node => {
                    const nodeClass = getNodeClass(node)
                    return (
                        <g
                            key={node.id}
                            onMouseDown={(e) => handleMouseDown(e, node.id)}
                            style={{ cursor: 'grab' }}
                        >
                            {/* Glow ring for source/destination */}
                            {(node.id === source || node.id === destination || pathNodeSet.has(node.id)) && (
                                <circle
                                    cx={node.x} cy={node.y} r={18}
                                    fill="none"
                                    stroke={node.id === source ? '#f59e0b' : node.id === destination ? '#ef4444' : 'var(--path)'}
                                    strokeWidth="2"
                                    opacity="0.3"
                                >
                                    <animate attributeName="r" values="18;22;18" dur="2s" repeatCount="indefinite" />
                                    <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" />
                                </circle>
                            )}

                            <circle
                                cx={node.x} cy={node.y} r={nodeClass === 'node-default' ? 12 : 14}
                                className={nodeClass}
                                filter={nodeClass !== 'node-default' ? 'url(#glow)' : undefined}
                            />
                            <text
                                x={node.x} y={node.y + 4}
                                textAnchor="middle"
                                fill="white"
                                fontSize="11"
                                fontWeight="700"
                                fontFamily="Inter"
                                pointerEvents="none"
                            >
                                {node.label}
                            </text>
                        </g>
                    )
                })}

                {/* Empty state */}
                {nodes.length === 0 && (
                    <text
                        x="50%" y="50%"
                        textAnchor="middle"
                        fill="var(--text-muted)"
                        fontSize="16"
                        fontFamily="Inter"
                    >
                        Click anywhere to add nodes
                    </text>
                )}
            </svg>

            {/* Legend */}
            <div style={{
                position: 'absolute', bottom: '12px', right: '12px',
                padding: '8px 12px', borderRadius: '10px',
                background: 'var(--bg-glass-strong)', backdropFilter: 'blur(10px)',
                border: '1px solid var(--border)',
                display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--text-secondary)',
            }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} /> Source
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} /> Dest
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--visited)' }} /> Visited
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--path)' }} /> Path
                </span>
            </div>
        </div>
    )
}
