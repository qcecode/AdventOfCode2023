import fs from "fs";

interface QueueItem<Key> {
    cost: number;
    key: Key;
}

class SimplePriorityQueue<Key> {
    private items: QueueItem<Key>[] = [];

    insert(item: QueueItem<Key>) {
        this.items.push(item);
    }

    extractMin(): QueueItem<Key> | null {
        if (this.items.length === 0) {
            return null;
        }

        let minIndex = 0;
        for (let i = 1; i < this.items.length; i++) {
            if (this.items[i].cost < this.items[minIndex].cost) {
                minIndex = i;
            }
        }

        return this.items.splice(minIndex, 1)[0];
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }
}

interface Position {
    row: number;
    column: number;
    direction: [number, number];
}

function dijkstra(grid: string[], minDistance: number, maxDistance: number): number {
    const rowCount = grid.length;
    const columnCount = grid[0].length;
    const distanceMap: Map<string, number> = new Map();
    const priorityQueue = new SimplePriorityQueue<Position>();

    priorityQueue.insert({cost: 0, key: {row: 0, column: 0, direction: [0, 1]}});
    priorityQueue.insert({cost: 0, key: {row: 0, column: 0, direction: [1, 0]}});

    while (!priorityQueue.isEmpty()) {
        const currentItem = priorityQueue.extractMin()!;
        const {cost, key: {row, column, direction}} = currentItem;

        if (row === rowCount - 1 && column === columnCount - 1) {
            return cost;
        }

        const distanceKey = `${row},${column},${direction[0]},${direction[1]}`;
        if (cost > (distanceMap.get(distanceKey) || Infinity)) {
            continue;
        }

        distanceMap.set(distanceKey, cost);

        for (const [deltaRow, deltaColumn] of [[-direction[1], direction[0]], [direction[1], -direction[0]]]) {
            let accumulatedCost = cost;
            for (let distance = 1; distance <= maxDistance; distance++) {
                const newRow = row + deltaRow * distance;
                const newColumn = column + deltaColumn * distance;
                if (newRow >= 0 && newRow < rowCount && newColumn >= 0 && newColumn < columnCount) {
                    accumulatedCost += parseInt(grid[newRow][newColumn]);
                    if (distance < minDistance) continue;
                    const newPosition: Position = {row: newRow, column: newColumn, direction: [deltaRow, deltaColumn]};
                    const newDistanceKey = `${newRow},${newColumn},${deltaRow},${deltaColumn}`;
                    if (accumulatedCost < (distanceMap.get(newDistanceKey) || Infinity)) {
                        distanceMap.set(newDistanceKey, accumulatedCost);
                        priorityQueue.insert({cost: accumulatedCost, key: newPosition});
                    }
                }
            }
        }
    }

    return -1;
}

const data = fs.readFileSync('input.txt', 'utf8').trim();
const grid: string[] = data.split('\n');


console.log(`Part 1: ${dijkstra(grid, 1, 3)}`);
console.log(`Part 2: ${dijkstra(grid, 4, 10)}`);
