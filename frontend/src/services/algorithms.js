// ===== Pure JS Implementations of Pathfinding Algorithms =====
// Each algorithm returns: { path, distance, visited, steps, executionTime, complexity }

class MinHeap {
    constructor() { this.heap = [] }
    push(node) {
        this.heap.push(node)
        this._bubbleUp(this.heap.length - 1)
    }
    pop() {
        const top = this.heap[0]
        const last = this.heap.pop()
        if (this.heap.length > 0) {
            this.heap[0] = last
            this._sinkDown(0)
        }
        return top
    }
    get size() { return this.heap.length }
    _bubbleUp(i) {
        while (i > 0) {
            const parent = Math.floor((i - 1) / 2)
            if (this.heap[i].cost < this.heap[parent].cost) {
                [this.heap[i], this.heap[parent]] = [this.heap[parent], this.heap[i]]
                i = parent
            } else break
        }
    }
    _sinkDown(i) {
        const n = this.heap.length
        while (true) {
            let smallest = i
            const l = 2 * i + 1, r = 2 * i + 2
            if (l < n && this.heap[l].cost < this.heap[smallest].cost) smallest = l
            if (r < n && this.heap[r].cost < this.heap[smallest].cost) smallest = r
            if (smallest !== i) {
                [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]]
                i = smallest
            } else break
        }
    }
}

function buildAdjacencyList(nodes, edges) {
    const adj = {}
    nodes.forEach(n => { adj[n.id] = [] })
    edges.forEach(e => {
        adj[e.from]?.push({ to: e.to, weight: e.weight })
        adj[e.to]?.push({ to: e.from, weight: e.weight }) // undirected
    })
    return adj
}

function getNodeById(nodes, id) {
    return nodes.find(n => n.id === id)
}

function reconstructPath(cameFrom, current) {
    const path = [current]
    while (cameFrom[current] !== undefined) {
        current = cameFrom[current]
        path.unshift(current)
    }
    return path
}

// ===== DIJKSTRA =====
export function dijkstra(nodes, edges, sourceId, destId) {
    const start = performance.now()
    const adj = buildAdjacencyList(nodes, edges)
    const dist = {}
    const cameFrom = {}
    const visited = []
    const steps = []

    nodes.forEach(n => { dist[n.id] = Infinity })
    dist[sourceId] = 0

    const pq = new MinHeap()
    pq.push({ id: sourceId, cost: 0 })
    const processed = new Set()

    while (pq.size > 0) {
        const { id: u, cost } = pq.pop()
        if (processed.has(u)) continue
        processed.add(u)
        visited.push(u)

        if (u === destId) break

        for (const { to: v, weight } of (adj[u] || [])) {
            const alt = cost + weight
            if (alt < dist[v]) {
                dist[v] = alt
                cameFrom[v] = u
                pq.push({ id: v, cost: alt })
                steps.push({ from: u, to: v, weight, type: 'explore', currentDist: alt })
            }
        }
    }

    const path = cameFrom[destId] !== undefined || sourceId === destId
        ? reconstructPath(cameFrom, destId) : []
    const executionTime = performance.now() - start

    return {
        path,
        distance: dist[destId] === Infinity ? -1 : dist[destId],
        visited,
        steps,
        executionTime: Math.round(executionTime * 100) / 100,
        complexity: 'O((V + E) log V)',
        algorithm: 'Dijkstra'
    }
}

// ===== A* SEARCH =====
export function astar(nodes, edges, sourceId, destId) {
    const start = performance.now()
    const adj = buildAdjacencyList(nodes, edges)
    const sourceNode = getNodeById(nodes, sourceId)
    const destNode = getNodeById(nodes, destId)

    const heuristic = (a) => {
        const nodeA = getNodeById(nodes, a)
        if (!nodeA || !destNode) return 0
        return Math.sqrt((nodeA.x - destNode.x) ** 2 + (nodeA.y - destNode.y) ** 2) / 50
    }

    const gScore = {}
    const fScore = {}
    const cameFrom = {}
    const visited = []
    const steps = []

    nodes.forEach(n => { gScore[n.id] = Infinity; fScore[n.id] = Infinity })
    gScore[sourceId] = 0
    fScore[sourceId] = heuristic(sourceId)

    const pq = new MinHeap()
    pq.push({ id: sourceId, cost: fScore[sourceId] })
    const closedSet = new Set()

    while (pq.size > 0) {
        const { id: u } = pq.pop()
        if (closedSet.has(u)) continue
        closedSet.add(u)
        visited.push(u)

        if (u === destId) break

        for (const { to: v, weight } of (adj[u] || [])) {
            if (closedSet.has(v)) continue
            const tentative = gScore[u] + weight
            if (tentative < gScore[v]) {
                cameFrom[v] = u
                gScore[v] = tentative
                fScore[v] = tentative + heuristic(v)
                pq.push({ id: v, cost: fScore[v] })
                steps.push({ from: u, to: v, weight, type: 'explore', fScore: fScore[v] })
            }
        }
    }

    const path = cameFrom[destId] !== undefined || sourceId === destId
        ? reconstructPath(cameFrom, destId) : []
    const executionTime = performance.now() - start

    return {
        path,
        distance: gScore[destId] === Infinity ? -1 : gScore[destId],
        visited,
        steps,
        executionTime: Math.round(executionTime * 100) / 100,
        complexity: 'O((V + E) log V)',
        algorithm: 'A*'
    }
}

// ===== BFS =====
export function bfs(nodes, edges, sourceId, destId) {
    const start = performance.now()
    const adj = buildAdjacencyList(nodes, edges)
    const visited = []
    const steps = []
    const cameFrom = {}
    const queue = [sourceId]
    const seen = new Set([sourceId])

    while (queue.length > 0) {
        const u = queue.shift()
        visited.push(u)

        if (u === destId) break

        for (const { to: v, weight } of (adj[u] || [])) {
            if (!seen.has(v)) {
                seen.add(v)
                cameFrom[v] = u
                queue.push(v)
                steps.push({ from: u, to: v, weight, type: 'explore' })
            }
        }
    }

    const path = cameFrom[destId] !== undefined || sourceId === destId
        ? reconstructPath(cameFrom, destId) : []

    // Calculate total distance along the path
    let distance = 0
    for (let i = 0; i < path.length - 1; i++) {
        const edge = edges.find(e =>
            (e.from === path[i] && e.to === path[i + 1]) ||
            (e.to === path[i] && e.from === path[i + 1])
        )
        if (edge) distance += edge.weight
    }

    const executionTime = performance.now() - start
    return {
        path,
        distance: path.length > 0 ? distance : -1,
        visited,
        steps,
        executionTime: Math.round(executionTime * 100) / 100,
        complexity: 'O(V + E)',
        algorithm: 'BFS'
    }
}

// ===== DFS =====
export function dfs(nodes, edges, sourceId, destId) {
    const start = performance.now()
    const adj = buildAdjacencyList(nodes, edges)
    const visited = []
    const steps = []
    const cameFrom = {}
    const stack = [sourceId]
    const seen = new Set()

    while (stack.length > 0) {
        const u = stack.pop()
        if (seen.has(u)) continue
        seen.add(u)
        visited.push(u)

        if (u === destId) break

        for (const { to: v, weight } of (adj[u] || [])) {
            if (!seen.has(v)) {
                cameFrom[v] = u
                stack.push(v)
                steps.push({ from: u, to: v, weight, type: 'explore' })
            }
        }
    }

    const path = cameFrom[destId] !== undefined || sourceId === destId
        ? reconstructPath(cameFrom, destId) : []

    let distance = 0
    for (let i = 0; i < path.length - 1; i++) {
        const edge = edges.find(e =>
            (e.from === path[i] && e.to === path[i + 1]) ||
            (e.to === path[i] && e.from === path[i + 1])
        )
        if (edge) distance += edge.weight
    }

    const executionTime = performance.now() - start
    return {
        path,
        distance: path.length > 0 ? distance : -1,
        visited,
        steps,
        executionTime: Math.round(executionTime * 100) / 100,
        complexity: 'O(V + E)',
        algorithm: 'DFS'
    }
}

// ===== Algorithm runner =====
export function runAlgorithm(algorithm, nodes, edges, sourceId, destId) {
    switch (algorithm) {
        case 'dijkstra': return dijkstra(nodes, edges, sourceId, destId)
        case 'astar': return astar(nodes, edges, sourceId, destId)
        case 'bfs': return bfs(nodes, edges, sourceId, destId)
        case 'dfs': return dfs(nodes, edges, sourceId, destId)
        default: return dijkstra(nodes, edges, sourceId, destId)
    }
}

// ===== Random Graph Generator =====
export function generateRandomGraph(nodeCount = 8) {
    const nodes = []
    const edges = []
    const padding = 60
    const width = 700
    const height = 450

    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            id: Math.random().toString(36).substr(2, 9),
            x: padding + Math.random() * (width - 2 * padding),
            y: padding + Math.random() * (height - 2 * padding),
            label: String.fromCharCode(65 + i)
        })
    }

    // Ensure connected graph with spanning tree
    for (let i = 1; i < nodeCount; i++) {
        const j = Math.floor(Math.random() * i)
        const weight = Math.floor(Math.random() * 15) + 1
        edges.push({
            id: Math.random().toString(36).substr(2, 9),
            from: nodes[j].id,
            to: nodes[i].id,
            weight
        })
    }

    // Add extra edges for complexity
    const extraEdges = Math.floor(nodeCount * 0.6)
    for (let k = 0; k < extraEdges; k++) {
        const i = Math.floor(Math.random() * nodeCount)
        const j = Math.floor(Math.random() * nodeCount)
        if (i !== j) {
            const exists = edges.some(e =>
                (e.from === nodes[i].id && e.to === nodes[j].id) ||
                (e.from === nodes[j].id && e.to === nodes[i].id)
            )
            if (!exists) {
                edges.push({
                    id: Math.random().toString(36).substr(2, 9),
                    from: nodes[i].id,
                    to: nodes[j].id,
                    weight: Math.floor(Math.random() * 15) + 1
                })
            }
        }
    }

    return { nodes, edges }
}
