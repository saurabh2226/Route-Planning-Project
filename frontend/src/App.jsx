import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Visualizer from './pages/Visualizer'
import Compare from './pages/Compare'
import SavedRoutes from './pages/SavedRoutes'
import useStore from './store/useStore'

export default function App() {
    const darkMode = useStore((s) => s.darkMode)

    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode)
    }, [darkMode])

    return (
        <Router>
            <div className="min-h-screen" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
                <div className="bg-mesh" />
                <Navbar />
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/visualizer" element={<Visualizer />} />
                    <Route path="/compare" element={<Compare />} />
                    <Route path="/saved" element={<SavedRoutes />} />
                </Routes>
            </div>
        </Router>
    )
}
