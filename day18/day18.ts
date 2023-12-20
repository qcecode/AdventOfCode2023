import { readFileSync } from 'fs';

function readFileContent(filename: string): string[] {
    const data = readFileSync(filename, 'utf8').trim();
    return data.split('\n');
}

interface Direction {
    R: number[]
    D: number[]
    L: number[]
    U: number[]
    [key: string]: number[]
}

type Position = [number, number]; // Tupel für Position

const DIRECTIONS: Direction = { R: [0, 1], D: [-1, 0], L: [0, -1], U: [1, 0] }

function calculateNewPosition(pos: Position, direction: string, distance: number): Position {
    const [y, x] = DIRECTIONS[direction];
    return [pos[0] + distance * y, pos[1] + distance * x];
}

function calculateArea(grid: Position[]): number {
    let area = 0;
    for (let i = 0; i < grid.length - 1; i++) {
        area += (grid[i][1] + grid[i + 1][1]) * (grid[i][0] - grid[i + 1][0]);
    }
    return area / 2;
}

function part1(input: string[]): number {
    let pos: Position = [0, 0];
    const grid: Position[] = [];
    let perimeter = 0;

    for (const line of input) {
        const [direction, number] = line.split(' ');
        const dist = parseInt(number);
        pos = calculateNewPosition(pos, direction, dist);
        perimeter += dist;
        grid.push(pos);
    }

    return perimeter / 2 + calculateArea(grid) + 1;
}

function part2(input: string[]): number {
    let pos: Position = [0, 0];
    const grid: Position[] = [];
    let perimeter = 0;

    for (const line of input) {
        let [direction, number] = line.split(' ');

        const w: string = line.split('#')[1].split(')')[0];
        direction = Object.keys(DIRECTIONS)[parseInt(w.substring(w.length - 1))];
        number = parseInt(w.slice(0, -1), 16).toString();

        const dist = parseInt(number);
        pos = calculateNewPosition(pos, direction, dist);
        perimeter += dist;
        grid.push(pos);
    }

    return perimeter / 2 + calculateArea(grid) + 1;
}

// Hauptausführung
const input = readFileContent('input.txt');
console.log('Part 1:', part1(input));
console.log('Part 2:', part2(input));
