import fs from 'fs';

const sum = (a: number, b: number): number => a + b;

const cache = new Map<string, number>();

const _countWays = (row: string, ns: number[]): number => {
    row = row.replace(/^\.+|\.+$/, '');
    if (row === '') return ns.length ? 0 : 1;
    if (!ns.length) return row.includes('#') ? 0 : 1;
    const key = [row, ns.join(',')].join(' ');
    if (cache.has(key)) return cache.get(key)!;

    let result = 0;
    const damaged = row.match(/^#+(?=\.|$)/);
    if (damaged) {
        if (damaged[0].length === ns[0]) {
            result += _countWays(row.slice(ns[0]), ns.slice(1));
        }
    } else if (row.includes('?')) {
        const total = ns.reduce(sum, 0);
        result += _countWays(row.replace('?', '.'), ns);
        if ((row.match(/#/g) || []).length < total) {
            result += _countWays(row.replace('?', '#'), ns);
        }
    }
    cache.set(key, result);
    return result;
};

const countWays = (s: string): number => {
    const [row, ns] = s.split(' ');
    return _countWays(row, ns.split(',').map(Number));
};

const unfold = (s: string): string => {
    const [row, records] = s.split(' ');
    return [
        [...Array(5)].fill(row).join('?'),
        [...Array(5)].fill(records).join(',')
    ].join(' ');
};

const main = () => {
    const fileContent = fs.readFileSync('./input.txt', 'utf8');
    const lines = fileContent.split('\n');

    console.log('Part 1: ' + lines.map(countWays).reduce(sum, 0),);

    console.log('Part 2: ' + lines.map(unfold).map(countWays).reduce(sum, 0),);
};

main();