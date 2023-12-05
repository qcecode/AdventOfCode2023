import fs from 'fs';

type MapEntry = number[][];
type ParsedMaps = { [key: string]: MapEntry };

function parseInputFile(filePath: string): { seeds: number[], maps: ParsedMaps } {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const sections = fileContent.split('\n\n');

    const seedsLine = sections.shift() || "";
    const seeds = seedsLine.split(':')[1].trim().split(' ').map(Number);

    const maps = sections.reduce((acc: ParsedMaps, section) => {
        const [title, ...dataLines] = section.split('\n');
        const key = title.split(':')[0].trim();
        acc[key] = dataLines.map(line => line.split(' ').map(Number));
        return acc;
    }, {});

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

function processSeed(seed: number, map: MapEntry): number {
    return map.reduce((processedSeed, [output, min, range]) => {
        if (seed >= min && seed <= min + range) {
            return output + (seed - min);
        }
        return processedSeed;
    }, seed);
}

function findMinimumProcessedSeed(seeds: number[], maps: MapsData): number {
    return seeds.reduce((minSeed, seed) => {
        const processedSeed = processAllMaps(seed, maps);
        return Math.min(minSeed, processedSeed);
    }, Number.MAX_VALUE);
}

function processAllMaps(seed: number, maps: MapsData): number {
    return [maps.seedToSoil, maps.soilToFertilizer, maps.fertilizerToWater,
        maps.waterToLight, maps.lightToTemperature, maps.temperatureToHumidity,
        maps.humidityToLocation]
        .reduce((intermediateSeed, map) => processSeed(intermediateSeed, map), seed);
}

const parsedFile = parseInputFile('input.txt');
const mapsData = new MapsData(parsedFile.maps);
const minProcessedSeed = findMinimumProcessedSeed(parsedFile.seeds, mapsData);
console.log(minProcessedSeed);


