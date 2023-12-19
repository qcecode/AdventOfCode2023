import fs from 'fs';
import path from 'path';

const rawInput: string = fs.readFileSync(path.resolve("./input.txt"), "utf-8");

type Vector = [number, number];

class Beam {
    position: Vector;
    velocity: Vector;

    constructor(position: Vector, velocity: Vector) {
        this.position = position;
        this.velocity = velocity;
    }

    moveForward(): Beam {
        this.position[0] += this.velocity[0];
        this.position[1] += this.velocity[1];
        return this;  // Rückgabe des aktualisierten Beam-Objekts
    }

    rotateR(): void {
        const [row, col] = this.velocity;
        this.velocity = [-col, row];
    }

    rotateL(): void {
        const [row, col] = this.velocity;
        this.velocity = [col, -row];
    }

    clone(): Beam {
        return new Beam([...this.position], [...this.velocity]);
    }
}

class Cache {
    private visited = new Set<number>();

    check(beam: Beam): boolean {
        const key = this.generateKey(beam);
        if (this.visited.has(key)) return true;
        this.visited.add(key);
        return false;
    }

    private generateKey(beam: Beam): number {
        return (beam.position[0] << 24) | (beam.position[1] << 16) | ((beam.velocity[0] & 3) << 8) | (beam.velocity[1] & 3);
    }
}

const grid = rawInput.split(/\r?\n/).filter(Boolean).map((line) => line.split(""));

function rotate(beam: Beam, symbol: string): Beam {
    if (beam.velocity[1] !== 0) {
        if (symbol === "/") beam.rotateR();
        else beam.rotateL();
    } else if (beam.velocity[0] !== 0) {
        if (symbol === "/") beam.rotateL();
        else beam.rotateR();
    } else {
        throw new Error("You suck at CS :)");
    }
    return beam;
}

function split(beam: Beam): Beam[] {
    const newBeam = beam.clone();
    beam.rotateR();
    newBeam.rotateL();
    return [beam, newBeam];
}

function energizedTiles(startBeam: Beam): number {
    const energizedGrid = grid.map((row) => row.map(() => false));
    const beams: Beam[] = [startBeam];
    const cache = new Cache();

    while (beams.length > 0) {
        const beam = beams.pop() as Beam;
        if (cache.check(beam)) continue;

        const {position: [row, col], velocity: [rowDir, colDir]} = beam;

        if (row >= 0 && row < grid.length && col >= 0 && col < grid[0].length) {
            energizedGrid[row][col] = true;
        }

        const nextSymbol = grid[row + rowDir]?.[col + colDir];
        switch (nextSymbol) {
            case ".":
                beams.push(beam.clone().moveForward());
                break;
            case "/":
            case "\\":
                beams.push(rotate(beam.clone().moveForward(), nextSymbol));
                break;
            case "-":
            case "|": {
                beam.moveForward();
                if (Math.abs(colDir) === (nextSymbol === "-" ? 0 : 1)) {
                    beams.push(...split(beam));
                } else {
                    beams.push(beam);
                }
                break;
            }
        }
    }

    return energizedGrid.flat().reduce((sum, isEnergized) => sum + +isEnergized, 0);
}

const generateStartBeams = (): Beam[] => {
    return [
        ...new Array(grid.length).fill(null).flatMap((_, i) => [
            new Beam([-1, i], [1, 0]),
            new Beam([grid.length, i], [-1, 0])
        ]),
        ...new Array(grid[0].length).fill(null).flatMap((_, i) => [
            new Beam([i, -1], [0, 1]),
            new Beam([i, grid[0].length], [0, -1])
        ])
    ];
};

console.log("Part 1:", energizedTiles(new Beam([0, -1], [0, 1])));
console.log("Part 2:", Math.max(...generateStartBeams().map(energizedTiles)));


