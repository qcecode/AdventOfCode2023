const fs = require('fs');

function part1() {
// Lesen der Datei synchron
    const data = fs.readFileSync('day01/input.txt', 'utf8');
    const lines = data.split('\n');

    let ans = 0;
    for (const line of lines) {
        let interAns = ""

        // from left
        for (const char of line) {
            if (!isNaN(parseInt(char))) {
                interAns = char;
                break;
            }
        }

        // from right
        for (let i = line.length - 1; i >= 0; i--) {
            if (!isNaN(parseInt(line[i]))) {
                interAns += line[i];
                break;
            }
        }

        ans += parseInt(interAns)
    }

    console.log("Part1: " + ans);
}

function part2() {
    const data = fs.readFileSync('day01/input.txt', 'utf8');
    const lines = data.split('\n');

    let ans = 0;
    for (const line of lines) {

        // from left
        let wordPosLeft = findWordAndPositionFromLeft(line);
        let leftNum = "";
        if (wordPosLeft.position !== -1) {
            leftNum = wordPosLeft.value.toString();
        }
        for (let i = 0; i < line.length; i++) {
            if (!isNaN(parseInt(line[i]))) {
                if (wordPosLeft.position === -1 || i < wordPosLeft.position) {
                    leftNum = line[i];
                    break;
                }
            }
        }

        // from right
        let wordPosRight = findWordAndPositionFromRight(line);
        let rightNum = "";
        if (wordPosRight.position !== -1) {
            rightNum = wordPosRight.value.toString();
        }
        for (let i = line.length - 1; i >= 0; i--) {
            if (!isNaN(parseInt(line[i]))) {
                if (wordPosRight.position === -1 || i > wordPosRight.position) {
                    rightNum = line[i];
                    break;
                }
            }
        }
        ans += parseInt(leftNum + rightNum)
    }
    console.log("Part2: " + ans);
}

function findWordAndPositionFromLeft(text) {
    const wordsToFind = {
        "one": 1, "two": 2, "three": 3, "four": 4,
        "five": 5, "six": 6, "seven": 7, "eight": 8, "nine": 9
    };
    let lowerCaseText = text.toLowerCase();
    let firstFoundPos = -1;
    let foundValue = null;

    for (const word in wordsToFind) {
        let position = lowerCaseText.indexOf(word);
        if (position !== -1 && (firstFoundPos === -1 || position < firstFoundPos)) {
            firstFoundPos = position;
            foundValue = wordsToFind[word];
        }
    }

    return {position: firstFoundPos, value: foundValue};
}

function findWordAndPositionFromRight(text) {
    const wordsToFind = {
        "one": 1, "two": 2, "three": 3, "four": 4,
        "five": 5, "six": 6, "seven": 7, "eight": 8, "nine": 9
    };
    let lowerCaseText = text.toLowerCase();
    let lastFoundPos = -1;
    let foundValue = null;

    for (const word in wordsToFind) {
        let position = lowerCaseText.lastIndexOf(word);
        if (position !== -1 && (lastFoundPos === -1 || position > lastFoundPos)) {
            lastFoundPos = position;
            foundValue = wordsToFind[word];
        }
    }

    return {position: lastFoundPos, value: foundValue};
}

part1()
part2()


