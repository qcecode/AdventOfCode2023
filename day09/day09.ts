import * as fs from 'fs';

function parseFile(filePath: string): number[][] {
    const data = fs.readFileSync(filePath, 'utf8');
    return parseInput(data);
}

function parseInput(input: string): number[][] {
    const lines = input.split("\n");
    return lines.map(line => line.split(" ").map(number => parseInt(number, 10)));
}

function processOneRowRight(row: number[]): number {
    let inter: number[][] = [];
    inter.push(row);

    // calculate down
    for (const row of inter) {
        let newRow: number[] = [];
        for (let i = 0; i < row.length - 1; i++) {
            let diff = row[i + 1] - row[i];
            newRow.push(diff);
        }
        if (newRow.some(number => number !== 0)) {
            inter.push(newRow);
        }
    }

    // calculate up
    let numToAdd = 0;
    for (let i = inter.length - 1; i >= 0; i--) {
        numToAdd = inter[i][inter[i].length - 1] + numToAdd;
        inter[i].push(numToAdd);
    }
    return numToAdd;
}

function processOneRowLeft(row: number[]): number {
    let inter: number[][] = [];
    inter.push(row);

    // calculate down
    for (const row of inter) {
        let newRow: number[] = [];
        for (let i = 0; i < row.length - 1; i++) {
            let diff = row[i + 1] - row[i];
            newRow.push(diff);
        }
        if (newRow.some(number => number !== 0)) {
            inter.push(newRow);
        }
    }

    // calculate up
    let numToAdd = 0;
    for (let i = inter.length - 1; i >= 0; i--) {
        numToAdd = inter[i][0] - numToAdd;
        inter[i].unshift(numToAdd)
    }
    return numToAdd;
}

function part1(input: number[][]) {
    let ans = 0;
    for (const row of input) {
        ans += processOneRowRight(row);
    }
    console.log("Part 1: " + ans);
}

function part2(input: number[][]) {
    let ans = 0;
    for (const row of input) {
        ans += processOneRowLeft(row);
    }
    console.log("Part 2: " + ans);
}

const parsedData = parseFile("./input.txt");
//processOneRowLeft([10, 13, 16, 21, 30, 45])
part1(parsedData);
part2(parsedData);
