import fs from 'fs';

function parseInputFile(filePath: string): { seeds: number[], maps: { [key: string]: number[][] } } {

    const fileContent = fs.readFileSync(filePath, 'utf8');

    const sections = fileContent.split('\n\n');

    const maps: { [key: string]: number[][] } = {};

    const seedsLine = sections.shift() || ""; // Entfernt und speichert die erste Zeile
    const seeds = seedsLine.substring(seedsLine.indexOf(':') + 1).trim().split(' ').map(Number);

    sections.forEach(section => {

        const lines = section.split('\n');
        const key = lines[0].split(':')[0].trim();
        const dataLines = lines.slice(1);

        maps[key] = dataLines.map(line => line.split(' ').map(Number));

    });
    return {seeds, maps};
}

class MapsData {
    seedToSoil: number[][];
    soilToFertilizer: number[][];
    fertilizerToWater: number[][];
    waterToLight: number[][];
    lightToTemperature: number[][];
    temperatureToHumidity: number[][];
    humidityToLocation: number[][];

    constructor(maps: { [key: string]: number[][] }) {
        this.seedToSoil = maps['seed-to-soil map'] || [];
        this.soilToFertilizer = maps['soil-to-fertilizer map'] || [];
        this.fertilizerToWater = maps['fertilizer-to-water map'] || [];
        this.waterToLight = maps['water-to-light map'] || [];
        this.lightToTemperature = maps['light-to-temperature map'] || [];
        this.temperatureToHumidity = maps['temperature-to-humidity map'] || [];
        this.humidityToLocation = maps['humidity-to-location map'] || [];
    }

}

function processSeed(seed: number, map: number[][]): number {
    for (const mapElement of map) {
        if (seed >= mapElement[1] && seed <= mapElement[1] + mapElement[2]) {
            return mapElement[0] + (seed - mapElement[1]);
        }
    }
    return seed;
}

function processSeeds(seeds: number[], maps: MapsData): number {
    let minSeed = Number.MAX_VALUE;
    for (const seed of seeds) {
        let inter = processSeed(seed, maps.seedToSoil);
        inter = processSeed(inter, maps.soilToFertilizer);
        inter = processSeed(inter, maps.fertilizerToWater);
        inter = processSeed(inter, maps.waterToLight);
        inter = processSeed(inter, maps.lightToTemperature);
        inter = processSeed(inter, maps.temperatureToHumidity);
        inter = processSeed(inter, maps.humidityToLocation);
        if (minSeed >= inter) {
            minSeed = inter;
        }
    }
    return minSeed;
}

function precessMoreSeeds(seeds: number[], maps: MapsData): number {
    const maxSeed = Math.max(...seeds);
    for (let i = 0; i < maxSeed; i++) {
        let inter = reverseProcessSeed(i, maps.humidityToLocation);
        inter = reverseProcessSeed(inter, maps.temperatureToHumidity);
        inter = reverseProcessSeed(inter, maps.lightToTemperature);
        inter = reverseProcessSeed(inter, maps.waterToLight);
        inter = reverseProcessSeed(inter, maps.fertilizerToWater);
        inter = reverseProcessSeed(inter, maps.soilToFertilizer);
        inter = reverseProcessSeed(inter, maps.seedToSoil);

        if (isInRange(inter, seeds)) {
            return i;
        }
    }
    return maxSeed;
}

function isInRange(num: number, seeds: number[]) {
    for (let i = 0; i < seeds.length; i = i + 2) {
        if (num >= seeds[i] && num <= seeds[i + 1] + seeds[i]) {
            return true;
        }
    }
    return false
}

function reverseProcessSeed(seed: number, map: number[][]): number {
    for (const mapElement of map) {
        if (seed >= mapElement[0] && seed < mapElement[0] + mapElement[2]) {
            return mapElement[1] + (seed - mapElement[0]);
        }
    }
    return seed;
}

const parsedFile = parseInputFile('input.txt');
const mapsData = new MapsData(parsedFile.maps);

// Part1
const minProcessedSeed = processSeeds(parsedFile.seeds, mapsData);
console.log("Part 1: " + minProcessedSeed);

// Part2
const minProcessedSeedPartTwo = precessMoreSeeds(parsedFile.seeds, mapsData);
console.log("Part 2: " + minProcessedSeedPartTwo);

