import { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, Save, Map, Network } from 'lucide-react'
import useStore from '../store/useStore'
import Sidebar from '../components/Sidebar'
import GraphCanvas from '../components/GraphCanvas'
import MapView from '../components/MapView'
import ControlPanel from '../components/ControlPanel'
import MetricsPanel from '../components/MetricsPanel'
import { runAlgorithm } from '../services/algorithms'
import { toPng } from 'html-to-image'

export default function Visualizer() {
    const {
        mode, setMode, algorithm, nodes, edges, source, destination,
        setSteps, setVisitedNodes, setPathEdges, setResult,
        setIsPlaying, setIsPaused, setCurrentStep,
        isPlaying, isPaused, speed, steps, currentStep,
        resetVisualization, saveRoute,
    } = useStore()

    const animationRef = useRef(null)
    const vizRef = useRef(null)
    const stepIndexRef = useRef(-1)

    // Sync ref with store
    useEffect(() => {
        stepIndexRef.current = currentStep
    }, [currentStep])

    // Animation loop
    const animate = useCallback(() => {
        const storeState = useStore.getState()
        const { steps, speed } = storeState
        const idx = stepIndexRef.current + 1

        if (idx >= steps.length) {
            // Animation complete — show final result
            setIsPlaying(false)
            setIsPaused(false)
            return
        }

        stepIndexRef.current = idx
        setCurrentStep(idx)

        // Build visited nodes up to current step
        const visited = new Set()
        for (let i = 0; i <= idx; i++) {
            visited.add(steps[i].from)
            visited.add(steps[i].to)
        }
        setVisitedNodes([...visited])

        animationRef.current = setTimeout(() => {
            animate()
        }, speed)
    }, [setCurrentStep, setVisitedNodes, setIsPlaying, setIsPaused])

    const handleStart = useCallback(() => {
        if (!source || !destination) {
            alert('Please select a source and destination node!')
            return
        }

        // Run algorithm
        const result = runAlgorithm(algorithm, nodes, edges, source, destination)

        // Add path labels
        result.pathLabels = result.path.map(id => {
            const node = nodes.find(n => n.id === id)
            return node?.label || id
        })

        setResult(result)
        setSteps(result.steps)
        setCurrentStep(-1)
        stepIndexRef.current = -1
        setVisitedNodes([])
        setPathEdges([])
        setIsPlaying(true)
        setIsPaused(false)

        // Start animation
        if (animationRef.current) clearTimeout(animationRef.current)
        animationRef.current = setTimeout(() => animate(), 300)
    }, [algorithm, nodes, edges, source, destination, animate, setResult, setSteps, setCurrentStep, setVisitedNodes, setPathEdges, setIsPlaying, setIsPaused])

    const handlePause = useCallback(() => {
        setIsPaused(true)
        setIsPlaying(true)
        if (animationRef.current) clearTimeout(animationRef.current)
    }, [setIsPaused, setIsPlaying])

    const handleResume = useCallback(() => {
        setIsPaused(false)
        animationRef.current = setTimeout(() => animate(), speed)
    }, [animate, speed, setIsPaused])

    const handleStep = useCallback(() => {
        const storeState = useStore.getState()
        const { steps } = storeState

        if (!steps.length) {
            // Need to run algorithm first
            if (!source || !destination) return
            const result = runAlgorithm(algorithm, nodes, edges, source, destination)
            result.pathLabels = result.path.map(id => nodes.find(n => n.id === id)?.label || id)
            setResult(result)
            setSteps(result.steps)
            setCurrentStep(-1)
            stepIndexRef.current = -1
            setVisitedNodes([])
            setIsPlaying(true)
            setIsPaused(true)
        }

        const idx = stepIndexRef.current + 1
        if (idx < steps.length) {
            stepIndexRef.current = idx
            setCurrentStep(idx)
            const visited = new Set()
            for (let i = 0; i <= idx; i++) {
                visited.add(steps[i].from)
                visited.add(steps[i].to)
            }
            setVisitedNodes([...visited])
        }
    }, [algorithm, nodes, edges, source, destination, setResult, setSteps, setCurrentStep, setVisitedNodes, setIsPlaying, setIsPaused])

    const handleReset = useCallback(() => {
        if (animationRef.current) clearTimeout(animationRef.current)
        stepIndexRef.current = -1
        resetVisualization()
    }, [resetVisualization])

    // Cleanup
    useEffect(() => {
        return () => {
            if (animationRef.current) clearTimeout(animationRef.current)
        }
    }, [])

    const handleExportPNG = async () => {
        if (vizRef.current) {
            try {
                const dataUrl = await toPng(vizRef.current)
                const link = document.createElement('a')
                link.download = 'pathfinder-graph.png'
                link.href = dataUrl
                link.click()
            } catch (err) {
                console.error('Export failed:', err)
            }
        }
    }

    const handleSaveRoute = () => {
        const result = useStore.getState().result
        saveRoute({
            name: `Route ${new Date().toLocaleTimeString()}`,
            algorithm,
            nodes,
            edges,
            source,
            destination,
            result,
        })
    }

    return (
        <div style={{
            display: 'flex', height: 'calc(100vh - 80px)',
            padding: '12px 16px', gap: '12px',
        }}>
            {/* Sidebar */}
            <Sidebar />

            {/* Main content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'hidden' }}>
                {/* Mode toggle + actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '4px', padding: '3px', borderRadius: '10px', background: 'var(--bg-glass)', border: '1px solid var(--border)' }}>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setMode('graph')}
                            style={{
                                padding: '6px 16px', borderRadius: '8px', border: 'none',
                                fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                                background: mode === 'graph' ? 'var(--accent)' : 'transparent',
                                color: mode === 'graph' ? 'white' : 'var(--text-secondary)',
                            }}
                        >
                            <Network size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                            Graph
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setMode('map')}
                            style={{
                                padding: '6px 16px', borderRadius: '8px', border: 'none',
                                fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                                background: mode === 'map' ? 'var(--accent)' : 'transparent',
                                color: mode === 'map' ? 'white' : 'var(--text-secondary)',
                            }}
                        >
                            <Map size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                            Map
                        </motion.button>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleExportPNG}
                            className="btn-secondary"
                            style={{ fontSize: '12px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                            <Download size={14} /> PNG
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSaveRoute}
                            className="btn-secondary"
                            style={{ fontSize: '12px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                            <Save size={14} /> Save
                        </motion.button>
                    </div>
                </div>

                {/* Visualization Area */}
                <div ref={vizRef} style={{ flex: 1, minHeight: 0 }}>
                    {mode === 'map' ? <MapView /> : <GraphCanvas />}
                </div>

                {/* Control Panel */}
                <ControlPanel
                    onStart={handleStart}
                    onPause={handlePause}
                    onResume={handleResume}
                    onStep={handleStep}
                    onReset={handleReset}
                />

                {/* Metrics */}
                <MetricsPanel />
            </div>
        </div>
    )
}
