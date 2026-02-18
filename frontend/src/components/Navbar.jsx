import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sun, Moon, Route, GitCompareArrows, Bookmark, LayoutDashboard } from 'lucide-react'
import useStore from '../store/useStore'

const navLinks = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/visualizer', label: 'Visualizer', icon: Route },
    { to: '/compare', label: 'Compare', icon: GitCompareArrows },
    { to: '/saved', label: 'Saved', icon: Bookmark },
]

export default function Navbar() {
    const { darkMode, toggleDarkMode } = useStore()
    const location = useLocation()

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="glass-strong"
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 50,
                padding: '12px 24px',
                margin: '12px 16px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: '16px',
            }}
        >
            {/* Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'var(--text-primary)' }}>
                <div style={{
                    width: 36, height: 36, borderRadius: '10px',
                    background: 'var(--gradient-1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <Route size={20} color="white" />
                </div>
                <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.5px' }}>
                    Path<span style={{ color: 'var(--accent)' }}>Finder</span>
                </span>
            </Link>

            {/* Nav Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {navLinks.map(({ to, label, icon: Icon }) => {
                    const active = location.pathname === to
                    return (
                        <Link key={to} to={to} style={{ textDecoration: 'none' }}>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    padding: '8px 16px', borderRadius: '10px',
                                    fontSize: '14px', fontWeight: active ? 600 : 400,
                                    color: active ? 'var(--accent)' : 'var(--text-secondary)',
                                    background: active ? 'var(--accent-glow)' : 'transparent',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                <Icon size={16} />
                                <span>{label}</span>
                            </motion.div>
                        </Link>
                    )
                })}
            </div>

            {/* Dark Mode Toggle */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleDarkMode}
                className="btn-icon"
                style={{ position: 'relative', overflow: 'hidden' }}
            >
                <motion.div
                    animate={{ rotate: darkMode ? 180 : 0, scale: darkMode ? 0 : 1 }}
                    transition={{ duration: 0.3 }}
                    style={{ position: 'absolute' }}
                >
                    <Sun size={18} />
                </motion.div>
                <motion.div
                    animate={{ rotate: darkMode ? 0 : -180, scale: darkMode ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ position: 'absolute' }}
                >
                    <Moon size={18} />
                </motion.div>
            </motion.button>
        </motion.nav>
    )
}
