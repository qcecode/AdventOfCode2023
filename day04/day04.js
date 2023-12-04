const fs = require('fs');

function calculateScratchcardPoints(cards) {
    let totalPoints = 0;

    cards.forEach(card => {
        const parts = card.split(': ')[1].split(' | ');
        const winningNumbers = parts[0].trim().split(/\s+/).map(Number);
        const yourNumbers = parts[1].trim().split(/\s+/).map(Number);

        let points = 0;
        let matchFound = false;

        yourNumbers.forEach(num => {
            if (winningNumbers.includes(num)) {
                if (!matchFound) {
                    points = 1;  // Erster Treffer gibt 1 Punkt
                    matchFound = true;
                } else {
                    points *= 2; // Jeder weitere Treffer verdoppelt die Punkte
                }
            }
        });

        totalPoints += points;
    });

    return totalPoints;
}

fs.readFile('input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error("Fehler beim Lesen der Datei:", err);
        return;
    }

    const scratchcards = data.trim().split('\n');
    console.log("Gesamtpunktzahl:", calculateScratchcardPoints(scratchcards));
});
