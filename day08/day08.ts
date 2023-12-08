import fs from 'fs';

type ParsedData = { [key: string]: string[] };
type ParsedResult = {
    instructions: string,
    data: ParsedData
};

function parseFileContent(filePath: string): ParsedResult {
    const fileContent = fs.readFileSync(filePath, {encoding: 'utf8'});
    const parts = fileContent.split('\n');
    const instructions = parts.shift()?.trim() || ''; // Extrahiere den Header (z.B. 'RL')
    const parsedData: ParsedData = {};

    parts.forEach(line => {
        const [key, values] = line.split(' = ');
        if (key && values) {
            const trimmedValues = values.match(/\(([^)]+)\)/)?.[1].split(',').map(s => s.trim());
            if (trimmedValues) {
                parsedData[key.trim()] = trimmedValues;
            }
        }
    });

    return {instructions: instructions, data: parsedData};
}


function part1(statingPos: string, input: ParsedResult) {
    let currentPos = statingPos;
    let idx = 0;

    while (currentPos[2] != 'Z') {
        //Left
        if (input.instructions.charAt(idx % input.instructions.length) === 'L') {
            currentPos = input.data[currentPos][0];
        } else {
            currentPos = input.data[currentPos][1];
        }
        idx++
    }

    return idx;
}

function findStartingPos(data: ParsedData): string[] {
    let ans: string[] = [];

    for (const [key] of Object.entries(data)) {
        if (key[2] === 'A') {
            ans.push(key);
        }
    }
    return ans;
}

// Funktion zur Berechnung des größten gemeinsamen Teilers (GCD)
const gcd = (a: number, b: number): number => a ? gcd(b % a, a) : b;

// Funktion zur Berechnung des kleinsten gemeinsamen Vielfachen (LCM)
const lcm = (a: number, b: number): number => a * b / gcd(a, b);


function part2new(input: ParsedResult) {
    let positions = findStartingPos(input.data)
    console.log(positions);
    let idx: number[] = [];

    for (const position of positions) {
        idx.push(part1(position, input))
    }

    return idx.reduce(lcm);
}

const parsedInput = parseFileContent('input.txt');
console.log("Part 1: " + part1('AAA', parsedInput));
console.log("Part 2: " + part2new(parsedInput));


