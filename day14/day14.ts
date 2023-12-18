import * as fs from 'fs';

type Line = string[];

const readAndPrepareData = (filePath: string): Line[] => {
    return fs
        .readFileSync(filePath, {encoding: 'utf8'})
        .split('\n')
        .map(line => line.split(''));
};

const part1 = (lines: Line[]): number => {
    let sum = 0;
    for (let columnIndex = 0; columnIndex < lines[0].length; columnIndex++) {
        for (let rowIndex = 0; rowIndex < lines.length; rowIndex++) {
            if (lines[rowIndex][columnIndex] !== 'O') {
                continue;
            }

            let newPosition = findNewPosition(lines, rowIndex, columnIndex);
            if (newPosition < rowIndex - 1) {
                updatePositions(lines, rowIndex, columnIndex, newPosition);
            }

            sum += lines.length - (newPosition + 1);
        }
    }
    return sum;
};

const findNewPosition = (lines: Line[], rowIndex: number, columnIndex: number): number => {
    let position = rowIndex - 1;
    while (position >= 0 && lines[position][columnIndex] === '.') {
        position--;
    }
    return position;
};

const updatePositions = (lines: Line[], rowIndex: number, columnIndex: number, newPosition: number): void => {
    lines[newPosition + 1][columnIndex] = 'O';
    lines[rowIndex][columnIndex] = '.';
};

const tiltNorth = (lines: Line[]): void => {
    for (let j = 0; j < lines[0].length; j++) {
        for (let i = 0; i < lines.length; i++) {
            if (lines[i][j] != "O") {
                continue;
            }

            let position = i - 1;
            while (position >= 0 && lines[position][j] == ".") {
                position--;
            }

            if (position < i - 1) {
                lines[position + 1][j] = "O";
                lines[i][j] = ".";
            }
        }
    }
};

const tiltSouth = (lines: Line[]): void => {
    for (let j = 0; j < lines[0].length; j++) {
        for (let i = lines.length - 1; i >= 0; i--) {
            if (lines[i][j] != "O") {
                continue;
            }

            let position = i + 1;
            while (position < lines.length && lines[position][j] == ".") {
                position++;
            }

            if (position > i + 1) {
                lines[position - 1][j] = "O";
                lines[i][j] = ".";
            }
        }
    }
};

const tiltWest = (lines: Line[]): void => {
    for (let i = 0; i < lines.length; i++) {
        for (let j = 0; j < lines[0].length; j++) {
            if (lines[i][j] != "O") {
                continue;
            }

            let position = j - 1;
            while (position >= 0 && lines[i][position] == ".") {
                position--;
            }

            if (position < j - 1) {
                lines[i][position + 1] = "O";
                lines[i][j] = ".";
            }
        }
    }
};

const tiltEast = (lines: Line[]): void => {
    for (let i = 0; i < lines.length; i++) {
        for (let j = lines[0].length - 1; j >= 0; j--) {
            if (lines[i][j] != "O") {
                continue;
            }

            let position = j + 1;
            while (position < lines[0].length && lines[i][position] == ".") {
                position++;
            }

            if (position > j + 1) {
                lines[i][position - 1] = "O";
                lines[i][j] = ".";
            }
        }
    }
};

const valueExistsInObject = (value: string, seenArrangements: { [key: string]: number }): boolean => {
    return Object.keys(seenArrangements).includes(value);
};

const cycle = (lines: Line[]): void => {
    tiltNorth(lines);
    tiltWest(lines);
    tiltSouth(lines);
    tiltEast(lines);
};

const part2 = (lines: Line[]): number => {
    const seenArrangements: { [key: string]: number } = {};
    let state = lines.map(subArray => subArray.join(" ")).join(" ");
    let index = 0;
    const totalCycles = 1000000000;

    while (!valueExistsInObject(state, seenArrangements) && index < totalCycles) {
        seenArrangements[state] = index;
        index++;
        cycle(lines);
        state = lines.map(subArray => subArray.join(" ")).join(" ");
    }

    const cycleStart = seenArrangements[state];
    const cycleEnd = index;
    const remainingCycles = (totalCycles - cycleStart) % (cycleEnd - cycleStart);

    for (let i = 0; i < remainingCycles; i++) {
        cycle(lines);
    }

    let sum = 0;
    for (let columnIndex = 0; columnIndex < lines[0].length; columnIndex++) {
        for (let rowIndex = 0; rowIndex < lines.length; rowIndex++) {
            if (lines[rowIndex][columnIndex] !== 'O') {
                continue;
            }
            sum += lines.length - rowIndex;
        }
    }

    return sum;
};

const main = (): void => {
    const lines = readAndPrepareData('./input.txt');
    console.log('Part 1: ' + part1(lines));

    const part2Sum = part2(lines);
    console.log('Part 2: ' + part2Sum);
};

main();

