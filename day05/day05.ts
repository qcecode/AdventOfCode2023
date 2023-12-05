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

const parsedFile = parseInputFile('input.txt');
const mapsData = new MapsData(parsedFile.maps);
console.log(processSeeds(parsedFile.seeds, mapsData));


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

