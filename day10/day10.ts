import * as fs from 'fs';

type Position = {
    x: number;
    y: number;
};

enum Direction {
    North = "North",
    West = "West",
    East = "East",
    South = "South"
}

type Instruction = {
    position: Position;
    direction: Direction;
    error?: boolean;
}

function readFileInto2DMap(filePath: string): string[][] {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const lines = fileContent.split('\n');

        return lines.map(line => line.split(''));
    } catch (error) {
        console.error('Fehler beim Lesen der Datei:', error);
        return [];
    }
}

function findStaringPosition(map: string[][]): Position {
    let startingPosition: Position = {x: -1, y: -1};

    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (map[i][j] === 'S') {
                startingPosition.x = i;
                startingPosition.y = j;
            }
        }
    }

    return startingPosition;
}

function findLoopStart(map: string[][], startingPosition: Position): Instruction {
    if (startingPosition.x > 0 && !moveNextStep(map, {position: startingPosition, direction: Direction.North}).error) {
        return moveNextStep(map, {position: startingPosition, direction: Direction.North})
    } else if (startingPosition.y < map[startingPosition.x].length - 1 && !moveNextStep(map, {position: startingPosition, direction: Direction.East}).error) {
        return moveNextStep(map, {position: startingPosition, direction: Direction.East})
    } else if (startingPosition.x < map.length - 1 && !moveNextStep(map, {position: startingPosition, direction: Direction.South}).error) {
        return moveNextStep(map, {position: startingPosition, direction: Direction.South})
    } else {
        return moveNextStep(map, {position: startingPosition, direction: Direction.West})
    }
}

function moveNextStep(map: string[][], currentInstruction: Instruction): Instruction {

    currentInstruction.position
    // Going North
    if (currentInstruction.direction === Direction.North) {
        if (map[currentInstruction.position.x - 1][currentInstruction.position.y] === '|') {
            return {position: {x: currentInstruction.position.x - 1, y: currentInstruction.position.y}, direction: Direction.North};
        } else if (map[currentInstruction.position.x - 1][currentInstruction.position.y] === '7') {
            return {position: {x: currentInstruction.position.x - 1, y: currentInstruction.position.y}, direction: Direction.West};
        } else if (map[currentInstruction.position.x - 1][currentInstruction.position.y] === 'F') {
            return {position: {x: currentInstruction.position.x - 1, y: currentInstruction.position.y}, direction: Direction.East};
        }
    }

    // Going South
    if (currentInstruction.direction === Direction.South) {
        if (map[currentInstruction.position.x + 1][currentInstruction.position.y] === '|') {
            return {position: {x: currentInstruction.position.x + 1, y: currentInstruction.position.y}, direction: Direction.South};
        } else if (map[currentInstruction.position.x + 1][currentInstruction.position.y] === 'J') {
            return {position: {x: currentInstruction.position.x + 1, y: currentInstruction.position.y}, direction: Direction.West};
        } else if (map[currentInstruction.position.x + 1][currentInstruction.position.y] === 'L') {
            return {position: {x: currentInstruction.position.x + 1, y: currentInstruction.position.y}, direction: Direction.East};
        }
    }

    // Going East
    if (currentInstruction.direction === Direction.East) {
        if (map[currentInstruction.position.x][currentInstruction.position.y + 1] === '-') {
            return {position: {x: currentInstruction.position.x, y: currentInstruction.position.y + 1}, direction: Direction.East};
        } else if (map[currentInstruction.position.x][currentInstruction.position.y + 1] === 'J') {
            return {position: {x: currentInstruction.position.x, y: currentInstruction.position.y + 1}, direction: Direction.North};
        } else if (map[currentInstruction.position.x][currentInstruction.position.y + 1] === '7') {
            return {position: {x: currentInstruction.position.x, y: currentInstruction.position.y + 1}, direction: Direction.South};
        }
    }

    // Going West
    if (currentInstruction.direction === Direction.West) {
        if (map[currentInstruction.position.x][currentInstruction.position.y - 1] === '-') {
            return {position: {x: currentInstruction.position.x, y: currentInstruction.position.y - 1}, direction: Direction.West};
        } else if (map[currentInstruction.position.x][currentInstruction.position.y - 1] === 'L') {
            return {position: {x: currentInstruction.position.x, y: currentInstruction.position.y - 1}, direction: Direction.North};
        } else if (map[currentInstruction.position.x][currentInstruction.position.y - 1] === 'F') {
            return {position: {x: currentInstruction.position.x, y: currentInstruction.position.y - 1}, direction: Direction.South};
        }
    }
    return {position: {x: -1, y: -1}, direction: Direction.South, error: true};
}

// Hilfsfunktion zum Erstellen eines eindeutigen Schlüssels für eine Position
const positionKey = (position: Position): string => `${position.x},${position.y}`;


function part1(map: string[][]): string[][] {
    let positionMap: Map<string, number> = new Map();
    let currentPos = findStaringPosition(map);

    // For Part 2
    let newMap: string[][] = map.map(row => new Array(row.length).fill('.'));
    newMap[currentPos.x][currentPos.y] = 'S';

    let currentInstruction = findLoopStart(map, currentPos);
    let cnt = 0;

    while (true) {
        if (positionMap.has(positionKey(currentInstruction.position))) {
            break;
        }
        positionMap.set(positionKey(currentInstruction.position), cnt);
        if (!currentInstruction.error) {
            newMap[currentInstruction.position.x][currentInstruction.position.y] = map[currentInstruction.position.x][currentInstruction.position.y]
            // Mark Inside :) 50/50 lol
            // North
            if (map[currentInstruction.position.x][currentInstruction.position.y] === '|' && currentInstruction.direction === Direction.North && currentInstruction.position.y + 1 <= map[currentInstruction.position.x].length) {
                let charAtPosition = newMap[currentInstruction.position.x][currentInstruction.position.y + 1];
                if (!['|', '-', 'L', 'J', '7', 'F', 'S'].includes(charAtPosition)) {
                    newMap[currentInstruction.position.x][currentInstruction.position.y + 1] = 'X';
                }
            } else if (map[currentInstruction.position.x][currentInstruction.position.y] === 'J' && currentInstruction.direction === Direction.North && currentInstruction.position.y + 1 <= map[currentInstruction.position.x].length) {
                let charAtPosition = newMap[currentInstruction.position.x][currentInstruction.position.y + 1];
                if (!['|', '-', 'L', 'J', '7', 'F', 'S'].includes(charAtPosition)) {
                    newMap[currentInstruction.position.x][currentInstruction.position.y + 1] = 'X';
                }
                charAtPosition = newMap[currentInstruction.position.x + 1][currentInstruction.position.y]
                if (!['|', '-', 'L', 'J', '7', 'F', 'S'].includes(charAtPosition)) {
                    newMap[currentInstruction.position.x + 1][currentInstruction.position.y] = 'X';
                }
            }
            // South
            else if (map[currentInstruction.position.x][currentInstruction.position.y] === '|' && currentInstruction.direction === Direction.South && currentInstruction.position.y - 1 <= map[currentInstruction.position.x].length) {
                let charAtPosition = newMap[currentInstruction.position.x][currentInstruction.position.y - 1];
                if (!['|', '-', 'L', 'J', '7', 'F', 'S'].includes(charAtPosition)) {
                    newMap[currentInstruction.position.x][currentInstruction.position.y - 1] = 'X';
                }
            } else if (map[currentInstruction.position.x][currentInstruction.position.y] === 'F' && currentInstruction.direction === Direction.South && currentInstruction.position.y - 1 <= map[currentInstruction.position.x].length) {
                let charAtPosition = newMap[currentInstruction.position.x][currentInstruction.position.y - 1];
                if (!['|', '-', 'L', 'J', '7', 'F', 'S'].includes(charAtPosition)) {
                    newMap[currentInstruction.position.x][currentInstruction.position.y - 1] = 'X';
                }
                charAtPosition = map[currentInstruction.position.x - 1][currentInstruction.position.y];
                if (!['|', '-', 'L', 'J', '7', 'F', 'S'].includes(charAtPosition)) {
                    newMap[currentInstruction.position.x - 1][currentInstruction.position.y] = 'X';
                }
            }

            // East
            else if (map[currentInstruction.position.x][currentInstruction.position.y] === '-' && currentInstruction.direction === Direction.East && currentInstruction.position.x + 1 <= map.length) {
                let charAtPosition = newMap[currentInstruction.position.x + 1][currentInstruction.position.y];
                if (!['|', '-', 'L', 'J', '7', 'F', 'S'].includes(charAtPosition)) {
                    newMap[currentInstruction.position.x + 1][currentInstruction.position.y] = 'X';
                }
            } else if (map[currentInstruction.position.x][currentInstruction.position.y] === 'L' && currentInstruction.direction === Direction.East && currentInstruction.position.x + 1 <= map.length) {
                let charAtPosition = newMap[currentInstruction.position.x + 1][currentInstruction.position.y];
                if (!['|', '-', 'L', 'J', '7', 'F', 'S'].includes(charAtPosition)) {
                    newMap[currentInstruction.position.x + 1][currentInstruction.position.y] = 'X';
                }
                charAtPosition = newMap[currentInstruction.position.x][currentInstruction.position.y - 1];
                if (!['|', '-', 'L', 'J', '7', 'F', 'S'].includes(charAtPosition)) {
                    newMap[currentInstruction.position.x][currentInstruction.position.y - 1] = 'X';
                }
            }

            // West
            else if (map[currentInstruction.position.x][currentInstruction.position.y] === '-' && currentInstruction.direction === Direction.West && currentInstruction.position.x - 1 <= map.length) {
                let charAtPosition = newMap[currentInstruction.position.x - 1][currentInstruction.position.y];
                if (!['|', '-', 'L', 'J', '7', 'F', 'S'].includes(charAtPosition)) {
                    newMap[currentInstruction.position.x - 1][currentInstruction.position.y] = 'X';
                }
            } else if (map[currentInstruction.position.x][currentInstruction.position.y] === '7' && currentInstruction.direction === Direction.West && currentInstruction.position.x - 1 <= map.length) {
                let charAtPosition = newMap[currentInstruction.position.x - 1][currentInstruction.position.y];
                if (!['|', '-', 'L', 'J', '7', 'F', 'S'].includes(charAtPosition)) {
                    newMap[currentInstruction.position.x - 1][currentInstruction.position.y] = 'X';
                }
                charAtPosition = newMap[currentInstruction.position.x][currentInstruction.position.y + 1];
                if (!['|', '-', 'L', 'J', '7', 'F', 'S'].includes(charAtPosition)) {
                    newMap[currentInstruction.position.x][currentInstruction.position.y + 1] = 'X';
                }
            }
        }
        currentInstruction = moveNextStep(map, currentInstruction);
        cnt++;
    }
    console.log("Part 1: " + cnt / 2);
    return newMap
}


function are2DArraysEqual(array1: any[][], array2: any[][]): boolean {
    if (array1.length !== array2.length) {
        return false;
    }

    for (let i = 0; i < array1.length; i++) {
        if (array1[i].length !== array2[i].length) {
            return false;
        }

        for (let j = 0; j < array1[i].length; j++) {
            if (array1[i][j] !== array2[i][j]) {
                return false;
            }
        }
    }

    return true;
}

function isValid(map: string[][], pos: Position): boolean {
    // remove edge and out of bound
    if (pos.x > map.length - 2 || pos.x < 1 || pos.y > map[0].length - 2 || pos.y < 1) {
        return false
    }

    // if current Pos is Pipe
    let charAtPosition = map[pos.x][pos.y];
    if (['|', '-', 'L', 'J', '7', 'F', 'S'].includes(charAtPosition)) {
        return false
    }

    // Floooooood !!!!
    if (map[pos.x - 1][pos.y] === 'X' || map[pos.x + 1][pos.y] === 'X' || map[pos.x][pos.y + 1] === 'X' || map[pos.x][pos.y - 1] === 'X') {
        return true
    }
    return false;
}

function part2(map: string[][]) {
    while (true) {
        let intermap = map
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[i].length; j++) {
                if (isValid(map, {x: i, y: j})) {
                    intermap[i][j] = 'X'
                }
            }
        }

        if (are2DArraysEqual(map, intermap)) {
            break;
        }
        map = intermap;
    }

    let count = 0;

    newMap.forEach(row => {
        row.forEach(char => {
            if (char === 'X') {
                count++;
            }
        });
    });

    const output = newMap.map(row => row.join('')).join('\n');
    console.log(output);

    console.log(`Part 2: ${count}`);
}

const map = readFileInto2DMap('./input.txt');
const newMap = part1(map);
part2(newMap);

