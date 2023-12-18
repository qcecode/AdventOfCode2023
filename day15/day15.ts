import * as fs from 'fs';

function computeHash(s: string): number {
    let hashValue = 0;
    for (const ch of s) {
        const charCode = ch.codePointAt(0);
        if (charCode !== undefined) {
            hashValue += charCode;
            hashValue = (hashValue * 17) % 256;
        }
    }
    return hashValue;
}

function calculateSumOfHashes(inputList: string[]): number {
    return inputList.reduce((acc, str) => acc + computeHash(str), 0);
}

function processInstructions(instructions: string[]): number {
    const boxes: string[][] = Array.from({length: 256}, () => []);
    const focalLengths: Record<string, number> = {};

    instructions.forEach(instruction => {
        if (instruction.includes('-')) {
            const label = instruction.slice(0, -1);
            const index = computeHash(label);
            boxes[index] = boxes[index].filter(l => l !== label);
        } else {
            const [label, length] = instruction.split('=');
            const lengthValue = parseInt(length, 10);
            const index = computeHash(label);
            if (!boxes[index].includes(label)) {
                boxes[index].push(label);
            }
            focalLengths[label] = lengthValue;
        }
    });

    return boxes.reduce((total, box, i) => {
        return total + box.reduce((boxTotal, label, j) => {
            return boxTotal + (i + 1) * (j + 1) * (focalLengths[label] || 0);
        }, 0);
    }, 0);
}

const fileContent = fs.readFileSync('./input.txt', 'utf-8');
const inputList = fileContent.split(',');

console.log("Part1: " + calculateSumOfHashes(inputList));
console.log("Part2: " + processInstructions(inputList));
