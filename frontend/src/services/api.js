import axios from 'axios'
import { runAlgorithm } from './algorithms'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const api = axios.create({
    baseURL: API_BASE,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' }
})

// Try backend first, fall back to client-side
export async function findPath({ algorithm, nodes, edges, source, destination }) {
    try {
        const response = await api.post('/api/find-path', {
            algorithm,
            nodes: nodes.map(n => ({ id: n.id, label: n.label, x: n.x, y: n.y })),
            edges: edges.map(e => ({ from: e.from, to: e.to, weight: e.weight })),
            source,
            destination
        })
        return response.data
    } catch {
        // Fallback: run algorithm client-side
        return runAlgorithm(algorithm, nodes, edges, source, destination)
    }
}

// Run all algorithms for comparison
export async function compareAlgorithms(nodes, edges, source, destination) {
    const algorithms = ['dijkstra', 'astar', 'bfs', 'dfs']
    const results = []

    for (const algo of algorithms) {
        const result = await findPath({ algorithm: algo, nodes, edges, source, destination })
        results.push(result)
    }

    return results
}

export default api
