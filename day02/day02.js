const fs = require('fs');

function parseGames(input) {
    const games = [];
    const gameStrings = input.split(/\r?\n/); // Aufteilen an jedem Zeilenumbruch

    gameStrings.forEach(gameString => {
        const [gameId, colorsString] = gameString.split(':').map(s => s.trim());
        const numericId = parseInt(gameId.replace(/[^\d]/g, ''), 10); // Entfernt alles außer Zahlen und konvertiert in eine Zahl
        const colorSequences = colorsString.split(';').map(s => s.trim());
        const sequences = colorSequences.map(sequence => {
            const colorCounts = {
                blue: 0,
                red: 0,
                green: 0,
            };
            sequence.split(',').forEach(colorCount => {
                const [count, color] = colorCount.trim().split(' ');
                colorCounts[color] = parseInt(count, 10); // Umwandlung der Zeichenkette in eine Zahl
            });
            return colorCounts;
        });

        games.push({ id: numericId, sequences });
    });

    return games;
}
function part1(){
    let result = 0;
    
    function gameIsPossible(game){
        // max possible counts
        const maxRed = 12;
        const maxGreen = 13;
        const maxBlue = 14;
        for (const sequence of game.sequences) {
            if(sequence.red > maxRed) {
                return false
            }
            if(sequence.green > maxGreen){
                return false
            }
            if(sequence.blue > maxBlue) {
                return false
            }
        }
        return true;
    }
    
    for (const game of games) {
        if(gameIsPossible(game)){
            result += game.id;
        }
    }
    console.log("Part 1: " + result);
}

function part2(){
    let result = 0;

    function calculatePowerOfGame(game) {
        let maxRed = 0;
        let maxGreen = 0;
        let maxBlue = 0;

        for (const sequence of game.sequences) {
            if(sequence.red > maxRed) {
                maxRed = sequence.red;
            }
            if(sequence.green > maxGreen){
                maxGreen = sequence.green;
            }
            if(sequence.blue > maxBlue) {
                maxBlue = sequence.blue;
            }
        }
        return (maxRed*maxGreen*maxBlue);
    }

    for (const game of games) {
        result += calculatePowerOfGame(game);
    }
    console.log("Part 2: " + result);
}

const data = fs.readFileSync('input.txt', 'utf8');
const games = parseGames(data);

part1();
part2();