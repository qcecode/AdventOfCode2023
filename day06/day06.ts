import * as fs from 'fs';

interface Race {
    time: number;
    distance: number;
}

function parseData(input: string): Race[] {
    const lines = input.split('\n');
    const races: Race[] = [];

    let times: number[] = [];
    let distances: number[] = [];

    lines.forEach(line => {
        const parts = line.split(/\s+/).filter(p => p);
        const key = parts[0];
        const values = parts.slice(1).map(Number);

        if (key === 'Time:') {
            times = values;
        } else if (key === 'Distance:') {
            distances = values;
        }
    });

    for (let i = 0; i < times.length; i++) {
        races.push({time: times[i], distance: distances[i]});
    }

    return races;
}

function calculateRace(race: Race) {
    let ans = 0;
    for (let i = 1; i < race.time; i++) {
        let distanceTraveled = i * (race.time - i);
        if (distanceTraveled > race.distance) {
            ans += 1;
        }
    }
    return ans;
}

function part1(races: Race[]) {
    let ans = 1;
    for (const race of races) {
        ans *= calculateRace(race);
    }
    return ans;
}

function parseRace2(races: Race[]) {
    let time = ""
    let distance = ""
    for (const race of races) {
        time += race.time;
        distance += race.distance;
    }
    const newRace: Race = {
        time: parseInt(time),
        distance: parseInt(distance)
    };
    return newRace
}

const inputData = fs.readFileSync('input.txt', 'utf8');
const races = parseData(inputData);

const race2 = parseRace2(races);


console.log("Part 1: " + part1(races));
console.log("Part 2: " + calculateRace(race2))

