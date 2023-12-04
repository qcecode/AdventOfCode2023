const fs = require('fs');

function countMatches(winningNumbers, yourNumbers) {
    return yourNumbers.filter(num => winningNumbers.includes(num)).length;
}

function processCards(cards) {
    let cardCopies = new Array(cards.length).fill(1); // Jede Karte beginnt mit 1 Kopie (das Original)

    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const parts = card.split(': ')[1].split(' | ');
        const winningNumbers = parts[0].trim().split(/\s+/).map(Number);
        const yourNumbers = parts[1].trim().split(/\s+/).map(Number);

        const matches = countMatches(winningNumbers, yourNumbers);

        // Füge Kopien zu den folgenden Karten hinzu
        for (let j = i + 1; j < i + 1 + matches && j < cards.length; j++) {
            cardCopies[j] += cardCopies[i];
        }
    }

    // Summiere alle Kopien
    return cardCopies.reduce((total, num) => total + num, 0);
}

fs.readFile('input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error("Fehler beim Lesen der Datei:", err);
        return;
    }

    const scratchcards = data.trim().split('\n');
    console.log("Gesamtanzahl der Scratchcards:", processCards(scratchcards));
});
