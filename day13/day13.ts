import { readFileSync } from 'fs';

type ArrayTwoDim = string[][];

class TextParser {
    parse(text: string): ArrayTwoDim[] {
        // Windows Unix Fun
        const unixText = text.replace(/\r\n/g, '\n');

        return unixText.split('\n\n')
            .map(section => section.split('\n')
                .map(line => line.split('')));
    }
}

function parseFile(filePath: string): ArrayTwoDim[] {
    try {
        const data = readFileSync(filePath, 'utf8');
        const parser = new TextParser();
        return parser.parse(data);
    } catch (err) {
        console.error("Err while parsing the file", err);
        return [];
    }
}

function isSymmetric(str: string): boolean {
    for (let i = 0; i < str.length / 2; i++) {
        if (str[i] !== str[str.length - 1 - i]) {
            return false;
        }
    }
    return true;
}

function createEvenLengthSubstring(str: string, position: number): string {
    if (position < 0 || position >= str.length - 1) {
        return "";
    }

    const maxLengthLeft = position + 1;
    const maxLengthRight = str.length - position - 1;

    const substringLength = 2 * Math.min(maxLengthLeft, maxLengthRight);

    const start = position - substringLength / 2 + 1;
    const end = start + substringLength;

    return str.substring(start, end);
}

function checkVerticalSymmetry(array:ArrayTwoDim):number{
    for (let i = 0; i < array[0].length-1; i++) {
        let isSym = true;
        for (let j = 0; j < array.length; j++) {
            const substr = createEvenLengthSubstring(array[j].join(""),i)
            if(!isSymmetric(substr)){
                isSym = false;
                break;
            }
        }
        if (isSym){
            return i + 1;
        }
    }
    return -1
}

function getColumnAsString(section: ArrayTwoDim, columnIndex: number): string {
    return section.map(row => row[columnIndex]).join('');
}

function checkHorizontalSymmetry(array:ArrayTwoDim):number{
    for (let i = 0; i < array.length-1; i++) {
        let isSym = true;
        for (let j = 0; j < array[0].length; j++) {
            let row = getColumnAsString(array,j)
            const substr = createEvenLengthSubstring(row,i)
            if(!isSymmetric(substr)){
                isSym = false;
                break;
            }
        }
        if (isSym){
            return i + 1;
        }
    }
    return -1
}

function part1(arrays:ArrayTwoDim[]) {
    let ans = 0;
    for (const array of arrays) {
        let inter = checkVerticalSymmetry(array);
        if(inter !== -1){
            ans += inter;
            continue;
        }
        inter = checkHorizontalSymmetry(array);
        if(inter !== -1){
            ans += inter*100;
            continue;
        }
        throw new Error("You shall not code");
    }
    console.log("Part 1: " + ans);
}

function part2(arrays:ArrayTwoDim[]) {
    let ans = 0;
    for (const array of arrays) {
        let vertical = -1;
        let horizontal = -1;

        let foundH = false;
        let foundV = false;
        let min = Number.MAX_VALUE;

        for (let i = 0; i < array.length-1; i++) {
            let interArr = array.map(innerArray => [...innerArray]);
            for (let j = 0; j < array[0].length-1; j++) {
                if (array[i][j] === ".") {
                    interArr[i][j] = "#";
                } else {
                    interArr[i][j] = ".";
                }

                vertical = checkVerticalSymmetry(interArr);
                if (vertical !== -1 && vertical < min) {
                    min = vertical;
                    foundH = false;
                    foundV = true;
                }

                horizontal = checkHorizontalSymmetry(interArr);
                if (horizontal !== -1 && horizontal < min){
                    min = horizontal;
                    foundH = true;
                    foundV = false;
                }
            }
        }
        if(foundH){
            ans += min*100;
        } else if(foundV){
            ans += min;
        }
    }
    console.log("Part 2: " + ans);
}

const parsedData = parseFile('input.txt');
part1(parsedData)
part2(parsedData)
