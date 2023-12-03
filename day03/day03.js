const fs = require('fs');

function parseInput(input) {

    return input.split(/\r?\n/); // Aufteilen an jedem Zeilenumbruch

}

//REGEX IS MAGIC
function isDigit(char) {
    return /\d/.test(char);
}

function containsNonNumericNonDotCharacter(str) {
    return /[^0-9.]/.test(str);
}


function parseNumberFromString(str, start, end) {
    // Extrahiere den Teilstring, der die Zahl enthält
    const numberPart = str.substring(start, end + 1);

    // Parse den extrahierten Teilstring als Zahl
    // Verwenden Sie parseInt() für Ganzzahlen oder parseFloat() für Fließkommazahlen
    return parseInt(numberPart); // oder parseFloat(numberPart);
}

/**
 * Processes an array of strings.
 * @param {string[]} lines - The lines to process.
 */
function part1(lines) {
    let ans = 0;
    for (let x = 0; x < lines.length; x++) {

        let line = lines[x];
        for (let i = 0; i < line.length; i++) {
            // Start of the Number
            if (isDigit((line.charAt(i)))) {
                //get the complete Number
                let number = 0;
                let numberStart = i;
                let numberEnd = i;
                for (let j = i + 1; j < line.length; j++) {
                    if (!isDigit((line.charAt(j)))) {
                        break;
                    }
                    numberEnd = j;
                }
                number = parseNumberFromString(line, numberStart, numberEnd);

                // CHECK IF Number IS CONNECTED
                var stringToCheck = "";
                var numberStartChecked = (numberStart === 0) ? 0 : numberStart - 1
                var numberEndChecked = (numberEnd === line.length) ? line.length : numberEnd + 1
                // check above number
                if (x > 0) {
                    var lineAbove = lines[x - 1];
                    stringToCheck += lineAbove.substring(numberStartChecked, numberEndChecked + 1);
                }
                // Check below number
                if (x < lines.length - 2) {
                    var lineBelow = lines[x + 1];
                    stringToCheck += lineBelow.substring(numberStartChecked, numberEndChecked + 1); // stupid JS substrings :)
                }
                // Vor und nach dem String
                if (numberStartChecked !== 0) {
                    stringToCheck += line.charAt(numberStartChecked)
                }
                if (numberEndChecked !== line.length) {
                    stringToCheck += line.charAt(numberEndChecked)
                }
                if (containsNonNumericNonDotCharacter(stringToCheck)) {
                    ans += number;
                }

                // continue at end of the Number
                i = numberEnd;
            }
        }

    }
    console.log("Part1 :" + ans);
}

// test if string is "Zahl * Zahl"
function testStupidEdgeCase(str) {
    const pattern = /^\d\.\d$/;
    return pattern.test(str);
}

function findNumberPositionInString(str) {
    // Überprüfen Sie zuerst, ob die Länge des Strings genau 3 ist
    if (str.length !== 3) {
        return -1;
    }

    // Durchsuchen Sie den String nach der ersten Ziffer
    for (let i = 0; i < str.length; i++) {
        if (/\d/.test(str[i])) {
            return i; // Gibt die Position der ersten gefundenen Zahl zurück
        }
    }

    return -1; // Keine Zahl gefunden
}

function findNumberInStringLeft(str) {
    let number = '';

    for (let i = str.length - 1; i >= 0; i--) {
        if (!isDigit(str.charAt(i))) {
            break;
        }
        number = str.charAt(i) + number;
    }

    return number.length > 0 ? parseInt(number, 10) : -1;
}

function findNumberInStringRight(str) {
    let number = '';

    for (let i = 0; i < str.length; i++) {
        if (!isDigit(str.charAt(i))) {
            break;
        }
        number += str.charAt(i);
    }

    return number.length > 0 ? parseInt(number, 10) : -1;
}

function findNumberInStringMiddle(str, startPos) {
    // Bestimme die linke Grenze der Zahl
    let left = startPos;
    while (left > 0 && /\d/.test(str[left - 1])) {
        left--;
    }

    // Bestimme die rechte Grenze der Zahl
    let right = startPos;
    while (right < str.length - 1 && /\d/.test(str[right + 1])) {
        right++;
    }

    // Extrahiere die Zahl vom String und konvertiere sie in eine Zahl
    const numberStr = str.substring(left, right + 1);
    return parseInt(numberStr, 10);
}

/**
 * Processes an array of strings.
 * @param {string[]} lines - The lines to process.
 */
function part2(lines) {
    let ans = 0;
    for (let x = 0; x < lines.length; x++) {
        let line = lines[x];
        for (let i = 0; i < line.length; i++) {
            // find the * !
            if (line.charAt(i) === "*") {
                let numbersFound = [];

                // check top
                if (x > 0) {
                    let lineAbove = lines[x - 1];
                    let posInLineAbove = findNumberPositionInString(lineAbove.substring(i - 1, i + 2));
                    if (testStupidEdgeCase(lineAbove.substring(i - 1, i + 2))) {
                        numbersFound.push(findNumberInStringLeft(lineAbove.substring(0, i)));
                        numbersFound.push(findNumberInStringRight(lineAbove.substring(i + 1)));
                    } else if (posInLineAbove !== -1) {
                        numbersFound.push(findNumberInStringMiddle(lineAbove, i + posInLineAbove - 1));
                    }
                }
                // check bottom
                if (x < lines.length - 1) {
                    let lineBelow = lines[x + 1];
                    let posInLineBelow = findNumberPositionInString(lineBelow.substring(i - 1, i + 2));
                    if (testStupidEdgeCase(lineBelow.substring(i - 1, i + 2))) {
                        numbersFound.push(findNumberInStringLeft(lineBelow.substring(0, i)));
                        numbersFound.push(findNumberInStringRight(lineBelow.substring(i + 1)));
                    } else if (posInLineBelow !== -1) {
                        numbersFound.push(findNumberInStringMiddle(lineBelow, i + 1 + posInLineBelow - 1));
                    }
                }

                // Check Left for Number
                if (i > 0) {
                    let numberLeft = findNumberInStringLeft(line.substring(0, i))
                    if (numberLeft !== -1) {
                        numbersFound.push(numberLeft);
                    }
                }

                // Check Right for Number
                if (i < line.length - 1) {
                    let numberRight = findNumberInStringRight(line.substring(i + 1));
                    if (numberRight !== -1) {
                        numbersFound.push(numberRight);
                    }
                }

                if (numbersFound.length === 2) {
                    ans += numbersFound[0] * numbersFound[1];
                }
            }
        }
    }
    console.log("Part2 :" + ans);
}

const data = fs.readFileSync('input.txt', 'utf8');
var lines = parseInput(data)

part1(lines);
part2(lines)




