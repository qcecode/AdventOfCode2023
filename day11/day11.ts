import * as fs from 'fs';

type Galaxy = {
    x: number
    y: number
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

function insertRowAtIndex(array: string[][], index: number, rowCount: number = 1): string[][] {
    if (array.length === 0 || index < 0 || index >= array.length) {
        throw new Error("Invalid index in insertRowAtIndex");
    }

    const rowLength = array[0].length;
    const newRow = new Array(rowLength).fill('.');

    const newArray: string[][] = [];

    for (let i = 0; i <= index; i++) {
        newArray.push(array[i]);
    }

    for (let i = 0; i < rowCount; i++) {
        newArray.push([...newRow]);
    }

    for (let i = index + 1; i < array.length; i++) {
        newArray.push(array[i]);
    }

    return newArray;
}

function insertColumnsAtIndex(array: string[][], index: number, columnCount: number = 1): string[][] {
    if (array.length === 0 || index < 0 || index > array[0].length) {
        throw new Error("Invalid index in insertColumnsAtIndex");
    }

    return array.map(row => {
        return [...row.slice(0, index),
            ...new Array(columnCount).fill('.'),
            ...row.slice(index)];
    });
}

function expandMap(map: string[][]): string[][] {
    // check Rows
    for (let i = 0; i < map.length; i++) {
        let hasGalaxy = false
        for (let j = 0; j < map[i].length; j++) {
            if (map[i][j] === '#') {
                hasGalaxy = true;
                break
            }
        }
        if (!hasGalaxy) {
            map = insertRowAtIndex(map, i, 1);
            i += 1;
        }
    }

    // check Columns
    for (let k = 0; k < map[0].length; k++) {
        let hasGalaxy = false
        for (let l = 0; l < map.length; l++) {
            if (map[l][k] === '#') {
                hasGalaxy = true;
                break
            }
        }
        if (!hasGalaxy) {
            map = insertColumnsAtIndex(map, k, 1);
            k += 1;
        }
    }

    return map;
}

function getAllGalaxie(map: string[][]): Galaxy[] {
    let galaxies: Galaxy[] = [];
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (map[i][j] === '#') {
                galaxies.push({x: i, y: j})
            }
        }
    }
    return galaxies;
}

function calculateShortestPath(start: Galaxy, end: Galaxy): number {
    const horizontalDistance = Math.abs(start.x - end.x);
    const verticalDistance = Math.abs(start.y - end.y);

    return horizontalDistance + verticalDistance;
}

function part1() {
    const map = readFileInto2DMap('./input.txt');
    const expandedMap = expandMap(map);
    const galaxies = getAllGalaxie(expandedMap);

    let distance = 0;
    for (let i = 0; i < galaxies.length; i++) {
        for (let j = i + 1; j < galaxies.length; j++) {
            distance += calculateShortestPath(galaxies[i], galaxies[j]);
        }
    }
    console.log("Part 1: " + distance);
}

function getEmptyRows(map: string[][]): number[] {
    let emptyRows: number[] = [];
    for (let i = 0; i < map.length; i++) {
        let hasGalaxy = false
        for (let j = 0; j < map[i].length; j++) {
            if (map[i][j] === '#') {
                hasGalaxy = true;
                break;
            }
        }
        if (!hasGalaxy) {
            emptyRows.push(i);
        }
    }
    return emptyRows;
}

function getEmptyColumns(map: string[][]): number[] {
    let emptyColumns: number[] = [];
    for (let k = 0; k < map[0].length; k++) {
        let hasGalaxy = false
        for (let l = 0; l < map.length; l++) {
            if (map[l][k] === '#') {
                hasGalaxy = true;
                break;
            }
        }
        if (!hasGalaxy) {
            emptyColumns.push(k)
        }
    }
    return emptyColumns;
}

function calculateShortestPathPart2(start: Galaxy, end: Galaxy, emptyRows: number[], emptyColumns: number[]): number {
    const horizontalDistance = Math.abs(start.x - end.x);
    const verticalDistance = Math.abs(start.y - end.y);

    let distance = horizontalDistance + verticalDistance;

    const minX = Math.min(start.x, end.x);
    const maxX = Math.max(start.x, end.x);

    for (let i = minX; i < maxX; i++) {
        if (emptyRows.includes(i)) {
            distance += expansionFactor;
        }
    }

    const minY = Math.min(start.y, end.y);
    const maxY = Math.max(start.y, end.y);

    for (let i = minY; i < maxY; i++) {
        if (emptyColumns.includes(i)) {
            distance += expansionFactor;
        }
    }

    return distance;
}

function part2() {
    const map = readFileInto2DMap('./input.txt');
    const galaxies = getAllGalaxie(map);
    const emptyRows: number[] = getEmptyRows(map);
    const emptyColumns: number[] = getEmptyColumns(map);

    let distance = 0;
    for (let i = 0; i < galaxies.length; i++) {
        for (let j = i + 1; j < galaxies.length; j++) {
            distance += calculateShortestPathPart2(galaxies[i], galaxies[j], emptyRows, emptyColumns);
        }
    }
    console.log("Part 2: " + distance);
}

const expansionFactor = 999999;

part1();
part2();