import { create } from 'zustand'

const generateId = () => Math.random().toString(36).substr(2, 9)

const useStore = create((set, get) => ({
    // Theme
    darkMode: true,
    toggleDarkMode: () => set((s) => {
        const next = !s.darkMode
        document.documentElement.classList.toggle('dark', next)
        return { darkMode: next }
    }),

    // Mode: 'graph' | 'map' | 'compare'
    mode: 'graph',
    setMode: (mode) => set({ mode }),

    // Algorithm
    algorithm: 'dijkstra',
    setAlgorithm: (algorithm) => set({ algorithm }),

    // Graph
    nodes: [],
    edges: [],
    source: null,
    destination: null,

    addNode: (x, y, label) => set((s) => ({
        nodes: [...s.nodes, { id: generateId(), x, y, label: label || String.fromCharCode(65 + s.nodes.length) }]
    })),

    updateNodePosition: (id, x, y) => set((s) => ({
        nodes: s.nodes.map(n => n.id === id ? { ...n, x, y } : n)
    })),

    removeNode: (id) => set((s) => ({
        nodes: s.nodes.filter(n => n.id !== id),
        edges: s.edges.filter(e => e.from !== id && e.to !== id),
        source: s.source === id ? null : s.source,
        destination: s.destination === id ? null : s.destination,
    })),

    addEdge: (from, to, weight) => set((s) => ({
        edges: [...s.edges, { id: generateId(), from, to, weight: weight || 1 }]
    })),

    removeEdge: (id) => set((s) => ({
        edges: s.edges.filter(e => e.id !== id)
    })),

    setSource: (id) => set({ source: id }),
    setDestination: (id) => set({ destination: id }),

    setGraph: (nodes, edges) => set({ nodes, edges, source: null, destination: null }),

    clearGraph: () => set({
        nodes: [], edges: [], source: null, destination: null,
        result: null, visitedNodes: [], pathEdges: [], steps: [], currentStep: -1,
        isPlaying: false, isPaused: false
    }),

    // Visualization state
    isPlaying: false,
    isPaused: false,
    speed: 500,
    currentStep: -1,
    steps: [],
    visitedNodes: [],
    pathEdges: [],
    result: null,

    setSpeed: (speed) => set({ speed }),
    setIsPlaying: (isPlaying) => set({ isPlaying }),
    setIsPaused: (isPaused) => set({ isPaused }),
    setCurrentStep: (currentStep) => set({ currentStep }),
    setSteps: (steps) => set({ steps }),
    setVisitedNodes: (visitedNodes) => set({ visitedNodes }),
    setPathEdges: (pathEdges) => set({ pathEdges }),
    setResult: (result) => set({ result }),

    resetVisualization: () => set({
        isPlaying: false, isPaused: false, currentStep: -1,
        visitedNodes: [], pathEdges: [], result: null
    }),

    // Map state
    mapSource: null,
    mapDestination: null,
    mapStops: [],
    transport: 'car',
    setMapSource: (pos) => set({ mapSource: pos }),
    setMapDestination: (pos) => set({ mapDestination: pos }),
    addMapStop: (pos) => set((s) => ({ mapStops: [...s.mapStops, pos] })),
    removeMapStop: (idx) => set((s) => ({ mapStops: s.mapStops.filter((_, i) => i !== idx) })),
    setTransport: (transport) => set({ transport }),

    // Saved routes
    savedRoutes: JSON.parse(localStorage.getItem('pathfinder-routes') || '[]'),
    saveRoute: (route) => set((s) => {
        const updated = [...s.savedRoutes, { ...route, id: generateId(), savedAt: new Date().toISOString() }]
        localStorage.setItem('pathfinder-routes', JSON.stringify(updated))
        return { savedRoutes: updated }
    }),
    deleteRoute: (id) => set((s) => {
        const updated = s.savedRoutes.filter(r => r.id !== id)
        localStorage.setItem('pathfinder-routes', JSON.stringify(updated))
        return { savedRoutes: updated }
    }),
    loadRoute: (route) => set({
        nodes: route.nodes,
        edges: route.edges,
        source: route.source,
        destination: route.destination,
        algorithm: route.algorithm || 'dijkstra',
    }),
    importRoutes: (routes) => set(() => {
        localStorage.setItem('pathfinder-routes', JSON.stringify(routes))
        return { savedRoutes: routes }
    }),

    // Comparison results
    comparisonResults: [],
    setComparisonResults: (results) => set({ comparisonResults: results }),
}))

export default useStore
