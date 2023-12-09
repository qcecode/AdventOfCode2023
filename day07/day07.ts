import fs from 'fs';

const input = fs.readFileSync("./input.txt", "utf-8").split(/\r?\n/g);

type HandValues = { [key: string]: number };
const handVals: HandValues = {high: 0, pair: 1, twoPair: 2, three: 3, fullHouse: 4, four: 5, five: 6};
const cardValsPart1 = "AKQJT98765432";

function getHandPart1(hand: string): string {
    const set = [...new Set(hand)];

    if (set.length === 1) return "five";
    if (set.length === 2) {
        const [a, b] = set;
        if ((hand.indexOf(a) === hand.lastIndexOf(a)) || (hand.indexOf(b) === hand.lastIndexOf(b))) return "four";
        return "fullHouse";
    }
    if (set.length === 3) {
        const [a, b, c] = set;
        let amtA = 0, amtB = 0, amtC = 0;
        for (let i = 0; i < hand.length; i++) {
            if (hand[i] === a) amtA++;
            if (hand[i] === b) amtB++;
            if (hand[i] === c) amtC++;
        }
        if (amtA === 3 || amtB === 3 || amtC === 3) return "three";
        return "twoPair";
    }
    if (set.length === 4) return "pair";
    return "high";
}

console.log(input.sort((a, b) => {
    const [hand1, bid1] = a.split(" ");
    const [hand2, bid2] = b.split(" ");
    const type1 = getHandPart1(hand1);
    const type2 = getHandPart1(hand2);

    if (handVals[type1] > handVals[type2]) return -1;
    if (handVals[type1] < handVals[type2]) return 1;

    for (let i = 0; i < hand1.length; i++) {
        if (cardValsPart1.indexOf(hand1[i]) < cardValsPart1.indexOf(hand2[i])) return -1;
        if (cardValsPart1.indexOf(hand1[i]) > cardValsPart1.indexOf(hand2[i])) return 1;
    }

    if (parseInt(bid1) > parseInt(bid2)) return -1;
    if (parseInt(bid1) < parseInt(bid2)) return 1;
    return 0;
}).reduce((acc, hand, i) => acc += parseInt(hand.split(" ")[1]) * (input.length - i), 0));

const cardVals: string = "AKQT98765432J";

function getHand(hand: string): string {
    if (hand.indexOf("J") !== -1) {
        let mostFrequent: string = hand.replaceAll("J", "")
            .split("")
            .reduce((acc: [string, number], card: string): [string, number] => {
                const filteredHand = hand.replaceAll("J", "");
                const count = filteredHand.split(card).length - 1;
                return count > acc[1] ? [card, count] : acc;
            }, ["", 0])[0];
        hand = hand.replaceAll("J", mostFrequent || "K");
    }

    const set: Set<string> = new Set(hand.split(""));

    if (set.size === 1) return "five;" + hand;
    if (set.size === 2) {
        const [a, b] = Array.from(set);
        if ((hand.match(new RegExp(a, "g")) || []).length === 1 || (hand.match(new RegExp(b, "g")) || []).length === 1) {
            return "four;" + hand;
        }
        return "fullHouse;" + hand;
    }
    if (set.size === 3) {
        const [a, b, c] = Array.from(set);
        const amtA = (hand.match(new RegExp(a, "g")) || []).length;
        const amtB = (hand.match(new RegExp(b, "g")) || []).length;
        const amtC = (hand.match(new RegExp(c, "g")) || []).length;

        if (amtA === 3 || amtB === 3 || amtC === 3) return "three;" + hand;
        return "twoPair;" + hand;
    }
    if (set.size === 4) return "pair;" + hand;
    return "high;" + hand;
}


console.log(input.sort((a: string, b: string) => {
    const [hand1, bid1] = a.split(" ");
    const [hand2, bid2] = b.split(" ");
    const type1 = getHand(hand1).split(";")[0];
    const type2 = getHand(hand2).split(";")[0];

    if (handVals[type1] > handVals[type2]) return -1;
    if (handVals[type1] < handVals[type2]) return 1;

    for (let i = 0; i < hand1.length; i++) {
        if (cardVals.indexOf(hand1[i]) < cardVals.indexOf(hand2[i])) return -1;
        if (cardVals.indexOf(hand1[i]) > cardVals.indexOf(hand2[i])) return 1;
    }

    return parseInt(bid1) > parseInt(bid2) ? -1 : parseInt(bid1) < parseInt(bid2) ? 1 : 0;
}).reduce((acc: number, hand: string, i: number) => acc += parseInt(hand.split(" ")[1]) * (input.length - i), 0));
