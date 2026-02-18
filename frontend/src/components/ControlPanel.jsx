import { motion } from 'framer-motion'
import { Play, Pause, SkipForward, RotateCcw, Gauge } from 'lucide-react'
import useStore from '../store/useStore'

export default function ControlPanel({ onStart, onPause, onResume, onStep, onReset }) {
    const { isPlaying, isPaused, speed, setSpeed, currentStep, steps } = useStore()

    const speedLabels = { 100: 'Turbo', 300: 'Fast', 500: 'Medium', 800: 'Slow', 1200: 'Step' }
    const getSpeedLabel = (v) => {
        const entries = Object.entries(speedLabels)
        let closest = entries[0]
        entries.forEach(([k, l]) => {
            if (Math.abs(k - v) < Math.abs(closest[0] - v)) closest = [k, l]
        })
        return closest[1]
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass"
            style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}
        >
            {/* Playback Controls */}
            <div style={{ display: 'flex', gap: '6px' }}>
                {!isPlaying || isPaused ? (
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={isPaused ? onResume : onStart}
                        className="btn-primary"
                        style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                        <Play size={16} />
                        {isPaused ? 'Resume' : 'Start'}
                    </motion.button>
                ) : (
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onPause}
                        className="btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                        <Pause size={16} />
                        Pause
                    </motion.button>
                )}

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onStep}
                    className="btn-icon"
                    title="Step Forward"
                >
                    <SkipForward size={16} />
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onReset}
                    className="btn-icon"
                    title="Reset"
                >
                    <RotateCcw size={16} />
                </motion.button>
            </div>

            {/* Separator */}
            <div style={{ width: '1px', height: '30px', background: 'var(--border)' }} />

            {/* Speed Control */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '180px' }}>
                <Gauge size={16} style={{ color: 'var(--text-muted)' }} />
                <input
                    type="range"
                    min={50}
                    max={1200}
                    step={50}
                    value={1250 - speed}
                    onChange={(e) => setSpeed(1250 - parseInt(e.target.value))}
                    style={{ flex: 1 }}
                />
                <span style={{
                    fontSize: '12px', fontWeight: 600, color: 'var(--accent)',
                    minWidth: '50px', textAlign: 'center',
                    padding: '4px 8px', borderRadius: '6px', background: 'var(--accent-glow)',
                }}>
                    {getSpeedLabel(speed)}
                </span>
            </div>

            {/* Step Counter */}
            {steps.length > 0 && (
                <>
                    <div style={{ width: '1px', height: '30px', background: 'var(--border)' }} />
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        Step <span style={{ fontWeight: 700, color: 'var(--accent)', fontFamily: 'JetBrains Mono' }}>
                            {Math.max(0, currentStep + 1)}
                        </span>
                        <span style={{ color: 'var(--text-muted)' }}> / {steps.length}</span>
                    </div>
                </>
            )}

            {/* Timeline Bar */}
            {steps.length > 0 && (
                <div style={{ width: '100%', marginTop: '4px' }}>
                    <div style={{
                        height: '4px', borderRadius: '2px', background: 'var(--border)',
                        position: 'relative', overflow: 'hidden',
                    }}>
                        <motion.div
                            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                            transition={{ duration: 0.2 }}
                            style={{
                                height: '100%', borderRadius: '2px',
                                background: 'var(--gradient-1)',
                            }}
                        />
                    </div>
                </div>
            )}
        </motion.div>
    )
}
